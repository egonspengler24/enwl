const locations = [
    { name: "1. The Commodore Inn (Breakfast 9am to 10am)", lat: 54.265915681569346, lng: -2.9245598619938904 }, 
    { name: "3. The Kings Head Kirby Stephen (from 8:30am) ", lat: 54.46864472506169, lng: -2.4303786047828804 }, 
    { name: "4. Watchday nature reserver (from 9am)", lat: 54.90208328078605, lng: -3.086811718433345 }, , 
    { name: "5. The Crossings Inn (from 11am)", lat: 55.073850297332285, lng: -2.762715034706338}, 
    { name: "6. Graham Arms Inn Carlisle (12pm till 8pm)", lat: 55.04396214453601, lng: -2.968708689617571 }, 
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
        const listItem = document.createElement('li');
        listItem.textContent = `${location.name} - ${location.distance !== Infinity ? (location.distance / 1000).toFixed(2) + ' km' : 'N/A'} - ${location.duration !== Infinity ? (location.duration / 60).toFixed(2) + ' mins' : 'N/A'}`;
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
        url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png', // Green icon for input location
    };

    const destinationIcon = {
        url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png', // Red icon for nearest location
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
