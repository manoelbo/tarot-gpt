const express = require("express");
const apiRoute = require("./routes/routes");
const path = require('path');
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const app = express();

app.use('/public', express.static(path.join(__dirname, '..', '..', 'public')));

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/whatsapp", apiRoute);

app.listen(PORT, () => { console.log("rodando no PORT" + PORT)});
