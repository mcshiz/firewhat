
var myMap = function (window, document, L, undefined) {
	'use strict';
	myMap.markers = [];
	myMap.incidentCounter;
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


	var ref = new Firebase("https://firewhat.firebaseio.com/");
	ref.on("value", function(snapshot) {
		var incident = snapshot.val();
		$.each(incident, function(key, val){
			addMarker(incident[key], key);
			myMap.listIncident(incident[key], key);
			myMap.incidentCounter = parseInt(key);
		})
	}, function (errorObject) {
		console.log("The read failed: " + errorObject.code);
	});

	myMap.IncidentDetails = function(i) {
		this.location = {lat: i.location.lat, lng: i.location.lng};
		this.name = i.name;
		this.acres = i.acres;
		this.comments = i.comments;
		this.hazards = i.hazards;
		this.radio = i.radio;
		this.resources = i.resources;
		this.roc = i.roc;
		this.ros = i.ros;
		this.structures = i.structures;
	}
	function addMarker(i, ref){
		var incident = new myMap.IncidentDetails(i);
		var marker = new L.marker(incident.location, {id: ref}).addTo(map)
		var popupContent = '' +
			'<div class="editIncident" data-id="'+ref+'"><b class="glyphicon glyphicon-pencil "></b><span>Edit Incident</span></div>' +
			'<p>' +
			'<span class="incidentName">'+incident.name+'</span><br>' +
			'<span class="incidentAcres"><b>Acres: </b>'+incident.acres+'</span><br>' +
			'<span class="incidentRos"><b>Ros: </b>'+incident.ros+'</span><br>' +
			'<span class="incidentRoc"><b>Roc: </b>'+incident.roc+'</span><br>' +
			'<span class="incidentStructures"><b>Structures: </b>'+incident.structures+'</span><br>' +
			'<span class="incidentHazards"><b>Hazards: </b>'+incident.hazards+'</span><br>' +
			'<span class="incidentResources"><b>Resources: </b>'+incident.resources+'</span><br>' +
			'<span class="incidentRadio"><b>Radio: </b>'+incident.radio+'</span><br>' +
			'<span class="incidentComments"><b>Comments: </b>'+incident.comments+'</span><br>' +
			'</p>';
		marker.bindPopup(popupContent);
		myMap.markers.push(marker);
	}

	myMap.listIncident = function(i, ref){
		var $list = $("#incidentList");
		$list.find('.loading').remove();
		$list.find('ul').append('<li onclick="myMap.showIncident(this)" data-ref="'+ref+'">'+ i.name+'</li>');

	}

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

	$("#location-picker").on('click touchstart', function(){
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

	myMap.showIncident = function(i){
		var id = $(i).data("ref");
		var ref = new Firebase("https://firewhat.firebaseio.com/"+id);
		ref.on("value", function(snapshot) {
			var incident = snapshot.val();
			map.panTo(new L.LatLng(incident.location.lat,incident.location.lng));
			});
		for (var j in myMap.markers){
			var markerID = myMap.markers[j].options.id;
			if (markerID == id){
				myMap.markers[j].openPopup();
			}
		}
	}

};


var GeoLocation = (function(callback) {
	var options = {
		enableHighAccuracy : true,
		timeout : 10000,
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

})(myMap);



function popLatLng(elem, latLng){
	elem.find("#latitude").val(latLng.lat);
	elem.find("#longitude").val(latLng.lng);
	elem.modal('show');
}

function addNewIncident(form) {
	var edit;
	$(form).hasClass("editIncidentForm")? edit = true : edit = false;
	var incidentObject = {
		location: {lat: $(form).find("#latitude").val(), lng:$(form).find("#longitude").val()},
		name: $(form).find("#name").val(),
		acres: $(form).find("#acres").val(),
		comments: $(form).find("#comments").val(),
		hazards: $(form).find("#hazards").val(),
		radio: $(form).find("#radio").val(),
		resources: $(form).find("#resources").val(),
		roc: $(form).find("#roc").val(),
		ros: $(form).find("#ros").val(),
		structures: $(form).find("#structures").val()
	};
	var newIncident = new myMap.IncidentDetails(incidentObject);
	var incidentRef = ++myMap.incidentCounter;
	var id = $(form).data("incidentid");
	var refObject = edit ?id :incidentRef;
	var ref = new Firebase("https://firewhat.firebaseio.com/"+refObject);
	if(edit === true) {
		console.log("updating...")

		ref.update(newIncident)
	} else {
		console.log("setting...")
		ref.set(newIncident);
		myMap.listIncident(newIncident, incidentRef);
	}


}

function editIncident(id){
	var $modal = $("#addIncidentModal");
	var ref = new Firebase("https://firewhat.firebaseio.com/"+id);
	ref.once("value", function(snapshot) {
		var incident = snapshot.val();
		$modal.find("#latitude").val(incident.location.lat);
		$modal.find("#longitude").val(incident.location.lng);
		$modal.find("#name").val(incident.name);
		$modal.find("#acres").val(incident.acres);
		$modal.find("#comments").val(incident.comments);
		$modal.find("#hazards").val(incident.hazards);
		$modal.find("#radio").val(incident.radio);
		$modal.find("#resources").val(incident.resources);
		$modal.find("#roc").val(incident.roc);
		$modal.find("#ros").val(incident.ros);
		$modal.find("#structures").val(incident.structures);
	}, function (errorObject) {
		console.log("The read failed: " + errorObject.code);
	});
	$modal.modal('show');
}

$(".newIncidentForm").submit(function(e){
	e.preventDefault();
	addNewIncident($(this)[0]);
	$("#addIncidentModal").modal('hide');
});
$('body').on("click touchstart",'.editIncident', function(){
	console.log("editing...")
	var $id = $(this).data('id');
	$('#incidentForm').removeClass().addClass('editIncidentForm');
	$('#incidentForm').attr("data-incidentId", $id);
	editIncident($id)
});
