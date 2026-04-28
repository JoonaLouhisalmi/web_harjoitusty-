const form = document.getElementById("weatherForm");
const result = document.getElementById("weatherResult");

const API_KEY = CONFIG.API_KEY;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const city = document.getElementById("city").value;
  localStorage.setItem("lastCity", city);
  document.getElementById("city").value = "";

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=fi&appid=${API_KEY}`
    );

    const data = await res.json();

    if (data.cod !== 200) {
      result.innerHTML = "<p>Kaupunkia ei löytynyt. Tarkista kirjoitusasu.</p>";
      return;
    }

    const icon = data.weather[0].icon;

    result.innerHTML = `
      <div class="city-card">
        <h2>${data.name}</h2>

        <img src="https://openweathermap.org/img/wn/${icon}@2x.png">

        <p>Lämpötila: ${Math.round(data.main.temp)}°C</p>
        <p>Sää: ${data.weather[0].description}</p>
        <p>Tuuli: ${data.wind.speed} m/s</p>

        <button onclick="addFavorite('${data.name}')">Tallenna suosikiksi</button>
      </div>
    `;

  } catch {
    result.innerHTML = "<p>⚠️ Yhteysvirhe. Yritä uudelleen.</p>";
  }
});

function addFavorite(city) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (!favorites.includes(city)) {
    favorites.push(city);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Tallennettu!");
  }
}

window.addEventListener("load", () => {
  const lastCity = localStorage.getItem("lastCity");

  if (lastCity) {
    document.getElementById("city").value = lastCity;
  }

  document.getElementById("city").focus();
});