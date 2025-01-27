const locations = [
    { name: "1. The Kings Arms Stainton", lat: 54.720398785748024, lng: -2.8119654466647237, description: "Serving hot food and drink." },
    { name: "2. The Tavern Hale", lat: 54.270579424973214, lng: -2.762526969486028, description: "Serving hot food and drink." },
    { name: "3. Southwards catering St Bees", lat: 54.55189826318497, lng: -3.602981081523861, description: "Serving hot food and drink." }, 
    { name: "4. The Commodore Inn", lat: 54.260954968253756, lng: -2.9108424010221152, description: "Serving hot food and drink." }, 
    { name: "5. Landy Chef Catering Van Moresby Park Whitehaven", lat: 54.63782539893566, lng: -3.5370631119522664, description: "Serving hot food and drink."}, 
    { name: "6. Graham Arms Inn Longtown", lat: 55.055308764187735, lng: -2.960280878200811, description: "Serving hot food and drink." }, 
    { name: "7. Kings Head Hotel Kirby Stephen", lat: 54.4633952407491, lng: -2.4353157080325967, description: "Serving hot food and drink." }, 
    { name: "8. Southwards Farm Shop Swarthmoor", lat: 54.22163177842559, lng:-3.119214642337905, description: "Serving hot food and drink." },
    { name: "9. Hundiith Hill Hotel Cockermouth", lat: 54.67833910277971, lng: -3.322461715183655, description: "Serving hot food and drink." },
    { name: "10. The Strands Hotel Seascale", lat: 54.45381586086482, lng: -3.338941207576554, description: "Serving hot food and drink." }, 
    { name: "11. Maes Tea Rooms and Gallery", lat: 54.756075660633144, lng: -3.1713996640820725, description: "Serving hot food and drink." }, 
    // Add more locations here
];

let map;
let originMarker;
let destinationMarker;

function initMap() {
    const initialLocation = { lat: 54.55110183921372, lng: -3.0835090379866132 }; 
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: initialLocation
    });
 sortLocations();
}

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
                    updateMap(origin, locations[0]);
                }
            });
        }
    });
}

function displayLocations() {
    const list = document.getElementById('locationList');
    list.innerHTML = '';

   locations.forEach(location => {
        const distanceInMiles = location.distance !== Infinity ? (location.distance / 1609.34).toFixed(2) : 'N/A';
        const durationInMinutes = location.duration !== Infinity ? Math.round(location.duration / 60) : 'N/A';
        const listItem = document.createElement('li');
        listItem.innerHTML = `${location.name} - ${distanceInMiles} miles - ${durationInMinutes} mins<br><i>${location.description}</i>`;
        list.appendChild(listItem);
    });
}

function updateMap(origin, nearestLocation) {
    if (originMarker) {
        originMarker.setMap(null);
    }
    if (destinationMarker) {
        destinationMarker.setMap(null);
    }

    const originIcon = {
        url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png', // Green icon for input location
    };

    const destinationIcon = {
        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', // Red icon for nearest location
    };

    originMarker = new google.maps.Marker({
        position: origin,
        map: map,
        title: 'Postcode Location',
        icon: originIcon
    });

    destinationMarker = new google.maps.Marker({
        position: { lat: nearestLocation.lat, lng: nearestLocation.lng },
        map: map,
        title: nearestLocation.name,
        icon: destinationIcon
    });

    map.setCenter(origin);
    map.setZoom(12);
}

// Initialize the map when the page loads
initMap();
