<?php

$username = null;
$password = null;

// mod_php
if (isset($_SERVER['PHP_AUTH_USER'])) {
    $username = $_SERVER['PHP_AUTH_USER'];
    $password = $_SERVER['PHP_AUTH_PW'];

// most other servers
} elseif (isset($_SERVER['HTTP_AUTHENTICATION'])) {

        if (strpos(strtolower($_SERVER['HTTP_AUTHENTICATION']),'basic')===0)
          list($username,$password) = explode(':',base64_decode(substr($_SERVER['HTTP_AUTHORIZATION'], 6)));

}

if (is_null($username)) {

    header('WWW-Authenticate: Basic realm="My Realm"');
    header('HTTP/1.0 401 Unauthorized');
    echo 'Text to send if user hits Cancel button';
    echo phpinfo();

    die();

} else {
    echo "<p>Hello {$username}.</p>";
    echo "<p>You entered {$password} as your password.</p>";

    # pull new data from github
    # update the webserver (ghpages) branch
    # there might be two deploy branches
}

?>