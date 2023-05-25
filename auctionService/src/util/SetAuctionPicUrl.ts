import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

import { REGION } from "../constants/Environments";
import { Auction } from '../types/Auction';


// allows acces to db functions
const dynamodb: DynamoDBClient = new DynamoDBClient({region: REGION});


export async function setAuctionPictureUrl(
  id: string,
  pictureUrl: string
) {

 let updatedAuction: Record<string, any> | Auction;
  const updateCommand = new UpdateItemCommand({
      TableName: "AuctionsTable-dev", 
      Key: { 
        id: {S: id } 
      },
      UpdateExpression: 'SET pictureUrl = :pictureUrl',
      ExpressionAttributeValues:{
        ":pictureUrl" : { S: `${pictureUrl}` },
      },
      ReturnValues: 'ALL_NEW'
    });

  
  const response = await dynamodb.send(updateCommand);
  updatedAuction = unmarshall(response.Attributes);
  return updatedAuction;
}