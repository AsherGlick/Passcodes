self.on("click", function (node, data) {
	//self.postMessage(node.src);

	var text = "Hello There!";

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