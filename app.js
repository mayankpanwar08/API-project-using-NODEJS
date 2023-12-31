const express = require("express");
const bodyParser = require("body-parser");
const e = require("express");
const request = require("request");
const https = require("https");
const { subscribe } = require("diagnostics_channel");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){

    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const email = req.body.email;
    
    const data = {
        email_address: email,
        status: "subscribed",
        merge_fields: {
            FNAME: firstname,
            LNAME: lastname
        }

    };

    const jsonData = JSON.stringify(data);
    const url = "https://us<your api key last digit here>.api.mailchimp.com/3.0/lists/your audience key here/members";
    const options = {
        method: "post",
        auth: "mayank:your api key here"
    };

    const request = https.request(url, options, function(response){

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data))
        })
    });

    request.write(jsonData);
    request.end();
    



});

app.post("/failure", function(req, res){
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function(){
    console.log("server is running on port 3000");
});

