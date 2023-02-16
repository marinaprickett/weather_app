
const KELVIN = 273;
var key = config.MY_API_KEY;

//get weather data from api
let weather = {
    apiKey: key,
    fetchWeather: function (city) {
        fetch(
        "https://api.openweathermap.org/data/2.5/weather?q="
        + city
        + "&units=imperial&appid=" + this.apiKey)
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function(data) {
        const { name } = data;
        const { description } = data.weather[0];
        const { temp, humidity } = data.main; 
        const { speed } = data.wind;
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = Math.round(temp) + "°F";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind speed: " + speed + " m/h"
        document.querySelector(".weather-container").classList.remove("loading");
    },
    search: function() {
        this.fetchWeather(document.querySelector(".search-bar").value);
    },
};

//get user location
let geocode = {
    reverseGeocode: function (latitude, longitude) {
    var api_key = '9587be6bf98847ef84194bb2561296b1';

    var api_url = 'https://api.opencagedata.com/geocode/v1/json'

    var request_url = api_url
        + '?'
        + 'key=' + api_key
        + '&q=' + encodeURIComponent(latitude + ',' + longitude)
        + '&pretty=1'
        + '&no_annotations=1';

    var request = new XMLHttpRequest();
    request.open('GET', request_url, true);

    request.onload = function() {
    if (request.status === 200){
      // Success!
      var data = JSON.parse(request.responseText);
    // print the location
      weather.fetchWeather(data.results[0].components.city);

    } else if (request.status <= 500){
      // We reached our target server, but it returned an error

      console.log("unable to geocode! Response code: " + request.status);
      var data = JSON.parse(request.responseText);
      console.log('error msg: ' + data.status.message);
    } else {
      console.log("server error");
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    console.log("unable to connect to server");
  };

  request.send();  // make the request
    },
getLocation: function() {
    function success (data) {
        geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
        }

    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(success, console.error);
    }
    else {
        weather.fetchWeather("Tampa");
    }
    }
};

//search bar
document.querySelector(".search button").addEventListener("click", function() {
    weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  
});

//C to F conversion
weather.temperature = {
    unit : "fahrenheit"
}

function convert() {
    let temperature = parseInt(document.querySelector(".temp").innerText);
    let celsius, fahrenheit;
    
    if (weather.temperature.unit === "fahrenheit") {
        celsius = (temperature - 32) * 5/9;
        document.querySelector(".temp").innerText = Math.round(celsius) + "°C";
        weather.temperature.unit = "celsius";
    } else if (weather.temperature.unit === "celsius") {
        fahrenheit = (temperature * 9/5) + 32;
        document.querySelector(".temp").innerText = Math.round(fahrenheit) + "°F";
        weather.temperature.unit = "fahrenheit";
    }
};


geocode.getLocation();