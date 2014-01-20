<?

$inifile = parse_ini_file("./.database.ini");
// [Database Configuration]
// url = <database.url.com>
// username = <username>
// password = <password>

// [Database Lists]
// database = <databasename>
// rulesTable = <tablename>
// userTable = <tablename>

$mysqli = new mysqli($inifile['url'], $inifile['username'], $inifile['password'], $inifile['database']) ;

/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

$sql = "CREATE TABLE IF NOT EXISTS betarules (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `rawdomain` varchar(100) NOT NULL,
  `domain` varchar(100) NOT NULL,
  `creationdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdby` varchar(100) NOT NULL DEFAULT 'Anonymous',
  `minlength` int(9) NOT NULL DEFAULT 0,
  `maxlength` int(9) NOT NULL DEFAULT 16,
  `restrictedcharacters` varchar(95) NOT NULL DEFAULT '',
  `numbersrequired` int(9) NOT NULL DEFAULT 0,
  `lowercaserequired` int(9) NOT NULL DEFAULT 0,
  `uppercaserequired` int(9) NOT NULL DEFAULT 0,
  `symbolsrequired` int(9) NOT NULL DEFAULT 0,
  `additionalregex` varchar(100) NOT NULL DEFAULT '',
  `regex` varchar(200) NOT NULL DEFAULT '.*',
  `parent` varchar(100) 
);";


# build and execute the sql query
$result = $mysqli->query($sql) or die("Unable to select: " . $mysqli->error );

echo $result;


?>