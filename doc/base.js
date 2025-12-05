const { default: ReactPdfSign, useSignature } = _ReactPdfSign;
const { useState, useRef } = React;
const { Flex, Button } = antd;

const BaseExample = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [sign, setSign] = useState(null);
  const ref = useRef(null);
  const signatureModal = useSignature();
  return (
    <Flex vertical gap={12}>
      <Flex gap={8}>
        <Button>
          <input
            type="file"
            accept="application/pdf"
            onChange={e => {
              const file = e.target.files[0];
              setPdfFile(URL.createObjectURL(file));
            }}
          />
        </Button>
        <Button
          onClick={() => {
            const { size } = ref.current.getLocation();
            signatureModal({
              mask: (
                <Flex justify="flex-end" align="flex-end" style={{ height: '100%', width: '100%', padding: '10px', boxSizing: 'border-box' }}>
                  签字日期: {new Date().toLocaleDateString()}
                </Flex>
              ),
              width: size.width,
              height: size.height,
              onSuccess: file => {
                setSign(URL.createObjectURL(file));
              }
            });
          }}>
          添加签名
        </Button>
        {pdfFile && sign && (
          <Button
            onClick={async () => {
              const blob = await ref.current.sign();
              const link = document.createElement('a');
              const url = URL.createObjectURL(blob);
              link.href = url;
              link.download = 'signed-document.pdf';
              link.click();
              URL.revokeObjectURL(url);
            }}>
            生成签名PDF
          </Button>
        )}
      </Flex>
      {pdfFile ? <ReactPdfSign url={pdfFile} signature={sign} ref={ref} /> : null}
    </Flex>
  );
};

render(<BaseExample />);
