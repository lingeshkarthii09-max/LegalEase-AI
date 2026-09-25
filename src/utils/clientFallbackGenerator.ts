import { DocumentRequest, DocumentAnalysis } from '../types';

export function generateClientTemplateDocument(req: DocumentRequest): string {
  const cleanDocType = req.document_type.trim() || 'Agreement';
  const cleanParties = req.parties.trim() || 'Party A, Party B';
  const cleanDates = req.dates.trim() || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const governingLaw = req.governing_law || 'State of Delaware';

  const termsList = (req.terms || '')
    .split(';')
    .map((t) => t.trim())
    .filter(Boolean);

  const parsedParties = cleanParties.split(',').map((p) => p.trim());
  const party1 = parsedParties[0] || 'Jane Doe (Service Provider)';
  const party2 = parsedParties[1] || 'TechNova Inc. (Client)';

  let termsFormatted = '';
  if (termsList.length > 0) {
    termsFormatted = termsList
      .map((term, index) => `${index + 1}. ${term}`)
      .join('\n\n');
  } else {
    termsFormatted =
      '1. Scope of Work: The Service Provider shall deliver professional services with due diligence.\n\n2. Compensation: Payment terms as mutually agreed in writing within thirty (30) days.\n\n3. Confidentiality: Both parties agree to protect proprietary information.';
  }

  return `## ${cleanDocType.toUpperCase()}

Agreement made this ${cleanDates}

Between:

${party1}, residing at [Address 1], [City, State, Zip Code] (hereinafter referred to as "First Party")

And:

${party2}, residing at [Address 2], [City, State, Zip Code] (hereinafter referred to as "Second Party")

WITNESSETH:

WHEREAS, the parties desire to enter into this ${cleanDocType} defining rights, duties, and mutual responsibilities as described herein; and

WHEREAS, the parties possess full legal authority and have freely agreed to the terms set forth in this Agreement;

NOW, THEREFORE, in consideration of the mutual covenants and promises contained herein, the parties agree as follows:

1. Defined Terms & Core Obligations:
${termsFormatted}

2. Term and Termination:
This Agreement shall commence on the Effective Date (${cleanDates}) and shall terminate upon completion of services or upon mutual written agreement of both parties. Either party may terminate this Agreement upon written notice if the other party breaches any material term and fails to cure such breach within fifteen (15) days.

3. Confidentiality & Non-Disclosure:
Each party agrees that any sensitive, proprietary, technical, commercial, or confidential information disclosed under this Agreement shall be held in strict confidence and shall not be disseminated to third parties without prior written consent.

4. Intellectual Property Rights:
Unless otherwise specified in writing, all deliverables, work product, documents, and materials created pursuant to this Agreement shall be the sole and exclusive property of the commissioning party upon full payment.

5. Independent Contractor Status:
Nothing contained herein shall create an agency, partnership, joint venture, or employment relationship between the parties. Neither party has authority to bind the other without express prior written approval.

6. Governing Law & Dispute Resolution:
This Agreement shall be governed by, construed, and enforced in accordance with the laws of ${governingLaw}, without giving effect to any principles of conflicts of law. Any controversy or dispute shall first be negotiated in good faith before formal proceedings.

7. Severability & Entire Agreement:
If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall remain in full force and effect. This instrument constitutes the entire agreement between the parties and supersedes all prior proposals, oral or written.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.

___________________________________
${party1}
[Authorized Representative Signature]
Title: [Authorized Representative Title]
Date: ${cleanDates}

___________________________________
${party2}
[Authorized Representative Signature]
Title: [Authorized Representative Title]
Date: ${cleanDates}`;
}

export function generateClientTemplateAnalysis(docText: string, docType: string): DocumentAnalysis {
  return {
    summary: `This is a legally structured ${docType} establishing covenants, commitments, and enforcement standards between the named contracting parties.`,
    key_obligations: [
      'Timely performance and delivery of services according to specifications',
      'Adherence to strict confidentiality and non-disclosure standards',
      'Clear schedule for compensation and invoice settlements',
      'Compliance with dispute resolution and governing jurisdiction covenants',
    ],
    risk_flags: [
      'Ensure termination notice windows (e.g. 15 or 30 days) align with operational reality',
      'Verify intellectual property assignment clauses match agreed scope',
      'Confirm jurisdiction and governing law are convenient to both contracting parties',
    ],
    contract_scores: {
      fairness: 88,
      clarity: 92,
      protection: 90,
    },
  };
}
