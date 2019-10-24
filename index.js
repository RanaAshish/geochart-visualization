const csvFilePath = "dataset.csv";
let data = [];
let header = [];
let country = [];

// Take Dataset into variable
requestCSV(csvFilePath, function(dataset) {
  // Load map once data received
  loadGeo(dataset);
});

function changeEvent() {
  // debugger;
  let aggregationLevel = document.querySelector(
    "input[name = aggregationLevel]:checked"
  ).value;

  if (aggregationLevel == "total") {
    // Hide reference country
    if (
      !document
        .getElementById("referenceCountryWrapper")
        .classList.contains("d-none")
    ) {
      document
        .getElementById("referenceCountryWrapper")
        .classList.add("d-none");
    }
  } else {
    // Show reference country
    if (
      document
        .getElementById("referenceCountryWrapper")
        .classList.contains("d-none")
    ) {
      document
        .getElementById("referenceCountryWrapper")
        .classList.remove("d-none");
    }

    let referenceCountry = document.getElementById("referenceCountry").value;
    referenceCountry = referenceCountry ? referenceCountry.trim() : "";

    if (referenceCountry == "") {
      if (document.querySelector(".error").classList.contains("d-none")) {
        document.querySelector(".error").classList.remove("d-none");
      }
      return;
    } else if (!document.querySelector(".error").classList.contains("d-none")) {
      document.querySelector(".error").classList.add("d-none");
    }
  }
  reloadData();
}

// Request CSV File
function requestCSV(filepath, callback) {
  return new CSVAJAX(filepath, callback);
}

// Call CSV file via AJAX
function CSVAJAX(filepath, callback) {
  this.request = new XMLHttpRequest();
  this.request.timeout = 10000;
  this.request.open("GET", filepath, true);
  this.request.parent = this;
  this.callback = callback;

  this.request.onload = function() {
    // Calculate total row
    var dataset = this.response.split("\n"); /*1st separator*/
    var i = dataset.length;

    // Split CSV and store all column value in array
    while (i--) {
      if (dataset[i] !== "") {
        dataset[i] = dataset[i].split(";"); /*2nd separator*/
      } else {
        dataset.splice(i, 1);
      }
    }
    this.parent.response = dataset;

    if (typeof this.parent.callback !== "undefined") {
      this.parent.callback(dataset);
    }
  };
  this.request.send();
}

function loadGeo(d) {
  d.forEach((val, key) => {
    if (key == 4) {
      header = val;
    } else if (key > 4) {
      if (val[0] != "" && country.indexOf(val[0].trim()) === -1) {
        country.push(val[0].trim());
      }
      if (val[1] != "" && country.indexOf(val[1].trim()) === -1) {
        country.push(val[1].trim());
      }
      data.push(val);
    }
  });

  country.sort();
  // Enable Autocomplete
  autocomplete(document.getElementById("referenceCountry"), country);
  console.log("Country ==> ", country);

  google.charts.load("current", {
    packages: ["geochart"],
    mapsApiKey: "AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY"
  });
  google.charts.setOnLoadCallback(reloadData);
}

function reloadData() {
  let aggregationLevel = document.querySelector(
    "input[name = aggregationLevel]:checked"
  ).value;

  let countryRole = document.querySelector("input[name = countryRole]:checked")
    .value;

  let referenceCountry = document.getElementById("referenceCountry").value;
  referenceCountry = referenceCountry ? referenceCountry.trim() : "";

  if (aggregationLevel === "connections" && referenceCountry == "") {
    if (document.querySelector(".error").classList.contains("d-none")) {
      document.querySelector(".error").classList.remove("d-none");
      return;
    }
  } else if (!document.querySelector(".error").classList.contains("d-none")) {
    document.querySelector(".error").classList.add("d-none");
  }

  let chartData = [["country", "Aggregation"]];
  if (aggregationLevel == "total" && countryRole == "initiating") {
    // Iterate through data and create new array for chart
    data.forEach(val => {
      if (val[0] && !isItemInArray(chartData, val[0])) {
        if (val[3] != "" || parseInt(val[3]) > 0) {
          chartData.push([val[0], parseInt(val[3])]);
        }
      }
    });
  } else if (aggregationLevel == "total" && countryRole == "receiving") {
    // Iterate through data and create new array for chart
    data.forEach(val => {
      if (val[1] && !isItemInArray(chartData, val[1])) {
        if (val[5] != "" || parseInt(val[5]) > 0) {
          chartData.push([val[1], parseInt(val[5])]);
        }
      }
    });
  } else if (aggregationLevel == "connections" && countryRole == "receiving") {
    // Iterate through data and create new array for chart
    data.forEach(val => {
      if (
        val[0] &&
        val[1] &&
        val[1] == referenceCountry &&
        !isItemInArray(chartData, val[0])
      ) {
        if (val[2] != "" || parseInt(val[2]) > 0) {
          chartData.push([val[0], parseInt(val[2])]);
        }
      }
    });
  } else if (aggregationLevel == "connections" && countryRole == "initiating") {
    // Iterate through data and create new array for chart
    data.forEach(val => {
      if (
        val[0] &&
        val[1] &&
        val[0] == referenceCountry &&
        !isItemInArray(chartData, val[1])
      ) {
        if (val[2] != "" || parseInt(val[2]) > 0) {
          chartData.push([val[1], parseInt(val[2])]);
        }
      }
    });
  } else {
    chartData = [
      ["Country", "Aggregation"],
      ["Germany", 200],
      ["United States", 300],
      ["Brazil", 400],
      ["Canada", 500],
      ["France", 600],
      ["RU", 700],
      ["INDIA", 800]
    ];
  }

  var options = {
    colors: ["#333066"]
  };

  var chart = new google.visualization.GeoChart(
    document.getElementById("regions_div")
  );

  chart.draw(google.visualization.arrayToDataTable(chartData), options);

  // google.visualization.events.addListener(chart, "regionClick", function(d) {
  //   console.log("Listner called : ", d);
  // });
}

// additional supportive functions
function isItemInArray(array, item) {
  for (var i = 0; i < array.length; i++) {
    if (array[i][0] == item) {
      return true; // Found it
    }
  }
  return false; // Not found
}
