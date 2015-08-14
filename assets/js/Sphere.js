function Sphere(rad, lat, lon){
	this.rad = rad;
	this.lat = lat;
	this.lon = lon;
	
	this.load_vertices();
	this.init_buffers();	
};

Sphere.prototype = new GraphicsObject();

Sphere.prototype.load_vertices = function(){
    var tmp_vertices = [];
    var tmp_normals = [];
    var tmp_textures = [];
    var tmp_indices = [];
    for (var latNumber = 0; latNumber <= this.lat; latNumber++) {
        var lat_delta = latNumber / this.lat;
        var theta = lat_delta * Math.PI;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);
        for (var longNumber = 0; longNumber <= this.lon; longNumber++) {
           var lon_delta = longNumber / this.lon;
           var phi = lon_delta * Math.PI * 2;
           var sinPhi = Math.sin(phi);
           var cosPhi = Math.cos(phi);
           var x = cosPhi * sinTheta;
           var y = cosTheta;
           var z = sinPhi * sinTheta;
           var u = 1 - lon_delta;
           var v = lat_delta;
           tmp_normals.push(x);
           tmp_normals.push(y);
           tmp_normals.push(z);
           tmp_textures.push(u);
           tmp_textures.push(v);
           tmp_vertices.push(this.rad * x);
           tmp_vertices.push(this.rad * y);
           tmp_vertices.push(this.rad * z);

           if(latNumber < this.lat && longNumber < this.lon){
              var first = (latNumber * (this.lon + 1)) + longNumber;
              var second = first + this.lon + 1;
              tmp_indices.push(first);
              tmp_indices.push(second);
              tmp_indices.push(first + 1);
              tmp_indices.push(second);
              tmp_indices.push(second + 1);
              tmp_indices.push(first + 1);
           }
        }
    }

    this.v = tmp_vertices;
    //this.vertexNormals = tmp_normals;
    this.vt = tmp_textures;
    this.vertex_indices = tmp_indices;
};