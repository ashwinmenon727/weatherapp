const apiKey = "8ca355765979b1e8d1f9f946ed8906bc";

// Initialize map
const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let marker;

// Click on map to get weather
map.on('click', function(e) {
  const lat = e.latlng.lat;
  const lon = e.latlng.lng;
  showMarker(lat, lon);
  fetchWeather(lat, lon);
});

function showMarker(lat, lon) {
  if (marker) {
    map.removeLayer(marker);
  }
  marker = L.marker([lat, lon]).addTo(map);
}

// Search place using OpenStreetMap
async function searchPlace() {
  const place = document.getElementById("cityInput").value;
  if (!place) return alert("Enter a place");

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${place}`
  );
  const data = await res.json();

  if (data.length === 0) return alert("Place not found");

  const lat = data[0].lat;
  const lon = data[0].lon;

  map.setView([lat, lon], 8);
  showMarker(lat, lon);
  fetchWeather(lat, lon);
}

// Fetch weather
async function fetchWeather(lat, lon) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    const data = await res.json();
    console.log(data);

    if (data.cod !== 200) {
      alert("Error: " + data.message);
      return;
    }

    document.getElementById("cityName").innerText = data.name;
    document.getElementById("temp").innerText = data.main.temp + "°C";
    document.getElementById("desc").innerText = data.weather[0].description;
    document.getElementById("extra").innerText =
      "Humidity: " + data.main.humidity +
      "% | Wind: " + data.wind.speed + " m/s";

    document.getElementById("icon").src =
      "https://openweathermap.org/img/wn/" +
      data.weather[0].icon +
      "@2x.png";

  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }
}