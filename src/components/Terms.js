import React, { useEffect } from 'react';
import '../styles/Legal.css';
import Footer from './Footer';

const Terms = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;    // For Safari
        document.documentElement.scrollTop = 0;  // For Chrome, Firefox, IE and Opera
    }, []);

    return (
        <>
            <div className="legal-container">


                <div className="legal-content">
                    <section>
                        <h2>Terms of Service</h2>
                        <p><strong>Effective Date:</strong> January 1, 2024</p>
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
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Terms; 