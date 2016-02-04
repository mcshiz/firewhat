/*jslint browser: true*/
/*global L */

(function (window, document, L, undefined) {
	'use strict';

	L.Icon.Default.imagePath = 'images/';

	/* create leaflet map */
	var map = L.map('map', {
		center: [41.315646199999996, -122.3133991],
		zoom: 10
	});
	map.scrollWheelZoom.disable()
	map.on('click', addMarker);


	/* add stamen tile layer other layers include watercolor and toner */
	new L.tileLayer('http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png', {
		minZoom: 0,
		maxZoom: 18,
		attribution: 'Map data © <a href="http://www.openstreetmap.org">OpenStreetMap contributors</a>'
	}).addTo(map);


	L.marker([41.315646199999996, -122.3133991]).addTo(map);


	function addMarker(e){
// Add marker to map at click location; add popup window
		var newMarker = new L.marker(e.latlng).addTo(map);
	}

	map.on('click', function() {
		if (map.scrollWheelZoom.enabled()) {
			map.scrollWheelZoom.disable();
		}
		else {
			map.scrollWheelZoom.enable();
		}
	});

}(window, document, L));


$('#new-incident').on("click", function() {
	$("body").css("background-color", "rgba(8, 8, 8, 0.39)")
})
