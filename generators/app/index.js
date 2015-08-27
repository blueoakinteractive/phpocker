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
      message: 'Enter your project name?'
    },
    {
      type: 'input',
      name: 'hostIP',
      message: 'Host IP of your system on the docker network (typically .1 host on your docker-machine eth0 net)',
      store: true
    }
  ];
  this.prompt(prompts, function (props) {
    this.props = props;
    done();
  }.bind(this));
},

  writing: {
    app: function () {
      this.fs.copyTpl(
        this.templatePath('docker-compose.yml'),
        this.destinationPath('docker-compose.yml'),
        { projectName: this.props.projectName }
      );
      this.fs.copyTpl(
        this.templatePath('conf/*'),
        this.destinationPath('compose/conf'),
        {
          projectName: this.props.projectName,
          hostIP: this.props.hostIP
        }
      );
      this.fs.copy(
        this.templatePath('images'),
        this.destinationPath('compose/images')
      );
    }
  },

  complete: function () {
    this.log('The phpocker generator has completed.');
  }
});
