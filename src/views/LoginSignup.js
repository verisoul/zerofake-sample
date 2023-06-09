import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

function LoginSignup() {
    const [accountIdentifier, setAccountIdentifier] = useState('');
    const [disabled, setDisabled] = useState(false);
    const navigate = useNavigate();

    const getTrackingId = async () => {
        // eslint-disable-next-line no-undef
        const verisoul = Verisoul || window.Verisoul;

        if (!verisoul) {
            console.log('Verisoul not found. Please make sure you have included the Verisoul script in your index.html file.');
            return;
        }

        try {
            const trackingId = await verisoul.getTrackingId();
            console.log('Tracking ID: ', trackingId);
            return trackingId;
        } catch (error) {
            console.log('Error getting tracking ID: ', error);
        }
    }

    const verisoulEnv = getVerisoulEnv();

    useEffect(() => {
        if (!verisoulEnv) {
            console.log('Verisoul environment not found. Please make sure you have included the Verisoul script in your index.html file.');
        }
    }, [verisoulEnv]);

    const getVerisoulEnv = () => {
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

        return env;
    };



    const handleSubmit = async (event) => {
        event.preventDefault();
        setDisabled(true);
        // eslint-disable-next-line no-undef
        const verisoul = Verisoul || window.Verisoul;

        if (!accountIdentifier) {
            setDisabled(false);
            return;
        }

        const trackingId = await getTrackingId();

        if (!trackingId) {
            setDisabled(false);
            return;
        }
        try {
            const response = await fetch('/api/authenticated', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tracking_id: trackingId,
                    auth_id: accountIdentifier
                })
            });

            /*
             Note: The logic below is for demonstration purposes only.
             The decision logic must be implemented on the backend.
             */

            const results = await response.json();
            const decision = results.decision;

            const urlParams = new URLSearchParams(window.location.search);
            const LTConfigID = urlParams.get('LTConfigID');
            const UDID = urlParams.get('UDID');

            const uuidv4 = () => {
                // for legacy browsers
                return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11)
                    .replace(/[018]/g, (c) =>
                        (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> (c / 4))).toString(16)
                    );
            };

            let error = null;
            let auth_id = uuidv4();

            console.log('Getting TrackingID');

            if (UDID == null) {
                try {
                    verisoul.onAuth(auth_id);

                    console.log('TrackingID:', trackingId);
                    console.log('AuthID:', auth_id);
                } catch (err) {
                    console.log('TrackingID not found:', err);
                    error = 'TrackingID not found';
                }

                const data = {
                    tracking_id: trackingId,
                    project_id: LTConfigID,
                    env: getVerisoulEnv(),
                    error: error,
                };

                try {
                    const response = await fetch('https://verisoul-lambdatest.herokuapp.com/sheets', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });

                    if (response.ok) {
                        const result = await response.json();
                        console.log('Success:', result);
                    } else {
                        throw new Error(`Server responded with error ${response.status}`);
                    }
                } catch (err) {
                    console.error('Error:', err);
                }
            } else {
                try {
                    verisoul.onAuth(auth_id);

                    console.log('TrackingID:', trackingId);
                    console.log('AuthID:', auth_id);
                } catch (err) {
                    console.log('TrackingID not found:', err);
                    error = 'TrackingID not found';
                }

                const data = {
                    tracking_id: trackingId,
                    config_id: LTConfigID,
                    UDID: UDID,
                    error: error,
                };

                try {
                    const response = await fetch('https://verisoul-lambdatest.herokuapp.com/udid', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });

                    if (response.ok) {
                        const result = await response.json();
                        console.log('Success:', result);
                    } else {
                        throw new Error(`Server responded with error ${response.status}`);
                    }
                } catch (err) {
                    console.error('Error:', err);
                }
            }


            if (decision === 'Real') {
                navigate('/real', {state: {results}});
            } else {
                navigate('/fake', {state: {results}});
            }


        } catch (error) {
            console.log('Error: ', error);
            setDisabled(false);
        }

    };

    return (
        <div>
            <h1>Login or Signup</h1>
            <form className="form" onSubmit={handleSubmit}>
                <label className="form__label" htmlFor="text-input">Account ID</label>
                <input className="form__input" type="text" id="text-input" name="text"
                       placeholder={"Enter account identifier"} value={accountIdentifier}
                       onChange={(e) => setAccountIdentifier(e.target.value)} disabled={disabled}></input>
                <button className="form__button" id="submit-button" type="submit">Submit</button>
            </form>
        </div>
    );
}

export default LoginSignup;
