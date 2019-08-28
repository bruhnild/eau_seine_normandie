// Inspiré de : https://bl.ocks.org/mastersigat/b57cea9413e03fac92b00a003734d71e

mapboxgl.accessToken = 'pk.eyJ1IjoidmluY2VudGZhdWNoZXIiLCJhIjoiY2p3cDFtMTJ6MXR5cDN5bnNncnYyYmh2MyJ9.88mIlJakYMQRuO7HWezUew'

// Configuration de la carte
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/vincentfaucher/cjxepapdn0jzs1clbv5duqfj8',
    // style: 'mapbox://styles/mapbox/light-v10', // fond de carte
    center: [2.0715, 48.9825 ], // lat/long
    zoom: 6.6, // zoom
    pitch: 10, // Inclinaison
    bearing: 0 // Rotation
});

var hoveredStateId =  null;

map.on('load', function () {
    addSources();
    loadImages();
});

// map.on('styledata', function () {addSources();addLayers();loadImages() })
 
function addSources () { 




// Chefs lieux

map.addSource('chefs_lieux-2p4yy3', {
type: 'vector',
url: 'mapbox://vincentfaucher.92k0j534'});

// map.addSource("data", {
// type: "geojson",
// 'generateId': true,
// data: window.chefs_lieux,
// });


// // Départements

map.addSource('departements-340qrb', {
type: 'vector',
url: 'mapbox://vincentfaucher.5sjo9mea'});

// // Départements labels

map.addSource('departements_centroid-cpuk5t', {
type: 'vector',
url: 'mapbox://vincentfaucher.dc786fn8'});

   
// // Régions

map.addSource('regions-5430y3', {
type: 'vector',
url: 'mapbox://vincentfaucher.2z0ady4t'});

// // Régions labels

map.addSource('regions_centroid-bwo4qp', {
type: 'vector',
url: 'vincentfaucher.5rjk64rd'});

// // Sous secteurs

map.addSource('sous_bassins-btjz5s', {
type: 'vector',
url: 'mapbox://vincentfaucher.0fczrghb'});

map.addSource("data", {
type: "geojson",
'generateId': true,
data: window.sous_bassins
});

}

function loadImages(){
    console.log("loadImages");
    var total = 2;
    var currenti = 0;

    map.loadImage('https://static.thenounproject.com/png/462-200.png', function(error, image) {
if (error) {console.log("tro", error)};
map.addImage('Map-marker-02', image);
addLayers()
})
}


function addLayers (){
 
var layers = map.getStyle().layers;
 
var labelLayerId;
for (var i = 0; i < layers.length; i++) {
if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
labelLayerId = layers[i].id;
break;
}
}


//Départements

     map.addLayer({
        "id": "Départements",
        "type": "line",
        "source": "departements-340qrb",
        "source-layer": "departements-340qrb",
        "layout": {'visibility': 'none'},
        "paint": {"line-color": "black", "line-width": 0.4}
    }); 

//Départements labels

     map.addLayer({
    
        "id": "Départements labels",
        "type": "symbol",
        "source": "departements_centroid-cpuk5t",
        "source-layer": "departements_centroid-cpuk5t",
        "layout": {
            "visibility": "none",
            "text-field": ["to-string", ["get", "NOM_DEP"]],
            "text-font": ["Montserrat SemiBold", "Arial Unicode MS Regular"],
            "text-size": 13
        },
        "paint": {
            "text-halo-width": 1,
            "text-halo-color": "hsl(0, 1%, 100%)"
        }
    
}); 

// Régions

     map.addLayer({
    "id": "Régions",
    "type": "line",
    "source": "regions-5430y3",
    "source-layer": "regions-5430y3",
    "layout": {'visibility': 'none'},
    "paint": {"line-color": "black", "line-width": 0.4}
    }); 

// Régions labels

     map.addLayer({
    
        "id": "Régions labels",
        "type": "symbol",
        "source": "regions_centroid-bwo4qp",
        "source-layer": "regions_centroid-bwo4qp",
        "layout": {
            "visibility": "visible",
            "text-field": ["to-string", ["get", "NOM_REG"]],
            "text-font": ["Montserrat SemiBold", "Arial Unicode MS Regular"],
            "text-size": 13
        },
        "paint": {
            "text-halo-width": 1,
            "text-halo-color": "hsl(0, 1%, 100%)"
        }
    
});


// // Sous secteurs

    // The feature-state dependent fill-opacity expression will render the hover effect
    // when a feature's hover state is set to true.
    map.addLayer({
        "id": "Sous secteurs fill",
        "type": "fill",
        "source": "data",
        "layout": {},
        "paint": {
            "fill-color": "#fff",
            "fill-opacity": ["case",
                ["boolean", ["feature-state", "hover"], false],
                0.5,
                0.1
            ],

            'fill-outline-color': '#7a7a7a',
            'fill-color': ['match', ['get', 'Nom'], // get the property
                'Bocages Normands', '#94a624',  
                'Vallées de Marne', '#f19a99', 
                "Vallées d'Oise", '#e0b523',
                'Seine Amont', '#6e96a9',
                'Seine Aval', '#e28f41',
                '#fff'] //else  
        }
    });

    map.addLayer({
        "id": "Sous secteurs stroke",
        "type": "line",
        "source": "data",
        "layout": {},
        "paint": {
            "line-color": "white",
            "line-width": 0.7
        }
    });
// :

map.addLayer({

            "id": "chefs_lieux",
            "type": "symbol",
            "source": "chefs_lieux-2p4yy3",
            "source-layer": "chefs_lieux-2p4yy3",
            "layout": {
                "icon-image": "Map-marker-02", 
                "icon-size":  ['match', ['get', 'NATURE'],
                    'Siège', 0.25,  
                    'Ville principale', 0.15, 
                    'Ville secondaire', 0.08, 
                0.2],

                "text-field": ["to-string", ["get", "NOM_CHF"]],
                "text-size": [
                    "match",
                    ["get", "NATURE"],
                    ["Siège"],
                    13,
                    ["Ville principale"],
                    11,
                    ["Villes secondaires"],
                    10,
                    13
                ],
                "text-offset": [0, 2.7],
                "text-font": ["Montserrat SemiBold", "Arial Unicode MS Regular"]
            },
            "paint": {
                "text-halo-color": "hsl(0, 0%, 100%)",
                "text-halo-width": 1,
                "text-halo-blur": 1
            }
            })

// map.addLayer({

//             "id": "chefs_lieux",
//             "type": "circle",
//             "source": "chefs_lieux-2p4yy3",
//             "source-layer": "chefs_lieux-2p4yy3",
//             "layout": {},
//             "paint": {"circle-color": "hsl(0, 78%, 56%)", "circle-radius": 2}

// })


 // When the user moves their mouse over the state-fill layer, we'll update the
    // feature state for the feature under the mouse.
    //Configuration fenêtre d'informations
    map.on("mousemove", "Sous secteurs fill", function(e) {
      
        if (e.features.length > 0 && (hoveredStateId !== e.features[0].id)) {
            console.log("a")
                if (hoveredStateId) {
                map.setFeatureState({source: 'data', id: hoveredStateId}, { hover: false});
            }
            hoveredStateId = e.features[0].id;
            map.setFeatureState({source: 'data', id: hoveredStateId}, { hover: true});
     
            const pd = document.getElementById('pd');
            pd.parentNode.classList.add ('textebv')
            pd.innerHTML = 
            '<div style="text-align: center;"><span style="font-family: trebuchet ms, sans-serif;"><font size="3"><b>' + e.features[0].properties.Nom + '</b></font></span></div><span style="font-family: trebuchet ms, sans-serif;"></span>'
            + '</div><i><p>' +e.features[0].properties.text + '</p></i></div> '
} 


    });

    // When the mouse leaves the state-fill layer, update the feature state of the
    // previously hovered feature.
    map.on("mouseleave", "Sous secteurs fill", function() {
        
            if (hoveredStateId) {
            map.setFeatureState({source: 'data', id: hoveredStateId}, { hover: false});
        }
        hoveredStateId =  null;
        const pd = document.getElementById('pd');
            pd.parentNode.classList.remove ('textebv')
            pd.innerHTML = 
            '<div style="text-align: center;"><span style="font-family: trebuchet ms, sans-serif;"><font size="3"><b>' + "Explorer les bassins versants" + '</b></font></span></div><span style="font-family: trebuchet ms, sans-serif;"></span>'
      + '</div><i><p>' +"Le bassin Seine-Normandie se compose du fleuve de la Seine, de ses affluents (l’Yonne, la Marne, l’Oise), et de petits fleuves de la côte (la Vire, la Sélune, l’Arques, la Bresle, …). Il compte 55&nbsp;000 km de rivières et s’étend sur 95000 km², soit 18 % du territoire français." + '</p></i></div> '
 
    });


 
//Interactivité CLICK

//Pop up chefs lieux
map.on('click', function (e) {
var features = map.queryRenderedFeatures(e.point, { layers: ['chefs_lieux'] });
if (!features.length) {
return;
}
var feature = features[0];
var popup = new mapboxgl.Popup({ offset: [0, -15] })
.setLngLat(feature.geometry.coordinates)
// .setHTML('<h4> <font color="#002f89">'  + feature.properties.nom 
// +'<img src="url-address/' + feature.properties['url'] +'">' 
//     + '</h6><font color="black"> <img src="http://www.eau-seine-normandie.fr/sites/public_file/logo.png"  style="width:30%"> <h6>'
// + feature.properties.url_ + '</h4><p>'

// +"" + feature.properties.text + '</h4><p>'
// +'</p>' )

.setHTML('<b>'+ feature.properties.text + '</b>' 
    + feature.properties.text + '<p><img src="'+feature.properties.url+'"/></p>')


.addTo(map);
});

map.on('mousemove', function (e) {
var features = map.queryRenderedFeatures(e.point, { layers: ['chefs_lieux'] });
map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
});

// Change the cursor to a pointer when the mouse is over the states layer.
map.on('mouseenter', 'chefs_lieux', function () {
map.getCanvas().style.cursor = 'pointer';
});
 
// Change it back to a pointer when it leaves.
map.on('mouseleave', 'chefs_lieux', function () {
map.getCanvas().style.cursor = '';
});

// Centrer la carte sur les coordonnées des couches 
map.on('click', '', function (e) {
map.flyTo({center: e.features[0].geometry.coordinates});
});






}

 




//Ajout échelle cartographique
       
map.addControl(new mapboxgl.ScaleControl({
    maxWidth: 120,
    unit: 'metric'}));
    
//Ajout boutons de controle
    
var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');
   

//Ajouter un menu pour gérer les couches

function toggleLayer(e ) {
  console.log(e)
        e.preventDefault();
        e.stopPropagation();
                                 
                                 
      toggleableLayers[e.target.id].layers.forEach(function(layer){
        
              var visibility = map.getLayoutProperty(layer, 'visibility');
        if (visibility === 'visible') {
            map.setLayoutProperty(layer, 'visibility', 'none');
            this.className = '';} else {this.className = 'active';
            map.setLayoutProperty(layer, 'visibility', 'visible');}  
        
      })
}

var toggleableLayers = [
  {id:1,label:"Départements",layers:['Départements', 'Départements labels']}, 
  {id:2,label:"Régions",layers:['Régions', 'Régions labels']}                       
  ];

for (var i = 0; i < toggleableLayers.length; i++) {
    var toggleableLayer = toggleableLayers[i];

    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = toggleableLayer.label;
    link.id = i;
    link.onclick = (e)=>toggleLayer(e);                         
                                                    
                              

var layers = document.getElementById('menu');  layers.appendChild(link); }

