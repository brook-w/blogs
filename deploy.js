const OSS = require('ali-oss')
const path = require('path')
const fs = require('fs')

let client = new OSS({
    accessKeyId: 'LTAI4Foxoo3xpp2ZfFkM7HU3', // access secret you create
    accessKeySecret: '94kOlnrEQAy9EEpnalf75xNh2NZopF', // access secret you create
    endpoint: 'https://oss-cn-chegndu.aliyuncs.com',
    bucket: 'brook-w-blogs'
})

function fileDisplay(filePath) {
    // 根据文件路径读取文件，返回文件列表
    fs.readdir(filePath, function (err, files) {
        if (err) {
            console.warn(err, '读取文件夹错误！')
        } else {
            files.forEach(function (filename) {
                let filedir = path.join(filePath, filename)
                fs.stat(filedir, function (eror, stats) {
                    if (eror) {
                        console.warn('获取文件stats失败')
                    } else {
                        let isFile = stats.isFile() // 是文件
                        let isDir = stats.isDirectory() // 是文件夹
                        if (isFile) {
                            const tmpPath = filedir.replace(path.join(__dirname, 'dist'), '')
                            console.log('tmpPath', tmpPath.replace('\\', '/'))
                            let osPath = String(filedir.replace(path.join(__dirname, 'dist'), '')).replace(/\\/g, '/')
                            client.put(`{osPath}`, filedir).then()
                        }
                        if (isDir) {
                            fileDisplay(filedir)
                        }
                    }
                })
            })
        }
    })
}

async function put() {
    fileDisplay(path.resolve(__dirname, 'dist'))
}

put()
