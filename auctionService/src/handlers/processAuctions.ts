import { getEndedAuctions } from "../util/GetEndedAuctions";

// update all open auctions that need be closed 
async function processAuctions(event: any) {
  const auctionsToClose = await getEndedAuctions();
  console.log(auctionsToClose);
}

export const handler = processAuctions;