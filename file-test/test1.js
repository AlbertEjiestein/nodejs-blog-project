const fs = require('fs')
const path = require('path')

const filename = path.resolve(__dirname, 'data.txt')

fs.access(filename, err => {
  console.log(`${filename} ${err ? '不存在': '存在'}`)
})
