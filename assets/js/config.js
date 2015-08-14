WARS = {};

WARS.window = {};
WARS.window.width = 0;
WARS.window.height = 0;

WARS.constants = {};
WARS.constants.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
WARS.constants.to_radians = Math.PI/180;
WARS.constants.lon_offset = 180;
WARS.constants.earth_radius = 10;
WARS.constants.zoom_offset = 0.1;

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
WARS.user.position.z = -30;
WARS.user.rotation = {};
WARS.user.rotation.x = -40;
WARS.user.rotation.y = 0;

WARS.date_range = {};

WARS.mouse = {};
WARS.mouse.left_down = false;
WARS.mouse.right_down = false;
WARS.mouse.x = "";
WARS.mouse.y = "";

WARS.models = {};

WARS.models.electrons = {};

function init_models(){

	/*
	WARS.models["Massachusetts Bay"] = new Sphere(0.2, 30, 30);
	WARS.models["Massachusetts Bay"].set_texture("./assets/textures/massachusetts_bay.png");
	WARS.models["Massachusetts Bay"].set_shader(basic_shader);
	*/

	WARS.models.tie = new Sphere(0.1, 30, 30);
	WARS.models.tie.set_texture("./assets/textures/tie.png");
	WARS.models.tie.set_shader(basic_shader);
	
	WARS.models.electrons["p"] = new Sphere(0.2, 8, 8);
	WARS.models.electrons["p"].set_texture("./assets/textures/electron_p.png");
	WARS.models.electrons["p"].set_shader(basic_shader);	
	
	WARS.models.electrons["d"] = new Sphere(0.2, 8, 8);
	WARS.models.electrons["d"].set_texture("./assets/textures/electron_d.png");
	WARS.models.electrons["d"].set_shader(basic_shader);	
	
	WARS.models.electrons["f"] = new Sphere(0.2, 8, 8);
	WARS.models.electrons["f"].set_texture("./assets/textures/electron_f.png");
	WARS.models.electrons["f"].set_shader(basic_shader);	
}

function init_wars(){

	test_war = new War();

	Object.keys(WARS.data).forEach(function(war_name){
		var war = WARS.data[war_name];
		var battles = war.battles;
		var countries = war.countries;
		if(war_name == "American Revolutionary War"){
			countries.forEach(function(country){
				WARS.models[country.name] = new Sphere(0.1, 30, 30);
				var filename = country.name.toLowerCase().replace(' ', '_').replace(' ', '_');
				WARS.models[country.name].set_texture("./assets/textures/"+filename+".png");
				WARS.models[country.name].set_shader(basic_shader);
			});
			battles.forEach(function(battle){
				var lat = -battle.location.lat;
				var lon = battle.location.lon;
				
				test_war.add_battle(new Battle(battle));
				//test_war.add_battle(new Battle(180 * Math.random() - 90, 360 * Math.random() - 180));
			});
		}
	});
}

function init_project(){
	init_models();
	init_wars();
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