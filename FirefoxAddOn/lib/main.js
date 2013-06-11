var widgets = require ("sdk/widget");
var tabs = require ("sdk/tabs");

var contextMenu = require("sdk/context-menu");


var data = require("sdk/self").data;

var menuItem = contextMenu.Item({
	label: "Fill In Passcode Here",
	context: contextMenu.SelectorContext("input"),
	image: "http://passcod.es/favicon.ico",
	data: data.url("popupPage.html"),
	contentScriptFile: data.url("insert-text.js"),
	onMessage: function (selectionText) {
		console.log(selectionText);
	}
});