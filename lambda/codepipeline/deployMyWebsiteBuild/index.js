//Deploys the most recent build to production S3 bucket

// Load the AWS SDK
const aws = require('aws-sdk');
var s3Unzip = require("s3-unzip");

const s3 = new aws.S3({
    apiVersion: '2006-03-01'
});

//Main function
exports.handler = (event, context, callback) => {
    var pipelineArtifact = event['CodePipeline.job'].data.inputArtifacts[0].location.s3Location;

    var destBucket = "[DESTINATION_BUCKET]";
    var destBucketParams = {
        Bucket: destBucket,
    }
    var srcBucket = pipelineArtifact.bucketName;
    var srcFileName = pipelineArtifact.objectKey;
    var destKey = srcFileName.split("/").pop();
    var copyParams = {
        Bucket: destBucket, //Dest bucket
        CopySource: '/' + srcBucket + '/' + srcFileName, //source bucket + source file
        Key: destKey + ".zip" //What we want to name it in the destination bucket
    }

    var jobId = event["CodePipeline.job"].id;

    return copyBuildToProd(destBucket, destKey, copyParams)
        .then((data) => {
            return makeObjectsPublic(destBucketParams, destBucket)
                .then((data) => {
                    putJobSuccess("COMPLETE DEPLOY", jobId, callback, context);
                })
                .catch((err) => {
                    putJobFailure(err, jobId, callback, context);
                });
        })
        .catch((err) => {
           putJobFailure(err, jobId, callback, context);
        });
};

// Promise that copies the build artifact to production bucket
function copyBuildToProd(destBucket, destKey, copyParams) {
    return new Promise((resolve, reject) => {
        s3.copyObject(copyParams, function(err, data) {
            if(err) {
                reject(err);
            }
            else {
                var s = new s3Unzip({ //Unzip build artifact in place
                   bucket: destBucket,
                   file: destKey + '.zip',
                   deleteOnSuccess: true,
                   verbose: true
                }, function(err, success) {
                    if(err) {
                        reject(err);
                    }
                    else {
                        resolve(success);
                    }
                });
            }
        });
    });
}

// Promise that makes new static content public so S3 can host
function makeObjectsPublic(params, bucketName) {
    return new Promise((resolve, reject) => {
        s3.listObjectsV2(params, function(err, data) {
            if(err) {
                reject(err);
            }
            else {
                data.Contents.forEach(function(element) {
                console.log("Making public: " + element.Key);

                return addPublicReadAcl(bucketName, element)
                    .catch((err) => {
                       reject(err);
                    });
                });

                resolve("Made all objects public: " + bucketName);
            }
        });
    });
}

// Promise to set public ACL of each object public read
function addPublicReadAcl(bucketName, element) {
    var ACLParams = {
        Bucket: bucketName,
        Key: element.Key,
        ACL: "public-read"
    }
    return new Promise((resolve, reject) => {
       s3.putObjectAcl(ACLParams, function(err, data) {
            if(err) {
                reject(err);
            }
            else {
                resolve(data);
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
