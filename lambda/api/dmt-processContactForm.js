//Processes the contact form request and adds an entry to DynamoDB

// Load the SDK for JavaScript
var AWS = require('aws-sdk');

// Set the region
AWS.config.update({region: 'us-east-1'});

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

var uuid = require('uuid');

var mapQueryString = require('querystring');

console.log("Stating request");

exports.handler = (event, context, callback) => {
    console.log(event);
    const requestBody = event; //Get form data from request params

    const email = requestBody.email;
    const subject = requestBody.subject;
    const msg = requestBody.msg;

    var responseBody = {
      status: "",
    };

    var response = {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: "",
    };

    var params = {
      TableName: '[DYNAMODB_TABLE_NAME]',
      Item: {
        'id' : {S: uuid.v1()},
        'email' : {S: email},
        'subject' : {S: subject},
        'msg' : {S: msg},
        'datetime' : {S: new Date().toISOString()},
      }
    };

    console.log(params);

    // Call DynamoDB to add the item to the table
    ddb.putItem(params, function(err, data) {
      if (err) {
        // responseBody.status = "Error processing request";
        responseBody.status = event;
        console.log("Error", err);
        response.statusCode = 500;
      } else {
        // responseBody.status = "Success sent message!";
        responseBody.status = event.body;
        response.statusCode = 200;
        console.log("Success", data);
      }

      response.body = JSON.stringify(responseBody);
      console.log("response: " + JSON.stringify(response));
      callback(null, response);
    });
};
