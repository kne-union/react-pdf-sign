const { PDFSign } = _ReactPdfSign;
const { default: examplePdf } = _examplePdf;
const { default: signature } = _signature;
const { useRef } = React;
const { Flex, Button, App } = antd;

const BaseExample = () => {
  const ref = useRef();
  const ref2 = useRef();
  const { modal } = App.useApp();
  return (
    <Flex vertical gap={24}>
      <Flex vertical gap={8}>
        <Flex gap={8}>
          <Button
            onClick={() => {
              const location = ref.current.getLocation();
              modal.info({
                title: '签名位置',
                content: <pre>{JSON.stringify(location, null, 2)}</pre>
              });
            }}>
            获取签名位置
          </Button>
          <Button
            onClick={() => {
              ref.current.setLocation({
                size: {
                  width: 390,
                  height: 156,
                  x: 163,
                  y: 8
                },
                scaleX: 1.95,
                scaleY: 1.95,
                x: 163,
                y: 8
              });
            }}>
            设置签名位置
          </Button>
          <Button onClick={()=>{
            ref.current.setLocation({});
          }}>恢复到默认位置</Button>
          <Button
            onClick={() => {
              const pdfSignature = ref.current.getPdfSignature();
              modal.info({
                title: 'PDF签名信息',
                content: <pre style={{ 'white-space': 'break-spaces' }}>{JSON.stringify(pdfSignature, null, 2)}</pre>
              });
            }}>
            获取PDF签名信息
          </Button>
        </Flex>
        <PDFSign url={examplePdf} ref={ref} />
      </Flex>
      <Flex vertical gap={8}>
        <div>
          <Button
            onClick={async () => {
              const blob = await ref2.current.sign();
              const link = document.createElement('a');
              const url = URL.createObjectURL(blob);
              link.href = url;
              link.download = 'signed-document.pdf';
              link.click();
              URL.revokeObjectURL(url);
            }}>
            生成签名文件
          </Button>
        </div>
        <PDFSign url={examplePdf} signature={signature} ref={ref2} />
      </Flex>
    </Flex>
  );
};

render(<BaseExample />);
