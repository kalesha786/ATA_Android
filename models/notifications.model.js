'use strict';
var dbConn = require('../config/db.config');

var Notifications = function(notifications){
  this.title     =  notifications.title;
  this.body  =  notifications.body;
  this.status         = notifications.status ? devices.status : 1;
};

Notifications.create = function (newEmp, result) {
dbConn.query("INSERT INTO notifications set ?", newEmp, function (err, res) {
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

Notifications.findAll = function (result) {
    dbConn.query("Select * from notifications order by createdTime DESC", function (err, res) {
    if(err) {
      console.log("error: ", err);
      result(null, err);
    }
    else{
      console.log('employees : ', res);
      result(null, res);
    }
    });
    };

    Notifications.deleteData = function (result) {
      dbConn.query("DELETE FROM notifications WHERE createdTime < NOW() - INTERVAL 10 MINUTE", function (err, res) {
        if(err) {
          console.log("error: ", err);
          result(null, err);
        }
        else{
          console.log('employees : ', res);
          result(null, res);
        }
      });
    };
  
module.exports= Notifications;
