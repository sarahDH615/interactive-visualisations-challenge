

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
function bubbleGraph(x_values, y_values, text_values, mcolours, c_min, c_max, msizes) {
    var trace1 = {
        x: x_values,
        y: y_values,
        text: text_values,
        mode: 'markers',
        marker: {
          color: mcolours,
        //   colour scheme for bubbles
          colorscale: 'Rainbow',
        // minimum/maximum value's colour
          cmin: c_min,
          cmax: c_max,
          size: msizes,
        //   reducing largest size
          sizeref: 1.5,
        //   increasing min size
          sizemin: 4
        }
    };
      
    var data = [trace1];
    
    var layout = {
        showlegend: false,
        xaxis: {
            title: 'OTU ID'
        }
    };
    
    var config = {responsive: true}

    Plotly.newPlot('bubble', data, layout, config);
}

// metadata display
function metadataDisplay(myArray) {
    d3.selectAll('ul').remove();
    var ul = d3.select('#sample-metadata').append('ul').style('list-style-type', 'none').style('margin', '0').style('padding', '0');
    Object.keys(myArray).forEach(k => {
        var text_append = `${k}: ${myArray[k]}`;
        ul.append('li').text(text_append);
    });
}

// washing freq gauge




// append vals to dropdown funct
function appendDropdown(dataset) {
    select.append('option').text('ID');
    dataset.forEach(function(info) {
        select.append('option').text(info);
    });
};

// appending to dropdown, loading data
function showInfo() {
    d3.json('../../samples.json').then(function(data) {
        samples_data = data;
        console.log('data has loaded');
        // console.log(samples_data);
        var sample_names = samples_data.names;
        console.log(sample_names.length);
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
    var index = ''
    samples.forEach((sample, i) => {
        if (sample.id == chosenID) {
            // console.log(sample);
            // console.log(i);
            index = i;
            // bubble
            // otu_ids will be both x values and colour scale
            var x_bubble = sample.otu_ids.map(id => +id);
            var min_bubble = Math.min(...x_bubble);
            var max_bubble = Math.max(...x_bubble);
            // sample_values are both y values and bubble sizes
            var y_bubble = sample.sample_values;
            var text_bubble = sample.otu_labels;
            // funct takes x_values, y_values, text_values, mcolours, c_min, c_max, msizes
            bubbleGraph(x_bubble, y_bubble, text_bubble, x_bubble, min_bubble, max_bubble, y_bubble);

            // horizontal bar
            var chosen_labels = sample.otu_ids.slice(0, 10).reverse();
            var labels_strings = chosen_labels.map(label => `OTU ${label}`);
            var chosen_hover = sample.otu_labels.slice(0, 10).reverse();
            var chosen_x = sample.sample_values.slice(0, 10).reverse();
            horizGraph(chosen_x, labels_strings, chosen_hover);
        }
    });
    // metadata
    var metadataGroup = samples_data.metadata[index];
    metadataDisplay(metadataGroup);
};
// event handler
select.on('change', changeHandle);
showInfo();
