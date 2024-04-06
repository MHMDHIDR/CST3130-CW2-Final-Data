import fs from 'node:fs/promises'

async function process() {
  try {
    const result = await fs.readFile('./numerical_data_USD.json', 'utf8')
    const fullData = JSON.parse(result) // Object from file

    // Only keep the last 100 values
    const reducedTarget = fullData.target.slice(0, -100)

    // Build final object
    fullData.target = reducedTarget
    console.log(fullData)

    // Save to a file
    await fs.writeFile('train_numerical_data_USD.json', JSON.stringify(fullData))
    console.log('Processed data saved to train_data.json')
  } catch (error) {
    console.error('Error processing data:', error)
  }
}

process()
