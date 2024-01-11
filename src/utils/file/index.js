import SparkMD5 from 'spark-md5'

const chunkSize = 10 * 1024 * 1024

/**
 * 计算文件的md5值
 */
async function fileToMd5(file) {
    // 如果文件大小没超过10M则直接计算md5值，否则分块计算md5值。
    if (file.size <= chunkSize) {
        return await smallFileToMd5(file)
    } else {
        return await bigFileToMd5(file)
    }
}

async function smallFileToMd5(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onload = () => {
            const spark = new SparkMD5.ArrayBuffer()
            spark.append(reader.result)
            resolve(spark.end())
        }
        reader.onerror = function (err) {
            reject(err)
        }
    })
}

async function bigFileToMd5(file) {
    return new Promise((resolve, reject) => {
        const chunkCount = Math.ceil(file.size / chunkSize)
        let currentChunk = 0

        const spark = new SparkMD5.ArrayBuffer()
        const fileReader = new FileReader()
        fileReader.onload = event => {
            spark.append(event.target.result)
            currentChunk++
            if (currentChunk < chunkCount) {
                loadNext()
            } else {
                resolve(spark.end())
            }
        }
        fileReader.onerror = () => {
            reject('oops, something went wrong.')
        }

        function loadNext() {
            const start = currentChunk * chunkSize
            const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize
            fileReader.readAsArrayBuffer(file.slice(start, end))
        }

        loadNext()
    })
}

function formatSize(size) {
    if (!size) {
        return
    }

    if (size < 1024) {
        return size + 'B'
    } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + 'KB'
    } else if (size < 1024 * 1024 * 1024) {
        return (size / 1024 / 1024).toFixed(2) + 'MB'
    } else {
        return (size / 1024 / 1024 / 1024).toFixed(2) + 'GB'
    }
}

export {
    fileToMd5,
    formatSize
}