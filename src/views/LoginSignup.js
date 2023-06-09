import React, {useState} from 'react';
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setDisabled(true);

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
