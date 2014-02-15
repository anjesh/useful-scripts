var XLS = require('xlsjs');
var csv = require('csv');
var ya_csv = require('ya-csv');
var _ = require('underscore');
var S = require('string');

module.exports = {
    processExcel: processExcel,
    writeCleanCsvOfSheet: writeCleanCsvOfSheet
};

function processExcel(xlFilepath, csvwriter) {
    var xls = XLS.readFile(xlFilepath);
    //go through all the sheets of the xls file
    xls.SheetNames.forEach(function (sheetName) {
        console.log("Reading " + sheetName);
        var csvdata = XLS.utils.make_csv(xls.Sheets[sheetName]);
        writeCleanCsvOfSheet(csvdata, sheetName, csvwriter);
    });    
}

function writeCleanCsvOfSheet(csvstring, sheetName, csvwriter) {
    var XlReadStatus = (function() {
        return {
            headerNo: 0,
            headerFound: 1,
            dataBegins: 2
        };
    })();
    
    var header;
    var dataRowBegins = XlReadStatus.headerNo;
    csv().from.string(csvstring)
        .on('record', function(row, index) {
            if(!isBlankRow(row)) {
                if(isHeader(row)) {
                    dataRowBegins = XlReadStatus.headerFound;
                    header = row;
                } else {
                    if(dataRowBegins == XlReadStatus.dataBegins) {
                        row = fixRow(row, header, sheetName);
                        csvwriter.writeRecord(row);
                    }
                    if(dataRowBegins == XlReadStatus.headerFound)
                        //need to set this, as the header takes 2 columns
                        dataRowBegins = XlReadStatus.dataBegins;
                }
            }
        });    
}

/*
* This fix the row as some sheet has 10 columns and some has 9. 
* This function fix the rows which has 9 columns, it moves te 9th column to 10th
* and added extra column to all the rows
*/
function fixRow(datarow, header, sheetName) {
    if(header && S(header[8]).trim().left(7).s == "REMARKS") {
        datarow[9] = datarow[8];
        datarow[8] = "";
    }
    datarow[10] = sheetName;
    return datarow;
}

/*
* Checks whether the given row is header or not, by checking 2 column values only.
*/
function isHeader(datarow) {
    if(S(datarow[0]).trim().left(2).s == "NO" 
      && S(datarow[2]).trim().left(9).s == "REFERENCE" )
        return true;
    return false;
}

function isBlankRow(datarow) {
    var blank = true;
    _.each(datarow, function (val) {
        //If one val is not blank, then it is not blank row.
        if(val) blank = false;
    });
    return blank;
}
