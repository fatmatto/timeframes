const { TimeFrame } = require('../../build/main/index.js')
const csv = require('csvtojson')

function getRandomValue (min = 0, max = 100) {
  return Math.random() * (max - min) + min
}

function generateDataset (startTime, endTime, interval = 60 * 1000) {
  const cursor = new Date(startTime)
  const rows = []
  while (cursor.getTime() < endTime.getTime()) {
    const current = getRandomValue() / 100
    const voltage = getRandomValue()
    const power = v * i
    rows.push({ time: cursor.toISOString(), current, power, voltage })
    cursor.setMilliseconds(cursor.getMilliseconds() + interval)
  }
  return rows
}

async function main () {
  const data = await (await csv({ delimiter: ';' })
    .fromFile('./data.csv'))
    .map(row => ({ time: row.time, irradiation: Number(row.irradiation), temperature: Number(row.temperature) }))

  const tf = new TimeFrame(data)
  tf
    .resample(1000 * 60 * 15, { dropNaN: true })
    .map(row => { row.irradiation = row.irradiation / 4000; return row })
    .print()
}

main()