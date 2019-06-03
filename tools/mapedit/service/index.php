<?php
/**
 * This is a micro web service which manages a file storage
 * 
 * POST this.webservice.url?action=save
 * post-data: {
 * 		name: String
 * 		data: any
 * }
 *  creates folder with level.json
 * 
 * GET this.webservice.url?action=list
 * lists all files
 * 
 * GET this.webservice.url?action=load
 * returns the specified file content
 */
require('config.php');


/**
 * simple log manager
 */
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

/**
 * If the specified directory does not exists : attempt to create it
 * throws various exceptions if the file system prevents from create the directory
 * @param $sDir String target directory name
 * @throws Exception
 */
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
 * save project content into a folder
 * @param $name String project name
 * @param $data * project content
 */
function saveAction($name, $data) {
	$filename = getFullName($name);
	if (!file_exists($filename)) {
		mkdir($filename, 0777, true);
	}
	// get the preview
	$preview = $data->preview;
	if ($preview) {
		file_put_contents($filename . '/preview.json', $preview);	
	}
	file_put_contents($filename . '/level.json', json_encode($data));
	sendOutput('{"status":"OK"}');
}

/**
 * load data from project folder
 * @param $name String project name
 */
function loadAction($name) {
	$filename = getFullName($name);
	sendOutput(file_get_contents($filename . '/level.json'));
}

/**
 * lists all project saved so far
 */
function listAction() {
	$aList = array_map(function($s) {
		// get level.json data
		$filename = VAULT_DIR . '/' . $s . '/level.json';
		$previewFilename = VAULT_DIR . '/' . $s . '/preview.json';
		$date = filemtime($filename);
		$name = $s;
		$preview = file_exists($previewFilename) ? file_get_contents($previewFilename) : false;
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

function deleteFile($s) {
	if (file_exists($s)) {
		unlink($s);
	}
}


/**
 * deletes a project
 */
function deleteAction($name) {
	deleteFile(VAULT_DIR . "/$name/level.json");
	deleteFile(VAULT_DIR . "/$name/preview.png");
	rmdir(VAULT_DIR . "/$name");
}

/**
 * Sends an object as a JSON output
 * @param $s output
 */
function sendOutput($s) {
	header('content-type: application/json');
	print $s;
}

/**
 * Sends a 500 error with description
 * @param $e Exception
 */
function sendError($e) {
	header('HTTP/1.1 500 Internal Server Error');
	header('Content-Type: application/json; charset=UTF-8');
	$result = array(
		'message' => $e->getMessage()
	);
	print json_encode($result);
}


/**
 * main procedure
 * @param $action string action name
 * @param $post StdClass post parsed data 
 */
function main($method, $get, $post) {
	try {
		$a = array($method);
		if (array_key_exists('action', $get)) {
			$a[] = $get['action'];
		}
		checkTargetDirectory(VAULT_DIR);
		printLog('action ' . implode('/', $a));
		switch (implode('/', $a)) {
			case 'POST/save':
				saveAction($get['name'], $post->data);
				break;

			case 'GET/load':
				loadAction($get['name']);
				break;
				
			case 'GET/list':
				listAction();
				break;
				
			case 'DELETE':
				deleteAction($get['name']);
				break;
				
		}
	} catch (Exception $e) {
			sendError($e);		
	}
}

$POST = json_decode(file_get_contents('php://input'));
main($_SERVER['REQUEST_METHOD'], $_GET, $POST);
