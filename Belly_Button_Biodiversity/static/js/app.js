function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  console.log("buildMetadata-" + sample);

  // Use `d3.json` to fetch the metadata for a sample
  var url = "/metadata/" + sample;
  console.log("url - " + url);

  // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(url).then( (data) => {
      console.log("URL Called, returned data: " + data);
      var metadata_div_tag = d3.select("#sample-metadata");
     // Use `.html("") to clear any existing metadata
      metadata_div_tag.html("") 

      // var metadata_text = ""
      // for .... data.entries()
      // {
      //   metadata_text = metadata_text + key + ": " + value + "\n"
      // }
      
      var metadata_text = "AGE: " + data["AGE"] + "<br>" + 
                          "BBTYPE: " + data["BBTYPE"] + "<br>" +
                          "ETHNICITY: " + data["ETHNICITY"] + "<br>" +
                          "GENDER: " + data["GENDER"] + "<br>" +
                          "LOCATION:<br>" +  data["LOCATION"] + "<br>" +
                          "WFREQ:" + data["WFREQ"] + "<br>" +
                          "sample:" + data["sample"];

      console.log("metadata_text:"+ metadata_text);

      metadata_div_tag.html(metadata_text);
    });   

  

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

// function init_pie_chart(firstSample) {
//   // @TODO: Build a Bubble Chart using the sample data
//     var firstdata = [{  
//       labels: [otu_ids],
//       values: [sample_values],
//       type: "pie"
//     }];
//     var layout = {
//     title :"Pie chart for Bellybutton", 
//     height:600,
//     width:800,
//   }; 
//   Plotly.plot("pie", firstdata, layout);

//   };

function init() {

  // Show dummy initial pie chart
  initialize_pie_chart();
  initialize_bubble_chart();
  
  // Use the list of sample names to populate the select options
  initialize_samples_dropdown(); 
}

function initialize_samples_dropdown () {

  // Grab a reference to the dropdown select element
  console.log("get selector");
  var selector = d3.select("#selDataset");
  
  console.log ("calling /names API")
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      //console.log("add option " + sample);
      selector.append("option").text(sample).property("value", sample);
    });
    console.log("finished adding options");

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    console.log("firstSample = " + firstSample);

    buildCharts(firstSample);
    buildMetadata(firstSample); 
    console.log("buildMetadata end");
  });
}

function buildCharts(sampleName) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  console.log("buildCharts" + sampleName);

  var url = "/samples/"+ sampleName;
  console.log("url - " + url);
  d3.json(url).then( (data) => {
    update_pie_chart(data); 
    update_bubble_chart(data)
  });

  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).
  console.log("buildCharts-end");
}

function update_pie_chart(data) {
  console.log("update_pie_chart - begin");
  
  var otu_ids = data['otu_ids'];
  var sample_values = data ['sample_values'];
  var otu_labels = data['otu_labels'];

  // console.log("otu_ids" + otu_ids );
  // console.log("sample_values" +sample_values);
  // console.log("otu_labels" + otu_labels);

  Plotly.restyle("pie", "values", [sample_values]);
  Plotly.restyle("pie", "labels", [otu_ids]);
  console.log("update_pie_chart - end");

}  


function update_bubble_chart(data){
  console.log("update_bubble_chart - begin");

  var otu_ids = data['otu_ids'];
  var sample_values = data ['sample_values'];
  var otu_labels = data['otu_labels'];

  Plotly.restyle("bubble", "y", [sample_values]);
  Plotly.restyle("bubble", "x", [otu_ids]);
  console.log("update_pie_chart - end");

  var trace1 = {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: 'markers',
    marker: {
      color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)', 'rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)', 'rgb(93, 164, 214)', 'rgb(255, 144, 14)'],
      size: sample_values
    }
  };
  var bubble_data = [trace1];
  var layout = {
    title: 'Bubble Chart Hover Text',
    showlegend: false,
    // height: 600,
    // width: 2500
  };

  console.log("layout:" + layout);
  Plotly.newPlot('bubble', bubble_data, layout, {responsive: true});
  console.log("Plotly after bubble chart:" + Plotly);
}

function initialize_pie_chart() {
  console.log("Init pie chart");
  var firstdata = [{
    labels: ["A", "B", "C"],
    values: [1, 2, 3],
    type: "pie",
    hoverinfo: 'labels+values'
  }];
  var layout = {
    title: "Pie chart for Bellybutton",
    height: 600,
    width: 800,
  };
  Plotly.plot("pie", firstdata, layout);
}

// @TODO: Build a Bubble Chart using the sample data
function initialize_bubble_chart(){
  var trace1 = {
    x: [1,2,3],
    y: [100,200,300],
    text: ['A<br>size: 40', 'B<br>size: 60', 'C<br>size: 80'],
    mode: 'markers',
    marker: {
      color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)', 'rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)', 'rgb(93, 164, 214)', 'rgb(255, 144, 14)'],
      size: [20,40,60]
    }
  };
  console.log("trace1:" + trace1);
  var data = [trace1];

  var layout = {
    title: 'Bubble Chart Hover Text',
    showlegend: false,
    // height: 600,
    // width: 2500
  };

  console.log("layout:" + layout);

  Plotly.newPlot('bubble', data, layout, {responsive: true});

  console.log("Plotly after bubble chart:" + Plotly);
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

console.log("after init");

//////////////////////////////////////////////////////////////////

// @TODO: Build a Bubble Chart using the sample data
// var trace1 = {
//   x: [1, 2, 3, 4],
//   y: [10, 11, 12, 13],
//   text: ['A<br>size: 40', 'B<br>size: 60', 'C<br>size: 80', 'D<br>size: 100'],
//   mode: 'markers',
//   marker: {
//     color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
//     size: [40, 60, 80, 100]
//   }
// };
// console.log("trace1:" + trace1);
// var data = [trace1];

// var layout = {
//   title: 'Bubble Chart Hover Text',
//   showlegend: false,
//   height: 600,
//   width: 600
// };

// console.log("layout:" + layout);

// Plotly.newPlot('bubble', data, layout);

// console.log("Plotly after bubble chart:" + Plotly);



//////////////////////////////////////////////////////////////////


