import React, { useState, useEffect } from 'react';
import '../styles/TermsOfService.css';

const TermsOfService = ({ onAccept }) => {
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
    const [hasAccepted, setHasAccepted] = useState(false);

    useEffect(() => {
        const element = document.querySelector('.terms-content');
        if (element) {
            const checkScroll = () => {
                const scrolledToBottom =
                    Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) <= 1;
                setIsScrolledToBottom(scrolledToBottom);
            };

            // Check initial state
            checkScroll();

            // Add scroll listener
            element.addEventListener('scroll', checkScroll);

            // Cleanup
            return () => element.removeEventListener('scroll', checkScroll);
        }
    }, []);

    const handleAccept = () => {
        if (isScrolledToBottom && hasAccepted) {
            onAccept();
        }
    };

    return (
        <div className="terms-container">
            <h2>Terms of Service & Privacy Policy</h2>

            {!isScrolledToBottom && (
                <div className="scroll-notice">
                    Please scroll to the bottom to accept
                </div>
            )}

            <div className="terms-content">
                <h2>Terms and Conditions</h2>
                <p><strong>Effective Date: January 1, 2024</strong></p>

                <p>These Terms and Conditions govern the use of the PetwiseAI service and website (collectively referred to as "the Service"). By using the Service, you agree to be bound by these Terms and Conditions.</p>

                <h3>1. Acceptance of Terms</h3>
                <p>By accessing or using PetwiseAI, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions, including any additional terms, conditions, or policies incorporated by reference.</p>

                <h3>2. Service Description</h3>
                <p>PetwiseAI is an AI-powered application designed to assist veterinary professionals in generating detailed veterinary prognosis reports. The service enables users to input patient information (such as species, breed, weight, clinical findings) and receive AI-generated veterinary reports based on the provided data.</p>

                <h3>3. User Responsibilities</h3>
                <p><strong>Accurate Information:</strong> Users must provide accurate and complete information when using the Service. PetwiseAI is not responsible for any inaccuracies in the information provided by the user.</p>
                <p><strong>Verification by Licensed Veterinarian:</strong> All veterinary reports generated by PetwiseAI are intended for informational purposes only and must be reviewed and verified by a licensed veterinarian. PetwiseAI does not provide veterinary advice or medical opinions and is not a substitute for professional veterinary judgment.</p>
                <p><strong>Treatment Responsibility:</strong> PetwiseAI is not responsible for any treatments, diagnoses, or medical procedures performed based on the information provided by the generated reports.</p>

                <h3>4. Subscription and Payment</h3>
                <p><strong>Free Trial:</strong> PetwiseAI offers a 7-day free trial for new users.</p>
                <p><strong>Subscription Fees:</strong> Subscriptions are charged on a monthly or yearly basis, as selected by the user.</p>
                <p><strong>Refunds:</strong> All subscription fees are non-refundable except under exceptional circumstances.</p>

                <h3>5. Data Protection and Privacy</h3>
                <p>PetwiseAI is committed to safeguarding your personal data. Please refer to our Privacy Policy for details on how we collect, store, and protect your data.</p>

                <h3>6. Limitation of Liability</h3>
                <p>To the fullest extent permitted by law, PetwiseAI shall not be liable for any indirect, incidental, special, or consequential damages.</p>

                <h3>7. Prohibited Uses</h3>
                <p>Users agree not to:</p>
                <ul>
                    <li>Use the Service for any unlawful purpose</li>
                    <li>Attempt to manipulate or reverse engineer the Service</li>
                    <li>Use the Service to transmit harmful or defamatory content</li>
                </ul>

                <h3>8. Contact Information</h3>
                <p>Email: support@petwise.vet</p>

                <h2>Return and Refund Policy</h2>
                <p><strong>Effective Date: January 1, 2024</strong></p>

                <p>At PetwiseAI, we strive to provide the best service to veterinary professionals. Please read our return and refund policy carefully:</p>

                <h3>Trial and Subscription</h3>
                <p><strong>Free Trial:</strong> PetwiseAI offers a 7-day free trial for users to explore the premium features of the application. No charges will be applied during the trial period.</p>
                <p><strong>Subscription Charges:</strong> After the free trial period ends, users will be automatically charged based on their selected subscription plan (monthly or yearly). If you wish to cancel your subscription, please do so before the trial ends to avoid being charged.</p>

                <h3>Refunds</h3>
                <ul>
                    <li><strong>Subscription Payments:</strong> Refunds for subscription payments are only available under exceptional circumstances, such as incorrect billing or technical issues that prevent access to the service. If you believe you are entitled to a refund, please contact our support team at support@petwise.vet within 30 days of the charge.</li>
                    <li><strong>No Refund for Report Generation:</strong> Since PetwiseAI provides digital content, all charges for report generation are non-refundable. Please review the service thoroughly during your free trial to ensure it meets your needs.</li>
                </ul>

                <h3>Cancellation and Processing</h3>
                <p><strong>Cancellation:</strong> You may cancel your subscription at any time by visiting the Stripe Customer Portal from your profile settings. Once canceled, no further payments will be charged, and your access will continue until the end of the current billing period.</p>
                <p><strong>Refund Process:</strong> If approved, refunds will be processed via the original payment method within 10 business days. The refunded amount will not include any fees charged by third-party payment processors.</p>

                <h2>Data Protection Policy</h2>
                <p><strong>Effective Date: January 1, 2024</strong></p>

                <p>PetwiseAI is committed to safeguarding your privacy and ensuring the protection of your personal data. This policy explains how we collect, use, and protect the data you provide.</p>

                <h3>Data Collection</h3>
                <ul>
                    <li><strong>Personal Information:</strong> When signing up, we collect personal information, such as your name, email address, and payment details through Auth0 and Stripe.</li>
                    <li><strong>Veterinary Reports:</strong> We collect and store information related to veterinary reports, including patient details (species, breed, diagnosis, etc.), which are necessary to generate and store your reports.</li>
                </ul>

                <h3>Data Usage</h3>
                <ul>
                    <li><strong>User Authentication:</strong> We use Auth0 to securely authenticate users.</li>
                    <li><strong>Report Generation:</strong> Data is used to process and generate accurate reports.</li>
                    <li><strong>Subscription and Billing:</strong> Payment information is securely handled by Stripe.</li>
                </ul>

                <h3>Data Storage and Security</h3>
                <p>All data is stored securely in Supabase databases with encryption in transit and at rest. Access is restricted to authenticated users only.</p>

                <h3>International Customers</h3>
                <p>PetwiseAI is available to international users and complies with global data protection regulations, including GDPR for users in the European Union.</p>
            </div>

            <div className="terms-actions">
                <label className={`accept-checkbox ${!isScrolledToBottom ? 'disabled' : ''}`}>
                    <input
                        type="checkbox"
                        checked={hasAccepted}
                        onChange={(e) => setHasAccepted(e.target.checked)}
                        disabled={!isScrolledToBottom}
                    />
                    I have read and agree to the Terms of Service and Privacy Policy
                </label>

                <button
                    onClick={handleAccept}
                    disabled={!hasAccepted || !isScrolledToBottom}
                    className="accept-button"
                >
                    Accept & Continue
                </button>
            </div>
        </div>
    );
};

export default TermsOfService; 