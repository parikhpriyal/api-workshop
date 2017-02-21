Requirements to create a RESTful API:

 - NodeJS
 - MongoDB (or any database used)
 - Postman for Chrome

On Cloud9:

 - Open a NodeJS Workspace and make it a public document (allows testing with Postman)
 - Download and setup mongodb (https://community.c9.io/t/setting-up-mongodb/1717)
 - Update package.json with the required node libraries (express, body-parser, mongoose)
    - mongoose is the library for mongodb. If using another database, use the suitable credentials and libraries.
 - Setup the variables in server.js using express

        var express    = require('express');        
        var app        = express();                 
        var bodyParser = require('body-parser');
        var port = process.env.PORT || 8080;        // set our port

 - Setup the server

        app.listen(port);
        console.log('Magic happens on port ' + port);

 - Modify server.js to use request parameters

        app.use(bodyParser.urlencoded({ extended: true }));
        
        app.use(bodyParser.json());
        
        app.use(function(req, res, next) {
            // do logging
            console.log('Something is happening.');
            next(); // make sure we go to the next routes and don't stop here
        });
        
        app.get('/', function(req, res) {
            res.json({ message: 'hooray! welcome to our api!' });   
        });

 - Save the file and run it in the terminal 'node server.js'
 - It should run successfully to display the message 'Magic happens on port'
 - Open Postman and enter the url in there. Select GET request and send. '{ message: 'hooray! welcome to our api!' }' will appear as a JSON
 - Add the mongoose library to the variable list

        var mongoose   = require('mongoose');

 - Creata a schema (schematic of table contents with keys and datatypes for values)

        var TrialSchema = new mongoose.Schema({
            name: String,
            completed: Boolean,
            note: String,
            updated_at: {type: Date, default: Date.now},
        });

 - Initiate model in mongo using the mongoose library

        var Trial = mongoose.model('Trial', TrialSchema);
 
 - Create a new instance and save it to the database directly

        var trial = new Trial({name: 'Master NodeJS', completed: false, note: 'Getting there...'});
    
        trial.save(function(err){
            if(err)
                console.log(err);
            else
                console.log(trial);
        });
    
 - Instead of auto saving it, an entry can be posted to the database on demand

        app.post('/api', function(req, res){
        
            var trial = new Trial();
            trial.name = 'Master NodeJS';
            trial.completed = false;
            trial.note = "Getting there";
            
            trial.save(function(err){
                if(err)
                    console.log(err);
              
                res.json({message: 'Trial post created'});
            });
        })
        
 - To retrieve the database or get a response, use the GET request

        .get('/api', function(req, res){
            Trial.find(function(err, trials){
                if(err)
                    res.send(err);
                
                res.json(trials);
            })
        })
        
 - To retrieve a single item by id, use the GET request

        .get('/trial/:trial_id', function(req, res){
            Trial.find(req.params.bear_id, function(err, trial) {
                if (err)
                    res.send(err);
                res.json(trial);
            });
        }) 
 - The id is used to select entries as the ID is unique and computer generated for every entry.
 - The id is entered in the URL itself
 - To update an item in an entry, use the PUT request

        .put('/trial/:id', function(req, res, next) {
             Trial.findById(req.params.id, function(err, trial){
                if(err)
                    res.send(err)
                trial.update({"name": "Master API"}, function(err){
                    if(err)
                        res.send(err)
                    // res.send({message: 'trial updated'});
                    res.json(trial);   
                });
            });
        })
        
 - To delete an entry from the database, use DELETE request

        .delete('/trial/:id', function(req, res){
            Trial.remove({
                _id: req.params.id
            }, function(err, trial){
                if(err)
                    res.send(err)
                res.json({message: "Succesfully deleted!"});
            });
        })
        
 - Modifications through PUT and DELETE can be checked at any time using GET