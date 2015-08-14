function GraphicsObject(){
	this.v = [];
	this.vn = [];
	this.vt = [];
	this.vertex_indices = [];
	this.v_buffer = "";
	this.vt_buffer = "";
	this.vertex_indices_buffer = "";
	this.v_attr = "";
	this.shader_program = "";
	
	this.img = "";
	this.image = "";
	this.texture = "";
};

GraphicsObject.prototype.init_buffers = function(){

	this.v_buffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, this.v_buffer);  
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.v), gl.STATIC_DRAW);

	this.vt_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vt_buffer);

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vt), gl.STATIC_DRAW);

	this.vertex_indices_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertex_indices_buffer);

	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
	  new Uint16Array(this.vertex_indices), gl.STATIC_DRAW);
};

GraphicsObject.prototype.set_texture = function(filename){
	this.img = filename;
	this.texture = gl.createTexture();
	this.image = new Image();
	var self = this;
	this.image.onload = function() { 		
		gl.bindTexture(gl.TEXTURE_2D, self.texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, self.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
	this.image.src = this.img;
};

GraphicsObject.prototype.set_shader = function(shader_program){
	var tmp = shader_program.shader_program;
	this.shader_program = tmp;
}

GraphicsObject.prototype.draw = function(){
  
  mvPushMatrix();
  
    // Draw the cube by binding the array buffer to the cube's vertices
  // array, setting attributes, and pushing it to GL.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.v_buffer);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vt_buffer);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
    
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, this.texture);
  gl.uniform1i(gl.getUniformLocation(this.shader_program, "uSampler"), 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertex_indices_buffer);
  setMatrixUniforms(this.shader_program);
  gl.drawElements(gl.TRIANGLES, this.vertex_indices.length, gl.UNSIGNED_SHORT, 0);
  
  mvPopMatrix();

};