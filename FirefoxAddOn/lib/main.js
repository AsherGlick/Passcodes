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


		worker.port.on("__passcod.es__target", function(target) {
			console.log("Got Target: "+target);

			var panel = require("sdk/panel").Panel({
				width: 300,
				height: 300,
				contentScriptFile: [data.url("sha256.js"), data.url("core.js"), data.url("popupScript.js")],
				contentURL: data.url("popup.html")
			});

			
			panel.on("show", function () {
				panel.port.emit("__passcod.es__showPanel",target);
			});
			panel.port.on("__passcod.es__result", function(result) {
				console.log("Finished Message: " + result);
				worker.port.emit("__passcod.es__setTarget", result);
				panel.hide();
			});
			panel.show();
		});



		var menuItem = contextMenu.Item({
			label: "Fill In Passcode Here",
			context: contextMenu.SelectorContext("input"),
			image: "http://passcod.es/favicon.ico",
			contentScript: 'self.on("click", function() {self.postMessage();});',
			onMessage: function (selectionText) {
				console.log("Caught Click");
				worker.port.emit("__passcod.es__getTarget");
			}
		});
	}
});


