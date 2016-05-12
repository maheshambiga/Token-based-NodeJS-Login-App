"use strict";

var WebServer = require("./server.js");
var config = require("./config");

(function() {
			var ws = new WebServer(config);

				ws.start();
}());
