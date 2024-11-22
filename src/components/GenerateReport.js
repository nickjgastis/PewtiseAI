import React from 'react';
import axios from 'axios';

const GenerateReport = async (inputs, enabledFields) => {
    // Helper function to get content only if field is enabled
    const getEnabledContent = (fieldName, content) => {
        if (!enabledFields || !enabledFields[fieldName]) {
            return '';
        }
        return content;
    };

    const prompt = `You are a highly experienced veterinarian. Based on the following input details, write a comprehensive veterinary prognosis report that adheres to the specified template. In each section, provide thorough elaboration, including additional medical insights, details on diagnosis, and treatment plans. If any inputs are missing from the top section (i.e., Patient Info), clearly state "Provide here" for those sections. For all other sections, either elaborate on the provided input or use best practices from similar cases to fill in gaps. Each answer you give must be at least three sentences long. Prescribe appropriate treatment plans with detailed dosages, medication names, and best practices to ensure a thorough and actionable report. ALWAYS PROVIDE A REPORT EVEN IF FIELDS ARE MISSING!!!

    When creating headings, do not bold ANYTHING.
    If there are capitalization errors, you will fix them.
    
    Template:
    Veterinary Report
    
    Patient: ${inputs.patientName || "Provide here"}  
    Species: ${inputs.species || "Provide here"}  
    Sex: ${inputs.sex || "Provide here"}  
    Breed: ${inputs.breed || "Provide here"}  
    Color/Markings: ${inputs.colorMarkings || "Provide here"}  
    Weight: ${inputs.weight || "Provide here"} ${inputs.weightUnit || "lbs"}  
    Birthdate: ${inputs.birthdate || "Provide here"}  
    Owner: ${inputs.ownerName || "Provide here"}  
    Address: ${inputs.address || "Provide here"}  
    Telephone: ${inputs.telephone || "Provide here"}  
    ${getEnabledContent('examDate', `Exam Date: ${inputs.examDate || "Provide here"}`)}  
    ${getEnabledContent('staff', `Staff: ${inputs.staff || "Provide here"}`)}
    
    ${getEnabledContent('presentingComplaint', `Presenting Complaint:\n${inputs.presentingComplaint || "Provide additional context on the presenting complaint, including how the owner first noticed the symptoms, how long they have persisted, and any relevant background information. If the symptoms worsen, explain potential complications and when further medical attention should be sought. Ensure the explanation is no shorter than three sentences."}`)}
    
    ${getEnabledContent('history', `History:\n${inputs.history || "Provide a thorough history of the patient, including any previous medical issues, treatments, and notable changes in the patient's health or behavior. The history should be at least three sentences long."}`)}
    
    ${getEnabledContent('physicalExamFindings', `Physical Exam Findings - ${new Date().toLocaleString()}\n${inputs.physicalExamFindings || "IMPORTANT: Keep the exact same structure and data that the input gives you at all times!!!. Do not give a paragraph. Compensate for capitalization errors, example: NORAML = normal. Here is an example: "}`)}
    ${getEnabledContent('diagnosticPlan', `Diagnostic Plan:\n${inputs.diagnosticPlan || "Detail the diagnostic plan, including any recommended tests, imaging, or lab work needed to confirm or clarify the diagnosis. If nothing is input, fill in with best practices and any other information given."}`)}
    
    ${getEnabledContent('labResults', `Lab Results:\n${inputs.labResults || "Explain the significance of the lab results in detail, including the interpretation of abnormal values. Suggest what these results mean in the context of the pet's current health and how they relate to the diagnosis. If relevant, recommend additional testing or monitoring. Each explanation should be at least three sentences."}`)}
    
    ${getEnabledContent('assessment', `Assessment:\n${inputs.assessment || "Provide a detailed and well-supported assessment of the patient's current condition, noting any trends or critical findings that guide the diagnosis and treatment. The assessment should be no shorter than three sentences."}`)}
    
    ${getEnabledContent('diagnosis', `Diagnosis:\n${inputs.diagnosis || "Provide a detailed and well-supported diagnosis, explaining potential causes, complications, and how the condition may develop if left untreated. Mention any differential diagnoses and explain why this diagnosis was chosen. Comment on the prognosis and the expected progression of the condition. Each response should be at least three sentences long."}`)}
    
    ${getEnabledContent('differentialDiagnosis', `Differential Diagnosis:\n${inputs.differentialDiagnosis || "Create numbered list of differential diagnosis in order of most likelyhood. Include potential differential diagnoses that were considered and explain why they were ruled out or considered less likely. Ensure the explanation is no less than three sentences."}`)}
    
    ${getEnabledContent('treatment', `Treatment:\n${inputs.treatment || "List all the possible drugs that could be used, Example, 1. Drug name Dose (mg/kg) Route of admistration(IV, P.O, SQ), Frequency (SID, BID, TID, QID, EOD) Include number of days for treatment. Include medication names, specific dosages, routes of administration (e.g., oral, subcutaneous)."}`)}
    
    Medicine Interactions:
    Based on the medications listed in the treatment plan above, provide a detailed analysis of:
    1. Potential interactions between the prescribed medications
    2. Common side effects for each medication
    3. Any contraindications or special monitoring requirements
    4. Specific drug-drug interactions that require attention
    Ensure each explanation is thorough and at least three sentences long.
    
    ${getEnabledContent('naturopathicMedicine', `Naturopathic Medicine:\n${inputs.naturopathicMedicine || "Based on the diagnosis and treatment plan outlined above, provide:\n1. Top 3 evidence - based natural treatments that would complement the conventional treatment plan\n2. Specific dosing recommendations and administration guidelines for each natural treatment\n3. Potential interactions between these natural treatments and the prescribed medications\n4. Expected benefits and any contraindications\nEach recommendation should be at least three sentences long and include scientific rationale."}`)}
    
    ${getEnabledContent('clientCommunications', `Client Communications/Recommendations:\n${inputs.clientCommunications || "Write a message to the owner. Explain any potential side effects that may occur from treatment in detail to the owner. Summarize all the key points communicated with the owner, including diagnosis, treatment options, and any follow-up steps. Mention any key questions or concerns raised by the client. It should be a message directed at the owner. Each section should be no shorter than three sentences."}`)}
    
    ${getEnabledContent('planFollowUp', `Plan/Follow-Up:\n${inputs.planFollowUp || "Provide clear and actionable follow-up instructions. Recommend when the next check-up should be, which signs of improvement or deterioration to watch for, and any necessary adjustments to care (e.g., diet changes, exercise restrictions). Suggest when and how the owner should re-engage for further treatment or tests. Each follow-up plan should be no shorter than three sentences."}`)}
    
    ${getEnabledContent('staff', inputs.staff || "Provide here")}
    
    End of Medical Record.
    
    If any information is missing or incomplete, fill in with best practices from similar cases. Always ensure the report is detailed and medically accurate, providing the owner with a clear understanding of the pet's condition, prognosis, and next steps for care. Recommend appropriate treatments where relevant. If the input is short such as (vomiting for three days) you should expand with two to three sentences. Don't ever leave a comment at the end of the report.`;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o-mini', // Updated model name
                messages: [
                    {
                        role: 'system',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error generating report:', error);
        throw new Error('Failed to generate report. Please try again.');
    }
};

export default GenerateReport;
