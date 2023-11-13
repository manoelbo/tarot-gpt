function shuffleCards(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function drawTarotCards() {
    const majorArcana = [

        { name: "O Louco", image: "./a22.jpg" },
        { name: "O Mago", image: "./a01.jpg" },
        { name: "A Sacerdotisa", image: "./a02.jpg" },
        { name: "A Imperatriz", image: "./a03.jpg" },
        { name: "O Imperador", image: "./a04.jpg" },
        { name: "O Hierofante", image: "./a05.jpg" },
        { name: "Os Enamorados", image: "./a06.jpg" },
        { name: "O Carro", image: "./a07.jpg" },
        { name: "A Força", image: "./a08.jpg" },
        { name: "O Eremita", image: "./a09.jpg" },
        { name: "A Roda da Fortuna", image: "./a10.jpg" },
        { name: "A Justiça", image: "./a11.jpg" },
        { name: "O Pendurado", image: "./a12.jpg" },
        { name: "A Morte", image: "./a13.jpg" },
        { name: "A Temperança", image: "./a14.jpg" },
        { name: "O Diabo", image: "./a15.jpg" },
        { name: "A Torre", image: "./a16.jpg" },
        { name: "A Estrela", image: "./a17.jpg" },
        { name: "A Lua", image: "./a18.jpg" },
        { name: "O Sol", image: "./a19.jpg" },
        { name: "O Julgamento", image: "./a20.jpg" },
        { name: "O Mundo", image: "./a21.jpg" }
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

