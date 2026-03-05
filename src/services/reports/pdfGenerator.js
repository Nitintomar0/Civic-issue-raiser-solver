import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDFReport = async (reports) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  let yPosition = 20;

  // Header
  pdf.setFontSize(24);
  pdf.setTextColor(255, 107, 53); // Bengaluru orange
  pdf.text('Namma Bengaluru 360° Fix-It AI', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 10;
  pdf.setFontSize(16);
  pdf.setTextColor(0, 78, 137); // Bengaluru blue
  pdf.text('Civic Issues Report', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 5;
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 15;

  // Summary Statistics
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Summary Statistics', 15, yPosition);
  yPosition += 8;

  const stats = {
    'Total Reports': reports.length,
    'Pending': reports.filter(r => r.status === 'pending').length,
    'In Progress': reports.filter(r => r.status === 'in_progress').length,
    'Fixed': reports.filter(r => r.status === 'fixed').length,
  };

  pdf.setFontSize(10);
  Object.entries(stats).forEach(([key, value]) => {
    pdf.text(`${key}: ${value}`, 15, yPosition);
    yPosition += 6;
  });

  yPosition += 10;

  // Category Breakdown
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Category Breakdown', 15, yPosition);
  yPosition += 8;

  const categoryCount = reports.reduce((acc, report) => {
    acc[report.category] = (acc[report.category] || 0) + 1;
    return acc;
  }, {});

  pdf.setFontSize(10);
  Object.entries(categoryCount).forEach(([category, count]) => {
    pdf.text(`${category.replace('_', ' ')}: ${count}`, 15, yPosition);
    yPosition += 6;
  });

  // Add new page for detailed reports
  pdf.addPage();
  yPosition = 20;

  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Detailed Reports', 15, yPosition);
  yPosition += 10;

  // List top 10 reports
  const topReports = reports.slice(0, 10);
  
  topReports.forEach((report, index) => {
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(12);
    pdf.setTextColor(255, 107, 53);
    pdf.text(`${index + 1}. ${report.category.replace('_', ' ').toUpperCase()}`, 15, yPosition);
    yPosition += 6;

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    
    const description = pdf.splitTextToSize(report.description, pageWidth - 30);
    pdf.text(description, 15, yPosition);
    yPosition += description.length * 5;

    pdf.setTextColor(100, 100, 100);
    pdf.text(`Status: ${report.status}`, 15, yPosition);
    yPosition += 5;
    pdf.text(`Severity: ${report.severity}`, 15, yPosition);
    yPosition += 5;
    pdf.text(`Date: ${new Date(report.timestamp).toLocaleDateString()}`, 15, yPosition);
    yPosition += 5;
    pdf.text(`Location: ${report.address || `${report.location.lat.toFixed(4)}, ${report.location.lng.toFixed(4)}`}`, 15, yPosition);
    yPosition += 10;
  });

  // Footer
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Save PDF
  pdf.save(`bengaluru-civic-report-${Date.now()}.pdf`);
};

// Generate weekly report
export const generateWeeklyReport = async (reports) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const weeklyReports = reports.filter(
    (r) => new Date(r.timestamp) >= oneWeekAgo
  );

  return generatePDFReport(weeklyReports);
};

// Generate ward-specific report
export const generateWardReport = async (reports, wardName) => {
  const wardReports = reports.filter((r) =>
    r.address?.toLowerCase().includes(wardName.toLowerCase())
  );

  return generatePDFReport(wardReports);
};
