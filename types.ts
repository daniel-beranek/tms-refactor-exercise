type PlayId = "hamlet" | "as-like" | "othello";
type PlayName = "Hamlet" | "As You Like It" | "Othello";
type PlayType = "tragedy" | "comedy";
type Play = {
  name: PlayName;
  type: PlayType;
};
export type Plays = Record<PlayId, Play>;

type Customer = "BigCo";
type Performance = {
  playID: PlayId;
  audience: number;
};

export type Invoice = {
  customer: Customer;
  performances: Performance[];
};

export type GetResult = (props: {
  customer: Customer;
  performances: {
    playName: PlayName;
    audience: number;
    amount: number;
  }[];
  totalAmount: number;
  volumeCredits: number;
}) => string;
