<?PHP
include '../header.php'; 
header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');
switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        $json = file_get_contents('php://input');
        $post_data = json_decode($json,true); // $post_data==NULL if not data
        if ($post_data!=NULL) { $_POST=$post_data; } // overwrite POST
        break;
    default:
        die_forbidden();
}

// Sanity checks...
$mac = $post_data['mac'];
if (!preg_match("/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/", $mac)) die_bad_request("invalid param");
$serializeTxt = json_encode($_POST);
if (preg_match("/[']/", $serializeTxt)) die_bad_request("invalid param"); // avoid SQL injection

// Already exist ?
$sql = 'SELECT * FROM `'.MYSQL_TABLE_SERVERS.'` WHERE MAC="'.$mac.'"';
$req = @mysql_query($sql) or sqldie($sql);
$data = mysql_fetch_assoc($req);
if ($data) {
    // update it
    $sql = "UPDATE `".MYSQL_TABLE_SERVERS."` SET ";
    $coma = "";
    $sql .= $coma." `DATA` =  '$serializeTxt'"; $coma = ",";
    $sql .= $coma." `TIME` =  now()"; $coma = ",";
    $sql .= " WHERE `MAC`  =  '$mac'";
    $req = @mysql_query($sql) or sqldie($sql);
} else {
    // new entry
    $sql =  "INSERT INTO `".MYSQL_TABLE_SERVERS."`";
    $sql .= "(`MAC`, `DATA`, `TIME`) VALUES (";
    $sql .= "'$mac',";
    $sql .= "'$serializeTxt',";
    $sql .= "now()";
    $sql .= ")";
    $req = @mysql_query($sql) or sqldie($sql);
}

?>