<?
header('Content-Type: application/json; charset=utf-8'); // feels hacky just changing this one line of the header (maybe not)

$inifile = parse_ini_file("./.database.ini");
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


function getRules ($domains, $inifile) {
	$mysqli = new mysqli($inifile['url'], $inifile['username'], $inifile['password'], $inifile['database']) ;

	/* check connection */
	if (mysqli_connect_errno()) {
	    printf("Connect failed: %s\n", mysqli_connect_error());
	    exit();
	}

	$domains = explode(' ', $domains);
	$domainList = "";
	foreach ($domains as &$domain) {
		$domain = $mysqli->escape_string($domain);
		$domainList .= "'".$domain."',";
	}
	$domainList = substr($domainList,0,-1);


	# build and execute the sql query
	$sql = "SELECT domain, version, created, maxlength, restrictedcharacters, regex, parent from " . $inifile['rulesTable'] . " WHERE (domain, version) IN (SELECT domain, MAX(version) FROM rules WHERE domain in (" . $domainList . ") GROUP BY domain)";
	$result = $mysqli->query($sql) or die("Unable to select: " . $mysqli->error );

	# get the results of the sql query
	$rows = array();
	while($row = $result->fetch_assoc()) {
	    $rows[] = $row;
	}

	# build list of missing data from query
	foreach ($rows as &$row) {
		$rowname = $row["domain"];
		if(($key = array_search($rowname, $domains)) !== false) {
		    unset($domains[$key]);
		}
	}

	# fill in empty data from query
	foreach ($domains as &$domain) {
		$newrow = Array();
		$newrow['domain']=$domain;
		$newrow['version']='0';
		array_push($rows, $newrow);
	}
	print indent(json_encode($rows));
}



/**
 * Indents a flat JSON string to make it more human-readable.
 *
 * @param string $json The original JSON string to process.
 *
 * @return string Indented version of the original JSON string.
 */
function indent($json) {

    $result      = '';
    $pos         = 0;
    $strLen      = strlen($json);
    $indentStr   = '  ';
    $newLine     = "\n";
    $prevChar    = '';
    $outOfQuotes = true;

    for ($i=0; $i<=$strLen; $i++) {

        // Grab the next character in the string.
        $char = substr($json, $i, 1);

        // Are we inside a quoted string?
        if ($char == '"' && $prevChar != '\\') {
            $outOfQuotes = !$outOfQuotes;

        // If this character is the end of an element,
        // output a new line and indent the next line.
        } else if(($char == '}' || $char == ']') && $outOfQuotes) {
            $result .= $newLine;
            $pos --;
            for ($j=0; $j<$pos; $j++) {
                $result .= $indentStr;
            }
        }

        // Add the character to the result string.
        $result .= $char;

        // If the last character was the beginning of an element,
        // output a new line and indent the next line.
        if (($char == ',' || $char == '{' || $char == '[') && $outOfQuotes) {
            $result .= $newLine;
            if ($char == '{' || $char == '[') {
                $pos ++;
            }

            for ($j = 0; $j < $pos; $j++) {
                $result .= $indentStr;
            }
        }

        $prevChar = $char;
    }

    return $result;
}

?>