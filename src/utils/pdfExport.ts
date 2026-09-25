import jsPDF from 'jspdf';
import { BrandingOptions } from '../types';

export function exportToPdf(
  text: string,
  docType: string,
  branding: BrandingOptions
): void {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 54; // 0.75 in
  const maxLineWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const lines = text.split('\n');

  function addHeaderAndFooter(pdfDoc: jsPDF, pageNum: number, totalPagesPlaceholder = false) {
    pdfDoc.saveGraphicsState();
    
    // Header
    pdfDoc.setFont('helvetica', 'bold');
    pdfDoc.setFontSize(8);
    pdfDoc.setTextColor(140, 150, 165);
    pdfDoc.text(branding.companyName.toUpperCase(), margin, 34);
    pdfDoc.setFont('helvetica', 'normal');
    pdfDoc.text('CONFIDENTIAL & BINDING', pageWidth - margin, 34, { align: 'right' });
    
    pdfDoc.setDrawColor(220, 226, 235);
    pdfDoc.setLineWidth(0.75);
    pdfDoc.line(margin, 40, pageWidth - margin, 40);

    // Footer
    pdfDoc.line(margin, pageHeight - 40, pageWidth - margin, pageHeight - 40);
    pdfDoc.setFontSize(8);
    pdfDoc.setTextColor(130, 140, 155);
    const footerText = `${branding.companyName} | ${branding.contactEmail} | All Rights Reserved`;
    pdfDoc.text(footerText, pageWidth / 2, pageHeight - 26, { align: 'center' });
    
    // Page count
    if (!totalPagesPlaceholder) {
      pdfDoc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 26, { align: 'right' });
    }
    
    pdfDoc.restoreGraphicsState();
  }

  // Draw Title & Scales Emblem on First Page
  cursorY = 65;

  // Scales icon representation / Title Box
  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59);
  doc.text(`⚖  ${branding.companyName}`, pageWidth / 2, cursorY, { align: 'center' });
  cursorY += 22;

  doc.setFont('times', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text(docType.toUpperCase(), pageWidth / 2, cursorY, { align: 'center' });
  cursorY += 16;

  doc.setFont('times', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Legally Enforceable Instrument • Executed in Duplicate Originals', pageWidth / 2, cursorY, { align: 'center' });
  cursorY += 20;

  // Decorative divider
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(1);
  doc.line(margin + 40, cursorY, pageWidth - margin - 40, cursorY);
  cursorY += 25;

  let pageNumber = 1;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      cursorY += 10;
      continue;
    }

    // Skip duplicate title
    if (line.startsWith('# ') || line.startsWith('## ')) {
      const heading = line.replace(/^#+\s*/, '');
      if (heading.toLowerCase() === docType.toLowerCase()) {
        continue;
      }
      if (cursorY > pageHeight - 90) {
        addHeaderAndFooter(doc, pageNumber);
        doc.addPage();
        pageNumber++;
        cursorY = 60;
      }
      doc.setFont('times', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(30, 41, 59);
      doc.text(heading, margin, cursorY);
      cursorY += 18;
      continue;
    }

    // Check for section headers
    const isSection =
      /^[0-9]+\.\s+[A-Z]/.test(line) ||
      line === 'WITNESSETH:' ||
      line === 'Between:' ||
      line === 'And:' ||
      line.startsWith('NOW, THEREFORE') ||
      line.startsWith('IN WITNESS WHEREOF');

    if (isSection) {
      if (cursorY > pageHeight - 90) {
        addHeaderAndFooter(doc, pageNumber);
        doc.addPage();
        pageNumber++;
        cursorY = 60;
      }
      doc.setFont('times', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(15, 23, 42);
      const wrapped = doc.splitTextToSize(line, maxLineWidth);
      doc.text(wrapped, margin, cursorY);
      cursorY += wrapped.length * 14 + 4;
    } else if (line.startsWith('___') || line.startsWith('---')) {
      if (cursorY > pageHeight - 90) {
        addHeaderAndFooter(doc, pageNumber);
        doc.addPage();
        pageNumber++;
        cursorY = 60;
      }
      doc.setDrawColor(100, 116, 139);
      doc.setLineWidth(1);
      doc.line(margin, cursorY, margin + 220, cursorY);
      cursorY += 14;
    } else {
      // Normal body text
      doc.setFont('times', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      const wrapped = doc.splitTextToSize(line, maxLineWidth);

      for (let j = 0; j < wrapped.length; j++) {
        if (cursorY > pageHeight - 65) {
          addHeaderAndFooter(doc, pageNumber);
          doc.addPage();
          pageNumber++;
          cursorY = 60;
          doc.setFont('times', 'normal');
          doc.setFontSize(10);
          doc.setTextColor(30, 41, 59);
        }
        doc.text(wrapped[j], margin, cursorY);
        cursorY += 13.5;
      }
      cursorY += 4;
    }
  }

  // Add header & footer to all pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    addHeaderAndFooter(doc, p);
    // Draw page X of Y
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(130, 140, 155);
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - 26, { align: 'right' });
  }

  const fileName = `${docType.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.pdf`;
  doc.save(fileName);
}
