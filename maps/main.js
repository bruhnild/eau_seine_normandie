// Inspiré de : https://bl.ocks.org/mastersigat/b57cea9413e03fac92b00a003734d71e

mapboxgl.accessToken = 'pk.eyJ1IjoidmluY2VudGZhdWNoZXIiLCJhIjoiY2p3cDFtMTJ6MXR5cDN5bnNncnYyYmh2MyJ9.88mIlJakYMQRuO7HWezUew'

// Configuration de la carte
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/vincentfaucher/cjzv5qotx04p31dmtsmcr7g9w',
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

map.addSource('chefs_lieux-2jqzpo', {
type: 'vector',
url: 'mapbox://vincentfaucher.c3nube0e'});


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


// // Cours d'eau

map.addSource('cours_eau-2rz2bt', {
type: 'vector',
url: 'mapbox://vincentfaucher.2wna4l35'});

map.addSource("data", {
type: "geojson",
'generateId': true,
data: window.sous_bassins
});

// BV Seine Normandie

map.addSource('bv_seine_normandie-4nhmpx', {
type: 'vector',
url: 'mapbox://vincentfaucher.5iog6p1s'});

// Surfaces hydrographiques
map.addSource('surface_hydrographiques', {
type: 'vector',
url: 'mapbox://vincentfaucher.1hvm1v8x'});


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


// Sous-secteurs fill
    map.addLayer({
            "id": "sous-secteurs fill",
            "type": "fill",
            "source": "sous_bassins-btjz5s",
            "source-layer": "sous_bassins-btjz5s",
            "layout": {},
            "paint": {
                "fill-color": [
                    "match",
                    ["get", "Nom"],
                    ["Côtiers Normands"],
                    "#94a624",
                    ["Marne"],
                    "#f19a99",
                    ["Oise"],
                    "#e0b523",
                    ["Seine Amont"],
                    "#6e96a9",
                    ["Seine Aval"],
                    "#e28f41",
                    "hsl(0, 69%, 57%)"
                ],
                "fill-opacity": 0.72
            }
        });

// Sous-secteurs stroke
    map.addLayer({
            "id": "sous-secteurs stroke",
            "type": "line",
            "source": "sous_bassins-btjz5s",
            "source-layer": "sous_bassins-btjz5s",
            "layout": {},
            "paint": {"line-color": "hsl(0, 0%, 100%)", "line-width": 0.5}
        });


// Bassins-versants stroke
    map.addLayer({
            "id": "bassins-versants stroke",
            "type": "line",
            "source": "bv_seine_normandie-4nhmpx",
            "source-layer": "bv_seine_normandie-4nhmpx",
            "layout": {},
            "paint": {
                "line-color": "hsla(0, 0%, 0%, 0.32)",
                "line-opacity": 0.64
            }
        });


// Surface hydrographique stroke
    map.addLayer({
            "id": "surface-hydrographiques stroke",
            "type": "line",
            "source": "surface_hydrographiques",
            "source-layer": "surface_hydrographiques",
            "layout": {},
            "paint": {
                "line-width": 1,
                "line-color": "hsl(0, 1%, 99%)",
                "line-blur": 0
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

// : Chefs lieux

map.addLayer({

            "id": "chefs_lieux",
            "type": "symbol",
            "source": "chefs_lieux-2jqzpo",
            "source-layer": "chefs_lieux-2jqzpo",
            "layout": {
                "icon-image": "Map-marker-02", 
                "icon-size":  ['match', ['get', 'NATURE'],
                    'Siège administratif', 0.18,  
                    'Direction territoriale', 0.14, 
                    'Ville principale', 0.10, 
                0.2],

                "text-field": ["to-string", ["get", "NOM_CHF"]],
                "text-size": [
                    "match",
                    ["get", "NATURE"],
                    ["Siège administratif"],
                    13,
                    ["Direction territoriale"],
                    12,
                    ["Ville principale"],
                    11,
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
            });


// Cours d'eau
    map.addLayer({
 
            "id": "Cours d'eau",
            "type": "symbol",
            "source": "cours_eau-2rz2bt",
            "source-layer": "cours_eau-2rz2bt",
            "layout": {
                "text-field": ["to-string", ["get", "TOPONYME"]],
                "text-font": [
                    "Montserrat Medium Italic",
                    "Arial Unicode MS Regular"
                ],
                "text-size": 12,
                "symbol-placement": "line"
            },
            "paint": {
                "text-halo-width": 20,
                "text-halo-blur": 5,
                "text-color": "hsl(207, 100%, 18%)",
                "text-halo-color": "hsla(0, 0%, 0%, 0)"
            }
        });

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

   
//Interactivité HOVER
var popup = new mapboxgl.Popup({
closeButton: false,
closeOnClick: false });
map.on('mousemove', function(e) {

var features = map.queryRenderedFeatures(e.point, { layers: ['chefs_lieux'] });
// Change the cursor style as a UI indicator.
map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
if (!features.length) {
popup.remove();
return; }
var feature = features[0];
popup.setLngLat(feature.geometry.coordinates)
.setHTML('<h3><b><div style="text-align: center;">' + feature.properties.nom + '</b></h3>'
    + '<br>'+ feature.properties.text)
.addTo(map);
});
 

//  const adresse = map.queryRenderedFeatures('adresse');
// if (!(feature.properties.adresse ==="")) 
// return;
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

.setHTML('<h4><b><font size="4"> <div style="text-align: center;">' + feature.properties.NOM_CHF + ' ' + feature.properties.INSEE_COM +'</h4></b></font>'
       + '<br>'+ feature.properties.url_
       + '<font size="1"><i><a href = "'+feature.properties.source +'" target="blank"> Source : ' + feature.properties.source +'</a</i></font>'
 )


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

