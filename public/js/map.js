
        // Initialize Leaflet Map
        if(coordinates.length > 0){
        const map = L.map('map').setView(coordinates, 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; WanderLust'
        }).addTo(map);

        // Add marker
        L.marker(coordinates)
          .addTo(map)
          .bindPopup("Welcome to Wanderlust")
          .openPopup();
      } else {
        const add = listing.location;
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(add)}&key=${KEY}`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    const result = data.results[0];
    const { lat, lng } = result.geometry;
      const map = L.map('map').setView([lat,lng], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy;WanderLust'
        }).addTo(map);

        // Add marker
        L.marker([lat,lng])
          .addTo(map)
          .bindPopup("Welcome to Wanderlust")
          .openPopup();
  })
  .catch(error => {
    console.error('Error:', error);
  });
}