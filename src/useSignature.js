import SignatureCanvas from 'react-signature-canvas';
import { App, Button, Flex } from 'antd';
import classnames from 'classnames';
import { useRef, useState } from 'react';
import withLocale from './withLocale';
import { useIntl } from '@kne/react-intl';
import { snapdom } from '@zumer/snapdom';
import style from './style.module.scss';

const dataURLtoBlob = dataURL => {
  let arr = dataURL.split(',');
  // 注意base64的最后面中括号和引号是不转译的
  let _arr = arr[1].substring(0, arr[1].length - 2);
  let mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(_arr),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {
    type: mime
  });
};

const Signature = withLocale(({ onClose, onSuccess, filename, width, height, mask = null }) => {
  const { formatMessage } = useIntl();
  const { message } = App.useApp();
  const signatureCanvasRef = useRef(null);
  const maskRef = useRef(null);
  const [loading, setLoading] = useState(false);
  return (
    <Flex vertical gap={12} className={classnames(style['signature-modal-content'], 'signature-modal-content')}>
      <div
        className={classnames(style['signature-container'], 'signature-container')}
        style={{
          width: '100%',
          height: `${Math.round((height * 368) / width)}px`
        }}
      >
        <div className={classnames(style['signature-mask'], 'signature-mask')} ref={maskRef}>
          {mask}
        </div>
        <SignatureCanvas ref={signatureCanvasRef} canvasProps={{ className: classnames(style['signature-canvas'], 'signature-canvas') }} />
      </div>
      <Flex justify="flex-end" align="center" gap={10}>
        <Button
          onClick={() => {
            signatureCanvasRef.current.clear();
          }}
        >
          {formatMessage({ id: 'signatureCleanText' })}
        </Button>
        <Button
          loading={loading}
          type="primary"
          onClick={async () => {
            setLoading(true);
            try {
              if (signatureCanvasRef.current.isEmpty()) {
                message.error(formatMessage({ id: 'signatureEmptyError' }));
                return;
              }

              let result = signatureCanvasRef.current.toDataURL('image/png');

              if (mask) {
                const maskPng = await snapdom.toPng(maskRef.current, {
                  scale: 2
                });
                const canvas = document.createElement('canvas');
                canvas.width = width * 2;
                canvas.height = height * 2;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(maskPng, 0, 0, canvas.width, canvas.height);
                const resultImage = new Image();
                resultImage.src = result;
                await new Promise(resolve => {
                  resultImage.onload = resolve;
                });
                ctx.drawImage(resultImage, 0, 0, canvas.width, canvas.height);
                result = canvas.toDataURL('image/png');
              }

              const file = new window.File([dataURLtoBlob(result)], filename, { type: 'image/png' });

              const successResult = onSuccess && (await onSuccess(file));
              setLoading(false);
              if (successResult === false) {
                return;
              }
              onClose();
            } catch (e) {
              message.error(e.message);
              setLoading(false);
            }
          }}
        >
          {formatMessage({ id: 'signatureConfirmText' })}
        </Button>
      </Flex>
    </Flex>
  );
});

const Title = withLocale(() => {
  const { formatMessage } = useIntl();
  return <span>{formatMessage({ id: 'signatureDefaultTitle' })}</span>;
});

const useSignature = () => {
  const { modal } = App.useApp();
  return props => {
    const { filename = 'signature.png', onSuccess, width = 200, height = 80, mask, ...modalProps } = Object.assign({}, props);
    const modalApi = modal.info(
      Object.assign(
        {},
        {
          title: <Title />,
          icon: null,
          footer: null,
          closable: true,
          wrapClassName: style['signature-modal'],
          classNames: {
            content: style['signature-modal']
          }
        },
        modalProps,
        {
          content: (
            <Signature
              width={width}
              height={height}
              mask={mask}
              filename={filename}
              onSuccess={onSuccess}
              onClose={() => {
                modalApi.destroy();
              }}
            />
          )
        }
      )
    );

    return modalApi;
  };
};

export default useSignature;
