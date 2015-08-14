function AudioManager(src){
	var audio_hidden = new Audio(src);
	var context = new AudioContext();

	var audioElement = audio_hidden;
	var mediaSourceNode = context.createMediaElementSource(audioElement);

	var self = this;
	this.analyser = context.createAnalyser();
	mediaSourceNode.connect(self.analyser);
	this.analyser.connect(context.destination);

	this.analyser.fftSize = 32;
	var bufferLength = this.analyser.frequencyBinCount;
	this.dataArray = new Float32Array(bufferLength);

	audioElement.play();
	audioElement.volume=0.001;

	this.prev_data = {};
	this.prev_data.left   = 0;
	this.prev_data.middle = 0;
	this.prev_data.right  = 0;
	this.prev_data.channels = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

	var audio_audible = new Audio(src);
	var audioElement2 = audio_audible;
	var self = this;
	setTimeout(function(){audioElement2.play();self.analyze();}, TTR.constants.audio_delay);
}

AudioManager.prototype.analyze = function(){

		TTR.now = (new Date()).getTime();
	
		var self = this;
		
		self.analyser.getFloatFrequencyData(this.dataArray);
		var tmp_html = "";
		var curr_data = {};
		curr_data.left   = 0;
		curr_data.middle = 0;
		curr_data.right  = 0;
		curr_data.channels = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		Object.keys(self.dataArray).forEach(function(d){
			var index = parseInt(d);
			var val = Math.max((self.dataArray[d] + 200)*2/3, 0).toFixed(0);
			curr_data.channels[index] = val;
			//tmp_html += "<div class='audio-line'><div class='audio-bar' style='width:"+val+"%;'>"+d+": "+val+"</div></div>";
		});
		
		
		curr_data.channels.forEach(function(channel, index){
			if(index > 7){
				curr_data.left += channel-self.prev_data.channels[index];
			}
			else if(index > 4){
				curr_data.middle += channel-self.prev_data.channels[index];
			}
			else{
				curr_data.right+= channel-self.prev_data.channels[index];
			}
			if(curr_data.channels[0] > 0){
				var val = (100 * (channel / curr_data.channels[0])).toFixed(0);
				tmp_html += "<div class='audio-line'><div class='audio-bar' style='width:"+val+"%;'>"+index+": "+val+"</div></div>";
			}
		});
		/*
		if(curr_data.left > 15){
			test_track.add_note(new Note());
		}
		if(curr_data.middle > 12){
			test_track_2.add_note(new Note());
		}
		if(Math.abs(curr_data.right) > 10){
			test_track_3.add_note(new Note());
		}*/
		test_track.add_note(new Note());
		
		self.prev_data.channels = curr_data.channels;
		
		$('#audio-content').html(tmp_html);
		
		var now = new Date();
		var tmp_offset = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 
					now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds()+5) - now;
		
		setTimeout(function(){self.analyze();}, tmp_offset);
};

var now = new Date();
var tmp_offset = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds()+1, 0) - now;

setTimeout(function(){new AudioManager("./assets/audio/in_paris.mp3");}, tmp_offset);