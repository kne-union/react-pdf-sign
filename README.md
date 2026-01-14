
# react-pdf-sign


### 描述

这是一个功能强大的 React PDF 签名组件库，专为需要在 PDF 文档上添加电子签名的应用场景而设计。该组件库提供了灵活的签名解决方案，支持即时签名添加和预定义签名区域两种模式


### 安装

```shell
npm i --save @kne/react-pdf-sign
```


### 概述

这是一个功能强大的 React PDF 签名组件库，专为需要在 PDF 文档上添加电子签名的应用场景而设计。该组件库提供了灵活的签名解决方案，支持单签名位置和多签名位置两种模式，满足不同业务需求。

## 核心特性

**直观的签名体验** - 提供手写签名画板，用户可以通过鼠标或触摸设备自然地绘制签名，签名支持实时预览和调整。支持在签名画板上叠加自定义内容，如日期、文字等。

**灵活的定位控制** - 签名区域可以在 PDF 页面上自由拖拽、缩放和精确定位，支持保持比例缩放，确保签名的视觉效果。

**多位置签名支持** - 支持在 PDF 文档的多个页面或同一页面的不同位置添加签名，通过 `PDFSignMulti` 组件实现批量签名管理，可动态添加、删除签名位置。

**完整的 PDF 操作** - 基于 pdf-lib 和 react-pdf，支持多页 PDF 文档的浏览、签名定位和最终签名文件的生成。

**组件化设计** - 提供多个独立组件（PDFSign、PDFSignMulti、PDFViewer、LocationLayer、useSignature），开发者可以根据需求灵活组合使用。支持默认签名位置设置和位置变化回调，便于集成到现有业务流程。

**智能位置计算** - 内置 `computedPDFSignLocation` 和 `getInitLocation` 工具函数，自动处理显示坐标与 PDF 原始坐标的转换，简化开发复杂度。

**国际化支持** - 内置中英文语言包，支持多语言切换，适合国际化应用。

**现代化技术栈** - 基于 React 18+，使用 Konva.js 实现高性能的图形渲染，支持响应式设计。

## 使用场景

- 合同签署系统 - 支持多方签名位置预定义
- 文档审批流程 - 单个或多个审批人签名
- 电子表单签名 - 固定位置的表单签名
- 证书颁发系统 - 多签名证书生成
- 法律文件签署 - 多方见证签名

该组件库简化了 PDF 签名的复杂实现，开发者只需要几行代码就能集成完整的签名功能，大大提升了开发效率。新增的多位置签名功能和智能坐标计算让复杂场景的实现变得简单快捷。

### 示例

#### 示例代码

- 完整签名流程
- 演示PDF上传、手写签名创建和签名PDF生成的完整工作流程
- _ReactPdfSign(@kne/current-lib_react-pdf-sign)[import * as _ReactPdfSign from "@kne/react-pdf-sign"],antd(antd),(@kne/current-lib_react-pdf-sign/dist/index.css)

```jsx
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
        {pdfFile && (
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
        )}
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

```

- 多位置PDF签名
- 演示在同一PDF文档中添加多个签名位置的完整流程：1. 上传PDF文档；2. 在编辑模式下点击'添加签名位置'按钮为不同页面添加签名区域；3. 切换至非编辑模式进行签名；4. 完成所有签名后点击'生成签名PDF'导出已签名的文档
- _ReactPdfSign(@kne/current-lib_react-pdf-sign)[import * as _ReactPdfSign from "@kne/react-pdf-sign"],antd(antd),(@kne/current-lib_react-pdf-sign/dist/index.css)

```jsx
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

```

- 签名定位层
- 展示独立的签名定位组件，支持拖拽和缩放调整签名位置
- _ReactPdfSign(@kne/current-lib_react-pdf-sign)[import * as _ReactPdfSign from "@kne/react-pdf-sign"],antd(antd),(@kne/current-lib_react-pdf-sign/dist/index.css)

```jsx
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

```

- PDF查看器
- 基础的PDF文档查看器，支持页面切换和缩放显示
- _ReactPdfSign(@kne/current-lib_react-pdf-sign)[import * as _ReactPdfSign from "@kne/react-pdf-sign"],_examplePdf(./doc/example.pdf),(@kne/current-lib_react-pdf-sign/dist/index.css)

```jsx
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

```

- PDF签名组件
- 演示PDF签名组件的API使用，包括位置获取、设置和签名文件生成
- _ReactPdfSign(@kne/current-lib_react-pdf-sign)[import * as _ReactPdfSign from "@kne/react-pdf-sign"],_examplePdf(./doc/example.pdf),_signature(./doc/signature.png),antd(antd),(@kne/current-lib_react-pdf-sign/dist/index.css)

```jsx
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

```

- 手写签名画板
- 展示useSignature Hook的使用，打开手写签名模态框
- _ReactPdfSign(@kne/current-lib_react-pdf-sign)[import * as _ReactPdfSign from "@kne/react-pdf-sign"],antd(antd),(@kne/current-lib_react-pdf-sign/dist/index.css)

```jsx
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

```


### API

### PDFSign

主要的 PDF 签名组件，集成了 PDF 查看器和签名定位功能，适用于单签名场景。

| 属性              | 类型       | 默认值                   | 说明             |
|-----------------|----------|-----------------------|----------------|
| url             | string   | -                     | PDF 文件的 URL 地址 |
| signature       | string   | -                     | 签名图片的 URL 地址   |
| width           | number   | 200                   | 签名区域的宽度        |
| height          | number   | 80                    | 签名区域的高度        |
| padding         | number   | 8                     | 签名区域变换器的内边距    |
| placeholder     | string   | -                     | 签名区域的占位文本      |
| filename        | string   | 'signed-document.pdf' | 生成签名PDF的文件名    |
| defaultLocation | object   | -                     | 默认签名位置信息       |
| onChange        | function | -                     | 签名位置变化回调函数     |

#### 实例方法

| 方法名             | 参数               | 返回值           | 说明            |
|-----------------|------------------|---------------|---------------|
| getLocation     | -                | object        | 获取当前签名位置信息    |
| setLocation     | location: object | -             | 设置签名位置        |
| getPdfSignature | -                | object        | 获取 PDF 签名信息   |
| sign            | -                | Promise<File> | 生成签名后的 PDF 文件 |

### PDFSignMulti

多位置 PDF 签名组件，支持在同一 PDF 文档中添加多个签名位置，适用于需要多方签名或多页面签名的场景。

| 属性                   | 类型       | 默认值                   | 说明             |
|----------------------|----------|-----------------------|----------------|
| url                  | string   | -                     | PDF 文件的 URL 地址 |
| width                | number   | 200                   | 签名区域的宽度        |
| height               | number   | 80                    | 签名区域的高度        |
| padding              | number   | 8                     | 签名区域变换器的内边距    |
| placeholder          | string   | -                     | 签名区域的占位文本      |
| filename             | string   | 'signed-document.pdf' | 生成签名PDF的文件名    |
| defaultSignatureList | array    | -                     | 默认签名位置列表       |
| isEdit               | boolean  | -                     | 是否处于编辑模式       |
| onSign               | function | -                     | 点击签名区域时的回调函数   |
| onChange             | function | -                     | 签名位置列表变化回调函数   |

#### 实例方法

| 方法名                 | 参数           | 返回值           | 说明            |
|---------------------|--------------|---------------|---------------|
| getSignatureList    | -            | array         | 获取当前签名位置列表    |
| setSignatureList    | value: array | -             | 设置签名位置列表      |
| getPdfSignatureList | -            | array         | 获取 PDF 签名信息列表 |
| sign                | -            | Promise<File> | 生成签名后的 PDF 文件 |
| addSignLocation     | -            | -             | 添加一个新的签名位置    |

### PDFViewer

PDF 文档查看器组件，提供 PDF 页面浏览功能。

| 属性          | 类型     | 默认值  | 说明                |
|-------------|--------|------|-------------------|
| url         | string | -    | PDF 文件的 URL 地址    |
| className   | string | -    | 自定义 CSS 类名        |
| defaultPage | number | 1    | 默认显示的页码           |
| maxWidth    | number | 1200 | 最大显示宽度            |
| pdfjsUrl    | string | -    | 自定义 pdf.js CDN 地址 |
| apis        | object | -    | API 配置对象          |

#### children 渲染属性

当 children 为函数时，会传入以下参数：

| 参数          | 类型     | 说明        |
|-------------|--------|-----------|
| size        | object | 当前页面的尺寸信息 |
| currentPage | number | 当前页码      |
| pageSize    | number | 总页数       |

### LocationLayer

签名定位层组件，用于在 PDF 上定位和调整签名区域。

| 属性          | 类型       | 默认值 | 说明       |
|-------------|----------|-----|----------|
| stageWidth  | number   | -   | 画布宽度（必需） |
| stageHeight | number   | -   | 画布高度（必需） |
| width       | number   | 200 | 签名区域宽度   |
| height      | number   | 80  | 签名区域高度   |
| padding     | number   | 8   | 变换器内边距   |
| placeholder | string   | -   | 占位文本     |
| signature   | string   | -   | 签名图片 URL |
| value       | object   | -   | 受控的位置值   |
| onChange    | function | -   | 位置变化回调   |

### LocationGroup

签名位置组组件，用于管理多个签名位置。

| 属性          | 类型       | 默认值  | 说明         |
|-------------|----------|------|------------|
| stageWidth  | number   | -    | 画布宽度（必需）   |
| stageHeight | number   | -    | 画布高度（必需）   |
| isEdit      | boolean  | true | 是否处于编辑模式   |
| currentPage | number   | -    | 当前页码       |
| value       | array    | -    | 受控的位置值数组   |
| onChange    | function | -    | 位置列表变化回调   |
| onClick     | function | -    | 点击签名区域时的回调 |

### useSignature

签名画板 Hook，提供手写签名功能。

#### 返回的函数参数

| 参数         | 类型        | 默认值             | 说明         |
|------------|-----------|-----------------|------------|
| filename   | string    | 'signature.png' | 签名文件名      |
| width      | number    | 200             | 签名画板宽度     |
| height     | number    | 80              | 签名画板高度     |
| mask       | ReactNode | -               | 签名画板叠加内容   |
| onSuccess  | function  | -               | 签名完成回调     |
| modalProps | object    | -               | Modal 组件属性 |

### signPdfFile

签名文件生成工具函数，支持单个签名。

| 参数           | 类型     | 默认值 | 说明         |
|--------------|--------|-----|------------|
| pdfSignature | object | -   | PDF 签名配置对象 |

