var canvas;
var gl;

function initWebGL() {
	gl = null;

	try {
		gl = canvas.getContext("experimental-webgl");
	}
	catch(e) {
	}

	if (!gl) {
		alert("Unable to initialize WebGL. Your browser may not support it.");
	}
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
			
		basic_shader = new Shader("shader-vs", "shader-fs");

		init_project();
		
		test_sphere = new Sphere(WARS.constants.earth_radius, 200, 200);
		test_sphere.set_texture("./assets/textures/earth.png");
		test_sphere.set_shader(basic_shader);
		test_sphere_rotation = 0;

		setInterval(drawScene, 15);

	}
}

function drawScene() {

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	perspectiveMatrix = makePerspective(45, window.innerWidth/window.innerHeight, 0.1, 5000.0);

	loadIdentity();

	if(WARS.user.free_mode){
		mvRotate(WARS.user.rotation.x, [1,0,0]);
		mvRotate(WARS.user.rotation.y, [0,1,0]);
		mvTranslate([WARS.user.position.x,0-WARS.user.position.y,WARS.user.position.z]);
	}
	else{
		mvTranslate([WARS.user.position.x,0-WARS.user.position.y,WARS.user.position.z]);
		mvRotate(WARS.user.rotation.x, [1,0,0]);
		mvRotate(WARS.user.rotation.y, [0,1,0]);
	}
	
	test_sphere.draw();
	
	test_war.draw();
  
}