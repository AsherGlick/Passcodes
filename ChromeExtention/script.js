/************************************ ABOUT ***********************************\
| This script is the background script. It handles the context menu item       |
| being clicked and a single message interface returning the tab that last     |
| opened the passcodes application.                                            |
\******************************************************************************/
var mostRecentActiveTab = null;

// Regester the start Passcodes function as a context menu item
var passwordGenerator = chrome.contextMenus.create({"title":"Fill In Passcode Here", "contexts":["editable"],"onclick":startPasscodes});

/******************************* START PASSCODES ******************************\
| This function is run when the context menu item is clicked. It saves the ID  |
| of the tab that the context menu was clicked in and then opens a new popup   |
| window containing the passcod.es interface for the user to type in their     |
| master password                                                              |
\******************************************************************************/
function startPasscodes(info, tab) {
    // Save the Tab that the context menu was clicked on
    mostRecentActiveTab = tab.id;
    // Define the size and position of the new popup window
    var w = 440;
    var h = 420;
    var left = (screen.width/2)-(w/2);
    var top =(screen.height/2)-(h/2); 
    // Create the popup
    var newpopup = chrome.windows.create({'url': 'popup.html','focused':true ,'type': 'popup', 'width': w, 'height': h, 'left': left, 'top': top} , function(window) {});

    // Debug logging
    console.log(newpopup);
}

/******************************** RETURN TAB ID *******************************\
| This function is a listener for when the popup requests the ID of the tab    |
| that opened it. This function returns the ID of the last tab that was        |
| opened and then erases the value so that if it is called again it will not   |
| return the same tab twice without the tab openeing the menu twice            |
\******************************************************************************/
chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.request == "tabid") {
            console.log(mostRecentActiveTab);
            sendResponse(mostRecentActiveTab);
            mostRecentActiveTab = null;
        }
    }
);