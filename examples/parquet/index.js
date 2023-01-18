const { TimeFrame, fromParquet } = require('../../build/main/index.js')
const fs = require('fs')

const tf = fromParquet(fs.readFileSync('./test-data.parquet'))

tf.print()