var ya_csv = require('ya-csv');
var main = require('./sheetProcessor');

var writer = ya_csv.createCsvFileWriter('combined-data.csv');

var xlFilepath = "/Users/anjesh/Documents/Data/NepalChronicles/Deaths/malaysia-deaths.xls";
main.processExcel(xlFilepath, writer);