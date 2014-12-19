
var { Cc, Ci } = require("chrome");

var listener = {
	onAcknowledge: function(aContext,aSize) {
		console.info("onAcknowledge");
	},
	onBinaryMessageAvailable: function(aContext, aMsg) {
		console.info("onBinaryMessageAvailable");
	},
	onMessageAvailable: function(aContext, aMsg) {
		console.info("onMessageAvailable");
	},
	onServerClose: function(aContext, aCode, aReason) {
		console.info("onServerClose");
	},
	onStart: function(aContext) {
		console.info("onStart");
	},
	onStop(aContext, aStatusCode) {
		console.info("onStop");
	}
}
var ioService = Cc["@mozilla.org/network/io-service;1"].
		getService(Ci.nsIIOService);

exports.start = function(opts) {
	console.log("FAPush start");
	opts=opts || {};
	var options = {
		serverUrl: "wss://push.services.mozilla.com",
	}
	for(var f in opts) 
		if(opts.hasOwnProperty(f))
			options[f] = opts[f];
	  var chan = Cc["@mozilla.org/network/protocol;1?name=ws"].
	    createInstance(Components.interfaces.nsIWebSocketChannel);
	  var uri = ioService.newURI(options.serverUrl, null, null);
	  chan.asyncOpen(uri, options.serverUrl, listener, null);
}

