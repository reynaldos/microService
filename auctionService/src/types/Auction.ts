export type Auction ={
  id: string,
  title: string,
  status: string,
  createdAt: string,
  endingAt: string
  highestBid: Bid,
  seller: string
}


export type Bid = {
  amount: number,
  bidder?: string
}

export type auctionStatus = 
  | 'OPEN'
  | 'CLOSED'