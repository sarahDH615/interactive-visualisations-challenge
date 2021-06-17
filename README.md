## interactive-visualisations-challenge

[![Banner](/images/banner.png)](https://sarahdh615.github.io/interactive-visualisations-challenge/)
<p align='center'><em>Click image to see the website</em></p>

### contains
- index.html: page displaying the interactive content
- static
    - data
        - samples.json: contains source dataset
    - js
        - app.js: JavaScript file containing the functions to apply to the dataset for interactive display

### description

The goal of this project was to create a webpage that displays one user-chosen result from the bellybutton bacteria dataset's metadata and data in several interactive forms. The following steps were taken:

- Loading in the sample data and displaying the IDs in a dropdown
    - create a function, showInfo(), that:
        - using d3.json() to read in the data from samples.json
        - calling the appendDropdown() function on the results from reading the data in to fill up the dropdown
    - calling showInfo()
- Displaying a randomly chosen datapoint's information
    - within showInfo(), using random to pick an index number for feeding into the visualisation functions
    - calling the visualisation functions
- Creating an event listener to respond to user choice of an ID
    - attaching an event listener to the select element holding the dropdown, which is triggered on a change within the select element
    - upon triggering the event, preventing page reload, and feeding the data attached to the chosen ID to the different visualisation functions
- Creating visualisations:
1. Horizontal Bar Chart
    - creating a function, barPrep(), which outputs the data associated with the ten highest OTU IDs
    - feeding that output into another function, horizGraph(), which creates and appends a horizontal bar graph showing the top ten sample values found in the sample

![horizontal bar chart](/images/horizontalBar.png)

2. Bubble Chart
    - creating a function, bubblePrep(), which changes the type of the OTU ID values to numeric, and finds the maximum and minimum values out of those OTU ID values
    - feeding those outputs into another function, bubbleGraph(), which creates and appends a bubble chart, with OTU ID values as x values, and marker colours, and the sample values as y values and the marker sizes 

![Bubble chart](/images/bubble.png)

3. Demographic Information Section
    - creating a function, metadataDisplay(), which removes any preexisting lists, then loops through the metadata key of the chosen sample, and appends each key-value pair

![Demographic info section](/images/demographics.png)

4. Gauge
    - creating a function toRad() that transforms angle measurements into radians
    - creating a function makeGauge(), which:
        - takes the wash frequency (wfreq) from the metadata section of the sample
        - creates a pie chart that only displays the top hemisphere of the 'pie', divided into 9 pieces, labelled 0-9 for the wash frequencies
        - creates a line indicator, with x and y coordinates based on the value of the wash frequency, the radius of the 'pie', and the radians in each segment of the pie

![Gauge](/images/dial.png)

### challenges

One challenge was using functions in combination with each other properly. All of the visualisations on the page depend on the data from samples.json, which is read in in one function, but needs to be accessed in other functions called at different times. The solution was having a function that is called immediately upon page load (showInfo()), and another one that is called upon the event listener trigger, both of which call functions which the data can be fed into. 
<p align='center'>
    <img width= '800' src='/images/showInfo.png' alt='Show Info function'>
    <img width= '800' src='/images/changeHandle.png' alt='Change Handle/Update Code function'>
</p>

The most challenging component of creating the webpage was the needle on the gauge. The solution was found using the formulae sin(theta) = y/radius and cos(theta) = x/radius, found online, and the fact that theta could be made to depend on the wash frequency (the degrees from the x-axis is based on the percent of the semi-circle taken up by the segment, which could be expressed as 180 degrees times wash frequency divided by nine). These formulae allowed for creating a function that would take in the wash frequency for the user's chosen sample, and apply the x and y coordinates of a line over the semi-circle gauge. 
<p align='center'>
    <img width= '800' src='/images/gaugeCode.png' alt='Gauge Needle Code'>
</p>

One final difficulty was the proper use of file paths when deploying to Git Hub Pages. Using the relative paths that pointed to files on the local computer did not take into account the newly added in repository name in the site URL. The file paths thus needed to be updated within index.html and app.js with absolute paths that properly pointed to the appropriate files. 