# Main
svnPackage的Chrome extension源码
main author: teal

# Explain
1. 可以直接使用`localStorage`，域为`chrome-extension://extension-id/`
2. update_url应该只是本地开发或是不上传到store时才会用到 [https://developer.chrome.com/extensions/autoupdate](https://developer.chrome.com/extensions/autoupdate)
    `"update_url": "http://192.168.48.109:5200/update.xml"`
