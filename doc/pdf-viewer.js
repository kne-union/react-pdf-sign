const { PDFViewer } = _ReactPdfSign;
const { default: examplePdf } = _examplePdf;

const BaseExample = () => {
  return (
    <div>
      <PDFViewer url={examplePdf} />
    </div>
  );
};

render(<BaseExample />);
