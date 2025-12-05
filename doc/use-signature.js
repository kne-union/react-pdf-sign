const { useSignature } = _ReactPdfSign;
const { Button, Flex } = antd;

const { useState } = React;

const BaseExample = () => {
  const [result, setResult] = useState(null);
  const modal = useSignature();
  return (
    <Flex vertical gap={12}>
      {result && <img src={result} alt="result" style={{ width: '300px' }} />}
      <Flex gap={8}>
        <Button
          onClick={() => {
            modal({
              onSuccess: file => {
                console.log(file);
                setResult(URL.createObjectURL(file));
              }
            });
          }}>
          签名
        </Button>
        <Button
          onClick={() => {
            modal({
              mask: (
                <Flex justify="flex-end" align="flex-end" style={{ height: '100%', width: '100%', padding: '10px', boxSizing: 'border-box' }}>
                  签字日期: {new Date().toLocaleDateString()}
                </Flex>
              ),
              onSuccess: file => {
                console.log(file);
                setResult(URL.createObjectURL(file));
              }
            });
          }}>
          带有日期模版的签名
        </Button>
      </Flex>
    </Flex>
  );
};

render(<BaseExample />);
