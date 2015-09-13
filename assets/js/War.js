function War(){
	this.battles = "";
	this.start_time = "";
	this.end_time = "";
	this.battle_names = "";
	this.init_battles();
};

War.prototype.init_battles = function(){
	this.battles = [];
	this.battle_names = [];
};

War.prototype.set_battles_clickable = function(clickable){
	this.battles.forEach(function(battle){
		battle.clickable = clickable;
	});
};

War.prototype.reset_battle_scales = function(){
	this.battles.forEach(function(battle){
		battle.currently_selected = false;
	});
};

War.prototype.select_battle = function(index){
	$("#battle-info").hide('fade');
	
	this.reset_battle_scales();

	var battle_object = this.battles[index];
	battle_object.currently_selected = true;
	
	var battle = battle_object.battle;
	
	WARS.user.interpolate_end = {x: battle.location.lat, y: +(90-battle.location.lon)};
	WARS.user.interpolate_position(battle_object);
};

War.prototype.load_battle_info = function(battle_object){
	var battle = battle_object.battle;
	
	$("#battle-name").html(battle.name);
	var start_date = battle_object.start_time;
	$("#battle-start-date").html(WARS.constants.months[start_date.getMonth()] + " " + start_date.getDate() + ", " + start_date.getFullYear());
	var end_date = battle_object.end_time;
	$("#battle-end-date").html(WARS.constants.months[end_date.getMonth()] + " " + end_date.getDate() + ", " + end_date.getFullYear());
	$("#battle-location").html(battle.location.name);
	
	var country_1 = battle.countries[0];
	
	$("#left-flag img").attr("src","./assets/textures/"+country_1.name.toLowerCase().replace(/\s+/g, '_')+".png");
	$("#left-country").html(country_1.name);
	$("#left-leader").html(country_1.leader);
	$("#left-troops").html(country_1.troops.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
	$("#left-casualities").html(country_1.casualities.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
	
	if(battle.winner == country_1.name){
		$("#left-result").html('<span class="victory">Victory</span>');
	}
	else{
		$("#left-result").html('<span class="defeat">Defeat</span>');
	}
	
	var country_2 = battle.countries[1];
	
	$("#right-flag img").attr("src","./assets/textures/"+country_2.name.toLowerCase().replace(/\s+/g, '_')+".png");
	$("#right-country").html(country_2.name);
	$("#right-leader").html(country_2.leader);
	$("#right-troops").html(country_2.troops.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
	$("#right-casualities").html(country_2.casualities.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
	
	if(battle.winner == country_2.name){
		$("#right-result").html('<span class="victory">Victory</span>');
	}
	else{
		$("#right-result").html('<span class="defeat">Defeat</span>');
	}
}

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
	this.battle_names.push(battle.battle.name);
	
	$("#battles-modal .modal-body").append(
					'<span class="col-xs-12 flag-background" data-dismiss="modal" style="'+
						'background-image:url(&quot;./assets/textures/'+battle.battle.winner.toLowerCase().replace(/\s+/g, '_')+'.png&quot;);">'+
						'<div class="col-xs-12 modal-select" onclick="curr_war.select_battle('+(this.battles.length-1)+');">'+
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