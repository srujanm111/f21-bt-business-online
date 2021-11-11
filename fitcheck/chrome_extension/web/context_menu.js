chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'add',
        title: 'Add Clothing Item to FitCheck',
        contexts: ["image"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if ('add' === info.menuItemId) {
        
    }
});
