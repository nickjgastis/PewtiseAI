import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import '../styles/HomePage.css'; // Import the CSS file

const HomePage = () => {
    const { loginWithRedirect } = useAuth0();

    useEffect(() => {
        const sections = document.querySelectorAll('.fade-in-section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                }
            });
        }, { threshold: 0.5 });

        sections.forEach((section) => {
            observer.observe(section);
        });
    }, []);

    const signUpOptions = {
        authorizationParams: {
            screen_hint: "signup"
        }
    };

    return (
        <div className="page-content">
            <header className="hero-section">
                <div className="hero-text fade-in-section">
                    <h1>Create Veterinary Medical Records In Seconds</h1>
                    <p>Petwise AI: Save 90% of your medical record entry time. Let AI do the work.</p>
                </div>
                <div className="hero-features fade-in-section">
                    <div className="features-card">
                        <div className="features-content">
                            <h3>Minimal Data Entry</h3>

                            <h4>Report generates:</h4>
                            <ul>
                                <li>Diagnostic Plan</li>
                                <li>Assessment</li>
                                <li>Diagnosis</li>
                                <li>Differential diagnosis</li>
                                <li>Treatment Plan
                                    <ul>
                                        <li>Drug names, dosages, interval</li>
                                    </ul>
                                </li>
                                <li>Expected Course/Prognosis</li>
                                <li>Client Communications/Recommendations
                                    <ul>
                                        <li>Drug side effects/interactions</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <button onClick={() => loginWithRedirect(signUpOptions)} className="cta-button">
                            Start Your Free Trial - No Credit Card Required
                        </button>
                    </div>
                </div>
            </header>

            <section className="trusted-section fade-in-section">
                <h2>Trusted by Veterinary Professionals Worldwide</h2>
                <p>Join the growing community of satisfied Petwise AI users.</p>
                <div className="trusted-stats">
                    <div className="stat-box">
                        <h3>10+</h3>
                        <p>Clinics</p>
                    </div>
                    <div className="stat-box">
                        <h3>100+</h3>
                        <p>Veterinarians</p>
                    </div>
                    <div className="stat-box">
                        <h3>1M+</h3>
                        <p>Reports Generated</p>
                    </div>
                </div>
            </section>

            <section className="how-it-works fade-in-section">
                <h2>How Petwise AI Works</h2>
                <div className="steps">
                    <div className="step">
                        <h3>1. Sign Up</h3>
                        <p>Create your account and start your free 1-month trial.</p>
                    </div>
                    <div className="step">
                        <h3>2. Input Data</h3>
                        <p>Enter patient details and clinical findings quickly and easily.</p>
                    </div>
                    <div className="step">
                        <h3>3. Generate Report</h3>
                        <p>Get comprehensive, AI-driven veterinary reports in seconds.</p>
                    </div>
                </div>
            </section>
            <section className="video-section fade-in-section">
                <h2>See Petwise AI in Action</h2>
                <div className="video-container">
                    <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                        title="Petwise AI Demo"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen>
                    </iframe>
                </div>
            </section>

            <section className="testimonials fade-in-section">
                <h2>What Our Users Say</h2>
                <div className="testimonial-container">
                    <div className="testimonial">
                        <p>"Petwise AI has transformed our clinic's efficiency. It's like having an expert assistant always at hand."</p>
                        <h4>Dr. Emily Chen</h4>
                        <p>Small Animal Specialist</p>
                    </div>
                    <div className="testimonial">
                        <p>"The accuracy and depth of the reports generated by Petwise AI are impressive. It's a game-changer for our practice."</p>
                        <h4>Dr. Michael Rodriguez</h4>
                        <p>Veterinary Surgeon</p>
                    </div>
                </div>
            </section>


            <section className="pricing fade-in-section">
                <h2>Choose Your Plan</h2>
                <div className="pricing-container">
                    <div className="pricing-card">
                        <h3>Free Trial</h3>
                        <p className="price">7 Days</p>
                        <ul>
                            <li>Full access to all features</li>
                            <li>No credit card required</li>
                        </ul>
                        <button onClick={() => loginWithRedirect(signUpOptions)} className="pricing-button">Start Free Trial</button>
                    </div>
                    <div className="pricing-card">
                        <h3>Single Device</h3>
                        <p className="price">$70/month</p>
                        <ul>
                            <li>Unlimited reports</li>
                            <li>24/7 support</li>
                            <li>Regular updates</li>
                        </ul>
                        <button onClick={() => loginWithRedirect(signUpOptions)} className="pricing-button">Choose Plan</button>
                    </div>
                    <div className="pricing-card">
                        <h3>Clinic Plan</h3>
                        <p className="price">$1000/month</p>
                        <ul>
                            <li>Unlimited devices</li>
                            <li>Priority support</li>
                            <li>Custom integrations</li>
                        </ul>
                        <button onClick={() => loginWithRedirect(signUpOptions)} className="pricing-button">Contact Sales</button>
                    </div>
                </div>
            </section>

            <footer className="homepage-footer fade-in-section">
                <p>&copy; 2024 Petwise AI. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default HomePage;
