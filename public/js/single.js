
  var map;
  var directionDisplay;
  var directionsService;
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


function initialize() {

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
    map = new google.maps.Map(document.getElementById("singleMap"), myOptions);
    
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

    function calcRoute(){

if (timerHandle) { clearTimeout(timerHandle); }
if (marker) { marker.setMap(null);}
polyline.setMap(null);
poly2.setMap(null);
directionsDisplay.setMap(null);
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
    // Create a renderer for directions and bind it to the map.
    var rendererOptions = {
      map: map,
    }
directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

        var start = '-6.223200, 106.809731';
        var end = '-6.224022, 106.808015';
        var travelMode = google.maps.DirectionsTravelMode.WALKING

        var request = {
            origin: start,
            destination: end,
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
    startAnimation();
    }                                                    
 });
}
  

  
      var step = 0.5; // 5; // metres
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
        setTimeout("animate(50)",2000);  // Allow time for the initial map display
}

initialize();
calcRoute();
//=============== ~animation funcitons =====================

setInterval(function(){
    var future1 = new Date("Sep 20 2014 21:15:00 GMT+0200");
    var future2 = new Date("Sep 20 2014 20:12:10 GMT+0200");
    var future3 = new Date("Sep 20 2014 22:03:22 GMT+0200");
    var future4 = new Date("Sep 20 2014 21:14:50 GMT+0200");
    var future5 = new Date("Sep 20 2014 20:05:33 GMT+0200");


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
}, 1000);

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

