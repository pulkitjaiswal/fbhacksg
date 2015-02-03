function frecentMissions(){
	$('.f_option').hide();
	$("#f_main_panel").html($("#f_recent_missions"));
	$('#f_recent_missions').show();
}

function fsavedRoutes(){

	$('.f_option').hide();
	$("#f_main_panel").html($("#f_saved_routes"));
	$('#f_saved_routes').show();
	var fsavedroutesMap;
	function initializefroutes() {
	  var frouteOptions = {
	    zoom: 8,
	    center: new google.maps.LatLng(-34.397, 150.644),
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	  };
	  fsavedroutesMap = new google.maps.Map(document.getElementById('frouteMap'),
	      frouteOptions);
	}

	google.maps.event.addDomListener(window, 'load', initializefroutes);
	
	initializefroutes();
}

function fappsList(){
	$('.f_option').hide();
	$("#f_main_panel").html($("#f_apps_list"));
	$('#f_apps_list').show();
}

function fdronesList(){
	$('.f_option').hide();
	$("#f_main_panel").html($("#f_drones"));
	$('#f_drones').show();
}

function launchrecentlocationModal(){
	$('#recentlocationModal').modal('toggle');
	$('.container').addClass('blur');
	var recentMap;
	var recentMapCenter = new google.maps.LatLng(37.44188, -122.14302);
	function initialize() {
	  var mapOptions = {
	    zoom: 19,
	    center: recentMapCenter,
	    mapTypeId: google.maps.MapTypeId.SATELLITE
	  };
	  recentMap = new google.maps.Map(document.getElementById('recentMap'),
	      mapOptions);
	}

	google.maps.event.addDomListener(window, 'load', initialize);
	initialize();

	google.maps.event.addListenerOnce(recentMap, 'idle', function(){

		google.maps.event.trigger(recentMap, 'resize');
		recentMap.setCenter(new google.maps.LatLng(37.44188, -122.14302));
		marker = new google.maps.Marker({
	    map:recentMap,
	    draggable:false,
	    animation: google.maps.Animation.DROP,
	    position: recentMapCenter
	  	});

	});

}


function launchcontrolModal(){
	$('#controlModal').modal('toggle');
	$('.container').addClass('blur');
}

function removeBlur(){
	$('.container').removeClass('blur');
}
