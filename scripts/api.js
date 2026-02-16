const USE_MOCK_DATA = true;
const TICKETMASTER_API_KEY = "YOUR_TICKETMASTER_KEY";
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_KEY";

/**
 * Helper: Build correct path for local data.json
 * Works regardless of port (8000, 5500, etc.)
 */
function getDataJsonUrl() {
  const baseUrl = window.location.origin; // e.g. http://127.0.0.1:8000
  return `${baseUrl}/data.json`;
}

/**
 * Fetch events by city, category, and optional date range.
 */
async function fetchEvents(city, category, startDate, endDate) {
  if (USE_MOCK_DATA) {
    try {
      const response = await fetch(getDataJsonUrl());
      const data = await response.json();

      console.log("🔍 Raw events:", data);
      console.log("📌 Filters -> City:", city, "Category:", category, "Dates:", startDate, endDate);

      const filtered = data.filter(event => {
        const matchCity = city ? event.city?.toLowerCase().includes(city.toLowerCase()) : true;
        const matchCategory = category ? event.category?.toLowerCase().includes(category.toLowerCase()) : true;
        const matchDate =
          startDate && endDate
            ? new Date(event.date) >= new Date(startDate) && new Date(event.date) <= new Date(endDate)
            : true;
        return matchCity && matchCategory && matchDate;
      });

      console.log("✅ Results:", filtered);
      return filtered;
    } catch (err) {
      console.error("❌ Error loading mock data:", err);
      return [];
    }
  } else {
    let url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TICKETMASTER_API_KEY}`;
    if (city) url += `&city=${encodeURIComponent(city)}`;
    if (category) url += `&classificationName=${encodeURIComponent(category)}`;
    if (startDate && endDate) {
      url += `&startDateTime=${startDate}T00:00:00Z&endDateTime=${endDate}T23:59:59Z`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      return data._embedded ? data._embedded.events.map(formatEvent) : [];
    } catch (err) {
      console.error("❌ Error fetching events:", err);
      return [];
    }
  }
}

/**
 * Fetch a single event by ID.
 */
async function fetchEventById(id) {
  if (USE_MOCK_DATA) {
    try {
      const response = await fetch(getDataJsonUrl());
      const data = await response.json();
      console.log("📂 Loaded events:", data);
      console.log("🔎 Looking for ID:", id);
      const found = data.find(event => event.id === id);
      console.log("✅ Found event:", found);
      return found;
    } catch (err) {
      console.error("❌ Error loading mock event:", err);
      return null;
    }
  } else {
    const url = `https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${TICKETMASTER_API_KEY}`;
    try {
      const response = await fetch(url);
      const event = await response.json();
      return formatEvent(event);
    } catch (err) {
      console.error("❌ Error fetching event by ID:", err);
      return null;
    }
  }
}

/**
 * Format event object for consistency.
 */
function formatEvent(event) {
  return {
    id: event.id,
    name: event.name,
    date: event.dates?.start?.localDate || "",
    time: event.dates?.start?.localTime || "",
    venue: event._embedded?.venues?.[0]?.name || "",
    city: event._embedded?.venues?.[0]?.city?.name || "",
    category: event.classifications?.[0]?.segment?.name?.toLowerCase() || "",
    image: event.images?.[0]?.url || "placeholder.jpg",
    url: event.url || "",
    description: event.info || event.pleaseNote || "No description available.",
    price: event.priceRanges?.[0]?.min
      ? `${event.priceRanges[0].min} - ${event.priceRanges[0].max} ${event.priceRanges[0].currency}`
      : "TBA"
  };
}

/**
 * Build Google Maps embed URL for a venue.
 */
function getMapEmbedUrl(venueName) {
  return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(venueName)}`;
}
