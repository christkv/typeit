var fs = require('fs')
  , dox = require('dox')
  , path = require('path')
  , mustache = require('mustache');

var Typeit = function Typeit() {  
}

Typeit.prototype.parse_file = function file(file) {
  // Read in the file
  var file_data = fs.readFileSync(file, 'utf8');
  // Extract the comments for the file
  var comments = dox.parseComments(file_data, {raw:true})
  .map(function(doc) { return doc.description.full; });

  // Parse the comments
  return _buildDescriptions(comments);
}

Typeit.prototype.parse_module = function module(dir) {
  var files = [];
  var descriptions = [];
  // Recursive
  lsRecursiveSync(files, dir);
  // For each file parse them
  for(var i = 0; i < files.length; i++) {
    descriptions = descriptions.concat(this.parse_file(files[i]));
  }
  // Return descriptions
  return descriptions;
}

Typeit.prototype.module = function module(dir, callback) {
  // Read the package file
  var package_file_data = JSON.parse(fs.readFileSync(dir + "/package.json"));
  var module_name = package_file_data.name;
  var module_template = fs.readFileSync(__dirname + "/../templates/module.mustache", "utf8");

  // Parse the whole module and extract the data
  var classes = this.parse_module(dir);
  // Let's extract all the interfaces if they exist
  var interfaces = [];
  for(var i = 0; i < classes.length; i++) {
    interfaces = interfaces.concat(classes[i].interfaces);
  }

  console.log(JSON.stringify(classes, 2, 2))
  // console.dir(interfaces)

  // Render the result
  var result = mustache.render(module_template, {
      module: module_name
    , interfaces: interfaces
    , classes: classes
    // , join: function() {
    //   return function(params) {
    //     return params.join(", ");
    //   }
    // }
  });
  console.log("----------------------------------------")
  console.log(result)

  callback();

  // // Render the module
  // jade.renderFile(__dirname + "/../templates/module.jade", 
  //   { pretty: true, 
  //     debug: false, 
  //     compileDebug: false,
  //     module: module
  //   }, callback);    
}



var _buildDescriptions = function _buildDescriptions(comments) {
  var buildDescriptions = [];
  var currentBuildDescription = null;

  for(var i = 0; i < comments.length; i++) {
    // Fetch the comment
    var comment = comments[i];
    
    // Check if we have a class definition
    if(comment.match(/@typescript_class/)) {
      if(currentBuildDescription != null) 
        buildDescriptions.push(currentBuildDescription);
      // Clear up the description
      currentBuildDescription = {
          interfaces: []
        , methods: []
      }
      // Parse the class
      _parseClass(comment, currentBuildDescription);
    }
    
    // Check if we have a constructor
    if(comment.match(/@typescript_constructor/)) {
      _parseConstructor(comment, currentBuildDescription);
    }

    // Check if we have an interface
    if(comment.match(/@typescript_interface/)) {
      _parseInterface(comment, currentBuildDescription);
    }

    // Check if we have an interface
    if(comment.match(/@typescript_method/)) {
      _parseMethod(comment, currentBuildDescription);
    }
  }  

  // If we have a build description
  if(currentBuildDescription != null) 
    buildDescriptions.push(currentBuildDescription);  

  return buildDescriptions;
}

var _parseMethod = function _parseMethod(comment, description) {
  var method = {params: []};
  var lines = comment.split("\n");
  for(var i = 0; i < lines.length; i++) {
    if(lines[i].match(/@typescript_method/)) {
      method.visibility = lines[i].trim().split(/ +/)[1].trim();
      method.name = lines[i].trim().split(/ +/)[2].trim();
      method.return = lines[i].trim().split(/ +/)[3].trim();
    } else if(method.name != null && lines[i].match(/\\/)) {
      method.params.push(lines[i].replace(/\\/, '').trim());
    } else if(method.name != null) {
      method.params.push(lines[i].replace(/\\/, '').trim());
      method.params_joined = method.params.join(", ");
      description.methods.push(method);
      return;
    }
  }

  // Set the method
  description.methods.push(method);
}

var _parseInterface = function _parseInterface(comment, description) {
  var interface = {params: []};
  var lines = comment.split("\n");
  for(var i = 0; i < lines.length; i++) {
    if(lines[i].match(/@typescript_interface/)) {
      interface.name = lines[i].trim().split(/ +/)[1].trim();
    } else if(interface.name != null && lines[i].match(/\\/)) {
      interface.params.push(lines[i].replace(/\\/, '').trim());
    } else if(interface.name != null) {
      interface.params.push(lines[i].replace(/\\/, '').trim());
      description.interfaces.push(interface);
      return;
    }
  }      
}

var _parseClass = function _parseClass(comment, description) {
  var lines = comment.split("\n");
  for(var i = 0; i < lines.length; i++) {
    if(lines[i].match(/@typescript_class/)) {
      description.class = lines[i].trim().split(/ +/)[1].trim();
      break;
    }
  }
}

var _parseConstructor = function _parseConstructor(comment, description) {
  var lines = comment.split("\n");
  for(var i = 0; i < lines.length; i++) {
    if(lines[i].match(/@typescript_constructor/)) {
      description.constructor = [];      
    } else if(Array.isArray(description.constructor) && lines[i].match(/\\/)) {
      description.constructor.push(lines[i].replace(/\\/, '').trim());
    } else if(Array.isArray(description.constructor)) {
      description.constructor.push(lines[i].replace(/\\/, '').trim());
      description.constructor_joined = description.constructor.join(", ");
      return;
    }
  }    
}

// Delete a directory recursively
var lsRecursiveSync = function(_files, dirPath) {
  var files = fs.readdirSync(dirPath);

  for(var i = 0; i < files.length; i++) {
    var filePath = path.join(dirPath, files[i]);
    var file = fs.statSync(filePath);

    if(file.isDirectory()) {
      lsRecursiveSync(_files, filePath);
    } else {
      _files.push(filePath);
    }
  }
};

exports.Typeit = Typeit;