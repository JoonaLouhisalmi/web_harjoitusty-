const list = document.getElementById("favoritesList");
const API_KEY = CONFIG.API_KEY;

async function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  list.innerHTML = "";

  if (favorites.length === 0) {
    list.innerHTML = "<p>Ei tallennettuja kaupunkeja vielä.</p>";
    return;
  }

  for (let city of favorites) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=fi&appid=${API_KEY}`
      );

      const data = await res.json();

      if (data.cod !== 200) continue;

      const icon = data.weather[0].icon;

      const div = document.createElement("div");
      div.classList.add("city-card");

      div.innerHTML = `
        <h3>${data.name}</h3>

        <img src="https://openweathermap.org/img/wn/${icon}@2x.png">

        <p>Lämpötila: ${Math.round(data.main.temp)}°C</p>
        <p>${data.weather[0].description}</p>
        <p>Tuuli: ${data.wind.speed} m/s</p>

        <button onclick="removeCity('${city}')">Poista</button>
      `;

      list.appendChild(div);

    } catch {
      const error = document.createElement("p");
      error.textContent = "Virhe ladattaessa säätietoja";
      list.appendChild(error);
    }
  }
}

function removeCity(city) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter(c => c !== city);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  loadFavorites();
}

loadFavorites();