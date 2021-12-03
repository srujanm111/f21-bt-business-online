const broadcast = new BroadcastChannel('images');

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'add',
        title: 'Add Clothing Item to FitCheck',
        contexts: ["image"]
    });
});

chrome.runtime.onMessage.addListener( data => {
    if ( data.type === 'notification' ) {
        notify(data.message);
    }
});

chrome.contextMenus.onClicked.addListener( ( info, tab ) => {
    if ( 'add' === info.menuItemId ) {
        notify(info.srcUrl);
        broadcast.postMessage({
            imageUrl: info.srcUrl,
            pageUrl: info.pageUrl,
        });
    }
} );

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