// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var port = process.env.PORT || 8080;        // set our port
var mongoose   = require('mongoose');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//database initiation
mongoose.connect('mongodb://parikhpriyal-apitrial-4454576');

//api routes
app.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
app.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

//Create a schema
var TrialSchema = new mongoose.Schema({
    name: String,
    completed: Boolean,
    note: String,
    updated_at: {type: Date, default: Date.now},
});

var Trial = mongoose.model('Trial', TrialSchema);

app.post('/trial', function(req, res){
    
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
.get('/trial', function(req, res){
    Trial.find(function(err, trials){
        if(err)
            res.send(err);
        
        res.json(trials);
    })
})
.get('/trial/:id', function (req, res) {
  Trial.findById(req.params.id, function(err, trial){
    if(err) 
        res.send(err);
    res.json(trial);
  });
})
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
.delete('/trial/:id', function(req, res){
    Trial.remove({
        _id: req.params.id
    }, function(err, trial){
        if(err)
            res.send(err)
        res.json({message: "Succesfully deleted!"});
    });
});

//start the server
app.listen(port);
console.log('Magic happens on port ' + port);