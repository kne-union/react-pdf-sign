import PDFViewer from './PDFViewer';
import LocationLayer from './LocationLayer';
import { useState, forwardRef, useImperativeHandle, useMemo, useCallback, useEffect } from 'react';
import isEqual from 'lodash/isEqual';
import { useIntl } from '@kne/react-intl';
import withLocale from './withLocale';
import useRefCallback from '@kne/use-ref-callback';
import signPdfFile from './signPdfFile';

const PDFSign = withLocale(
  forwardRef(({ placeholder, signature, url, width, height, padding, filename = 'signed-document.pdf', defaultLocation, onChange, ...props }, ref) => {
    const [location, setLocation] = useState(Object.assign({}, defaultLocation));
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
      const signWidth = Math.round(location.size.width / scaleX);
      const signHeight = Math.round(location.size.height / scaleY);

      return {
        x: pdfX,
        y: pdfY - signHeight,
        page: currentPage,
        pageWidth: Math.round(size.originalWidth),
        pageHeight: Math.round(size.originalHeight),
        width: signWidth,
        height: signHeight,
        signature,
        url,
        filename
      };
    }, [pdfProps, location, signature, url, filename]);
    const signPdf = useCallback(async () => {
      if (!pdfProps) {
        throw new Error(formatMessage({ id: 'loadingError' }));
      }
      return await signPdfFile(pdfSignature);
    }, [pdfSignature]);
    useImperativeHandle(ref, () => ({
      getLocation: () => location,
      setLocation: value => setLocation(value),
      getPdfSignature: () => pdfSignature,
      sign: () => signPdf()
    }));

    const handlerChange = useRefCallback(onChange);

    useEffect(() => {
      handlerChange?.({ pdfSignature, location });
    }, [pdfSignature, location, handlerChange]);

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
