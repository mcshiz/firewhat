


var initMap = function (window, document, L, undefined) {
	'use strict';
	L.Icon.Default.imagePath = 'images/';

	/* create leaflet map */
	var map = L.map('map', {
		center: GeoLocation.userLocation,
		zoom: 10,
		scrollWheelZoom: false,
		dragging: false
	});

	/* add stamen tile layer other layers include watercolor and toner */
	new L.tileLayer('http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png', {
		minZoom: 0,
		maxZoom: 18,
		attribution: 'Map data © <a href="http://www.openstreetmap.org">OpenStreetMap contributors</a>'
	}).addTo(map);





	function addMarker(e){
		var location;
		//handle multiple types of location data
		if(Array.isArray(e)) {
			location = e
		} else {
			location = {lat: e.lat, lng: e.lng}
		}
		var newMarker = new L.marker(location).addTo(map).on('click', function(){
			console.log("marker cicked")

		});
	}

	addMarker([41.315646199999996, -122.3133991])

	//click map to toggle zoom and drag (might want to consider doing this only for mobile)
	map.on('click', function() {
		map.scrollWheelZoom.enable();
		map.dragging.enable()

	});

	// add the add incident button
	var addIncidentButton = L.Control.extend({
		options: {
			position: 'topright'
		},
		onAdd: function (map) {
			var container = L.DomUtil.create('div', 'glyphicon glyphicon-fire text-center leaflet-bar leaflet-control leaflet-control-custom');
			container.style.width = 'auto';
			container.style.height = 'auto';
			container.dataset.toggle = "modal";
			container.dataset.target = "#addIncidentModal";
			return container;
		}
	});
	map.addControl( new addIncidentButton());

	$("#location-picker").on('click', function(){
		var $modal = $("#addIncidentModal");
		$modal.modal('hide');
		$("#map").css('cursor', 'crosshair');
		map.on('click', function(e){
			new L.marker(e.latlng).addTo(map);
			map.off('click');
			$("#map").css('cursor', 'pointer');
			popLatLng($modal, e.latlng)
		});
	});
return map;

};


var GeoLocation = (function(callback) {
	var options = {
		enableHighAccuracy : true,
		timeout : 3000,
		maximumAge : 0
	};
	function getLocation(position) {
		document.cookie = "geoLocation=true";
		GeoLocation.userLocation = {
			lat: position.coords.latitude,
			lng: position.coords.longitude };
		callback(window, document, L, undefined)

	}
	function fallback() {
		$.getJSON('//freegeoip.net/json/', function (data) {
			// sometimes ClientLocation comes back null
			GeoLocation.userLocation = {
				lat: data.latitude,
				lng: data.longitude
			};

		}).fail(function() {
			console.log('geolocation failed resorting to default.');
			GeoLocation.userLocation = {
				lat: 42.877742,
				lng: -97.367445640979
			}
		}).done(function(){
			callback(window, document, L, undefined)
		})
	}

	function error(error) {
		document.cookie = "geoLocation=false";
		console.log(error.message);
		fallback();
	}

	if (navigator && navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(getLocation, error, options);
	} else {
		fallback();
	}

	return {
		//setting default
		userLocation : {
			lat: 42.877742,
			lng: -97.367445640979
		}
	}

})(initMap);



function popLatLng(elem, latLng){
	elem.find("#latitude").val(latLng.lat);
	elem.find("#longitude").val(latLng.lng);
	elem.modal('show');
}

function populateModal() {

}




