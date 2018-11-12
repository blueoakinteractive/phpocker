'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('PHPocker') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'projectName',
      message: 'Enter your project name?',
      default: process.cwd().split("/").pop()
    },
    {
      type: 'input',
      name: 'stack',
      message: 'Enter the name of the stack for this build (ie: drupal-php5, drupal-php7, etc...)',
      store: true,
      default: 'drupal-php7'
    },
    {
      type: 'input',
      name: 'hostIP',
      message: 'Host IP of your system on the docker network (typically .1 host on your docker-machine eth0 net)',
      store: true
    },
    {
      type: 'input',
      name: 'blackfireServerId',
      message: 'Enter an optional blackfire server id',
      store: true
    },
    {
      type: 'input',
      name: 'blackfireServerToken',
      message: 'Enter an optional blackfire server token',
      store: true
    }
  ];
  this.prompt(prompts, function (props) {
    this.props = props;
    done();
  }.bind(this));
},

  setupAliases: function() {
    var done = this.async();

    // Drush alias prompts.
    this.prompt({
      type: 'confirm',
      name: 'setupAliases',
      message: 'Would you like to create drush aliases?',
      default: false
    }, function(props) {
      this.setupAliases = props.setupAliases;
      if (!this.setupAliases) {
        done();
      }
      else {
        var aliasPrompts = [
          {
            type: 'input',
            name: 'aliasName',
            message: 'Enter a drush alias name.',
            default: process.cwd().split("/").pop().split(".").shift()
          },
          {
            type: 'input',
            name: 'portNumber',
            message: 'Enter your project\'s ssh port number.',
            default: '22',
            store: true
          }
        ];
        this.prompt(aliasPrompts, function (props) {
          this.props.drushAliases = props;
          done();
        }.bind(this));
      }
    }.bind(this));
  },

  writing: {
    app: function () {
      // Get current user directory.
      var userDir = process.env.HOME + '/';

      // Create docker-compose.yml.
      this.fs.copyTpl(
        this.templatePath(this.props.stack + '/docker-compose.yml'),
        this.destinationPath('docker-compose.yml'),
        {
          projectName: this.props.projectName,
          networkName: this.props.projectName.replace('.boi', ''),
          blackfireServerId: this.props.blackfireServerId,
          blackfireServerToken: this.props.blackfireServerToken
        }
      );

      // Create compose/conf folder and files.
      this.fs.copyTpl(
        this.templatePath(this.props.stack + '/conf/*'),
        this.destinationPath('compose/conf'),
        {
          projectName: this.props.projectName,
          hostIP: this.props.hostIP
        }
      );

      // Create drush aliases based on user input.
      if (this.setupAliases) {
        this.fs.copyTpl(
          this.templatePath(this.props.stack + '/drush-alias'),
          this.destinationPath(userDir + '.drush/'), {
            aliasName: this.props.drushAliases.aliasName,
            portNumber: this.props.drushAliases.portNumber
          }
        );
        this.fs.move(
          this.destinationPath(userDir + '.drush/placeholder.aliases.drushrc.php'),
          this.destinationPath(userDir + '.drush/' + this.props.drushAliases.aliasName + '.aliases.drushrc.php'),
          {
            aliasName: this.props.aliasName
          }
        );
      }

    }
  },

  complete: function () {
    this.log('The phpocker generator has completed.');
  }
});
