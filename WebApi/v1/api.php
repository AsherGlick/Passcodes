<?
header('Content-Type: application/json; charset=utf-8'); // feels hacky just changing this one line of the header (maybe not)

$inifile = parse_ini_file("./database.ini");
// [Database Configuration]
// url = <database.url.com>
// username = <username>
// password = <password>

// [Database Lists]
// database = <databasename>
// rulesTable = <tablename>
// userTable = <tablename>

$request = $_GET["request"];

$request = explode("/", $request);
if ($request[0] == 'domain') {
	getRules($request[1], $inifile);
}


function getRules ($domain, $inifile) {
	$mysqli = new mysqli($inifile['url'], $inifile['username'], $inifile['password'], $inifile['database']) ;
	// mysql_select_db($inifile['database']) or die("Unable to select database");

	/* check connection */
	if (mysqli_connect_errno()) {
	    printf("Connect failed: %s\n", mysqli_connect_error());
	    exit();
	}

	// $domain = $mysqli->real_escape_string($domain);

	// $sql = "SELECT * from " . $inifile['rulesTable'] . " WHERE (name, version) IN (SELECT name, MAX(version) FROM rules WHERE name = '" . $domain . "' GROUP BY name)";
	$sql = "SELECT * from rules";// . $inifile['rulesTable'];
	print $sql . "\n";


	$result = $mysqli->query($sql) or die("Unable to select: " . $mysqli->error );


	$rows = array();
	while($row = $result->fetch_assoc()) {
	    $rows[] = $row;
	}
	print json_encode($rows);

}
?>