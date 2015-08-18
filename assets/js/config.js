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
			countries.forEach(function(country){
				WARS.models[country.name] = new Sphere(0.05, 30, 30);
				var filename = country.name.toLowerCase().replace(/\s+/g, '_');
				WARS.models[country.name].set_texture("./assets/textures/"+filename+".png");
				WARS.models[country.name].set_shader(basic_shader);
			});
			battles.forEach(function(battle){
				var lat = -battle.location.lat;
				var lon = battle.location.lon;
				
				test_war.add_battle(new Battle(battle));
				//test_war.add_battle(new Battle(180 * Math.random() - 90, 360 * Math.random() - 180));
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