function shuffleCards(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const FIREBASE_URL = "https://tarotgpt-a1289.web.app/images"

function drawTarotCards() {
    const majorArcana = [

        { name: "O Louco", image: `${FIREBASE_URL}/a22.jpg` },
        { name: "O Mago", image: `${FIREBASE_URL}/a01.jpg` },
        { name: "A Papisa", image: `${FIREBASE_URL}/a02.jpg` },
        { name: "A Imperatriz", image: `${FIREBASE_URL}/a03.jpg` },
        { name: "O Imperador", image: `${FIREBASE_URL}/a04.jpg` },
        { name: "O Papa", image: `${FIREBASE_URL}/a05.jpg` },
        { name: "O Namorado", image: `${FIREBASE_URL}/a06.jpg` },
        { name: "O Carro", image: `${FIREBASE_URL}/a07.jpg` },
        { name: "A Justiça", image: `${FIREBASE_URL}/a08.jpg` },
        { name: "O Eremita", image: `${FIREBASE_URL}/a09.jpg` },
        { name: "A Roda da Fortuna", image: `${FIREBASE_URL}/a10.jpg` },
        { name: "A Força", image: `${FIREBASE_URL}/a11.jpg` },
        { name: "O Enforcado", image: `${FIREBASE_URL}/a12.jpg` },
        { name: "O Arcano Sem Nome (A Morte)", image: `${FIREBASE_URL}/a13.jpg` },
        { name: "Temperança", image: `${FIREBASE_URL}/a14.jpg` },
        { name: "O Diabo", image: `${FIREBASE_URL}/a15.jpg` },
        { name: "A Torre", image: `${FIREBASE_URL}/a16.jpg` },
        { name: "A Estrela", image: `${FIREBASE_URL}/a17.jpg` },
        { name: "A Lua", image: `${FIREBASE_URL}/a18.jpg` },
        { name: "O Sol", image: `${FIREBASE_URL}/a19.jpg` },
        { name: "O Julgamento", image: `${FIREBASE_URL}/a20.jpg` },
        { name: "O Mundo", image: `${FIREBASE_URL}/a21.jpg` }
    ];

    shuffleCards(majorArcana);

    const drawnCards = majorArcana.slice(0, 3);

    return {
        past: drawnCards[0],
        present: drawnCards[1],
        future: drawnCards[2]
    };
}

const tarot = drawTarotCards()

module.exports = drawTarotCards;

