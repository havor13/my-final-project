// app.js

// Handle search button click
document.getElementById("searchBtn").addEventListener("click", async () => {
  const city = document.getElementById("cityInput").value.trim();
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
    card.className = "event-card fade-in";

    card.innerHTML = `
      <img src="${event.image || 'placeholder.jpg'}" alt="Banner for ${event.name}">
      <h3>${event.name}</h3>
      <p><strong>Date:</strong> ${event.date || "TBA"} ${event.time ? '@ ' + event.time : ''}</p>
      <p><strong>Venue:</strong> ${event.venue || ""}, ${event.city || ""}</p>
      <span class="category ${event.category?.toLowerCase() || ""}">${event.category || ""}</span>
      <p class="description">${event.description || ""}</p>
      <p class="price"><strong>Price:</strong> ${event.price || "TBA"}</p>
      <div class="card-actions">
        <a href="events.html?id=${event.id}" class="details-link">View Details</a>
        <button class="save-btn">⭐ Save</button>
        ${event.url ? `<a href="${event.url}" target="_blank" class="btn">Official Page</a>` : ""}
      </div>
    `;

    // Attach event listener for Save button
    card.querySelector(".save-btn").addEventListener("click", () => saveFavorite(event));

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
  } else {
    alert(`${eventObj.name} is already in favorites.`);
  }
}
