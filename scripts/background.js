/**
 * api: https://developer.chrome.com/extensions/storage
 * notifications: https://developer.chrome.com/extensions/notifications#method-create
 */
'use strict';

const HTTP_URL = 'http://192.168.48.109:5200',
    WS_URL = 'ws://192.168.48.109:5201'

var ws = new WebSocket(WS_URL, 'echo-protocol');
ws.addEventListener("close", function(event) {
    var code = event.code;
    var reason = event.reason;
    var wasClean = event.wasClean;
    // handle close event

    console.dir(event);
});


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log('onmessage: ', message);

    // todo: 可以把message统一成sting类型，加上namespace
    if (typeof message === 'string') {
        switch (message) {
            case 'initilizeWebsocket':
                getWebsocket();
                break;
            default:
                break;
        }
    } else if (typeof message === 'object') {
        if (message.downloadData) {
            var downloadData = message.downloadData;

            ws.send(downloadData);
            ws.addEventListener('message', function(event) {
                let fullData = JSON.parse(event.data);

                console.dir(fullData);

                if (fullData.type === 'download') {
                    notifi2download(fullData.data.packageName);
                    ws.close();
                }

            })
        }
    }

    // return true to make async invoke,但是消息就没有回调了
    //return true;

});

function getWebsocket() {
    ws = new WebSocket(WS_URL, 'echo-protocol');
}

function notifi2download(packageName) {
    const opt = {
        type: "basic",
        title: "点我下载",
        message: "点我下载",
        iconUrl: "../images/icon48.png",
        buttons: [{
            title: 'Download Here',
        }],
        isClickable: true,
        requireInteraction: true
    }
    const ntfId = 'download' + Date.now();

    chrome.notifications.create(ntfId, opt, function() {
        console.log('create notification ok');
    });
    chrome.notifications.onButtonClicked.addListener(function(id, index) {
        if (id === ntfId && index === 0) {
            chrome.tabs.create({
                url: `${HTTP_URL}/package-export/${packageName}`
            });
            chrome.notifications.clear(ntfId, function(wasCleared) {
                console.log(`notification ${ntfId} clear ${wasCleared ? 'ok' : 'fail'}`);
            })
        }
    })
}