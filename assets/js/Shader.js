function Shader(vert, frag){
	this.vert = vert;
	this.frag = frag;
	this.shader_program;
	
	this.init_shader();
};

Shader.prototype.init_shader = function(){
  var fragmentShader = this.get_shader(gl, this.frag);
  var vertexShader = this.get_shader(gl, this.vert);
  
  // Create the shader program
  
  this.shader_program = gl.createProgram();
  gl.attachShader(this.shader_program, vertexShader);
  gl.attachShader(this.shader_program, fragmentShader);
  gl.linkProgram(this.shader_program);
  
  // If creating the shader program failed, alert
  
  if (!gl.getProgramParameter(this.shader_program, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program.");
  }
  
  gl.useProgram(this.shader_program);
  
  vertexPositionAttribute = gl.getAttribLocation(this.shader_program, "aVertexPosition");
  gl.enableVertexAttribArray(vertexPositionAttribute);
  
  textureCoordAttribute = gl.getAttribLocation(this.shader_program, "aTextureCoord");
  gl.enableVertexAttribArray(textureCoordAttribute);
};

Shader.prototype.get_shader = function(gl, id){
  var shaderScript = document.getElementById(id);
  
  // Didn't find an element with the specified ID; abort.
  
  if (!shaderScript) {
    return null;
  }
  
  // Walk through the source element's children, building the
  // shader source string.
  
  var theSource = "";
  var currentChild = shaderScript.firstChild;
  
  while(currentChild) {
    if (currentChild.nodeType == 3) {
      theSource += currentChild.textContent;
    }
    
    currentChild = currentChild.nextSibling;
  }
  
  // Now figure out what type of shader script we have,
  // based on its MIME type.
  
  var shader;
  
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;  // Unknown shader type
  }
  
  // Send the source to the shader object
  
  gl.shaderSource(shader, theSource);
  
  // Compile the shader program
  
  gl.compileShader(shader);
  
  // See if it compiled successfully
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
    return null;
  }
  
  return shader;
};