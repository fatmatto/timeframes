const fs = require('fs')
const path = require('path')
const doc = require('../docs/output.json')

const TimeFrame = doc.children.find(c => c.name === 'lib/timeframe').children[0]
const TimeSerie = doc.children.find(c => c.name === 'lib/timeserie').children[0]

function getClassDocumentation (TimeFrame) {
  const methods = TimeFrame.children
    .filter(child => child.kindString === 'Method' || child.kindString === 'Constructor')
    .filter(child => child?.flags?.isPrivate !== true)

  const content = []
  methods.forEach(method => {
    const m = method.signatures[0]
    content.push(`### ${m.name}`)
    content.push(m?.comment?.shortText || 'MISSING METHOD DESCRIPTION')
    let outputString = ': void'
    if (m.type) {
      outputString = `: ${m.type.name}`
    }
    let parametersString = ''
    if (m.parameters) {
      parametersString = m.parameters.map(p => `${p.name}: ${p.type.name}`).join(',')
    }

    content.push(`\`\`\`typescript
${m.name}(${parametersString}) ${outputString}
\`\`\``)
  })

  return content.join('\n\n')
}

fs.writeFileSync(path.join('docs', 'timeframe.md'), getClassDocumentation(TimeFrame))
fs.writeFileSync(path.join('docs', 'timeserie.md'), getClassDocumentation(TimeSerie))

console.log('Documentation was written to destination')
