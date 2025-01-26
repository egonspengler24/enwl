const locations = [
    { name: "1. The Kings Arms Stainton", lat: 54.720398785748024, lng: -2.8119654466647237 },
    { name: "2. The Tavern Hale", lat: 54.270579424973214, lng: -2.762526969486028 },
    { name: "3. Southwards catering St Bees", lat: 54.55189826318497, lng: -3.602981081523861 }, 
    { name: "4. The Commodore Inn", lat: 54.260954968253756, lng: -2.9108424010221152 }, 
    { name: "5. Landy Chef Catering Van Moresby Park Whitehaven", lat: 54.63782539893566, lng: -3.5370631119522664}, 
    { name: "6. Graham Arms Inn Longtown", lat: 55.055308764187735, lng: -2.960280878200811 }, 
    { name: "7. Barista Cafe Wigton", lat: 54.87872211581227, lng: -3.1140894738678666 }, 
    { name: "8. Kings Head Hotel Kirby Stephen", lat: 54.4633952407491, lng: -2.4353157080325967 }, 
    { name: "9. Southwards Farm Shop Swarthmoor", lat: 54.22163177842559, lng:-3.119214642337905 },
    { name: "10. Hundiith Hill Hotel Cockermouth", lat: 54.67833910277971, lng: -3.322461715183655 },
    { name: "11. The Strands Hotel Seascale", lat: 54.45381586086482, lng: -3.338941207576554 }, 

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
 sortLocations();
