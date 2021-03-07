

// define selection dropdown
var select = d3.select('#selDataset');


// horizontal bar chart funct
function horizGraph(x_values, y_values, labels) {
    var data = [{
        type: 'bar',
        x: x_values,
        y: y_values,
        orientation: 'h',
        mode: 'markers',
        marker: {size:16},
        text: labels
      }]; 
    Plotly.newPlot('bar', data);
};

// bubble chart funct


// metadata display


// washing freq gauge




// append vals to dropdown funct
function appendDropdown(dataset) {
    dataset.forEach(function(info) {
        select.append('option').text(info);
    });
};

// appending to dropdown, loading data
function showInfo() {
    d3.json('../../samples.json').then(function(data) {
        samples_data = data;
        console.log('data has loaded');
        
        var sample_names = samples_data.names;
    
        appendDropdown(sample_names)
    });    
}
// event handler funct
function changeHandle() {
    // prevent page reload
    event.preventDefault()
    var chosenID = this.value
    console.log(chosenID);
    var samples = samples_data.samples;
    samples.forEach((sample) => {
        if (sample.id == chosenID) {
            var chosen_labels = sample.otu_ids.slice(0, 10).reverse();
            var labels_strings = chosen_labels.map(label => `OTU ${label}`);
            var chosen_hover = sample.otu_labels.slice(0, 10).reverse();
            var chosen_x = sample.sample_values.slice(0, 10).reverse();
            horizGraph(chosen_x, labels_strings, chosen_hover);
        }
    });
};
// event handler
select.on('change', changeHandle);
showInfo();
