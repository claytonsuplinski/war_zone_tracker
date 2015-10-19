function Gallery(war_name){
	this.sides = "";
	this.banners = "";
	this.room = "";
	this.frame = "";
	this.rafter = "";
	this.chandelier = "";
	this.war_name = war_name;
	
	this.init();
};

Gallery.prototype.init = function(){
	var self = this;

	this.sides = [];
	this.banners = [];
	
	this.room = new OBJ("./assets/models/room.obj", "./assets/models/room.jpg");
	this.room.set_shader(basic_shader);
	
	this.chandelier = new OBJ("./assets/models/chandelier.obj", "./assets/models/chandelier.jpg");
	this.chandelier.set_shader(basic_shader);
	
	this.rafter = new OBJ("./assets/models/frame.obj", "./assets/models/rafter.jpg");
	this.rafter.set_shader(basic_shader);
	
	this.frame  = new OBJ("./assets/models/frame.obj", "./assets/models/frame.jpg");
	this.frame.set_shader(basic_shader);
	
	this.frame.material.specular_color = {r:0.8, g:0.8, b:0.4};
	this.frame.material.shininess = 20;
			   
	for(var i=1; i<=WARS.constants.gallery_size; i++){
		var tmp_rect = new Rectangle(50, 50);
		tmp_rect.set_texture("./assets/textures/"+this.war_name+"/"+i+".png");
		tmp_rect.set_shader(basic_shader);
		this.sides.push(tmp_rect);
	}
	
	curr_war.banners.sort(function (a, b){
		var c = a.battles;
		var d = b.battles;
		if (c > d){return -1;}
		if (c < d){return 1;}
		return 0;
	});
	
	for(var i=0; i<8; i++){
		var banner = new OBJ("./assets/models/banner.obj", "./assets/textures/"+curr_war.banners[i%curr_war.banners.length].name+".png");
		banner.set_shader(basic_shader);
		this.banners.push(banner);
	}
	
};

Gallery.prototype.draw = function(){	

	mvPushMatrix();
	mat4.translate(mvMatrix, [0,-75,0]);
	this.room.draw();
	mvPopMatrix();	

	var self = this;
	this.sides.forEach(function(side, index){
		mvPushMatrix();
			mat4.rotate(mvMatrix, degToRad(index * 360/self.sides.length), [0,1,0]);
			mat4.translate(mvMatrix, [0,-10,WARS.constants.background_image_radius]);
			mat4.rotate(mvMatrix, degToRad(180), [0,0,1]);
			gl.uniform3f(basic_shader.shader_program.ambientLightingColorUniform, 1, 1, 1);
			gl.uniform3f(basic_shader.shader_program.pointLightingLocationUniform, 0, 0, 0);
			gl.uniform3f(basic_shader.shader_program.pointLightingDiffuseColorUniform, 1, 1, 1);
			side.draw();
			mat4.rotate(mvMatrix, degToRad(90), [1,0,0]);
			gl.uniform3f(basic_shader.shader_program.ambientLightingColorUniform, 0.6, 0.6, 0.6);
			gl.uniform3f(basic_shader.shader_program.pointLightingLocationUniform, 0, 0, 150);
			gl.uniform3f(basic_shader.shader_program.pointLightingDiffuseColorUniform, 0.4, 0.4, 0.4);
			self.frame.draw();
		mvPopMatrix();
	});
	
	gl.uniform3f(basic_shader.shader_program.ambientLightingColorUniform, 0.6, 0.6, 0.6);
	gl.uniform3f(basic_shader.shader_program.pointLightingLocationUniform, 0, 0, 0);
	gl.uniform3f(basic_shader.shader_program.pointLightingDiffuseColorUniform, 0.4, 0.4, 0.4);
	
	for(var i=0; i<this.banners.length; i+=2){
		mvPushMatrix();
			mat4.rotate(mvMatrix, degToRad(i * 360/this.banners.length), [0,1,0]);
			mat4.translate(mvMatrix, [-30,80,WARS.constants.background_image_radius]);
			mat4.rotate(mvMatrix, degToRad(180), [0,1,0]);
			this.banners[i].draw();
			this.rafter.draw();
		mvPopMatrix();
		mvPushMatrix();
			mat4.rotate(mvMatrix, degToRad(i * 360/this.banners.length), [0,1,0]);
			mat4.translate(mvMatrix, [30,80,WARS.constants.background_image_radius]);
			mat4.rotate(mvMatrix, degToRad(180), [0,1,0]);
			this.banners[i+1].draw();
			this.rafter.draw();
		mvPopMatrix();
	}
	
	mvPushMatrix();
	mat4.translate(mvMatrix, [0,125,0]);
	this.chandelier.draw();
	mvPopMatrix();
};