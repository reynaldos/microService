import { APIGatewayProxyEventV2 } from "aws-lambda";
import { DynamoDBClient, UpdateItemCommand, } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

import { getAuctionById } from "./getAuction";
// import Middleware from "../util/Middleware";
import {BuildApiGatewayResponseJSON} from "../util/ApiResponseBuilder";
// import { TABLES } from "../constants/Tables";
import { REGION } from "../constants/Environments";

// allows acces to db functions
const dynamodb: DynamoDBClient = new DynamoDBClient({region: REGION});

// definition for lambda function
async function placeBid(event: APIGatewayProxyEventV2) {

  const { id } = event.pathParameters;
  const { amount } = JSON.parse(event.body);

  // check if new bid is higher
  const auction = await getAuctionById(id);
  if (amount < auction.highestBid.amount){
    throw new Error(`Your bid must be higher than ${auction.highestBid.amount}!`);
  }

  let updatedAuction: Object;
  try {
    const updateCommand = new UpdateItemCommand({
        TableName: "AuctionsTable-dev", 
        Key: { 
          id: {S: id } 
        },
        UpdateExpression: 'SET highestBid.amount = :amount',
        ExpressionAttributeValues:{
          ":amount" : { N: `${amount}` },
        },
        ReturnValues: 'ALL_NEW'
     });

    
		const response = await dynamodb.send(updateCommand);
    updatedAuction = unmarshall(response.Attributes)

  } catch (error) {
      console.log(error);
      throw new Error(error);
  }
  
  return BuildApiGatewayResponseJSON(200, updatedAuction);
};
	
// exported as handler
export const handler = placeBid;
// export const handler = Middleware(getAuctions);


