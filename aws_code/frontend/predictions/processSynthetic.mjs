import fs from 'node:fs/promises'

async function process() {
  const result = await fs.readFile('./full_data.json', 'utf8')
  const fullData = JSON.parse(result) //Object from file
  //Take 100 off end of target
  const reducedTarget = fullData.target.slice(0, fullData.target.length - 2)

  //Build final object
  fullData.target = reducedTarget
  console.log(fullData)

  //Save to a file
  await fs.writeFile('train_data.json', JSON.stringify(fullData))
}

process()
