import { Document, Page, pdfjs } from 'react-pdf';
import { useMemo, useState } from 'react';
import { usePreset } from '@kne/global-context';
import useResize from '@kne/use-resize';
import classnames from 'classnames';
import { Spin, Flex } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import style from '../style.module.scss';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

const PDFViewer = ({ className, defaultPage, apis: propsApis, pdfjsUrl: pdfjsUrlProps, url, maxWidth = 1200, children }) => {
  const { apis: baseApis } = usePreset();
  const apis = Object.assign({}, baseApis, propsApis);
  const pdfjsUrl = pdfjsUrlProps || apis.file?.pdfjsUrl || 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.296';
  pdfjs.GlobalWorkerOptions.workerSrc = pdfjsUrl + '/build/pdf.worker.min.mjs';
  const documentProps = useMemo(() => {
    return {
      file: url,
      options: {
        standardFontDataUrl: pdfjsUrl + '/standard_fonts/',
        cMapUrl: pdfjsUrl + '/cmaps/',
        cMapPacked: true
      }
    };
  }, [pdfjsUrl, url]);
  const [width, setWidth] = useState(maxWidth);
  const [size, setSize] = useState(null);
  const [pageSize, setPageSize] = useState(0);
  const [currentPage, setCurrentPage] = useState(defaultPage || 1);
  const ref = useResize(() => {
    if (ref.current && ref.current.clientWidth) {
      setWidth(Math.min(ref.current.clientWidth, maxWidth));
    }
  });
  return (
    <div
      ref={ref}
      className={classnames(className, style['pdf-view-container'], 'pdf-view-container')}
      style={{
        maxWidth: maxWidth
      }}
    >
      <div className={classnames(style['pdf-view'], 'pdf-view')}>
        <Document
          {...Object.assign({}, documentProps)}
          loading={
            <Flex justify="center">
              <Spin />
            </Flex>
          }
          onLoadSuccess={({ numPages, ...props }) => {
            setPageSize(numPages);
            if (!Number.isInteger(defaultPage)) {
              setCurrentPage(numPages);
            }
          }}
        >
          <Page
            width={width}
            pageNumber={currentPage}
            renderTextLayer={true}
            onLoadSuccess={page => {
              setSize({ width: Math.round(page.width), height: Math.round(page.height), originalWidth: page.originalWidth, originalHeight: page.originalHeight });
            }}
          />
        </Document>
      </div>
      {size && children && <div className={classnames(style['pdf-view-children'], 'pdf-view-children')}>{typeof children === 'function' ? children({ size, currentPage, pageSize }) : children}</div>}
      <div className={classnames(style['pdf-view-page-control'], 'pdf-view-page-control')}>
        {currentPage > 1 && (
          <LeftOutlined
            className={classnames(style['pdf-view-page-control-left'], 'pdf-view-page-control-left')}
            onClick={() => {
              setCurrentPage(currentPage - 1);
            }}
          />
        )}
        {currentPage < pageSize && (
          <RightOutlined
            className={classnames(style['pdf-view-page-control-right'], 'pdf-view-page-control-right')}
            onClick={() => {
              setCurrentPage(currentPage + 1);
            }}
          />
        )}
        {pageSize ? (
          <div className={classnames(style['pdf-view-page-control-current'], 'pdf-view-page-control-current')}>
            {currentPage}/{pageSize}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PDFViewer;
