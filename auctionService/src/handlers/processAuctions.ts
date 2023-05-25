import { getEndedAuctions } from "../util/GetEndedAuctions";
import { Auction } from "../types/Auction";
import { closeAuction } from "../util/CloseAuction";

// update all open auctions that need be closed 
async function processAuctions(event: any) {

  try {
    //get auctions that expired
    const auctionsToClose = await getEndedAuctions();

    // close all auctions async
    const closePromises: Promise<any>[] = auctionsToClose.map((auction : Auction) => closeAuction(auction));
    await Promise.all(closePromises);

    return {closed : closePromises.length};

  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
  
}

export const handler = processAuctions;