import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../styles/QuickQuery.css';
import { useAuth0 } from "@auth0/auth0-react";
import { supabase } from '../supabaseClient';
import { Document, Page, Text, StyleSheet, pdf } from '@react-pdf/renderer';

const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://api.petwise.vet'
    : 'http://localhost:3001';

const formatMessage = (content) => {
    return content
        // Remove dash before bold text at start of line
        // .replace(/^-\s*\*\*(.*?)\*\*/gm, '**$1**')
        // Regular bold text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Headers with ###
    // .replace(/###\s*(.*?)\n/g, '<h3>$1</h3>')
    // Horizontal rules
    // .replace(/---/g, '<hr/>')
    // Wrap list items in a div for better styling
    // .replace(/^\s*(\d+)\.\s+(.*)$/gm, '<li><span class="number">$1.</span><div>$2</div></li>')
    // Preserve line breaks
    // .replace(/\n/g, '<br/>');
};

const formatMessageForPDF = (content) => {
    const styles = StyleSheet.create({
        page: {
            padding: 40,
            fontSize: 12,
            fontFamily: 'Helvetica',
            lineHeight: 1.4
        },
        text: {
            marginBottom: 4,
            fontFamily: 'Helvetica'
        },
        header: {
            fontFamily: 'Helvetica-Bold',
            fontSize: 13,
            marginTop: 16,
            marginBottom: 8
        },
        bold: {
            fontFamily: 'Helvetica-Bold'
        },
        listItem: {
            marginLeft: 20,
            marginBottom: 4
        }
    });

    const formatParagraphs = (text) => {
        const lines = text.split('\n');
        return lines.map((line, index) => {
            // Check if it's a header (ends with ':' or matches number pattern)
            if (line.endsWith(':') && !line.match(/^\d+\./)) {
                return (
                    <Text key={index} style={styles.header}>
                        {line.replace(/\*\*/g, '')}
                    </Text>
                );
            }

            // Handle numbered sections with bold parts
            if (line.match(/^\d+\.\s+\*\*/)) {
                const parts = line.split(/(\*\*[^*]+\*\*)/g);
                return (
                    <Text key={index} style={styles.text}>
                        {parts.map((part, partIndex) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return (
                                    <Text key={partIndex} style={styles.bold}>
                                        {part.replace(/\*\*/g, '')}
                                    </Text>
                                );
                            }
                            return part;
                        })}
                    </Text>
                );
            }

            // Handle bold text within lines
            if (line.includes('**')) {
                const parts = line.split(/(\*\*[^*]+\*\*)/g);
                return (
                    <Text key={index} style={styles.text}>
                        {parts.map((part, partIndex) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return (
                                    <Text key={partIndex} style={styles.bold}>
                                        {part.replace(/\*\*/g, '')}
                                    </Text>
                                );
                            }
                            return part;
                        })}
                    </Text>
                );
            }

            // Regular text
            return <Text key={index} style={styles.text}>{line}</Text>;
        });
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {formatParagraphs(content)}
            </Page>
        </Document>
    );
};

const QuickQuery = () => {
    const { user } = useAuth0();
    const [userData, setUserData] = useState(null);
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('quickQueryMessages');
        return saved ? JSON.parse(saved) : [];
    });
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [copiedIndex, setCopiedIndex] = useState(null);

    useEffect(() => {
        const lastUser = localStorage.getItem('lastUserId');
        const currentUser = user?.sub;

        if (lastUser && currentUser && lastUser !== currentUser) {
            localStorage.removeItem('quickQueryMessages');
            setMessages([]);
        }

        if (currentUser) {
            localStorage.setItem('lastUserId', currentUser);
        }
    }, [user]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        localStorage.setItem('quickQueryMessages', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.sub) return;

            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('dvm_name')
                    .eq('auth0_user_id', user.sub)
                    .single();

                if (!error && data) {
                    setUserData(data);
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
            }
        };

        fetchUserData();
    }, [user]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const conversationHistory = [
                {
                    role: 'system',
                    content: ` You are a **Veterinary Assistant AI** providing concise, professional responses for **licensed veterinarians only**. Your responses should be **short, precise, and rich in clinical information** while adhering to the following formatting:

### FORMATTING GUIDELINES:
1. **Headers:** Use **bold headers** for clear sectioning.
2. **Spacing:** Ensure proper spacing with **double line breaks** between sections and headers.
3. **Lists:** 
4. Do not use - or * to indicate lists.

   
4. **Critical Terms:** Highlight key terms or actions in **bold** for clarity.

---

### RESPONSE GUIDELINES:
- Responses should focus on actionable, evidence-based information, staying concise and on-topic.
- For common cases, prioritize practical treatments.
- For less common or specific cases, provide insightful, clinically relevant advice with brief reasoning.
- **Avoid lengthy explanations** unless explicitly requested.

---

### WHEN PROVIDING TREATMENTS:
Treatments should follow this structure:
1. **Medication Category**
   **Drug Name:** Include generic name and examples of brand names (if applicable).
   **Dose:** X mg/kg
   **Route:** (IV, PO, SQ, IM)
   **Frequency:** (e.g., SID, BID, TID, QID)
   **Duration:** X days
 **Additional Notes:** Include contraindications, warnings, or monitoring guidelines if relevant.

**Example:**
1. **Fluid Therapy**
    **Drug Name:** Isotonic crystalloid solution (e.g., LRS or 0.9% NaCl)
        **Dose:** 10-20 mL/kg IV bolus, then maintenance based on ongoing losses
        **Frequency:** As needed to maintain hydration
        **Duration:** Adjust based on hydration status
        **Additional Notes:** Monitor for fluid overload, particularly in cardiac or renal patients.

---

### WHEN PROVIDING DIAGNOSTIC PLANS:
Diagnostics should be presented as actionable steps, prioritized based on the case. Use this structure:

1. **Primary Objective:** State the purpose of the diagnostic (e.g., rule out X condition, confirm Y finding).

2. **Recommended Diagnostics:**
   - Test/Procedure 1: Brief explanation of its purpose or clinical relevance.
   - Test/Procedure 2: Continue with the next diagnostic steps, as needed.

**Example:**
1. **Diagnostics for Anemia in Canines**
   **Primary Objective:** Determine the cause and severity of anemia.
   **Recommended Diagnostics:**
     CBC with reticulocyte count: Assess severity and regenerative response.
     Coombs’ test: Evaluate for immune-mediated hemolysis.
     Abdominal ultrasound: Rule out splenic masses or bleeding.

---

### WHEN HANDLING UNCOMMON CASES:
For less common cases, provide:
1. A brief overview of the condition.
2. Recommended treatment or diagnostic steps.
3. Any relevant clinical notes or key considerations.

**Example:**
**Case: Canine Tetany**
1. **Overview:** Tetany often results from hypocalcemia secondary to eclampsia, parathyroid dysfunction, or chronic renal failure.
2. **Treatment:**
   **Drug Name:** Calcium gluconate
   **Dose:** 0.5-1.5 mL/kg IV slowly over 10-30 minutes
   **Route:** IV
   **Frequency:** Single dose, repeat based on ionized calcium levels
   **Additional Notes:** Monitor ECG for bradycardia or arrhythmias during infusion.

---

### FINAL TOUCHES:
- Always end responses with a clear **Recommendation** section summarizing the next steps.
- ${userData?.dvm_name ? `You are speaking with Dr. ${userData.dvm_name}. Address them as such.` : ''}
- Provide **specific and concise information** for maximum clarity and usability.

---

### Example Output:
**Case: Acute Canine Pancreatitis**


1. **Primary Objective:** Stabilize the patient and reduce pancreatic inflammation.
2. **Treatment:**
   **Fluid Therapy:**
     **Drug Name:** Isotonic crystalloid (e.g., LRS or 0.9% NaCl)
     **Dose:** 10-20 mL/kg IV bolus, then maintenance
     **Frequency:** Continuous infusion
     **Duration:** Until hydration status is restored
   **Pain Management:**
     **Drug Name:** Buprenorphine
     **Dose:** 0.01-0.02 mg/kg
     **Route:** IM or IV
     **Frequency:** QID
     **Duration:** 3-5 days
3. **Recommendation:** Administer fluids immediately and control pain. Monitor electrolytes and hydration. Reassess within 24 hours with follow-up diagnostics (e.g., CPL).

---

By adhering to these guidelines, ensure responses are **short, actionable, and formatted for quick reference** while providing high-quality assistance tailored to professional veterinarians.
`
                },
                ...messages.slice(-5),
                {
                    role: 'user',
                    content: userMessage
                }
            ];

            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4o-mini',
                    messages: conversationHistory,
                    max_tokens: 500,
                    temperature: 0.7,
                    top_p: 0.9,
                    frequency_penalty: 0.5,
                    presence_penalty: 0.5
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response.data.choices[0].message.content
            }]);
        } catch (error) {
            console.error('Error in QuickQuery:', error);
            let errorMessage = "I'm sorry, I encountered an error. Please try again.";

            if (error.response?.data?.error === 'Daily report limit reached') {
                errorMessage = "You've reached your daily query limit. Please upgrade your plan or try again tomorrow.";
            }

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: errorMessage
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setMessages([]);
        localStorage.removeItem('quickQueryMessages');
    };

    const handleCopy = async (text, index) => {
        await navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handlePrint = async (content) => {
        try {
            const doc = formatMessageForPDF(content);
            const blob = await pdf(doc).toBlob();
            const url = URL.createObjectURL(blob);

            const printWindow = window.open(url, '_blank');
            printWindow.onload = () => {
                printWindow.print();
                printWindow.onafterprint = () => {
                    printWindow.close();
                    URL.revokeObjectURL(url);
                };
            };
        } catch (error) {
            console.error('Print error:', error);
        }
    };

    return (
        <div className="qq-container">
            <div className="qq-header">
                <h2>QuickMed Query</h2>
                {messages.length > 0 && (
                    <button onClick={handleClear} className="qq-clear-button">
                        Clear Chat
                    </button>
                )}
            </div>
            <div className="qq-chat-container">
                <div className="qq-messages-container">
                    {messages.length === 0 && (
                        <div className="qq-suggestions">
                            <div
                                className="suggestion-box"
                                onClick={() => setInputMessage("What is the recommended treatment protocol for canine parvovirus?")}
                            >
                                <h4>Treatment Protocols</h4>
                                <p>What is the recommended treatment protocol for canine parvovirus?</p>
                            </div>
                            <div
                                className="suggestion-box"
                                onClick={() => setInputMessage("What are the dosages for emergency seizure management in dogs?")}
                            >
                                <h4>Emergency Medicine</h4>
                                <p>What are the dosages for emergency seizure management in dogs?</p>
                            </div>
                            <div
                                className="suggestion-box"
                                onClick={() => setInputMessage("What antibiotics are most effective for treating resistant UTIs in cats?")}
                            >
                                <h4>Medication Guidance</h4>
                                <p>What antibiotics are most effective for treating resistant UTIs in cats?</p>
                            </div>
                        </div>
                    )}
                    {messages.map((message, index) => (
                        <div key={index} className={`qq-message ${message.role}`}>
                            <div className="qq-message-content">
                                {message.role === 'assistant' ? (
                                    <div dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }} />
                                ) : (
                                    message.content
                                )}
                                {message.role === 'assistant' && (
                                    <div className="qq-button-group">
                                        <button
                                            className={`qq-copy-button ${copiedIndex === index ? 'copied' : ''}`}
                                            onClick={() => handleCopy(message.content, index)}
                                            aria-label="Copy message"
                                        >
                                            {copiedIndex === index ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                                    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                                    <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 013.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0121 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 017.5 16.125V3.375z" />
                                                    <path d="M15 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0017.25 7.5h-1.875A.375.375 0 0115 7.125V5.25zM4.875 6H6v10.125A3.375 3.375 0 009.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V7.875C3 6.839 3.84 6 4.875 6z" />
                                                </svg>
                                            )}
                                        </button>
                                        <button
                                            className="qq-print-button"
                                            onClick={() => handlePrint(message.content)}
                                            aria-label="Print message"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                                <path fillRule="evenodd" d="M7.875 1.5C6.839 1.5 6 2.34 6 3.375v2.99c-.426.053-.851.11-1.274.174-1.454.218-2.476 1.483-2.476 2.917v6.294a3 3 0 003 3h.27l-.155 1.705A1.875 1.875 0 007.232 22.5h9.536a1.875 1.875 0 001.867-2.045l-.155-1.705h.27a3 3 0 003-3V9.456c0-1.434-1.022-2.7-2.476-2.917A48.716 48.716 0 0018 6.366V3.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM16.5 6.205v-2.83A.375.375 0 0016.125 3h-8.25a.375.375 0 00-.375.375v2.83a49.353 49.353 0 019 0zm-.217 8.265c.178.018.317.16.333.337l.526 5.784a.375.375 0 01-.374.409H7.232a.375.375 0 01-.374-.409l.526-5.784a.373.373 0 01.333-.337 41.741 41.741 0 018.566 0zm.967-3.97a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H18a.75.75 0 01-.75-.75V10.5zM15 9.75a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V10.5a.75.75 0 00-.75-.75H15z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="qq-message assistant">
                            <div className="qq-message-content loading">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="qq-input-form">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ask a veterinary question..."
                        className="qq-message-input"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="qq-send-button"
                        disabled={isLoading || !inputMessage.trim()}
                        aria-label="Send message"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            width="24"
                            height="24"
                        >
                            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default QuickQuery; 