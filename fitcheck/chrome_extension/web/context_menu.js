chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'add',
        title: 'Add Clothing Item to FitCheck',
        contexts: ["image"]
    });
});

chrome.runtime.onMessage.addListener( data => {
    if ( data.type === 'notification' ) {
        notify( data.message );
    }
});

chrome.contextMenus.onClicked.addListener( ( info, tab ) => {
    if ( 'add' === info.menuItemId ) {
        notify( info.srcUrl );
        const broadcast = new BroadcastChannel('images');
        broadcast.postMessage(info.srcUrl);
    }
} );

const notify = message => {

    chrome.storage.local.get( ['notifyCount'], data => {
        let value = data.notifyCount || 0;
        chrome.storage.local.set({ 'notifyCount': Number( value ) + 1 });
    } );

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