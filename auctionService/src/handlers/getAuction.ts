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

  let auction: Auction | {};
  try {

    const queryCommand = new QueryCommand({
        TableName: "AuctionsTable-dev", 
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
          ":id": {
              "S": id
      }}});

		const response = await dynamodb.send(queryCommand);
    auction = defaultTo(response.Items[0], {});

  } catch (error) {
    console.log(error);
    throw new Error(`Auction with ID "${id}" not found!`);
  }
  
  return BuildApiGatewayResponseJSON(200, auction);
};
	
// exported as handler
export const handler = getAuctions;
// export const handler = Middleware(getAuctions);


