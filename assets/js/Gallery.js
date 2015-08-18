function Gallery(war_name){
	this.sides = "";
	this.war_name = war_name;
	
	this.init();
};

Gallery.prototype.init = function(){
	this.sides = [];
	
	for(var i=1; i<=WARS.constants.gallery_size; i++){
		var tmp_rect = new Rectangle(30, 30);
		tmp_rect.set_texture("./assets/textures/"+this.war_name+"/"+i+".png");
		tmp_rect.set_shader(basic_shader);
		this.sides.push(tmp_rect);
	}
};

Gallery.prototype.draw = function(){	
	var self = this;
	this.sides.forEach(function(side, index){
		mvPushMatrix();
		mvRotate(index * 360/self.sides.length, [0,1,0]);
		mvTranslate([0,0,WARS.constants.background_image_radius]);
		mvRotate(180, [0,0,1]);
		side.draw();
		mvPopMatrix();
	});
};