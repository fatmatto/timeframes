const { TimeFrame } = require('../../build/main/index.js')
const csv = require('csvtojson')


async function main() {
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
