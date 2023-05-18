export type Auction ={
  id: string,
  title: string,
  status: string,
  createdAt: string,
  endingAt: string
  highestBid: Bid
}


export type Bid = {
  amount: number,
  user?: string
}