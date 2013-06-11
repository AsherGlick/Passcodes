var widgets = require ("sdk/widget");
var tabs = require ("sdk/tabs");

var contextMenu = require("sdk/context-menu");


var data = require("sdk/self").data;






var tag = "p";
var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");

pageMod.PageMod({
	include: ["*"],
	contentScriptFile: data.url("insert-text.js"),
	onAttach: function(worker) {
		console.log("Attached");
		worker.port.emit("getElements", tag);
		worker.port.on("gotElement", function(elementContent) {
			console.log(elementContent);
		});

		worker.port.on("clicked", function () {
			console.log("GOT A CLICK");
		});


		var menuItem = contextMenu.Item({
		label: "Fill In Passcode Here",
		context: contextMenu.SelectorContext("input"),
		image: "http://passcod.es/favicon.ico",
		onMessage: function (selectionText) {
			worker.port.emit("getSelectedNode");
		}
	});
	}
});


