function Rectangle(width, height){
	this.width  = width;
	this.height = height;
	
	this.load_vertices();
	this.init_buffers();	
};

Rectangle.prototype = new GraphicsObject();

Rectangle.prototype.load_vertices = function(){

    this.v = [
		-this.width/2, -this.height/2,  0,
		 this.width/2, -this.height/2,  0,
		 this.width/2,  this.height/2,  0,
		-this.width/2,  this.height/2,  0
	];
    this.vn = [
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0
	];
    this.vt = [
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0
	];
    this.vertex_indices = [
		0,  1,  2,      0,  2,  3
	];
	
};