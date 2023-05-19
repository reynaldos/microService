import { APIGatewayProxyEventV2  } from "aws-lambda";
import { DynamoDBClient, UpdateItemCommand, UpdateItemCommandOutput } from '@aws-sdk/client-dynamodb';
import { defaultTo } from 'lodash';
import { unmarshall } from '@aws-sdk/util-dynamodb';

import { Auction } from "../types/Auction";
import { REGION } from "../constants/Environments";


// allows acces to db functions
const dynamodb: DynamoDBClient = new DynamoDBClient({region: REGION});

export async function closeAuction(auctionID : string): Promise<UpdateItemCommandOutput> {

 const updateCommand = new UpdateItemCommand({
        TableName: "AuctionsTable-dev", 
        Key: { 
          id: {S: auctionID } 
        },
        UpdateExpression: 'SET #status = :status',
        ExpressionAttributeValues:{
          ":status" : { S: `CLOSED` },
        },
        ExpressionAttributeNames:{
          "#status" : "status"
        },
        ReturnValues: "ALL_NEW"
     });

    
		const response = await dynamodb.send(updateCommand);
    return response;
}