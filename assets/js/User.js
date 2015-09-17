function User(){
	this.free_mode = false;
	this.position = {};
	this.position.x = 0;
	this.position.y = 0;
	this.position.z = -45;
	this.rotation = {};
	this.rotation.x = 15;
	this.rotation.y = 211;
	this.interpolate_start = {"x": 0, "y": 0};
	this.interpolate_end = {"x": 0, "y": 0};
	this.interpolate_previous_tick = 0;
	this.interpolation_percent = 0;
	this.interpolation_speed = 0.025;
}

User.prototype.interpolate_position = function(battle_object){
	var tmp_diff = 0;
	if(WARS.user.interpolation_percent == 0){
		WARS.user.interpolate_previous_tick = (new Date()).getTime();
		WARS.user.interpolate_start = {x: WARS.user.rotation.x, y: WARS.user.rotation.y};
		tmp_diff = Math.abs(WARS.user.rotation.y - WARS.user.interpolate_end.y);
		var tmp_diff_minus = Math.abs(WARS.user.rotation.y - (WARS.user.interpolate_end.y - 360));
		var tmp_diff_plus  = Math.abs(WARS.user.rotation.y - (WARS.user.interpolate_end.y + 360));
		if(tmp_diff_minus < tmp_diff){
			tmp_diff = tmp_diff_minus;
			WARS.user.interpolate_end.y = WARS.user.interpolate_end.y - 360;
		}
		if(tmp_diff_plus < tmp_diff){
			tmp_diff = tmp_diff_plus;
			WARS.user.interpolate_end.y = WARS.user.interpolate_end.y + 360;
		}
		
		var tmp_total_diff = tmp_diff + Math.abs(WARS.user.rotation.x - WARS.user.interpolate_end.x);
		WARS.user.interpolation_speed = 1 - Math.pow((tmp_total_diff / 360), 0.02);
		WARS.user.interpolation_percent += WARS.user.interpolation_speed;
	}
	
	WARS.user.interpolation_percent += WARS.user.interpolation_speed * ((new Date()).getTime() - WARS.user.interpolate_previous_tick) / 15;
	WARS.user.interpolate_previous_tick = (new Date()).getTime();
	if(WARS.user.interpolation_percent > 1){
		WARS.user.interpolation_percent = 1;
	}

	var alpha = 1 - WARS.user.interpolation_percent;
	var beta = WARS.user.interpolation_percent;
	
	WARS.user.rotation.x = alpha * WARS.user.interpolate_start.x + beta * WARS.user.interpolate_end.x;
	WARS.user.rotation.y = alpha * WARS.user.interpolate_start.y + beta * WARS.user.interpolate_end.y;
	
	if(WARS.user.interpolation_percent < 1){
		setTimeout(function(){WARS.user.interpolate_position(battle_object);}, 15);
	}
	else{
		WARS.user.interpolation_percent = 0;
		curr_war.load_battle_info(battle_object);
		$("#battle-info").show('fade');
	}
};