# lambda-put-function

creates or updates AWS Lambda's function

## Usage

```javascript
var AWS = require('aws-sdk');
AWS.config.credentials = new AWS.SharedIniFileCredentials({
  profile: 'org-stuff'
});

var putFunction = require('lambda-put-function');

putFunction(
  new AWS.Lambda({
    region: 'ap-northeast-1'
  }),
  {
    FunctionName: 'hi',
    Runtime: "nodejs",
    Role: 'arn:aws:iam::ACCOUNT_ID:role/ROLE',
    Handler: 'index.handler',
    Timeout: 6,
    MemorySize: 128,
    Code: {
      ZipFile: fs.readFileSync('hi.zip')
    }
  },
  function(err, data) {
    console.dir(err, data);
  }
);
```

## API

```javascript
var putFunction = require('lambda-put-function')
```

### putFunction(lambda, params, cb)

This function creates or updates AWS Lambda's function.

- Arguments
  - lambda - **required** - `instance of AWS.Lambda`
  - params - **required** - `map`
     - Code - **required** - `map`
       - S3Bucket - `String`
       - S3Key - `String`
       - S3ObjectVersion - `String`
       - ZipFile - `Buffer|String`
     - FunctionName - **required** - `String`
     - Handler - **required** - `String`
     - Role - **required** - `String`
     - Runtime - **required** - `String`
     - Description - `String`
     - MemorySize: - `Integer`
     - Publish: - `Boolean`
     - Timeout: - `Integer`
  - cb - `Function(err, data) {}` - called with following arguments on the end of operation
    - Arguments
      - err - `Error` - the error object from aws-sdk. Set to `null` if the operation is successful.
      - data - `map` - the data from aws-sdk. Set to `null` if the operation error occur.
        - FunctionName - `String`,
        - FunctionArn - `String`,
        - Runtime - `String`,
        - Role - `String`,
        - Handler - `String`,
        - CodeSize - `Integer`,
        - Description: `String`,
        - Timeout: `Integer`,
        - MemorySize: `Integer`,
        - LastModified: `String`,
        - CodeSha256: `String`,
        - Version: `String`
