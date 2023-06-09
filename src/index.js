import React from 'react';
import {render} from 'react-dom';
import './index.css';
import App from './App';

const getVerisoulScriptURL = () => {
    const hostname = window.location.hostname;
    let env = '';

    if (hostname === 'dev.verisoul.dev') {
        env = 'dev';
    } else if (hostname === 'sandbox.verisoul.dev') {
        env = 'sandbox';
    } else if (hostname === 'prod.verisoul.dev') {
        env = 'prod';
    } else if (hostname === 'staging.verisoul.dev') {
        env = 'staging';
    } else {
        env = 'dev';
    }

    return `https://js.${env}.verisoul.xyz/bundle.js`;
};

/*
    Verisoul Script. This script is required for Verisoul to work.

    You can also include this tag directly in your index.html file.

    Feel free to use async or defer attributes. Make sure to handle the case where the script is not loaded yet.

    Make sure to include the verisoul-project-id attribute with your project ID.

 */
const script = document.createElement('script');
script.src = getVerisoulScriptURL();
script.setAttribute('verisoul-project-id', process.env.REACT_APP_VERISOUL_PROJECT_ID);
document.body.appendChild(script);

const root = document.getElementById('root');
render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    root
);
