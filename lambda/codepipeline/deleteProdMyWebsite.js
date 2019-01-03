//Cleans prod bucket for new build. Doing this because changes to static site
//content creates new files arbitrarily so can't assume exact files will be
//in a new build.

// Load the AWS SDK
const aws = require('aws-sdk');

const s3 = new aws.S3({
    apiVersion: '2006-03-01'
});
var destBucket = "[DESTINATION_BUCKET]";
var destBucketParams = {
    Bucket: destBucket,
}

exports.handler = (event, context, callback) => {
    var jobId = event["CodePipeline.job"].id;
    try {
        return clearProdBucket()
            .then((data) => {
                putJobSuccess(data, jobId, callback, context);
            })
            .catch((err) => {
                putJobFailure(err, jobId, callback, context);
            });
    }
    catch(error) { //Catch any and all errors
        putJobFailure(error, jobId, callback, context);
    }
};

//Promise to clear all items in a bucket
function clearProdBucket() {
    return new Promise((resolve, reject) => {
        //List prod bucket contents
        s3.listObjectsV2(destBucketParams, function(err, data) {
            if (err) {
                reject(err);
            }
            else {
                //Delete every object in bucket
                data.Contents.forEach(function(element) {
                    console.log("Deleting: " + element.Key);
                    var deleteParams = {
                        Bucket: destBucket,
                        Delete: {
                            Objects : [
                                {
                                    Key: element.Key
                                }
                            ],
                            Quiet: false
                        }
                    }
                    s3.deleteObjects(deleteParams, function(err, data) {
                       if(err) {
                           reject(err);
                       }
                       else {
                           console.log(data);
                       }
                    });
                });

                resolve("COMPLETE: Delete Prod Bucket");
            }
        });
    });
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
