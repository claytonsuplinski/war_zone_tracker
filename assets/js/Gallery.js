function Gallery(war_name){
	this.sides = "";
	this.banners = "";
	this.war_name = war_name;
	
	this.init();
};

Gallery.prototype.init = function(){
	this.sides = [];
	this.banners = [];
	
	for(var i=1; i<=WARS.constants.gallery_size; i++){
		var tmp_rect = new Rectangle(30, 30);
		tmp_rect.set_texture("./assets/textures/"+this.war_name+"/"+i+".png");
		tmp_rect.set_shader(basic_shader);
		this.sides.push(tmp_rect);
	}
	
	var tmp_banner = new OBJ("./assets/models/banner.obj");
	tmp_banner.set_shader(basic_shader);
	
	curr_war.banners.sort(function (a, b){
		var c = a.battles;
		var d = b.battles;
		if (c > d){return -1;}
		if (c < d){return 1;}
		return 0;
	});
	
	for(var i=0; i<8; i++){
		var banner = jQuery.extend({}, tmp_banner)
		banner.set_texture("./assets/textures/"+curr_war.banners[i%curr_war.banners.length].name+".png");
		this.banners.push(banner);
	}
	
};

Gallery.prototype.draw = function(){	
	var self = this;
	this.sides.forEach(function(side, index){
		mvPushMatrix();
			mat4.rotate(mvMatrix, degToRad(index * 360/self.sides.length), [0,1,0]);
			mat4.translate(mvMatrix, [0,0,WARS.constants.background_image_radius]);
			mat4.rotate(mvMatrix, degToRad(180), [0,0,1]);
			side.draw();
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
		mvPopMatrix();
		mvPushMatrix();
			mat4.rotate(mvMatrix, degToRad(i * 360/this.banners.length), [0,1,0]);
			mat4.translate(mvMatrix, [30,80,WARS.constants.background_image_radius]);
			mat4.rotate(mvMatrix, degToRad(180), [0,1,0]);
			this.banners[i+1].draw();
		mvPopMatrix();
	}
};