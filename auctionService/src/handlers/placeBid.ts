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
async function placeBid(event: APIGatewayProxyEventV2 | any) {

  const { id } = event.pathParameters;
  const { amount } = JSON.parse(event.body);

  // bidder email
  const authorizer : {email : string} = event.requestContext.authorizer;
  const bidder = authorizer.email;

  // check if new bid is higher
  const auction = await getAuctionById(id);

  // check if seller trying to place bid
  if (auction.seller === bidder){
    throw new Error(`You can't bid on item your own auction!`);
  }

  // check for double bidding by highest bidder
  if (auction.highestBid.user === bidder){
    throw new Error(`You already have highest bid, no double bidding!`);
  }

  // check if bid is lower than highest bid
  if (amount < auction.highestBid.amount){
    throw new Error(`Your bid must be higher than ${auction.highestBid.amount}!`);
  }

  // check auction status
  if (auction.status !== 'OPEN'){
    throw new Error(`You cannot Bid on closed auctions!`);
  }

  let updatedAuction: Object;
  try {
    const updateCommand = new UpdateItemCommand({
        TableName: "AuctionsTable-dev", 
        Key: { 
          id: {S: id } 
        },
        UpdateExpression: 'SET highestBid.amount = :amount, highestBid.bidder = :bidder',
        ExpressionAttributeValues:{
          ":amount" : { N: `${amount}` },
          ":bidder" : { S: `${bidder}` },

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


