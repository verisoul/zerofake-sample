require("dotenv").config({ path: `.env` });
const express = require('express');
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

if (!process.env.VERISOUL_API_KEY) {
    throw new Error('VERISOUL_API_KEY not set');
}

const headers = {
    'x-api-key': process.env.VERISOUL_API_KEY,
    'Content-Type': 'application/json'
};

app.get('/', (req, res) => {
    res.send('Hello, World!');
});


app.post("/api/authenticated", async (req, res) => {
    try {
        const { tracking_id, auth_id } = req.body;

        console.log("Received request on server");
        console.log('Tracking ID: ', tracking_id);
        console.log('Auth ID: ', auth_id);

        const body = JSON.stringify({
            tracking_id,
            auth_id
        });

        // Determine the environment based on request headers
        let environment;
        const origin = req.headers.origin;
        if (origin === 'http://dev.verisoul.dev') {
            environment = 'dev';
        } else if (origin === 'http://staging.verisoul.dev') {
            environment = 'staging';
        } else if (origin === 'http://sandbox.verisoul.dev') {
            environment = 'sandbox';
        } else if (origin === 'http://prod.verisoul.dev'){
            environment = 'prod';
        } else {
            environment = 'dev';
        }

        const API_URL = `https://api.${environment}.verisoul.xyz/zerofake/`;

        // Make the API request using fetch or node-fetch
        const fetch = require('node-fetch');
        let response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            headers,
            body: body
        });

        let results = await response.json();

        res.status(200).send(results);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
