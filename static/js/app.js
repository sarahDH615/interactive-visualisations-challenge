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

// gauge prep: turning degrees to radians
function toRad(angle) {
    return angle * (Math.PI/180);
}

// washing freq gauge
function makeGauge(wash_val) {
    var trace = {
        type: 'pie',
        showlegend: false,
        hole: 0.4,
        rotation: 90,
        values: [ 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81],
        text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
        direction: 'clockwise',
        textinfo: 'text',
        textposition: 'inside',
        marker: {
          colors: ['','','','','','','','','','white'],
        //   labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
        //   hovermode: false
        }
    }
  
    // needle
    // adjusting wash_val if it is null
    if (wash_val == null) {
        wash_val_for_form = 0;
    } else {wash_val_for_form = wash_val};

    // radius = 0.45 (pie goes from 0.05 - 0.95 at bottom --> d = 0.9 --> r = 0.45)
    var radius = 0.45;
    // wash_val/9 of way of 180 angle of rotation
    var deg = 180 * (wash_val_for_form/9);
    // needs converted to rads for Math.cos/.sin
    var rads = toRad(deg)
    // x = -1 * radius * cos(radians) OR radius * cos(180-radians)
    // y = radius * sin(radians)
    // but this above assumes we are starting at 0, 0
    // we are actually starting at 0.5, 0.5
    // so we need to adjust by 0.5 with each number
    // additionally we need to adjust by a fraction of the radius so the indicator does not go all the way to the edge of the semi-circle
    var x_val = -4/6 * radius * Math.cos(rads) + 0.5;
    var y_val = 4/6 * radius * Math.sin(rads) + 0.5;

    var layout = {
        shapes: [{
          type: 'line',
          x0: 0.5,
          y0: 0.5,
          x1: x_val,
          y1: y_val,
          line: {
            color: 'black',
            width: 3
          }
        }],
        title: 'Bellybutton washes per week',
        xaxis: {visible: false, range: [0, 1]},
        yaxis: {visible: false, range: [0, 1]}
      }
  
    var data = [trace]
      
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
