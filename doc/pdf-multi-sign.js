const { PDFSignMulti, useSignature } = _ReactPdfSign;
const { useState, useRef } = React;
const { Flex, Button, Switch, App } = antd;

const BaseExample = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [isEdit, setIsEdit] = useState(true);
  const [isFat, setIsFat] = useState(false);
  const ref = useRef(null);
  const [signatureList, setSignatureList] = useState([]);
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
      </Flex>
      <Flex gap={8} align="center" justify="space-between">
        <Flex gap={8} align="center">
          {pdfFile && (
            <Flex gap={8}>
              <div>编辑模式:</div>
              <Switch value={isEdit} onChange={setIsEdit} />
            </Flex>
          )}
          {pdfFile && !isEdit && (
            <Flex gap={8}>
              <div>页面是否平铺:</div>
              <Switch value={isFat} onChange={setIsFat} />
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
        </Flex>
        <Flex gap={8} align="center">
          {pdfFile && !isEdit && (
            <Flex>
              <div>已签名/签名区:</div>
              <div>
                {signatureList.filter(item => item.signature).length}/{signatureList.length}
              </div>
            </Flex>
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
      </Flex>
      {pdfFile ? (
        <PDFSignMulti
          url={pdfFile}
          ref={ref}
          isEdit={isEdit}
          isFlat={!isEdit && isFat}
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
          onChange={setSignatureList}
        />
      ) : null}
    </Flex>
  );
};

render(<BaseExample />);
