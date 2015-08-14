function Battle(battle){
	this.battle = battle;
	this.start_time = new Date(battle.start);
	this.end_time = this.start_time;
	if(battle.end != ""){
		this.end_time = new Date(battle.end);
	}
	if(battle.winner != ""){
		this.model = WARS.models[battle.winner];
	}
	else{
		this.model = WARS.models.tie;
	}
}

Battle.prototype.draw = function(){

	if(this.start_time >= WARS.date_range.start_time && this.end_time <= WARS.date_range.end_time){
		mvPushMatrix();
		mvRotate(this.battle.location.lon, [0,1,0]);
		mvRotate(-this.battle.location.lat, [0,0,1]);
		mvTranslate([-WARS.constants.earth_radius, 0, 0]);
		mvRotate(60, [0,1,0]);
		this.model.draw();
		mvPopMatrix();
	}
}