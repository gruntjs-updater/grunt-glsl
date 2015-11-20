/*
 * grunt-glsl
 * https://github.com/marcs/grunt-glsl
 *
 * Copyright (c) 2015 Marco Pompili
 * Licensed under the MIT license.
 */
'use strict';

var os = require('os');
var cson = require('cson');

if (typeof String.prototype.startsWith != 'function')
{
  String.prototype.startsWith = function (str)
  {
    return this.slice(0, str.length) == str;
  };
}

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  var directiveTag = "//#gljs";

  function stripDirectives(shaderArrSrc)
  {
    var directives = [];
    var j = 0;

    for(var i = 0; i < shaderArrSrc.length; i++)
    {
      if(shaderArrSrc[i].startsWith(directiveTag))
      {
        var directive = shaderArrSrc.splice(i, 1)[0];
        directive = directive.substring(directiveTag.length, directive.length).trim();

        directives[j] = directive;

        j++;
      }
    }

    return directives;
  }

  function stripEmptyLines(shaderArrSrc)
  {
    for(var i = 0; i < shaderArrSrc.length; i++)
      if(!shaderArrSrc[i])
        shaderArrSrc.splice(i, 1);
  }

  grunt.registerMultiTask('glsl', 'Translate shader files to javascript strings.', function() {

    var jsOutput = "";

    var isWin = /^win/.test(os.platform());

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      lineEndings: isWin ? "\r\n" : "\n",
      includeComments: true,
      oneString: false
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          grunt.log.ok('Source file "' + filepath + '" found.');
          return true;
        }

      }).map(function(filepath) {

        // Read file source.
        var src = grunt.util.normalizelf(grunt.file.read(filepath));
        var shaderArrSrc = src.split(options.lineEndings);
        stripEmptyLines(shaderArrSrc);
        var directives = stripDirectives(shaderArrSrc);

        var gljs = cson.parse(directives.join('\n'));
        var shaderName = gljs.varname;
        var i, l;

        if(options.oneString) {

          jsOutput += 'var ' + shaderName + ' = "';

          for (i = 0, l = shaderArrSrc.length; i < l; i++)
            jsOutput += shaderArrSrc[i] + "\\n";

          jsOutput += '";\n';
        }
        else {

          jsOutput += 'var ' + shaderName + ' = [\n';

          for (i = 0, l = shaderArrSrc.length; i < l; i++)
            jsOutput += "'" + shaderArrSrc[i] + "',\n";

          jsOutput += '].join("\\n");\n';
        }

      }).join('\n');

      // Write the destination file.
      grunt.file.write(f.dest, jsOutput);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });
};
