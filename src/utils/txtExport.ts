export function exportToTxt(text: string, docType: string): void {
  // Sanitize and normalize clean line breaks
  const cleanContent = text
    .replace(/\r\n/g, '\n')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");

  const blob = new Blob([cleanContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileName = `${docType.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.txt`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
