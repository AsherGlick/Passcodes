<html>
	<head>
		<style>
			body {
				font-family: Ariel, sans-serif;
				background: #CCC;
			}
			.resultTable {
				border-collapse: collapse;
				width: 90%;
				background: #FFF;
				margin-left: auto;
				margin-right: auto;
				min-width: 800px;
				border-top: 2px solid #2EBF78;
				border-left: 2px solid #2EBF78;
			}

			.resultTable td, .resultTable th{
				border-bottom: 1px solid #DDD;
				border-right: 1px solid #DDD;
			}

			.button {
				padding: 10px;
				text-align: center;
				width: 100px;
				background: #FFF;
				border: 1px solid #999;
				border-radius: 3px;
				margin: 10px;
				text-decoration: none;
				color: black;
			}

			.button:hover {
				background: #EEE;
			}

			.buttonCenter {
				width: 90%;
				margin-left: auto;
				margin-right: auto;
				display: relative;
				overflow: hidden;
				text-align: center;
			}
			.title {
				padding: 10px;
				margin: 10px;
				text-shadow: 0.07em 0.07em 0em #FFF;
			}
		</style>
	</head>
	<body>



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


// $sql="SELECT * FROM betarules LIMIT ?, 50;";
$sql = "SELECT id, domain, minlength, maxlength, restrictedcharacters, regex, parent FROM betarules LIMIT ?, 50";


/* Prepared statement, stage 1: prepare */
if (!($stmt = $mysqli->prepare($sql))) {
	echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
}


$upperlimit = $lowerlimit + 50;
// echo $lowerlimit;
// echo "<br>";
// echo $upperlimit;
// echo "<br>";

$stmt->bind_param('i',
	$lowerlimit
) or die ("Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error);




if (!$stmt->execute()) {
	echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
}

$meta = $stmt->result_metadata(); 
$resultsArray = array();
$columns = array();
while ($field = $meta->fetch_field()) { 
	$resultsArray[$field->name];
	$columns[] = $field->name;
    $parameters[] = &$resultsArray[$field->name]; 
} 

call_user_func_array(array($stmt, 'bind_result'), $parameters); 

$belowlimit = $lowerlimit-50;
$belowlimit = $belowlimit < 0 ? 0 : $belowlimit;
echo "<div class='buttonCenter'>";
echo "<a href='?LIMIT=" . $belowlimit . "'><div style='float: left' class='button'>Previous 50</div></a>";
echo "<a href='?LIMIT=" . $upperlimit . "'><div style='float: right' class='button'>Next 50</div></a>";
echo "<div class='title'> Currently Showing Results " . $lowerlimit . " - " . $upperlimit . "</div>";
echo "</div>";

print "<table cellpadding='10' cellspacing='0' border='0' class='resultTable'>";
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

echo "<div class='buttonCenter'>";
echo "<a href='?LIMIT=" . $belowlimit . "'><div style='float: left' class='button'>Previous 50</div></a>";
echo "<a href='?LIMIT=" . $upperlimit . "'><div style='float: right' class='button'>Next 50</div></a>";
echo "</div>";
?>

</body>
</html>