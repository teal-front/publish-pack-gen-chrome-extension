'use strict';

const URL = 'http://192.168.48.109:5200/'

$('#author').value = localStorage.getItem('author') || '';
function init (firstRepo) {
    // 获得默认版本
    getRevision(firstRepo)
    // 建立WebSocket连接
    setMessage2Background('initilizeWebsocket')
}

// bind event
get(`${URL}get-repo-config`, function(data) {
    var tmpl = $("#repoTpl").innerHTML,
        html = [];
    data.forEach(function(d) {
        var _html = tmpl.replace(/\{name}/g, function(m, m1) {
            return d;
        });
        html.push(_html);
    });
    $('#repos').innerHTML = html.join('');

    if(data.length) {
        init(data[0].name)
    }
})

$('#repos').addEventListener('change', function() {
    getRevision()
}, false)
document.forms['form'].addEventListener('submit', function(e) {
    e.preventDefault();
    getRevision()
})

toArray($$('.js-download')).forEach(function(dom) {
    dom.addEventListener('click', function() {
        var items = $('#form').revision;
        items = (items.length ? toArray(items) : [items]).filter(function(v) {
            return v.checked;
        });

        if (!items.length) {
            return alert('please choose revision.');
        }

        var repo = $('#repos').value,
            revision = items.map(function(v) {
                return v.value;
            });
        var sendData = {
            type: 'download',
            data: {}
        };
        sendData.data.repo = repo;
        sendData.data.revision = revision.join(' ');

        setMessage2Background({downloadData: JSON.stringify(sendData)}, function (response) {
            window.close();
        })
    })
})


/// ------fns
function getRevision(repoName) {
    var params = {
        author: $('#author').value,
        repoName: repoName || $('#repos').value
    }

    localStorage.setItem('author', params.author);

    get(`${URL}get-revision-list`, params, function(data) {
        var html = '',
            tmpl = $("#list").innerHTML;

        if (data.code === 200) {
            if (data.result.length > 0) {
                var template = _.template(tmpl);
                html = template({ data: data.result })
            } else {
                html = $('#listEmpty').innerHTML;
            }
        } else {
            alert(data.result)
        }

        $('#lists').innerHTML = html;
    })
}

function get(url, params, cb) {
    var xhr = new XMLHttpRequest();

    if (typeof params === 'function') {
        cb = params;
        params = {};
    }

    var query = Object.keys(params).map(function(v) {
        return `${v}=${params[v]}`
    }).join('&');

    xhr.onload = function() {
        cb(JSON.parse(this.responseText))
    }
    xhr.open('GET', `${url}?${query}`, true)
    xhr.send()
}

function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

function toArray(arrayLike) {
    return Array.prototype.slice.call(arrayLike);
}

function setMessage2Background (msg, cb) {
    chrome.runtime.sendMessage(msg, function (response) {
        console.log(response)
        cb && cb(response);
    })
}