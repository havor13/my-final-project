// app.js

// Attach search button handler
document.getElementById("searchBtn").addEventListener("click", async () => {
  try {
    const city = document.getElementById("cityInput").value.trim();
    const category = document.getElementById("categorySelect").value;
    const startDate = document.getElementById("startDate")?.value;
    const endDate = document.getElementById("endDate")?.value;

    const events = await fetchEvents(city, category, startDate, endDate);
    renderEvents(events);
  } catch (err) {
    console.error("❌ Error fetching events:", err);
    document.getElementById("eventsGrid").innerHTML =
      "<p style='text-align:center;color:red;'>Could not load events. Please try again later.</p>";
  }
});

/**
 * Render event cards into the eventsGrid section.
 */
function renderEvents(events) {
  const grid = document.getElementById("eventsGrid");
  grid.innerHTML = "";

  if (!events || events.length === 0) {
    grid.innerHTML = `
      <div class="empty-state fade-in">
        <p>⚠️ No events found. Try adjusting your search.</p>
      </div>
    `;
    return;
  }

  events.forEach(event => {
    const card = document.createElement("div");
    card.className = "event-card fade-in";

    card.innerHTML = `
      <img src="${event.image || 'images/placeholder.jpg'}" 
           alt="Banner for ${event.name}" 
           class="event-image">
      <h3>${event.name}</h3>
      <p><strong>Date:</strong> ${event.date || "TBA"} ${event.time ? '@ ' + event.time : ''}</p>
      <p><strong>Venue:</strong> ${event.venue || ""}${event.city ? ', ' + event.city : ""}</p>
      <span class="category ${event.category?.toLowerCase() || ""}">${event.category || ""}</span>
      <p class="description">${event.description || "No description available."}</p>
      <p class="price"><strong>Price:</strong> ${event.price || "TBA"}</p>
      <div class="card-actions">
        <a href="events.html?id=${event.id}" class="details-link">View Details</a>
        <button class="save-btn" aria-label="Save ${event.name} to favorites">⭐ Save</button>
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
