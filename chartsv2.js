function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array. 
    var samples = data.samples;
    console.log(samples);
    // Create a variable that filters the samples for the object with the desired sample number.
    var sampleFilters = samples.filter(data => data.id == sample);
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metaFilters = metadata.filter(data => data.id == sample);
    // Create a variable that holds the first sample in the array.
    var firstSample = sampleFilters[0];
    console.log(firstSample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var firstMeta = metaFilters[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;

    // 3. Create a variable that holds the washing frequency.
    var washFreq = firstMeta.wfreq;
    // Create the yticks for the bar chart.
    var yticks = otuIds.slice(0,10).map(id => "OTU" + id).reverse();
    console.log(yticks);

    // Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      text: otuLabels.slice(0,10).reverse(),
      type: "bar"
    }];
    // Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures",
     yaxis: yticks
    };

    // Use Plotly to plot the bar data and layout.
    Plotly.newPlot("bar", barData, barLayout, {responsive: true});
    
    // Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Earth"
        }
      }];
    
    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Distribution per Sample",
      xaxis: {
        title: "OTU ID",
        automargin: true
        },
      yaxis: {automargin: true},
        hovermode: "closest"
      };

    // Use Plotly to plot the bubble data and layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, {responsive: true});
   
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: washFreq,
      type: "indicator",
      mode: "gauge+number",
      title: {
        text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"
      },
      gauge: {
        axis: {
          range: [null, 10],
          tickmode: "array",
          tickvals: [0,2,4,6,8,10]
        }
      },
      bar: {color: "black"},
      steps: [
        { range: [0, 2], color: "red" },
        { range: [2, 4], color: "orange" },
        { range: [4, 6], color: "yellow" },
        { range: [6, 8], color: "lime" },
        { range: [8, 10], color: "green" }
      ]
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     autosize: true,
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout, {responsive: true});
  });
}
