<?
	var_dump($_POST);
	echo "<br>";
	echo "<br>";
	echo "<br>";
	echo "Raw Domain: " . $_POST["rawDomain"];
	echo "<br>";
	echo "Domain: " . $_POST["finalDomain"];
	echo "<br>";
	$parent = $_POST["finalDomain"];
	if (strlen($_POST["domainparent"]) > 0) {
		$parent = $_POST['domainparent'];
	}
	
	echo "Parent: " . $parent;
	echo "<br>";

	echo "Maximum Characters allowed:" . $_POST["maximumcharacters"];
	echo "<br>";
	echo "Minimum Characters allowed:" . $_POST["minimumcharacters"];
	echo "<br>";


// ["rawDomain"]=> string(19) "projects.aglick.com"
// ["finalDomain"]=> string(6) "aglick"
// ["domainparent"]=> string(10) "asherglick"
// ["minimumcharacters"]=> string(1) "0"
// ["maximumcharacters"]=> string(2) "80"


################################################################################
############################ RESTRICTED CHARACTERS #############################
################################################################################

$symbolList = "!\"#$%&'()*+,-_/:;<=>?@\\]^`{|}~ ";
$uppercaseList = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
$lowercaseList = "abcdefghijklmnopqrstuvwxyz";
$numberList = "1234567890";
$characterList = $symbolList . $uppercaseList . $lowercaseList . $numberList;


$restrictedCharactersArray = array();

# Add individual Buttons
foreach (str_split($characterList) as $character) {
	# special case SPACE

	$onoff = $_POST['restricted-'.$character];
	if ($character == ' ') { $onoff = $_POST['restricted-space']; }
	if ($character == "'") { $onoff = $_POST['restricted-quote']; }
	if ($character == '&') { $onoff = $_POST['restricted-amp']; }

	if ($onoff == "on") {
		$restrictedCharactersArray[] = $character;
	}
}

# Add button Groups (incase bad form input data)
if ($_POST['restricted-symbols'] == "on") {
	foreach (str_split($symbolList) as $character) {
		$restrictedCharactersArray[] = $character;
	}
}
if ($_POST['restricted-uppercase'] == "on") {
	foreach (str_split($uppercaseList) as $character ) {
		$restrictedCharactersArray[] = $character;
	}
}
if ($_POST['restricted-lowercase'] == "on") {
	foreach (str_split($lowercaseList) as $character ) {
		$restrictedCharactersArray[] = $character;
	}
}
if ($_POST['restricted-numbers'] == "on") {
	foreach (str_split($numberList) as $character) {
		$restrictedCharactersArray[] = $character;
	}
}

# De duplicate and sort the characters
$restrictedCharactersArray = array_unique ( $restrictedCharactersArray, SORT_STRING);
sort ( $restrictedCharactersArray, SORT_STRING);

# Put the sorted characters into a string
$restrictedCharacters = "";
foreach ($restrictedCharactersArray as $character) {
	$restrictedCharacters .= $character;
}

echo "Restricted Characters: " . $restrictedCharacters;
echo "<br>";
################################################################################
############################## REGEX RESTRICTIONS ##############################
################################################################################


echo "Required Number of Numbers: " . $_POST["required-numbers"];
echo "<br>";
echo "Required Number of Lowercase Letters: " . $_POST["required-lowercase"];
echo "<br>";
echo "Required Number of Uppercase Numbers: " . $_POST["required-uppercase"];
echo "<br>";
echo "Required Number of Symbols: " . $_POST["required-symbols"];
echo "<br>";
echo "Additional Regex: " . $_POST["additionalRegex"];
echo "<br>";
echo "Final Regex: " . $_POST["finalRegex"];
echo "<br>";

# javascript function to port to php
// function createFullRegex(requiredNumbersCount, requiredLowercaseCount, requiredUppercaseCount, requiredSymbolsCount, additionalRegex) {
// 	var fullRegex = "^.*$";

$requiredNumbersCount = $_POST["required-numbers"];
$requiredLowercaseCount = $_POST["required-lowercase"];
$requiredUppercaseCount = $_POST["required-uppercase"];
$requiredSymbolsCount = $_POST["required-symbols"];
$additionalRegex = $_POST["additionalRegex"];

$fullRegex = "^.*$";

	// Required Numbers
	// If the box contains only numbers and is not 0
	if ($requiredNumbersCount != '0' && is_numeric($requiredNumbersCount)) {
		$iterations = "";
		if ($requiredNumbersCount != '1') { $iterations = "{" . $requiredNumbersCount . "}"; }
		$numbersRegex = "(?=([^0-9]*[0-9])" . $iterations . ")";
		$fullRegex = $numbersRegex . $fullRegex;
	}

	// Required Lowercase
	// If the box contains only numbers and is not 0
	if ($requiredLowercaseCount != '0' && is_numeric($requiredLowercaseCount)) {
		$iterations = "";
		if ($requiredLowercaseCount != '1') { $iterations = "{" . $requiredLowercaseCount . "}"; }
		$lowercaseRegex = "(?=([^a-z]*[a-z])" . $iterations . ")";
		$fullRegex = $lowercaseRegex . $fullRegex;
	}

	// Required Uppercase
	// If the box contains only numbers and is not 0
	if ($requiredUppercaseCount != '0' && is_numeric($requiredUppercaseCount)) {
		$iterations = "";
		if ($requiredUppercaseCount != '1') { $iterations = "{" . $requiredUppercaseCount . "}"; }
		$uppercaseRegex = "(?=([^A-Z]*[A-Z])" . $iterations . ")";
		$fullRegex = $uppercaseRegex . $fullRegex;
	}


	// Required Symbols
	// If the box contains only numbers and is not 0
	if ($requiredSymbolsCount != '0' && is_numeric($requiredSymbolsCount)) {
		$iterations = "";
		if ($requiredSymbolsCount != '1') { $iterations = "{" . $requiredSymbolsCount . "}"; }
		// Note that the symbols list does not inlcude a space
		// This is an uninformed design decission that may merrit further research
		$symbolsList = "!-/:-@\\[-`{-~";
		$symbolsRegex = "(?=([^" . $symbolsList . "]*[" . $symbolsList . "])" . $iterations .")";
		$fullRegex = $symbolsRegex . $fullRegex;
	}

	// Additional Regex
	if (strlen($additionalRegex) > 0) {
		$fullRegex = "(?=(" . $additionalRegex . "))" . $fullRegex;
	}


echo "Generated Regex: " . $fullRegex;


echo "<br>";

echo "Submitter: " . $_POST["emailaddress"];

?>