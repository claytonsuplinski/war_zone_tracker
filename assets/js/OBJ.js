function OBJ(filename, texture){

        this.filename = filename;
		this.texture = texture;

        this.load_vertices();
};

OBJ.prototype = new GraphicsObject();

OBJ.prototype.load_vertices = function (){

	var self = this;

        $.ajax({
            url: this.filename,
            dataType: "text",
            async: true,
            success: function (data){

        	var tmp_vertices = [];
	        var tmp_vertexNormals = [];
        	var tmp_textureCoordinates = [];
	        var tmp_VertexIndices = [];

                var verts = [];
                var textures = [];
                var norms = [];
                var faces = [];

                var lines = data.split("\n");
                var tmp_alert = "";
                lines.forEach(function (line){
                        if(line.length > 0){
                                if(line[0] == "v"){
                                        if(line[1] == "n"){
                                                var tmp = line.split(" ");
                                                if(tmp.length > 4){
                                                        norms.push(parseFloat(tmp[2]));
                                                        norms.push(parseFloat(tmp[3]));
                                                        norms.push(parseFloat(tmp[4]));
                                                }
                                        }
                                        else if(line[1] == "t"){
                                                var tmp = line.split(" ");
                                                if(tmp.length > 2){
                                                        textures.push(parseFloat(tmp[1]));
                                                        textures.push(parseFloat(tmp[2]));
                                                }
                                        }
                                        else if(line[1] == " "){
                                                var tmp = line.split(" ");
                                                if(tmp.length > 4){
                                                        verts.push(parseFloat(tmp[2]));
                                                        verts.push(parseFloat(tmp[3]));
                                                        verts.push(parseFloat(tmp[4]));
                                                }
                                        }
                                }
                                else if(line[0] == "f"){
                                        var tmp = line.split(" ");
                                        if(tmp.length > 3){
                                                faces.push(tmp[1]);
                                                faces.push(tmp[2]);
                                                faces.push(tmp[3]);
                                        }
                                }
                        }
                });
                for(var i=0; i<faces.length; i++){
                        tmp_VertexIndices.push(i);

                        var face = faces[i].split("/");
                        for(var j=0; j<face.length; j++){
                                face[i] = parseInt(face[i]);
                        }

                        if(face.length > 2){
                                var v3 = 3*face[0];
                                var tmp_v_1 = v3-3;
                                var tmp_v_2 = v3-2;
                                var tmp_v_3 = v3-1;

                                var vt2 = 2*face[1];
                                var tmp_vt_1 = vt2-2;
                                var tmp_vt_2 = vt2-1;

                                if(verts.length > tmp_v_1 && textures.length > tmp_vt_1){

                                        tmp_vertices.push(verts[tmp_v_1]);
                                        tmp_vertices.push(verts[tmp_v_2]);
                                        tmp_vertices.push(verts[tmp_v_3]);

                                        tmp_textureCoordinates.push(textures[tmp_vt_1]);
                                        tmp_textureCoordinates.push(1 - textures[tmp_vt_2]);

                                        tmp_vertexNormals.push(1);
                                        tmp_vertexNormals.push(1);
                                        tmp_vertexNormals.push(1);
                                }
                        }
                }

				self.v = tmp_vertices;
				self.vt = tmp_textureCoordinates;
				self.vn = tmp_vertexNormals;
				self.vertex_indices = tmp_VertexIndices;
				
				self.init_buffers();
				self.set_texture(self.texture);
            }
        });

};

