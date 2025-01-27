const locations = [
    { name: "1. The Commodore Inn", lat: 54.228517801041455, lng: -2.9093019885160087 },
    { name: "2. The Screes Inn", lat: 54.45587337424352, lng: -3.35150170105879 }, 
    { name: "3. Watchtree Nature Reserve", lat: 54.90997860874174, lng: -3.0905764048378943 }, 
    { name: "4. The Kings Head Kirby Stephen", lat: 54.46864472506169, lng: -2.4303786047828804 }, 
    { name: "5. Watchday nature reserver", lat: 54.90208328078605, lng: -3.086811718433345 }, 
    { name: "6. The Crossings Inn", lat: 55.073850297332285, lng: -2.762715034706338}, 
    { name: "7. Graham Arms Inn Carlisle", lat: 55.04396214453601, lng: -2.968708689617571 }, 
    { name: "8. Plough Inn Wray", lat: 54.853097790934235, lng: -2.887329331992143 }, 
    { name: "9. Maes Tea room and gallery", lat: 54.74860763983286, lng:  -3.161987538540455 }, 
    { name: "10. Hundith Hill Hotel", lat: 54.675621334599256, lng: -3.3377687907313747 },
    { name: "11. The Barista Wigton", lat: 54.853097790934235, lng: -3.1592409564749717 }, 

    { name: "12. The Old Bank Tearooms", lat: 54.80416650169004, lng: -3.3187401141001454 },
    { name: "13. Catering Van Nethertown Square", lat: 54.52139907861723, lng:  -3.5961449027139394 },
    { name: "14. Lowther Arms Community Pub", lat: 54.83739699294534, lng: -3.4231102325885034  },
    { name: "15. Watermill Inn and Brewery", lat: 54.40965863751213, lng: -2.8545677450334987 }, 
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
