var calcRouteFlag = 1; //flag for free flight mode and constrained mode
var markerInProgress = true;
var xmlString;
var rendererOptions = {
  draggable: true
};

var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);;
var directionsService = new google.maps.DirectionsService();

function startingPoint(){
map.setOptions({ draggableCursor: "url('images/map_icons/start_flag.png') 30 30, default" });

google.maps.event.addListener(map, "click", function(event)
            {
                // place a marker
                placeStartMarker(event.latLng);
                path.push(event.latLng);


            });

}

function finalDestination(){
map.setOptions({ draggableCursor: "url('images/map_icons/finish_flag.png') 30 30, default" });
$('.toolSet1').each(function(){
  $(this).removeClass('active');
 });
$('#finalDestination').addClass('active');

google.maps.event.addListener(map, "click", function(event)
            {
                // place a marker
                placeFinishMarker(event.latLng);
                path.push(event.latLng);


            });
}

function waypointMarker(){
map.setOptions({ draggableCursor: "url('images/map_icons/red_flag.png') 30 30, default" });
$('.toolSet1').each(function(){
  $(this).removeClass('active');
 });
$('#waypointMarker').addClass('active');


google.maps.event.addListener(map, "click", function(event)
            {
                // place a marker
                placeWaypointMarker(event.latLng);

            });
}


 function placeStartMarker(location) {
            start = location;
            startingPointInfoWindow.close();
            finalDestinationInfoWindow.close();

            markerInProgress = true;


            // first remove all markers if there are any
            deleteExistingStartMarkers();

            startMarker = new google.maps.Marker({
                position: location, 
                map: map
            });

            startMarker.setIcon('images/map_icons/start_flag.png');


            startingPointInfoWindow.open(map, startMarker);
            startingPointInfoWindow.show();

            // add marker in markers array
            startMarkersArray.push(startMarker);
            //map.setCenter(location);
        }

function placeFinishMarker(location) {
            finish = location;
            startingPointInfoWindow.close();
            finalDestinationInfoWindow.close();
            waypointMarkerInfoWindow.close();
            markerInProgress = true;

            // first remove all markers if there are any
            deleteExistingFinishMarkers();

            finishMarker = new google.maps.Marker({
                position: location, 
                map: map
            });

            finishMarker.setIcon('images/map_icons/finish_flag.png');


            finalDestinationInfoWindow.open(map, finishMarker);

            // add marker in markers array
            finishMarkersArray.push(finishMarker);

            google.maps.event.clearInstanceListeners(finishMarker);


            //map.setCenter(location);
        }

 function placeWaypointMarker(location) {

            startingPointInfoWindow.close();
            finalDestinationInfoWindow.close();
            waypointMarkerInfoWindow.close();
            markerInProgress = true;


            // first remove all markers if there are any
            //deleteExistingMarkers();

            waypointMarker = new google.maps.Marker({
                icon:'images/map_icons/red_flag.png',
                position: location, 
                map: map
            });

            waypointMarker.setIcon('images/map_icons/red_flag.png');

            waypointMarkerInfoWindow.open(map, waypointMarker);

            // add marker in markers array
            waypointMarkersArray.push({
          location:waypointMarker.getPosition(),
          stopover:true});

            //map.setCenter(location);
        }
        // Deletes all markers in the array by removing references to them
  function deleteExistingStartMarkers() {
      if (startMarkersArray && markerInProgress) {
          for (i in startMarkersArray) {
              //startMarkersArray[i].setMap(null);
              }
          startMarkersArray.length = 0;
            }
        }
  function deleteExistingFinishMarkers() {
      if (finishMarkersArray && markerInProgress) {
          for (i in finishMarkersArray) {
              //finishMarkersArray[i].setMap(null);
              }
          finishMarkersArray.length = 0;
            }
        }

  function startMarkerComplete(){
  $('.toolSet1').each(function(){
    $(this).removeClass('active');
  });
  map.setOptions({draggableCursor:"https://maps.gstatic.com/mapfiles/openhand_8_8.cur"});

    startingPointInfoWindow.hide();
    google.maps.event.clearListeners(map);

  }

  function finalMarkerComplete(){
  $('.toolSet1').each(function(){
    $(this).removeClass('active');
  });
  map.setOptions({draggableCursor:"https://maps.gstatic.com/mapfiles/openhand_8_8.cur"});

    finalDestinationInfoWindow.hide();
    google.maps.event.clearListeners(map);
    markerInProgress = false;

    calcRoute();


    directionsDisplay.setOptions( { suppressMarkers: true } );

  }


//info window content
var startingPointForm = '<div class="droneValueForm">'+
'<div class="droneValueInput">'+
'<span class="droneValueLabel">Initial Altitude:</span>'+
'<span class="droneValue"><input id="startingPointAltitude" type="text" value="5">m</span>'+
'</div><br/>'+
'<div class="droneValueInput">'+
'<span class="droneValueLabel">Delay:</span>'+
'<div class="droneValue"><input id="startingPointHoverTime" type="text" value="0">s</span>'+
'</div><br/>'+
'<div class="droneValueOption">'+
'<span class="markComplete" onclick="startMarkerComplete();">Done</span>'+
'<span class="removeMarker" onclick="">Remove</span>'+
'</div>'+
'</div>';

var finalDestinationForm = '<div class="droneValueForm">'+
'<div class="droneValueInput">'+
'<span class="droneValueLabel">Final Altitude:</span>'+
'<span class="droneValue"><input id="finalPointAltitude" type="text" value="5">m</span>'+
'</div><br/>'+
'<div class="droneValueInput">'+
'<span class="droneValueLabel">Wait Time:</span>'+
'<div class="droneValue"><input id="finalPointHoverTime" type="text" value="0">s</span>'+
'</div><br/>'+
'<div class="droneValueOption">'+
'<span class="markComplete" onclick="finalMarkerComplete();">Done</span>'+
'<span class="removeMarker" onclick="">Remove</span>'+
'</div>'+
'</div>';

var waypointMarkerForm = '<div class="droneValueForm">'+
'<div class="droneValueInput">'+
'<span class="droneValueLabel">Final Altitude:</span>'+
'<span class="droneValue"><input id="startingPointAltitude" type="text" value="5">m</span>'+
'</div><br/>'+
'<div class="droneValueInput">'+
'<span class="droneValueLabel">Wait Time:</span>'+
'<div class="droneValue"><input id="startingPointHoverTime" type="text" value="0">s</span>'+
'</div><br/>'+
'<div class="droneValueOption">'+
'<span class="markComplete" onclick="waypointMarkerInfoWindow.hide();">Done</span>'+
'<span class="removeMarker" onclick="">Remove</span>'+
'</div>'+
'</div>';

var startingPointOptions = {disableAutoPan: false,
  alignBottom: true,
  closeBoxURL: "",
  pixelOffset: new google.maps.Size(0, -40),
  boxStyle: { 
              background: 'rgba(0,0,0,0.8)',
              width:"150px",
              height:"100px",
              color:'#fff',
              padding:"10px",
              WebkitBorderRadius: "5px",
              MozBorderRadius: "5px",
              borderRadius: "5px"
            },
  maxWidth: 0,  // no max
  infoBoxClearance: new google.maps.Size(1, 1),
  content:startingPointForm,
  pane: "floatPane"

  };

var finishPointOptions = {disableAutoPan: false,
  alignBottom: true,
  closeBoxURL: "",
  pixelOffset: new google.maps.Size(0, -40),
  boxStyle: { 
              background: 'rgba(0,0,0,0.8)',
              width:"150px",
              height:"100px",
              color:'#fff',
              padding:"10px",
              WebkitBorderRadius: "5px",
              MozBorderRadius: "5px",
              borderRadius: "5px"
            },
  maxWidth: 0,  // no max
  infoBoxClearance: new google.maps.Size(1, 1),
  content:finalDestinationForm,
  pane: "floatPane"

  };

var waypointMarkerOptions = {disableAutoPan: false,
  alignBottom: true,
  closeBoxURL: "",
  pixelOffset: new google.maps.Size(0, -40),
  boxStyle: { 
              background: 'rgba(0,0,0,0.8)',
              width:"150px",
              height:"100px",
              color:'#fff',
              padding:"10px",
              WebkitBorderRadius: "5px",
              MozBorderRadius: "5px",
              borderRadius: "5px"
            },
  maxWidth: 0,  // no max
  infoBoxClearance: new google.maps.Size(1, 1),
  content:waypointMarkerForm,
  pane: "floatPane"

  };
var start, finish;
var startMarker, finishMarker, waypointMarker;

var startingPointInfoWindow = new InfoBox(startingPointOptions);
var finalDestinationInfoWindow = new InfoBox(finishPointOptions);
var waypointMarkerInfoWindow = new InfoBox(waypointMarkerOptions);

var markingInProgress;
var startMarkersArray = [];
var finishMarkersArray = [];
var waypointMarkersArray = [];



$("input:text:visible:first").focus();
$(".mapClass").click(function() {
 map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
  $('#settingsPanel .nav li').each(function(){
  $(this).removeClass('active');
 });
 $(this).addClass('active');
});
$(".satelliteClass").click(function() {
 map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
  $('#settingsPanel .nav li').each(function(){
  $(this).removeClass('active');
 });
 $(this).addClass('active');
});
$(".hybridClass").click(function() {
 map.setMapTypeId(google.maps.MapTypeId.HYBRID);
 $('#settingsPanel .nav li').each(function(){
  $(this).removeClass('active');
 });
 $(this).addClass('active');
});
function settingsPanelInitialization(){
  $('#settingsPanel').show('slide',{direction:'left'},500);
  $('.mapCenterString').html($('#locationinput').val());
}



 var polyOptions = {
    strokeColor: '#ff0000',
    strokeOpacity: 0.7,
    strokeWeight: 7
  };

  poly = new google.maps.Polyline(polyOptions);
  poly.setMap(map);
  var path = poly.getPath();

function calcRoute() {
  if(calcRouteFlag==0){
    poly.setMap(map);
  }

  else if(calcRouteFlag==1)
  {
      var request = {
      origin: start,
      destination: finish,
      travelMode: google.maps.DirectionsTravelMode.WALKING,
      waypoints:waypointMarkersArray,
      };

      directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      }

      start_point = startMarker.getPosition();
      end_point = finishMarker.getPosition();
      map.setCenter(startMarker.getPosition());


    });
    directionsDisplay.setMap(map);

if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }

xmlhttp.open("GET","http://maps.googleapis.com/maps/api/directions/xml?origin="+start+"&destination="+finish+"&sensor=false&mode=walking",false);
xmlhttp.send();
xmlDoc=xmlhttp.responseXML;
xmlString = (new XMLSerializer()).serializeToString(xmlDoc);
  }
}