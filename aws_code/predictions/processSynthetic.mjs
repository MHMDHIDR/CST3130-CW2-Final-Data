import fs from 'node:fs/promises'

async function process() {
  try {
    const result = await fs.readFile('./full_data.json', 'utf8')
    const fullData = JSON.parse(result) // Object from file

    // Take 100 off end of target
    const reducedTarget = fullData.target.slice(0, -100)

    // Build final object
    fullData.target = reducedTarget
    console.log(fullData)

    // Save to a file
    await fs.writeFile('train_data.json', JSON.stringify(fullData))
    console.log('Processed data saved to train_data.json')
  } catch (error) {
    console.error('Error processing data:', error)
  }
}

process()
