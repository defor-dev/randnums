const express = require("express");
  
const app = express();

const PORT = process.env.PORT || 80

app.get("/", function(request, response){
    response.sendFile(__dirname + "/index.html");
});

app.get("/result", function(request, response){
    response.sendFile(__dirname + "/result.html");
});
  
app.listen(PORT);