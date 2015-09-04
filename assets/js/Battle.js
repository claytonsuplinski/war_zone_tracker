function Battle(battle){
	this.battle = battle;
	this.start_time = new Date(battle.start);
	this.start_time.setHours(5);
	this.end_time = this.start_time;
	if(battle.end != ""){
		this.end_time = new Date(battle.end);
	}
	this.end_time.setHours(5);
	
	if(battle.winner != ""){
		this.model = WARS.models[battle.winner];
	}
	else{
		this.model = WARS.models.tie;
	}
	
	this.scale_multiplier = 1;
	
	this.currently_selected = false;
	
	this.clickable = false;
	this.clickable_id = "";
}

Battle.prototype.set_clickable_id = function(id){
	this.clickable_id = id;
};

Battle.prototype.compare_times = function(first_date, second_date){
	if(first_date.getFullYear() > second_date.getFullYear()){
		return true;
	}
	else if(first_date.getFullYear() == second_date.getFullYear()){
		if(first_date.getMonth() > second_date.getMonth()){
			return true;
		}
		else if(first_date.getMonth() == second_date.getMonth()){
			if(first_date.getDate() >= second_date.getDate()){
				return true;
			}
		}
	}
	return false;
};

Battle.prototype.draw = function(){

	if(this.model == undefined){
		alert(this.battle.winner);
		alert(Object.keys(WARS.models));
	}
	
	if(this.clickable_id == ""){
		this.clickable_id = [0,0,0];
	}
	
	if(this.currently_selected && this.scale_multiplier < 2){
		this.scale_multiplier += 0.1;
		if(this.scale_multiplier > 2){this.scale_multiplier = 2;}
	}
	else if(!this.currently_selected && this.scale_multiplier > 1){
		this.scale_multiplier -= 0.1;
		if(this.scale_multiplier < 1){this.scale_multiplier = 1;}
	}

	if(this.compare_times(WARS.date_range.end_time, this.start_time) && this.compare_times(this.end_time, WARS.date_range.start_time) ){
		mvPushMatrix();
		mat4.rotate(mvMatrix, degToRad(this.battle.location.lon), [0,1,0]);
		mat4.rotate(mvMatrix, degToRad(-this.battle.location.lat), [0,0,1]);
		mat4.translate(mvMatrix, [-WARS.constants.earth_radius, 0, 0]);
		mat4.rotate(mvMatrix, degToRad(60), [0,1,0]);
		var scale = this.scale_multiplier*WARS.constants.battle_scale;
		this.model.draw({scale: [scale, scale, scale], clickable: (this.clickable ? this.clickable_id : [0,0,0])});
		mvPopMatrix();
	}
}