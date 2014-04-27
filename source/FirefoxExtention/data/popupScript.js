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

/****************************** PASSWORD COMPLETE *****************************\
| This listens for when the user submits the password form, by hitting enter   |
| or clicking the submit button. When they do it generates the password        |
| function from the core.js file, which grabs the username and password from   |
| the text boxes. Then sends the generated password to the tab that called     |
| this popup to have it insert into the page                                   |
\******************************************************************************/

document.getElementById('form').onsubmit = function() {
    try {
        var password = generatePassword();

        // This for loop is a huge hack for an unknown bug causing messages to be
        // dropped on the floor when emitted from a pannel. So far it seems that
        // these issues only arrise from this particular connection. After much
        // testing it was found that a message will not allways get dropped if
        // the one before it was so the quick and dirty solution was to send the
        // message multiple times.
        for (var i = 0; i < 100; i++) {
            self.port.emit("passcodes_result", password);
        }
        rules = {};
    }
    catch (err) {
        console.error("Popup Script: ERROR: "+err);
    }
};

/********************************* SHOW PANNEL ********************************\
| This functions waits for a message from the background script saying that    |
| the pannel has been displayed. When it recieves the message it checks to     |
| see if a domain name was given with the message. If there was then the       |
| domain is filled into the domain box and the password box is focused. If     |
| there was not, both field are left blank and the domain box is focused       |
\******************************************************************************/
self.port.on("__passcod.es__showPanel", function (domain) {
    if (domain == "") {
        document.getElementById("website").focus();
    }
    else {
        document.getElementById("website").value = domain;
        document.getElementById("masterPassword").focus();
    }
});
