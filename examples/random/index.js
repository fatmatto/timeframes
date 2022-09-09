const { TimeFrame } = require('../../build/main/index.js')

function getRandomValue (min = 0, max = 100) {
  return Math.random() * (max - min) + min
}

function generateDataset (startTime, endTime, interval = 60 * 1000) {
  const cursor = new Date(startTime)
  const rows = []
  while (cursor.getTime() < endTime.getTime()) {
    const current = getRandomValue() / 100
    const voltage = getRandomValue()
    const power = voltage * current
    rows.push({ time: cursor.toISOString(), current, power, voltage })
    cursor.setMilliseconds(cursor.getMilliseconds() + interval)
  }
  return rows
}

async function main () {
  const data = generateDataset(new Date(2022, 01, 01), new Date(2022, 01, 5))

  console.time('tf')
  const tf = new TimeFrame(data)
  console.timeEnd('tf')
  // tf.print()
  console.time('resample')
  tf.resample(1000 * 60 * 15, { dropNaN: true }).map(row => { row.power = row.power / 1000; return row }).print()
  console.timeEnd('resample')
}

main()
