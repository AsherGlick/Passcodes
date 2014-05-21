<?

$inifile = parse_ini_file("../.database.ini");
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

// Generate the sql to query
$sql="SELECT * FROM rules;";

/* Prepared statement, stage 1: prepare */
if (!($stmt = $mysqli->prepare($sql))) {
	echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
}


if (!$stmt->execute()) {
	echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
}




// Set up how the query should output the design
$meta = $stmt->result_metadata(); 
$resultsArray = array();
$columns = array();
while ($field = $meta->fetch_field()) { 
	$resultsArray[$field->name];
	$columns[] = $field->name;
    $parameters[] = &$resultsArray[$field->name]; 
} 
call_user_func_array(array($stmt, 'bind_result'), $parameters); 

print "[";
$comma = "";
# set wether the current row should have a grey background
while($stmt->fetch()) { 
	print ($comma . json_encode($resultsArray));
	$comma = ",";
	// # Print out each column
	// foreach ($columns as &$column) {
	// $resultsArray[$column]));
	// }
}

print "]";
?>
