WARS = {};

WARS.window = {};
WARS.window.width = 0;
WARS.window.height = 0;

WARS.war_name = "American Revolutionary War";

WARS.constants = {};
WARS.constants.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
WARS.constants.to_radians = Math.PI/180;
WARS.constants.lon_offset = 180;
WARS.constants.earth_radius = 10;
WARS.constants.zoom_offset = 0.1;
WARS.constants.background_image_radius = 50;
WARS.constants.gallery_size = 4;
WARS.constants.battle_scale = 1;

WARS.functions = {};
WARS.functions.init_data = function(){
	$.getJSON('wars.json', function (data){
		WARS.data = data["wars"];
	});
};
WARS.functions.get_date_string = function(d){
	return WARS.constants.months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
};

WARS.keys_pressed = [];

WARS.user = {};
WARS.user.free_mode = false;
WARS.user.position = {};
WARS.user.position.x = 0;
WARS.user.position.y = 0;
WARS.user.position.z = -45;
WARS.user.rotation = {};
WARS.user.rotation.x = 15;
WARS.user.rotation.y = 211;
WARS.user.interpolate_start = {"x": 0, "y": 0};
WARS.user.interpolate_end = {"x": 0, "y": 0};
WARS.user.interpolation_percent = 0;
WARS.user.interpolate_position = function(battle_object){
	if(WARS.user.interpolation_percent == 0){
		WARS.user.interpolate_start = {x: WARS.user.rotation.x, y: WARS.user.rotation.y};
	}
	WARS.user.interpolation_percent += 0.025;

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

WARS.date_range = {};

WARS.mouse = {};
WARS.mouse.left_down = false;
WARS.mouse.right_down = false;
WARS.mouse.x = "";
WARS.mouse.y = "";

WARS.models = {};

WARS.init = {};
WARS.init.models = function(){
	WARS.models.tie = new Sphere(0.05, 30, 30);
	WARS.models.tie.set_texture("./assets/textures/tie.png");
	WARS.models.tie.set_shader(basic_shader);
}

WARS.init.wars = function(){

	curr_war = new War();
	
	$("#war-name").html(WARS.war_name+' <span class="caret"></span>');

	var tmp_dropdown = "";
	Object.keys(WARS.data).forEach(function(war_name){
		var war = WARS.data[war_name];
		var battles = war.battles;
		
		battles.sort(function (a, b){
			var c = new Date(a.start);
			var d = new Date(b.start);
			if (c > d){return 1;}
			if (c < d){return -1;}
			return 0;
		});
		
		var countries = war.countries;
		if(war_name == WARS.war_name){
			$("#battles-modal .modal-body").html('');
			$("#countries-modal .modal-body").html('');
			countries.forEach(function(country){
				WARS.models[country.name] = new Sphere(0.05, 30, 30);
				var filename = country.name.toLowerCase().replace(/\s+/g, '_');
				WARS.models[country.name].set_texture("./assets/textures/"+filename+".png");
				WARS.models[country.name].set_shader(basic_shader);
				
				var wins = battles.filter(function (battle) { 
					return battle.winner == country.name;
				}).length;
				var losses = battles.filter(function (battle) { 
					return (battle.winner != country.name && 
							battle.winner != "" && 
							battle.countries.filter(function (c){
								return c.name == country.name;
							}).length > 0
							);
				}).length;
				
				var leaders = "";
				country.leaders.forEach(function(leader){
					leaders += '<div class="col-xs-12">'+leader.name+' - '+leader.title+'</div>';
				});
				
				
				$("#countries-modal .modal-body").append(
					'<span class="col-xs-12 flag-background" style="'+
						'background-image:url(&quot;./assets/textures/'+country.name.toLowerCase().replace(/\s+/g, '_')+'.png&quot;);">'+
						'<div class="col-xs-12 modal-select">'+
							'<div class="col-xs-12 modal-select-title">'+country.name+'</div>'+
							leaders+
							'<div class="col-md-6 col-xs-12">'+wins+(wins == 1 ? " Victory" : " Victories")+'</div>'+
							'<div class="col-md-6 col-xs-12">'+losses+(losses == 1 ? " Defeat" : " Defeats")+'</div>'+
						'</div>'+
					'</span>'
				);
			});
			
			var commanders = [];
			
			var battle_id_counter_index = 0;
			var battle_id_counter_value = 1;
			
			battles.forEach(function(battle){
				battle.countries.forEach(function(country){
					var commander_name = country.leader;
					if(["", "?"].indexOf(commander_name) == -1){
						var curr_commander = commanders.filter(function(c) c.name == commander_name && c.country == country.name);
						if(curr_commander.length > 0){
							curr_commander = curr_commander[0];
							if(curr_commander.country == battle.winner){
								curr_commander.wins++;
							}
							else{
								curr_commander.losses++;
							}
						}
						else{
							var tmp_commander = {name: commander_name, country: country.name, wins: 0, losses: 0};
							if(tmp_commander.country == battle.winner){
								tmp_commander.wins = 1;
								tmp_commander.losses = 0;
							}
							else{
								tmp_commander.wins = 0;
								tmp_commander.losses = 1;
							}
							commanders.push(tmp_commander);
						}
					}
				});
				var tmp_battle = new Battle(battle);
				switch(battle_id_counter_index){
					case 0:
						tmp_battle.set_clickable_id([battle_id_counter_value, 0, 0]);
						break;
					case 1:
						tmp_battle.set_clickable_id([0, battle_id_counter_value, 0]);
						break;
					case 2:
						tmp_battle.set_clickable_id([battle_id_counter_value, battle_id_counter_value, 0]);
						break;
					case 3:
						tmp_battle.set_clickable_id([0, battle_id_counter_value, battle_id_counter_value]);
						break;
					case 4:
						tmp_battle.set_clickable_id([0, 0, battle_id_counter_value]);
						break;
					case 5:
						tmp_battle.set_clickable_id([battle_id_counter_value, 0, battle_id_counter_value]);
						break;
					case 6:
						tmp_battle.set_clickable_id([battle_id_counter_value, battle_id_counter_value, battle_id_counter_value]);
						battle_id_counter_value-=0.01;
						break;
					default:
						tmp_battle.set_clickable_id([battle_id_counter_value, 0, 0]);
						battle_id_counter_value-=0.01;
						break;
				}
				
				battle_id_counter_index++;
				battle_id_counter_index%=7;
				
				curr_war.add_battle(tmp_battle);
			});
			
			commanders.sort(function (a, b){
				if (a.losses > b.losses){return 1;}
				if (a.losses < b.losses){return -1;}
				return 0;
			});
			
			commanders.sort(function (a, b){
				if (a.wins > b.wins){return -1;}
				if (a.wins < b.wins){return 1;}
				return 0;
			});
			
			$("#commanders-modal .modal-body").html('');
			commanders.forEach(function(commander){
				$("#commanders-modal .modal-body").append(
					'<span class="col-xs-12 flag-background" style="'+
						'background-image:url(&quot;./assets/textures/'+commander.country.toLowerCase().replace(/\s+/g, '_')+'.png&quot;);">'+
						'<div class="col-xs-12 modal-select">'+
							'<div class="col-xs-12 modal-select-title">'+commander.name+'</div>'+
							'<div class="col-xs-12">'+commander.country+'</div>'+
							'<div class="col-md-6 col-xs-12">'+commander.wins+(commander.wins == 1 ? " Victory" : " Victories")+'</div>'+
							'<div class="col-md-6 col-xs-12">'+commander.losses+(commander.losses == 1 ? " Defeat" : " Defeats")+'</div>'+
						'</div>'+
					'</span>'
				);
			});
			
			gallery = new Gallery(WARS.war_name.toLowerCase().replace(/\s+/g, '_'));
		}
		else{
			tmp_dropdown += '<li><a onclick="WARS.init.war(&quot;'+war_name+'&quot;);">'+war_name+'</a></li>';
		}
	});
	$("#war-dropdown").html(tmp_dropdown);
}

WARS.init.project = function(){
	WARS.init.models();
	WARS.init.wars();
	$( "#time-select-slider" ).slider({
      range: true,
      min: curr_war.start_time.getTime(),
      max: curr_war.end_time.getTime(),
      values: [ curr_war.start_time.getTime(), curr_war.end_time.getTime() ],
      slide: function( event, ui ) {
		WARS.date_range.start_time = new Date(1970, 0, 1, 0, 0, 0, ui.values[ 0 ]);
		WARS.date_range.end_time   = new Date(1970, 0, 1, 0, 0, 0, ui.values[ 1 ]);
        $( "#time-select-display" ).val( WARS.functions.get_date_string(WARS.date_range.start_time) + 
						" - " + WARS.functions.get_date_string(WARS.date_range.end_time) );
      },
	  change: function( event, ui ){
	  }
    });
	var date_1 = new Date(1970, 0, 1, 0, 0, 0, $( "#time-select-slider" ).slider( "values", 0 ));
	var date_2 = new Date(1970, 0, 1, 0, 0, 0, $( "#time-select-slider" ).slider( "values", 1 ));
    $( "#time-select-display" ).val( WARS.functions.get_date_string(date_1) +
      " - " + WARS.functions.get_date_string(date_2) );
}

WARS.init.war = function(war_name){
	WARS.war_name=war_name;
	$("#battle-info").hide('fade');
	WARS.init.project();
};