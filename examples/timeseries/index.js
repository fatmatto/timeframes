const { TimeFrame, TimeSerie } = require('../../build/main/index.js')

function getRandomValue (min = 0, max = 100) {
  return Math.random() * (max - min) + min
}

function generateTimeserie (startTime, endTime, interval = 60 * 1000) {
  const cursor = new Date(startTime)
  const rows = []
  while (cursor.getTime() < endTime.getTime()) {
    const v = getRandomValue()
    const t = cursor.toISOString()
    rows.push([t, v])
    cursor.setMilliseconds(cursor.getMilliseconds() + interval)
  }
  return rows
}

async function main () {
  const start = new Date(2022, 1, 1)
  const end = new Date(2022, 1, 7)
  const ts1 = new TimeSerie('temperature', generateTimeserie(start, end, 1000 * 60 * 60), { deviceId: 'sensor1' })
  const ts2 = new TimeSerie('humidity', generateTimeserie(start, end, 1000 * 60 * 60), { deviceId: 'sensor1' })

  const tf = TimeFrame.fromTimeseries([ts1, ts2])

  tf.apply((ts) => (ts.round(2)))
    .print()

  tf.columnNames.map((name) => {
    const col = tf.column(name)

    console.log(col.avg())
  })
}

main()
