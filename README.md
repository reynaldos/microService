
# Auction Service

Serverless microservice for handling auction operations. User authentication using Auth0.

AWS Cloud Services Used:
 - Lambda
 - DynamoDB
 - S3
 - SQS
 - SES

![App Screenshot](https://i.ibb.co/r0DqhGm/flow.png)

## Deployment
AWS CLI needed to deploy this service
https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

Auth-Service environment variables

```bash
  public_key.pem
  secrets.json

```


Install dependencies for each subdirectory

```bash
  npm i
```


Deployment for each subdirectory

```bash
 sls deploy --verbose
```

