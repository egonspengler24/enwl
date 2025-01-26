const locations = [
    { name: "Location 1", lat: 35.6895, lng: 139.6917 },
    { name: "Location 2", lat: 34.0522, lng: -118.2437 },
    // Add more locations here
];

function sortLocations() {
    const postcode = document.getElementById('postcode').value;
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ 'address': postcode }, function(results, status) {
        if (status == 'OK') {
            const origin = results[0].geometry.location;
            const service = new google.maps.DistanceMatrixService();

            const destinationCoords = locations.map(loc => new google.maps.LatLng(loc.lat, loc.lng));

            service.getDistanceMatrix({
                origins: [origin],
                destinations: destinationCoords,
                travelMode: 'DRIVING',
            }, function(response, status) {
                if (status == 'OK') {
                    const distances = response.rows[0].elements;
                    for (let i = 0; i < locations.length; i++) {
                        if (distances[i].status === 'OK') {
                            locations[i].distance = distances[i].distance.value;
                            locations[i].duration = distances[i].duration.value;
                        } else {
                            locations[i].distance = Infinity;
                            locations[i].duration = Infinity;
                        }
                    }

                    locations.sort((a, b) => a.distance - b.distance);

                    displayLocations();
                }
            });
        }
    });
}

function displayLocations() {
    const list = document.getElementById('locationList');
    list.innerHTML = '';

    locations.forEach(location => {
        const listItem = document.createElement('li');
        listItem.textContent = `${location.name} - ${location.distance !== Infinity ? (location.distance / 1000).toFixed(2) + ' km' : 'N/A'} - ${location.duration !== Infinity ? (location.duration / 60).toFixed(2) + ' mins' : 'N/A'}`;
        list.appendChild(listItem);
    });
}

// Fetch locations when the page loads
fetchLocations();
