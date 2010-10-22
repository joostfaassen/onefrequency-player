<?php
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//header('Content-type: application/json');

$dir = "/var/www/onefrequency-player/music/";

$files=scandir($dir);

$i=1;
echo "[ \n";
foreach($files as $file) {

	if (substr($file,-4,4)==".ogg") {
		//echo $file;
		if ($i>1) echo ",\n";
		echo "{'name': '" . $file . "', 'id': '" . $i ."'}";
		$i++;
	}
}
echo "\n]\n";

?>