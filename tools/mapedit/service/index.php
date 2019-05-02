<?php
require('config.php');


function printLog() {
	$fp = fopen(LOG_FILE, 'a');
	if (!$fp) {
		throw new Exception('could not open log file');
	}
	fwrite($fp, implode(' ', func_get_args()) . "\n");
	fclose($fp);
}

/**
 * returns the full name of a file, by prepending the root directory
 * @return string
 */
function getFullName($name) {
	if (!$name) {
		throw new Exception('the given resource name is empty');
	}
	return VAULT_DIR . '/' . $name;
}

function checkTargetDirectory($sDir) {
	if (!file_exists($sDir)) {
		if (!mkdir($sDir, 0777, true)) {
			throw new Exception("target directory \"$sDir\" : does not exists, and could not be created (mkdir failed)");
		}
	}
	if (!file_exists($sDir)) {
		throw new Exception("target directory \"$sDir\" : could not be created");
	}
	if (!is_dir($sDir)) {
		throw new Exception("target directory \"$sDir\" : already exists, but not a directory");
	}
	if (!is_readable($sDir)) {
		throw new Exception("target directory \"$sDir\" : already exists, but reading permission denied");
	}
	if (!is_writeable($sDir)) {
		throw new Exception("target directory \"$sDir\" : already exists, but writing permission denied");
	}
}

/**
 * save data into a file
 */
function saveAction($name, $data) {
	$filename = getFullName($name);
	if (!file_exists($filename)) {
		mkdir($filename, 0777, true);
	}
	file_put_contents($filename . '/level.json', json_encode($data));	
	sendOutput('{"status":"OK"}');
}

function loadAction($name) {
	$filename = getFullName($name);
	sendOutput(file_get_contents($filename . '/level.json'));
}

function listAction() {
	$aList = array_map(function($s) {
		// get level.json data
		$filename = VAULT_DIR . '/' . $s . '/level.json';
		$previewFilename = VAULT_DIR . '/' . $s . '/preview.png';
		$date = filemtime($filename);
		$name = $s;
		$preview = file_exists($previewFilename) ? false : false;
		return array(
			'name' => $name,
			'date' => $date,
			'preview' => $preview
		);
	}, array_filter(scandir(VAULT_DIR), function($s) {
		return substr($s, 0, 1) !== '.';
	}));
	sendOutput(json_encode($aList));
}

function sendOutput($s) {
	header('content-type: application/json');
	print $s;
}

function sendError($e) {
	header('HTTP/1.1 500 Internal Server Error');
	header('Content-Type: application/json; charset=UTF-8');
	$result = array(
		'message' => $e->getMessage()
	);
	print json_encode($result);
}

function main($action, $post) {
	try {
		checkTargetDirectory(VAULT_DIR);
		switch ($action) {
			case 'save':
				saveAction($post->name, $post->data);
				break;

			case 'load':
				loadAction($post->name);
				break;
				
			case 'list':
				listAction();
				break;
				
		}
	} catch (Exception $e) {
			sendError($e);		
	}
}

$POST = json_decode(file_get_contents('php://input'));
main($_GET['action'], $POST);
