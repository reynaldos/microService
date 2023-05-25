import { APIGatewayProxyEventV2  } from "aws-lambda";
import { DynamoDBClient, UpdateItemCommand, UpdateItemCommandOutput } from '@aws-sdk/client-dynamodb';
import { SQSClient, SendMessageCommand   } from '@aws-sdk/client-sqs';
import { defaultTo } from 'lodash';
import { unmarshall } from '@aws-sdk/util-dynamodb';

import { Auction } from "../types/Auction";
import { REGION,MAIL_QUEUE_URL } from "../constants/Environments";


// allows acces to db functions
const dynamodb: DynamoDBClient = new DynamoDBClient({region: REGION});

// allows calls to queue
const sqsClient = new SQSClient({ region: REGION });

export async function closeAuction(auction : Auction): Promise<any> {

 const updateCommand = new UpdateItemCommand({
        TableName: "AuctionsTable-dev", 
        Key: { 
          id: {S: auction.id } 
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


    const { title, seller, highestBid } = auction;
    const { amount, bidder } = highestBid;

    
    // email statement for seller when no one bids
    let sendCommandSeller : SendMessageCommand;
    if (amount === 0){
      sendCommandSeller = new SendMessageCommand({
            QueueUrl: MAIL_QUEUE_URL,
            MessageBody: JSON.stringify({
              subject: 'No bids on your auction item :(',
              recipient: seller,
              body: `Your item "${title}" did not get any bids, better luck next time!`
            })
          });

      const sellerResponse =  await sqsClient.send(sendCommandSeller);
      return sellerResponse
    }


    sendCommandSeller = new SendMessageCommand({
      QueueUrl: MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: 'Your item has been sold!',
        recipient: seller,
        body: `Woohoo! Your item "${title}" has been sold for $${amount}.`
      })
    });

    const sendCommandBidder = new SendMessageCommand({
      QueueUrl: MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: 'You won an auction!',
        recipient: bidder,
        body: `What a great deal! You got yourself a "${title}" for $${amount}`
      })
    });

    const sellerResponse =  sqsClient.send(sendCommandSeller);
    const bidderResponse = sqsClient.send(sendCommandBidder);

    return Promise.all([sellerResponse, bidderResponse]);
}