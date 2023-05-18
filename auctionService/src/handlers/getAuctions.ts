import { APIGatewayProxyEventV2  } from "aws-lambda";
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { defaultTo } from 'lodash';
import { unmarshall } from '@aws-sdk/util-dynamodb';

// import Middleware from "../util/Middleware";
import {BuildApiGatewayResponseJSON} from "../util/ApiResponseBuilder";
import {AuctionRequest, Auction} from "../types/Auction";
// import { TABLES } from "../constants/Tables";
import { REGION } from "../constants/Environments";

// allows acces to db functions
const dynamodb: DynamoDBClient = new DynamoDBClient({region: REGION});

// definition for lambda function
async function getAuctions(event: APIGatewayProxyEventV2) {

  let auctions : Record<string, any>[];
  try {
    const scanCommand = new ScanCommand({ TableName: "AuctionsTable-dev" });
		const response = await dynamodb.send(scanCommand);
    
    auctions = defaultTo(response.Items, []).map((item) => unmarshall(item));

  } catch (error) {
    console.log(error);
    throw new error;
  }
  
  return BuildApiGatewayResponseJSON(200, auctions);
};
	
// exported as handler
export const handler = getAuctions;
// export const handler = Middleware(getAuctions);
