var request = require('request');
var sprintf = require("sprintf-js").sprintf,
    vsprintf = require("sprintf-js").vsprintf;

function getUsedCars(make, model, yearMin, yearMax, callback){

  var options = {
    url: sprintf('https://api.trademe.co.nz/v1/Search/Motors/Used.json?make=%s&model=%s&year_max=%d&year_min=%d', make, model, yearMax, yearMin),
    headers: {
      'Authorization': sprintf('OAuth oauth_consumer_key=%s, oauth_signature_method="PLAINTEXT", oauth_signature=%s&', process.env.TOKEN, process.env.SECRET)
    }
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var cars = JSON.parse(body)['List'];

      var buyCount = 0;
      var buyTotal= 0;
      var total = 0;
      var min = parseInt(cars[0].PriceDisplay.replace(/\D/g, ""));
      var max = min;

      for (var i=0; i < cars.length; i++) {
        if (cars[i].hasOwnProperty('BuyNowPrice')) {
          buyCount += 1;
          buyTotal += cars[i].BuyNowPrice
        }
        cars[i].Price = parseInt(cars[i].PriceDisplay.replace(/\D/g, ""));
        total += cars[i].Price;
        if(cars[i].Price < min){
          min = cars[i].Price;
        }
        else if(cars[i].Price > max){
          max = cars[i].Price;
        }
      }

      if (total === 0) {
        var jsonStr = JSON.stringify({averageAsking:0, averageBuyNow:0, max:0, min:0, make:make, model:model, yearMin:yearMin, yearMax:yearMax});
      }
      else {
        if (buyTotal != 0) {
          var jsonStr = JSON.stringify({averageAsking:total/cars.length, averageBuyNow:buyTotal/buyCount, max:max, min:min, make:make, model:model, yearMin:yearMin, yearMax:yearMax});
        }
        else {
          var jsonStr = JSON.stringify({averageAsking:total/cars.length, averageBuyNow:0, max:max, min:min, make:make, model:model, yearMin:yearMin, yearMax:yearMax});
        }
      }

      callback(jsonStr);
    } else {
      console.log(response.statusCode);
    }
  });
}

exports.getUsedCars = getUsedCars;
