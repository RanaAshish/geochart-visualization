# Visulization of data on world map

Code is about to fetch data from CSV file having predefine format and display those data on the world map by calculating data based on different parameter

## Built With

- HTML
- CSS
- Javascript
- Bootstrap(https://getbootstrap.com/docs/4.0/about/license/)
- Google Geochart(https://developers.google.com/chart/interactive/docs/gallery/geochart)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

HTTP server that can render HTML and javascript.

### Installing

Put given code from where you can directly render HTML and javascript through IP address or url in the browser.

## Running the tests

When you hit URL in the browser, you can see page with empty map.
You need to click on "Choose file" button to select CSV file.
As soon as you select valid CSV file, system will automatically read data from CSV file and render onto the map based on selected radio button.
When you change radio button preference, data will automatically updated based on new selected preference.

Notes: If you are selecting "Connections" in the "Aggregation Level", then you must select "Reference country" from given list.

## About Files

- index.html - Entry point of the application where we included other css and javascript files.
- index.js - Javascript file that handles click events, change events of radio and file select event of input file control. Also geomap is loading from this file.
- autocomplete.js - Contains javascript code for autocomplete textbox
- geo.css - Contains CSS rules for the webpage
