// Creating function for Data plotting (Bar, gauge, bubble)
function getPlot(id) {
  // getting data from the json file
  d3.json("data/samples.json").then((data)=> {
    console.log(data)

    var wfreq = data.metadata.map(d => d.wfreq)
    console.log(`Washing Freq: ${wfreq}`)
        
      // filter sample values by id 
    var samples = data.samples.filter(s => s.id.toString() === id)[0];
        
    console.log(samples);
  
    // Getting the top 10 
    var samplevalues = samples.sample_values.slice(0, 10).reverse();
  
    // get only top 10 otu ids for the plot OTU and reversing it. 
    var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
    
    // get the otu id's to the desired form for the plot
    var OTU_id = OTU_top.map(d => "OTU " + d)
  
  
    // get the top 10 labels for the plot
    var labels = samples.otu_labels.slice(0, 10);
  
    //   console.log(`Sample Values: ${samplevalues}`)
    //   console.log(`Id Values: ${OTU_top}`)
    // create trace variable for the plot
    var trace = {
        x: samplevalues,
        y: OTU_id,
        text: labels,
        marker: {
          color: '#005a99'},
          type:"bar",
          orientation: "h",
    };
  
    // create data variable
    var data = [trace];
  
    // create layout variable to set plots layout
    var layout = {
      font:{family:"Arial Rounded MT Bold"},
      title: "Top 10 OTU",
      yaxis:{
          tickmode:"linear",
      },
      margin: {
          l: 100,
          r: 50,
          t: 100,
          b: 30
      }
    };
    // create the bar plot
    Plotly.newPlot("bar", data, layout);


    // The bubble chart
    var trace1 = {
        x: samples.otu_ids,
        y: samples.sample_values,
        mode: "markers",
        marker: {
          color: samples.otu_ids,
          size: samples.sample_values
        },
        text: samples.otu_labels
    };
  
    // set the layout for the bubble plot
    var layout_b = {
      font:{family:"Arial Rounded MT Bold"},
      xaxis:{
        title: "<b>OTU ID</b>",
      },
      showlegend: false
    };
  
    // creating data variable 
    var data1 = [trace1];
  
    // create the bubble plot
    Plotly.newPlot("bubble", data1, layout_b); 


  })
};

function buildGauge(id) {
  d3.json("data/samples.json").then((data)=> {
    console.log(data)

    var wfreq = data.metadata.map(d => d.wfreq)
    console.log(`Washing Freq: ${wfreq}`)
    
  // Enter the Washing Frequency Between 0 and 180
  var level = parseFloat(id) * 20;

  // Trigonometry to Calculate Meter Point
  var degrees = 180 - level;
  var radius = 0.5; 
  var radians = (degrees * Math.PI) / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path May Have to Change to Create a Better Triangle
  var mainPath = "M -.02 -0.02 L .02 0.02 L ";
  var pathX = String(x);
  var space = " ";
  var pathY = String(y);
  var pathEnd = " Z";
  var path = mainPath.concat(pathX, space, pathY, pathEnd);
  console.log(path);
  var data_g = [
    {
      type: "scatter",
      x:[0],
      y:[0],
      marker: { size: 24, color: "850000" },
      showlegend: false,
      text: level,
      hoverinfo: "text+name"
    },
    {
      values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
      rotation: 90,
      text:["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      textinfo: "text",
      textposition: "inside",
      marker: {
        colors: [
          "rgba(0,105,11,.5)",
          "rgba(10,120,22,.5)",
          "rgba(14,127,0,.5)",
          "rgba(110,154,22,.5)",
          "rgba(170,202,42,.5)",
          "rgba(202,209,95,.5)",
          "rgba(210,206,145,.5)",
          "rgba(232,226,202,.5)",
          "rgba(240, 230,215,.5)",
          "rgba(255,255,255,0)"
        ]
      },
      labels:["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      hoverinfo: "label",
      hole: 0.5,
      type: "pie",
      showlegend: true
    }
  ]

  var layout_g = {
    shapes: [
      {
        type: "path",
        path: path,
        fillcolor: "850000",
        line: {
          color: "850000"
        }
      }
    ],
    title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
    height: 500,
    width: 500,
    xaxis: {
      zeroline:false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
    },
    yaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
    }
  }
  
  
    Plotly.newPlot("gauge", data_g, layout_g);
  })
};


// create the function to get the necessary data
function getInfo(id) {
    // read the json file to get data
    d3.json("data/samples.json").then((data)=> {
        
        // get the metadata info for the demographic panel
        var metadata = data.metadata;

        console.log(metadata)

        // filter meta data info by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // select demographic panel to put data
        var demographicInfo = d3.select("#sample-metadata");
        
        // empty the demographic info panel each time before getting new id info
        demographicInfo.html("");

        // grab the necessary demographic data for the id and append the info to the panel
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h6").text(key[0].toLocaleLowerCase() + ": " + key[1] + " \n");    
        });
    });
}

// create the function for the change event
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
    buildGauge(id);
}

// create the function for the initial data rendering
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("data/samples.json").then((data)=> {
        console.log(data)

        // get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        getPlot(data.names[0]);
        getInfo(data.names[0]);
        buildGauge(data.names[0]);
    });
}

init();