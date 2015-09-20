var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

function initWebGL(canvas) {
	gl = null;

	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = window.innerWidth;
        gl.viewportHeight = window.innerHeight;
	}
	catch(e) {
	}

	if (!gl) {
		alert("Unable to initialize WebGL. Your browser may not support it.");
	}
}

function mvPushMatrix() {
	var copy = mat4.create();
	mat4.set(mvMatrix, copy);
	mvMatrixStack.push(copy);
}

function mvPopMatrix() {
  if (!mvMatrixStack.length) {
    throw("Can't pop from an empty matrix stack.");
  }
  
  mvMatrix = mvMatrixStack.pop();
  return mvMatrix;
}

function setMatrixUniforms() {
	gl.uniformMatrix4fv(basic_shader.shader_program.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(basic_shader.shader_program.mvMatrixUniform, false, mvMatrix);

	var normalMatrix = mat3.create();
	mat4.toInverseMat3(mvMatrix, normalMatrix);
	mat3.transpose(normalMatrix);
	gl.uniformMatrix3fv(basic_shader.shader_program.nMatrixUniform, false, normalMatrix);
}

function degToRad(degrees) {
	return degrees * Math.PI / 180;
}

function resize_canvas(){
	canvas = document.getElementById("glcanvas");
	canvas.style.width = window.innerWidth+"px";
	canvas.style.height = window.innerHeight+"px";
}

window.addEventListener('resize', resize_canvas);

$.ajaxSetup({async:false});

function start() {

	init_mouse_controls();	
	resize_canvas();

	initWebGL(canvas);

	if (gl) {
		gl.clearColor(0.0, 0.02, 0.04, 1.0);  // Clear to black, fully opaque
		gl.clearDepth(1.0);                 // Clear everything
		gl.enable(gl.DEPTH_TEST);           // Enable depth testing
		gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
			
		basic_shader = new Shader("per-fragment-lighting-vs", "per-fragment-lighting-fs");  //"per-fragment-lighting-vs", "per-fragment-lighting-fs"

		WARS.init.project();
		
		max_texture_size = gl.getParameter(gl.MAX_TEXTURE_SIZE);
		
		earth = new Sphere(WARS.constants.earth_radius, 200, 200);
		if(max_texture_size < 4097){
			alert('lr');
			earth.set_texture("./assets/textures/earth_lr.jpg");
		}
		else{
			earth.set_texture("./assets/textures/earth.jpg");
		}
		earth.set_shader(basic_shader);
		earth_rotation = 0;
		
		clickable_battles = new Rectangle(30, 30);
		clickable_battles.set_shader(basic_shader);
		clickable_battles.init_framebuffer(true);
		
		test_glow_framebuffer = new Rectangle(30, 30);
		test_glow_framebuffer.set_shader(basic_shader);
		test_glow_framebuffer.init_framebuffer(false);

		setInterval(drawScene, 15);

	}
}

function draw_only_battles(){
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	mat4.perspective(45, window.innerWidth/window.innerHeight, 0.1, 5000.0, pMatrix);

	mat4.identity(mvMatrix);

	if(WARS.user.free_mode){
		mat4.rotate(mvMatrix, degToRad(WARS.user.rotation.x), [1,0,0]);
		mat4.rotate(mvMatrix, degToRad(WARS.user.rotation.y), [0,1,0]);
		mat4.translate(mvMatrix, [WARS.user.position.x,0-WARS.user.position.y,WARS.user.position.z]);
	}
	else{
		mat4.translate(mvMatrix, [WARS.user.position.x,0-WARS.user.position.y,WARS.user.position.z]);
		mat4.rotate(mvMatrix, degToRad(WARS.user.rotation.x), [1,0,0]);
		mat4.rotate(mvMatrix, degToRad(WARS.user.rotation.y), [0,1,0]);
	}
	
	gl.uniform3f(basic_shader.shader_program.ambientLightingColorUniform, 1,1,1);
	gl.uniform3f(basic_shader.shader_program.pointLightingLocationUniform, 0, 0, 0);
	gl.uniform3f(basic_shader.shader_program.pointLightingDiffuseColorUniform, 1,1,1);
	gl.uniform1i(basic_shader.shader_program.showSpecularHighlightsUniform, false);
	gl.uniform1i(basic_shader.shader_program.useTexturesUniform, true); 
	
	curr_war.set_battles_clickable(true);
	
	curr_war.draw();
};

function draw_entire_scene(){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	mat4.perspective(45, window.innerWidth/window.innerHeight, 0.1, 5000.0, pMatrix);

	mat4.identity(mvMatrix);
	
	gl.uniform3f(basic_shader.shader_program.ambientLightingColorUniform, 0.6, 0.6, 0.6);
	gl.uniform3f(basic_shader.shader_program.pointLightingLocationUniform, 0, 0, 0);
	gl.uniform3f(basic_shader.shader_program.pointLightingDiffuseColorUniform, 1, 1, 1);

	gl.uniform1i(basic_shader.shader_program.showSpecularHighlightsUniform, true);
	gl.uniform1i(basic_shader.shader_program.useTexturesUniform, false);

	if(WARS.user.free_mode){
		mat4.rotate(mvMatrix, degToRad(WARS.user.rotation.x), [1,0,0]);
		mat4.rotate(mvMatrix, degToRad(WARS.user.rotation.y), [0,1,0]);
		mat4.translate(mvMatrix, [WARS.user.position.x,0-WARS.user.position.y,WARS.user.position.z]);
	}
	else{
		mat4.translate(mvMatrix, [WARS.user.position.x,0-WARS.user.position.y,WARS.user.position.z]);
		mat4.rotate(mvMatrix, degToRad(WARS.user.rotation.x), [1,0,0]);
		mat4.rotate(mvMatrix, degToRad(WARS.user.rotation.y), [0,1,0]);
	}
	
	gl.uniform3f(basic_shader.shader_program.ambientLightingColorUniform, 0.72, 0.7, 0.5);

	gl.uniform1i(basic_shader.shader_program.showSpecularHighlightsUniform, true);
	gl.uniform1i(basic_shader.shader_program.useTexturesUniform, false);
	
	earth.draw();
	
	gl.uniform3f(basic_shader.shader_program.ambientLightingColorUniform, 0.1, 0.1, 0.1);

	gl.uniform1i(basic_shader.shader_program.showSpecularHighlightsUniform, true);
	gl.uniform1i(basic_shader.shader_program.useTexturesUniform, false);
	
	curr_war.set_battles_clickable(false);
	
	curr_war.draw();
	
	gl.uniform3f(basic_shader.shader_program.ambientLightingColorUniform, 0.9, 0.9, 0.9);

	gl.uniform1i(basic_shader.shader_program.showSpecularHighlightsUniform, true);
	gl.uniform1i(basic_shader.shader_program.useTexturesUniform, false);
	
	gallery.draw();	
}

function drawScene() {

	draw_entire_scene();
	
	gl.uniform1i(clickable_battles.shader_program.showSpecularHighlightsUniform, true);
	gl.uniform3f(clickable_battles.shader_program.pointLightingLocationUniform, -1, 2, -1);

	gl.uniform3f(clickable_battles.shader_program.ambientLightingColorUniform, 0.2, 0.2, 0.2);
	gl.uniform3f(clickable_battles.shader_program.pointLightingDiffuseColorUniform, 0.8, 0.8, 0.8);
	gl.uniform3f(clickable_battles.shader_program.pointLightingSpecularColorUniform, 0.8, 0.8, 0.8);
	
	clickable_battles.draw_scene_on_framebuffer(draw_only_battles);
	
	/*
	gl.uniform1i(test_glow_framebuffer.shader_program.showSpecularHighlightsUniform, true);
	gl.uniform3f(test_glow_framebuffer.shader_program.pointLightingLocationUniform, -1, 2, -1);

	gl.uniform3f(test_glow_framebuffer.shader_program.ambientLightingColorUniform, 0.2, 0.2, 0.2);
	gl.uniform3f(test_glow_framebuffer.shader_program.pointLightingDiffuseColorUniform, 0.8, 0.8, 0.8);
	gl.uniform3f(test_glow_framebuffer.shader_program.pointLightingSpecularColorUniform, 0.8, 0.8, 0.8);
	
	test_glow_framebuffer.draw_scene_on_framebuffer(draw_entire_scene);
	
	mvPushMatrix();
	
	mat4.translate(mvMatrix, [0, 10, 0]);
	
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	test_glow_framebuffer.draw();
	gl.disable(gl.BLEND);
	mvPopMatrix();
	*/
	
/*	
	mvPushMatrix();
//	mat4.rotate(mvMatrix, degToRad(WARS.user.rotation.y), [0,1,0]);
	
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	clickable_battles.draw();
	gl.disable(gl.BLEND);
	mvPopMatrix();
	*/
  
}