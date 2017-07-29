'use strict';

const URL = 'http://192.168.48.109:5200/'

// querySearchWord
/*chrome.runtime.sendMessage('querySearchWord', function(response){
    console.log('get storage author is: ', response);
    
});*/

$('#author').value = localStorage.getItem('author') || '';
document.addEventListener('DOMContentLoaded', function () {
    getRevision()
}, false)

// bind event
get(`${URL}get-repo-config`, function (data) {
	var tmpl = $("#repoTpl").innerHTML, html = [];
	data.forEach(function (d) {
		var _html = tmpl.replace(/\{name}/g, function (m, m1) {
                    return d;
                });
		html.push(_html);
	});
	$('#repos').innerHTML = html.join('');
})

$('#repos').addEventListener('change', function () {
    getRevision()
}, false)
document.forms['form'].addEventListener('submit', function (e) {
    e.preventDefault();
    getRevision()
})

toArray($$('.js-download')).forEach(function (dom) {
    dom.addEventListener('click', function () {
        var items = $('#form').revision;
        items = (items.length ? toArray(items) : [items]).filter(function (v) {
            return v.checked;
        });

        if (!items.length) {
            return alert('please choose revision.');
        }

        var repo = $('#repos').value,
            revision = items.map(function (v) {
                return v.value;
            });
        
        var timer = beginLoading();
        downloadFile(`${URL}down-zip?repo=${repo}&revision=${revision.join(' ')}`, function () {
            stopLoading(timer);
        });
    })
})


// ------fns
function beginLoading () {
    $("#loadingWrap").style.display = 'block';
    $("#mask").style.display = 'block';

    var el = $('#loading'),
        i = 0;
    return window.setInterval(function() {
          i = ++i % 4;
          el.innerHTML = 'Loading' + Array(i + 1).join('.');
    }, 600);
}
function stopLoading (timer) {
    $("#mask").style.display = 'none';
    $("#loadingWrap").style.display = 'none';
    window.clearInterval(timer);
}
// download zip file
function downloadFile (url, cb) {
	chrome.downloads.download({
		method: "GET",
	    url: url,
	    conflictAction: 'uniquify',   // 文件名存在时的处理，为添加新的序号确保唯一
	    saveAs: true     // 打开另存为窗口
	}, cb);
}
function getRevision () {
    var params = {
        author: $('#author').value,
        repoName: $('#repos').value
    }

    localStorage.setItem('author', params.author);
    /*chrome.runtime.sendMessage({searchword: params.author}, function(response){
        console.log(response);
    });*/

    get(`${URL}get-revision-list`, params, function (data) {
        var html = '',
            tmpl = $("#list").innerHTML;

        if (data.log.logentry.length) {
            var template = _.template(tmpl);
            html = template({data: data.log.logentry})
        } else {
            html = $('#listEmpty').innerHTML;
        }

        $('#lists').innerHTML = html;
    })
}

function get (url, params, cb) {
    var xhr = new XMLHttpRequest();

    if (typeof params === 'function') {
    	cb = params;
    	params = {};
    }

    var query = Object.keys(params).map(function (v) {
            return `${v}=${params[v]}`
        }).join('&');

    xhr.onload = function () {
        cb(JSON.parse(this.responseText))
    }
    xhr.open('GET', `${url}?${query}`, true)
    xhr.send()
}

function $ (selector) {
    return document.querySelector(selector);
}

function $$ (selector) {
    return document.querySelectorAll(selector);
}

function toArray (arrayLike) {
    return Array.prototype.slice.call(arrayLike);
}