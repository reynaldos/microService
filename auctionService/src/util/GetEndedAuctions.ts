import { DynamoDBClient, QueryCommand} from '@aws-sdk/client-dynamodb';
import { defaultTo } from 'lodash';
import { unmarshall } from '@aws-sdk/util-dynamodb';

import { REGION } from "../constants/Environments";

// allows acces to db functions
const dynamodb: DynamoDBClient = new DynamoDBClient({region: REGION});

export async function getEndedAuctions() {
  const now = new Date();

  let auctions: Object[];
  const queryCommand = new QueryCommand({
    TableName: "AuctionsTable-dev", 
    IndexName: "statusAndEndDate",
    KeyConditionExpression: "#status = :status AND endingAt <= :now",
    ExpressionAttributeValues: {
      ':status' : {S: 'OPEN'},
      ':now' : {S: now.toISOString()}
    },
    ExpressionAttributeNames:{
      '#status': 'status'
    }
  });

  const response = await dynamodb.send(queryCommand);
  auctions = defaultTo(response.Items, []).map((item) => unmarshall(item));

  return auctions;
  
}



