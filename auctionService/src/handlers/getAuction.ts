import { APIGatewayProxyEventV2  } from "aws-lambda";
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { defaultTo } from 'lodash';
import { unmarshall } from '@aws-sdk/util-dynamodb';

// import Middleware from "../util/Middleware";
import {BuildApiGatewayResponseJSON} from "../util/ApiResponseBuilder";
import {Auction} from "../types/Auction";
// import { TABLES } from "../constants/Tables";
import { REGION } from "../constants/Environments";

// allows acces to db functions
const dynamodb: DynamoDBClient = new DynamoDBClient({region: REGION});


export async function getAuctionById(id: string) : Promise<any> {

  let auctions: Object[];
  try {

    const queryCommand = new QueryCommand({
        TableName: "AuctionsTable-dev", 
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
          ":id": {S: id }
        }
      });

		const response = await dynamodb.send(queryCommand);
    auctions = defaultTo(response.Items, []).map((item) => unmarshall(item));

  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
  
  // return error if not found
  if (auctions.length < 1 ){
    console.log(`Auction with ID "${id}" not found!`);
    throw new Error(`Auction with ID "${id}" not found!`);
  } 

  return auctions[0];

}


// definition for lambda function
async function getAuction(event: APIGatewayProxyEventV2) {

  const { id } = event.pathParameters;

  let auction = await getAuctionById(id);
 
  return BuildApiGatewayResponseJSON(200, auction);
};
	
// exported as handler
export const handler = getAuction;
// export const handler = Middleware(getAuctions);


