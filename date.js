
module.exports = getDate;

function getDate(){

var today = new Date();
var options = {
    weekday: "long",
    day: "numeric",
    month: "long"
};

var day = today.toLocaleDateString("en-US",options);

return day;

}


//we also can exports more than one function 
//go -   node js/module/exports 
//and read all the docs
//exports.functionName = functionName;