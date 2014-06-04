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

// Generate select SQL statement from the beta rules file
$sql="SELECT * FROM betarules WHERE rulesid IS NULL;";

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

// open stdin so the user can type things
$handle = fopen("php://stdin","r");

while($stmt->fetch()) { 

	// print "Full URL is: " .  . "\n";




	$URLParts =  explode ('/', strtolower($resultsArray['rawdomain']) );
	$fullDomain = "";
	foreach ($URLParts as $URLPart) {
		if ($URLPart == "http:") continue;
		if ($URLPart == "https:") continue;
		if ($URLPart == "") continue;
		$fullDomain = $URLPart;
		break;
	}
	$domainParts = array_reverse(explode('.', $fullDomain));
	$domain = $domainParts[1] . '.' . $domainParts[0];
	if ($domainParts[1] == 'co') { // co.uk  etc.
		$domain = $domainParts[2] . '.' . $domain;
	}



	$parentDomain = $resultsArray['parent'];
	if ($parentDomain == $resultsArray['domain']) {
		$parentDomain = "";
	}

	printf( "| %-40.40s | %-20.20s | %-3.3s | %-45.45s | %-60.60s | %-20.20s |", $resultsArray['rawdomain'],  $domain, $resultsArray['maxlength'], $resultsArray['restrictedcharacters'], $resultsArray['regex'], $parentDomain);





	$line = fgets($handle);
	if (strtolower(trim($line)) == 'yes' || strtolower(trim($line)) == 'y') {
		print "Adding to rules table (But dryrun)\n";


		// 'INSERT into `rules` ( domain, version, maxlength, restrictedcharacters, regex, parent )
		// SELECT "' . $domain . '", ifnull(max(version),0)+1 , "' . $resultsArray['maxlength'] . '", "' . $resultsArray['restrictedcharacters'] . '", "' . $resultsArray['regex'] . '", "' . $parentDomain . '" from rules where domain = \'' . $domian . '\''







		// // $maxRuleRevisionSQL = "select max(version)+1 from rules where domain = " . $domain . ";"; # not worrying about sql injection becasue this is an internal only script

		// $insertRuleSQL


		$mysqli2 = new mysqli($inifile['url'], $inifile['username'], $inifile['password'], $inifile['database']) ;

		/* check connection */
		if (mysqli_connect_errno()) {
			printf("Connect failed: %s\n", mysqli_connect_error());
			exit();
		}


		$sql='INSERT INTO rules ( `domain`, `version`, `maxlength`, `restrictedcharacters`, `regex`, `parent` )' .
		'SELECT ?, ifnull(max(version),0)+1 , ?, ?, ?, ? from rules where domain = ?';
		// 'VALUES ( ?, 999 , ?, ?, ?, ?)';

		/* Prepared statement, stage 1: prepare */
		if (!($stmt2 = $mysqli2->prepare($sql))) {
		    echo "Prepare failed: (" . $mysqli2->errno . ") " . $mysqli2->error;
		}

		$stmt2->bind_param('sissss',
			$domain, 
			$resultsArray['maxlength'], 
			$resultsArray['restrictedcharacters'], 
			$resultsArray['regex'],
			$parentDomain,
			$domain
		) or die ("Binding parameters failed: (" . $stmt2->errno . ") " . $stmt2->error);




		if (!$stmt2->execute()) {
			echo "Execute failed: (" . $stmt2->errno . ") " . $stmt2->error;
		}

		$newrowid = $mysqli2->insert_id . "\n";



		$updateBetarulesSQL = "UPDATE betarules SET rulesid = ? where id = ?";
		if (!($stmt3 = $mysqli2->prepare($updateBetarulesSQL))) {
		    echo "Prepare failed: (" . $mysqli2->errno . ") " . $mysqli2->error;
		}

		$stmt3->bind_param('ii',
			$newrowid,
			$resultsArray['id']
		) or die ("Binding parameters failed: (" . $stmt2->errno . ") " . $stmt2->error);

		if (!$stmt3->execute()) {
			echo "Execute failed: (" . $stmt2->errno . ") " . $stmt2->error;
		}

		$mysqli2->close();

	}
	else {
		// print "Skipping rule\n";
	}

}

	print "No More Rules\n";



?>
