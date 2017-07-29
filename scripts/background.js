/**
 * api: https://developer.chrome.com/extensions/storage
 */
'use strict';

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	console.log('onmessage: ', message);

    if(message.searchword){
        chrome.storage.local.set(message, function(result){
		    console.log('saved searchword is: ', result);
		    sendResponse('ok');
		});
		return true;
    } else if (message === 'querySearchWord') {
    	chrome.storage.local.get('searchword', function (data) {
			console.log('get searchword is: ', data.searchword);
			sendResponse(data.searchword);
		});
		// return true to make `sendResponse` to async invoke
		return true;
    }
});