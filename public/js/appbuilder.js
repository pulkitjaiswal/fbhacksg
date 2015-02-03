


//global var
var map;

var mapViewCount=0;
var pathBuilderViewCount=0;
var canvasElementsArray= [];
var viewOptionsArray = [];
var canvasYPos= $('#apiCanvas').offset().top;
var canvasXPos= $('#apiCanvas').offset().left;

function fixCanvasPosition(){

	var documentHeight = $(document).height() - 60;

	var documentWidth = $(document).width() -430;

	$('#apiCanvas').css({
		height:documentHeight,
		width:documentWidth,
	});
}

fixCanvasPosition();

$( window ).resize(function() {
  fixCanvasPosition();

});
$(document).mouseup(function (e)
{
    var container = $(".canvasElement");
    var apipanel = $(".apipanel");
    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0
        && !apipanel.is(e.target)
        && apipanel.has(e.target).length === 0) // ... nor a descendant of the container
    {
        $('#apiSpecialOptionsList').empty();
		$('#apiViewOptionsList').empty();

		$('#apiSpecialOptionsList').append(noOptions);
		$('#apiViewOptionsList').append(noOptions);
		$('.canvasElement').removeClass('selectedElement');
    }
});



jQuery(document).bind('keydown.backspace', function (evt){jQuery('.selectedElement').remove(); return false; });
jQuery(document).bind('keydown.del', function (evt){jQuery('.selectedElement').remove(); return false; });

//defining the nature of panel elements
$( ".uiBuildOption" ).draggable({ 
	opacity: 0.7, 
	helper: "clone", 
	revert:"invalid",
});

$("#uiBuildTextOptions").selectable();

$('.uiBuildOption').click(function(){
	$('.uiBuildOption').removeClass('ui-selected');
	$(this).addClass('ui-selected');
});

$('.uiBuildOption').mousedown(function(){
	$('.uiBuildOption').removeClass('ui-selected');
	$(this).addClass('ui-selected');
});

$( "#apiCanvas" ).droppable({
      accept: ".uiBuildOption",
      activate: function(){
      	 $('.ui-resizable-handle').hide();

      },
      drop: function( event, ui ) {
      	var draggableId = ui.draggable.attr('id');
        var xPos = event.pageX - $('#apiCanvas').offset().left;
        var yPos = event.pageY - $('#apiCanvas').offset().top;
        $('#posX').text('x: ' + xPos);
        $('#posY').text('y: ' + yPos);
        drawElement(xPos, yPos, draggableId);

      },
  });


$( "#slider-range" ).slider({
	  min:1,
	  max:10,
	  value:5,
      slide: function( event, ui ) {
        $( "#apiPbWpMax" ).val( ui.value );
      }
});





//function to draw an element onto canvas 
function drawElement(xPos, yPos, draggableId){

	switch(draggableId){
		case 'uiMap':
		$('.ui-resizable-handle').hide();//deselect existing elements
		$('.canvasElement').removeClass('selectedElement');

		mapViewCount++;

		var newMapView = document.createElement('div');
		var newMapViewId = "mapView"+mapViewCount;	
		newMapView.id = newMapViewId;
		canvasElementsArray.push(newMapViewId);

		newMapView.className = "mapView canvasElement ui-state-default";
		$('#apiCanvas').append(newMapView);

		$(newMapView).append('<div class="elementTitle">Map View</div>');
		$('#'+newMapViewId).css({
			position:"absolute",
			left: xPos,
			top:yPos,
		});

		$('#'+newMapViewId).resizable({
			handles: "n,e,s,w,nw,se,ne,sw",
			minWidth:150,
			minHeight:150,
			containment: "#apiCanvas",
		});

		$('#'+newMapViewId).draggable({
			opacity: 0.5,
			containment: "#apiCanvas",
		});
		$('#'+newMapViewId).selectable();

		$('.elementTitle').removeClass('ui-selectee'); 
		$('#'+newMapViewId).addClass('selectedElement');


		//Select-deselect
		$('#apiCanvas').mouseup(function (e)
		{
		    var container = $(newMapView);

		    if (!container.is(e.target) // if the target of the click isn't the container...
		        && container.has(e.target).length === 0) // ... nor a descendant of the container
		    {
		        var resizehandle = '#'+ newMapViewId + " .ui-resizable-handle";
		        $(resizehandle).hide();
		    }
		});

		$( "#"+newMapViewId).click(function() {
		  displayOptions('uiMap', newMapViewId); 

		  var resizehandle = '#'+ newMapViewId + " .ui-resizable-handle";
		  $(resizehandle).show();
		  $(this).addClass('selectedElement');
		  //jQuery(document).bind('keydown.backspace', function (evt){jQuery('#'+ newMapViewId).remove(); return false; });
		  //jQuery(document).bind('keydown.del', function (evt){jQuery('#'+ newMapViewId).remove(); return false; });

		});

		$( "#"+newMapViewId).mousedown(function() {
		  displayOptions('uiMap', newMapViewId); 

		  var resizehandle = '#'+ newMapViewId + " .ui-resizable-handle";
		  $(resizehandle).show();
		  $(this).addClass('selectedElement');

		  //jQuery(document).bind('keydown.backspace', function (evt){jQuery('#'+ newMapViewId).remove(); return false; });
		  //jQuery(document).bind('keydown.del', function (evt){jQuery('#'+ newMapViewId).remove(); return false; });

		});


		$("#"+newMapViewId).dblclick(function() {
		  $("#"+newMapViewId).css({
		  	position:"absolute",
		  	top:0,
		  	left:0,
		  	height:$('#apiCanvas').height(),
		  	width:$('#apiCanvas').width(),
		  });

		});


		displayOptions('uiMap', newMapViewId); 

		break;

		case 'uiPathBuilder':
		$('.canvasElement').removeClass('selectedElement');


		$('#apiCanvas').append('<div id="pathBuilderView0" class="pathBuilder canvasElement ui-state-default">'+
		'<div class="elementTitle">Path Builder</div>'+
		'</div>');



		$('.pathBuilder').resizable({
			handles: "n,e,s,w,nw,se,ne,sw",
			minWidth:200,
			minHeight:50,
			containment: "#apiCanvas",
		});
		$('.elementTitle').removeClass('ui-selectee');
		$('.ui-selectee').show();
		$('.ui-resizable-handle').hide();//deselect existing elements
		$('.pathBuilder .ui-resizable-handle').show();
		$('.pathBuilder').draggable({
			opacity: 0.5,
			containment: "#apiCanvas",
		});


		$('.pathBuilder').selectable();

		displayOptions('pathBuilder');
		$( "#slider-range" ).slider({
			  min:1,
			  max:10,
			  value:5,
		      slide: function( event, ui ) {
		        $( "#apiPbWpMax" ).val( ui.value );
		      }
		});

		canvasElementsArray.push('pathBuilderView0');
		$('.pathBuilder').addClass('selectedElement');


		$('#apiCanvas').mouseup(function (e)
		{
		    var container = $('.pathBuilder');

		    if (!container.is(e.target) // if the target of the click isn't the container...
		        && container.has(e.target).length === 0) // ... nor a descendant of the container
		    {
		        var resizehandle = '#pathBuilderView0' + " .ui-resizable-handle";
		        $(resizehandle).hide();
		    }
		});

		$( ".pathBuilder").click(function() {
		  var resizehandle = ".pathBuilder .ui-resizable-handle";
		  $(resizehandle).show();
		  $(this).addClass('selectedElement');
		  //jQuery(document).bind('keydown.backspace', function (evt){jQuery('.pathBuilder').remove(); return false; });
		  //jQuery(document).bind('keydown.del', function (evt){jQuery('.pathBuilder').remove(); return false; });
		  displayOptions('uiPathBuilder', 'pathBuilderView0'); 
		});

		$( '.pathBuilder').mousedown(function() {
		  var resizehandle = '.pathBuilder .ui-resizable-handle';
		  $(resizehandle).show();
		  $(this).addClass('selectedElement');
		  //jQuery(document).bind('keydown.backspace', function (evt){jQuery('.pathBuilder').remove(); return false; });
		  //jQuery(document).bind('keydown.del', function (evt){jQuery('.pathBuilder').remove(); return false; });
		  displayOptions('uiPathBuilder', 'pathBuilderView0'); 
		});

		displayOptions('uiPathBuilder', 'pathBuilderView0'); 

		break;

	
	}
}


//Displaying options corresponding to the element in the argument
function displayOptions(elementType, elementId)
{
	switch(elementType){

		case 'uiMap':
		document.getElementById('apiSpecialOptionsList').innerHTML= mapViewOptionsList; //
		$('#mapViewOptions').attr('id', elementId+'Options');
		viewOptionsArray.push('#'+elementId+'Options');

		document.getElementById('apiViewOptionsList').innerHTML= generalViewOptionsList; //
		$('#generalViewOptions').attr('id', elementId+'AppearanceOptions');

		break;

		case 'uiPathBuilder':
		document.getElementById('apiSpecialOptionsList').innerHTML= pathBuilderOptionsList;
		$('#pathBuilderOptions').attr('id', elementId+'Options');
		viewOptionsArray.push('#'+elementId+'Options');

		document.getElementById('apiViewOptionsList').innerHTML= generalViewOptionsList; //
		$('#generalViewOptions').attr('id', elementId+'AppearanceOptions');
	}
}

function runSimulation(){
	$('#simulationView').modal();
	//looping through two arrays

	var progress = setInterval(function() {
    var $bar = $('.progress-bar');

    if ($bar.width()==400) {
        clearInterval(progress);
        $('.progress').removeClass('active');
    } else {
        $bar.width($bar.width()+40);
    }
	}, 300);

	var elementCount=0;
	for(elementCount=0; elementCount<=canvasElementsArray.length;elementCount++){
		var elementHeight = $('#'+canvasElementsArray[elementCount]).height();
		var elementWidth = $('#'+canvasElementsArray[elementCount]).width();
		var newElement = document.createElement('div');
		var newElementId = "element"+elementCount;	
		newElement.id = newElementId;
		var newElementPos = $('#'+canvasElementsArray[elementCount]).offset();
		$('#simulationCanvas').append(newElement);
		$('#'+newElementId).css({
			height:elementHeight*(($(document).height())/$('#apiCanvas').height()),
			width: elementWidth*(($(document).width())/$('#apiCanvas').width()),
			backgroundColor:'transparent',
			position:'absolute',
			top:(newElementPos.top - canvasYPos)*($(document).height()/$('#apiCanvas').height()),
			left:(newElementPos.left - canvasXPos)*($(document).width()/$('#apiCanvas').width()),
		});
		setTimeOut(activateElementScripts(newElementId, viewOptionsArray[elementCount]), 2500); //activate in-element customization
	}
}


function activateElementScripts(elementId, elementOptions){
	var elementTypeArray = [];
	var elementType;
	for(var i=0;i<elementOptions.length;i++)
	{
		if(isNaN(elementOptions[i])==true)
		{
			elementTypeArray.push(elementOptions[i]);
		}

		else{
			break;
		}
	}

	elementType = elementTypeArray.join("");
	switch(elementType)
	{

		case'#mapView':
			function initialize() {
			var latlng = new google.maps.LatLng(-34.397, 150.644);
			var mapOptions = {
			    zoom: 8,
			    center: latlng,
			    mapTypeId: $(elementOptions+ ' select').val(),
			    disableDefaultUI: true
			    };
			map = new google.maps.Map(document.getElementById(elementId),
			     mapOptions);

			google.maps.event.addListenerOnce(map, 'idle', function(){
				google.maps.event.trigger(map, 'resize');
			});
			}

			google.maps.event.addDomListener(window, "load", initialize);
			initialize();

			break;

		case '#pathBuilderView':

			$('#simulationCanvas').append('<div id="pathBuilder"><div id="startFlag" class="pbButton">'+
			'<span class="fa fa-flag" onclick="startingPoint();"></span></div>'+
			'<div id="finishFlag" class="pbButton"><span class="fa fa-flag"  onclick="waypointMarker();"></span></div>'+
			'<div class="pbButton"><span class="fa fa-flag-checkered" onclick="finalDestination();"></span></div></div>');

			break;
	}
}

var noOptions = '<div class="no-option">No Selection</div>';

var generalViewOptionsList='<div id="generalViewOptions" class="viewOptions"><li class="apiOption list-group-item">X:<input type="text" style="width:50px;">&nbsp;&nbsp;Y:<input type="text" style="width:50px;">'+
'<li class="apiOption list-group-item"> Width:<input type="text" style="width:30px;">&nbsp;&nbsp;Height:<input type="text" style="width:30px;"></li>'+
'<li class="list-group-item">Positioning'+
'<select><option value="fill">Scale To Fill</option>'+
'<option value="fit">Aspect Fit</option>'+
'<option value="center">Center</option>'+
'<option value="center">Snap To Top</option>'+
'<option value="left">Snap To Left</option>'+
'<option value="right">Snap To Right</option>'+
'<option value="bottom">Snap To Bottom</option>'+
'<option value="topleft">Snap To Top-Left</option>'+
'<option value="topright">Snap To Top-Right</option>'+
'<option value="bottomleft">Snap To Bottom-Left</option>'+
'<option value="bottomright">Snap To Bottom-Right</option>'+
'</select></li>'+
'<li class="list-group-item">User Interaction Enabled <input type="checkbox" checked></li></div>';



var mapViewOptionsList =
	'<div id="mapViewOptions" class="viewOptions"><li class="apiOption list-group-item">'+
	'Default Type <select id="apiMapType"><option value="satellite">Satellite</option><option value="terrain">Terrain</option><option value="hybrid">Hybrid</option></select></li>'+
	'<li class="apiOption list-group-item"><input id="apiLockMapType" type="checkbox">Lock Map Type</li>'+
	'<li class="apiOption list-group-item"><input id="apiFsMap" type="checkbox">Fullscreen Map </li>'+
	'<li class="apiOption list-group-item">Map Center <input type="text" id="apiMapCenter"></li>'+
	'<li class="apiOption list-group-item"><input id="apimapType" type="checkbox">Allow Zooming</li>'+
	'<li class="apiOption list-group-item"><input id="apimapType" type="checkbox">Allow Scrolling</li></div>';


var pathBuilderOptionsList =
	'<div id="pathBuilderOptions" class="viewOptions"><li class="list-group-item apiOption">Orientation<select id="apiPbOrientation"><option value="horizontal">Horizontal</option><option value="verical">Verical</option></select></li>'+
	'<li class="list-group-item apiOption">Default Mode<select id="apiPbmode"><option value="Road">Road Constained</option><option value="free">Free Flight</option><option value="follow">Follow Source</option></select></li>'+
    '<div id="startFlagAccordion" style="margin-top:20px;">'+
    '<li class="list-group-item apiOption">Lock Start Point <input type="text" id="apiPbSpFixInput" style="width:80px;"></li><li class="list-group-item apiOption"><input type="checkbox" id="apiPbSpFixBrowser">Use System Location</li>'+
    '</div>'+
    '<div id="finishFlagAccordion"><li class="list-group-item apiOption">Lock Finish Point <input type="text" id="apiPbfpFixInput" style="width:80px;"></li>'+
    '<li class="list-group-item apiOption"><input type="checkbox" id="apiPbfpFixBrowser">Use System Location</li>'+
    '</div>'+
    '<div id="waypointAccordion"><li class="list-group-item apiOption">Max Waypoints'+
    '<input type="text" value="5" id="apiPbWpMax">'+
    '</li></div></li></div>';



