var ya_csv = require('ya-csv');
var test = require('../sheetProcessor');

var writer = ya_csv.createCsvFileWriter('combined-data.csv');

var stream = ya_csv.createCsvStreamWriter(process.stdout);

test.processExcel('test-data.xls', writer); //creates file

test.processExcel('test-data.xls', stream); //writes to stdout

