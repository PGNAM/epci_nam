// Créez une carte Leaflet centrée sur une position donnée
var map = L.map('map').setView([44.826, -0.555], 7,5);

// Ajoutez une couche de tuiles OpenStreetMap à la carte
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

var coloredGeoJSONLayer, whiteGeoJSONLayer;

$.getJSON("epci2.geojson", function(data) {

  coloredGeoJSONLayer = L.geoJSON(data, {
    style: function(feature) {
      var fillColor = feature.properties.AOM === "OUI" ? "#5F02E4" : "#FF0000";
      return {
          fillColor: fillColor,
          weight: 1,
          color : "#6B0589",
          opacity: 1,
          fillOpacity: 0.5
       }
    },
    onEachFeature : function(feature, layer) {
      var popupContent = "<strong>" + feature.properties.epci_name + "</strong><br><strong>AOM : </strong>" + feature.properties.AOM;
      if (feature.properties.bassin && feature.properties.bassin.trim() !== '') {
        popupContent += "<br><strong>Bassin</strong> : "+ feature.properties.bassin;
      };
      if (feature.properties.etudesrecencees && feature.properties.etudesrecencees.trim() !== '') {
        popupContent += "<br><strong>Études</strong> : "+ feature.properties.etudesrecencees;
      }
      layer.bindPopup(popupContent);
    }
  });

  whiteGeoJSONLayer = L.geoJSON(data, {
    style: function(feature) {
      var strokeWeight = feature.properties.membrenam ==="OUI" ? 2 : 0.75 ;
      var strokeOpacity = feature.properties.membrenam === "OUI" ? 1 : 0.;
      var strokeColor = feature.properties.AOM === "OUI" ? "#FFF2F7" : "#000000";
      return {
          weight: strokeWeight,
          opacity: strokeOpacity,
          color: strokeColor,
          fillOpacity: 0
       }
    },
    onEachFeature : function(feature, layer) {
      var popupContent = "<strong>" + feature.properties.epci_name + "</strong><br><strong>AOM : </strong>" + feature.properties.AOM;
      if (feature.properties.bassin && feature.properties.bassin.trim() !== '') {
        popupContent += "<br><strong>Bassin</strong> : "+ feature.properties.bassin;
      };
      if (feature.properties.etudesrecencees && feature.properties.etudesrecencees.trim() !== '') {
        popupContent += "<br><strong>Études</strong> : "+ feature.properties.etudesrecencees;
      }
      layer.bindPopup(popupContent)
    }
  });
  coloredGeoJSONLayer.addTo(map);
  whiteGeoJSONLayer.addTo(map);

  var toggleColoredLayerButton = L.Control.extend({
    options: {
      position: 'topright'
    },
    onAdd: function(map) {
      var button = L.DomUtil.create('button', 'toggle-button');
      button.innerHTML = 'Afficher/Cacher les EPCI';
      L.DomEvent.addListener(button, 'click', function() {
        if (map.hasLayer(coloredGeoJSONLayer)) {
          map.removeLayer(coloredGeoJSONLayer);
        } else {
          map.addLayer(coloredGeoJSONLayer);
        }
        whiteGeoJSONLayer.bringToFront();
      });
      return button;
    }
  });
  map.addControl(new toggleColoredLayerButton());


  
  var toggleWhiteLayerButton = L.Control.extend({
    options: {
      position: 'topright'
    },
    onAdd: function(map) {
      var button = L.DomUtil.create('button', 'toggle-button');
      button.innerHTML = 'Afficher/Cacher les EPCI membres de NAM';
      L.DomEvent.addListener(button, 'click', function() {
        if (map.hasLayer(whiteGeoJSONLayer)) {
          map.removeLayer(whiteGeoJSONLayer);
        } else {
          map.addLayer(whiteGeoJSONLayer);
        }
        whiteGeoJSONLayer.bringToFront();
      });
      return button;
    }
  });
  map.addControl(new toggleWhiteLayerButton());
});

