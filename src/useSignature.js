import SignatureCanvas from 'react-signature-canvas';
import { App, Button, Flex } from 'antd';
import classnames from 'classnames';
import { useRef } from 'react';
import withLocale from './withLocale';
import { useIntl } from '@kne/react-intl';
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

const Signature = withLocale(({ onClose, onSuccess, filename, width, height }) => {
  const { formatMessage } = useIntl();
  const { message } = App.useApp();
  const signatureCanvasRef = useRef(null);
  return (
    <Flex vertical gap={12} className={classnames(style['signature-modal-content'], 'signature-modal-content')}>
      <div
        className={classnames(style['signature-container'], 'signature-container')}
        style={{
          width: '368px',
          height: `${Math.round((height * 368) / width)}px`
        }}
      >
        <SignatureCanvas ref={signatureCanvasRef} canvasProps={{ className: classnames(style['signature-canvas'], 'signature-canvas') }} />
      </div>
      <Flex justify="flex-end" align="center" gap={10}>
        <Button
          onClick={() => {
            onClose();
          }}
        >
          {formatMessage({ id: 'signatureCancelText' })}
        </Button>
        <Button
          type="primary"
          onClick={() => {
            if (signatureCanvasRef.current.isEmpty()) {
              message.error(formatMessage({ id: 'signatureEmptyError' }));
              return;
            }
            const file = new window.File([dataURLtoBlob(signatureCanvasRef.current.toDataURL('image/png'))], filename, { type: 'image/png' });
            onClose();
            onSuccess(file);
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

const useSignature = props => {
  const { width, height } = Object.assign(
    {},
    {
      width: 200,
      height: 50
    },
    props
  );
  const { modal, message } = App.useApp();
  const signatureCanvasRef = useRef(null);
  return props => {
    const { filename = 'signature.png', onSuccess, ...modalProps } = Object.assign({}, props);
    const modalApi = modal.info(
      Object.assign(
        {},
        {
          title: <Title />,
          icon: null,
          footer: null,
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
