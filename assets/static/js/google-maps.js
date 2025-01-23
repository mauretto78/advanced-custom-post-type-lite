
/**
 * ===================================================================
 * COMMON FUNCTIONS
 * ===================================================================
 */

const DEFAULT_LAT = 51.505;
const DEFAULT_LNG = -0.09;
const DEFAULT_CITY = 'London';
const ADDRESS_MULTI_STRING_SEPARATOR = '___###___';

/**
 *
 * @param address
 * @return {Promise<any>}
 */
const fetchAddress = async(address) => {

    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${address}&format=json`,
        {
            headers: {
                'User-Agent': 'advanced-custom-post-type'
            }
        }
    );

    return await response.json();
};

/**
 *
 * @param lat
 * @param lng
 * @return {v|D}
 */
const coordinates = (lat, lng) => {
    return new google.maps.LatLng(lat, lng);
};

/**
 *
 * @param url
 * @return {{scaledSize: AtRule.Size | ParseState.Size, size: AtRule.Size | ParseState.Size, origin: (Point|p|*|k), anchor: (Point|p|*|k), url: *}}
 */
const createIcon = (url) => {
    return {
        url: url,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
    }
};

/**
 * Add a single point on the map
 *
 * @param map
 * @param position
 * @param icon
 * @param title
 * @return {Property.Marker | s}
 */
const addPointOnMap = (map, position, icon = null, title = null) => {
    return new google.maps.Marker({
        map,
        icon: createIcon('https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png'),
        position: position,
        title: title
    });
};

/**
 * Add a seach result on the map
 *
 * @param map
 * @param place
 * @param markers
 * @param bounds
 */
const addPlaceOnMap = (map, place, markers, bounds) => {

    if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
    }

    // Create a marker for each place.
    markers.push(addPointOnMap(map, place.geometry.location, place.icon, place.name));

    if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
    } else {
        bounds.extend(place.geometry.location);
    }
};

/**
 *
 * @param mapPreview
 * @return {{searchBoxIdSelector: *, searchBoxCity: string, selections: *, googlePlaceholderId: string, mapPreviewIdSelector: *, searchBoxLng: string, lngSelector: *, searchBoxLat: string, mapPreviewId: *, citySelector: *, searchBoxId: *, latSelector: *}}
 */
const extractMapElements = (mapPreview) => {

    const mapPreviewId = mapPreview.getAttribute('id');
    const searchBoxId = mapPreviewId.slice(0, -4);
    const searchBoxLat = searchBoxId + "_lat";
    const searchBoxLng = searchBoxId + "_lng";
    const searchBoxCity = searchBoxId + "_city";
    const selectionsId = searchBoxId + "_selections";
    const googlePlaceholderId = searchBoxId + "_google_placeholder";

    const latSelector = document.getElementById(searchBoxLat);
    const lngSelector = document.getElementById(searchBoxLng);
    const citySelector = document.getElementById(searchBoxCity);
    const mapPreviewIdSelector = document.getElementById(mapPreviewId);
    const searchBoxIdSelector = document.getElementById(searchBoxId);
    const selections = document.getElementById(selectionsId);
    const googlePlaceholderSelector = document.getElementById(googlePlaceholderId);

    return {
        mapPreviewId,
        searchBoxId,
        googlePlaceholderId,
        googlePlaceholderSelector,
        searchBoxLat,
        searchBoxLng,
        searchBoxCity,
        searchBoxIdSelector,
        mapPreviewIdSelector,
        selections,
        latSelector,
        lngSelector,
        citySelector
    };
};

/**
 *
 * @param id
 * @param defaultLat
 * @param defaultLng
 * @return {*}
 */
const initTheMap = (id, defaultLat, defaultLng) => {
    return new google.maps.Map(id, {
        center: { lat: parseFloat(defaultLat), lng: parseFloat(defaultLng) },
        zoom: 18,
        mapTypeId: "roadmap",
    });
};

/**
 *
 * @param input
 * @param map
 * @return {l|p}
 */
const addSearchControl = (input, map) => {

    const searchBox = new google.maps.places.SearchBox(input);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds());
    });

    return searchBox;
};

/**
 *
 * @param place
 */
const extractCity = (place) => {

    let city;

    if(place.address_components && place.address_components.length > 0){

        place.address_components.forEach((address_component, index) => {
            if(address_component.types.includes('locality') ){
                city = address_component.long_name ? address_component.long_name : address_component.short_name;
            }
        });
    }

    return city;
};

/**
 * Add item to selection
 * (used by addItemToMap)
 *
 * @param selections
 * @param display_name
 * @param index
 * @param lat
 * @param lng
 */
const addItemToSelections = (selections, display_name, index, lat, lng) => {
    selections.innerHTML += `
            <div class="selection" data-index="${index}" data-lat="${lat}" data-lng="${lng}">
                <span class="acpt_map_multi_selection">
                    ${display_name}
                </span>
                <a class="acpt_map_delete_multi_selection button button-danger">-</a>
            </div>
        `;
};

/**
 *
 * @param value
 * @param input
 */
const addValueToAnInput = (value, input) => {

    const savedValues = input.value;
    const savedValuesArray = savedValues ? savedValues.split(ADDRESS_MULTI_STRING_SEPARATOR) : [];

    savedValuesArray.push(value);

    input.value = savedValuesArray.join(ADDRESS_MULTI_STRING_SEPARATOR);
};

/**
 *
 * @param index
 * @param input
 */
const deleteValueFromAnInput = (index, input) => {

    const savedValues = input.value;
    const savedValuesArray = savedValues ? savedValues.split(ADDRESS_MULTI_STRING_SEPARATOR) : [];

    if(savedValuesArray[index]){
        savedValuesArray.splice(index, 1);
    }

    input.value = savedValuesArray.join(ADDRESS_MULTI_STRING_SEPARATOR);
};

/**
 * ===================================================================
 * RUN ADDRESS FIELD
 * ===================================================================
 */

async function initAutocomplete() {

    // loop
    const mapPreviews = document.getElementsByClassName( "acpt_map_preview" );

    for ( let i = 0; i < mapPreviews.length; i++) {

        const mapPreview = mapPreviews.item(i);
        const {
            mapPreviewId,
            searchBoxIdSelector,
            mapPreviewIdSelector,
            latSelector,
            lngSelector,
            citySelector
        } = extractMapElements(mapPreview);

        let defaultLat = (latSelector.value !== '') ? latSelector.value : DEFAULT_LAT;
        let defaultLng = (lngSelector.value !== '') ? lngSelector.value : DEFAULT_LNG;
        let defaultCity = citySelector.value ? citySelector.value : DEFAULT_CITY;

        // if there is a default value but not the coordinates, autosubmit the search
        if (searchBoxIdSelector.value && !latSelector.value && !lngSelector.value) {
            const fAddress = await fetchAddress(searchBoxIdSelector.value);

            if (fAddress.length > 0) {
                defaultLat = fAddress[0].lat;
                defaultLng = fAddress[0].lon;
            }
        }

        const map = initTheMap(mapPreviewIdSelector, defaultLat, defaultLng);

        if(typeof map.center !== 'undefined'){

            mapPreview.classList.remove('loading');

            // Create the search box and link it to the UI element.
            const searchBox = addSearchControl(searchBoxIdSelector, map);

            // Add the default marker
            let defaultMarker = addPointOnMap(map, coordinates(defaultLat, defaultLng));
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

                    addPlaceOnMap(map, place, markers, bounds);

                    // save coordinates and the city
                    latSelector.value =  (searchBoxIdSelector.value !== '') ? place.geometry.location.lat() : null;
                    lngSelector.value =  (searchBoxIdSelector.value !== '') ? place.geometry.location.lng() : null;
                    citySelector.value = extractCity(place);
                });

                map.fitBounds(bounds);
            });

            // listen on reset map
            document.addEventListener("acpt-reset-map", function(e){
                if(e.detail.fieldId === mapPreviewId){
                    console.log(`Resetting map ${mapPreviewId}...`);

                    const center = coordinates(DEFAULT_LAT, DEFAULT_LNG);

                    defaultMarker.setMap(null);
                    defaultMarker = addPointOnMap(map, center);
                    defaultMarker.setMap(map);

                    map.panTo(center);
                }
            });

        } else {
            mapPreviewIdSelector.innerHTML = "Please refresh the page to see the map.";
        }
    }
}

/**
 * ===================================================================
 * RUN ADDRESS MULTI FIELD
 * ===================================================================
 */

async function initMultiAddress() {

    // loop
    const mapPreviews = document.getElementsByClassName("acpt_map_multi_preview");

    for ( let i = 0; i < mapPreviews.length; i++) {

        const mapPreview = mapPreviews.item(i);
        const {
            selections,
            mapPreviewId,
            searchBoxIdSelector,
            mapPreviewIdSelector,
            googlePlaceholderSelector,
            latSelector,
            lngSelector,
            citySelector
        } = extractMapElements(mapPreview);

        let defaultValues = searchBoxIdSelector.value ? searchBoxIdSelector.value.split(ADDRESS_MULTI_STRING_SEPARATOR) : [];
        let defaultLatValues = latSelector.value ? latSelector.value.split(ADDRESS_MULTI_STRING_SEPARATOR) : [];
        let defaultLngValues = lngSelector.value ? lngSelector.value.split(ADDRESS_MULTI_STRING_SEPARATOR) : [];
        let defaultCityValues = citySelector.value ? citySelector.value.split(ADDRESS_MULTI_STRING_SEPARATOR) : [];

        let defaultLat = (latSelector.value !== '') ? latSelector.value : DEFAULT_LAT;
        let defaultLng = (lngSelector.value !== '') ? lngSelector.value : DEFAULT_LNG;
        let defaultCity = citySelector.value ? citySelector.value : DEFAULT_CITY;

        const map = initTheMap(mapPreviewIdSelector, defaultLat, defaultLng);

        if(typeof map.center !== 'undefined') {

            mapPreview.classList.remove('loading');

            // Create the search box and link it to the UI element.
            const input = googlePlaceholderSelector;
            const searchBox = new google.maps.places.SearchBox(input);

            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            // Bias the SearchBox results towards current map's viewport.
            map.addListener("bounds_changed", () => {
                searchBox.setBounds(map.getBounds());
            });

            // add saved values
            let markers = [];

            if(defaultValues.length > 0){
                defaultValues.map((value, index) => {
                    markers.push(addPointOnMap(map, coordinates(defaultLatValues[index], defaultLngValues[index]), null, value));
                });
            }

            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            searchBox.addListener("places_changed", () => {

                const places = searchBox.getPlaces();

                if (places.length === 0) {
                    return;
                }

                // For each place, get the icon, name and location.
                const bounds = new google.maps.LatLngBounds();

                places.forEach((place) => {

                    const address = place.formatted_address;
                    const city = extractCity(place);
                    const lat = place.geometry.location.lat();
                    const lng = place.geometry.location.lng();

                    addPlaceOnMap(map, place, markers, bounds);
                    addItemToSelections(selections, address, selections.children.length, lat, lng);

                    addValueToAnInput(address, searchBoxIdSelector);
                    addValueToAnInput(lat, latSelector);
                    addValueToAnInput(lng, lngSelector);
                    addValueToAnInput(city, citySelector);
                });

                map.fitBounds(bounds);
            });

            /**
             * Click on selection items and fly to the corresponding point on the map
             */
            $('body').on('click', '.acpt_map_multi_selection', function(e) {
                const $this = $(this);
                const lat = $this.parent().data("lat");
                const lng = $this.parent().data("lng");

                if(lat && lng){
                    const center = coordinates(lat, lng);
                    map.panTo(center);
                }
            });

            /**
             * Delete an item
             */
            $('body').on('click', '.acpt_map_delete_multi_selection', function(e) {
                const $this = $(this);
                const lat = $this.parent().data("lat");
                const lng = $this.parent().data("lng");
                const index = $this.parent().data("index");

                markers.map((marker) => {

                    if(lat === marker.position.lat() && lng === marker.position.lng()){

                        // remove from values
                       deleteValueFromAnInput(index, searchBoxIdSelector);
                       deleteValueFromAnInput(index, latSelector);
                       deleteValueFromAnInput(index, lngSelector);
                       deleteValueFromAnInput(index, citySelector);

                        // remove from map
                        marker.setMap(null);

                       // remove from sidebar
                       $this.parent().remove();
                    }
                });
            });
        }
    }
}