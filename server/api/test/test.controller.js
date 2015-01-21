'use strict';

var _ = require('lodash');
var Test = require('./test.model');
var Firebase = require('firebase');
var mainRef = new Firebase("https://pruvit.firebaseio.com/");
var taskListsRef = mainRef.child('taskLists');
// Get list of tests
exports.index = function(req, res) {
  var newTaskRef = taskListsRef.child('test').push();
  newTaskRef.set({createdAt:Date.now()});
  newTaskRef.on('value', function(newTaskSnap){
    if(!newTaskSnap.val()){
      console.log('Task is done');
      res.json(200, {message:'Task Completed'});
    } else {
      console.log('Task is processing');
    }
  })
};




function handleError(res, err) {
  return res.send(500, err);
}
