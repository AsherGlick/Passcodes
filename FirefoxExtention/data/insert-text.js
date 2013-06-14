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
// This code is injected into every webpage that is opened

/*************************** TARGET ELEMENT LISTENER **************************\
| This listsner checks for every right click (context menu opening click) on   |
| the page and saves the element that was last clicked as the target for       |
| passcodes                                                                    |
\******************************************************************************/
var __passcodes__target = null;
document.addEventListener("mousedown", function(event){
    // Check right click
    if(event.button == 2) {
        __passcodes__target = event.target;
    }
}, true);

/****************************** REMOVE SUBDOMAIN ******************************\
| This function grabs the full url from the current window and strips it down  |
| removing all but the actual name of the domain. For example:                 |
| "mail.google.com" would be stipped down to "google"                          |
\******************************************************************************/
function removeSubdomain () {
    var url = document.URL;
    var splitSlashes = url.split('/');
    if (splitSlashes.length > 1) url = splitSlashes[2];
    var domainParts = url.split('.');
    var domain = url;
    if (domainParts.length > 1) {
        domain = domainParts[domainParts.length-2];
        //alert (domain);
        if (domain == 'co') {
            domain = domainParts[domainParts.length-3];
        }
    }
    return domain.toLowerCase();
}

/********************************* GET TARGET *********************************\
| When the context script recives a message to get the current target domain   |
| a message is sent back containing the domain name                            |
\******************************************************************************/
self.port.on("__passcod.es__getTarget", function() {
    self.port.emit("__passcod.es__target", removeSubdomain());
});


/********************************* SET TARGET *********************************\
| When the context script receives a message to set teh target, it takes the   |
| value that was passed with the request and inserts it into the target text   |
| box.                                                                         |
\******************************************************************************/
self.port.on("__passcod.es__setTarget", function(password) {
    var text = password;

    // Insert text into previously saved text box
    var txtarea = __passcodes__target;
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
