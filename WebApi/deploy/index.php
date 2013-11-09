<?php

function log_exec($command) {
    $timestamp = "[" . date("Y-m-d H:i:s") . "]";

    // Redirect STDERR to STDOUT for all the commands
    $command = $command . " 2>&1";

    // initilize variables for exec function
    $output = array();
    $return_var = 999;

    // Execute the command given
    $data = exec($command, $output, $return_var);

    // Report all the results to the log file
    file_put_contents("update_history.log", $timestamp . ' [COMMAND] ' . $command . "\n", FILE_APPEND );

    foreach ($output as $stdoutLine) {
        file_put_contents("update_history.log", $timestamp . ' [STDOUT] ' . $stdoutLine . "\n", FILE_APPEND );
    }
    file_put_contents("update_history.log", $timestamp . ' [RETURNCODE] ' . $return_var . "\n", FILE_APPEND );  

    return $return_var;
}


/********************************* LOG MESSAGE ********************************\
| This function takes a message and adds it to the log file stored on the      |
| server. This allows for access to the server to be monitored and debugged    |
| if there are any problems.                                                   |
\******************************************************************************/
function log_message($text) {
    $timestamp = "[" . date("Y-m-d H:i:s") . "]";
    file_put_contents ( "update_history.log" , $timestamp . ' [LOG] ' . $text, FILE_APPEND );
    file_put_contents ( "update_history.log" , "\n", FILE_APPEND );
}



/************************************ MAIN ************************************\
| The main function authenticates the user. If they are authenticated then     |
| the server automaticly pulls new data from github to update the main page    |
\******************************************************************************/
$inifile = parse_ini_file("./.passwords.ini");
$correctUsername = $inifile["username"];
$correctPasswordHash = $inifile["passwordhash"];
$passwordSalt = $inifile["salt"];

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


// Hash password


if (is_null($username) || is_null($password) || $password == "") {

    header('WWW-Authenticate: Basic realm="My Realm"');
    header('HTTP/1.0 401 Unauthorized');
    echo 'Text to send if user hits Cancel button';
    log_message("Loginless Access");
    die();

} else {

    $iterationCount = 100000;

    $newPasswordHash = $password . $salt;
    // iterate for one less then the iteration count
    for ($i=1; $i<$iterationCount; $i++) {
        $newPasswordHash = hash ("sha256", $newPasswordHash, true);
    }
    $newPasswordHash = hash("sha256", $newPasswordHash);

    if ($newPasswordHash == $correctPasswordHash && $username == $correctUsername) {
        echo "<p>Hello {$username}.</p>";
        echo "<p>You entered the correct password</p>";

        // pull new data from github
        // update the webserver (ghpages) branch
        // there might be two deploy branches


        // Git pull 
        log_message("Accessed by $username ");
        log_exec('git --version');
        if (log_exec("cd ../../passcod.es/dev2/; git pull origin gh-pages") == 128) {
            log_message("Git Repo not initilized, creating repo");
            log_exec("cd ../../passcod.es/dev2/; git clone -b gh-pages https://github.com/AsherGlick/Passcodes.git .");
        }

        foreach ($_POST as $key => $value) {
            log_message($key . " ==> " . $value);
        }
    }
    else {
        header('WWW-Authenticate: Basic realm="My Realm"');
        header('HTTP/1.0 401 Unauthorized');
        echo 'Text to send if user hits Cancel button';
        log_message("Incorrect Login");
        die();
    }

    // echo "<code>";
    // echo nl2br(file_get_contents("update_history.log"));
    // echo "</code>";
}
?>
