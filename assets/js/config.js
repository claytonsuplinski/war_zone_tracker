WARS = {};

WARS.window = {};
WARS.window.width = 0;
WARS.window.height = 0;

WARS.war_name = "World War II";

WARS.constants = {};
WARS.constants.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
WARS.constants.to_radians = Math.PI/180;
WARS.constants.lon_offset = 180;
WARS.constants.earth_radius = 10;
WARS.constants.zoom_offset = 0.1;
WARS.constants.background_image_radius = 74;
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
WARS.functions.increment_battle_scale = function(val){
	WARS.constants.battle_scale += val;
	if(WARS.constants.battle_scale < 0){WARS.constants.battle_scale = 0;}
	if(WARS.constants.battle_scale > 10){WARS.constants.battle_scale = 10;}
	$("#battle-scale-value").html((WARS.constants.battle_scale*100).toFixed(0) + "%");
};

WARS.keys_pressed = [];

WARS.user = new User();

WARS.date_range = {};

WARS.mouse = {};
WARS.mouse.left_down = false;
WARS.mouse.right_down = false;
WARS.mouse.x = "";
WARS.mouse.y = "";

WARS.models = {};