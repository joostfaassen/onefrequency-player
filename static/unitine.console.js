if (typeof unitine == 'undefined')			unitine = {};
if (typeof unitine.debug == 'undefined')	unitine.debug = {};

(function(){
	//this is a private static member that is only available in this closure
	var xgl = null;
	this.consolediv=null;

	//create a public static method for SomeClass
    /* Constructor */
    this.console = function() {
    };
	
	this.console.Init = function() {
		this.consolediv=document.getElementById("console");
		unitine.console.debug("Core", "Debugger initialized");
    };
	this.console.debug = function(source, text) {
		this.consolediv.innerHTML=this.consolediv.innerHTML+"<br />\n["  + source + "]: " + text;
		if (console) console.debug(source + ": " + text);
		this.consolediv.scrollTop=100000;
	};
}).call(unitine);

