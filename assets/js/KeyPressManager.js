document.addEventListener('keydown', function(event) {
	if(WARS.keys_pressed.indexOf(event.keyCode) == -1){
		WARS.keys_pressed.push(event.keyCode);
	}
});

document.addEventListener('keyup', function(event) {
	WARS.keys_pressed.splice(WARS.keys_pressed.indexOf(event.keyCode), 1);
});

var test_pressed = false;
setInterval(function(){
	if(WARS.keys_pressed.indexOf(87) != -1) { // W
		test_pressed = true;
		// Go forwards
		if(WARS.user.free_mode){
			var tmp_angle = -WARS.user.rotation.y*WARS.constants.to_radians;
			WARS.user.position.x += Math.sin(tmp_angle);
			WARS.user.position.z += Math.cos(tmp_angle);
		}
    }
	if(WARS.keys_pressed.indexOf(83) != -1) { // S
        // Go backwards
		if(WARS.user.free_mode){
			var tmp_angle = -WARS.user.rotation.y*WARS.constants.to_radians;
			WARS.user.position.x -= Math.sin(tmp_angle);
			WARS.user.position.z -= Math.cos(tmp_angle);
		}
    }
	if(WARS.keys_pressed.indexOf(68) != -1) { // D
        // Rotate right
		if(WARS.user.free_mode){
			WARS.user.rotation.y++;
			while(WARS.user.rotation.y < 0){
				WARS.user.rotation.y += 360;
			}
			WARS.user.rotation.y %= 360;
		}
    }
	if(WARS.keys_pressed.indexOf(65) != -1) { // A
        // Rotate left
		if(WARS.user.free_mode){
			WARS.user.rotation.y--;
			while(WARS.user.rotation.y < 0){
				WARS.user.rotation.y += 360;
			}
			WARS.user.rotation.y %= 360;
		}
    }
	if(WARS.keys_pressed.indexOf(81) != -1) { // Q
		var fb = test_framebuffer.rttFramebuffer;
		if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE) {
			var pixels = new Uint8Array(4);
			gl.readPixels(1, 1, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
			alert(JSON.stringify(pixels));
			
			var inner_html = "<table>";
			
			for(var i=0; i<pixels.length/4; i+=4){
				if((i/4)%test_framebuffer.rttFramebuffer.width == 0){
					inner_html += '<tr>';
				}
				
				inner_html += '<td style="width:1px;height:1px;background-color:rgba('+pixels[i]+', '+pixels[i+1]+
						', '+pixels[i+2]+', '+pixels[i+3]+');"></td>';
				
				if((i/4)%test_framebuffer.rttFramebuffer.width == test_framebuffer.rttFramebuffer.width-1){
					inner_html += '</tr>';
				}
			}
			
			inner_html += "</table>";
			
			$("#test_image_table").html(inner_html);
		}
	
        // Go up
		if(WARS.user.free_mode){
			WARS.user.position.y++;
		}
    }
	if(WARS.keys_pressed.indexOf(90) != -1) { // Z
        // Go down
		if(WARS.user.free_mode){
			WARS.user.position.y--;
		}
    }
	if(WARS.keys_pressed.indexOf(38) != -1) { // Up Arrow
        // Go down
		if(WARS.user.free_mode){
			WARS.user.rotation.x--;
		}
    }
	if(WARS.keys_pressed.indexOf(40) != -1) { // Down Arrow
        // Go down
		if(WARS.user.free_mode){
			WARS.user.rotation.x++;
		}
    }
}, 60);

function init_mouse_controls(){
	$("#glcanvas")
		.mousedown(function (event){
			WARS.mouse.x = event.pageX;
			WARS.mouse.y = event.pageY;
			if(event.which == 1){ // Left mouse
				if(WARS.user.interpolation_percent == 0){
					WARS.mouse.left_down = true;
					$("#battle-info").hide('fade');
				}
			}
			if(event.which == 3){ // Right mouse
				WARS.mouse.right_down = true;
			}
		})	
		.mousemove(function(event) {
			if(WARS.mouse.left_down){
				mouse_pan(event);
			}
			if(WARS.mouse.right_down){
				mouse_zoom(-(event.pageY - WARS.mouse.y)/4);
			}
			WARS.mouse.x = event.pageX;
			WARS.mouse.y = event.pageY;
		})
		.bind('mousewheel DOMMouseScroll', function (event){
			var tmp_delta = parseInt(parseInt(event.originalEvent.wheelDelta)/4 || -parseInt(event.originalEvent.detail)*8);
			mouse_zoom(tmp_delta/40);
		});
		
	$("body")
		.mouseup(function (event){
			if(event.which == 1){ // Left mouse
				WARS.mouse.left_down = false;
			}
			if(event.which == 3){ // Right mouse
				WARS.mouse.right_down = false;
			}
		});
}

function mouse_pan(event){
	WARS.user.rotation.y += (event.pageX - WARS.mouse.x);
	WARS.user.rotation.x += (event.pageY - WARS.mouse.y)/2;
	while(WARS.user.rotation.y < 0){
		WARS.user.rotation.y += 360;
	}
	while(WARS.user.rotation.y > 360){
		WARS.user.rotation.y -= 360;
	}
	if(WARS.user.rotation.x > 90){
		WARS.user.rotation.x = 90;
	}
	if(WARS.user.rotation.x < -90){
		WARS.user.rotation.x = -90;
	}
}

function mouse_zoom(tmp_delta){
	WARS.user.position.z += tmp_delta;
	if(WARS.user.position.z > -WARS.constants.earth_radius-WARS.constants.zoom_offset){
		WARS.user.position.z = -WARS.constants.earth_radius-WARS.constants.zoom_offset;
	}
	if(WARS.user.position.z < 5-WARS.constants.background_image_radius){
		WARS.user.position.z = 5-WARS.constants.background_image_radius;
	}
}