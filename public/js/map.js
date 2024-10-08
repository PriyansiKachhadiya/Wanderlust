    // Initialize the map once
    var map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    // Global variable for marker
    var marker;

    function getCoordinates(location) {
      var url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data && data.length > 0) {
            var lat = data[0].lat;
            var lon = data[0].lon;

            // Update the map with the new location
            map.setView([lat, lon], 13);

            // Remove the existing marker, if any
            if (marker) {
              map.removeLayer(marker);
            }
          

            // Add a new marker
        marker = L.marker([lat, lon]).addTo(map);
            marker.bindPopup(location).openPopup();
          } else {
            alert('Location not found');
          }
        })
        .catch(error => console.error('Error:', error));
    }

    getCoordinates(listingLocation);


