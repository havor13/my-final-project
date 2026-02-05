const USE_MOCK_DATA = true;
const TICKETMASTER_API_KEY = "YOUR_TICKETMASTER_KEY";
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_KEY";

async function fetchEvents(city, category) {
  if (USE_MOCK_DATA) {
    const response = await fetch("data.json");
    const data = await response.json();

    console.log("🔍 Raw events:", data);
    console.log("📌 Filters -> City:", city, "Category:", category);

    const filtered = data.filter(event => {
      const matchCity = city ? event.city.toLowerCase().includes(city.toLowerCase()) : true;
      const matchCategory = category ? event.category.toLowerCase().includes(category.toLowerCase()) : true;
      return matchCity && matchCategory;
    });

    console.log("✅ Results:", filtered);
    return filtered;
  } else {
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TICKETMASTER_API_KEY}&city=${city}&classificationName=${category}`;
    const response = await fetch(url);
    const data = await response.json();
    return data._embedded ? data._embedded.events : [];
  }
}

async function fetchEventById(id) {
  if (USE_MOCK_DATA) {
    const response = await fetch("data.json");
    const data = await response.json();
    return data.find(event => event.id === id);
  } else {
    const url = `https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${TICKETMASTER_API_KEY}`;
    const response = await fetch(url);
    return await response.json();
  }
}

function getMapEmbedUrl(venueName) {
  return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(venueName)}`;
}
