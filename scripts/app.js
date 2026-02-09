// app.js

// Handle search button click
document.getElementById("searchBtn").addEventListener("click", async () => {
  const city = document.getElementById("cityInput").value;
  const category = document.getElementById("categorySelect").value;
  const startDate = document.getElementById("startDate")?.value;
  const endDate = document.getElementById("endDate")?.value;

  const events = await fetchEvents(city, category, startDate, endDate);
  renderEvents(events);
});

/**
 * Render event cards into the eventsGrid section.
 */
function renderEvents(events) {
  const grid = document.getElementById("eventsGrid");
  grid.innerHTML = "";

  if (!events || events.length === 0) {
    grid.innerHTML = "<p style='text-align:center;'>No events found. Try adjusting your search.</p>";
    return;
  }

  events.forEach(event => {
    const card = document.createElement("div");
    card.className = "event-card";
    card.innerHTML = `
      <img src="${event.image || 'placeholder.jpg'}" alt="${event.name}">
      <h3>${event.name}</h3>
      <p>${event.date} ${event.time ? '@ ' + event.time : ''}</p>
      <p>${event.venue || ''}</p>
      <div class="card-actions">
        <a href="events.html?id=${event.id}" class="details-link">View Details</a>
        <button onclick='saveFavorite(${JSON.stringify(event)})'>⭐ Save</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

/**
 * Save an event to favorites (full object).
 */
function saveFavorite(eventObj) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.find(fav => fav.id === eventObj.id)) {
    favorites.push(eventObj);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert(`${eventObj.name} added to favorites!`);
  }
}
