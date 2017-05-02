<?php

// Alias for the <%= aliasName %> production environment.
$aliases['master'] = array (
  'remote-host' => '<%= aliasName %>.production.clients.blueoakinteractive.net',
  'remote-user' => '<%= aliasName %>',
  'uri' => '<%= aliasName %>.production.clients.blueoakinteractive.net',
  'root' => '/home/<%= aliasName %>/www',
  'ssh-options' => '-p <%= portNumber %> -o "AddressFamily inet"',
  'path-aliases' => array(
    '%files' => 'sites/default/files',
  ),
);

// Alias for the <%= aliasName %> local environment.
$aliases['_local'] = array (
  'root' => '/var/www/<%= aliasName %>.boi/www',
  'uri' => 'http://<%= aliasName %>.boi',
);

// Sync files from master to _local
$options['shell-aliases']['pull-files'] = '!drush rsync @<%= aliasName %>.master:%files/ @<%= aliasName %>._local:%files';
