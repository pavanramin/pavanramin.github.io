let API_key = '';
//If you have an API key, replace star in the following string with your key and uncomment the next line//
//let API_key = '?registrationkey= *'//

// establishing a count for the responses
let count = 0;

//creating map for the various super sectors
    const superSector = {
      '00': 'Total nonfarm',
      '05': 'Total private',
      '06': 'Goods-producing',
      '07': 'Service-producing',
      '08': 'Private service-providing',
      '10': 'Mining and logging',
      '20': 'Construction',
      '30': 'Manufacturing',
      '31': 'Durable Goods',
      '32': 'Nondurable Goods',
      '40': 'Trade, transportation, and utilities',
      '41': 'Wholesale trade',
      '42': 'Retail trade',
      '43': 'Transportation and warehousing',
      '44': 'Utilities',
      '50': 'Information',
      '55': 'Financial activities',
      '60': 'Professional and business services',
      '65': 'Education and health services',
      '70': 'Leisure and hospitality',
      '80': 'Other services',
      '90': 'Government'
    };

//converting super sector map into array
let superSectorKeys = Object.keys(superSector)
console.log(superSectorKeys)

    const labels = [];
//    console.log("labels");
//    console.log(labels);

// These are colors from chart.js utils
// Other color names and codes from https://flaviocopes.com/rgb-color-codes/
// Total of 22 colors
    const CHART_COLORS = {
      red: 'rgb(255, 99, 132)',
      orange: 'rgb(255, 159, 64)',
      yellow: 'rgb(255, 205, 86)',
      green: 'rgb(75, 192, 192)',
      blue: 'rgb(54, 162, 235)',
      purple: 'rgb(153, 102, 255)',
      grey: 'rgb(201, 203, 207)',
      indianred: 'rgb(205, 92, 92)',
      darkorange: 'rgb(255, 140, 0)',
      palegoldenrod: 'rgb(238, 232, 170)',
      lawngreen: 'rgb(124, 252, 0)',
      aqua: 'rgb(0, 255, 255)',
      mediumspringgreen: 'rgb(0, 250, 154)',
      cornflowerblue: 'rgb(100, 149, 237)',
      coral: 'rgb(255, 127, 80)',
      darkblue: 'rgb(0, 0, 139)',
      darkmagenta: 'rgb(139, 0, 139)',
      salmon: 'rgb(250, 128, 114)',
      mediumorchid: 'rgb(186, 85, 211)',
      blanchedalmond: 'rgb(255, 235, 205)',
      deeppink: 'rgb(255, 20, 147)',
      lemonchiffon: 'rgb(255, 250, 205)'
    };
//    console.dir(CHART_COLORS);
//converting chart colors into an array
  let colors = Object.keys(CHART_COLORS);

// same colors in same order from map above
    const CHART_COLORS_50_Percent = {
      red: 'rgba(255, 99, 132, 0.5)',
      orange: 'rgba(255, 159, 64, 0.5)',
      yellow: 'rgba(255, 205, 86, 0.5)',
      green: 'rgba(75, 192, 192, 0.5)',
      blue: 'rgba(54, 162, 235, 0.5)',
      purple: 'rgba(153, 102, 255, 0.5)',
      grey: 'rgba(201, 203, 207, 0.5)',
      indianred: 'rgba(205, 92, 92, 0.5)',
      darkorange: 'rgba(255, 140, 0, 0.5)',
      palegoldenrod: 'rgba(238, 232, 170, 0.5)',
      lawngreen: 'rgbaa(124, 252, 0, 0.5)',
      aqua: 'rgba(0, 255, 255, 0.5)',
      mediumspringgreen: 'rgba(0, 250, 154, 0.5)',
      cornflowerblue: 'rgba(100, 149, 237, 0.5)',
      coral: 'rgba(255, 127, 80, 0.5)',
      darkblue: 'rgba(0, 0, 139, 0.5)',
      darkmagenta: 'rgba(139, 0, 139, 0.5)',
      salmon: 'rgba(250, 128, 114, 0.5)',
      mediumorchid: 'rgba(186, 85, 211, 0.5)',
      blanchedalmond: 'rgba(255, 235, 205, 0.5)',
      deeppink: 'rgba(255, 20, 147, 0.5)',
      lemonchiffon: 'rgba(255, 250, 205, 0.5)'
    };
//    console.log(CHART_COLORS_50_Percent);
//    end utils

    const data = {
      labels: [],
      datasets:[]
    };
  //  console.dir(data);

    const config = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Number of Employees in Thousands'
          }
        }
      }
    };
//    console.log(config);

function drawChart() {
    const myChart = new Chart(
      document.getElementById('myChart'),
        config);
//    console.dir(myChart);
//    console.log("Ending");
}

//declared responseReceivedHandler so the data can be dynamically retrieved and updated on its own upon release of new data
function responseReceivedHandler() {
  if(this.status == 200) {
    console.log(this.response);
    let dataArray = this.response.Results.series[0].data;
    let seriesID = this.response.Results.series[0].seriesID;
    let sectorID = seriesID.substring(3,5);
    let gridline = {
      label: 'Super Sector Name',
      data: [],
      borderColor: CHART_COLORS[colors[count]], //implementing array declared above to automatically pull the 22 chart border colors declared above for their respective super sector
      backgroundColor: CHART_COLORS_50_Percent[colors[count]], //implementing array declared above to automatically pull the 22 chart background colors declared above for their respective super sector
      hidden: true
    }

    for (let i = dataArray.length - 1; i >= 0; i--) {
      gridline.data.push(dataArray[i].value);
      if(count == 0) {
        data.labels.push(dataArray[i].period.substring(1) + '/' + dataArray[i].year);
      }
    }
    gridline.label = superSector[sectorID];

    data.datasets.push(gridline);
    count++;
  } else {
    console.log("error");
  }

  if(count == superSectorKeys.length) {
    drawChart();
  }
}

//Similar to ajax example; start request to pull data/start query here
for(let i = 0; i < superSectorKeys.length; i++) {
  let startQuery = 'https://api.bls.gov/publicAPI/v2/timeseries/data/CEU';
  let endQuery = '00000001' + API_key; //referencing API key declared in line 1 in order to keep my personal API key private
  let xhr = new XMLHttpRequest();
  xhr.addEventListener('load',responseReceivedHandler);
  xhr.responseType = 'json';
  xhr.open('GET', startQuery + superSectorKeys[i] + endQuery);
  xhr.send();
}
