import React, { useState, useEffect, useRef } from 'react';
import '../styles/ReportForm.css';
import GenerateReport from './GenerateReport';
import { useAuth0 } from "@auth0/auth0-react";
import { supabase } from '../supabaseClient';

const ReportForm = () => {
    const { user, isAuthenticated } = useAuth0();
    const [patientInfoSubmitted, setPatientInfoSubmitted] = useState(false);

    // Patient Info State
    const [patientName, setPatientName] = useState(() => localStorage.getItem('patientName') || '');
    const [species, setSpecies] = useState(() => localStorage.getItem('species') || '');
    const [sex, setSex] = useState(() => localStorage.getItem('sex') || '');
    const [breed, setBreed] = useState(() => localStorage.getItem('breed') || '');
    const [colorMarkings, setColorMarkings] = useState(() => localStorage.getItem('colorMarkings') || '');
    const [weight, setWeight] = useState(() => localStorage.getItem('weight') || '');
    const [weightUnit, setWeightUnit] = useState(() => localStorage.getItem('weightUnit') || 'lbs');
    const [birthdate, setBirthdate] = useState(() => localStorage.getItem('birthdate') || '');
    const [ownerName, setOwnerName] = useState(() => localStorage.getItem('ownerName') || '');
    const [address, setAddress] = useState(() => localStorage.getItem('address') || '');
    const [telephone, setTelephone] = useState(() => localStorage.getItem('telephone') || '');

    // Exam Info State
    const [examDate, setExamDate] = useState(() => localStorage.getItem('examDate') || '');
    const [staff, setStaff] = useState(() => localStorage.getItem('staff') || '');
    const [presentingComplaint, setPresentingComplaint] = useState(() => localStorage.getItem('presentingComplaint') || '');
    const [history, setHistory] = useState(() => localStorage.getItem('history') || '');
    const [physicalExamFindings, setPhysicalExamFindings] = useState(() => localStorage.getItem('physicalExamFindings') || `General Appearance: Bright, Alert, Responsive
T: °F, Normal
P:
R:
Body Condition Score: 5/9 (Ideal=5/9)
Mucous Membranes: Pink, moist
Capillary Refill Time: <2 seconds
Eyes, Ears, Nose, Throat (EENT): Within normal limits
Oral Cavity: Gd. 1 tartar
Heart: No murmur, no arrhythmia auscultated
Lungs: Clear on auscultation, no abnormal sounds
Abdomen Palpation: Within normal limits, no pain or abnormalities detected
Lymph Nodes: Palpable and within normal limits
Integumentary (Skin and Coat): Normal, no lesions, masses, or abnormalities detected
Musculoskeletal: No lameness, no pain on palpation
Neurologic: Alert and responsive, normal reflexes
Urogenital: Within normal limits, no abnormalities noted`);
    const [diagnosticPlan, setDiagnosticPlan] = useState(() => localStorage.getItem('diagnosticPlan') || '');
    const [labResults, setLabResults] = useState(() => localStorage.getItem('labResults') || '');
    const [assessment, setAssessment] = useState(() => localStorage.getItem('assessment') || '');
    const [diagnosis, setDiagnosis] = useState(() => localStorage.getItem('diagnosis') || '');
    const [differentialDiagnosis, setDifferentialDiagnosis] = useState(() => localStorage.getItem('differentialDiagnosis') || '');
    const [treatment, setTreatment] = useState(() => localStorage.getItem('treatment') || '');
    const [clientCommunications, setClientCommunications] = useState(() => localStorage.getItem('clientCommunications') || '');
    const [planFollowUp, setPlanFollowUp] = useState(() => localStorage.getItem('planFollowUp') || '');

    // Loading and error states
    const [loading, setLoading] = useState(false);
    const [reportText, setReportText] = useState(() => localStorage.getItem('currentReportText') || '');
    const [previewVisible, setPreviewVisible] = useState(() => localStorage.getItem('previewVisible') === 'true');
    const [error, setError] = useState('');

    const [savedMessageVisible, setSavedMessageVisible] = useState(false);
    const [copiedMessageVisible, setCopiedMessageVisible] = useState(false);
    const [copyButtonText, setCopyButtonText] = useState('Copy to Clipboard');

    const [customBreed, setCustomBreed] = useState('');
    const [isCustomBreed, setIsCustomBreed] = useState(false);

    const isGenerating = useRef(false); // Track if report generation is ongoing

    const speciesOptions = ['Canine', 'Feline', 'Avian', 'Reptile', 'Bovine', 'Equine', 'Ovine', 'Porcine'];
    const sexOptions = ['Female Spayed', 'Female Intact', 'Male Neutered', 'Male Intact'];

    const dogBreeds = [
        'Australian Shepherd', 'Beagle', 'Bernese Mountain Dog', 'Bichon Frise', 'Border Collie', 'Boston Terrier',
        'Boxer', 'Bulldog', 'Cavalier King Charles Spaniel', 'Chihuahua', 'Cocker Spaniel', 'Collie',
        'Dachshund', 'Dalmatian', 'Doberman Pinscher', 'English Cocker Spaniel', 'English Springer Spaniel', 'French Bulldog',
        'German Shepherd', 'Golden Retriever', 'Great Dane', 'Havanese', 'Irish Setter', 'Jack Russell Terrier',
        'Labrador Retriever', 'Maltese', 'Miniature Pinscher', 'Miniature Schnauzer', 'Newfoundland', 'Pekingese',
        'Pembroke Welsh Corgi', 'Pomeranian', 'Poodle', 'Portuguese Water Dog', 'Pug', 'Rottweiler', 'Samoyed',
        'Schipperke', 'Shiba Inu', 'Shih Tzu', 'Siberian Husky', 'Soft-Coated Wheaten Terrier', 'Staffordshire Bull Terrier',
        'Standard Schnauzer', 'Weimaraner', 'West Highland White Terrier', 'Whippet', 'Wire Fox Terrier', 'Yorkshire Terrier'
    ];

    const felineBreeds = [
        'Domestic Long Hair', 'Domestic Short Hair', 'Domestic Medium Hair',
        'Abyssinian', 'American Curl', 'American Shorthair', 'Bengal', 'Birman',
        'Bombay', 'British Shorthair', 'Burmese', 'Burmilla', 'Chartreux', 'Cornish Rex',
        'Devon Rex', 'Egyptian Mau', 'Exotic Shorthair', 'Havana Brown', 'Himalayan',
        'Japanese Bobtail', 'Javanese', 'Khao Manee', 'Korat', 'LaPerm', 'Lykoi',
        'Maine Coon', 'Manx', 'Norwegian Forest Cat', 'Ocicat', 'Oriental Shorthair',
        'Persian', 'Peterbald', 'Pixie-Bob', 'Ragamuffin', 'Ragdoll', 'Russian Blue',
        'Savannah', 'Scottish Fold', 'Selkirk Rex', 'Serengeti', 'Siamese', 'Siberian',
        'Singapura', 'Snowshoe', 'Somali', 'Sphynx', 'Thai', 'Tonkinese',
        'Toyger', 'Turkish Angora', 'Turkish Van'
    ];

    // Set breed options based on species
    const breedOptions = species === 'Canine' ? dogBreeds : species === 'Feline' ? felineBreeds : [];

    useEffect(() => {
        const savedReportText = localStorage.getItem('currentReportText');
        const savedPreviewVisible = localStorage.getItem('previewVisible') === 'true';

        if (savedReportText !== null && savedReportText !== '') {
            setReportText(savedReportText);
        }

        setPreviewVisible(savedPreviewVisible);
    }, []);

    useEffect(() => {
        localStorage.setItem('currentReportText', reportText);
        localStorage.setItem('previewVisible', previewVisible.toString());
        localStorage.setItem('patientName', patientName);
    }, [reportText, previewVisible, patientName]);

    // Submit patient info
    const handlePatientInfoSubmit = (e) => {
        e.preventDefault();
        setPatientInfoSubmitted(true);
    };

    // Go back to patient info form
    const handleBackToPatientInfo = () => {
        setPatientInfoSubmitted(false);
    };

    // Submit exam info and generate report
    const handleExamSubmit = async (e) => {
        e.preventDefault();
        if (isGenerating.current) return; // Prevent multiple submissions
        setLoading(true);
        isGenerating.current = true;

        try {
            const inputs = {
                patientName, species, sex, breed, colorMarkings, weight, weightUnit, birthdate, ownerName, address, telephone,
                examDate, staff, presentingComplaint, history, physicalExamFindings, diagnosticPlan, labResults,
                assessment, diagnosis, differentialDiagnosis, treatment, clientCommunications, planFollowUp
            };

            const generatedReport = await GenerateReport(inputs);
            setReportText(generatedReport);
            setPreviewVisible(true);
            localStorage.setItem('currentReportText', generatedReport);
            localStorage.setItem('previewVisible', 'true');
            localStorage.setItem('patientName', patientName);
        } catch (error) {
            setError(error.message || 'An error occurred while generating the report.');
        } finally {
            setLoading(false);
            isGenerating.current = false;
        }
    };

    const saveReport = async () => {
        if (!isAuthenticated) {
            setError("Please log in to save the report.");
            return;
        }

        try {
            // Get user's UUID from users table using auth0_user_id directly
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('id')
                .eq('auth0_user_id', user.sub)
                .single();

            if (userError || !userData) {
                // console.error("Error fetching user:", userError);
                throw new Error("User not found in Supabase.");
            }

            const userId = userData.id; // This is the user's internal ID
            // console.log("User ID fetched:", userId); // Log user ID

            // console.log(userId)
            // Save report with user's UUID
            const { data, error: insertError } = await supabase
                .from('saved_reports')
                .insert([{
                    user_id: userId, // Ensure this matches the policy check
                    report_name: `${patientName} - ${new Date().toLocaleString()}` || `Report ${new Date().toLocaleString()}`,
                    report_text: reportText
                }]);

            if (insertError) {
                console.error("Insert error:", insertError); // Log error details
                throw insertError;
            }

            setSavedMessageVisible(true);
            setTimeout(() => setSavedMessageVisible(false), 2000);
            console.log("Report saved successfully to Supabase:", data);
        } catch (error) {
            console.error("Error saving report:", error);
            setError("Failed to save report. Please try again.");
        }
    };




    const clearPatientInfo = () => {
        setPatientName('');
        setSpecies('');
        setSex('');
        setBreed('');
        setColorMarkings('');
        setWeight('');
        setWeightUnit('lbs');
        setBirthdate('');
        setOwnerName('');
        setAddress('');
        setTelephone('');
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(reportText).then(() => {
            setCopyButtonText('Copied!');
            setCopiedMessageVisible(true);
            setTimeout(() => {
                setCopyButtonText('Copy to Clipboard');
                setCopiedMessageVisible(false);
            }, 2000); // Reset after 2 seconds
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };

    const resetEntireForm = () => {
        // Reset patient info
        setPatientName('');
        setSpecies('');
        setSex('');
        setBreed('');
        setColorMarkings('');
        setWeight('');
        setWeightUnit('lbs');
        setBirthdate('');
        setOwnerName('');
        setAddress('');
        setTelephone('');

        // Reset exam info
        setExamDate('');
        setStaff('');
        setPresentingComplaint('');
        setHistory('');
        setPhysicalExamFindings(`General Appearance: Bright, Alert, Responsive
T: °F, Normal
P:
R:
Body Condition Score: 5/9 (Ideal=5/9)
Mucous Membranes: Pink, moist
Capillary Refill Time: <2 seconds
Eyes, Ears, Nose, Throat (EENT): Within normal limits
Oral Cavity: Gd. 1 tartar
Heart: No murmur, no arrhythmia auscultated
Lungs: Clear on auscultation, no abnormal sounds
Abdomen Palpation: Within normal limits, no pain or abnormalities detected
Lymph Nodes: Palpable and within normal limits
Integumentary (Skin and Coat): Normal, no lesions, masses, or abnormalities detected
Musculoskeletal: No lameness, no pain on palpation
Neurologic: Alert and responsive, normal reflexes
Urogenital: Within normal limits, no abnormalities noted`);
        setDiagnosticPlan('');
        setLabResults('');
        setAssessment('');
        setDiagnosis('');
        setDifferentialDiagnosis('');
        setTreatment('');
        setClientCommunications('');
        setPlanFollowUp('');

        // Reset other states
        setPatientInfoSubmitted(false);
        setReportText('');
        setPreviewVisible(false);
        setError('');
        setLoading(false);
    };

    const handleBreedChange = (e) => {
        const selectedBreed = e.target.value;
        if (selectedBreed === 'custom') {
            setIsCustomBreed(true);
            setBreed('');
        } else {
            setIsCustomBreed(false);
            setBreed(selectedBreed);
        }
    };

    const handleCustomBreedChange = (e) => {
        setCustomBreed(e.target.value);
        setBreed(e.target.value);
    };

    useEffect(() => {
        // Save all form fields to localStorage
        localStorage.setItem('species', species);
        localStorage.setItem('sex', sex);
        localStorage.setItem('breed', breed);
        localStorage.setItem('colorMarkings', colorMarkings);
        localStorage.setItem('weight', weight);
        localStorage.setItem('weightUnit', weightUnit);
        localStorage.setItem('birthdate', birthdate);
        localStorage.setItem('ownerName', ownerName);
        localStorage.setItem('address', address);
        localStorage.setItem('telephone', telephone);

        // Exam info
        localStorage.setItem('examDate', examDate);
        localStorage.setItem('staff', staff);
        localStorage.setItem('presentingComplaint', presentingComplaint);
        localStorage.setItem('history', history);
        localStorage.setItem('physicalExamFindings', physicalExamFindings);
        localStorage.setItem('diagnosticPlan', diagnosticPlan);
        localStorage.setItem('labResults', labResults);
        localStorage.setItem('assessment', assessment);
        localStorage.setItem('diagnosis', diagnosis);
        localStorage.setItem('differentialDiagnosis', differentialDiagnosis);
        localStorage.setItem('treatment', treatment);
        localStorage.setItem('clientCommunications', clientCommunications);
        localStorage.setItem('planFollowUp', planFollowUp);
    }, [species, sex, breed, colorMarkings, weight, weightUnit, birthdate,
        ownerName, address, telephone, examDate, staff, presentingComplaint,
        history, physicalExamFindings, diagnosticPlan, labResults, assessment,
        diagnosis, differentialDiagnosis, treatment, clientCommunications, planFollowUp]);

    return (
        <div className="report-container">
            {!patientInfoSubmitted ? (
                <form className="report-form" onSubmit={handlePatientInfoSubmit}>
                    <h2>Patient Info</h2>

                    <label className="form-label">Patient Name:</label>
                    <input type="text" className="form-input" value={patientName} onChange={(e) => setPatientName(e.target.value)} />

                    <label className="form-label">Species:</label>
                    <select className="form-input" value={species} onChange={(e) => setSpecies(e.target.value)}>
                        <option value="">Select Species</option>
                        {speciesOptions.map((species, index) => (
                            <option key={index} value={species}>{species}</option>
                        ))}
                    </select>

                    <label className="form-label">Sex:</label>
                    <select className="form-input" value={sex} onChange={(e) => setSex(e.target.value)}>
                        <option value="">Select Sex</option>
                        {sexOptions.map((sex, index) => (
                            <option key={index} value={sex}>{sex}</option>
                        ))}
                    </select>

                    <label className="form-label">Breed:</label>
                    <select className="form-input" value={isCustomBreed ? 'custom' : breed} onChange={handleBreedChange}>
                        <option value="">Select Breed</option>
                        <option value="custom">Other (specify)</option>
                        {breedOptions.map((breed, index) => (
                            <option key={index} value={breed}>{breed}</option>
                        ))}
                    </select>
                    {isCustomBreed && (
                        <input
                            type="text"
                            className="form-input"
                            value={customBreed}
                            onChange={handleCustomBreedChange}
                            placeholder="Enter custom breed"
                        />
                    )}

                    <label className="form-label">Color/Markings:</label>
                    <input type="text" className="form-input" value={colorMarkings} onChange={(e) => setColorMarkings(e.target.value)} />

                    <label className="form-label">Weight:</label>
                    <div className="weight-input">
                        <input type="number" className="form-input" value={weight} onChange={(e) => setWeight(e.target.value)} />
                        <select className="form-select" value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)}>
                            <option value="lbs">lbs</option>
                            <option value="kg">kg</option>
                        </select>
                    </div>

                    <label className="form-label">Birthdate:</label>
                    <input type="date" className="form-input" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />

                    <label className="form-label">Owner Name:</label>
                    <input type="text" className="form-input" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />

                    <label className="form-label">Address:</label>
                    <input type="text" className="form-input" value={address} onChange={(e) => setAddress(e.target.value)} />

                    <label className="form-label">Telephone:</label>
                    <input type="text" className="form-input" value={telephone} onChange={(e) => setTelephone(e.target.value)} />

                    <div className="button-container">
                        <button type="submit" className="submit-button">
                            Continue to Exam Info
                        </button>
                        <button type="button" className="clear-button" onClick={clearPatientInfo}>
                            Clear Form
                        </button>
                    </div>
                </form>
            ) : (
                <form className="report-form" onSubmit={handleExamSubmit}>
                    <h2>Exam Info</h2>

                    <label className="form-label">Exam Date:</label>
                    <input type="date" className="form-input" value={examDate} onChange={(e) => setExamDate(e.target.value)} />

                    <label className="form-label">Staff:</label>
                    <input type="text" className="form-input" value={staff} onChange={(e) => setStaff(e.target.value)} />

                    <label className="form-label">Presenting Complaint:</label>
                    <textarea className="form-input" value={presentingComplaint} onChange={(e) => setPresentingComplaint(e.target.value)} />

                    <label className="form-label">History:</label>
                    <textarea className="form-input" value={history} onChange={(e) => setHistory(e.target.value)} />

                    <label className="form-label">Physical Exam Findings:</label>
                    <textarea
                        className="form-input physical-exam-input"
                        value={physicalExamFindings}
                        onChange={(e) => setPhysicalExamFindings(e.target.value)}
                        style={{ whiteSpace: 'pre-wrap' }}
                    />

                    <label className="form-label">Diagnostic Plan:</label>
                    <textarea className="form-input" value={diagnosticPlan} onChange={(e) => setDiagnosticPlan(e.target.value)} />

                    <label className="form-label">Lab Results:</label>
                    <textarea className="form-input" value={labResults} onChange={(e) => setLabResults(e.target.value)} />

                    <label className="form-label">Assessment:</label>
                    <textarea className="form-input" value={assessment} onChange={(e) => setAssessment(e.target.value)} />

                    <label className="form-label">Diagnosis:</label>
                    <textarea className="form-input" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />

                    <label className="form-label">Differential Diagnosis:</label>
                    <textarea className="form-input" value={differentialDiagnosis} onChange={(e) => setDifferentialDiagnosis(e.target.value)} />

                    <label className="form-label">Treatment:</label>
                    <textarea className="form-input" value={treatment} onChange={(e) => setTreatment(e.target.value)} />

                    <label className="form-label">Client Communications/Recommendations:</label>
                    <textarea className="form-input" value={clientCommunications} onChange={(e) => setClientCommunications(e.target.value)} />

                    <label className="form-label">Plan/Follow-up:</label>
                    <textarea className="form-input" value={planFollowUp} onChange={(e) => setPlanFollowUp(e.target.value)} />

                    <div className="button-container">
                        <button type="button" className="back-button-patient" onClick={handleBackToPatientInfo}>
                            Back to Patient Info
                        </button>
                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? 'Generating...' : 'Generate Report'}
                        </button>
                        <button type="button" className="clear-button" onClick={resetEntireForm}>
                            Clear All
                        </button>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                </form>
            )}

            <div className="report-preview">
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-dots">
                            <div className="loading-dot"></div>
                            <div className="loading-dot"></div>
                            <div className="loading-dot"></div>
                        </div>
                        <p className="loading-text">Generating report...</p>
                    </div>
                ) : previewVisible ? (
                    <>
                        <div className="report-preview-header">
                            <h3>Report Preview</h3>
                            <button className="close-button" onClick={() => setPreviewVisible(false)}>×</button>
                        </div>
                        <div className="report-preview-content">
                            <textarea
                                className="report-text-editor"
                                value={reportText}
                                onChange={(e) => setReportText(e.target.value)}
                            />
                        </div>
                        <div className="report-preview-footer">
                            <div className="button-container">
                                <button className="submit-button" onClick={saveReport}>Save Report</button>
                                <div className="copy-button-container">
                                    <button className="copy-button" onClick={copyToClipboard}>{copyButtonText}</button>
                                    {copiedMessageVisible && <span className="copied-message">Copied</span>}
                                </div>
                            </div>
                            {savedMessageVisible && <div className="saved-message">Saved</div>}
                            {error && <div className="error-message">{error}</div>}
                        </div>
                    </>
                ) : (
                    <div className="report-placeholder">
                        <h2>Report will appear here</h2>
                        <p>Fill out the form and click "Generate Report" to see the preview</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportForm;
