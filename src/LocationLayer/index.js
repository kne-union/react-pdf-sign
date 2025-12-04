import { Stage, Layer, Text, Transformer, Rect, Group, Image } from 'react-konva';
import { useRef, useEffect, useMemo, useState } from 'react';
import useControlValue from '@kne/use-control-value';
import useRefCallback from '@kne/use-ref-callback';
import useImage from 'use-image';
import withLocale from '../withLocale';
import { useIntl } from '@kne/react-intl';

const LocationLayer = withLocale(p => {
  const { formatMessage } = useIntl();
  const { width = 200, height = 50, padding = 8, stageWidth, stageHeight, placeholder = formatMessage({ id: 'locationLayerPlaceholder' }), signature, ...props } = p;
  const [value, setValue] = useControlValue(props);
  const [isInit, setIsInit] = useState(false);
  const [signatureImage] = useImage(signature);
  const groupRef = useRef();
  const signRef = useRef();
  const transformerRef = useRef();
  const computedSignLocation = () => {
    const absolutePosition = signRef.current.absolutePosition();
    const size = signRef.current.getClientRect();
    setValue({
      size: {
        width: Math.round(size.width),
        height: Math.round(size.height),
        x: Math.round(absolutePosition.x),
        y: Math.round(absolutePosition.y)
      },
      scaleX: Number(transformerRef.current.attrs.scaleX.toFixed(2)),
      scaleY: Number(transformerRef.current.attrs.scaleY.toFixed(2)),
      x: Math.round(groupRef.current.attrs.x),
      y: Math.round(groupRef.current.attrs.y)
    });
  };

  const initValue = useRefCallback(() => {
    if (['scaleX', 'scaleY', 'x', 'y', 'size'].some(name => !Object.assign({}, value).hasOwnProperty(name))) {
      setValue({
        scaleX: 1,
        scaleY: 1,
        x: Math.round((stageWidth - width) / 2),
        y: Math.round((stageHeight - height) / 2),
        size: {
          width,
          height,
          x: Math.round((stageWidth - width) / 2),
          y: Math.round((stageHeight - height) / 2)
        }
      });
      setIsInit(true);
    }
  });

  const themeColor = useMemo(() => {
    const el = document.createElement('div');
    el.style.color = 'var(--primary-color)';
    document.body.appendChild(el);
    const color = window.getComputedStyle(el).color;
    document.body.removeChild(el);
    return color;
  }, []);

  useEffect(() => {
    initValue();
  }, []);

  useEffect(() => {
    if (isInit) {
      transformerRef.current.nodes([groupRef.current]);
    }
  }, [isInit]);
  if (!(isInit && value)) {
    return null;
  }

  return (
    <Stage width={stageWidth} height={stageHeight}>
      <Layer>
        <Group x={value.x} y={value.y} draggable ref={groupRef} onDragEnd={computedSignLocation} onTransformEnd={computedSignLocation}>
          {signatureImage ? <Image width={width} height={height} image={signatureImage} cornerRadius={8} ref={signRef} /> : <Rect width={width} height={height} fill="#f0f0f0" cornerRadius={8} ref={signRef} />}
          <Text text={signatureImage ? '' : placeholder} fontSize={16} fill="#666666" fontFamily="Arial" align="center" verticalAlign="middle" width={width} height={height} />
        </Group>
        <Transformer
          scaleX={value.scaleX}
          scaleY={value.scaleY}
          centeredScaling
          ref={transformerRef}
          keepRatio={true}
          flipEnabled={false}
          rotateEnabled={false}
          borderStroke={themeColor}
          rotateAnchorStroke={themeColor}
          anchorStroke={themeColor}
          padding={padding}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
        />
      </Layer>
    </Stage>
  );
});

export default LocationLayer;
