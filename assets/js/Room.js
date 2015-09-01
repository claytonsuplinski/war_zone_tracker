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
		
		tmp_rect.material = {
			ambient_color:  {r:1.0, g:1.0, b:1.0},
			diffuse_color:  {r:1.0, g:1.0, b:1.0},
			specular_color: {r:1.0, g:1.0, b:1.0},
			emissive_color: {r:0.0, g:0.0, b:0.0},
			shininess: 10
		}
		
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
		mat4.rotate(mvMatrix, degToRad(index * 360/self.sides.length), [0,1,0]);
		mat4.translate(mvMatrix, [0,0,WARS.constants.background_image_radius+0.5]);
		mat4.rotate(mvMatrix, degToRad(180), [0,0,1]);
		side.draw();
		mvPopMatrix();
	});
	
	mvPushMatrix();
	mat4.rotate(mvMatrix, degToRad(90), [1,0,0]);
	mat4.translate(mvMatrix, [0,0,50]);
	this.floor.draw();
	mat4.translate(mvMatrix, [0,0,-100]);
	this.ceiling.draw();
	mvPopMatrix();
};