### PDFSign

主要的 PDF 签名组件，集成了 PDF 查看器和签名定位功能。

| 属性          | 类型     | 默认值       | 说明             |
|-------------|--------|-----------|----------------|
| url         | string | -         | PDF 文件的 URL 地址 |
| signature   | string | -         | 签名图片的 URL 地址   |
| width       | number | 200       | 签名区域的宽度        |
| height      | number | 50        | 签名区域的高度        |
| padding     | number | 8         | 签名区域变换器的内边距    |
| placeholder | string | '拖拽到签名位置' | 签名区域的占位文本      |

#### 实例方法

| 方法名             | 参数               | 返回值           | 说明            |
|-----------------|------------------|---------------|---------------|
| getLocation     | -                | object        | 获取当前签名位置信息    |
| setLocation     | location: object | -             | 设置签名位置        |
| getPdfSignature | -                | object        | 获取 PDF 签名信息   |
| sign            | -                | Promise<File> | 生成签名后的 PDF 文件 |

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

| 属性          | 类型       | 默认值       | 说明       |
|-------------|----------|-----------|----------|
| stageWidth  | number   | -         | 画布宽度（必需） |
| stageHeight | number   | -         | 画布高度（必需） |
| width       | number   | 200       | 签名区域宽度   |
| height      | number   | 50        | 签名区域高度   |
| padding     | number   | 8         | 变换器内边距   |
| placeholder | string   | '拖拽到签名位置' | 占位文本     |
| signature   | string   | -         | 签名图片 URL |
| value       | object   | -         | 受控的位置值   |
| onChange    | function | -         | 位置变化回调   |

### useSignature

签名画板 Hook，提供手写签名功能。

#### 返回的函数参数

| 参数         | 类型       | 默认值             | 说明         |
|------------|----------|-----------------|------------|
| filename   | string   | 'signature.png' | 签名文件名      |
| width      | number   | 200             | 签名画板宽度     |
| height     | number   | 50              | 签名画板高度     |
| onSuccess  | function | -               | 签名完成回调     |
| modalProps | object   | -               | Modal 组件属性 |

#### Hook 配置参数

| 参数     | 类型     | 默认值 | 说明       |
|--------|--------|-----|----------|
| width  | number | 200 | 默认签名画板宽度 |
| height | number | 50  | 默认签名画板高度 |