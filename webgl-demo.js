//var canvas;
//var gl;

var mvMatrix = mat4.create();
    var mvMatrixStack = [];
    var pMatrix = mat4.create();

function initWebGL(canvas) {
	gl = null;

	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
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
		
		earth = new Sphere(WARS.constants.earth_radius, 200, 200);
		earth.set_texture("./assets/textures/earth.png");
		earth.set_shader(basic_shader);
		earth_rotation = 0;
		
		background_sphere = new Sphere(100, 200, 200);
		background_sphere.set_texture("./assets/textures/background_sphere.png");
		background_sphere.set_shader(basic_shader);
		background_sphere.material = {
			ambient_color:  {r:1.0, g:1.0, b:1.0},
			diffuse_color:  {r:0.0, g:0.0, b:0.0},
			specular_color: {r:0.0, g:0.0, b:0.0},
			emissive_color: {r:0.0, g:0.0, b:0.0},
			shininess: 5
		}
		
		background_room = new Room();

		setInterval(drawScene, 15);

	}
}

function drawScene() {

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	mat4.perspective(45, window.innerWidth/window.innerHeight, 0.1, 5000.0, pMatrix);

	mat4.identity(mvMatrix);
	
	gl.uniform3f(basic_shader.shader_program.ambientLightingColorUniform, 0.6, 0.6, 0.6);
	gl.uniform3f(basic_shader.shader_program.pointLightingLocationUniform, 0, 0, 5);
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
	
	background_room.draw();
	
	gl.uniform3f(basic_shader.shader_program.ambientLightingColorUniform, 0.72, 0.7, 0.5);
	gl.uniform3f(basic_shader.shader_program.pointLightingLocationUniform, 0, 0, 5);
	gl.uniform3f(basic_shader.shader_program.pointLightingDiffuseColorUniform, 1, 1, 1);

	gl.uniform1i(basic_shader.shader_program.showSpecularHighlightsUniform, true);
	gl.uniform1i(basic_shader.shader_program.useTexturesUniform, false);
	
	earth.draw();
	
	gl.uniform3f(basic_shader.shader_program.ambientLightingColorUniform, 0.1, 0.1, 0.1);
	gl.uniform3f(basic_shader.shader_program.pointLightingLocationUniform, 0, 0, 5);
	gl.uniform3f(basic_shader.shader_program.pointLightingDiffuseColorUniform, 1, 1, 1);

	gl.uniform1i(basic_shader.shader_program.showSpecularHighlightsUniform, true);
	gl.uniform1i(basic_shader.shader_program.useTexturesUniform, false);
	
	curr_war.draw();
	
	gl.uniform3f(basic_shader.shader_program.ambientLightingColorUniform, 0.9, 0.9, 0.9);
	gl.uniform3f(basic_shader.shader_program.pointLightingLocationUniform, 0, 0, 5);
	gl.uniform3f(basic_shader.shader_program.pointLightingDiffuseColorUniform, 1, 1, 1);

	gl.uniform1i(basic_shader.shader_program.showSpecularHighlightsUniform, true);
	gl.uniform1i(basic_shader.shader_program.useTexturesUniform, false);
	
	gallery.draw();
  
}

































/*



	///////////////////////////////////////////////////////
	///////////////////////////////////////////////////////
	///////////////////////////////////////////////////////
	///////////////////////////////////////////////////////
	////////////////// START FRAMEBUFFER //////////////////
	///////////////////////////////////////////////////////
	///////////////////////////////////////////////////////
	///////////////////////////////////////////////////////
	///////////////////////////////////////////////////////	
	
	var mvMatrix = mat4.create();
    var mvMatrixStack = [];
    var pMatrix = mat4.create();
	
	function webGLStart() {
        canvas = document.getElementById("lesson16-canvas");
		
        initWebGL(canvas);
		
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
		
		basic_shader = new Shader("per-fragment-lighting-vs", "per-fragment-lighting-fs"); 
        
		test_sphere = new Sphere(1.5, 30, 30);
		test_sphere.set_shader(basic_shader);
		test_sphere.set_texture('./assets/textures/united_states.png');
		
		test_rectangle = new Rectangle(2, 2);
		test_rectangle.set_shader(basic_shader);
		test_rectangle.set_texture('./assets/textures/united_kingdom.png');
		
		test_framebuffer = new Rectangle(1, 1);
		test_framebuffer.set_shader(basic_shader);
		test_framebuffer.init_framebuffer();

        tick();
    }

	function draw_framebuffer_scene(){
		mat4.identity(mvMatrix);

        mat4.translate(mvMatrix, [0, 0, -5]);
        mat4.rotate(mvMatrix, degToRad(30), [1, 0, 0]);
		
		mvPushMatrix();
			mat4.rotate(mvMatrix, 2.14, [0, 1, 0]);
			mat4.translate(mvMatrix, [2, 0, 0]);
			test_sphere.draw();
		mvPopMatrix();
		
		mvPushMatrix();
			mat4.translate(mvMatrix, [-3, 0, 0]);
			mat4.rotate(mvMatrix, (new Date()).getTime()/1000, [0, 1, 0]);
			test_rectangle.draw();
		mvPopMatrix();
	}

    function mvPushMatrix() {
        var copy = mat4.create();
        mat4.set(mvMatrix, copy);
        mvMatrixStack.push(copy);
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

	function draw_laptop(){
		mvPushMatrix();

        gl.uniform1i(test_framebuffer.shader_program.showSpecularHighlightsUniform, true);
        gl.uniform3f(test_framebuffer.shader_program.pointLightingLocationUniform, -1, 2, -1);

        gl.uniform3f(test_framebuffer.shader_program.ambientLightingColorUniform, 0.2, 0.2, 0.2);
        gl.uniform3f(test_framebuffer.shader_program.pointLightingDiffuseColorUniform, 0.8, 0.8, 0.8);
        gl.uniform3f(test_framebuffer.shader_program.pointLightingSpecularColorUniform, 0.8, 0.8, 0.8);
		
		mat4.translate(mvMatrix, [0, 0, -3.2]);
        //mat4.rotate(mvMatrix, degToRad(-90), [1, 0, 0]);

		test_framebuffer.draw();
		
		mvPopMatrix();
	}

    function drawScene() {
        
        test_framebuffer.draw_scene_on_framebuffer(draw_framebuffer_scene);
		
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

        mat4.identity(mvMatrix);

        draw_laptop();
    }


    function tick() {
        requestAnimFrame(tick);
        drawScene();
    }
	
	*/