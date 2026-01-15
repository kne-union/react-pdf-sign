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
| isFlat               | boolean  | -                     | 是否平铺显示所有页面     |
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

| 属性          | 类型      | 默认值  | 说明                |
|-------------|---------|------|-------------------|
| url         | string  | -    | PDF 文件的 URL 地址    |
| className   | string  | -    | 自定义 CSS 类名        |
| defaultPage | number  | 1    | 默认显示的页码           |
| maxWidth    | number  | 1200 | 最大显示宽度            |
| pdfjsUrl    | string  | -    | 自定义 pdf.js CDN 地址 |
| apis        | object  | -    | API 配置对象          |
| isFlat      | boolean | -    | 是否平铺显示所有页面        |

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
