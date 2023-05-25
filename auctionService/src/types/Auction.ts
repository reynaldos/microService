export type Auction ={
  id: string,
  title: string,
  status: string,
  createdAt: string,
  endingAt: string
  highestBid: Bid,
  seller: string,
  pictureUrl?: string
}


export type Bid = {
  amount: number,
  bidder?: string
}

export type auctionStatus = 
  | 'OPEN'
  | 'CLOSED'