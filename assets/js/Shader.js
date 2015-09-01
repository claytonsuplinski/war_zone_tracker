function Shader(vert, frag){
	this.vert = vert;
	this.frag = frag;
	this.shader_program;
	
	this.init_shader();
};

Shader.prototype.init_shader = function(){
  var fragmentShader = this.get_shader(gl, this.frag);
  var vertexShader = this.get_shader(gl, this.vert);
  
	this.shader_program = gl.createProgram();
	gl.attachShader(this.shader_program, vertexShader);
	gl.attachShader(this.shader_program, fragmentShader);
	gl.linkProgram(this.shader_program);

	if (!gl.getProgramParameter(this.shader_program, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}

	gl.useProgram(this.shader_program);

	this.shader_program.vertexPositionAttribute = gl.getAttribLocation(this.shader_program, "aVertexPosition");
	gl.enableVertexAttribArray(this.shader_program.vertexPositionAttribute);

	this.shader_program.vertexNormalAttribute = gl.getAttribLocation(this.shader_program, "aVertexNormal");
	gl.enableVertexAttribArray(this.shader_program.vertexNormalAttribute);

	this.shader_program.textureCoordAttribute = gl.getAttribLocation(this.shader_program, "aTextureCoord");
	gl.enableVertexAttribArray(this.shader_program.textureCoordAttribute);

	this.shader_program.pMatrixUniform = gl.getUniformLocation(this.shader_program, "uPMatrix");
	this.shader_program.mvMatrixUniform = gl.getUniformLocation(this.shader_program, "uMVMatrix");
	this.shader_program.nMatrixUniform = gl.getUniformLocation(this.shader_program, "uNMatrix");
	this.shader_program.samplerUniform = gl.getUniformLocation(this.shader_program, "uSampler");

	this.shader_program.materialAmbientColorUniform = gl.getUniformLocation(this.shader_program, "uMaterialAmbientColor");
	this.shader_program.materialDiffuseColorUniform = gl.getUniformLocation(this.shader_program, "uMaterialDiffuseColor");
	this.shader_program.materialSpecularColorUniform = gl.getUniformLocation(this.shader_program, "uMaterialSpecularColor");
	this.shader_program.materialShininessUniform = gl.getUniformLocation(this.shader_program, "uMaterialShininess");
	this.shader_program.materialEmissiveColorUniform = gl.getUniformLocation(this.shader_program, "uMaterialEmissiveColor");
	this.shader_program.showSpecularHighlightsUniform = gl.getUniformLocation(this.shader_program, "uShowSpecularHighlights");
	this.shader_program.useTexturesUniform = gl.getUniformLocation(this.shader_program, "uUseTextures");
	this.shader_program.ambientLightingColorUniform = gl.getUniformLocation(this.shader_program, "uAmbientLightingColor");
	this.shader_program.pointLightingLocationUniform = gl.getUniformLocation(this.shader_program, "uPointLightingLocation");
	this.shader_program.pointLightingSpecularColorUniform = gl.getUniformLocation(this.shader_program, "uPointLightingSpecularColor");
	this.shader_program.pointLightingDiffuseColorUniform = gl.getUniformLocation(this.shader_program, "uPointLightingDiffuseColor");
  
};

Shader.prototype.get_shader = function(gl, id){
  var shaderScript = document.getElementById(id);
  
  if (!shaderScript) {
    return null;
  }
  
  var theSource = "";
  var currentChild = shaderScript.firstChild;
  
  while(currentChild) {
    if (currentChild.nodeType == 3) {
      theSource += currentChild.textContent;
    }
    
    currentChild = currentChild.nextSibling;
  }
  
  var shader;
  
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;  // Unknown shader type
  }
  
  gl.shaderSource(shader, theSource);
  
  gl.compileShader(shader);
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
    return null;
  }
  
  return shader;
};