require("dotenv").config({path: `.env`});
const express = require('express');
const fetch = require('node-fetch');
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

if(!process.env.VERISOUL_API_KEY) {
    throw new Error('VERISOUL_API_KEY not set');
}
if(!process.env.REACT_APP_VERISOUL_ENV) {
    throw new Error('REACT_APP_VERISOUL_ENV not set');
}

const API_URL = `https://api.${process.env.REACT_APP_VERISOUL_ENV}.verisoul.xyz/zerofake/`;
const headers = {
    'x-api-key': process.env.VERISOUL_API_KEY,
    'Content-Type': 'application/json'
};

app.post("/api/authenticated", async (req, res) => {
    try {
        const {tracking_id, auth_id} = req.body;

        console.log("Received request on server")
        console.log('Tracking ID: ', tracking_id);
        console.log('Auth ID: ', auth_id);


        const body = JSON.stringify({
            tracking_id,
            auth_id
        })

        // See https://docs.verisoul.xyz/api/zerofake-api/fake-user-prediction
        let response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            headers,
            body: body
        });

        let results = await response.json();

        res.status(200).send(results);
    } catch (err) {
        res.status(500).send({error: err.message});
    }
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
