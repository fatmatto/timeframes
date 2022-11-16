const { TimeFrame, TimeSerie } = require('../../build/main/index.js')

function getRandomValue (min = 0, max = 100) {
  return Math.random() * (max - min) + min
}

function generateTimeSerie (name, startTime, endTime, interval = 60 * 1000) {
  const cursor = new Date(startTime)
  const rows = []
  while (cursor.getTime() < endTime.getTime()) {
    const value = getRandomValue()
    rows.push([cursor.toISOString(), value])
    cursor.setMilliseconds(cursor.getMilliseconds() + interval)
  }
  return new TimeSerie(name, rows)
}

async function main () {
  const from = new Date('2022-01-01T00:00:00.000Z')
  const to = new Date('2023-01-01T22:00:00.000Z')
  console.time('generateTestData')
  console.log('Generating test data...')
  const columns = [
    generateTimeSerie('voltage1', from, to),
    generateTimeSerie('voltage2', from, to),
    generateTimeSerie('voltage3', from, to),
    generateTimeSerie('current1', from, to),
    generateTimeSerie('current2', from, to),
    generateTimeSerie('current3', from, to)
  ]
  console.timeEnd('generateTestData')
  // Create a TF with 6 columns, one row per minute
  console.time('initTimeFrame')
  console.log('Initializing timeframe...')
  let tf = TimeFrame.fromTimeseries(columns)
  console.timeEnd('initTimeFrame')
  console.log(`Timeframe of shape: ${tf.shape()}`)

  // Resample the dataset, replacing rows with 15 minutes averages
  console.time('resample')
  console.log('Resampling...')
  tf = tf.resample({ size: 1000 * 60 * 15 }, { dropNaN: true }).avg()
  console.timeEnd('resample')

  console.time('aggregate')
  console.log('Aggregating...')
  // Multiply voltages and currents to get power
  tf = tf.aggregate({ output: 'power1', columns: ['voltage1', 'current1'], operation: 'mul' })
    .aggregate({ output: 'power2', columns: ['voltage2', 'current2'], operation: 'mul' })
    .aggregate({ output: 'power3', columns: ['voltage3', 'current3'], operation: 'mul' })

  // Get total power
  tf = tf.aggregate({ output: 'power', columns: ['power1', 'power2', 'power3'], operation: 'sum' })
  console.timeEnd('aggregate')
  // Get energy (since it is quarter/hour power we compute power/4 to find energy)
  const energyTS = tf.column('power').div(4)
  energyTS.name = 'energy'
  tf = tf.addColumn(energyTS)

  const totalEnergy = energyTS.sum()

  console.log('TOTAL ENERGY', totalEnergy)
}

main()
