const { LocationLayer, LocationGroup } = _ReactPdfSign;
const { Flex, Button, Switch, App } = antd;
const { useState } = React;

const defaultList = [
  {
    size: {
      width: 200,
      height: 80,
      x: 325,
      y: 78
    },
    scaleX: 1,
    scaleY: 1,
    x: 325,
    y: 78
  },
  {
    size: {
      width: 200,
      height: 80,
      x: 44,
      y: 78
    },
    scaleX: 1,
    scaleY: 1,
    x: 44,
    y: 78
  },
  {
    size: {
      width: 200,
      height: 80,
      x: 126,
      y: 206
    },
    scaleX: 1,
    scaleY: 1,
    x: 126,
    y: 206
  },
  {
    size: {
      width: 200,
      height: 195,
      x: 129,
      y: 308
    },
    scaleX: 1,
    scaleY: 2.44,
    x: 129,
    y: 308
  },
  {
    size: {
      width: 135,
      height: 217,
      x: 355,
      y: 182
    },
    scaleX: 0.67,
    scaleY: 2.71,
    x: 355,
    y: 182
  }
];

const BaseExample = () => {
  const [value, setValue] = useState(defaultList);
  const [isEdit, setIsEdit] = useState(true);
  const { modal } = App.useApp();
  return (
    <Flex vertical gap={10}>
      <LocationLayer stageWidth={600} stageHeight={400} />
      <Flex vertical gap={4}>
        <Flex gap={8} align="center">
          <Button
            onClick={() => {
              setValue(value => {
                return [...value, {}];
              });
            }}>
            添加
          </Button>
          <Flex gap={4}>
            <div>编辑模式:</div>
            <Switch value={isEdit} onChange={setIsEdit} />
          </Flex>
        </Flex>
        <LocationGroup
          stageWidth={600}
          stageHeight={600}
          value={value}
          onChange={setValue}
          isEdit={isEdit}
          placeholder={isEdit ? '签名区域' : '点击获取点击区域'}
          onClick={output => {
            modal.info({
              title: '非编辑模式获取签名点击区域',
              content: (
                <div style={{ maxHeight: 400, overflow: 'auto' }}>
                  <pre style={{ 'white-space': 'break-spaces' }}>{JSON.stringify(output, null, 2)}</pre>
                </div>
              )
            });
          }}
        />
      </Flex>
    </Flex>
  );
};

render(<BaseExample />);
