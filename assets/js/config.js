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
WARS.user.interpolate_position = function(){
	if(WARS.user.interpolation_percent == 0){
		WARS.user.interpolate_start = {x: WARS.user.rotation.x, y: WARS.user.rotation.y};
	}
	WARS.user.interpolation_percent += 0.025;

	var alpha = 1 - WARS.user.interpolation_percent;
	var beta = WARS.user.interpolation_percent;
	
	WARS.user.rotation.x = alpha * WARS.user.interpolate_start.x + beta * WARS.user.interpolate_end.x;
	WARS.user.rotation.y = alpha * WARS.user.interpolate_start.y + beta * WARS.user.interpolate_end.y;
	
	if(WARS.user.interpolation_percent < 1){
		setTimeout(WARS.user.interpolate_position, 15);
	}
	else{
		WARS.user.interpolation_percent = 0;
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

	test_war = new War();
	
	$("#war-name").html(WARS.war_name+' <span class="caret"></span>');

	var tmp_dropdown = "";
	Object.keys(WARS.data).forEach(function(war_name){
		var war = WARS.data[war_name];
		var battles = war.battles;
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
				
				$("#countries-modal .modal-body").append(
					'<span class="col-xs-12 flag-background" style="'+
						'background-image:url(&quot;./assets/textures/'+country.name.toLowerCase().replace(/\s+/g, '_')+'.png&quot;);">'+
						'<div class="col-xs-12 modal-select">'+
							'<div class="col-xs-12 modal-select-title">'+country.name+'</div>'+
							'<div class="col-md-6 col-xs-12">'+wins+(wins == 1 ? " Victory" : " Victories")+'</div>'+
							'<div class="col-md-6 col-xs-12">'+losses+(losses == 1 ? " Defeat" : " Defeats")+'</div>'+
						'</div>'+
					'</span>'
				);
			});
			
			battles.forEach(function(battle){
				test_war.add_battle(new Battle(battle));
			});
			
			gallery = new Gallery(WARS.war_name.toLowerCase().replace(/\s+/g, '_'));
		}
		else{
			tmp_dropdown += '<li><a onclick="WARS.war_name=&quot;'+war_name+'&quot;;WARS.init.project();">'+war_name+'</a></li>';
		}
	});
	$("#war-dropdown").html(tmp_dropdown);
}

WARS.init.project = function(){
	WARS.init.models();
	WARS.init.wars();
	$( "#time-select-slider" ).slider({
      range: true,
      min: test_war.start_time.getTime(),
      max: test_war.end_time.getTime(),
      values: [ test_war.start_time.getTime(), test_war.end_time.getTime() ],
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