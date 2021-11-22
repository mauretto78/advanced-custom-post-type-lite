function initAutocomplete() {

    // loop
    const mapPreviews = document.getElementsByClassName( "map_preview" );
    for ( let i = 0; i < mapPreviews.length; i++) {

        const mapPreview = mapPreviews.item(i);
        const mapPreviewId = mapPreview.getAttribute('id');
        const searchBoxId = mapPreviewId.slice(0, -4);
        const searchBoxLat = searchBoxId + "_lat";
        const searchBoxLng = searchBoxId + "_lng";

        const latSelector = document.getElementById(searchBoxLat);
        const lngSelector = document.getElementById(searchBoxLng);
        const mapPreviewIdSelector = document.getElementById(mapPreviewId);
        const searchBoxIdSelector = document.getElementById(searchBoxId);

        const defaultLat = (latSelector.value !== '') ? latSelector.value : -33.8688;
        const defaultLng = (lngSelector.value !== '') ? lngSelector.value : 151.2195;

        const map = new google.maps.Map(mapPreviewIdSelector, {
            center: { lat: parseFloat(defaultLat), lng: parseFloat(defaultLng) },
            zoom: 18,
            mapTypeId: "roadmap",
        });

        // Create the search box and link it to the UI element.
        const input = searchBoxIdSelector;
        const searchBox = new google.maps.places.SearchBox(input);

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener("bounds_changed", () => {
            searchBox.setBounds(map.getBounds());
        });

        // Add the default marker
        const defaultMarkerCenter = new google.maps.LatLng( defaultLat, defaultLng );
        const defaultMarker = new google.maps.Marker({
            icon: {
                url: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png',
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25),
            },
            position: defaultMarkerCenter,
        });
        defaultMarker.setMap(map);

        let markers = [];

        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener("places_changed", () => {

            const places = searchBox.getPlaces();

            if (places.length === 0) {
                return;
            }
            // Clear out the old markers.
            markers.forEach((marker) => {
                marker.setMap(null);
            });
            markers = [];
            // For each place, get the icon, name and location.
            const bounds = new google.maps.LatLngBounds();
            places.forEach((place) => {
                if (!place.geometry || !place.geometry.location) {
                    console.log("Returned place contains no geometry");
                    return;
                }

                console.log(place.icon);

                const icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25),
                };
                // Create a marker for each place.
                markers.push(
                    new google.maps.Marker({
                        map,
                        icon,
                        title: place.name,
                        position: place.geometry.location,
                    })
                );

                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }

                // save coordinates
                latSelector.value =  (searchBoxIdSelector.value !== '') ? place.geometry.location.lat() : null;
                lngSelector.value =  (searchBoxIdSelector.value !== '') ? place.geometry.location.lng() : null;
            });

            map.fitBounds(bounds);
        });
    }
}