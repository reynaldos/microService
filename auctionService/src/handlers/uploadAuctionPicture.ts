import {  APIGatewayProxyEventV2  } from "aws-lambda";

import { getAuctionById } from "./getAuction";

import {BuildApiGatewayResponseJSON} from "../util/ApiResponseBuilder";
import { uploadPictureToS3 } from "../util/uploadPictureToS3";
import { setAuctionPictureUrl } from "../util/SetAuctionPicUrl";
import { Auction } from "../types/Auction";
// import { TABLES } from "../constants/Tables";
import { AUCTIONS_BUCKET_NAME } from "../constants/Environments";



// definition for lambda function
async function uploadAuctionPicture(event: APIGatewayProxyEventV2 | any) {

  const { id } = event.pathParameters;
  const authorizer : {email : string} = event.requestContext.authorizer
  const auction = await getAuctionById(id);

  const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');

  // validate auction onwership
  if(auction.seller !== authorizer.email){
    throw new Error('You are not the seller of this auction!');
  }

  let updatedAuction : Object;
  try {
    const picURL = await uploadPictureToS3(auction.id + '.jpg', buffer);
    updatedAuction = setAuctionPictureUrl(id, picURL);
    console.log(picURL);

  } catch (error) {
    console.log(error)
    throw new Error(error);
  }
 
 
  return BuildApiGatewayResponseJSON(201, {auction: updatedAuction});
};
	
// exported as handler
export const handler = uploadAuctionPicture;
