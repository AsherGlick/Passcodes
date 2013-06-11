var __passcodes__target = null;
document.addEventListener("mousedown", function(event){
	console.log("HELLO!");
	// Check right click
	if(event.button == 2) {
		__passcodes__target = event.target;
	}
}, true);

/*
self.on("message", function(message) {
	var text = message;

	var txtarea = node;
	var scrollPos = txtarea.scrollTop;
	var strPos = 0;
	strPos = txtarea.selectionStart;

	var front = (txtarea.value).substring(0,strPos);
	var back = (txtarea.value).substring(strPos,txtarea.value.length);

	txtarea.value=front+text+back;
	strPos = strPos + text.length;

	txtarea.selectionStart = strPos;
	txtarea.selectionEnd = strPos;
	txtarea.focus();
	txtarea.scrollTop = scrollPos;
});
*/



self.port.on("getElements", function(tag) {
  var elements = document.getElementsByTagName(tag);
  for (var i = 0; i < elements.length; i++) {
    self.port.emit("gotElement", elements[i].innerHTML);
  }
  self.port.emit("gotElement", "DONE!");
});