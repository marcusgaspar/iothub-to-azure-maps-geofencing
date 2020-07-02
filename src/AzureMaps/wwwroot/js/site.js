// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
var map;
var popupTemplate;
var popup;
var azureMapsSubscriptionKey = '';
var deviceLocationDataUrl = 'data/devicesLocation.txt';
var vehicleDataSource;

function GetMapGeoFence() {
    //Initialize a map instance.
    map = new atlas.Map('myMap', {
        //center: [-111.9194154, 40.986327],
        center: [-77.00003847122192, 38.880000000000000],        
        zoom: 12,
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
    map.events.add('ready', addControlsGeoFence);
}

function addControlsGeoFence() {
    // Add Map Controls
    addMapControlsGeoFence();

    // Add Zones
    addZonesGeoFence();

    // Add Vehicles
    addVehiclesGeoFence();
}

function addMapControlsGeoFence() {
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

function addZonesGeoFence() {
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
    zoneDataSource.add(getZonesDataGeoFence());
}

function addVehiclesGeoFence() {
    // Add Datasource for vehicles
    vehicleDataSource = new atlas.source.DataSource();
    map.sources.add(vehicleDataSource);

    // Add a symbol layer to render the vehicle points
    var vehicleLayer = new atlas.layer.SymbolLayer(vehicleDataSource, null, {
        minZoom: 0,
        maxZoom: 24
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
                var fullVehicleName = properties.deviceId + ":" + properties.Time;

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
    loadVehiclesDataGeoFence();
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

function getZonesDataGeoFence() {
    var data = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "geometryId": "1"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                -77.03503847122192,
                                38.906713705035514
                            ],
                            [
                                -77.03393340110779,
                                38.906329656729056
                            ],
                            [
                                -77.03370809555054,
                                38.90618772530741
                            ],
                            [
                                -77.0325493812561,
                                38.9057535803738
                            ],
                            [
                                -77.03234553337097,
                                38.905427969931274
                            ],
                            [
                                -77.0318305492401,
                                38.90528603670692
                            ],
                            [
                                -77.03157305717468,
                                38.90537787588449
                            ],
                            [
                                -77.03030705451965,
                                38.90498547129511
                            ],
                            [
                                -77.02959895133972,
                                38.904860235331306
                            ],
                            [
                                -77.02707767486571,
                                38.90398357739891
                            ],
                            [
                                -77.02513575553894,
                                38.903315640279985
                            ],
                            [
                                -77.02427744865416,
                                38.902948272186094
                            ],
                            [
                                -77.02192783355713,
                                38.902981669364095
                            ],
                            [
                                -77.02193856239319,
                                38.902514107442634
                            ],
                            [
                                -76.98960185050964,
                                38.902514107442634
                            ],
                            [
                                -76.98550343513489,
                                38.900735674149
                            ],
                            [
                                -76.98553562164307,
                                38.885638071063646
                            ],
                            [
                                -76.98550343513489,
                                38.880585335729194
                            ],
                            [
                                -76.98420524597168,
                                38.87586634107206
                            ],
                            [
                                -76.9927453994751,
                                38.87120550427056
                            ],
                            [
                                -76.9957709312439,
                                38.87117209215075
                            ],
                            [
                                -76.99982643127441,
                                38.87222456638095
                            ],
                            [
                                -77.00255155563354,
                                38.87214103724948
                            ],
                            [
                                -77.00437545776366,
                                38.87127232846313
                            ],
                            [
                                -77.00544834136963,
                                38.8702699589784
                            ],
                            [
                                -77.00701475143431,
                                38.86863272508857
                            ],
                            [
                                -77.00748682022095,
                                38.86726276571446
                            ],
                            [
                                -77.01137065887451,
                                38.863436763746975
                            ],
                            [
                                -77.01347351074219,
                                38.86146520636929
                            ],
                            [
                                -77.01656341552734,
                                38.860997371169866
                            ],
                            [
                                -77.01840877532959,
                                38.86049611575479
                            ],
                            [
                                -77.02149868011475,
                                38.85641910713792
                            ],
                            [
                                -77.02330112457275,
                                38.85631884988314
                            ],
                            [
                                -77.02566146850586,
                                38.861498623051475
                            ],
                            [
                                -77.03081130981445,
                                38.870520552674755
                            ],
                            [
                                -77.0355749130249,
                                38.8757661112384
                            ],
                            [
                                -77.04295635223389,
                                38.88030972164946
                            ],
                            [
                                -77.05029487609863,
                                38.885587963055855
                            ],
                            [
                                -77.05308437347412,
                                38.88812672431616
                            ],
                            [
                                -77.05321311950684,
                                38.88969670232407
                            ],
                            [
                                -77.05591678619385,
                                38.892268718964395
                            ],
                            [
                                -77.05729007720947,
                                38.89524145333019
                            ],
                            [
                                -77.05686092376709,
                                38.89841445946146
                            ],
                            [
                                -77.05823421478271,
                                38.89958342598271
                            ],
                            [
                                -77.05929636955261,
                                38.900735674149
                            ],
                            [
                                -77.0579981803894,
                                38.9027729367439
                            ],
                            [
                                -77.05679655075073,
                                38.90337408502875
                            ],
                            [
                                -77.05634593963622,
                                38.90466820642439
                            ],
                            [
                                -77.05548226833344,
                                38.90566382892656
                            ],
                            [
                                -77.0548090338707,
                                38.907114448879376
                            ],
                            [
                                -77.0544496178627,
                                38.907838704149945
                            ],
                            [
                                -77.05397754907608,
                                38.90841476358483
                            ],
                            [
                                -77.05357789993286,
                                38.90872575024974
                            ],
                            [
                                -77.05307632684708,
                                38.908967859730225
                            ],
                            [
                                -77.05119609832764,
                                38.90905134556649
                            ],
                            [
                                -77.05042362213133,
                                38.90956060704154
                            ],
                            [
                                -77.05043435096741,
                                38.90966078919671
                            ],
                            [
                                -77.04438328742981,
                                38.909644092180656
                            ],
                            [
                                -77.04361081123352,
                                38.91022848540535
                            ],
                            [
                                -77.04267740249634,
                                38.90974427421801
                            ],
                            [
                                -77.04266667366026,
                                38.90940198500666
                            ],
                            [
                                -77.03720569610596,
                                38.90749014417838
                            ],
                            [
                                -77.03632593154907,
                                38.90749849294023
                            ],
                            [
                                -77.03513503074645,
                                38.906780495833274
                            ],
                            [
                                -77.03503847122192,
                                38.906713705035514
                            ]
                        ]
                    ]
                }
            }
        ]
    };

    return data;
}

function loadVehiclesDataGeoFence() {
    //Download the store location data.
    fetch(deviceLocationDataUrl)
        .then(response => response.text())
        .then(function (text) {

            //Parse file data into GeoJSON features.
            var features = [];

            //Split the lines of the file.
            var lines = text.split('\n');
            var row;

            //Parse each row into a GeoJSON feature.
            for (i = 0; i < lines.length; i++) {
                if (lines[i] != "") {
                    row = lines[i];
                    var myObj = JSON.parse(row);
                    var deviceId = myObj.deviceId;                
                    var violationPoint = myObj.violationPoint;
                    var Location = myObj.Location;                
                    var long = Location[0];
                    var lat = Location[1];
                    var Time = myObj.Time;
                    
                    features.push(new atlas.data.Feature(new atlas.data.Point([parseFloat(long), parseFloat(lat)]), {
                        deviceId: deviceId,
                        violationPoint: violationPoint,
                        Time: Time
                    }));
                }
            }
            //Add the features to the data source.
            vehicleDataSource.add(features);
        });


}
