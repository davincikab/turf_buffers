var map = L.map('map', {
    center:[51.505, -0.09],
    zoom:12
});


// load data
var nyeri = L.geoJson(null, {
    style:function(feature){
        return {
            fillColor:'#EA9500', 
            fillOpacity:0.8
        }
    }
});

nyeri.addTo(map);

// fetch the data
fetch('nyeri.geojson')
    .then(data => data.json())
    .then(features => {
        nyeri.addData(features);

        // get the buffer
        createBuffer(2)
            .then(data=> data.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                alert(error.message);

                console.log(error);
            });
    });

// run geoprcessing
function createBuffer(distance=10) {
    return new Promise((resolve, reject) => {
        var features = nyeri.toGeoJSON();
        var feature = turf.featureCollection(features[0]);

        try {
            var buffer =  turf.buffer(
                feature,
                distance,
                {units:'metres'}
            );
            
            resolve(buffer);

        } catch (error) {
            reject(error)
        }
       
    })
}