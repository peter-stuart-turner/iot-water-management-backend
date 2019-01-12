const http = require('http');

function initializeWeather() {

  var databaseReference = FIREBASE_ADMIN.getDatabaseReference();

  // Get schedules from database on startup
  var region_db = databaseReference.child(FIREBASE_REGION_LOCATION_TABLE);

  // Update on item deletion
  region_db.on(FIREBASE_CHILD_ADDED, function(snapshot) {
    var key = snapshot.key;
    var region_location = snapshot.val().l;

    getLocationWeather(key, region_location);
  });

  LOGGER.info("Initialized weather")
}

module.exports = initializeWeather;


function getLocationWeather(key, location){
  const open_weather_key = '1ad268457c5b9efb2736a7a58d10eb6a';
  var weather_url = 'http://api.openweathermap.org/data/2.5/forecast?lat='+location[0]+'&lon='+location[1]+'&APPID=' + open_weather_key;

  http.get(weather_url, (resp) => {
  let data = '';

  resp.on('data', (chunk) => {
    data += chunk;
  });

  resp.on('end', () => {
    var weather_data = JSON.parse(data);
    var weather_list = weather_data.list;

    var region_weather_array = [];

    var rain_tally = 0;

    for (var ii = 0; ii < weather_list.length; ii++) {
      var weather = weather_list[ii];

      var rained = false;

      // if(!(weather.rain['3h'] == undefined)){
      //   var amount = weather.rain['3h'].toFixed(4);
      //   rain_tally = Number(rain_tally) + Number(amount);
      //   rained = true;
      // }

      var weather_object = {
        timestamp: weather.dt,
        date: weather.dt_txt,
        main: weather.weather[0].main,
        description: weather.weather[0].description,
        temp: (weather.main.temp - 273.15).toFixed(2),
        temp_min: (weather.main.temp_min - 273.15).toFixed(2),
        temp_max: (weather.main.temp_max - 273.15).toFixed(2),
        humidity: weather.main.humidity,
        cloudiness: weather.clouds.all,
        wind_speed: weather.wind.speed,
        wind_direction: weather.wind.deg,
        has_rained: rained,
        rain_in_mm: Number(rain_tally).toFixed(4),
      }

      region_weather_array.push(weather_object);
    }

    var databaseReference = FIREBASE_ADMIN.getDatabaseReference();
    var weather_db = databaseReference.child(FIREBASE_REGION_WEATHER_TABLE + '/' + key);

    weather_db.set(region_weather_array);

  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
}
