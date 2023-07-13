const fs = require('fs')
const path = require('path')
const doc = require('../docs/output.json')

const TimeFrame = doc.children.find(c => c.name === 'timeframe').children[0]
const TimeSerie = doc.children.find(c => c.name === 'timeserie').children[0]
//const IO = doc.children.find(c => c.name === 'io').children

function renderMethod(method) {
  const content = []
  const m = method.signatures[0]
  content.push(`### ${m.name}`)
  content.push(m?.comment?.shortText || 'MISSING METHOD DESCRIPTION')
  let outputString = ': void'
  if (m?.type?.name) {
    outputString = `: ${m.type.name}`
  } else if (m.type.type === 'array') {
    outputString = `: ${m.type.elementType.name}[]`
  } else {
    console.warn("The following output type cannot be rendered correctly", m)
  }
  let parametersString = ''
  if (m.parameters) {
    parametersString = m.parameters.map(p => {
      if (p.name && p.type?.name) {
        return `${p.name}: ${p.type.name}`
      } else if (p.type.type === 'array') {
        return `${p.type.elementType.name}[]`
      } else if (p.type.type === 'union') {
        return p.type.types.map(t => `${t.name}`).join(" | ")
      } else {
        console.warn("The following parameter cannot be rendered correctly", p)
      }
    }).join(',')
  }

  content.push(`\`\`\`typescript
${m.name}(${parametersString}) ${outputString}
\`\`\``)
  return content
}

function getClassDocumentation(TimeFrame) {
  const methods = TimeFrame.children
    .filter(child => child.kindString === 'Method' || child.kindString === 'Constructor')
    .filter(child => child?.flags?.isPrivate !== true)

  const content = []
  content.push(...methods.flatMap(renderMethod))


  return content.join('\n\n')
}

function getFunctionsGroupDocumentation(functions) {
  const content = []
  content.push(...functions.flatMap(renderMethod))


  return content.join('\n\n')
}

fs.writeFileSync(path.join('docs', 'timeframe.md'), getClassDocumentation(TimeFrame))
fs.writeFileSync(path.join('docs', 'timeserie.md'), getClassDocumentation(TimeSerie))
// fs.writeFileSync(path.join('docs', 'io.md'), getFunctionsGroupDocumentation(IO))

console.log('Documentation was written to destination')
