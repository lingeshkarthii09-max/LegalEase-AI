import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
} from 'docx';
import { BrandingOptions } from '../types';

export async function exportToDocx(
  text: string,
  docType: string,
  termsInput: string,
  branding: BrandingOptions
): Promise<void> {
  const lines = text.split('\n');
  const paragraphs: (Paragraph | Table)[] = [];

  // Parse terms from semicolon input to make the structured terms table
  const termsList = termsInput
    .split(';')
    .map((t) => t.trim())
    .filter(Boolean);

  // Top header text
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: `⚖  ${branding.companyName.toUpperCase()}`,
          bold: true,
          size: 26,
          font: branding.fontFamily,
          color: '1E293B',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 360 },
      children: [
        new TextRun({
          text: 'AI Legal Document Generator • Official Execution Copy',
          size: 18,
          italics: true,
          font: branding.fontFamily,
          color: '64748B',
        }),
      ],
    })
  );

  // Document Title
  paragraphs.push(
    new Paragraph({
      text: docType.toUpperCase(),
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 280 },
      run: {
        bold: true,
        size: 32,
        font: branding.fontFamily,
        color: '0F172A',
      },
    })
  );

  // If terms exist and branding.includeTermsTable is true, insert the Terms & Conditions Table
  if (branding.includeTermsTable && termsList.length > 0) {
    paragraphs.push(
      new Paragraph({
        text: 'SUMMARY OF KEY STIPULATED TERMS',
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 240, after: 140 },
        run: {
          bold: true,
          size: 22,
          font: branding.fontFamily,
          color: '1E293B',
        },
      })
    );

    const tableRows = [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            shading: { fill: 'F1F5F9' },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Item #',
                    bold: true,
                    size: 19,
                    font: branding.fontFamily,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 85, type: WidthType.PERCENTAGE },
            shading: { fill: 'F1F5F9' },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Agreed Covenant / Stipulation',
                    bold: true,
                    size: 19,
                    font: branding.fontFamily,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      ...termsList.map(
        (term, i) =>
          new TableRow({
            children: [
              new TableCell({
                width: { size: 15, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `Clause ${i + 1}`,
                        bold: true,
                        size: 18,
                        font: branding.fontFamily,
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 85, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: term,
                        size: 18,
                        font: branding.fontFamily,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
      ),
    ];

    paragraphs.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
          left: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
          right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
          insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
        },
        rows: tableRows,
      })
    );

    paragraphs.push(
      new Paragraph({
        text: '',
        spacing: { after: 240 },
      })
    );
  }

  // Parse lines of the document
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      paragraphs.push(new Paragraph({ spacing: { after: 120 } }));
      continue;
    }

    // Skip redundant top markdown title since we already rendered it
    if (line.startsWith('# ') || line.startsWith('## ')) {
      const headingText = line.replace(/^#+\s*/, '');
      if (headingText.toLowerCase() === docType.toLowerCase()) {
        continue;
      }
      paragraphs.push(
        new Paragraph({
          text: headingText,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 120 },
          run: {
            bold: true,
            size: 24,
            font: branding.fontFamily,
            color: '1E293B',
          },
        })
      );
      continue;
    }

    // Check for section headers like "1. Services:", "WITNESSETH:", "Between:", "And:"
    const isSectionHeader =
      /^[0-9]+\.\s+[A-Z]/.test(line) ||
      line === 'WITNESSETH:' ||
      line === 'Between:' ||
      line === 'And:' ||
      line.startsWith('NOW, THEREFORE');

    if (isSectionHeader) {
      paragraphs.push(
        new Paragraph({
          spacing: { before: 180, after: 80 },
          children: [
            new TextRun({
              text: line,
              bold: true,
              size: 21,
              font: branding.fontFamily,
              color: '0F172A',
            }),
          ],
        })
      );
    } else if (line.startsWith('___') || line.startsWith('---')) {
      // Signature line
      paragraphs.push(
        new Paragraph({
          spacing: { before: 240, after: 60 },
          children: [
            new TextRun({
              text: '____________________________________________',
              bold: true,
              size: 20,
              font: branding.fontFamily,
              color: '64748B',
            }),
          ],
        })
      );
    } else {
      // Regular paragraph text
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 140, line: 276 },
          children: [
            new TextRun({
              text: line,
              size: 21,
              font: branding.fontFamily,
              color: '1E293B',
            }),
          ],
        })
      );
    }
  }

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `${branding.companyName} • Confidential Legal Document`,
                    size: 16,
                    color: '94A3B8',
                    font: branding.fontFamily,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `${branding.companyName} | ${branding.contactEmail} | All Rights Reserved  •  Page `,
                    size: 16,
                    color: '94A3B8',
                    font: branding.fontFamily,
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 16,
                    color: '94A3B8',
                    font: branding.fontFamily,
                  }),
                ],
              }),
            ],
          }),
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileName = `${docType.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.docx`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
