# dtt-cleanup cleans up the csv file as per required format
# dtt-cleanup.js
# Copyright 2011 Anjesh Tuladhar 
# Licensed under the MIT license


function ltrim(s) {
    sub(/^ */, "", s);
    return s
}
        
function rtrim(s) {
    sub(/ *$/, "", s);
    return s
}

#trims space from left and right
function trim(s) {
    return rtrim(ltrim(s));
}

BEGIN {
    FS="[,;]"
}
{
    #Remove all double quotes (")
    gsub(/"/,"")
    date = $1
    hours = $2
    #substitute : with .
    sub(/:/,".",hours)
    name=$3
    project=$4
    category=$5
    remarks = ""
    #if there are more than 6 fields, concatanate all of those remaining strings
    for(pos=6;pos<=NF;pos++) {
        remarks = remarks" "$pos
    }
    #prepare the cleaned-up row
    row = date","hours","name","project","category","trim(remarks)
    #if the row is blank, then it contains only commas
    if(row != ",,,,,") {
        print row
    }
}

