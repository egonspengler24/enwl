function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: 51.5074, lng: -0.1278 }, // Adjust initial zoom level and center as needed
  });

  // Load list data (replace with your logic)
  fetch("https://maps.app.goo.gl/LrNMXAQBYiRvPEaZ6")
    .then((response) => response.json())
    .then((listPoints) => {
      window.listPoints = listPoints; // Store list points for later use
      listPoints.forEach((point) => {
        const marker = new google.maps.Marker({
          position: point,
          map: map,
        });
      });
    });
}

function calculateDistances() {
  const postcode = document.getElementById("postcode").value;
  const geocoder = new google.maps.Geocoder();

  geocoder.geocode({ address: postcode }, (results, status) => {
    if (status === "OK") {
      const userLocation = results[0].geometry.location;
      const resultsContainer = document.getElementById("results");
      resultsContainer.innerHTML = ""; // Clear previous results

      window.listPoints.forEach((point, index) => {
        const distanceMatrixService = new google.maps.DistanceMatrixService();
        distanceMatrixService.calculateDistanceMatrix({
          origins: [userLocation],
          destinations: [point],
          travelMode: "driving", // Adjust travel mode as needed
        }, (response, status) => {
          if (status === "OK") {
            const distance = response.rows[0].elements[0].distance.value;
            const distanceText = formatDistance(distance);
            resultsContainer.innerHTML += `<p>Point ${index + 1}: ${distanceText} away</p>`;
          } else {
            console.error("Distance calculation failed:", status);
          }
        });
      });
    } else {
      alert("Geocoding failed: " + status);
    }
  });
}

function formatDistance(distance) {
  // Convert meters to kilometers or miles as needed
  const km = distance / 1000;
  const miles = km / 1.60934;
  return Math.round(km) + " km" + " (" + Math.round(miles) + " miles)";
}
