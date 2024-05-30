'use strict';
var dbConn = require('../config/db.config');

var Devices = function(devices){
  this.device     =  JSON.stringify(devices.device);
  this.device_id  =  devices.device.keys.auth;
  this.status         = devices.status ? devices.status : 1;
  this.created_at     = new Date();
  this.updated_at     = new Date();
};

Devices.create = function (newEmp, result) {
dbConn.query("INSERT INTO devices set ?", newEmp, function (err, res) {
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

Devices.findAll = function (result) {
    dbConn.query("Select * from devices", function (err, res) {
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

    Devices.getDeviceById = function(auth, result) {
      dbConn.query("SELECT * FROM devices WHERE JSON_EXTRACT(device, '$.keys.auth') = ?", [auth], function(err, res) {
          if (err) {
              console.log("error: ", err);
              result(err, null);
          } else {
              result(null, res[0]);
          }
      });
  };
  
module.exports= Devices;
