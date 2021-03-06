const express = require("express")
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");
//const ejs = require("ejs")

//var items = ["Buy food", "cook food", "eat food"];
var items = [];

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
//to use static or css files
app.use(express.static("public"));
//for using ejs
app.set("view engine", "ejs");

//connect mongoose to database
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

//create a schema
const itemSchema = {
    name: String
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Welcome to your todolist"
});
const item2 = new Item({
    name: "Hit the + button to add a new item."
});
const item3 = new Item({
    name: "<-- Hit this to delete an item."
});
const defaultItems = [item1, item2, item3];

//create new schema for dynamic routes
const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model("List",listSchema);


app.get('/', (req, res) => {

    let day = date();
    //   const day = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];

    //read data from database
    Item.find({}, (err, foundItems) => {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Data successfully inserted!");
                }
            });
            res.redirect('/');
        }
        else {
            res.render("list", { listTittle: day, newListItem: foundItems });
        }
    });

});

//create a dynamic route for such cases localhost:3000/work
app.get("/:customListName",(req,res)=>{
    const customListName = _.capitalize(req.params.customListName);
   
    List.findOne({name: customListName}, (err, foundList)=>{
        if(!err){
            if(!foundList){
                //Create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            }
            else{
                //show an existing list
                res.render("list", { listTittle: foundList.name, newListItem: foundList.items});
            }
        }
    });
});


app.post("/", (req, res) => {
    var todo = req.body.newItem;
    const listName = req.body.list;
    //we can not use res.render more than once so to send back the data to the browser
    //we render all the data only once and then use 'res.redirect()' where the variable define.
    // if (req.body.list === "Work") {
    //     workItems.push(item);
    //     res.redirect("/work");
    // }
    // else {
    //     items.push(item);
    //     res.redirect('/');
    // }

    // now it's time to push all the data into database
    const item = new Item({
         name: todo
    });
    if(listName === "Today"){
        item.save();
        res.redirect("/");
    }
    else{
        List.findOne({name: listName}, (err, foundList)=>{
          foundList.items.push(item);
          foundList.save();
          res.redirect("/" + listName);
        });
    }
});
//to delete the marked todo
app.post("/delete",(req,res)=>{
    const checkboxItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.deleteOne({_id:checkboxItemId}, (err)=>{
            if(!err){
                console.log("Successfully deleted checked item.");
                res.redirect("/");
            }
        });
    }
    else{
        List.findOneAndUpdate({name:listName}, {$pull: {items: {_id: checkboxItemId}}}, (err, foundList)=>{
             if(!err){
                 res.redirect("/" + listName);
             }
        });
    }
});



app.get("/about", (req, res) => {
    res.render("about");
})

app.listen(3000, () => {
    console.log("server is running on port 3000.");
});