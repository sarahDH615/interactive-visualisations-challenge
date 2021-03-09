// define selection dropdown
var select = d3.select('#selDataset');

// prep for bar chart
function barPrep(chosen_sample) {
    var chosen_labels = chosen_sample.otu_ids.slice(0, 10).reverse();
    var y_values = chosen_labels.map(label => `OTU ${label}`);
    var labels = chosen_sample.otu_labels.slice(0, 10).reverse();
    var x_values = chosen_sample.sample_values.slice(0, 10).reverse();

    return [x_values, y_values, labels];
};

// prep for bubbles
function bubblePrep (chosen_sample) {
    var x_bubble = chosen_sample.otu_ids.map(id => +id);
    var min_bubble = Math.min(...x_bubble);
    var max_bubble = Math.max(...x_bubble);
    var y_bubble = chosen_sample.sample_values;
    var text_bubble = chosen_sample.otu_labels;
    
    return [x_bubble, y_bubble, text_bubble, min_bubble, max_bubble];
};

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
function makeGauge(wash_val) {
    var data = [
        {
          type: "indicator",
          mode: "gauge+number+delta",
          value: wash_val,
          title: { text: "Wash Frequency", font: { size: 24 } },
          delta: { reference: wash_val, increasing: { color: "RebeccaPurple" } },
          gauge: {
            axis: { range: [0, 9], tickwidth: 1, tickcolor: "darkblue" },
            bar: { color: "darkblue" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray"
          }
        }
      ];
      
      var layout = {
        width: 500,
        height: 400,
        margin: { t: 25, r: 25, l: 25, b: 25 },
        paper_bgcolor: "lavender",
        font: { color: "darkblue", family: "Arial" }
      };
      
      Plotly.newPlot('gauge', data, layout);
}



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
        
        // filling in dropdown info
        var sample_names = samples_data.names;
        appendDropdown(sample_names);

        // choosing an ID at random
        var random_range = sample_names.length;
        var randomID = Math.floor(Math.random() * (random_range));

        // applying to metadata
        var metadataGroup = samples_data.metadata[randomID];
        metadataDisplay(metadataGroup);

        // making gauge
        var sample_wash = metadataGroup.wfreq;
        makeGauge(sample_wash);

        // applying to bar graph
        var randomSubject = samples_data.samples[randomID]
        const [x_values, y_values, labels] = barPrep(randomSubject);
        horizGraph(x_values, y_values, labels);

        // applying to bubble
        const [x_bubble, y_bubble, text_bubble, min_bubble, max_bubble] = bubblePrep(randomSubject);
        bubbleGraph(x_bubble, y_bubble, text_bubble, x_bubble, min_bubble, max_bubble, y_bubble);
    });    
}
// event handler funct
function changeHandle() {
    // prevent page reload
    event.preventDefault()
    var chosenID = this.value
    var samples = samples_data.samples;
    var index = ''
    samples.forEach((sample, i) => {
        if (sample.id == chosenID) {
            index = i;
            // bubble
            const [x_bubble, y_bubble, text_bubble, min_bubble, max_bubble] = bubblePrep(sample);
            // funct takes x_values, y_values, text_values, mcolours, c_min, c_max, msizes
            bubbleGraph(x_bubble, y_bubble, text_bubble, x_bubble, min_bubble, max_bubble, y_bubble);

            // horizontal bar
            const [x_values, y_values, labels] = barPrep(sample);
            horizGraph(x_values, y_values, labels);
        }
    });
    // metadata
    var metadataGroup = samples_data.metadata[index];
    metadataDisplay(metadataGroup);

    // gauge
    var wash_freq = metadataGroup.wfreq;
    makeGauge(wash_freq);
};
// event handler
select.on('change', changeHandle);
showInfo();
