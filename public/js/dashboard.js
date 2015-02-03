
//mission Modal
function launchmissionModal(){
	$('#missionModal').modal('toggle');
	$('.container').addClass('blur');

	var d1 = [[1382349102505, 12], [1382049102505,5], [1381749102505,6], [1381549102505,2], [1381249102505,5], [1381149102505,6], [1381049102505,7] [1380949102505, 12]];
	var today = new Date();
	var oldDate = new Date();

	oldDate.setDate(today.getDate()-20);

	$.plot("#missionPlot", 
	[ d1 ],
	
	{
		series: {
				lines: { show: true, 
						 fill:false, 
						 fillColor:{colors:[{opacity:0.2}, {opacity:0.2}]}
					   },
				points: { show: true },
				color: "#00a8ff",
			},
		grid: {
				hoverable: true, 
				clickable: true,
				backgroundColor: { colors: [ "transparent", "rgba(0,0,0,0.6)" ] },
				borderWidth: {
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
				}
			},
		xaxis: { 
			mode: "time",
			ticks:7,
			alignTicksWithAxis:5,
			timezone:"browser",
			min: oldDate,
			max: today,
			},

	}
		);


var previousPoint = null;
	$("#missionPlot").bind("plothover", function (event, pos, item) {

			if (item) {
				if (previousPoint != item.dataIndex) {

					previousPoint = item.dataIndex;

					$("#tooltip").remove();
					var x = item.datapoint[0].toFixed(2),
					y = item.datapoint[1].toFixed(2);

					showTooltip(item.pageX, item.pageY,
						y+"missions on"+x);
				}
					
			}
	});

}

function showTooltip(x, y, contents) {
			$("<div id='tooltip'>" + contents + "</div>").css({
				position: "absolute",
				display: "none",
				color:"#fff",
				"z-index":100000,
				"font-size":"10px",
				top: y + 5,
				left: x + 5,
				padding: "2px",
				backgroundColor:"green",
				"font-family":"HelveticaNeue",
				"font-weight":"normal",
			}).appendTo("body").fadeIn(200);
		}



function removeBlur(){
	$('.container').removeClass('blur');
	$('#tooltip').remove();
}

//airtime Plot
function launchairtimeModal(){
	$('#airtimeModal').modal('toggle');
	$('.container').addClass('blur');

	var d1 = [[1382349102505, 12], [1382049102505,5], [1381749102505,6], [1381549102505,2], [1381249102505,5], [1381149102505,6], [1381049102505,7] [1380949102505, 12]];
	var today = new Date();
	var oldDate = new Date();

	oldDate.setDate(today.getDate()-20);

	$.plot("#airtimePlot", 
	[ d1 ],
	
	{
		series: {
				lines: { show: true, 
						 fill:false, 
						 fillColor:{colors:[{opacity:0.2}, {opacity:0.2}]}
					   },
				points: { show: true },
				color: "#00a8ff",
			},
		grid: {
				hoverable: true, 
				clickable: true,
				backgroundColor: { colors: [ "transparent", "rgba(0,0,0,0.6)" ] },
				borderWidth: {
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
				}
			},
		xaxis: { 
			mode: "time",
			ticks:7,
			alignTicksWithAxis:5,
			timezone:"browser",
			min: oldDate,
			max: today,
			},

	}
		);


var previousPoint = null;
	$("#airtimePlot").bind("plothover", function (event, pos, item) {

			if (item) {
				if (previousPoint != item.dataIndex) {

					previousPoint = item.dataIndex;

					$("#tooltip").remove();
					var x = item.datapoint[0].toFixed(2),
					y = item.datapoint[1].toFixed(2);

					showTooltip(item.pageX, item.pageY,
						y+"missions on"+x);
				}
					
			}
	});

}

//Routes Plot
var routesMap;
function initializeRoutesMap() {
	  var mapOptions = {
	    zoom: 10,
	    center: new google.maps.LatLng(1.34673, 103.81737),
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	  };
	  routesMap = new google.maps.Map(document.getElementById('routesPlot'),
	      mapOptions);
	  	google.maps.event.trigger(routesMap, 'resize');

	}

var neighborhoods = [
	  new google.maps.LatLng(1.34973, 103.81891),
	  new google.maps.LatLng(1.33944, 103.78449),
	  new google.maps.LatLng(1.34905, 103.76810),
	  new google.maps.LatLng(1.41023, 103.71231),
	  new google.maps.LatLng(1.36355, 103.70064),
	  new google.maps.LatLng(1.33815, 103.67867),
	  new google.maps.LatLng(1.31275, 103.69308),
	  new google.maps.LatLng(1.26401, 103.67180),
	  new google.maps.LatLng(1.27362, 103.72398),
	  new google.maps.LatLng(1.29284, 103.88260)

	];


var markers = [];
var iterator = 0;


function launchroutesModal()
{

	$('#routesModal').modal('toggle');
	$('.container').addClass('blur');

	initializeRoutesMap();


	google.maps.event.addDomListener(window, 'load', initializeRoutesMap);

	google.maps.event.addListenerOnce(routesMap, 'idle', function(){

		google.maps.event.trigger(routesMap, 'resize');
		routesMap.setCenter(new google.maps.LatLng(1.34673, 103.81737));
		drop();
	});




}

function drop() {
  for (var i = 0; i < neighborhoods.length; i++) {
    setTimeout(function() {
      addMarker();
    }, i * 200);
  }
}

function addMarker() {
  markers.push(new google.maps.Marker({
    position: neighborhoods[iterator],
    map: routesMap,
    draggable: false,
    animation: google.maps.Animation.DROP
  }));
  iterator++;
}


//drones modal

function launchdronesModal(){
	$('#dronesModal').modal('toggle');
	$('.container').addClass('blur');

	var droneData = [
		{ label: "Active",  data: 12, color:"#555963"},
		{ label: "Inactive",  data: 18, color:"#bbbbbb"},
		];

	$.plot('#dronesPlot', droneData, {
				series: {
					pie: { 
						show: true,
						colors:["#fff","#000"],
					}
				},
				legend: {
					show: true
				}
			});

}

function launchfirstsightModal(){
	$('#firstsightModal').modal('toggle');
	$('.container').addClass('blur');
}