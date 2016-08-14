var express = require('express');
var path = require('path');
var getData = require("./public/javascript/getData.js");

var app = express();

app.get('/', function (req, res) {
  console.log("default entry point");
  res.sendFile(path.join(__dirname + "/views/index.html"));
});

var make = "";
var model = "";
var yearMin = "";
var yearMax = "";

app.get('/getUsedData', function(req, res){

  make = req.query.make;
  model = req.query.model;
  yearMin = req.query.year_min;
  yearMax = req.query.year_max;

  console.log(make, model, yearMin, yearMax);

  getData.getUsedCars(make, model, yearMin, yearMax, function(cars) {
    console.log(1);
    var buyCount = 0;
    var buyTotal= 0;
    var total = 0;
    for (var i=0; i < cars.length; i++) {
      if (cars[i].hasOwnProperty('BuyNowPrice')) {
        buyCount += 1;
        buyTotal += cars[i].BuyNowPrice
      }
      cars[i].Price = parseInt(cars[i].PriceDisplay.replace(/\D/g, ""));
      total += cars[i].Price;
    }

    console.log(2);

    if (total === 0) {
      var jsonStr = JSON.stringify({info:{averageAsking:0, averageBuyNow:0, make:make, model:model, yearMin:yearMin, yearMax:yearMax}, cars:cars});
    }
    else {
      if (buyTotal != 0) {
        var jsonStr = JSON.stringify({info:{averageAsking:total/cars.length, averageBuyNow:buyTotal/buyCount,  make:make, model:model, yearMin:yearMin, yearMax:yearMax}, cars:cars});
      }
      else {
        var jsonStr = JSON.stringify({info:{averageAsking:total/cars.length, averageBuyNow:0,  make:make, model:model, yearMin:yearMin, yearMax:yearMax}, cars:cars});
      }
    }
    console.log(3);

    res.send(jsonStr);
  });
});

app.use(express.static(__dirname + '/views'));


app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!');
});
