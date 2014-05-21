<?
$lowerlimit = $_GET['LIMIT'] | 0;



######
## Submit the file to the database
######
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


$sql="SELECT * FROM betarules LIMIT ?, 50;";

/* Prepared statement, stage 1: prepare */
if (!($stmt = $mysqli->prepare($sql))) {
	echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
}


$upperlimit = $lowerlimit + 50;
echo $lowerlimit;
echo "<br>";
echo $upperlimit;
echo "<br>";

$stmt->bind_param('i',
	$lowerlimit
) or die ("Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error);




if (!$stmt->execute()) {
	echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
}

// Have the sql row fill in a relational mapping of the coluimn name to the value for each row
$meta = $stmt->result_metadata(); 
$resultsArray = array();
$columns = array();
while ($field = $meta->fetch_field()) { 
	$resultsArray[$field->name];
	$columns[] = $field->name;
    $parameters[] = &$resultsArray[$field->name]; 
} 

call_user_func_array(array($stmt, 'bind_result'), $parameters); 



print "<table>";
foreach ($columns as $column) {
	print ("<th>" . $column . "</th>");
}

# set wether the current row should have a grey background
$hilight = True;
while($stmt->fetch()) { 
	# Alternate the rows between grey and white backgrounds
	if ($hilight) {
		print ("<tr style='background: #EEE'>");
	}
	else {
		print ("<tr style='background: #FFF'>");
	}
	$hilight = !$hilight;

	# Print out each column
	foreach ($columns as &$column) {
		print ("<td>" . $resultsArray[$column] . "</td>");
	}
	# end the table row
	print ("</tr>");     
}

# end the table
print "</table>";
          

# close the SQL query   
$stmt->close();

# 
$belowlimit = $lowerlimit-50;
$belowlimit = $belowlimit < 0 ? 0 : $belowlimit;

echo "<a href='?LIMIT=" . $belowlimit . "'>Previous 50</a>";
echo "<a href='?LIMIT=" . $upperlimit . "'>Next 50</a>";
?>