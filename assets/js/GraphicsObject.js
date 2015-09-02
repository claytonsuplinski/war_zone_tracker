function GraphicsObject(){
	this.v = [];
	this.vn = [];
	this.vt = [];
	this.vertex_indices = [];
	this.v_buffer = "";
	this.vn_buffer = "";
	this.vt_buffer = "";
	this.vertex_indices_buffer = "";
	this.v_attr = "";
	this.shader_program = "";
	
	this.img = "";
	this.image = "";
	this.texture = "";
	
	this.is_framebuffer = false;
	
	this.rttFramebuffer = "";
    this.rttTexture = "";
	
	this.material = "";
	this.scale = "";
	this.clickable_object = "";
};

GraphicsObject.prototype.init_buffers = function(){
	this.material = {};
	this.material.ambient_color  = {r:1.0, g:1.0, b:1.0};
	this.material.diffuse_color  = {r:1.0, g:1.0, b:1.0};
	this.material.specular_color = {r:0.0, g:0.0, b:0.0};
	this.material.emissive_color = {r:0.0, g:0.0, b:0.0};
	this.material.shininess = 0;
	
	this.scale = [1, 1, 1];
	this.clickable_object = [0,0,0];
	  
	this.vn_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vn_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vn), gl.STATIC_DRAW);
	this.vn_buffer.itemSize = 3;
	this.vn_buffer.numItems = this.vn.length / 3;

	this.vt_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vt_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vt), gl.STATIC_DRAW);
	this.vt_buffer.itemSize = 2;
	this.vt_buffer.numItems = this.vt.length / 2;

	this.v_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.v_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.v), gl.STATIC_DRAW);
	this.v_buffer.itemSize = 3;
	this.v_buffer.numItems = this.v.length / 3;

	this.vertex_indices_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertex_indices_buffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.vertex_indices), gl.STREAM_DRAW);
	this.vertex_indices_buffer.itemSize = 1;
	this.vertex_indices_buffer.numItems = this.vertex_indices.length;
};

GraphicsObject.prototype.init_framebuffer = function(){
	this.rttFramebuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.rttFramebuffer);
	this.rttFramebuffer.width = 512;
	this.rttFramebuffer.height = 512;

	this.rttTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, this.rttTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.rttFramebuffer.width, this.rttFramebuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

	var renderbuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.rttFramebuffer.width, this.rttFramebuffer.height);

	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.rttTexture, 0);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	
	this.is_framebuffer = true;
}

GraphicsObject.prototype.set_texture = function(filename){
	this.img = filename;
	this.texture = gl.createTexture();
	this.texture.image = new Image();
	var self = this;
	this.texture.image.onload = function () {
		gl.bindTexture(gl.TEXTURE_2D, self.texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, self.texture.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);

		gl.bindTexture(gl.TEXTURE_2D, null);
	}
	this.texture.image.src = this.img;
};

GraphicsObject.prototype.set_shader = function(shader_program){
	var tmp = shader_program.shader_program;
	this.shader_program = tmp;
}

GraphicsObject.prototype.draw_scene_on_framebuffer = function(draw_function){

	gl.bindFramebuffer(gl.FRAMEBUFFER, this.rttFramebuffer);
	gl.viewport(0, 0, canvas.width, this.rttFramebuffer.height);
	gl.clearColor(1.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	mat4.perspective(45, window.innerWidth/window.innerHeight, 0.1, 100.0, pMatrix);

	gl.uniform1i(this.shader_program.showSpecularHighlightsUniform, false);
	gl.uniform3f(this.shader_program.ambientLightingColorUniform, 1, 1, 1);
	gl.uniform3f(this.shader_program.pointLightingLocationUniform, 0, 0, 0);
	gl.uniform3f(this.shader_program.pointLightingDiffuseColorUniform, 0, 0, 0);

	draw_function();
	
	gl.bindTexture(gl.TEXTURE_2D, this.rttTexture);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
	
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};

GraphicsObject.prototype.draw = function(params){

	if(params != undefined){
		if(params.scale != undefined){
			this.scale = params.scale;
		}
		if(params.clickable != undefined){
			this.clickable_object = params.clickable;
		}
	}

	gl.uniform3f(this.shader_program.materialAmbientColorUniform,  this.material.ambient_color.r,  this.material.ambient_color.g,  this.material.ambient_color.b);
	gl.uniform3f(this.shader_program.materialDiffuseColorUniform,  this.material.diffuse_color.r,  this.material.diffuse_color.g,  this.material.diffuse_color.b);
	gl.uniform3f(this.shader_program.materialSpecularColorUniform, this.material.specular_color.r, this.material.specular_color.g, this.material.specular_color.b);
	gl.uniform1f(this.shader_program.materialShininessUniform, this.material.shininess);
	gl.uniform3f(this.shader_program.materialEmissiveColorUniform, this.material.emissive_color.r, this.material.emissive_color.g, this.material.emissive_color.b);
	gl.uniform3f(this.shader_program.scale, this.scale[0], this.scale[1], this.scale[2]);
	gl.uniform3f(this.shader_program.clickableObject, this.clickable_object[0], this.clickable_object[1], this.clickable_object[2]);
	gl.uniform1i(this.shader_program.useTexturesUniform, true);
	
	mvPushMatrix();
	
	if(this.is_framebuffer){
		/*
		gl.uniform3f(basic_shader.shader_program.materialAmbientColorUniform, 0.0, 0.0, 0.0);
        gl.uniform3f(basic_shader.shader_program.materialDiffuseColorUniform, 0.0, 0.0, 0.0);
        gl.uniform3f(basic_shader.shader_program.materialSpecularColorUniform, 0.5, 0.5, 0.5);
        gl.uniform1f(basic_shader.shader_program.materialShininessUniform, 20);
        gl.uniform3f(basic_shader.shader_program.materialEmissiveColorUniform, 1.5, 1.5, 1.5);
        gl.uniform1i(basic_shader.shader_program.useTexturesUniform, true);
		*/

        gl.bindBuffer(gl.ARRAY_BUFFER, this.v_buffer);
        gl.vertexAttribPointer(this.shader_program.vertexPositionAttribute, this.v_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vn_buffer);
        gl.vertexAttribPointer(this.shader_program.vertexNormalAttribute, this.vn_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vt_buffer);
        gl.vertexAttribPointer(this.shader_program.textureCoordAttribute, this.vt_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.rttTexture);
        gl.uniform1i(this.shader_program.samplerUniform, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertex_indices_buffer);
        setMatrixUniforms();
        gl.drawElements(gl.TRIANGLES, this.vertex_indices_buffer.numItems, gl.UNSIGNED_SHORT, 0);
	}
	else{
		if(this.texture != ""){
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			gl.uniform1i(this.shader_program.samplerUniform, 0);
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, this.v_buffer);
		gl.vertexAttribPointer(this.shader_program.vertexPositionAttribute, this.v_buffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vt_buffer);
		gl.vertexAttribPointer(this.shader_program.textureCoordAttribute, this.vt_buffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vn_buffer);
		gl.vertexAttribPointer(this.shader_program.vertexNormalAttribute, this.vn_buffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertex_indices_buffer);
		setMatrixUniforms();

		gl.drawElements(gl.TRIANGLES, this.vertex_indices_buffer.numItems, gl.UNSIGNED_SHORT, 0);
	}
	
	mvPopMatrix();

};