// Initialize the map and marker functionality
async function init() {
  // Ensure that the gmp-map custom element is defined
  await customElements.whenDefined('gmp-map');

  const map = document.querySelector('gmp-map');  // Reference to the map element
  const placePicker = document.querySelector('gmpx-place-picker');  // Reference to the place picker
  const infowindow = new google.maps.InfoWindow();  // Info window to display place info

  // Optional: Hide map type control
  map.innerMap.setOptions({
    mapTypeControl: false,
  });

  // Hardcoded marker location (for example)
  const hardcodedLatLng = { lat: 18.1, lng: -42.9 }; // event coordinates

  // Add a hardcoded marker to the map
  const hardcodedMarker = new google.maps.Marker({
    position: hardcodedLatLng,  // Hardcoded marker position
    map: map.innerMap,  // Attach marker to the map
    title: '** Tropical Storm Joyce **',  // Tooltip text
  });

  // Add info window to the hardcoded marker
  infowindow.setContent(`<strong>Tropical Storm Joyce</strong><br><span>Coordinates: 18.1, -42.9</span>`);
  infowindow.open(map.innerMap, hardcodedMarker);

  // Handle place change event from place picker
  placePicker.addEventListener('gmpx-placechange', () => {
    const place = placePicker.value;

    // Check if a valid location was returned
    if (!place.location) {
      window.alert("No details available for input: '" + place.name + "'");
      infowindow.close();
      return;
    }

    // Set the map center and zoom based on the selected place
    if (place.viewport) {
      map.innerMap.fitBounds(place.viewport);
    } else {
      map.center = place.location;
      map.zoom = 17;
    }

    // Create or move the marker to the selected location
    const newMarker = new google.maps.Marker({
      position: place.location,  // Marker position based on place picker selection
      map: map.innerMap,  // Attach it to the map
      title: place.displayName,  // Tooltip text
    });

    // Display info window with selected place details
    infowindow.setContent(
      `<strong>${place.displayName}</strong><br><span>${place.formattedAddress}</span>`
    );
    infowindow.open(map.innerMap, newMarker);  // Open the info window on the new marker
  });
}

// Load the map and marker functionality when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
