document.addEventListener('keydown', function(event) {
	if(WARS.keys_pressed.indexOf(event.keyCode) == -1){
		WARS.keys_pressed.push(event.keyCode);
	}
});

document.addEventListener('keyup', function(event) {
	WARS.keys_pressed.splice(WARS.keys_pressed.indexOf(event.keyCode), 1);
});

setInterval(function(){
	if(WARS.keys_pressed.indexOf(87) != -1) { // W
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
		alert(JSON.stringify(WARS.user.position) + " | " + JSON.stringify(WARS.user.rotation));
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
				WARS.mouse.left_down = true;
			}
			if(event.which == 3){ // Right mouse
				WARS.mouse.right_down = true;
			}
		})	
		.mousemove(function(event) {
			if(WARS.mouse.left_down){
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
			if(WARS.mouse.right_down){
				WARS.user.position.z -= (event.pageY - WARS.mouse.y);
				if(WARS.user.position.z > -WARS.constants.earth_radius-WARS.constants.zoom_offset){
					WARS.user.position.z = -WARS.constants.earth_radius-WARS.constants.zoom_offset;
				}
				if(WARS.user.position.z < -1000){
					WARS.user.position.z = -1000;
				}
			}
			WARS.mouse.x = event.pageX;
			WARS.mouse.y = event.pageY;
		})
		.bind('mousewheel DOMMouseScroll', function (event){
			var tmp_delta = parseInt(parseInt(event.originalEvent.wheelDelta)/4 || -parseInt(event.originalEvent.detail)*8);
			WARS.user.position.z += tmp_delta/4;
			if(WARS.user.position.z > -WARS.constants.earth_radius-WARS.constants.zoom_offset){
				WARS.user.position.z = -WARS.constants.earth_radius-WARS.constants.zoom_offset;
			}
			if(WARS.user.position.z < -1000){
				WARS.user.position.z = -1000;
			}
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