export type Suit = "diamond" | "leaf" | "heart" | "clover";
export type Value = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "j" | "q" | "k" | "a";

export type Card = {
  suit: Suit;
  value: Value;
};
