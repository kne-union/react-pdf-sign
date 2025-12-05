import PDFViewer from './PDFViewer';
import LocationLayer from './LocationLayer';
import { useState, forwardRef, useImperativeHandle, useMemo, useCallback, useEffect } from 'react';
import isEqual from 'lodash/isEqual';
import { useIntl } from '@kne/react-intl';
import withLocale from './withLocale';
import useRefCallback from '@kne/use-ref-callback';
import signPdfFile from './signPdfFile';

const PDFSignInner = forwardRef(({ size, currentPage, placeholder, signature, url, width = 200, height = 80, padding, filename = 'signed-document.pdf', defaultLocation, onChange }, ref) => {
  const initLocation = useMemo(() => {
    return {
      scaleX: 1,
      scaleY: 1,
      x: Math.round((size.width - width) / 2),
      y: Math.round((size.height - height) / 2),
      size: {
        width,
        height,
        x: Math.round((size.width - width) / 2),
        y: Math.round((size.height - height) / 2)
      }
    };
  }, [size, width, height]);
  const [location, setLocationOrigin] = useState(Object.assign({}, initLocation, defaultLocation));
  const setLocation = useRefCallback(value => {
    setLocationOrigin(Object.assign({}, initLocation, value));
  });
  const pdfSignature = useMemo(() => {
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
