//Update the new static content with the appropriate Content-Type.
//So S3 can serve content correctly

// Load the AWS SDK
const aws = require('aws-sdk');
const mime = require('mime-types')

const s3 = new aws.S3({
    apiVersion: '2006-03-01'
});

exports.handler = (event, context, callback) => {
    var jobId = event["CodePipeline.job"].id;
    var destBucket = "[DESTINATION_BUCKET";

    return updateMetadataBucket(destBucket)
        .then((data) => {
            putJobSuccess("COMPLETE DEPLOY", jobId, callback, context);
        })
        .catch((err) => {
            putJobSuccess(err, jobId, callback, context);
        });

};

// Promise to update all objects in a bucket
function updateMetadataBucket(destBucket) {
    var listParams = {
        Bucket: destBucket,
    }
    return new Promise((resolve, reject) => {
        s3.listObjectsV2(listParams, function(err, data) {
            if(err) {
                reject(err);
            }
            else {
                data.Contents.forEach(function(element) {
                console.log("Changing metadata: " + element.Key);

                return updateMetadataObject(destBucket, element.Key)
                    .catch((err) => {
                       reject(err);
                    });
                });

                resolve("Made all objects public: " + destBucket);
            }
        });
    });
}

//Promise to update a single object in a bucket
function updateMetadataObject(destBucket, key) {
    var contentType = mime.lookup(key.split('.')[-1]);
    var copyParams = {
        Bucket: destBucket,
        CopySource: '/' + destBucket + '/' + key,
        Key: key,
        ContentType: contentType,
        MetadataDirective: 'REPLACE'
    }

    return new Promise((resolve, reject) => {
        s3.copyObject(copyParams, function(err, data) {
            if(err) {
                reject(err);
            }
            else {
                resolve("Updated: " + key);
            }
        });
    })
}



// Notify AWS CodePipeline of a failed job
function putJobFailure(message, jobId, callback, context) {
    var codepipeline = new aws.CodePipeline();

    var params = {
        jobId: jobId,
        failureDetails: {
            message: JSON.stringify(message),
            type: 'JobFailed',
            externalExecutionId: context.invokeid
        }
    };
    codepipeline.putJobFailureResult(params, function(err, data) {
    console.log(err, err.stack);
    context.fail(err);
    });
    callback(message);
};

// Notify AWS CodePipeline of a successful job
var putJobSuccess = function(message, jobId, callback, context) {
    var codepipeline = new aws.CodePipeline();

    var params = {
        jobId: jobId
    };
    codepipeline.putJobSuccessResult(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            context.fail(err);
        }
        else {
            console.log(message);
            context.succeed(message);
        }
    });

    callback(null, message);
};
