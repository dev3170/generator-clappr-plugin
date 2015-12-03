'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

var translate = {
  'Playback': 'playback',
  'Container': 'container_plugin',
  'UIContainer': 'ui_container_plugin',
  'Core': 'core_plugin',
  'UICore': 'ui_core_plugin',
  'MediaControl': 'media_control'
};


var ClapprPluginGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    var prompts = [{
      type: 'input',
      name: 'name',
      message: "Plugin name:",
      default: 'Foo Bar'
    }, {
      type: 'list',
      name: 'type',
      message: 'Choose a plugin type:',
      choices: ['Playback', 'Container', 'UIContainer', 'Core', 'UICore', 'MediaControl']
    }];

    this.prompt(prompts, function (props) {
      this.name = props.name;
      this.type = props.type;
      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('bin');
    this.mkdir('public');

    this.template("_index.js", "index.js", {
      className: this._.classify(translate[this.type]),
      pluginName: this._.classify(this.name),
      dependency: translate[this.type],
      name: this._.underscored(this.name),
      type: this.type.toLowerCase()
    });

    this.template('_webpack.config.js', 'webpack.config.js', {
      pluginName: this._.classify(this.name),
      filename: this._.underscored(this.name),
    });

    this.template('_package.json', 'package.json', {
      name: this._.underscored(this.name)
    });

    this.template('_index.html', 'index.html', {
      name: this.name,
      classname: this._.classify(this.name),
      filename: this._.underscored(this.name),
      pluginType: this.type.toLowerCase(),
    });
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    this.copy('gitignore', '.gitignore');
  }
});

module.exports = ClapprPluginGenerator;
