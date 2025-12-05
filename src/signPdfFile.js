import { PDFDocument } from 'pdf-lib';

const signPdfFile = async pdfSignature => {
  const { x, y, page, width, height, signature, url, filename } = pdfSignature;
  const response = await window.fetch(url);
  const pdfBytes = await response.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pdfPage = pdfDoc.getPage(page - 1);

  const signatureBytes = await window.fetch(signature).then(res => res.arrayBuffer());
  const signatureImageEmbed = await pdfDoc.embedPng(signatureBytes);

  pdfPage.drawImage(signatureImageEmbed, {
    x,
    y,
    width,
    height
  });

  const modifiedPdfBytes = await pdfDoc.save();
  return new window.File([modifiedPdfBytes], filename, { type: 'application/pdf' });
};

export default signPdfFile;
