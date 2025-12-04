const { useSignature } = _ReactPdfSign;
const { Button } = antd;

const BaseExample = () => {
  const modal = useSignature();
  return (
    <div>
      <Button
        onClick={() => {
          modal({
            onSuccess: file => {
              console.log(file);
            }
          });
        }}>
        签名
      </Button>
    </div>
  );
};

render(<BaseExample />);
