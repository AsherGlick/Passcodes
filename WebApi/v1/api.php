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

	/* check connection */
	if (mysqli_connect_errno()) {
	    printf("Connect failed: %s\n", mysqli_connect_error());
	    exit();
	}

	$domain = $mysqli->escape_string($domain);

	$sql = "SELECT name, version, creationdate, minlength, maxlength, restrictedcharacters, regex, parent from " . $inifile['rulesTable'] . " WHERE (name, version) IN (SELECT name, MAX(version) FROM rules WHERE name in ('" . $domain . "', 'example') GROUP BY name)";

	$result = $mysqli->query($sql) or die("Unable to select: " . $mysqli->error );


	$rows = array();
	while($row = $result->fetch_assoc()) {
	    $rows[] = $row;
	}
	print_r ($rows);
	print "\n";
	print json_encode($rows);
}

?>