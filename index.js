console.log("Javascript running");

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

// Take Dataset into variable
requestCSV("dataset.csv", function(dataset) {
  loadGeo(dataset);
  // avg_collaborations_client_country(dataset);
  // collaborations_client_country(dataset);
  // max_client_countries(dataset);
});

function loadGeo(data) {
  console.log("Data from CSV ==> ", data);
  google.charts.load("current", {
    packages: ["geochart"],
    mapsApiKey: "AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY"
  });
  google.charts.setOnLoadCallback(drawRegionsMap);

  function drawRegionsMap() {
    var data = google.visualization.arrayToDataTable([
      ["Country", "Aggregation"],
      ["Germany", 200],
      ["United States", 300],
      ["Brazil", 400],
      ["Canada", 500],
      ["France", 600],
      ["RU", 700],
      ["INDIA", 800]
    ]);

    var options = {
      colors: ["#333066"]
    };

    var chart = new google.visualization.GeoChart(
      document.getElementById("regions_div")
    );

    chart.draw(data, options);
  }
}

// AVG_COLLABORATIONS_CLIENT_COUNTRY
function avg_collaborations_client_country(data) {
  let header = [];
  let sum = 0;
  let counter = 0;
  data.forEach((val, key) => {
    if (key == 4) {
      header = val;
    } else if (key > 4) {
      sum = sum + val[header.indexOf("Number collaborations")] * 1;
      counter = counter + 1;
    }
  });
  document.getElementById("avg_collaborations_client_country").innerHTML =
    sum / counter;
}

function collaborations_client_country(data) {
  const country = [];
  let header = [];
  data.forEach((val, key) => {
    if (key == 4) {
      header = val;
    } else if (key > 4) {
      const countryName = val[header.indexOf("Client Country")];
      if (country.indexOf(countryName) === -1) {
        country[countryName] = {
          sum: val[header.indexOf("Number collaborations")]
            ? val[header.indexOf("Number collaborations")] * 1
            : 0,
          counter: 1,
          average: val[header.indexOf("Number collaborations")]
            ? val[header.indexOf("Number collaborations")] * 1
            : 0
        };
      } else {
        country[countryName]["sum"] =
          country[countryName]["sum"] +
          val[header.indexOf("Number collaborations")];
        country[countryName]["counter"] = country[countryName]["counter"] + 1;
        country[countryName]["average"] =
          country[countryName]["sum"] / country[countryName]["counter"];
      }
    }
  });

  let highest = {};
  let minimum = {};
  Object.keys(country).forEach(v => {
    const val = country[v];
    if (Object.keys(highest).length > 0) {
      if (highest.sum < val.sum) {
        highest = val;
        highest["country"] = v;
      }
    } else {
      highest = val;
      highest["country"] = v;
    }
    if (Object.keys(minimum).length > 0) {
      if (minimum.sum > val.sum) {
        minimum = val;
        minimum["country"] = v;
      }
    } else {
      minimum = val;
      minimum["country"] = v;
    }
  });

  document.getElementById("max_collaborations_client_country").innerHTML =
    highest.country + " ==> " + highest.sum;
  document.getElementById("min_collaborations_client_country").innerHTML =
    minimum.country + " ==> " + minimum.sum;
}

function max_client_countries(data) {
  const country = [];
  let header = [];
  data.forEach((val, key) => {
    if (key == 4) {
      header = val;
    } else if (key > 4) {
      const countryName = val[header.indexOf("Client Country")];
      const providerCountry = val[header.indexOf("Provider Country")];
      if (country.indexOf(countryName) === -1) {
        country[countryName] = [];
        country[countryName][providerCountry] = [];
        country[countryName][providerCountry]["counter"] = 1;
        country[countryName][providerCountry].push(val);
      } else {
        country[countryName][providerCountry].push(val);
        country[countryName][providerCountry]["counter"] += 1;
      }
    }
  });

  console.log("Max ==> ", country);
}
