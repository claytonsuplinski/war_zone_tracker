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
	
	$("#battles-modal .modal-body").append(
					'<span class="col-xs-12 flag-background" style="'+
						'background-image:url(&quot;./assets/textures/'+battle.battle.winner.toLowerCase().replace(/\s+/g, '_')+'.png&quot;);">'+
						'<div class="col-xs-12 modal-select" onclick="'+
							'WARS.user.interpolate_end = {x: '+battle.battle.location.lat+', y: '+(90-battle.battle.location.lon)+'};'+
							'WARS.user.interpolate_position();'+
						'">'+
							'<div class="col-xs-12 modal-select-title">'+battle.battle.name+'</div>'+
							'<div class="col-md-6 col-xs-12">'+battle.battle.location.name+'</div>'+
							'<div class="col-md-6 col-xs-12">'+battle.battle.start+'</div>'+
						'</div>'+
					'</span>'
	);
};

War.prototype.draw = function(){
	this.battles.forEach(function(battle){
		battle.draw();
	});
};