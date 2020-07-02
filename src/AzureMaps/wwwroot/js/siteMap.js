// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
var map;
var popupTemplate;
var popup;
var azureMapsSubscriptionKey = '';
var vehicleDataSource;

function GetMapDemo() {
    //Initialize a map instance.
    map = new atlas.Map('myMap', {
        center: [-111.9194154, 40.986327],
        //center: [-77.03503847122192, 38.906713705035514],
        zoom: 14,
        //Add your Azure Maps key to the map SDK. Get an Azure Maps key at https://azure.com/maps. NOTE: The primary key should be used as the key.
        authOptions: {
            authType: 'subscriptionKey',
            subscriptionKey: azureMapsSubscriptionKey
        }
    });

    // Create a popup but leave it closed for now
    popup = new atlas.Popup({
        pixelOffset: [0, -18],
        closeButton: true
    });

    // Define an HTML template for the popup content
    popupTemplate = '<div class="popup-dialog"><div class="header">{header}</div><div class="details">{details}</div>';

    //Wait for map resources to be ready before loading controls.
    map.events.add('ready', addControls);
}

function addControls() {
    // Add Map Controls
    addMapControls();

    // Add Zones
    addZones();

    // Add Vehicles
    addVehicles();
}

function addMapControls() {
    var controlsPosition = "top-left";

    //Add Zoom control to the map.
    map.controls.add(new atlas.control.ZoomControl(), {
        position: controlsPosition
    });

    //Add Pitch control to the map.
    map.controls.add(new atlas.control.PitchControl(), {
        position: controlsPosition
    });

    //Add style control to the map.
    var styleControl = new atlas.control.StyleControl(
        {
            mapStyles: ['road', 'grayscale_dark', 'night', 'satelite']
        }
    );

    map.controls.add(styleControl, {
        position: controlsPosition
    });
}

function addZones() {
    // Add a data source for the zones
    var zoneDataSource = new atlas.source.DataSource();
    map.sources.add(zoneDataSource);

    // Add a polygon layer to render the zones
    var zonePolygonLayer = new atlas.layer.PolygonLayer(zoneDataSource, null, {
        fillColor: '#ffe0b3',
        fillOpacity: 0.3
    });
    map.layers.add(zonePolygonLayer);

    // Create a line layer to render the outline of the polygons
    var zoneLineLayer = new atlas.layer.LineLayer(zoneDataSource, null, {
        strokeColor: '#ffc266',
        strokeWidth: 1
    });
    map.layers.add(zoneLineLayer);

    // Load zone areas in the zone data source
    zoneDataSource.add(getZonesData());
}

function getAddress(coordinate, callback) {

    // Compose the search API url with the latitude/longitude query
    var apiRequestUrl = 'https://atlas.microsoft.com/search/address/reverse/json?subscription-key='
        + azureMapsSubscriptionKey + '&api-version=1.0&query=' + coordinate[1] + ',' + coordinate[0];

    console.log('url', apiRequestUrl);

    // Execute the request
    httpGet(apiRequestUrl, (data) => {

        // Log returned json to console
        console.log('data', data);

        // Parse the returned json
        var jsonParsed = JSON.parse(data);

        // Find address
        var address = jsonParsed.addresses && jsonParsed.addresses.length > 0
            ? jsonParsed.addresses[0].address.freeformAddress
            : '(Unknown address)';

        callback(address);

    });
}

function httpGet(url, callback) {
    // compatible with IE7+, Firefox, Chrome, Opera, Safari
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            callback(xmlhttp.responseText);
        }
    }

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function getZonesData() {
    // Simulate retrieval of zone data from the backend
    var data = {
        type: 'FeatureCollection',
        features: [
            {
                'type': 'Feature',
                'id': '1',
                'geometry': {
                    'type': 'Polygon',
                    "coordinates": [
                        [
                            [-111.9357913543228, 40.984552406046674],
                            [-111.93501887812688, 40.98374249579467],
                            [-111.934021096373, 40.982738193267835],
                            [-111.93426785960241, 40.98253571106696],
                            [-111.93449316515989, 40.98240612213263],
                            [-111.93474054335645, 40.9825992390395],
                            [-111.93516908183139, 40.9829730718418],
                            [-111.93555531992959, 40.98336993373846],
                            [-111.93657517432287, 40.982858415895066],
                            [-111.93726181983051, 40.98251824606325],
                            [-111.93731907551688, 40.98313250680263],
                            [-111.93715814297616, 40.983553665270676],
                            [-111.93701444163369, 40.98379918983579],
                            [-111.93697152628935, 40.98402596551438],
                            [-111.93685350909297, 40.984309434015614],
                            [-111.93661808966705, 40.98450254534899],
                            [-111.936060190192, 40.98471312054514],
                            [-111.935802083159, 40.984552406046674]]
                    ]
                },
                'properties': {
                }
            },
            {
                'type': 'Feature',
                'id': '2',
                'geometry': {
                    'type': 'Polygon',
                    "coordinates": [
                        [
                            [-111.91858111252543, 40.979749225701966],
                            [-111.9179666823078, 40.98019891935712],
                            [-111.91673313156652, 40.979214546579016],
                            [-111.9173241102486, 40.978786091968146],
                            [-111.91857642221817, 40.97975276660878]]
                    ]
                },
                'properties': {
                }
            }
        ]
    };

    return data;
}

function getVehiclesData() {

    // Simulate retrieval of vehicle data from the backend
    var data = {
        type: 'FeatureCollection',
        features: [
            {
                'type': 'Feature',
                'id': '1',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [-111.9094154, 40.986327]
                },
                'properties': {
                    'vehicleType': 'truck',
                    'fleetNumber': '1984'
                }
            },
            {
                'type': 'Feature',
                'id': '2',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [-111.899525, 40.985854]
                },
                'properties': {
                    'vehicleType': 'truck',
                    'fleetNumber': '2245'
                }
            },
            {
                'type': 'Feature',
                'id': '3',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [-111.9014963, 40.9740979]
                },
                'properties': {
                    'vehicleType': 'truck',
                    'fleetNumber': '9988'
                }
            },
            {
                'type': 'Feature',
                'id': '4',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [-111.9236773, 40.9785998]
                },
                'properties': {
                    'vehicleType': 'truck',
                    'fleetNumber': '8932'
                }
            },
            {
                'type': 'Feature',
                'id': '5',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [-111.934460, 40.982843]
                },
                'properties': {
                    'vehicleType': 'excavator',
                    'fleetNumber': '8975'
                }
            },
            {
                'type': 'Feature',
                'id': '6',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [-111.936638, 40.9829163]
                },
                'properties': {
                    'vehicleType': 'excavator',
                    'fleetNumber': '1342'
                }
            },
            {
                'type': 'Feature',
                'id': '9',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [-111.9172021, 40.9792649]
                },
                'properties': {
                    'vehicleType': 'excavator',
                    'fleetNumber': '4231'
                }
            }
        ]
    };

    return data;
}

function addVehicles() {
    // Add Datasource for vehicles
    vehicleDataSource = new atlas.source.DataSource();
    map.sources.add(vehicleDataSource);

    // Load icons
    var iconPromises = [
        map.imageSprite.add('truck', 'https://raw.githubusercontent.com/jurgenonazure/getting-started-azure-maps/master/images/truck_40.png'),
        map.imageSprite.add('excavator', 'https://raw.githubusercontent.com/jurgenonazure/getting-started-azure-maps/master/images/excavator_40.png')
    ];

    // Wait for icons to be ready
    Promise.all(iconPromises).then(function () {

        // Add a symbol layer to render the vehicle points
        var vehicleLayer = new atlas.layer.SymbolLayer(vehicleDataSource, null, {

            iconOptions: {
                image: ['get', 'vehicleType'],
                allowOverlap: true
            }

        });
        map.layers.add(vehicleLayer);

        // Add a click event to the symbol layer
        map.events.add('click', vehicleLayer, function (e) {

            // Make sure that the point exists
            if (e.shapes && e.shapes.length > 0) {

                var properties = e.shapes[0].getProperties();
                var coordinate = e.shapes[0].getCoordinates();

                // Find the address for the coordinates
                getAddress(coordinate, (address) => {
                    var fullVehicleName = properties.vehicleType + ' #' + properties.fleetNumber;

                    var detailsHtml =
                        '<p>'
                        + '<span class="lat-lon-label">Lat:</span>' + coordinate[1] + '<br />'
                        + '<span class="lat-lon-label">Lon:</span>' + coordinate[0]
                        + '</p>'
                        + '<p>'
                        + address
                        + '</p>';

                    var contentHtml = popupTemplate
                        .replace(/{header}/g, fullVehicleName)
                        .replace(/{details}/g, detailsHtml);

                    popup.setOptions({
                        // Set the HTML content of the popup
                        content: contentHtml,

                        // Set the popup's position to the vehicle's coordinate
                        position: coordinate
                    });

                    //Open the popup
                    popup.open(map);
                });
            }
        });

        // Load vehicles in vehicles data source
        vehicleDataSource.add(getVehiclesData());
    });
}