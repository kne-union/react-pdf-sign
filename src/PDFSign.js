import PDFViewer from './PDFViewer';
import LocationLayer from './LocationLayer';
import { useState, forwardRef, useImperativeHandle, useMemo, useCallback } from 'react';
import isEqual from 'lodash/isEqual';
import { PDFDocument } from 'pdf-lib';
import { useIntl } from '@kne/react-intl';
import withLocale from './withLocale';

const PDFSign = withLocale(
  forwardRef(({ placeholder, signature, url, width, height, padding, filename = 'signed-document.pdf', ...props }, ref) => {
    const [location, setLocation] = useState({});
    const [pdfProps, setPdfProps] = useState(null);
    const { formatMessage } = useIntl();
    const pdfSignature = useMemo(() => {
      if (!pdfProps) {
        return null;
      }
      const { size, currentPage } = pdfProps;
      const scaleX = size.width / size.originalWidth;
      const scaleY = size.height / size.originalHeight;
      const pdfX = Math.round(location.size.x / scaleX);
      const pdfY = Math.round(size.originalHeight - location.size.y / scaleY);

      return {
        x: pdfX,
        y: pdfY - location.size.height,
        page: currentPage,
        pageWidth: size.originalWidth,
        pageHeight: size.originalHeight,
        width: location.size.width,
        height: location.size.height,
        signature,
        url
      };
    }, [pdfProps, location, signature, url]);
    const signPdf = useCallback(async () => {
      if (!pdfProps) {
        throw new Error(formatMessage({ id: 'loadingError' }));
      }
      const { x, y, page, width, height, signature, url } = pdfSignature;
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
    }, [pdfSignature]);
    useImperativeHandle(ref, () => ({
      getLocation: () => location,
      setLocation: value => setLocation(value),
      getPdfSignature: () => pdfSignature,
      sign: () => signPdf()
    }));

    return (
      <PDFViewer {...props} url={url}>
        {({ size, currentPage }) => {
          setTimeout(() => {
            if (!isEqual({ size, currentPage }, pdfProps)) {
              setPdfProps({ size, currentPage });
            }
          }, 0);
          return <LocationLayer stageWidth={size.width} stageHeight={size.height} width={width} height={height} padding={padding} placeholder={placeholder} signature={signature} value={location} onChange={setLocation} />;
        }}
      </PDFViewer>
    );
  })
);

export default PDFSign;
