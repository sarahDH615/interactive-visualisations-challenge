// initial function to load page data

// event listener - calls funct updatePlotly

// function updatePlotly




// function horizGraph() {
//     var data = [{
//         type: 'bar',
//         x: [20, 14, 23],
//         y: ['giraffes', 'orangutans', 'monkeys'],
//         orientation: 'h'
//       }];
      
//     Plotly.newPlot('myDiv', data);
// }
var select = d3.select('#selDataset');
function showInfo() {
    d3.json('../../samples.json').then(function(data) {
        samples_data = data;
        console.log('data has loaded');
        
        var sample_names = samples_data.names;
    
        sample_names.forEach(function(name) {
            select.append('option').text(name);
        });
    });    
}
function changeHandle() {
    // preveent page reload
    event.preventDefault()
    console.log(this.value);
}
select.on('change', changeHandle);
showInfo();
