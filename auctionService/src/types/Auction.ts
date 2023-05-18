export type Auction ={
  id: string,
  title: string,
  status: string,
  createdAt: string,
  highestBid: Bid
}

export type AuctionRequest ={
  title: string
}

export type Bid = {
  amount: number,
  user?: string
}