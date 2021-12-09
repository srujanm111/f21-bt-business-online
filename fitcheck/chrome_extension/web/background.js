const context_menu_id = "fitcheck_add";
const auth_storage_id = "fitcheck_auth";
const img_last_storage_id = "fitcheck_img_last";
const page_last_storage_id = "fitcheck_page_last";

const broadcast = {
    img: new BroadcastChannel('images'),
    auth: new BroadcastChannel('auth'),
};

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: context_menu_id,
        title: 'Add Clothing Item to FitCheck',
        contexts: ["image"]
    });
});

chrome.runtime.onMessage.addListener(data => {
    if (data.type === 'notification') {
        notify(data.message);
    }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (context_menu_id === info.menuItemId) {
        var set_obj = {};
        set_obj[img_last_storage_id] = info.srcUrl;
        set_obj[page_last_storage_id] = info.pageUrl;
        chrome.storage.sync.set(set_obj, () => {
            notify(info.srcUrl);
            broadcast.img.postMessage({
                imageUrl: info.srcUrl,
                pageUrl: info.pageUrl,
            });
        });
    }
});

broadcast.img.onmessage = (e) => {
    var data = null;
    try {
        data = JSON.parse(e.data);
    } catch (e) {
        console.error(e);
        return;
    }
    // console.log(data, data.action == "request", data.value == "latest");
    if (data.action == "request" && data.value == "latest") {
        chrome.storage.sync.get([img_last_storage_id, page_last_storage_id], (result) => {
            console.log(result);
            var img_last_url = "";
            var page_last_url = "";
            if (result.hasOwnProperty(img_last_storage_id) && result.hasOwnProperty(page_last_storage_id)) {
                img_last_url = result[img_last_storage_id];
                page_last_url = result[page_last_storage_id];
            } else return;
            broadcast.img.postMessage({
                imageUrl: img_last_url,
                pageUrl: page_last_url,
            });
        });
    }
};

broadcast.auth.onmessage = (e) => {
    // console.log('Received on channel auth: ', e.data.toString());
    var data = null;
    try {
        data = JSON.parse(e.data);
    } catch (e) {
        console.error(e);
        return;
    }
    if (data.action == "request" && data.value == "token") {
        chrome.storage.sync.get([auth_storage_id], (result) => {
            // console.log(result);
            var value = null;
            if (result.hasOwnProperty(auth_storage_id))
                value = result[auth_storage_id];
            // console.log('auth token saved is ', value);
            broadcast.auth.postMessage(JSON.stringify({
                action: "provide",
                value: value
            }));
        });
    } else if (data.action == "save" && data.hasOwnProperty('value')) {
        var set_obj = {};
        set_obj[auth_storage_id] = data.value;
        // console.log(set_obj);
        chrome.storage.sync.set(set_obj, () => {
            broadcast.auth.postMessage(JSON.stringify({
                action: "notify",
                value: "complete"
            }));
        });
    }
};

const notify = message => {
    return chrome.notifications.create(
        '',
        {
            type: 'basic',
            title: 'Added Item to FitCheck',
            message: 'Open the extension to fill out clothing info!',
            iconUrl: message,
        }
    );
};