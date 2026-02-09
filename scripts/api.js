const USE_MOCK_DATA = true;
const TICKETMASTER_API_KEY = "YOUR_TICKETMASTER_KEY";
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_KEY";

/**
 * Fetch events by city, category, and optional date range.
 */
async function fetchEvents(city, category, startDate, endDate) {
  if (USE_MOCK_DATA) {
    const response = await fetch("data.json");
    const data = await response.json();

    console.log("🔍 Raw events:", data);
    console.log("📌 Filters -> City:", city, "Category:", category, "Dates:", startDate, endDate);

    const filtered = data.filter(event => {
      const matchCity = city ? event.city.toLowerCase().includes(city.toLowerCase()) : true;
      const matchCategory = category ? event.category.toLowerCase().includes(category.toLowerCase()) : true;
      const matchDate =
        startDate && endDate
          ? new Date(event.date) >= new Date(startDate) && new Date(event.date) <= new Date(endDate)
          : true;
      return matchCity && matchCategory && matchDate;
    });

    console.log("✅ Results:", filtered);
    return filtered;
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
    const response = await fetch("data.json");
    const data = await response.json();
    return data.find(event => event.id === id);
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
 * Format event object for consistency (so favorites can store full details).
 */
function formatEvent(event) {
  return {
    id: event.id,
    name: event.name,
    date: event.dates?.start?.localDate || "",
    time: event.dates?.start?.localTime || "",
    venue: event._embedded?.venues?.[0]?.name || "",
    city: event._embedded?.venues?.[0]?.city?.name || "",
    category: event.classifications?.[0]?.segment?.name || "",
    image: event.images?.[0]?.url || "placeholder.jpg",
    url: event.url || ""
  };
}

/**
 * Build Google Maps embed URL for a venue.
 */
function getMapEmbedUrl(venueName) {
  return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(venueName)}`;
}
