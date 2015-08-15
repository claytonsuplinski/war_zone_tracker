function War(){
	this.battles = "";
	this.start_time = "";
	this.end_time = "";
	this.init_battles();
};

War.prototype.init_battles = function(){
	this.battles = [];
};

War.prototype.add_battle = function(battle){

	if(this.start_time == "" || (this.start_time != "" && this.start_time > battle.start_time) ){
		this.start_time = battle.start_time;
		WARS.date_range.start_time = battle.start_time;
		WARS.date_range.start_time.setHours(0);
	}
	
	if(this.end_time == ""   || (this.end_time != "" && this.end_time < battle.end_time) ){
		this.end_time = battle.end_time;
		WARS.date_range.end_time = battle.end_time;
		WARS.date_range.end_time.setHours(23);
	}
	
	this.battles.push(battle);
};

War.prototype.draw = function(){
	this.battles.forEach(function(battle){
		battle.draw();
	});
};