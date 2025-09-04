export type AmplifyDependentResourcesAttributes = {
  "api": {
    "contactApi": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    },
    "farmexpensetracker": {
      "GraphQLAPIEndpointOutput": "string",
      "GraphQLAPIIdOutput": "string"
    }
  },
  "auth": {
    "farmexpensetracker1da593af": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    }
  },
  "function": {
    "sendEmail": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  },
  "storage": {
    "receipts": {
      "BucketName": "string",
      "Region": "string"
    }
  }
}