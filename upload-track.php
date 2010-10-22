<?php 

$uploaddir = '/var/www/onefrequency-player/music/';
$uploadfile = $uploaddir . basename($_FILES['addfile']['name']);
echo $uploaddir;
print_r($_FILES);
$uploadmp3=basename($_FILES['addfile']['name']);
$uploadogg=str_replace(".mp3", ".ogg", $uploadmp3);
$uploadogg=str_replace(".m4a", ".ogg", $uploadogg);

if (move_uploaded_file($_FILES['addfile']['tmp_name'], $uploadfile)) {
    //echo "File is valid, and was successfully uploaded.\n";
    $cmd="dir2ogg \"" . escapeshellcmd($uploaddir . $uploadmp3) . "\" \"" . escapeshellcmd($uploaddir . $uploadogg) . "\"";
    $cmd="dir2ogg \"" . escapeshellcmd($uploaddir . $uploadmp3) . "\"";
    echo $cmd;
    exec($cmd);
	header("Location: ./#tabs-2");
	exit ();
} else {
    echo "Possible file upload attack!\n";
}
echo "Upload failed";
//print_r($_FILES);
exit();

?>