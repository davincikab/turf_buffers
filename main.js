// map object
var map = L.map('map', {
    center:[-0.4217681939995159, 36.97191238403321],
    zoom:12
});


// tileLayer
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}' + (L.Browser.retina ? '@2x.png' : '.png'), {
   attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
   subdomains: 'abcd',
   maxZoom: 20,
   minZoom: 0
 }).addTo(map);


// load data
var nyeri = L.geoJson(null, {
    style:function(feature){
        return {
            fillColor:'#EA9500', 
            fillOpacity:0.8,
            color:"#ddd",
            weight:0.5
        }
    }
});

nyeri.addTo(map);

// buffer layer
var buffer = L.geoJson(null, {

});

buffer.addTo(map)

// fetch the data
fetch('nyeri.geojson')
    .then(data => data.json())
    .then(features => {
        nyeri.addData(features);
        nyeri.bringToFront();

        submitFunction();
    });


// listen to form submit event
var form = document.getElementById('form');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    submitFunction();
});

function submitFunction() {
    var parameters =  {};
    var elements = form.elements;

    // get the form data
    for (let i = 0; i < elements.length -1 ; i++) {
        var item = elements[i];
        parameters[item.name] = item.value;
    }

    console.log(parameters);
    // call to createBuffer method

    updateBuffer(parameters);
}

function updateBuffer(parameters) {
    // get the buffer
    createBuffer(parameters)
    .then(data => data)
    .then(data => {
        console.log(data);
        buffer.clearLayers();

        buffer.addData(data);
    })
    .catch(error => {
        alert(error.message);

        console.log(error);
    });
}

// run geoprocessing
function createBuffer(parameters) {
    console.log(parameters);
    return new Promise((resolve, reject) => {
        var features = nyeri.toGeoJSON();
        var feature = turf.featureCollection(features.features);

        try {
            var buffer =  turf.buffer(
                feature,
                parameters.distance,
                {units:parameters.units}
            );
            
            resolve(buffer);

        } catch (error) {
            reject(error)
        }
       
    })
}