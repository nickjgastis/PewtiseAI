import React from 'react';
import axios from 'axios';

const GenerateReport = async (inputs) => {
    // Create the prompt dynamically based on inputs, adding instructions to elaborate and fill in details
    const prompt = `You are a highly experienced veterinarian. Based on the following input details, write a comprehensive veterinary prognosis report that adheres to the specified template. In each section, provide thorough elaboration, including additional medical insights, details on diagnosis, and treatment plans. If any inputs are missing from the top section (i.e., Patient Info), clearly state "Provide here" for those sections. For all other sections, either elaborate on the provided input or use best practices from similar cases to fill in gaps. Each answer you give must be at least three sentences long. Prescribe appropriate treatment plans with detailed dosages, medication names, and best practices to ensure a thorough and actionable report.

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
    Exam Date: ${inputs.examDate || "Provide here"}  
    Staff: ${inputs.staff || "Provide here"} compensate for capitalization mistakes, example: dr gastis = Dr Gastis"
    
    Presenting Complaint:
    ${inputs.presentingComplaint || "Provide additional context on the presenting complaint, including how the owner first noticed the symptoms, how long they have persisted, and any relevant background information. If the symptoms worsen, explain potential complications and when further medical attention should be sought. Ensure the explanation is no shorter than three sentences."}
    
    History:
    ${inputs.history || "Provide a thorough history of the patient, including any previous medical issues, treatments, and notable changes in the patient’s health or behavior. The history should be at least three sentences long."}
    
    Date and Time of Examination: ${new Date().toLocaleString()}
    Physical Exam Findings:
    ${inputs.physicalExamFindings || "Keep the exact same structure as the input gives you at all times. Thoroughly describe the results of the physical examination, noting any abnormal findings, and also mention important normal findings (e.g., stable weight, hydrated condition, good coat health). Provide any recommendations for further testing if necessary. Ensure the description is at least three sentences long. Compensate for capitalization errors, example: NORAML = normal."}
    
    Diagnostic Plan:
    ${inputs.diagnosticPlan || "Detail the diagnostic plan, including any recommended tests, imaging, or lab work needed to confirm or clarify the diagnosis. If nothing is input, fill in with best practices and any other information given."}
    
    Lab Results:
    ${inputs.labResults || "Explain the significance of the lab results in detail, including the interpretation of abnormal values. Suggest what these results mean in the context of the pet's current health and how they relate to the diagnosis. If relevant, recommend additional testing or monitoring. Each explanation should be at least three sentences."}
    
    Assessment:
    ${inputs.assessment || "Provide a detailed and well-supported assessment of the patient's current condition, noting any trends or critical findings that guide the diagnosis and treatment. The assessment should be no shorter than three sentences."}
    
    Diagnosis:
    ${inputs.diagnosis || "Provide a detailed and well-supported diagnosis, explaining potential causes, complications, and how the condition may develop if left untreated. Mention any differential diagnoses and explain why this diagnosis was chosen. Comment on the prognosis and the expected progression of the condition. Each response should be at least three sentences long."}
    
    Differential Diagnosis:
    ${inputs.differentialDiagnosis || "Create numbered list of differential diagnosis in order of most likelyhood. Include potential differential diagnoses that were considered and explain why they were ruled out or considered less likely. Ensure the explanation is no less than three sentences."}
    
    Treatment:
    ${inputs.treatment || "List all the possible drugs that could be used, Example, 1. Drug name Dose (mg/kg) Route of admistration(IV, P.O, SQ), Frequency (SID, BID, TID, QID, EOD) Include number of days for treatment. Include medication names, specific dosages, routes of administration (e.g., oral, subcutaneous)."}
    
    Medicine Interactions:
    Based on the medications listed in the treatment plan above, provide a detailed analysis of:
    1. Potential interactions between the prescribed medications
    2. Common side effects for each medication
    3. Any contraindications or special monitoring requirements
    4. Specific drug-drug interactions that require attention
    Ensure each explanation is thorough and at least three sentences long.
    
    Expected Course/Prognosis:
    ${inputs.expectedCoursePrognosis || "Based on the information provided, describe the expected course and prognosis of the condition. Include potential outcomes, the likelihood of recovery or improvement, and any necessary ongoing care or treatments. Each explanation should be at least three sentences long, and reflect best practices and industry standards for similar cases."}
    
    Naturopathic Medicine:
    Based on the diagnosis and treatment plan outlined above, provide:
    1. Top 3 evidence-based natural treatments that would complement the conventional treatment plan
    2. Specific dosing recommendations and administration guidelines for each natural treatment
    3. Potential interactions between these natural treatments and the prescribed medications
    4. Expected benefits and any contraindications
    Each recommendation should be at least three sentences long and include scientific rationale.
    
    Client Communications/Recommendations:
    ${inputs.clientCommunications || "Wrtie a message to the owner. Explain any potential side effects that may occur from treatment in detail to the owner. Summarize all the key points communicated with the owner, including diagnosis, treatment options, and any follow-up steps. Mention any key questions or concerns raised by the client. It should be a message directed at the owner. Each section should be no shorter than three sentences."}
    
    Plan/Follow-Up:
    ${inputs.planFollowUp || "Provide clear and actionable follow-up instructions. Recommend when the next check-up should be, which signs of improvement or deterioration to watch for, and any necessary adjustments to care (e.g., diet changes, exercise restrictions). Suggest when and how the owner should re-engage for further treatment or tests. Each follow-up plan should be no shorter than three sentences."}
    
    ${inputs.staff || "Provide here"}
    
    End of Medical Record.
    
    If any information is missing or incomplete, fill in with best practices from similar cases. Always ensure the report is detailed and medically accurate, providing the owner with a clear understanding of the pet’s condition, prognosis, and next steps for care. Recommend appropriate treatments where relevant. If the input is short such as (vomiting for three days) you should expand with two to three sentences. Don't ever leave a comment at the end of the report.`;

    // console.log('Prompt being sent:', prompt);



    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4-turbo',
                messages: [
                    {
                        role: 'system',  // System message to set the behavior
                        content: prompt
                    },
                    {
                        role: 'user',  // User message sending the data only
                        content: ''
                    }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const generatedReport = response.data.choices[0].message.content;
        return generatedReport; // Return the generated report content
    } catch (error) {
        console.error('Error generating report:', error);
        throw new Error('Failed to generate report. Please try again.');
    }
};

export default GenerateReport;
