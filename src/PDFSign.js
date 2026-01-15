import PDFViewer from './PDFViewer';
import LocationLayer from './LocationLayer';
import { useState, forwardRef, useImperativeHandle, useMemo, useCallback, useEffect } from 'react';
import { useIntl } from '@kne/react-intl';
import withLocale from './withLocale';
import useRefCallback from '@kne/use-ref-callback';
import signPdfFile from './signPdfFile';
import getInitLocation from './getInitLocation';
import computedPDFSignLocation from './computedPDFSignLocation';

const PDFSignInner = forwardRef(({ size, currentPage, placeholder, signature, url, width = 200, height = 80, padding, filename = 'signed-document.pdf', location, setLocation, onChange }, ref) => {
  const initLocation = useMemo(() => {
    return getInitLocation({ stageWidth: size.originalWidth, stageHeight: size.originalHeight, width, height });
  }, [size, width, height]);

  const targetLocation = useMemo(() => {
    return Object.assign({}, initLocation, location);
  }, [initLocation, location]);

  const setTargetLocation = value => setLocation(Object.assign({}, initLocation, value));

  const pdfSignature = useMemo(() => {
    return Object.assign(
      {},
      computedPDFSignLocation({
        location: targetLocation,
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
  }, [targetLocation, signature, url, filename, size, currentPage]);
  const signPdf = useCallback(async () => {
    return await signPdfFile(pdfSignature);
  }, [pdfSignature]);

  useImperativeHandle(ref, () => ({
    getLocation: () => location,
    setLocation: value => setTargetLocation(value),
    getPdfSignature: () => pdfSignature,
    sign: () => signPdf()
  }));

  const handlerChange = useRefCallback(onChange);

  useEffect(() => {
    handlerChange?.({ pdfSignature, location });
  }, [pdfSignature, location, handlerChange]);

  return (
    <div style={{ transform: `scale(${size.width / size.originalWidth})`, transformOrigin: '0 0' }}>
      <LocationLayer stageWidth={size.originalWidth} stageHeight={size.originalHeight} width={width} height={height} padding={padding} placeholder={placeholder} signature={signature} value={targetLocation} onChange={setTargetLocation} />
    </div>
  );
});

const PDFSign = withLocale(
  forwardRef(({ placeholder, signature, url, width, height, padding, filename = 'signed-document.pdf', defaultLocation, onChange, ...props }, ref) => {
    const [location, setLocation] = useState(Object.assign({}, defaultLocation));
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
              location={location}
              setLocation={setLocation}
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
