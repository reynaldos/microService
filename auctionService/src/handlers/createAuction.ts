import { APIGatewayAuthorizerEvent, APIGatewayProxyEventV2  } from "aws-lambda";
import {v4 as uuid} from 'uuid';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

// import Middleware from "../util/Middleware";
import {BuildApiGatewayResponseJSON} from "../util/ApiResponseBuilder";
import { Auction } from "../types/Auction";
// import { TABLES } from "../constants/Tables";
import { REGION } from "../constants/Environments";

// allows acces to db functions
const dynamodb: DynamoDBClient = new DynamoDBClient({region: REGION});

// definition for lambda function
async function createAuction(event: APIGatewayProxyEventV2 | any) {

  const request: {title: string}  = JSON.parse(event.body || '');

  const authorizer : {email : string} = event.requestContext.authorizer

  // end date config
  const bidOpenDuration: number = 1; // in hrs
  
  const now = new Date();
  const endDate = new Date() ;
  endDate.setHours(now.getHours() + bidOpenDuration);

  const newAuction: Auction  = {
    id: uuid(),
    title: request.title,
    status: 'OPEN',
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount:0
    },
    seller: authorizer.email
  }

  const scanCommand = new PutItemCommand({
    TableName: 'AuctionsTable-dev',
    // TableName: TABLES.AUCTIONS_TABLE,
    Item: marshall(newAuction)
  });

  try {
    const response = await dynamodb.send(scanCommand);
  } catch (error) {
    console.log(error);
    throw new Error(error);   
    // throw new createHttpError.InternalServerError(error);
  }
	
  return BuildApiGatewayResponseJSON(201, newAuction);
};
	
// exported as handler
export const handler = createAuction;
// export const handler = Middleware(createAuction);


// middy(createAuction)
//   .use(httpJsonBodyParser()) //automatically parse stringified event body
//   .use(httpEventNormalizer()) //automatically adjust api gateway eventhandler to reduce room for error
//   .use(httpErrorHandler()); //provides clean error handling