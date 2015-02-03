var gpsMap;
function gpsInitialize() {
  var gpsOptions = {
    zoom: 0,
    center: new google.maps.LatLng(-6.223200, 106.809731),
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    disableDefaultUI: true,
  };
  gpsMap = new google.maps.Map(document.getElementById('gpsMap'),
      gpsOptions);


var gpsLocation = new google.maps.LatLng(-6.223200, 106.809731);
var gpsIcon = 'images/map_icons/drone.png';
var gpsMarker = new google.maps.Marker({
      position: gpsLocation,
      map: gpsMap,
      title: 'Hello World!',
      icon:gpsIcon,
      optimized:false,
  });

}

google.maps.event.addDomListener(window, 'load', gpsInitialize);

var data = [],
totalPoints = 300;

function getRandomData() {
	if (data.length > 0)
		data = data.slice(1);
			// Do a random walk

	while (data.length < totalPoints) {

		var prev = data.length > 0 ? data[data.length - 1] : 50,
		y = prev + Math.random() * 10 - 5;

		if (y < 0) {
			y = 0;
		} else if (y > 100) {
		y = 100;
		}

		data.push(y);
	}

	// Zip the generated y values with the x values

	var res = [];
	for (var i = 0; i < data.length; ++i) {
		res.push([i, data[i]])
	}

	return res;
}

		// Set up the control widget

var updateInterval = 30;

var plot = $.plot("#cpGraph", [ getRandomData() ], {
	series: {
		lines: { show: true, 
				 fill:true, 
				 fillColor:{colors:[{opacity:0.3}, {opacity:0.3}]}
			   },
		shadowSize: 0,	// Drawing is faster without shadows
		color:'#ffffff',
		},
	yaxis: {
		min: 0,
		max: 100
	},
	xaxis: {
		show: false
	},
	grid: {
				backgroundColor: { colors: [ "transparent", "rgba(0,0,0,0.6)" ] },
				borderWidth: {
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
				},
          }
});


function update() {

	plot.setData([getRandomData()]);

			// Since the axes don't change, we don't need to call plot.setupGrid()

	plot.draw();
	setTimeout(update, updateInterval);
}

update();


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

$('.activeMissionsTable tr').click(function(){
    $('.activeMissionsTable tr').removeClass("selectedMission");
    $(this).addClass("selectedMission");
    showMissionDetails();
    map.panTo(marker.getPosition());
    map.setZoom(20);
});

function showMissionDetails(){
	$('#rightPanel').show();
}

function hideMissionDetails(){
	$('#rightPanel').hide();
}

