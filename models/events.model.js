'use strict';
var dbConn = require('../config/db.config');
//Employee object create
var Events = function(events){
  this.event = events.event;
  this.title     = events.title;
  this.email          = events.startDate;
  this.phone          = events.endDate;
  this.location   =  events.location;
  this.status         = events.status ? events.status : 1;
  this.created_at     = new Date();
  this.updated_at     = new Date();
};

Events.create = function (newEmp, result) {
dbConn.query("INSERT INTO events set ?", newEmp, function (err, res) {
if(err) {
  console.log("error: ", err);
  result(err, null);
}
else{
  console.log(res.insertId);
  result(null, res.insertId);
}
});
};

Events.getEvent = function (eventDate, result) {
    dbConn.query("Select * from events where event = ? order by startDate", eventDate, function (err, res) {
    if(err) {
      console.log("error: ", err);
      result(err, null);
    }
    else{
      result(null, res);
    }
    });
    };

    module.exports= Events;