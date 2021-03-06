/********************************** SIGNATURE *********************************\
|                                      ,,                                      |
|                     db             `7MM                                      |
|                    ;MM:              MM                                      |
|                   ,V^MM.    ,pP"Ybd  MMpMMMb.  .gP"Ya `7Mb,od8               |
|                  ,M  `MM    8I   `"  MM    MM ,M'   Yb  MM' "'               |
|                  AbmmmqMA   `YMMMa.  MM    MM 8M""""""  MM                   |
|                 A'     VML  L.   I8  MM    MM YM.    ,  MM                   |
|               .AMA.   .AMMA.M9mmmP'.JMML  JMML.`Mbmmd'.JMML.                 |
|                                                                              |
|                                                                              |
|                                  ,,    ,,                                    |
|                      .g8"""bgd `7MM    db        `7MM                        |
|                    .dP'     `M   MM                MM                        |
|                    dM'       `   MM  `7MM  ,p6"bo  MM  ,MP'                  |
|                    MM            MM    MM 6M'  OO  MM ;Y                     |
|                    MM.    `7MMF' MM    MM 8M       MM;Mm                     |
|                    `Mb.     MM   MM    MM YM.    , MM `Mb.                   |
|                      `"bmmmdPY .JMML..JMML.YMbmd'.JMML. YA.                  |
|                                                                              |
\******************************************************************************/
/*********************************** LICENSE **********************************\
| Copyright (c) 2013, Asher Glick                                              |
| All rights reserved.                                                         |
|                                                                              |
| Redistribution and use in source and binary forms, with or without           |
| modification, are permitted provided that the following conditions are met:  |
|                                                                              |
| * Redistributions of source code must retain the above copyright notice,     |
|   this list of conditions and the following disclaimer.                      |
| * Redistributions in binary form must reproduce the above copyright notice,  |
|   this list of conditions and the following disclaimer in the documentation  |
|   and/or other materials provided with the distribution.                     |
|                                                                              |
| THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"  |
| AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE    |
| IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE   |
| ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE    |
| LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR          |
| CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF         |
| SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS     |
| INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN      |
| CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)      |
| ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE   |
| POSSIBILITY OF SUCH DAMAGE.                                                  |
\******************************************************************************/

// "import" all of the required APIs
var tabs = require ("sdk/tabs");
var contextMenu = require("sdk/context-menu");
var data = require("sdk/self").data;
var dbhelper = require("dbhelper/dbinterface");
dbhelper.intilizeDatabase();

// keep track of all the workers that are active
var workers = [];
// Allow the current target domain to be saved temporarily
var target;
// Track which tab is being used
var currentTab = tabs[0].id; // make the current tab the starting tab
// Just in case track the tab that was last called on
var calledTab;

// Tab based content scripts
tabs.on('ready', function(tab) {
    var worker = tab.attach({
        contentScriptFile: data.url("insert-text.js"),
        // onAttach: function(worker) {
        //     console.log("Tab worker tab id" + worker.tab.id);
        // }
        onMessage: function(message) {
            console.log("GOT A MESSAGE" . message);
        }
    });

    worker.port.on("__passcod.es__target", function( _target ) {
        console.log("GOT TARGET: " + _target);
        target = _target;
        panel.show();

    });

    // When a worker detaches from a page due to a page change or reload
    // Free up the slot for that tab so another worker can bind to it
    worker.on('detach', function () {
        console.log("Worker detatched from " + tab.id);
        delete workers[tab.id];
        console.log("Worker detached");
        // detachWorker(this, workers);
    });

    workers[tab.id] = worker;

    console.log("Worker Tab ID / Tab ID: " + worker.tab.id + " / " + tab.id );
});

/************************************ PANEL ***********************************\
| Create a panel object that contains all the information that is needed to    |
| generate a password                                                          |
\******************************************************************************/
var panel = require("sdk/panel").Panel({
    width: 300,
    height: 300,
    contentScriptFile: [data.url("cryptojs-core.js"), data.url("cryptojs-sha256.js"), data.url("core.js"), data.url("popupScript.js")],
    contentURL: data.url("popup.html")
});

/********************************* PANEL SHOW *********************************\
| When the panel is shown send a messsage to the panel giving it the current   |
| target domain. This allows the panel to run scripts when it is shown that    |
| effect it's DOM                                                              |

|
| Pannel show reactes to the popup panel being displayed, it gets the rules for the target website from the database and passes them to the panel which does the password generation
\******************************************************************************/
var panelShown = false;
panel.on("show", function () {
    console.log("Getting rules for " + target);
    var bundle = dbhelper.getRule(target);

//function querySucess () {
    panel.port.emit("__passcod.es__showPanel",bundle);
    target = "";
    panelShown = true;
    console.log("requesting Show Panel");
});

/******************************** PANEL RESULT ********************************\
| When the panel returns a result from the user input the result is sent to    |
| the background content script and the panel is hidden until the next time    |
| it is called                                                                 |
\******************************************************************************/
panel.port.on("passcodes_result", function(result) {
    if (panelShown === true) {
        panelShown = false;
        console.log("Result");
        try {
            console.log("Text Received");
            workers[calledTab].port.emit("__passcod.es__setTarget", result);
            console.log("Text Set");
            panel.hide();
        }
        catch (err) {
            console.log("ERROR (result->setTarget): "+err);
        }
    }
});

/****************************** CONTEXT MENU ITEM *****************************\
| The context menu item addes a new option to the right click contenxt menu.   |
| The new item only appears over text boxes and when clicked sends a message   |
| to the content script to get the current domain, which then causes the       |
| passcodes prompt to apear                                                    |
\******************************************************************************/
var menuItem = contextMenu.Item({
    label: "Fill In Passcode Here",
    context: contextMenu.SelectorContext("input"),
    image: "http://passcod.es/favicon.ico",
    contentScript: 'self.on("click", function() {self.postMessage();});',
    onMessage: function (selectionText) {
        console.log("Caught Click");
        try {
            workers[currentTab].port.emit("__passcod.es__getTarget");
            calledTab = currentTab;
        }
        catch (err) {
            console.log("ERROR: Activating " + err);
        }
    }
});

/********************************* ACTIVE TAB *********************************\
| This function tracks wich tab the user is currently using in order to know   |
| which background script to send the messages to.                             |
\******************************************************************************/
tabs.on('activate', function(tab) {
    currentTab = tab.id;

});

/********************************** TAB CLOSE *********************************\
| This function removes a worker object from the tab-worker mapping if the     |
| tab is closed. This prevents working leaking memory from opening and closing |
| tabs continuously                                                            |
\******************************************************************************/
tabs.on('close', function(tab) {
    delete workers[tab.id];
});
