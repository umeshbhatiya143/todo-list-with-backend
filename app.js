const express = require("express")
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
//const ejs = require("ejs")

var items = ["Buy food", "cook food", "eat food"];
var workItems = [];

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
//to use static or css files
app.use(express.static("public"));
//for using ejs
app.set("view engine", "ejs");

app.get('/', (req, res) => {

    let day = date();
    console.log(day);
    //   const day = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];

    res.render("list", { listTittle: day, newListItem: items });

});

app.post("/", (req, res) => {
    var item = req.body.newItem;
    //we can not use res.render more than once so to send back the data to the browser
    //we render all the data only once and then use 'res.redirect()' where the variable define.
    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    }
    else {
        items.push(item);
        res.redirect('/');
    }

});

//a new page find as 'localhost:3000/work'
app.get('/work', (req, res) => {
    res.render("list", { listTittle: "Work List", newListItem: workItems });
});

app.get("/about", (req, res) => {
    res.render("about");
})

app.listen(3000, () => {
    console.log("server is running on port 3000.");
});