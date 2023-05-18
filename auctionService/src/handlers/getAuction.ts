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

// definition for lambda function
async function getAuctions(event: APIGatewayProxyEventV2) {

  const { id } = event.pathParameters;

  let auctions: Object[];
  try {

    const queryCommand = new QueryCommand({
        TableName: "AuctionsTable-dev", 
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
          ":id": {
              "S": id
      }}});

		const response = await dynamodb.send(queryCommand);
    auctions = defaultTo(response.Items, []).map((item) => unmarshall(item));

  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
  
  if (auctions.length < 1 ){
     throw new Error(`Auction with ID "${id}" not found!`);
  } 
 
  return BuildApiGatewayResponseJSON(200, auctions[0]);
};
	
// exported as handler
export const handler = getAuctions;
// export const handler = Middleware(getAuctions);


