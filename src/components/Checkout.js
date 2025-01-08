import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import CancelSubscription from './CancelSubscription';
import { useAuth0 } from '@auth0/auth0-react';
import { supabase } from '../supabaseClient';
import '../styles/Checkout.css';
import '../styles/Profile.css';

const stripePromise = loadStripe(
    process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_STRIPE_PUBLIC_KEY_LIVE
        : process.env.REACT_APP_STRIPE_PUBLIC_KEY
);

const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://api.petwise.vet'
    : 'http://localhost:3001';

const Checkout = ({ onBack, user, subscriptionStatus }) => {
    const { logout } = useAuth0();
    const [subscriptionInterval, setSubscriptionInterval] = useState(null);

    useEffect(() => {
        const fetchSubscriptionInfo = async () => {
            if (!user?.sub) return;

            try {
                const response = await fetch(`${API_URL}/check-subscription/${user.sub}`, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                setSubscriptionInterval(data.subscription_interval);
            } catch (error) {
                console.error('Error fetching subscription info:', error);
            }
        };

        fetchSubscriptionInfo();
    }, [user]);

    const handleCheckout = async (planType) => {
        try {
            const stripe = await stripePromise;
            if (!stripe) throw new Error('Stripe failed to initialize');
            if (!user) throw new Error('No user data available');

            const response = await fetch(`${API_URL}/create-checkout-session`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user,
                    planType // This will be either 'monthly' or 'yearly'
                }),
            });

            const session = await response.json();
            if (!session || !session.id) {
                console.error('Invalid session:', session);
                return;
            }

            const result = await stripe.redirectToCheckout({ sessionId: session.id });
            if (result.error) {
                console.error(result.error.message);
            }
        } catch (error) {
            console.error('Checkout error:', error);
        }
    };

    const handleTrialActivation = async () => {
        try {
            console.log('Starting trial activation for user:', user.sub);

            const response = await fetch(`${API_URL}/activate-trial`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user.sub,
                    emailOptOut: false
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to activate trial');
            }

            console.log('Trial activation response:', data);

            if (data && data.length > 0) {
                const subscriptionResponse = await fetch(`${API_URL}/check-subscription/${user.sub}`, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const subscriptionData = await subscriptionResponse.json();
                setSubscriptionInterval(subscriptionData.subscription_interval);
            } else {
                throw new Error('No data returned from trial activation');
            }
        } catch (error) {
            console.error('Trial activation error:', error);
            alert(`Failed to activate trial: ${error.message}`);
        }
    };

    const makeRequest = async (url, options = {}) => {
        return fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
        });
    };

    return (
        <div className="checkout-container">
            <div className="checkout-options">
                <div className="checkout-header">
                    <h3>{subscriptionStatus === 'active' ? 'Manage Subscription' : 'Choose Your Plan'}</h3>
                    <p className="checkout-subtitle">
                        {subscriptionStatus === 'active' ? (
                            <>
                                Current Plan: {(() => {
                                    const planTypes = {
                                        trial: 'Free Trial (10 reports/day)',
                                        monthly: 'Monthly Plan',
                                        yearly: 'Yearly Plan'
                                    };
                                    return `${planTypes[subscriptionInterval] || 'Unknown Plan'} - Features Active`;
                                })()}
                            </>
                        ) : (
                            'Get full access to all premium features'
                        )}
                    </p>
                </div>

                <div className="checkout-pricing-container">
                    {/* Free Trial Card */}
                    <div className={`checkout-pricing-card free ${user.has_used_trial ? 'disabled' : ''}`}>
                        <div className="checkout-pricing-header">
                            <h3>14 Day Free Trial</h3>
                            <p className="checkout-price">$0<span>/mo</span></p>
                        </div>
                        <ul className="checkout-pricing-features">
                            <li>No credit card required</li>
                            <li>10 reports per day</li>
                            <li>Quick Query</li>
                        </ul>
                        <div className="checkout-footer">
                            <button
                                onClick={handleTrialActivation}
                                className="checkout-trial-button"
                                disabled={user.has_used_trial || subscriptionStatus === 'active'}
                            >
                                {user.has_used_trial ? 'Trial Used' : 'Start Free Trial'}
                            </button>
                        </div>
                    </div>

                    {/* Monthly Plan Card */}
                    <div className={`checkout-pricing-card ${subscriptionInterval === 'monthly' ? 'current' : ''}`}>
                        <div className="checkout-pricing-header">
                            <h3>Monthly</h3>
                            <p className="checkout-price">$129<span>/Vet/Month</span></p>
                        </div>
                        <ul className="checkout-pricing-features">
                            <li>Unlimited SOAP reports</li>
                            <li>Unlimited Quick Query</li>
                            <li>Saved reports</li>
                            <li>Priority support</li>

                        </ul>
                        <div className="checkout-footer">
                            <button
                                onClick={() => handleCheckout('monthly')}
                                className="checkout-subscribe-button"
                                disabled={subscriptionInterval === 'monthly' && !user.cancel_at_period_end}
                            >
                                {subscriptionInterval === 'monthly' ? 'Current Plan' : 'Sign Up Now'}
                            </button>
                        </div>
                    </div>

                    {/* Yearly Plan Card */}
                    <div className={`checkout-pricing-card ${subscriptionInterval === 'yearly' ? 'current' : ''}`}>
                        <div className="checkout-pricing-header">
                            <h3>Yearly</h3>
                            <p className="checkout-price">$89<span>/Vet/Month</span></p>
                            <p className="checkout-savings">Save 31%</p>
                        </div>
                        <ul className="checkout-pricing-features">
                            <li>Unlimited SOAP reports</li>
                            <li>Unlimited Quick Query</li>
                            <li>Saved reports</li>
                            <li>Priority support</li>

                        </ul>
                        <div className="checkout-footer">
                            <button
                                onClick={() => handleCheckout('yearly')}
                                className="checkout-subscribe-button"
                                disabled={subscriptionInterval === 'yearly' && !user.cancel_at_period_end}
                            >
                                {subscriptionInterval === 'yearly' ? 'Current Plan' : 'Sign Up Now'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="checkout-footer">
                    <button onClick={onBack} className="checkout-back-button">
                        ← Back
                    </button>
                    {subscriptionStatus === 'active' && (
                        <CancelSubscription
                            user={user}
                            onCancel={async () => {
                                const response = await fetch(`${API_URL}/check-subscription/${user.sub}`, {
                                    credentials: 'include',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                });
                                const data = await response.json();
                                setSubscriptionInterval(data.subscription_interval);
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Checkout;
