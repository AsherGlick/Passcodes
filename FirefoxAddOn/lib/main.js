var widgets = require ("sdk/widget");
var tabs = require ("sdk/tabs");

var contextMenu = require("sdk/context-menu");


var data = require("sdk/self").data;






var tag = "p";
var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");

var workers = [];
var target;

pageMod.PageMod({
	include: ["*"],
	contentScriptFile: data.url("insert-text.js"),
	onAttach: function(worker) {
		console.log("Attached");


		worker.port.on("__passcod.es__target", function(_target) {
			target = _target;
			console.log("Got Target: "+target);
			panel.show();
		});


		workers[worker.tab.id] = worker;
		console.log("Number of Workers: "+ Object.keys(workers).length);
	}
});


var panel = require("sdk/panel").Panel({
				width: 300,
				height: 300,
				contentScriptFile: [data.url("sha256.js"), data.url("core.js"), data.url("popupScript.js")],
				contentURL: data.url("popup.html"),
			});

			
			panel.on("show", function () {
				panel.port.emit("__passcod.es__showPanel",target);
				target = "";
			});
			panel.port.on("__passcod.es__result", function(result) {
				console.log("Finished Message: " + result);
				workers[calledTab].port.emit("__passcod.es__setTarget", result);
				panel.hide();
			});


var menuItem = contextMenu.Item({
	label: "Fill In Passcode Here",
	context: contextMenu.SelectorContext("input"),
	image: "http://passcod.es/favicon.ico",
	contentScript: 'self.on("click", function() {self.postMessage();});',
	onMessage: function (selectionText) {
		console.log("Caught Click");
		workers[currentTab].port.emit("__passcod.es__getTarget");
		calledTab = currentTab;
	}
});

// Track which tab is being used
var currentTab = tabs[0].id; // make the current tab the starting tab
// Just in case track the tab that was last called on
var calledTab;

var tabs = require("sdk/tabs");
tabs.on('activate', function(tab) {
	console.log(tab.id + ":" + tab.url);
	currentTab = tab.id;

});

tabs.on('close', function(tab) {
	delete workers[tab.id];
});