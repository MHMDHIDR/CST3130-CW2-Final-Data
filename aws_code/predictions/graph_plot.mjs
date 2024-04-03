//Axios will handle HTTP requests to web service
import axios from 'axios'
import Plotly from 'plotly'
import fs from 'fs'

//The ID of the student whose data you want to plot
let studentID = 'M00970572'

//URL where student data is available
let url = 'https://y2gtfx0jg3.execute-api.us-east-1.amazonaws.com/prod/'

//Authentication details for Plotly
//ADD YOUR OWN AUTHENTICATION DETAILS
const PLOTLY_USERNAME = 'mhmdhidr'
const PLOTLY_KEY = 'VlsVgfCQar9WCIXmqt9u'

//Initialize Plotly with user details.
let plotly = Plotly(PLOTLY_USERNAME, PLOTLY_KEY)

async function handler(event) {
  try {
    //Get synthetic data
    let yValues = (await axios.get(url + studentID)).data.target

    //Add basic X values for plot
    let xValues = []
    for (let i = 0; i < yValues.length; ++i) {
      xValues.push(i)
    }

    //Call function to plot data
    let plotResult = await plotData(studentID, xValues, yValues)
    console.log("Plot for student '" + studentID + "' available at: " + plotResult.url)

    return {
      statusCode: 200,
      body: 'Ok'
    }
  } catch (err) {
    console.log('ERROR: ' + JSON.stringify(err))
    return {
      statusCode: 500,
      body: 'Error plotting data for student ID: ' + studentID
    }
  }
}

//Plots the specified data
async function plotData(studentID, xValues, yValues) {
  //Data structure
  let studentData = {
    x: xValues,
    y: yValues,
    type: 'scatter',
    mode: 'line',
    name: 'Original',
    marker: {
      color: 'rgb(219, 64, 82)',
      size: 12
    }
  }
  // get the data from the file
  let predictedData = JSON.parse(fs.readFileSync('synthetic_predictions.json'))
    .predictions[0]
  let meanData = {
    x: [],
    y: predictedData.mean,
    type: 'scatter',
    mode: 'line',
    name: 'Mean',
    marker: {
      color: 'green',
      size: 12
    }
  }
  let quantiles01Data = {
    x: [],
    y: predictedData.quantiles['0.1'],
    type: 'scatter',
    mode: 'line',
    name: 'Quantiles 0.1',
    marker: {
      color: 'orange',
      size: 12
    }
  }
  let quantiles09Data = {
    x: [],
    y: predictedData.quantiles['0.9'],
    type: 'scatter',
    mode: 'line',
    name: 'Quantiles 0.9',
    marker: {
      color: 'blue',
      size: 12
    }
  }

  for (let i = xValues.length; i <= xValues.length + predictedData.mean.length; ++i) {
    meanData.x.push(i)
    quantiles01Data.x.push(i)
    quantiles09Data.x.push(i)
  }
  let data = [studentData, meanData, quantiles01Data, quantiles09Data]

  //Layout of graph
  let layout = {
    title: 'Synthetic Data for Student ' + studentID,
    font: {
      size: 25
    },
    xaxis: {
      title: 'Time (hours)'
    },
    yaxis: {
      title: 'Value'
    }
  }
  let graphOptions = {
    layout: layout,
    filename: 'date-axes',
    fileopt: 'overwrite'
  }

  //Wrap Plotly callback in a promise
  return new Promise((resolve, reject) => {
    plotly.plot(data, graphOptions, function (err, msg) {
      if (err) reject(err)
      else {
        resolve(msg)
      }
    })
  })
}

handler()
