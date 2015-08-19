function Room(){
	this.sides = "";
	this.floor = "";
	this.ceiling = "";
	
	this.init();
};

Room.prototype.init = function(){
	this.sides = [];
	
	for(var i=1; i<=WARS.constants.gallery_size; i++){
		var tmp_rect = new Rectangle(150, 110);
		tmp_rect.set_texture("./assets/textures/background_sphere.png");
		tmp_rect.set_shader(basic_shader);
		this.sides.push(tmp_rect);
	}
	
	this.floor = new Rectangle(150, 150);
	this.floor.set_texture("./assets/textures/background_floor.png");
	this.floor.set_shader(basic_shader);
	
	this.ceiling = new Rectangle(150, 150);
	this.ceiling.set_texture("./assets/textures/background_ceiling.png");
	this.ceiling.set_shader(basic_shader);
};

Room.prototype.draw = function(){	
	var self = this;
	this.sides.forEach(function(side, index){
		mvPushMatrix();
		mvRotate(index * 360/self.sides.length, [0,1,0]);
		mvTranslate([0,0,WARS.constants.background_image_radius+0.5]);
		mvRotate(180, [0,0,1]);
		side.draw();
		mvPopMatrix();
	});
	
	mvPushMatrix();
	mvRotate(90, [1,0,0]);
	mvTranslate([0,0,50]);
	this.floor.draw();
	mvTranslate([0,0,-100]);
	this.ceiling.draw();
	mvPopMatrix();
};