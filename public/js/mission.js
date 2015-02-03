
var start_point = new google.maps.LatLng(37.79839, -122.40211); 
var end_point = new google.maps.LatLng(37.78632, -122.39576);
var lookat_point = new google.maps.LatLng(37.78267, -122.40076);

var calcRouteFlag = 1; //flag for free flight mode and constrained mode
var markerInProgress = true;
var xmlString;
var rendererOptions = {
  draggable: true
};
var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);;
var directionsService = new google.maps.DirectionsService();
var map;
var markerCount = 0;
var stepDisplay;
var markerArray = [];
var position;
var marker = null;
var polyline = null;
var poly2 = null;
var speed = 0.000005, wait = 1;
var infowindow = null;
var myPano;   
var panoClient;
var nextPanoId;
var timerHandle = null;
/*
$('#settingsPanel').click(
    function(){
      $(this).hide('slide',{direction:'left'},500);
      $('#minimizedSettingsPanel').show();
});
$('#minimizedSettingsPanel').click(
    function(){
      $('#settingsPanel').show('slide',{direction:'left'},500);
      $(this).hide();
});*/


 var icons = {
      header: "ui-icon-circle-arrow-e",
      activeHeader: "ui-icon-circle-arrow-s"
    };
    $( ".accordion" ).accordion({
      icons: icons
    });
    $( "#toggle" ).button().click(function() {
      if ( $( ".accordion" ).accordion( "option", "icons" ) ) {
        $( ".accordion" ).accordion( "option", "icons", null );
      } else {
        $( ".accordion" ).accordion( "option", "icons", icons );
      }
    });
function initialize() {

  var mapOptions = {
    zoom: 17,
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    center: jakarta,
    zoomControl: false,
    streetViewControl: false,
    panControl: false,
    mapTypeControl: false,
  };

var place="xyz";

var input = document.getElementById('locationinput');
var autocomplete = new google.maps.places.Autocomplete(input, options);

var infowindow = new google.maps.InfoWindow();
var marker = new google.maps.Marker({
  map: map
});

var options = {
  componentRestrictions: {country: 'us'}
};

  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    input.className = '';
    place = autocomplete.getPlace();
    if (!place.geometry) {
      // Inform the user that the place was not found and return.
      input.className = 'notfound';
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(19);  // Why 17? Because it looks good.
    }
    marker.setIcon(/** @type {google.maps.Icon} */({
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }));
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
    //infowindow.open(map, marker);

    $('#mapModal').modal('toggle');

    settingsPanelInitialization();
  });

  map = new google.maps.Map(document.getElementById('missionCanvas'), mapOptions);
  directionsDisplay.setPanel(document.getElementById('directionsPanel'));

  google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
  });

}

 var polyOptions = {
    strokeColor: '#ff0000',
    strokeOpacity: 0.4,
    strokeWeight: 7
  };

  poly = new google.maps.Polyline(polyOptions);
  poly.setMap(map);
  var path = poly.getPath();

function calcRoute() {
  directionsDisplay.setOptions( { suppressMarkers: true } );
  createZone();


  if(calcRouteFlag==0){
    poly.setMap(map);
  }

  else if(calcRouteFlag==1)
  {
      var request = {
      origin: start,
      destination: finish,
      travelMode: google.maps.DirectionsTravelMode.WALKING,
      waypoints:startMarkersArray,
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
  }
}

google.maps.event.addDomListener(window, 'load', initialize);

//info window content
var startingPointForm = '<div class="droneValueForm">'+
'<div class="droneValueInput">'+
'<span class="droneValueLabel">Initial Altitude:</span>'+
'<span class="droneValue"><input id="startingPointAltitude" type="text" value="5">m</span>'+
'</div><br/><br/>'+
'<span class="droneValueInput">'+
'<span class="droneValueLabel">Holdtime:</span>'+
'<span class="droneValue"><input id="startingPointHoverTime" type="text" value="0">s</span>'+
'</span><br/>'+
'<div class="droneValueInput">'+
'<span class="droneValueLabel">Latitude:</span>'+
'<span class="droneValue"><input id="startingPointAltitude" type="text" value="5">&deg</span>'+
'</div><br/><br/>'+

'<span class="droneValueLabel">Longitude:</span>'+
'<span class="droneValue"><input id="startingPointAltitude" type="text" value="5">&deg</span>'+
'</div><br/>'+
'<div class="droneValueOption">'+
'<span class="markComplete" onclick="startMarkerComplete();">Done</span>'+
'<span class="removeMarker"></span>'+
'</div>'+
'</div>';

var finalDestinationForm = '<div class="droneValueForm">'+
'<div class="droneValueInput">'+
'<span class="droneValueLabel">Final Altitude:</span>'+
'<span class="droneValue"><input id="finalPointAltitude" type="text" value="5">m</span>'+
'</div><br/><br/>'+
'<span class="droneValueInput">'+
'<span class="droneValueLabel">Holdtime:</span>'+
'<span class="droneValue"><input id="startingPointHoverTime" type="text" value="0">s</span>'+
'</span><br/>'+
'<div class="droneValueInput">'+
'<span class="droneValueLabel">Latitude:</span>'+
'<span class="droneValue"><input id="startingPointAltitude" type="text" value="5">&deg</span>'+
'</div><br/><br/>'+

'<span class="droneValueLabel">Longitude:</span>'+
'<span class="droneValue"><input id="startingPointAltitude" type="text" value="5">&deg</span>'+
'</div><br/>'+
'<div class="droneValueOption">'+
'<span class="markComplete" onclick="finalMarkerComplete();">Done</span>'+
'<span class="removeMarker" onclick=""></span>'+
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
              background: '#222',
              width:"150px",
              height:"170px",
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
              background: '#222',
              width:"150px",
              height:"170px",
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
              background: '#222',
              width:"150px",
              height:"170px",
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

function startingPoint(){
map.setOptions({ draggableCursor: "url('images/map_icons/red_flag.png') 30 30, default" });
$('.toolSet1').each(function(){
  $(this).removeClass('active');
 });
$('#startingPoint').addClass('active');

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

            $('#bottomPanel').addClass('panel-active');
            if(markerCount==0)
              {
                start = location;
                $('.preDistance').text("N/A");
                $('.preTime').text("N/A");
              }

            else if(markerCount==1){
              $('.preDistance').text("442 M");
              $('.preTime').text("2:30:42");

            }

            startingPointInfoWindow.close();
            finalDestinationInfoWindow.close();



            markerInProgress = true;


            // first remove all markers if there are any

            startMarker = new google.maps.Marker({
                position: location, 
                map: map
            });

            startMarker.setIcon('images/map_icons/red_flag.png');


            startingPointInfoWindow.open(map, startMarker);
            startingPointInfoWindow.show();

            // add marker in markers array
          if(markerCount>=1){
            startMarkersArray.push({
            location:startMarker.getPosition()});
          }

          markerCount++;


          timelineAddition('waypoint', markerCount);

            //map.setCenter(location);
        }

 function placeFinishMarker(location) {
            $('.preDistance').text("942 M");
            $('.preTime').text("4:50:28");
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

            markerCount++;
            timelineAddition('finish', markerCount);
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

  function freeFlightMode(){
  directionsDisplay.setMap(null);
  $('.toolSet2').each(function(){
    $(this).removeClass('active');
  });

  $('#freeFlightMode').addClass('active');
  calcRouteFlag=0;
  if(!markerInProgress)
    calcRoute();

  }


  function roadRestrictedMode(){
  poly.setMap(null);
  $('.toolSet2').each(function(){
    $(this).removeClass('active');
  });
  $('#roadRestrictedMode').addClass('active');
  calcRouteFlag=1;
  if(!markerInProgress)
    calcRoute();
  }
 

  //function launchHyperlapse(){


    var directions_renderer, directions_service, streetview_service, geocoder;
    var start_pin, end_pin, pivot_pin, camera_pin;
    var _elevation = 0;
    var _route_markers = [];

    function show(msg) {
      document.getElementById("text").innerHTML = msg;
    }

    function init() {
        map.panTo(start_point);

      if( window.location.hash ) {
        
        parts = window.location.hash.substr( 1 ).split( ',' );
        start_point = new google.maps.LatLng(parts[0], parts[1]);
        lookat_point = new google.maps.LatLng(parts[2], parts[3]);
        end_point = new google.maps.LatLng(parts[4], parts[5]);
        _elevation = parts[6] || 0;
        map.setCenter(start_point);
      } 

      /* Map */

      function snapToRoad(point, callback) {
        var request = { origin: point, destination: point, travelMode: google.maps.TravelMode["WALKING"] };
        directions_service.route(request, function(response, status) {
          if(status=="OK") callback(response.routes[0].overview_path[0]);
          else callback(null);
        });
      }

      function changeHash() {
        window.location.hash = start_pin.getPosition().lat() + ',' + start_pin.getPosition().lng() + ','
          + pivot_pin.getPosition().lat() + ',' + pivot_pin.getPosition().lng() + ','
          + end_pin.getPosition().lat() + ',' + end_pin.getPosition().lng() + ','
          + _elevation;
      }

      var mapOpt = { 
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: start_point,
        zoom: 15
      };

      map = new google.maps.Map(document.getElementById("mapInset"), mapOpt);
      geocoder = new google.maps.Geocoder();

      var overlay = new google.maps.StreetViewCoverageLayer();
      overlay.setMap(map);

      directions_service = new google.maps.DirectionsService();
      directions_renderer = new google.maps.DirectionsRenderer({draggable:false, markerOptions:{visible: false}});
      directions_renderer.setMap(map);
      directions_renderer.setOptions({preserveViewport:true});

      camera_pin = new google.maps.Marker({
        position: start_point,
        icon:'images/map_icons/drone.png',
        map: map
      });

      start_pin = new google.maps.Marker({
        icon:'images/map_icons/start_flag.png',
        position: start_point,
        draggable: true,
        map: map
      });

      google.maps.event.addListener (start_pin, 'dragend', function (event) {
        snapToRoad(start_pin.getPosition(), function(result) {
          start_pin.setPosition(result);
          start_point = result;
          changeHash();
        });
      });

      end_pin = new google.maps.Marker({
        icon:'images/map_icons/finish_flag.png',
        position: end_point,
        draggable: true,
        map: map
      });

      google.maps.event.addListener (end_pin, 'dragend', function (event) {
        snapToRoad(end_pin.getPosition(), function(result) {
          end_pin.setPosition(result);
          end_point = result;
          changeHash();
        });
      });

      pivot_pin = new google.maps.Marker({
        position: lookat_point,
        draggable: true,
        map: map
      });

      google.maps.event.addListener (pivot_pin, 'dragend', function (event) {
        hyperlapse.setLookat( pivot_pin.getPosition() );
        changeHash();
      });

      function findAddress(address) {
        geocoder.geocode( { 'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            o.drop_pins();
          } else {
            show( "Geocode was not successful for the following reason: " + status );
          }
        });
      }

      pivot_pin.setVisible(false);
      /* Hyperlapse */

      var pano = document.getElementById('pano');
      var is_moving = false;
      var px, py;
      var onPointerDownPointerX=0, onPointerDownPointerY=0;

      var hyperlapse = new Hyperlapse(pano, {
        lookat: lookat_point,
        fov: 110,
        millis: 153,
        width: window.innerWidth,
        height: window.innerHeight,
        zoom: 2,
        use_lookat: false,
        distance_between_points: 5,
        max_points: 100,
        elevation: _elevation
      });
      
      

      hyperlapse.onError = function(e) {
        show( "ERROR: "+ e.message );
      };

      hyperlapse.onRouteProgress = function(e) {
        _route_markers.push( new google.maps.Marker({
          position: e.point.location,
          draggable: false,
          icon: "images/dot_marker.png",
          map: map
          })
        );
      };

      hyperlapse.onRouteComplete = function(e) {
        directions_renderer.setDirections(e.response);
        show( "Number of Points: "+ hyperlapse.length() );
        hyperlapse.load();
      };

      hyperlapse.onLoadProgress = function(e) {
        show( "Loading: "+ (e.position+1) +" of "+ hyperlapse.length() );
      };

      hyperlapse.onLoadComplete = function(e) {
        show( "" +
          "Start: " + start_pin.getPosition().toString() + 
          "<br>End: " + end_pin.getPosition().toString() + 
          "<br>Lookat: " + pivot_pin.getPosition().toString() + 
          "<br>Ready." );
      };

      hyperlapse.onFrame = function(e) {
        show( "" +
          "Start: " + start_pin.getPosition().toString() + 
          "<br>End: " + end_pin.getPosition().toString() + 
          "<br>Lookat: " + pivot_pin.getPosition().toString() + 
          "<br>Position: "+ (e.position+1) +" of "+ hyperlapse.length() );
        camera_pin.setPosition(e.point.location);
      };

      pano.addEventListener( 'mousedown', function(e){
        e.preventDefault();

        is_moving = true;

        onPointerDownPointerX = e.clientX;
        onPointerDownPointerY = e.clientY;

        px = hyperlapse.position.x;
        py = hyperlapse.position.y;

      }, false );

      pano.addEventListener( 'mousemove', function(e){
        e.preventDefault();
        var f = hyperlapse.fov() / 500;

        if ( is_moving ) {
          var dx = ( onPointerDownPointerX - e.clientX ) * f;
          var dy = ( e.clientY - onPointerDownPointerY ) * f;
          hyperlapse.position.x = px + dx; // reversed dragging direction (thanks @mrdoob!)
          hyperlapse.position.y = py + dy;

          o.position_x = hyperlapse.position.x;
          o.position_y = hyperlapse.position.y;
        }

      }, false );

      pano.addEventListener( 'mouseup', function(){
        is_moving = false;

        hyperlapse.position.x = px;
        //hyperlapse.position.y = py;
      }, false );

      

      /* Dat GUI */

      var gui = new dat.GUI();

      var o = {
        distance_between_points:10, 
        max_points:100, 
        fov: 110, 
        elevation:Math.floor(_elevation), 
        tilt:0, 
        millis:153, 
        offset_x:0,
        offset_y:0,
        offset_z:0,
        position_x:0,
        position_y:0,
        use_lookat:true,
        screen_width: window.innerWidth,
        screen_height: window.innerHeight,
        generate:function(){
          show( "Generating route..." );

          directions_renderer.setDirections({routes: []});

          var marker;
          while(_route_markers.length > 0) {
            marker = _route_markers.pop();
            marker.setMap(null);
          }

          request = {
            origin: start_point, 
            destination: end_point, 
            travelMode: google.maps.DirectionsTravelMode.WALKING
          };

          directions_service.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {   
              hyperlapse.generate({route: response});
            } else {
              console.log(status);
            }
          })
        },
        drop_pins:function(){
          var bounds = map.getBounds();
          var top_left = bounds.getNorthEast();
          var bot_right = bounds.getSouthWest();
          var hdif = Math.abs(top_left.lng() - bot_right.lng());
          var spacing = hdif/4;

          var center = map.getCenter();
          var c1 = new google.maps.LatLng(center.lat(), center.lng()-spacing);
          var c2 = new google.maps.LatLng(center.lat(), center.lng());
          var c3 = new google.maps.LatLng(center.lat(), center.lng()+spacing);

          hyperlapse.lookat = c2;
          pivot_pin.setPosition(c2);

          snapToRoad(c1, function(result1) {
            start_pin.setPosition(result1);
            start_point = result1;

            snapToRoad(c3, function(result3) {
              end_pin.setPosition(result3);
              end_point = result3;
              changeHash();
            });
          });
        }
      };


      var scn = gui.addFolder('screen');
      scn.add(o, 'screen_width', window.innerHeight).listen();
      scn.add(o, 'screen_height', window.innerHeight).listen();

      var parameters = gui.addFolder('parameters');

      var distance_between_points_control = parameters.add(o, 'distance_between_points', 5, 100);
      distance_between_points_control.onChange(function(value) {
        hyperlapse.setDistanceBetweenPoint(value);
      });

      var max_points = parameters.add(o, 'max_points', 10, 300);
      max_points.onChange(function(value) {
        hyperlapse.setMaxPoints(value);
      });

      var fov_control = parameters.add(o, 'fov', 1, 180);
      fov_control.onChange(function(value) {
        hyperlapse.setFOV(value);
      });

      var pitch_control = parameters.add(o, 'elevation', -1000, 1000);
      pitch_control.onChange(function(value) {
        _elevation = value;
        hyperlapse.elevation_offset = value;
        changeHash();
      });

      var millis_control = parameters.add(o, 'millis', 10, 250);
      millis_control.onChange(function(value) {
        hyperlapse.millis = value;
      });

      var offset_x_control = parameters.add(o, 'offset_x', -360, 360);
      offset_x_control.onChange(function(value) {
        hyperlapse.offset.x = value;
      });

      var offset_y_control = parameters.add(o, 'offset_y', -180, 180);
      offset_y_control.onChange(function(value) {
        hyperlapse.offset.y = value;
      });

      var offset_z_control = parameters.add(o, 'offset_z', -360, 360);
      offset_z_control.onChange(function(value) {
        hyperlapse.offset.z = value;
      });

      var position_x_control = parameters.add(o, 'position_x', -360, 360).listen();
      position_x_control.onChange(function(value) {
        hyperlapse.position.x = value;
      });

      var position_y_control = parameters.add(o, 'position_y', -180, 180).listen();
      position_y_control.onChange(function(value) {
        hyperlapse.position.y = value;
      });

      var tilt_control = parameters.add(o, 'tilt', -Math.PI, Math.PI);
      tilt_control.onChange(function(value) {
        hyperlapse.tilt = value;
      });

      var lookat_control = parameters.add(o, 'use_lookat')
      lookat_control.onChange(function(value) {
        hyperlapse.use_lookat = value;
      });

      parameters.open();
      

      var play_controls = gui.addFolder('play controls');
      play_controls.add(hyperlapse, 'play');
      play_controls.add(hyperlapse, 'pause');
      play_controls.add(hyperlapse, 'next');
      play_controls.add(hyperlapse, 'prev');
      play_controls.open();

      gui.add(o, 'drop_pins');
      gui.add(o, 'generate');
      gui.add(hyperlapse, 'load');


      window.addEventListener('resize', function(){
        hyperlapse.setSize(window.innerWidth, window.innerHeight);
        o.screen_width = window.innerWidth;
        o.screen_height = window.innerHeight;
      }, false);

      var show_ui = true;
      document.addEventListener( 'keydown', onKeyDown, false );
      function onKeyDown ( event ) {

        switch( event.keyCode ) {
          case 72: /* H */
            show_ui = !show_ui;
            document.getElementById("controls").style.opacity = (show_ui)?1:0;
            break;

          case 190: /* > */
            hyperlapse.next();
            break;

          case 188: /* < */
            hyperlapse.prev();
            break;
        }

      };

      o.generate();
    }




function createMarker(latlng, label, html) {
// alert("createMarker("+latlng+","+label+","+html+","+color+")");
    var contentString = '<b>'+label+'</b><br>'+html;
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: label,
        zIndex: Math.round(latlng.lat()*-100000)<<5,
        icon:'images/map_icons/drone.png',
        });
        marker.myname = label;
        // gmarkers.push(marker);
    return marker;
}


function initializeSimulator() {

  var jakarta = new google.maps.LatLng(-6.223309, 106.807580);

    // Instantiate a directions service.
    directionsService = new google.maps.DirectionsService();
    
    // Create a map and center it on Manhattan.
    var myOptions = {
      center:jakarta,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      zoom:18,
      disableDefaultUI: true,
    }
    //map = new google.maps.Map(document.getElementById("singleMap"), myOptions);
    
    // Create a renderer for directions and bind it to the map.
    var rendererOptions = {
      map: map
    }
    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
    
    // Instantiate an info window to hold step text.
    stepDisplay = new google.maps.InfoWindow();

    polyline = new google.maps.Polyline({
    path: [],
    strokeColor: '#FF0000',
    strokeWeight: 3
    });
    poly2 = new google.maps.Polyline({
    path: [],
    strokeColor: '#FF0000',
    strokeWeight: 3
    });
  }

  
  
    var steps = []

function calcSimRoute(){

if (timerHandle) { clearTimeout(timerHandle); }
if (marker) { marker.setMap(null);}
polyline.setMap(null);
poly2.setMap(null);
directionsDisplay.setMap(null);
    polyline = new google.maps.Polyline({
    path: [],
    strokeColor: '#FF0000',
    strokeWeight: 0
    });
    poly2 = new google.maps.Polyline({
    path: [],
    strokeColor: '#FF0000',
    strokeWeight: 0
    });
    // Create a renderer for directions and bind it to the map.
    var rendererOptions = {
      map: map,
    }

/*directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);*/

        //var start = '-6.223200, 106.809731';
        //var end = '-6.224022, 106.808015';
        var travelMode = google.maps.DirectionsTravelMode.WALKING

        var request = {
            origin: start,
            destination: finish,
            travelMode: travelMode,
            waypoints:startMarkersArray
        };

        // Route the directions and pass the response to a
        // function to create markers for each step.
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK){
    directionsDisplay.setDirections(response);

        var bounds = new google.maps.LatLngBounds();
        var route = response.routes[0];
        startLocation = new Object();
        endLocation = new Object();

        // For each route, display summary information.
    var path = response.routes[0].overview_path;
    var legs = response.routes[0].legs;
        for (i=0;i<legs.length;i++) {
          if (i == 0) { 
            startLocation.latlng = legs[i].start_location;
            startLocation.address = legs[i].start_address;
            // marker = google.maps.Marker({map:map,position: startLocation.latlng});
            marker = createMarker(legs[i].start_location,"start",legs[i].start_address,"green");
          }
          endLocation.latlng = legs[i].end_location;
          endLocation.address = legs[i].end_address;
          var steps = legs[i].steps;
          for (j=0;j<steps.length;j++) {
            var nextSegment = steps[j].path;
            for (k=0;k<nextSegment.length;k++) {
              polyline.getPath().push(nextSegment[k]);
              bounds.extend(nextSegment[k]);



            }
          }
        }

        polyline.setMap(map);
        map.fitBounds(bounds);
//        createMarker(endLocation.latlng,"end",endLocation.address,"red");
    map.setZoom(18);
    startAnimation();
    }                                                    
 });
}
  

  
      var step = 0.04; // 5; // metres
      var tick = 10; // milliseconds
      var eol;
      var k=0;
      var stepnum=0;
      var speed = "";
      var lastVertex = 1;


//=============== animation functions ======================
      function updatePoly(d) {
        // Spawn a new polyline every 20 vertices, because updating a 100-vertex poly is too slow
        if (poly2.getPath().getLength() > 20) {
          poly2=new google.maps.Polyline([polyline.getPath().getAt(lastVertex-1)]);
          // map.addOverlay(poly2)
        }

        if (polyline.GetIndexAtDistance(d) < lastVertex+2) {
           if (poly2.getPath().getLength()>1) {
             poly2.getPath().removeAt(poly2.getPath().getLength()-1)
           }
           poly2.getPath().insertAt(poly2.getPath().getLength(),polyline.GetPointAtDistance(d));
        } else {
          poly2.getPath().insertAt(poly2.getPath().getLength(),endLocation.latlng);
        }
      }


      function animate(d) {
// alert("animate("+d+")");
        if (d>eol) {
          map.panTo(endLocation.latlng);
          marker.setPosition(endLocation.latlng);
          marker.setMap(null);
          landingSequence();
          createCircle();
          return;
        }


        var p = polyline.GetPointAtDistance(d);
        map.panTo(p);
        marker.setPosition(p);
        updatePoly(d);
        timerHandle = setTimeout("animate("+(d+step)+")", tick);
      }


function startAnimation() {
        eol=polyline.Distance();
        map.setCenter(polyline.getPath().getAt(0));
        // map.addOverlay(new google.maps.Marker(polyline.getAt(0),G_START_ICON));
        // map.addOverlay(new GMarker(polyline.getVertex(polyline.getVertexCount()-1),G_END_ICON));
        // marker = new google.maps.Marker({location:polyline.getPath().getAt(0)} /* ,{icon:car} */);
        // map.addOverlay(marker);
        poly2 = new google.maps.Polyline({path: [polyline.getPath().getAt(0)], strokeColor:"#0000FF", strokeWeight:10});
        // map.addOverlay(poly2);
        setTimeout("animate(0)",5000);  // Allow time for the initial map display
}


//=============== ~animation funcitons =====================

function fixIntegers(integer)
{
    if (integer < 0)
        integer = 0;
    if (integer < 10)
        return "0" + integer;
    return "" + integer;
}


$(".knob").knob({
    change : function (value) {
      //console.log("change : " + value);
    },
    release : function (value) {
      //console.log(this.$.attr('value'));
        console.log("release : " + value);
    },
    cancel : function () {
        console.log("cancel : ", this);
    },
});


function initializeTimer(){

var future1 = new Date();
future1.setMinutes(future1.getMinutes() + 4);
future1.setSeconds(future1.getSeconds() + 50);


var future2 = new Date();
future2.setMinutes(future2.getMinutes() + 6);
future2.setSeconds(future2.getSeconds() + 33);


var future3 = new Date();
future3.setMinutes(future3.getMinutes() + 8);
future3.setSeconds(future3.getSeconds() + 52);


var future4 = new Date();
future4.setMinutes(future4.getMinutes() + 6);
future4.setSeconds(future4.getSeconds() + 12);


var future5 = new Date();
future5.setMinutes(future5.getMinutes() + 7);
future5.setSeconds(future5.getSeconds() + 38);

var targetDistance = 952;
var fromStart=0;
$('#eta').show();
setInterval(function(){

    //future1.setSeconds(future1.getSeconds() + 45);
    //var future1 = new Date("Sep 20 2014 21:15:00 GMT+0200");


    var now = new Date();
    var difference1 = Math.floor((future1.getTime() - now.getTime()) / 1000);
    var difference2 = Math.floor((future2.getTime() - now.getTime()) / 1000);
    var difference3 = Math.floor((future3.getTime() - now.getTime()) / 1000);
    var difference4 = Math.floor((future4.getTime() - now.getTime()) / 1000);
    var difference5 = Math.floor((future5.getTime() - now.getTime()) / 1000);


    var seconds1 = fixIntegers(difference1 % 60);
    difference1 = Math.floor(difference1 / 60);
    var seconds2 = fixIntegers(difference2 % 60);
    difference2 = Math.floor(difference2 / 60);
    var seconds3 = fixIntegers(difference3 % 60);
    difference3 = Math.floor(difference3 / 60);
    var seconds4 = fixIntegers(difference4 % 60);
    difference4 = Math.floor(difference4 / 60);
    var seconds5 = fixIntegers(difference5 % 60);
    difference5 = Math.floor(difference5 / 60);
    
    var minutes1 = fixIntegers(difference1 % 60);
    difference1 = Math.floor(difference1 / 60);
    var minutes2 = fixIntegers(difference2 % 60);
    difference2 = Math.floor(difference2 / 60);
    var minutes3 = fixIntegers(difference3 % 60);
    difference3 = Math.floor(difference3 / 60);
    var minutes4 = fixIntegers(difference4 % 60);
    difference4 = Math.floor(difference4 / 60);
    var minutes5 = fixIntegers(difference5 % 60);
    difference5 = Math.floor(difference5 / 60);
    
    var hours1 = fixIntegers(difference1 % 24);
    difference1 = Math.floor(difference1 / 24);
    var hours2 = fixIntegers(difference2 % 24);
    difference2 = Math.floor(difference2 / 24);
    var hours3 = fixIntegers(difference3 % 24);
    difference3 = Math.floor(difference3 / 24);
    var hours4 = fixIntegers(difference4 % 24);
    difference4 = Math.floor(difference4 / 24);
    var hours5 = fixIntegers(difference5 % 24);
    difference5 = Math.floor(difference5 / 24);
        
    $(".seconds1").text(seconds1);
    $(".minutes1").text(minutes1 + ":");
    $(".hours1").text(hours1 + ":");

    $(".seconds2").text(seconds2);
    $(".minutes2").text(minutes2 + ":");
    $(".hours2").text(hours2 + ":");

    $(".seconds3").text(seconds3);
    $(".minutes3").text(minutes3 + ":");
    $(".hours3").text(hours3 + ":");

    $(".seconds4").text(seconds4);
    $(".minutes4").text(minutes4 + ":");
    $(".hours4").text(hours4 + ":");

    $(".seconds5").text(seconds5);
    $(".minutes5").text(minutes5 + ":");
    $(".hours5").text(hours5 + ":");

    targetDistance = targetDistance-2;
    fromStart = fromStart+2;
    $('#nextWaypointDistance .postLaunchValue').text(targetDistance);
    $('#distanceFromStart .postLaunchValue').text(fromStart);

}, 1000);

}

function fixIntegers(integer)
{
    if (integer < 0)
        integer = 0;
    if (integer < 10)
        return "0" + integer;
    return "" + integer;
}

$('#mapManipulation .dropdown-menu>li').click(function(){
  $('#mapManipulation .dropdown-menu>li').removeClass('active');
  $(this).addClass('active');
});

$('.pac-item').hover(function(){
  $(this).child().css({color:"#000;"});
});

$('#pathBuilder>.pbButton').click(function(){
$('#pathBuilder>.pbButton').removeClass('active');
$(this).addClass('active');
});

$('.routeMode').click(function(){
$('.routeMode').removeClass('active');
$(this).addClass('active');
});


function timelineAddition(type, count){

  if(type=='waypoint')
  {
    $('#listWaypoints').append(markersymbol);
    $('#markerDisplay').attr('id', 'markerDisplay'+count);
    $('#markerDisplay'+count+' .markerCount').append(count);
  }
  else
  {
    $('#listWaypoints').append(finishsymbol);
    $('#markerDisplay').attr('id', 'markerDisplay'+count);
    $('#markerDisplay'+count+' .markerCount').append(count);
  }
}


var markersymbol = '<div id="markerDisplay" class="markerDisplay">'+
'<div class="markerCount"></div>'+
'<img src="images/map_icons/red_flag.png">'+
'</div';

var finishsymbol = '<div id="markerDisplay" class="markerDisplay">'+
'<div class="markerCount"></div>'+
'<img src="images/map_icons/finish_flag.png">'+
'</div';


$('#next').click(function()
{
  $('#bottomPanel').addClass('preLaunch');

  $('#prepreLaunch').hide();
  $('#preLaunch').show();

  var finalWaypoints = '<div id="finalmarker" class="finalmarkerDisplay markerDisplay">'+
  
  '<div class="finalmarkerCount waypointattributeValue"></div>'+
  '<div class="height waypointattributeValue">5m</div>'+
  '<div class="speed waypointattributeValue">5m/s</div>'+
  '<div class="turn waypointattributeValue">Stop&Turn</div>'+
  '<div class="Holdtime waypointattributeValue">None</div>'+
  '<img src="images/map_icons/red_flag.png">'+
  '</div';

  var finalFinishPoint = '<div id="finalmarker" class="finalmarkerDisplay markerDisplay">'+
  
  '<div class="finalmarkerCount waypointattributeValue"></div>'+
  '<div class="height waypointattributeValue">5m</div>'+
  '<div class="speed waypointattributeValue">5m/s</div>'+
  '<div class="turn waypointattributeValue">Stop&Turn</div>'+
  '<div class="Holdtime waypointattributeValue">None</div>'+
  '<img src="images/map_icons/finish_flag.png">'+
  '</div';

  for(var x=0;x<markerCount-1;x++)
  {
    $('#confirmWaypoints').append(finalWaypoints);
    $('#finalMarker').attr('id', 'finalMarker'+x);
    $('#finalMarker'+x+' .finalmarkerCount').append(x);
    console.log(x);
  }

  $('#confirmWaypoints').append(finalFinishPoint);
  $('#finalMarker').attr('id', 'finalMarker'+x);
  $('#finalMarker'+x+' .finalmarkerCount').append(x);

});


function launchDroneMission(){
  $('#postLaunchModal').modal("toggle");
  progressBar();
  setTimeout(togglePostlaunchmodal,3000);
  $('#prepreLaunch').hide();
  $('#preLaunch').hide();
  $('#postLaunch').show();
  initializeTimer();
  initializeSimulator();
  calcSimRoute();
  setTimeout(takeoffSequence, 3000);

}

function togglePostlaunchmodal(){
  $('#postLaunchModal').modal("toggle");
}

function launchCoffeMission(){
  $('#prepreLaunch').hide();
  $('#preLaunch').hide();
  $('#postLaunch').show();
  initializeCoffeeTimer();
  initializeSimulator();
  setTimeout(inflightSequence, 1000);
  initializeCoffeeMission();
  calcCoffeeRoute();
  createZone();
}

  var jakarta = new google.maps.LatLng(-6.223309, 106.807580);
  var coffeestart = new google.maps.LatLng(-6.223200, 106.809731);
  var coffeeend = new google.maps.LatLng(-6.224022, 106.808015);
function initializeCoffeeMission() {



    // Instantiate a directions service.
    directionsService = new google.maps.DirectionsService();
    
    // Create a map and center it on Manhattan.
    var myOptions = {
      center:jakarta,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      zoom:18,
      disableDefaultUI: true,
    }
    //map = new google.maps.Map(document.getElementById("singleMap"), myOptions);
    
    // Create a renderer for directions and bind it to the map.
    var rendererOptions = {
      map: map
    }
    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
    

    // Instantiate an info window to hold step text.
    stepDisplay = new google.maps.InfoWindow();

    polyline = new google.maps.Polyline({
    path: [],
    strokeColor: '#FF0000',
    strokeWeight: 3,
    strokeOpacity: 0.5,
    });
    poly2 = new google.maps.Polyline({
    path: [],
    strokeColor: '#FF0000',
    strokeWeight: 3,
    strokeOpacity: 0.5,

    });
}


function calcCoffeeRoute(){

if (timerHandle) { clearTimeout(timerHandle); }
if (marker) { marker.setMap(null);}
polyline.setMap(null);
poly2.setMap(null);
directionsDisplay.setMap(null);
    polyline = new google.maps.Polyline({
    path: [],
    strokeColor: '#FF0000',
    strokeWeight: 5,
    strokeOpacity: 0.5,

    });
    poly2 = new google.maps.Polyline({
    path: [],
    strokeColor: '#FF0000',
    strokeWeight: 5,
    strokeOpacity: 0.5,

    });
    // Create a renderer for directions and bind it to the map.
    var rendererOptions = {
      map: map,
    }
directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
        var travelMode = google.maps.DirectionsTravelMode.WALKING

        var request = {
            origin: coffeestart,
            destination: coffeeend,
            travelMode: travelMode
        };

        // Route the directions and pass the response to a
        // function to create markers for each step.
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK){
    directionsDisplay.setDirections(response);

        var bounds = new google.maps.LatLngBounds();
        var route = response.routes[0];
        startLocation = new Object();
        endLocation = new Object();

        // For each route, display summary information.
    var path = response.routes[0].overview_path;
    var legs = response.routes[0].legs;
        for (i=0;i<legs.length;i++) {
          if (i == 0) { 
            startLocation.latlng = legs[i].start_location;
            startLocation.address = legs[i].start_address;
            // marker = google.maps.Marker({map:map,position: startLocation.latlng});
            marker = createMarker(legs[i].start_location,"start",legs[i].start_address,"green");
          }
          endLocation.latlng = legs[i].end_location;
          endLocation.address = legs[i].end_address;
          var steps = legs[i].steps;
          for (j=0;j<steps.length;j++) {
            var nextSegment = steps[j].path;
            for (k=0;k<nextSegment.length;k++) {
              polyline.getPath().push(nextSegment[k]);
              bounds.extend(nextSegment[k]);



            }
          }
        }

        polyline.setMap(map);
        map.fitBounds(bounds);
//        createMarker(endLocation.latlng,"end",endLocation.address,"red");
    map.setZoom(18);
    startCoffeeAnimation();
    }                                                    
 });
}

function startCoffeeAnimation() {
        marker.setMap(null);

        eol=polyline.Distance();
        map.setCenter(polyline.getPath().getAt(0));
        // map.addOverlay(new google.maps.Marker(polyline.getAt(0),G_START_ICON));
        // map.addOverlay(new GMarker(polyline.getVertex(polyline.getVertexCount()-1),G_END_ICON));
        // marker = new google.maps.Marker({location:polyline.getPath().getAt(0)} /* ,{icon:car} */);
        // map.addOverlay(marker);
        poly2 = new google.maps.Polyline({path: [polyline.getPath().getAt(0)], strokeColor:"#0000FF", strokeWeight:10});
        // map.addOverlay(poly2);
        setTimeout("animate(460)",1000); 
                marker.setMap(map);
 // Allow time for the initial map display
}

function launchVideoModal(){
  $('#videoModal').modal("toggle");
  progressBar();
  setTimeout(showVideo, 2000);

}

function showVideo(){
  window.location.href = 'http://localhost:3000';
}

function progressBar(){
    $('.simulationProgressBar').show();
    var progress = setInterval(function() {
    var $bar = $('.progress-bar');

    if ($bar.width()==400) {
        clearInterval(progress);
        $('.progress').removeClass('active');
    } else {
        $bar.width($bar.width()+40);
    }
  }, 300);

  setTimeout(hideProgressBar,3000);
}
function hideProgressBar(){
  $('.simulationProgressBar').hide();  
}

var greyZone;
var greyZonePoints = [
    new google.maps.LatLng(-6.22392, 106.80567),
    new google.maps.LatLng(-6.22441, 106.80598),
    new google.maps.LatLng(-6.22432, 106.80611),
    new google.maps.LatLng(-6.22383, 106.80581)
  ];


function createZone(){
  greyZone = new google.maps.Polygon({
      strokeColor: '#FF0000',
      strokeOpacity: 0.5,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.2,
      paths: greyZonePoints,
  });

greyZone.setMap(map);
}

var circle;

var plaza = new google.maps.LatLng(-6.22418, 106.80778);

function createCircle(){
circle = new google.maps.Circle({
  center: plaza,
  map:map,
  radius:30,
  strokeColor: "#4470ff",
  strokeOpacity:0.8,
  strokeWeight: 2,
  fillColor: "#4470ff"
});

}

function launchControlPanel(){
    window.location.href = 'cp.html';

}


freeFlightMode();

function initializeCoffeeTimer(){

var future1 = new Date();
future1.setMinutes(future1.getMinutes() + 0);
future1.setSeconds(future1.getSeconds() + 50);


var future2 = new Date();
future2.setMinutes(future2.getMinutes() + 6);
future2.setSeconds(future2.getSeconds() + 33);


var future3 = new Date();
future3.setMinutes(future3.getMinutes() + 8);
future3.setSeconds(future3.getSeconds() + 52);


var future4 = new Date();
future4.setMinutes(future4.getMinutes() + 6);
future4.setSeconds(future4.getSeconds() + 12);


var future5 = new Date();
future5.setMinutes(future5.getMinutes() + 7);
future5.setSeconds(future5.getSeconds() + 38);

var targetDistance = 90;
var fromStart=860;
$('#eta').show();
setInterval(function(){

    //future1.setSeconds(future1.getSeconds() + 45);
    //var future1 = new Date("Sep 20 2014 21:15:00 GMT+0200");


    var now = new Date();
    var difference1 = Math.floor((future1.getTime() - now.getTime()) / 1000);
    var difference2 = Math.floor((future2.getTime() - now.getTime()) / 1000);
    var difference3 = Math.floor((future3.getTime() - now.getTime()) / 1000);
    var difference4 = Math.floor((future4.getTime() - now.getTime()) / 1000);
    var difference5 = Math.floor((future5.getTime() - now.getTime()) / 1000);


    var seconds1 = fixIntegers(difference1 % 60);
    difference1 = Math.floor(difference1 / 60);
    var seconds2 = fixIntegers(difference2 % 60);
    difference2 = Math.floor(difference2 / 60);
    var seconds3 = fixIntegers(difference3 % 60);
    difference3 = Math.floor(difference3 / 60);
    var seconds4 = fixIntegers(difference4 % 60);
    difference4 = Math.floor(difference4 / 60);
    var seconds5 = fixIntegers(difference5 % 60);
    difference5 = Math.floor(difference5 / 60);
    
    var minutes1 = fixIntegers(difference1 % 60);
    difference1 = Math.floor(difference1 / 60);
    var minutes2 = fixIntegers(difference2 % 60);
    difference2 = Math.floor(difference2 / 60);
    var minutes3 = fixIntegers(difference3 % 60);
    difference3 = Math.floor(difference3 / 60);
    var minutes4 = fixIntegers(difference4 % 60);
    difference4 = Math.floor(difference4 / 60);
    var minutes5 = fixIntegers(difference5 % 60);
    difference5 = Math.floor(difference5 / 60);
    
    var hours1 = fixIntegers(difference1 % 24);
    difference1 = Math.floor(difference1 / 24);
    var hours2 = fixIntegers(difference2 % 24);
    difference2 = Math.floor(difference2 / 24);
    var hours3 = fixIntegers(difference3 % 24);
    difference3 = Math.floor(difference3 / 24);
    var hours4 = fixIntegers(difference4 % 24);
    difference4 = Math.floor(difference4 / 24);
    var hours5 = fixIntegers(difference5 % 24);
    difference5 = Math.floor(difference5 / 24);
        
    $(".seconds1").text(seconds1);
    $(".minutes1").text(minutes1 + ":");
    $(".hours1").text(hours1 + ":");

    $(".seconds2").text(seconds2);
    $(".minutes2").text(minutes2 + ":");
    $(".hours2").text(hours2 + ":");

    $(".seconds3").text(seconds3);
    $(".minutes3").text(minutes3 + ":");
    $(".hours3").text(hours3 + ":");

    $(".seconds4").text(seconds4);
    $(".minutes4").text(minutes4 + ":");
    $(".hours4").text(hours4 + ":");

    $(".seconds5").text(seconds5);
    $(".minutes5").text(minutes5 + ":");
    $(".hours5").text(hours5 + ":");

    targetDistance = targetDistance-2;
    fromStart = fromStart+2;
    $('#nextWaypointDistance .postLaunchValue').text(targetDistance);
    $('#distanceFromStart .postLaunchValue').text(fromStart);

}, 1000);

}


$('#flightStatus').text("Status: StandBy");