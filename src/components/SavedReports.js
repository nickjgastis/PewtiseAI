import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { supabase } from '../supabaseClient';
import '../styles/SavedReports.css';
import { FaTimes } from 'react-icons/fa';
import { pdf } from '@react-pdf/renderer';
import { Document, Page, Text, StyleSheet } from '@react-pdf/renderer';

const PDFDocument = ({ reportText }) => {
    const styles = StyleSheet.create({
        page: {
            padding: 40,
            fontSize: 12,
            fontFamily: 'Helvetica',
            lineHeight: 1.5
        },
        text: {
            marginBottom: 10,
            whiteSpace: 'pre-wrap'
        }
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.text}>{reportText}</Text>
            </Page>
        </Document>
    );
};

const PDFButton = ({ reportText, reportName }) => {
    const [isPreparing, setIsPreparing] = useState(false);

    const generatePDF = async () => {
        setIsPreparing(true);
        const doc = <PDFDocument reportText={reportText} />;
        const blob = await pdf(doc).toBlob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${reportName || 'Report'}-${new Date().toLocaleDateString()}.pdf`;
        link.click();

        URL.revokeObjectURL(url);
        setIsPreparing(false);
    };

    return (
        <button
            className="copy-button"
            onClick={generatePDF}
            disabled={isPreparing}
        >
            {isPreparing ? 'Preparing PDF...' : 'Download PDF'}
        </button>
    );
};

const SavedReports = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [newReportName, setNewReportName] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            if (!isAuthenticated || !user) return;

            try {
                // Get user's ID from users table
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('id')
                    .eq('auth0_user_id', user.sub)
                    .single();

                if (userError) throw userError;

                const userId = userData?.id; // Optional chaining to prevent undefined error

                if (!userId) {
                    console.error("User ID is undefined. Aborting fetch.");
                    return;
                }

                // Get reports associated with the user's ID
                const { data: reportsData, error: reportsError } = await supabase
                    .from('saved_reports')
                    .select('id, report_name, report_text')
                    .eq('user_id', userId);

                if (reportsError) {
                    console.error("Error fetching reports:", reportsError);
                    return;
                }

                // console.log("Fetched reports data:", reportsData); // Log the fetched data
                setReports(reportsData);

                // Log current state of reports
                // console.log("Current reports state after setting:", reportsData); // Check the state after setting
            } catch (error) {
                setError("Failed to fetch reports. Please try again later.");
                console.error("Unexpected error fetching reports:", error);
            }
        };


        fetchReports();
    }, [isAuthenticated, user]);

    const handleReportClick = (report) => {
        setSelectedReport(selectedReport === report ? null : report);
        setTimeout(() => {
            const content = document.querySelector('.report-content');
            if (content) {
                content.classList.toggle('expanded', selectedReport !== report);
            }
        }, 50);
    };

    const handleDeleteReport = async (id) => {
        try {
            const { error } = await supabase
                .from('saved_reports')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Update local reports state
            setReports(reports.filter(report => report.id !== id));
            setSelectedReport(null);
        } catch (error) {
            setError("Failed to delete report. Please try again.");
            console.error("Error deleting report:", error);
        }
    };

    const handleEditClick = (index) => {
        setEditingIndex(index);
        setNewReportName(reports[index].report_name);
    };

    const handleNameChange = (e) => {
        setNewReportName(e.target.value);
    };

    const handleNameBlur = async (id) => {
        try {
            const { error } = await supabase
                .from('saved_reports')
                .update({ report_name: newReportName })
                .eq('id', id);

            if (error) throw error;

            // Update local state with new report name
            setReports(reports.map(report =>
                report.id === id ? { ...report, report_name: newReportName } : report
            ));
            setEditingIndex(null);
        } catch (error) {
            setError("Failed to update report name. Please try again.");
            console.error("Error updating report name:", error);
        }
    };

    if (isLoading) return <div>Loading...</div>; // Handle loading state

    if (!isAuthenticated) {
        return <div>Please log in to view your saved reports.</div>;
    }

    return (
        <div className="saved-reports">
            <h2>Saved Reports</h2>
            {error && <div className="error-message">{error}</div>}

            <div className={`report-list ${selectedReport ? 'hidden' : ''}`}>
                {reports.length > 0 ? (
                    reports.map((report, index) => (
                        <div key={report.id} className="report-item">
                            {editingIndex === index ? (
                                <input
                                    type="text"
                                    value={newReportName}
                                    onChange={handleNameChange}
                                    onBlur={() => handleNameBlur(report.id)}
                                    autoFocus
                                />
                            ) : (
                                <span onClick={() => handleReportClick(report)}>{report.report_name}</span>
                            )}
                            <div className="button-group">
                                <PDFButton
                                    reportText={report.report_text}
                                    reportName={report.report_name}
                                />
                                <button className="copy-button" onClick={() => handleEditClick(index)}>Edit Name</button>
                                <button className="delete-button" onClick={() => handleDeleteReport(report.id)}>Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No saved reports available.</p>
                )}
            </div>

            {selectedReport && (
                <div className="report-card">
                    <div className="report-card-header">
                        <h3>{selectedReport.report_name}</h3>
                        <div className="button-group">
                            <PDFButton
                                reportText={selectedReport.report_text}
                                reportName={selectedReport.report_name}
                            />
                            <button
                                className="close-button"
                                onClick={() => setSelectedReport(null)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                    </div>
                    <div className="report-content">
                        {selectedReport.report_text.split('\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavedReports;
