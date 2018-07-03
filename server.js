var express = require("express");
var app = express();
var GoogleSpreadsheets = require("google-spreadsheets");
const hbs = require("hbs");
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

// Data is 1 indexed so start array with placeholder to fill 0 index.
var fields = ["Structure:"];
var data = false;


//
// Step 1: Loading the Data
// This uses samcday's [Google Spreadsheet Data API for Node](https://github.com/samcday/node-google-spreadsheets).
// It's a simple node.js library that makes it easy for us to read data from a Google Spreadsheet. To keep things
// straight-forward, in our example, we're reading data from a [public spreadsheet](https://docs.google.com/spreadsheets/d/[KEY IS HERE IN URL]/edit?usp=sharing)
// so there's no authentication. However, Sam provides some [detail](https://github.com/samcday/node-google-spreadsheets#authentication)
// on dealing with authentication should you want to add that. The function expects the required variable `key`,
// which is the Google Spreadsheet ID.
// You can get the ID from the Google Sheet's URL - it's the bit after 'https://docs.google.com/spreadsheets/d/'
// and before '/edit#gid=0'. Then we tell it to grab the values from all cells in the first published to the web worksheet (index 0)in the
// range, R1C1:R21C10, or Row 1, Column 1 to Row 21, Column 13 with the function `spreadsheet.worksheets[0].cells()`. In the [example spreadsheet](https://docs.google.com/spreadsheets/d/1wz29qFmSVUoUpcxZzwPgyamrfXTjN8cnqydPW8N6XAg/edit?usp=sharing), that's the whole area populated with data
//

function loadData() {
  return new Promise(function(resolve, reject) {
    GoogleSpreadsheets({
      key: process.env.KEY
    }, function(err, spreadsheet) {
      spreadsheet.worksheets[0].cells({
          // grab all the data
          range: "R1C1:R21C13"
      }, function(err, result) {
        if (!err){
          // Put in-memory store for now
          data = result.cells;
          resolve(data);
        } else {
          reject("Error: " + err);
        }
      });
    });
  });
}

function parseStructure(structure) {
  for (var i in structure) {
    fields[parseInt(i)] = structure[i].value;
  }
}


function makeContact(contactData) {
  var contact = {};
  for (var i = 1; i < fields.length; i++) {
    if (contactData[String(i)]) {
      contact[fields[i]] = contactData[String(i)].value;
    }  
  }
  return contact;
}


app.use(express.static('public'));

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/json", function(req, res) {
  loadData()
  .then(function(result) {
    parseStructure(data["1"]);
    var end = Object.keys(data).length;
    var contacts = [];
    for (var i = 1; i <= end; i ++) {
      contacts.push(makeContact(data[String(i)]));
    }
    res.send(JSON.stringify(contacts));
  })
  .catch(function(err) {
    res.send("Error");
  }); 
});

app.get("/data", function (req, res) {
  res.send(JSON.stringify(data));
});

app.get("/contact/:id", function(req, res) {
  res.render("contact");
});

app.get("/new", function(req, res) {
 res.render("new-contact"); 
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});