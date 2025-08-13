import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());


type Suit = "diamond" | "leaf" | "heart" | "clover";
type Value = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "j" | "q" | "k" | "a";

type Card = {
    suit: Suit;
    value: Value;
};

type Player = {
    hand: Card[];
    score: number;
};

let deck: Card[] = [];
let player: Player = { hand: [], score: 0 };
let dealer: Player = { hand: [], score: 0 };

function createDeck(): Card[] {
    const suits: Suit[] = ["diamond", "leaf", "heart", "clover"];
    const values: Value[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k", "a"];

    const newDeck: Card[] = [];

    for (const suit of suits)
        for (const value of values) 
            newDeck.push({ suit, value });

    return newDeck;
}

function shuffleDeck(deck: Card[]): Card[] {
    let j: number, x: Card, i: number;
    for (i = deck.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = deck[i]!;
        deck[i] = deck[j]!;
        deck[j] = x;
    }
    return deck;
}

function calculateScore(hand: Card[]): number {
    let score: number = 0;
  

    for (const card of hand) {
        if (card.value === 'a') {
            if(score + 11 > 21)
                score += 1;
        else
            score += 11; 
        } else if (['k', 'q', 'j'].includes(card.value)) {
            score += 10; 
        } else {
            score += parseInt(card.value);
        }
    }

    return score;
}

function startGame() {
    deck = createDeck();
    deck = shuffleDeck(deck);

    player.hand = [];
    player.score = 0;
    dealer.hand = [];
    dealer.score = 0;

    for (let i = 0; i < 2; i++) {
        player.hand.push(deck.pop()!);
        dealer.hand.push(deck.pop()!);
    }

    player.score = calculateScore(player.hand);
    dealer.score = calculateScore(dealer.hand);

    console.log("Player 1 cards:", player.score);
    console.log("Player 2 cards:", dealer.score);
    console.log("Remaining deck cards:", deck.length);
}

function hit(player: Player) {
    if (deck.length === 0) {
        deck = createDeck();
        deck = shuffleDeck(deck);
    }
    const card = deck.pop()!;
    player.hand.push(card);
    player.score = calculateScore(player.hand);
    console.log("New card:", card);
    console.log("New score:", player.score);
}



app.post("/start", (req, res) => {
    startGame();
    res.json({ player, dealer, remainingCards: deck.length });
});

app.post("/hit", (req, res) => {
    hit(player);
    res.json({ player, remainingCards: deck.length });
});

app.post("/stand", (req, res) => {
    while(dealer.score < 17) {
        hit(dealer);
    }
    res.json({ dealer, player, remainingCards: deck.length });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});