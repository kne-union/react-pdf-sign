import { forwardRef, useState, useImperativeHandle, useMemo, useEffect } from 'react';
import omit from 'lodash/omit';
import PDFViewer from './PDFViewer';
import { LocationGroup } from './LocationLayer';
import withLocale from './withLocale';
import { useIntl } from '@kne/react-intl';
import { signMultiPdfFile } from './signPdfFile';
import computedPDFSignLocation from './computedPDFSignLocation';
import getInitLocation from './getInitLocation';

const PDFSignMultiInner = forwardRef(({ size, currentPage, placeholder, url, width = 200, height = 80, padding, filename = 'signed-document.pdf', signatureList, setSignatureList, isEdit, onSign, onChange }, ref) => {
  const { formatMessage } = useIntl();

  const pdfSignatureList = useMemo(() => {
    return signatureList
      .filter(location => location.signature)
      .map(location => {
        return Object.assign(
          {},
          computedPDFSignLocation({
            location,
            size
          }),
          {
            page: location.page,
            signature: location.signature
          }
        );
      });
  }, [signatureList, size]);

  useEffect(() => {
    onChange && onChange(signatureList);
  }, [signatureList]);

  useImperativeHandle(ref, () => ({
    getSignatureList: () => {
      return signatureList.map(item => {
        return omit(item, ['signature']);
      });
    },
    setSignatureList: value => setSignatureList(value),
    getPdfSignatureList: () => {
      return pdfSignatureList;
    },
    sign: () => {
      if (!pdfSignatureList.length) {
        return Promise.reject(new Error(formatMessage({ id: 'signatureAdd' })));
      }
      return signMultiPdfFile({
        url,
        filename,
        signatureList: pdfSignatureList
      });
    },
    addSignLocation: page => {
      setSignatureList(signatureList => {
        return [...signatureList, Object.assign({}, getInitLocation({ width, height, stageWidth: size.originalWidth, stageHeight: size.originalHeight }), { page: page || currentPage })];
      });
    }
  }));

  const scale = size.width / size.originalWidth;

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: '0 0' }}>
      <LocationGroup
        isEdit={isEdit}
        currentPage={currentPage}
        stageWidth={size.originalWidth}
        stageHeight={size.originalHeight}
        width={width}
        height={height}
        padding={padding}
        placeholder={placeholder}
        value={signatureList}
        onChange={setSignatureList}
        onClick={({ index, value }) => {
          onSign &&
            onSign({
              size: value.size,
              callback: signature => {
                setSignatureList(value => {
                  const newValue = value.slice(0);
                  newValue[index] = Object.assign({}, newValue[index], { signature });
                  return newValue;
                });
              }
            });
        }}
      />
    </div>
  );
});

const PDFSignMulti = withLocale(
  forwardRef(({ placeholder, url, width, height, padding, filename = 'signed-document.pdf', defaultSignatureList, onSign, onChange, isEdit, ...props }, ref) => {
    const [signatureList, setSignatureList] = useState(defaultSignatureList || []);
    return (
      <PDFViewer {...props} url={url}>
        {({ size, currentPage }) => {
          return (
            <PDFSignMultiInner
              ref={ref}
              size={size}
              currentPage={currentPage}
              url={url}
              filename={filename}
              signatureList={signatureList}
              setSignatureList={setSignatureList}
              width={width}
              height={height}
              padding={padding}
              placeholder={placeholder}
              onChange={onChange}
              onSign={onSign}
              isEdit={isEdit}
            />
          );
        }}
      </PDFViewer>
    );
  })
);

export default PDFSignMulti;
