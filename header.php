<?PHP
// WARNING: NO TEXT SHOULD BE WRITE HERE (EXCEPT DIE ERRORS)
// BE CAREFULL THAT THEY ALSO NO TEXT (EVEN SPACE) OUTSIDE PHP BALISES
// -> cause this file is used under download.php
include 'conf.php';
include 'defines.php';

// DEBUG SWITCHED
// ---------------------
if (($_SERVER['SERVER_ADDR']=='localhost' ) || $_SERVER["SERVER_ADDR"]=="127.0.0.1" || ($_SERVER["SERVER_ADDR"]=="::1")) {
    $GLOBALS['DEBUG'] = true;
} else {
    $GLOBALS['DEBUG'] = false;
}

// MAIN DATABASE ($db)
// -----------------
if ($GLOBALS['CONFIG']['sql_isPW']) {
    $db = @mysql_connect($GLOBALS['CONFIG']['sql_host'], $GLOBALS['CONFIG']['sql_login'], $GLOBALS['CONFIG']['sql_pw']); 
} else {
    $db = @mysql_connect($GLOBALS['CONFIG']['sql_host'], $GLOBALS['CONFIG']['sql_login']); 
}
if ($GLOBALS['DEBUG']) {
    if (!$db)  die('Could not connect: ' . mysql_error());
    if(!@mysql_select_db($GLOBALS['CONFIG']['sql_db'],$db)) die('Could not connect db: ' . mysql_error());
} else {
    if (!$db) die();
    if(!@mysql_select_db($GLOBALS['CONFIG']['sql_db'],$db)) die();
}
date_default_timezone_set('America/Montreal');


// Gnrl print error
function perr($msg) {
    return '<span class="error">'.$msg.'</span><br>';
}


/* dying.... */

function sqldie($sql) {
    $bt = debug_backtrace();
    $caller = array_shift($bt);
    $dbg =  "[".$_SERVER['REMOTE_ADDR']."] ";
    $dbg .= "[".$caller['file'].":".$caller['line']."] ";
	$err = mysql_error();
    error_log($dbg);
    error_log($sql);
    error_log($err);
    
    header('HTTP/1.1 500 Internal error', true, 500);
    
    die("SQL: $err\n$sql"); 
	if ($GLOBALS['DEBUG']) {
		die("SQL: $err\n$sql"); 
	} else {
		die('<p>Server internal error</p>'); 
	}	
}

function die_internal_error($msg="") {
    $bt = debug_backtrace();
    $caller = array_shift($bt);
    $dbg =  "[".$_SERVER['REMOTE_ADDR']."] ";
    $dbg .= "[".$caller['file'].":".$caller['line']."] ";
    $dbg .= $msg;
    error_log($dbg);
    header('HTTP/1.1 500 Internal error', true, 500);
    exit($msg);
}

function die_bad_request($msg="", $errorIdx=null) {
    $bt = debug_backtrace();
    $caller = array_shift($bt);
    $dbg =  "[".$_SERVER['REMOTE_ADDR']."] ";
    $dbg .= "[".$caller['file'].":".$caller['line']."] ";
    $dbg .= $msg;
    error_log($dbg);
    header('HTTP/1.1 400 Bad Request', true, 400);
    exit('{"msg":"'.$msg.'", "idx":"'.$errorIdx.'"}');
}    

function die_forbidden($msg="") {
    header('HTTP/1.1 403 Forbidden', true, 403);
    exit($msg);
}

function die_redirect($url) {
    header('Location: '.$url);
    exit();
}