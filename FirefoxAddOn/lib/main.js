var widgets = require ("sdk/widget");
var tabs = require ("sdk/tabs");

var contextMenu = require("sdk/context-menu");

var data = require("sdk/self").data;

var menuItem = contextMenu.Item({
	label: "Fill In Passcode Here",
	context: contextMenu.SelectorContext("input"),
	image: "http://passcod.es/favicon.ico",
	contentScriptFile: data.url("insert-text.js"),
	onMessage: function (selectionText) {
		console.log(selectionText);
	}
});


var widgets = require("sdk/widget");
var tabs = require("sdk/tabs");
 
var widget = widgets.Widget({
  id: "mozilla-link",
  label: "Mozilla website",
  contentURL: "http://passcod.es/favicon.ico",
  onClick: function() {
    tabs.activeTab.attach({
      contentScript:
        'document.body.style.border = "5px solid #F80";'
      })
    }
});