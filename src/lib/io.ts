import { TimeFrame } from "./timeframe"

import { Table, tableFromArrays, tableFromIPC, tableToIPC } from 'apache-arrow'
import {
  readParquet,
  writeParquet,
  Compression,
  WriterPropertiesBuilder
} from 'parquet-wasm/node/arrow1'

interface ToArrowOptions {
  columnsKind: 'f32' | 'f64'
}
interface ToParquetOptions {
  columnsKind: 'f32' | 'f64'
}

/**
 * Returns a new TimeFrame from an arrow dataset
 * @param data Data in Arrow table format
 */
export function fromArrow(data: Table): TimeFrame {
  return new TimeFrame({ data: data.toArray() })
}


/**
 * Converts a TimeFrame to Arrow data format
 * @param tf The timeframe to convert
 */
export function toArrow(tf: TimeFrame, options: ToArrowOptions = { columnsKind: 'f64' }): Table {
  const columns = { time: null }
  const rows = tf.rows()

  rows.forEach(row => {
    for (const colName in row) {
      columns[colName] = columns[colName] || []
      columns[colName].push(row[colName])
    }
  })

  columns.time = Array.from(
    { length: columns.time.length },
    (_, i) => {
      return new Date(columns.time[i]).getTime()
    }
  )



  for (const colName in columns) {
    if (colName === 'time') { continue }
    if (options.columnsKind === 'f64') {
      columns[colName] = Float64Array.from(
        { length: columns[colName].length },
        (_, i) => {
          return columns[colName][i]
        })
    } else if (options.columnsKind === 'f32') {
      columns[colName] = Float32Array.from(
        { length: columns[colName].length },
        (_, i) => {
          return columns[colName][i]
        })
    }

  }

  return tableFromArrays(columns)
}

/**
 * Returns a new TimeFrame from a Parquet dataset
 * @param buffer Parquet buffer
 */
export function fromParquet(buffer: Buffer): TimeFrame {
  return new TimeFrame({ data: tableFromIPC(readParquet(buffer)).toArray() })
}


/**
 * Converts a TimeFrame to Parquet data format
 * @param tf 
 */
export function toParquet(tf: TimeFrame, options: ToParquetOptions = { columnsKind: 'f64' }): Buffer {
  const writerProperties = new WriterPropertiesBuilder()
    .setCompression(Compression.ZSTD)
    .build()
  return Buffer.from(writeParquet(
    tableToIPC(toArrow(tf, { columnsKind: options.columnsKind }), 'stream'),
    writerProperties
  ))
}