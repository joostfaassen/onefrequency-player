if (typeof onefrequency == 'undefined')		onefrequency = {};

(function(){
	//this is a private static member that is only available in this closure
	var mypriv = null;
	this.mytext="qweqwe";

    /* Constructor */
    this.player = function(audio) {
    };

    
    /* The Audio Element */
    this.audio = null;
    this.fademode="none";
    this.mastervolume=0;
    this.fadevolume=0;
    this.fadeinspeed=1000;
    this.fadeoutspeed=10000;
    this.fadestartstamp=0;

    this.GetTimestamp = function() {
    	stamp = Math.round(((new Date()).getTime()-Date.UTC(1970,0,1)));
    	return stamp;
    }
    this.player.KeyUp = function(event) {
		unitine.console.debug('key', 'keydown: ' + event.keyCode); 
		unitine.console.debug('key', 'meta: ' + event.metaKey); 
		if (event.shiftKey) {
			switch(event.keyCode) {
			case 73: // I
				onefrequency.player.FadeIn();
				break;
			case 79: // O
				onefrequency.player.FadeOut()
				break;
			default:
				break;
			}
			if ((event.keyCode>=49) && (event.keyCode<59)) {
				var e=$("#slots li").get(event.keyCode-49);
				onefrequency.player.StartTrack(e);
			}
		}
		
  	
    }

    this.player.Init = function(audio) {
		unitine.console.debug("Connectivity", navigator.onLine ? "online" : "offline");

    	unitine.console.debug("Player", "Initialized " + audio);
    	this.audio=audio;
    	window.setInterval(function() {
    	    //unitine.console.debug("timer", "tick" + onefrequency.fademode);
    		onefrequency.player.DoFade();
    	}, 10);
    	$(document).keyup(function(event) {
    		onefrequency.player.KeyUp(event);
		});
    	onefrequency.player.LoadData();

		$("#slot-save").click(function() {
			$.each(onefrequency.player.data.slot,function() {
				var slot=this;
				if (slot.id==$("#slot-index").get(0).value) {
					slot.name=$("#slot-track").get(0).value;
					slot.volume=$("#slot-volume").get(0).value;
					//slot.title=$("#slot-title").get(0).value;
					//alert(slot.name);
				}
			});			
			$("#edit-dialog").dialog("close");
			onefrequency.player.SaveData();
			onefrequency.player.RenderTrackList();
		});
		
		if(navigator.onLine) {
			$.ajaxSetup({cache: false}); 
			$.get('tracklist.php',function(json) {
				//alert(JSON.stringify(onefrequency.player.data.track));
				//alert("ok"+json);
				onefrequency.player.data.track=eval(json);
				onefrequency.player.SaveData();
				onefrequency.player.RenderTrackList();
			});
		}
    };
    this.player.SetVolume = function(time) {
    	var volume=time;
//    	volume=(time*time*time*time*time*time*time)/1000000000000;
    	for(i=0;i<3;i++) {
    		volume=(volume*volume)/100;
    	}
//		volume=Math.round(volume);

    	if (volume<0) volume=0;
    	if (volume>100) volume=100;
    	volume=volume/100*onefrequency.player.mastervolume;

    	$("#mastervolume").get(0).style.width=volume + "%";
		this.audio.volume=volume/100;
   	    unitine.console.debug("volume", "volume=" + Math.round(volume*10) + " (" + onefrequency.player.mastervolume + ")");

    }
    this.player.VolumeUp = function() {
    	onefrequency.player.mastervolume+=5;
    	if (onefrequency.player.mastervolume>100) onefrequency.player.mastervolume=100;
    	onefrequency.player.SetVolume(100);
    }
    this.player.VolumeDown = function() {
    	onefrequency.player.mastervolume-=5;
    	if (onefrequency.player.mastervolume<0) onefrequency.player.mastervolume=0;
    	onefrequency.player.SetVolume(100);
    }
    
    this.player.DoFade = function() {
    	var now=onefrequency.GetTimestamp();
    	//unitine.console.debug("fade", now-onefrequency.fadestartstamp);

    	if(onefrequency.fademode=="in") {
	    	if (onefrequency.fadevolume<100) {
    			onefrequency.fadevolume=100/onefrequency.fadeinspeed*(now-onefrequency.fadestartstamp);
    		} else {
    			onefrequency.fadevolume=100;
    			onefrequency.fademode="";	    			
    		}
	    	onefrequency.player.SetVolume(onefrequency.fadevolume);
	    }
    	if(onefrequency.fademode=="out") {
	    	if (onefrequency.fadevolume>0) {
    			onefrequency.fadevolume=100-(100/onefrequency.fadeoutspeed*(now-onefrequency.fadestartstamp));
    		} else {
    			onefrequency.fadevolume=0;
    			onefrequency.fademode="";	    			
    		}
	    	onefrequency.player.SetVolume(onefrequency.fadevolume);
	    }

    }
    this.data=null;
	this.player.LoadData = function() {
		
		onefrequency.player.data=JSON.parse(window.localStorage.getItem("data"));
		//alert("localstorage data: " + onefrequency.player.data);

		if (onefrequency.player.data) {
			if (onefrequency.player.data.slot.length<10) {
				onefrequency.player.data=null;
			}

		}
		if (onefrequency.player.data) {
			unitine.console.debug("Player", "Loaded data from local storage");

		} else {
			unitine.console.debug("Player", "Loading data from template");
			onefrequency.player.data=datatemplate;
			onefrequency.player.SaveData();
		}
		$.each(onefrequency.player.data.slot,function() {
			if (!this.volume) this.volume=100;
		});
		
		
		onefrequency.player.RenderTrackList();
	}
	
	this.player.SaveData = function() {
		unitine.console.debug("Player", "Saving data to local storage");
		//alert(JSON.stringify(onefrequency.player.data));
		window.localStorage.setItem("data",JSON.stringify(onefrequency.player.data));
	}
	
	this.player.RenderTrackList = function() {
		unitine.console.debug("Player", "Render tracklist and slots");
		//alert("tracklist: " + onefrequency.player.data);
		$('ul#tracklist').get(0).innerHTML="";
		$('#slot-track').get(0).innerHTML="";

		var html="";
		html+="<option value=''>--- none ---</option>\n";
		$('#slot-track').append($(html));
	
		$.each(onefrequency.player.data.track,function() {
			//alert("JSON Data: " + this.name);
			$('ul#tracklist').append($("<li data-filename='" + this.name + "'>" +this.name +"</li>"));
			var html="";
			html+="<option value='" + this.name + "'>"+this.name + "</option>\n";
			$('#slot-track').append($(html));
		});
		
		$("ul#tracklist li").click(function() {
			onefrequency.player.StartTrack(this);
		});

		$('ul#slots').get(0).innerHTML="";
		
		var i=1;
		$.each(onefrequency.player.data.slot,function() {
			//alert("JSON Data: " + this.name);
			//this.volume=75;
			var html="<li data-volume='" + this.volume + "' data-filename='" + this.name + "' data-index='" + i + "'";
			if (!this.name) html+=" class='empty'";
			html+=">";
			html+="<div class='index ui-state-default ui-corner-all'>" + i +"</div>";
			html+="<div class='edit ui-state-default ui-corner-all'><span class='ui-icon ui-icon-pencil'></span></div>";
			html+="<div class='play ui-state-default ui-corner-all'><span class='ui-icon ui-icon-play'></span></div>";
			if (this.name) {
				html+="<div class='details'><h1>"+this.name+"</h1><span class='info'>volume: " + this.volume + "</span></div>";
			} else {
				html+="<div class='details'><h1>--- empty ---</h1></div>";
			}

			html+="</li>";
			$('ul#slots').append($(html));
			i++;
		});

		
		$("ul#slots li div.play").click(function() {
			onefrequency.player.StartTrack(this.parentNode);
		});
		$("ul#slots li div.edit").click(function() {
			onefrequency.player.EditSlot(this.parentNode);
		});
	};
	
	this.player.EditSlot = function(e) {
		//alert("edit slot " + $(e).data("index"));
		$("#slot-index").get(0).value=$(e).data("index");
		//$("#slot-title").get(0).value=$(e).data("filename");
		$("#slot-track").get(0).value=$(e).data("filename");
		$("#slot-volume").get(0).value=$(e).data("volume");
		$("#edit-dialog").dialog({
			height: 240,
			width: 400,
			modal: true
		});
	}
	this.player.StartTrack = function(e) {
		//alert("yay" + $(e).data("filename"));
    	unitine.console.debug("Player", "Start track: " + $(e).data("filename"));

		var player=$('audio#player').get(0);
		player.setAttribute('src',"music/" + $(e).data("filename"));
//		player.setAttribute('src',"/var/www/onefrequency-player/music/" + $(e).data("filename"));
		player.load();
		
		onefrequency.player.mastervolume=$(e).data("volume");
		if (!onefrequency.player.mastervolume) onefrequency.player.mastervolume=100;
		onefrequency.player.FadeIn();
		//player.currentTime=0;
		player.play();
		player.addEventListener("load", function() {
			//alert("asdadasd");
			//var player=$('audio#player').get(0);
			player.currentTime=0;
			player.play();
		},true);
	}
	this.player.Play = function() {
		this.audio.currentTime=0;
		this.audio.play();
	}
	this.player.FadeIn = function() {
		onefrequency.fademode="in";
		onefrequency.fadevolume=0;
		onefrequency.fadestartstamp=onefrequency.GetTimestamp();
	}
	this.player.FadeOut = function() {
		onefrequency.fademode="out";
		onefrequency.fadevolume=100;
		onefrequency.fadestartstamp=onefrequency.GetTimestamp();
	}
	
	this.player.Stop = function() {
    	unitine.console.debug("Player", "Stop track");

		this.audio.pause();
		this.audio.currentTime=0;
	}

	this.player.AddTrack = function(name) {
		unitine.console.debug("addtrack", name);
		var track={"name": name};
		onefrequency.player.data.track.push(track);
		onefrequency.player.RenderTrackList();
		onefrequency.player.SaveData();
	}
	
}).call(onefrequency);


$(document).ready(function() {
	unitine.console.Init();
	onefrequency.player.Init($('audio#player').get(0));	
});
