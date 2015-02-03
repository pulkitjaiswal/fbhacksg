$(document).ready(function() {

	//Altitude settings
	final_end_number_altm= 0; //final altitude setting  ---- Need to update this only

	//Vertical speed settings
	final_end_number_verm= 0; //final speed setting  ---- Need to update this only

	//Horizontal speed settings
	final_end_number_horm= 0;  //final speed setting  ---- Need to update this only


	// Donot update any of these altitude values after preset
	full_altm = 100;     // max value of the dial
	cur_number_altm = 0; // start setting
	variation_range_altm = 3; // delta range
	variation_direction_altm= 0; // delta direction
	dial_size_altm =130; // dial size
	refresh_speed_altm = 50;  // How fast the dial is updated
	prev_final_end_number_altm= final_end_number_altm;
	tmp_end_number_altm = final_end_number_altm;

	// Donot update any of these vertical speed values after preset
	full_verm = 50;      // max value of the dial
	cur_number_verm = 0; // start setting
	variation_range_verm = 3;  // delta range
	variation_direction_verm= 0;  // delta direction
	dial_size_verm =130;  // dial size
	refresh_speed_verm = 25;  // How fast the dial is updated
	prev_final_end_number_verm= final_end_number_verm;
	tmp_end_number_verm = final_end_number_verm;

	// Donot update any of these horizontal speed values after preset
	full_horm = 400;  // max value of the dial
	cur_number_horm = 0;  // start setting
	variation_range_horm = 10;  // delta range
	variation_direction_horm= 0;  // delta direction
	dial_size_horm =130;  // dial size
	refresh_speed_horm = 30;  // How fast the dial is updated
	prev_final_end_number_horm= final_end_number_horm;
	tmp_end_number_horm = final_end_number_horm;

	drawKnobLoopAlt();
	drawKnobLoopVer();
	drawKnobLoopHor();
	});


	var drawKnobAlt =function (barSize) {
		$('.altdial').val(barSize).trigger('change');//.delay(20);
		$(".altdial").knob({
			'min':0,
			'max':full_altm,
			'readOnly': true,
			'width': dial_size_altm,
			'height': dial_size_altm,
			'fgColor': '#7eff00',
			'dynamicDraw': true,
			'thickness': 0.15,
			'tickColorizeValues': true,
			'skin':'tron',
			'data-width':255,
			'draw' : function () {
        	$(this.i).val(this.cv/100)
      		}
		})
	};

	var drawKnobLoopAlt = function() {
			if (tmp_end_number_altm > cur_number_altm) {
    			cur_number_altm++;
    		}
    		if (tmp_end_number_altm < cur_number_altm) {
    			cur_number_altm--;
    		}
			if(tmp_end_number_altm == cur_number_altm || final_end_number_altm != 0) {
        		variation_altm_number = Math.random()*variation_range_altm;
        		if (variation_direction_altm > (variation_altm_number*10/2)) {
        			tmp_end_number_altm = final_end_number_altm - variation_altm_number;
        		} else {
        			tmp_end_number_altm = final_end_number_altm + variation_altm_number;
        		}
        		variation_direction_altm = variation_altm_number*10;
        	} else {
				tmp_end_number_altm = 0;
			}
			if (prev_final_end_number_altm != final_end_number_altm) {
				prev_final_end_number_altm= final_end_number_altm;
				tmp_end_number_altm = final_end_number_altm;
			}
        	drawKnobAlt(cur_number_altm);
		junkVar = setTimeout(drawKnobLoopAlt,refresh_speed_altm);
	};

	var drawKnobVer =function (barSize) {
		$('.verdial').val(barSize).trigger('change');//.delay(20);
		$(".verdial").knob({
			'min':0,
			'max':full_verm,
			'readOnly': true,
			'width': dial_size_verm,
			'height': dial_size_verm,
			'fgColor': '#7eff00',
			'dynamicDraw': true,
			'thickness': 0.15,
			'tickColorizeValues': true,
			'skin':'tron',
			'data-width':255,
			'draw' : function () {
        	$(this.i).val(this.cv/100)
      		}
		})
	};

	var drawKnobLoopVer = function() {
			if (tmp_end_number_verm > cur_number_verm) {
    			cur_number_verm++;
    		}
    		if (tmp_end_number_verm < cur_number_verm) {
    			cur_number_verm--;
    		}
			if(tmp_end_number_verm == cur_number_verm || final_end_number_verm != 0) {
        		variation_verm_number = Math.random()*variation_range_verm;
        		if (variation_direction_verm > (variation_verm_number*10/2)) {
        			tmp_end_number_verm = final_end_number_verm - variation_verm_number;
        		} else {
        			tmp_end_number_verm = final_end_number_verm + variation_verm_number;
        		}
        		variation_direction_verm = variation_verm_number*10;
        	} else {
				tmp_end_number_verm = 0;
			}
			if (prev_final_end_number_verm != final_end_number_verm) {
				prev_final_end_number_verm= final_end_number_verm;
				tmp_end_number_verm = final_end_number_verm;
			}
        	drawKnobVer(cur_number_verm);
		junkVar = setTimeout(drawKnobLoopVer,refresh_speed_verm);
	};

	var drawKnobHor =function (barSize) {
		$('.hordial').val(barSize).trigger('change');//.delay(20);
		$(".hordial").knob({
			'min':0,
			'max':full_horm,
			'readOnly': true,
			'width': dial_size_horm,
			'height': dial_size_horm,
			'fgColor': '#7eff00',
			'dynamicDraw': true,
			'thickness': 0.15,
			'tickColorizeValues': true,
			'skin':'tron',
			'data-width':255,
			'draw' : function () {
        	$(this.i).val(this.cv/100)
      		}
		})
	};

	var drawKnobLoopHor = function() {
			if (tmp_end_number_horm > cur_number_horm) {
    			cur_number_horm++;
    		}
    		if (tmp_end_number_horm < cur_number_horm) {
    			cur_number_horm--;
    		}
			if(tmp_end_number_horm == cur_number_horm || final_end_number_horm != 0) {
        		variation_horm_number = Math.random()*variation_range_horm;
        		if (variation_direction_horm > (variation_horm_number*10/2)) {
        			tmp_end_number_horm = final_end_number_horm - variation_horm_number;
        		} else {
        			tmp_end_number_horm = final_end_number_horm + variation_horm_number;
        		}
        		variation_direction_horm = variation_horm_number*10;
        	} else {
				tmp_end_number_horm = 0;
			}
			if (prev_final_end_number_horm != final_end_number_horm) {
					tmp_end_number_verm = final_end_number_verm;
					prev_final_end_number_verm= final_end_number_verm;
			}
        	drawKnobHor(cur_number_horm);
		junkVar = setTimeout(drawKnobLoopHor,refresh_speed_horm);
	};


	var takeoffSequence = function () {
		console.log("I am in takeoff");
		//Altitude settings
		final_end_number_altm= 70; //final altitude setting  ---- Need to update this only

		//Vertical speed settings
		final_end_number_verm= 30; //final speed setting  ---- Need to update this only

		//Horizontal speed settings
		final_end_number_horm= 320;  //final speed setting  ---- Need to update this only
		console.log("horm = " + final_end_number_horm);

		$('#flightStatus').text("Status: Taking off");
	};

	var inflightSequence = function () {
		//Altitude settings
		final_end_number_altm= 70; //final altitude setting  ---- Need to update this only

		//Vertical speed settings
		final_end_number_verm= 1; //final speed setting  ---- Need to update this only

		//Horizontal speed settings
		final_end_number_horm= 320;  //final speed setting  ---- Need to update this only
	
		$('#flightStatus').text("Status: In-flight");
	};

	var landingSequence = function () {

		cur_number_verm=30;
		refresh_speed_verm = 100;
		refresh_speed_horm = 10;

		//Altitude settings
		final_end_number_altm= 0; //final altitude setting  ---- Need to update this only

		//Vertical speed settings
		final_end_number_verm= 0; //final speed setting  ---- Need to update this only

		//Horizontal speed settings
		final_end_number_horm= 0;  //final speed setting  ---- Need to update this only
	
		$('#flightStatus').text("Status: Descending");
	};

	  $('.knob').css('font-size', '15px !important');
