import React, { useState, useEffect } from 'react';
import '../styles/TermsOfService.css';

const TermsOfService = ({ onAccept }) => {
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
    const [hasAccepted, setHasAccepted] = useState(false);
    const [emailOptOut, setEmailOptOut] = useState(false);

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
            console.log('Email opt out value:', emailOptOut);
            onAccept({ emailOptOut });
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
                <h2>Terms of Service</h2>
                <p><strong>Effective Date:</strong> January 1, 2025</p>

                <p>
                    These Terms and Conditions govern the use of the PetWise service and website
                    (collectively referred to as "the Service"). By using the Service, you agree to be
                    bound by these Terms and Conditions.
                </p>

                <h3>1. Acceptance of Terms</h3>
                <p>
                    By accessing or using PetWise, you acknowledge that you have read, understood, and
                    agree to be bound by these Terms and Conditions, including any additional terms,
                    conditions, or policies incorporated by reference.
                </p>

                <h3>2. Service Description</h3>
                <p>
                    PetWise is an AI-powered application designed to assist veterinary professionals in
                    generating detailed veterinary prognosis reports. The Service enables users to input
                    patient information (such as species, breed, weight, clinical findings) and receive
                    AI-generated veterinary reports based on the provided data.
                </p>

                <h3>3. User Responsibilities</h3>

                <h4>Accurate Information</h4>
                <p>
                    Users must provide accurate and complete information when using the Service. PetWise
                    is not responsible for any inaccuracies in the information provided by the user.
                </p>

                <h4>Verification by Licensed Veterinarian</h4>
                <p>
                    All veterinary reports generated by PetWise are intended for informational purposes
                    only and must be reviewed and verified by a licensed veterinarian. PetWise does not
                    provide veterinary advice or medical opinions and is not a substitute for
                    professional veterinary judgment.
                </p>

                <h4>Treatment Responsibility</h4>
                <p>
                    PetWise is not responsible for any treatments, diagnoses, or medical procedures
                    performed based on the information provided by the generated reports.
                </p>

                <h4>Inputting and Storing Data</h4>
                <p>
                    Users are solely responsible for the content they input, generate, or save using the
                    Service. The platform is not intended for storing sensitive or personally
                    identifiable information ("PII") about clients, including but not limited to names,
                    addresses, phone numbers, and email addresses.
                </p>
                <ul>
                    <li>Users agree not to input, store, or save any PII in reports or other fields.</li>
                    <li>
                        Any PII entered or saved by users is done at their own risk, and users agree to
                        comply with applicable privacy laws and regulations.
                    </li>
                    <li>
                        PetWise reserves the right to delete or anonymize data suspected of containing PII.
                    </li>
                    <li>
                        PetWise does not monitor, review, or verify the content input or stored by users.
                        Users are solely responsible for ensuring compliance with applicable laws regarding
                        the data they input.
                    </li>
                </ul>

                <h4>Consent for Third-Party Data</h4>
                <p>
                    Users must obtain all necessary consents from individuals whose data is input into
                    the Service. PetWise disclaims all liability for data input without proper
                    authorization or consent.
                </p>

                <h3>4. Subscription and Payment</h3>
                <h4>Free Trial</h4>
                <p>PetWise offers a 14-day free trial for new users.</p>

                <h4>Subscription Fees</h4>
                <p>Subscriptions are charged on a monthly or yearly basis, as selected by the user.</p>

                <h4>Refunds</h4>
                <p>
                    Refunds for subscription payments are only available under exceptional circumstances,
                    such as incorrect billing or technical issues that prevent access to the Service. If
                    you believe you are entitled to a refund, please contact our support team within 30
                    days of the charge.
                </p>

                <h4>No Refund for Report Generation</h4>
                <p>
                    Since PetWise provides digital content, all charges for report generation are
                    non-refundable. Users are encouraged to thoroughly review the Service during their
                    free trial.
                </p>

                <h3>5. Data Protection and Privacy</h3>
                <h4>Personal Information</h4>
                <p>
                    When signing up, PetWise collects personal information such as your name, email
                    address, and payment details through Auth0 and Stripe.
                </p>

                <h4>Veterinary Reports</h4>
                <p>
                    Users may input and store patient-related data (species, breed, diagnosis, etc.) for
                    generating reports. The Service is not designed to store client data (e.g., client
                    names, phone numbers, addresses), and users are advised not to include such
                    information in stored reports.
                </p>

                <h4>Data Storage and Retention</h4>
                <p>
                    All data is stored securely in Supabase databases with encryption in transit and at
                    rest.
                </p>
                <p>
                    PetWise retains user data as long as the user account remains active. Users may
                    delete their reports at any time, and deleted data will be permanently removed from
                    our servers. Upon account closure, all associated data will be permanently deleted
                    unless otherwise required by law.
                </p>

                <h4>Third-Party Services</h4>
                <p>
                    PetWise integrates with third-party services such as Auth0 for authentication and
                    Stripe for payment processing. PetWise is not responsible for any errors, issues, or
                    breaches occurring within these third-party services. Users are encouraged to review
                    the terms and privacy policies of these providers.
                </p>

                <h3>6. Limitation of Liability</h3>
                <p>To the fullest extent permitted by law:</p>
                <ul>
                    <li>
                        PetWise is not liable for any direct, indirect, incidental, special, or
                        consequential damages arising from the use of the Service.
                    </li>
                    <li>
                        PetWise is not responsible for the misuse of the platform by users, including the
                        storage or sharing of PII.
                    </li>
                    <li>
                        Users agree to indemnify and hold PetWise harmless from any claims or damages
                        arising from their use of the Service, including claims related to stored client or
                        patient information.
                    </li>
                    <li>
                        PetWise disclaims all liability for errors, omissions, or decisions made based on
                        AI-generated content.
                    </li>
                    <li>
                        PetWise is not liable for data loss, service interruptions, or technical issues.
                        Users are encouraged to back up their data regularly.
                    </li>
                </ul>

                <h3>7. Intellectual Property</h3>
                <p>
                    All content and services provided by PetWise, including AI-generated reports,
                    software code, and documentation, are the intellectual property of PetWise. Users
                    are granted a non-transferable, non-exclusive license to use the Service for its
                    intended purpose.
                </p>

                <h3>8. Prohibited Uses</h3>
                <ul>
                    <li>Use the Service for any unlawful purpose.</li>
                    <li>Attempt to manipulate or reverse engineer the Service.</li>
                    <li>
                        Input, store, or save sensitive or personally identifiable client data (e.g.,
                        names, addresses, phone numbers, email addresses).
                    </li>
                    <li>Use the Service to transmit harmful, defamatory, or unlawful content.</li>
                    <li>Store data obtained unlawfully or without proper authorization.</li>
                </ul>

                <h3>9. Modifications to Terms</h3>
                <p>
                    PetWise reserves the right to update these Terms and Conditions at any time. Changes
                    will be effective upon posting on the Service. Continued use of the Service
                    constitutes acceptance of the updated Terms.
                </p>

                <h3>10. Contact Information</h3>
                <p>For any questions or concerns, please contact us at: support@petwise.vet</p>

                <h2>Privacy Policy</h2>
                <p><strong>Effective Date:</strong> January 1, 2024</p>

                <h3>1. Data Collection</h3>
                <h4>Personal Information</h4>
                <p>
                    We collect personal information such as your name, email address, and payment details through secure integrations with <strong>Auth0</strong> for authentication and <strong>Stripe</strong> for payment processing. Additional optional profile information may also be collected to improve user experience.
                </p>

                <h4>Veterinary Reports</h4>
                <p>
                    Users may input and store patient-related data, such as species, breed, diagnosis, and treatment details, to generate reports. The Service is not intended for storing sensitive client data (e.g., client names, phone numbers, addresses), and users are strongly advised not to input such information.
                </p>

                <h4>Device and Usage Data</h4>
                <p>
                    We may collect technical data, including device type, IP address, browser type, and usage patterns, to improve the Service's functionality and security. This data is anonymized and used for analytical purposes only.
                </p>

                <h3>2. Data Usage</h3>
                <h4>User Authentication</h4>
                <p>We use <strong>Auth0</strong> to securely verify user identities and maintain secure account access.</p>

                <h4>Report Generation</h4>
                <p>
                    Data input into the platform is processed solely for creating detailed veterinary prognosis reports and is not shared with third parties for marketing or other purposes.
                </p>

                <h4>Subscription and Billing</h4>
                <p>Payment information is securely processed through <strong>Stripe</strong>, and we do not store credit card details on our servers.</p>

                <h4>Analytics and Improvements</h4>
                <p>
                    Anonymized and aggregated data may be used to identify trends, improve the Service, and ensure optimal performance.
                </p>

                <h3>3. Data Security and Retention</h3>
                <h4>Data Storage</h4>
                <p>All user data is securely stored using <strong>Supabase</strong>, with encryption applied during transmission and while at rest. Our systems are regularly updated to meet industry-leading security standards.</p>

                <h4>Reports Retention</h4>
                <p>
                    Reports are retained as long as your account remains active or until you delete them. Upon account deletion, all associated data, including veterinary reports, will be permanently removed unless retention is required by law (e.g., for tax or compliance reasons).
                </p>

                <h4>Access Controls</h4>
                <p>
                    Access to user data is restricted to authenticated users. Administrative access to system data is strictly limited to authorized personnel and audited regularly.
                </p>

                <h4>Incident Response</h4>
                <p>
                    In the unlikely event of a data breach, affected users will be notified promptly, and corrective measures will be taken immediately.
                </p>

                <h3>4. User Responsibility</h3>
                <ul>
                    <li>Ensure that any data input complies with applicable privacy laws and regulations.</li>
                    <li>Avoid storing sensitive or personally identifiable client information in reports or other fields.</li>
                    <li>Obtain proper consent from clients or patients before inputting any data into the Service.</li>
                </ul>

                <h3>5. International Customers</h3>
                <h4>Compliance with Global Standards</h4>
                <p>
                    PetWise is committed to complying with global data protection regulations, including:
                </p>
                <ul>
                    <li>
                        <strong>GDPR (General Data Protection Regulation):</strong> For users in the European Union, ensuring lawful data processing, user rights, and data portability.
                    </li>
                    <li>
                        <strong>PIPEDA (Personal Information Protection and Electronic Documents Act):</strong> For Canadian users, ensuring compliance with federal and provincial privacy laws.
                    </li>
                </ul>
                <p>Users outside these jurisdictions are encouraged to ensure compliance with their local data privacy regulations.</p>

                <h3>6. User Rights</h3>
                <p>We respect your rights to control your data. These include:</p>
                <ul>
                    <li><strong>Right to Access:</strong> Users may request a copy of their stored data.</li>
                    <li><strong>Right to Rectification:</strong> Users may request corrections to inaccuracies in their data.</li>
                    <li><strong>Right to Erasure:</strong> Users may request deletion of their personal data at any time.</li>
                    <li>
                        <strong>Right to Restriction:</strong> Users may limit the processing of their data in specific scenarios.
                    </li>
                </ul>
                <p>
                    Requests can be sent to <strong>support@petwise.vet</strong>, and we will respond within the timeframe required by applicable laws.
                </p>

                <h3>7. Third-Party Services</h3>
                <h4>Data Sharing</h4>
                <p>
                    PetWise integrates with trusted third-party services to provide seamless functionality:
                </p>
                <ul>
                    <li><strong>Auth0:</strong> For secure user authentication.</li>
                    <li><strong>Stripe:</strong> For processing payments and subscriptions securely.</li>
                </ul>
                <p>
                    We do not sell or share your data with any third-party advertisers. Each third-party service has its own privacy policies, and we encourage users to review them.
                </p>

                <h3>8. Cookies and Tracking</h3>
                <p>PetWise uses cookies to:</p>
                <ul>
                    <li>Enhance user experience by remembering preferences.</li>
                    <li>Track usage patterns and analyze performance for service improvements.</li>
                </ul>
                <p>
                    Users can control cookie preferences through browser settings. Disabling cookies may affect certain features of the Service.
                </p>

                <h3>9. Incident Reporting</h3>
                <p>
                    If you notice any suspicious activity related to your account or suspect a data breach, contact us immediately at <strong>support@petwise.vet</strong>. Our team will investigate and respond promptly.
                </p>

                <h3>10. Updates to Privacy Policy</h3>
                <p>
                    We may update this Privacy Policy to reflect changes in regulations, technology, or our practices. Updates will be posted on our website, and significant changes will be communicated via email to registered users.
                </p>

                <h3>Acknowledgment of Responsibility</h3>
                <p>
                    By using PetWise, you agree to:
                </p>
                <ul>
                    <li>Provide only necessary and lawful data.</li>
                    <li>Avoid storing sensitive or personally identifiable client information.</li>
                    <li>Take full responsibility for the accuracy and legality of any data you input or store on the platform.</li>
                </ul>

                <h3>Contact Us</h3>
                <p>
                    For questions, concerns, or requests regarding this Privacy Policy, please contact us at:
                </p>
                <p><strong>Email:</strong> support@petwise.vet</p>

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

                <label className="marketing-checkbox">
                    <input
                        type="checkbox"
                        checked={emailOptOut}
                        onChange={(e) => setEmailOptOut(e.target.checked)}
                    />
                    Don't send me promotional or marketing materials
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