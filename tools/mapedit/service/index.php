<?php
function getFullName($name) {
	return 'vault/' + $name;
}

function saveAction($name, $data) {
	$filename = getFullName($name);
	if (!is_writeable($filename)) {
		throw new Exception('file ' + $filename + ' is not writeable');
	}
	file_put_contents($filename, $data);	
}

function loadAction($name) {
	$filename = getFullName($name);
	if (!is_readable($filename)) {
		throw new Exception('file ' + $filename + ' is not readable');
	}
	sendOutput(file_get_contents($filename));
}

function listAction() {
	$aList = scandir('vault');
	sendOutput(json_encode($aList));
}

function sendOutput($s) {
	header('content-type: application/json');
	print $s;
}

function main($action, $post) {
	switch ($action) {
		case 'save':
			saveAction($post['name'], $post['data']);
			break;

		case 'load':
			loadAction($post['name']);
			break;
			
		case 'list':
			listAction();
			break;
			
	}
}

main($_GET['action'], $_POST);
