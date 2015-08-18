<?php
$project = "<%= projectName %>";
$name = str_replace('.', '', $project);
$cmd = "/usr/local/bin/docker -H tcp://<%= dockerIP %>:2376 port " . $name . "_mysql_1 3306 | grep -Eo '\d+$'";
$port = trim(shell_exec($cmd));

$aliases['_local']['databases'] = array (
  'default' => array (
    'default' =>
      array (
        'driver' => 'mysql',
        'username' => 'mysql',
        'password' => 'mysql',
        'port' => $port,
        'host' => 'db.boi',
        'database' => 'data',
      ),
    ),
);
