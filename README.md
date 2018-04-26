# Main
与`publish-pack-gen-nodejs`(`server-side project`)配套使用的`Chrome extension`源码

main author: teal

此分支对应的是gitPackage

# Explain
1. 可以直接使用`localStorage`，域为`chrome-extension://extension-id/`
2. update_url应该只是本地开发或是不上传到store时才会用到 [https://developer.chrome.com/extensions/autoupdate](https://developer.chrome.com/extensions/autoupdate)
    `"update_url": "http://hostname/update.xml"`
