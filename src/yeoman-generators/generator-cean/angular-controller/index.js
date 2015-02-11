'use strict';

//Import the base generator module
var path = require('path');
var fs = require('fs');
var gens = require('yeoman-generator');

//Extend the base generator
module.exports = gens.NamedBase.extend({
    
    constructor: function () {
        
        //Call the super constructor
        gens.NamedBase.apply(this, arguments);
                
        //Arguments
        this.argument('appname', { type: String, required: true });
        this.appname = this._.camelize(this.appname);            
    },
    
    info : function () {        
        
        //Print some info
        console.log("== CEAN - Angular Controller Generator  ==");
        console.log("appname = " + this.appname);
        console.log("name = " + this.name);
    },
    
    askForFileName : function () {
        
        var done = this.async();
        this.prompt({
                type    : 'input',
                name    : 'filename',
                message : 'Controller File Name',
                default : this._.slugify(this._.humanize(this.name)) + ".js"
        }, function (answers) {
            this.log(answers.filename);
            this.filename = answers.filename;
            done();
        }.bind(this));
    },
    
    askForName : function () {
        
        var done = this.async();
        this.prompt({
                type    : 'input',
                name    : 'name',
                message : 'Controller Name',
                default : this._.camelize(this.name)
        }, function (answers) {
            this.log(answers.name);
            this.name = answers.name;
            done();
        }.bind(this));
    },
    
    createController : function () {
                  
        //Apply templates        
        this.template('_controller.js', 'public/scripts/controllers/' + this.filename);
    },
    
    registerController : function() {
     
        console.log("Adding controller to index.html ...");
        
        //Controller needs to be added to the index.html file after <!-- cean: Controllers -->
        var file = 'public/index.html';
        
        /*
        this._replace(file, this._escape('<!-- cean: Controllers -->'), 
                            '<!-- cean: Controllers --> \r\n' +
                            '<script src="scripts/controllers/' + this.filename + '"></script>');
        */
        this._replace("cean", "CEAN");
    },
            
    _replace : function(fileName, match , replace) {
        
        fs.readFile(fileName, 'utf8', function (err,data) {

            if (err) return console.log(err);
        
            var result = data.replace('/' + match + '/g', replace);

            fs.writeFile(fileName, result, 'utf8', function (err) {
                if (err) return console.log(err);
            });
        });
    },
    
    _escape : function(string){
        
        return string.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
    }
});