document.getElementById("searchBtn").addEventListener("click", async () => {
  const city = document.getElementById("cityInput").value;
  const category = document.getElementById("categorySelect").value;
  const events = await fetchEvents(city, category);
  renderEvents(events);
});

function renderEvents(events) {
  const grid = document.getElementById("eventsGrid");
  grid.innerHTML = "";
  if (events.length === 0) {
    grid.innerHTML = "<p>No events found.</p>";
    return;
  }
  events.forEach(event => {
    const card = document.createElement("div");
    card.className = "event-card";
    card.innerHTML = `
      <h3>${event.name}</h3>
      <p>${event.date} @ ${event.time}</p>
      <p>${event.venue}</p>
      <a href="events.html?id=${event.id}">View Details</a>
      <button onclick="saveFavorite('${event.id}', '${event.name}')">Save to Favorites</button>
    `;
    grid.appendChild(card);
  });
}

function saveFavorite(id, name) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.find(fav => fav.id === id)) {
    favorites.push({ id, name });
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert(`${name} added to favorites!`);
  } else {
    alert(`${name} is already in favorites.`);
  }
}
