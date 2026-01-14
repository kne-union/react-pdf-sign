import PDFViewer from './PDFViewer';
import LocationLayer from './LocationLayer';
import { useState, forwardRef, useImperativeHandle, useMemo, useCallback, useEffect } from 'react';
import { useIntl } from '@kne/react-intl';
import withLocale from './withLocale';
import useRefCallback from '@kne/use-ref-callback';
import signPdfFile from './signPdfFile';
import getInitLocation from './getInitLocation';
import computedPDFSignLocation from './computedPDFSignLocation';

const PDFSignInner = forwardRef(({ size, currentPage, placeholder, signature, url, width = 200, height = 80, padding, filename = 'signed-document.pdf', defaultLocation, onChange }, ref) => {
  const initLocation = useMemo(() => {
    return getInitLocation({ stageWidth: size.width, stageHeight: size.height, width, height });
  }, [size, width, height]);
  const [location, setLocationOrigin] = useState(Object.assign({}, initLocation, defaultLocation));
  const setLocation = useRefCallback(value => {
    setLocationOrigin(Object.assign({}, initLocation, value));
  });
  const pdfSignature = useMemo(() => {
    return Object.assign(
      {},
      computedPDFSignLocation({
        location,
        size
      }),
      {
        signature,
        url,
        filename,
        page: currentPage,
        pageWidth: Math.round(size.originalWidth),
        pageHeight: Math.round(size.originalHeight)
      }
    );
  }, [location, signature, url, filename, size, currentPage]);
  const signPdf = useCallback(async () => {
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

  return <LocationLayer stageWidth={size.width} stageHeight={size.height} width={width} height={height} padding={padding} placeholder={placeholder} signature={signature} value={location} onChange={setLocation} />;
});

const PDFSign = withLocale(
  forwardRef(({ placeholder, signature, url, width, height, padding, filename = 'signed-document.pdf', defaultLocation, onChange, ...props }, ref) => {
    return (
      <PDFViewer {...props} url={url}>
        {({ size, currentPage }) => {
          return (
            <PDFSignInner
              ref={ref}
              size={size}
              currentPage={currentPage}
              url={url}
              filename={filename}
              defaultLocation={defaultLocation}
              width={width}
              height={height}
              padding={padding}
              placeholder={placeholder}
              signature={signature}
              onChange={onChange}
            />
          );
        }}
      </PDFViewer>
    );
  })
);

export default PDFSign;
