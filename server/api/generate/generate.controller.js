'use strict';

var _ = require('lodash');
var Generate = require('./generate.model');
var Firebase = require('firebase');
var mainRef = new Firebase("https://pruvit.firebaseio.com/");
var taskListsRef = mainRef.child('taskLists');
// Get list of generates
exports.index = function(req, res) {
  Generate.find(function (err, generates) {
    if(err) { return handleError(res, err); }
    return res.json(200, generates);
  });
};

// Get a single generate
exports.show = function(req, res) {
  Generate.findById(req.params.id, function (err, generate) {
    if(err) { return handleError(res, err); }
    if(!generate) { return res.send(404); }
    return res.json(generate);
  });
};

// Creates a new generate in the DB.
// exports.create = function(req, res) {
//   Generate.create(req.body, function(err, generate) {
//     if(err) { return handleError(res, err); }
//     return res.json(201, generate);
//   });
// };

// Creates a new generate in the DB.
exports.dauxServer = function(req, res) {
  //Send to dauxServer task list
  if(req.body && req.body.hasOwnProperty('name')){
    //Save generate in database
    Generate.create(req.body, function(err, generate) {
      if(err) { return handleError(res, err); }
      completeTask("dauxServer", {name:req.body.name}, function(){
        // [TODO] Add completed information to generateObj
        console.log('dauxServer task completed for: ' + req.body.name);
        return res.json(201, {message:"Daux Server created for: " + req.body.name});
      });
    });
  } else {
    handleError(res, {message:"INVALID_PARAMS"});
  }
};

function completeTask(taskListName, taskDataObj, successCb){
  var newTaskRef = taskListsRef.child(taskListName).push();
  taskDataObj.createdAt = Date.now();
  newTaskRef.set(taskDataObj);
  newTaskRef.on('value', function(newTaskSnap){
    if(!newTaskSnap.val()){
      console.log('Task is done');
      if(successCb){
        successCb();
      }
    } else {
      console.log('Task is processing');
    }
  });
}
// Updates an existing generate in the DB.
// exports.update = function(req, res) {
//   if(req.body._id) { delete req.body._id; }
//   Generate.findById(req.params.id, function (err, generate) {
//     if (err) { return handleError(res, err); }
//     if(!generate) { return res.send(404); }
//     var updated = _.merge(generate, req.body);
//     updated.save(function (err) {
//       if (err) { return handleError(res, err); }
//       return res.json(200, generate);
//     });
//   });
// };

// Deletes a generate from the DB.
exports.destroy = function(req, res) {
  Generate.findById(req.params.id, function (err, generate) {
    if(err) { return handleError(res, err); }
    if(!generate) { return res.send(404); }
    generate.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
