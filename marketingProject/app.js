const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.post("/", function (req, res) {
    console.log(req.body);
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;

    var data = {
        members : [
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName,
                }
            }
        ]
    }

    var jsonData = JSON.stringify(data);

    var url = "https://us12.api.mailchimp.com/3.0/lists/eb2ac1bae1"

    var options = {
        method : "POST",
        auth : "yash:e5b093512c82d0348dec86815e1acfaf-us12"
    }
    var statusCode;

    const request = https.request(url, options, function (response) {
        statusCode = response.statusCode;
        if (statusCode == 200) {
            res.sendFile(__dirname+"/success.html")
        } else {
            res.sendFile(__dirname+"/failure.html")
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
})

app.listen(process.env.PORT || 3000, function() {
    console.log("server started at port 3000");
})

// key = e5b093512c82d0348dec86815e1acfaf-us12

// eb2ac1bae1