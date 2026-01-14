const { PDFSignMulti, useSignature } = _ReactPdfSign;
const { useState, useRef } = React;
const { Flex, Button, Switch, App } = antd;

const BaseExample = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [isEdit, setIsEdit] = useState(true);
  const ref = useRef(null);
  const signatureModal = useSignature();
  const { message } = App.useApp();
  return (
    <Flex vertical gap={12}>
      <Flex gap={8} align="center">
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
        {pdfFile && (
          <Flex gap={8}>
            <div>编辑模式:</div>
            <Switch value={isEdit} onChange={setIsEdit} />
          </Flex>
        )}
        {pdfFile && isEdit && (
          <Button
            onClick={() => {
              ref.current.addSignLocation();
            }}>
            添加签名位置
          </Button>
        )}
        {pdfFile && !isEdit && (
          <Button
            onClick={async () => {
              try {
                const blob = await ref.current.sign();
                const link = document.createElement('a');
                const url = URL.createObjectURL(blob);
                link.href = url;
                link.download = 'signed-document.pdf';
                link.click();
                URL.revokeObjectURL(url);
              } catch (e) {
                message.error(e.message);
              }
            }}>
            生成签名PDF
          </Button>
        )}
      </Flex>
      {pdfFile ? (
        <PDFSignMulti
          url={pdfFile}
          ref={ref}
          isEdit={isEdit}
          onSign={({ size, callback }) => {
            signatureModal({
              mask: (
                <Flex justify="flex-end" align="flex-end" style={{ height: '100%', width: '100%', padding: '10px', boxSizing: 'border-box' }}>
                  签字日期: {new Date().toLocaleDateString()}
                </Flex>
              ),
              width: size.width,
              height: size.height,
              onSuccess: file => {
                callback(URL.createObjectURL(file));
              }
            });
          }}
        />
      ) : null}
    </Flex>
  );
};

render(<BaseExample />);
