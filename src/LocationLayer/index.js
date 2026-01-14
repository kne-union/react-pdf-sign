import { Stage, Layer, Text, Transformer, Rect, Group, Image, Circle, Line } from 'react-konva';
import { useRef, useEffect, useMemo, useState } from 'react';
import useControlValue from '@kne/use-control-value';
import useRefCallback from '@kne/use-ref-callback';
import useImage from 'use-image';
import withLocale from '../withLocale';
import { useIntl } from '@kne/react-intl';
import getInitLocation from '../getInitLocation';

const LocationLayerInner = withLocale(p => {
  const { formatMessage } = useIntl();
  const { width = 200, height = 80, padding = 8, stageWidth, stageHeight, placeholder = formatMessage({ id: 'locationLayerPlaceholder' }), signature, active, onClose, onClick, ...props } = p;
  const [value, setValue] = useControlValue(props);
  const [isInit, setIsInit] = useState(false);
  const [signatureImage] = useImage(signature);
  const groupRef = useRef();
  const signRef = useRef();
  const transformerRef = useRef();
  const computedSignLocation = () => {
    const absolutePosition = signRef.current.absolutePosition();
    const size = signRef.current.getClientRect();
    setValue(value =>
      Object.assign({}, value, {
        size: {
          width: Math.round(size.width),
          height: Math.round(size.height),
          x: Math.round(absolutePosition.x),
          y: Math.round(absolutePosition.y)
        },
        scaleX: Number(groupRef.current.attrs.scaleX.toFixed(2)),
        scaleY: Number(groupRef.current.attrs.scaleY.toFixed(2)),
        x: Math.round(groupRef.current.attrs.x),
        y: Math.round(groupRef.current.attrs.y)
      })
    );
  };

  const initValue = useRefCallback(() => {
    if (['scaleX', 'scaleY', 'x', 'y', 'size'].some(name => !Object.assign({}, value).hasOwnProperty(name))) {
      setValue(value => Object.assign({}, value, getInitLocation({ stageWidth, stageHeight, width, height })));
    }
    setIsInit(true);
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
    <Layer>
      <Group
        x={value.x}
        y={value.y}
        draggable={active !== false}
        ref={groupRef}
        onDragMove={computedSignLocation}
        onDragEnd={computedSignLocation}
        scaleX={value.scaleX}
        scaleY={value.scaleY}
        onTransform={computedSignLocation}
        onTransformEnd={computedSignLocation}
        onTap={onClick}
        onClick={onClick}
      >
        {signatureImage ? <Image width={width} height={height} image={signatureImage} cornerRadius={8} ref={signRef} /> : <Rect width={width} height={height} fill="#f0f0f0" cornerRadius={8} ref={signRef} />}
      </Group>
      <Text
        listening={false}
        x={value.x}
        y={value.y}
        text={signatureImage ? '' : placeholder}
        fontSize={16}
        fill="#666666"
        fontFamily="Arial"
        align="center"
        verticalAlign="middle"
        width={width * value.scaleX}
        height={height * value.scaleY}
      />
      <Transformer ref={transformerRef} visible={active !== false} keepRatio={true} flipEnabled={false} rotateEnabled={false} borderStroke={themeColor} rotateAnchorStroke={themeColor} anchorStroke={themeColor} padding={padding} />
      {active === true && (
        <Group
          x={value.x + width * value.scaleX - 4}
          y={value.y + 4}
          onClick={() => {
            onClose && onClose();
          }}
        >
          <Circle radius={6} stroke={themeColor} strokeWidth={1} fill="white" />
          <Line points={[-2, -2, 2, 2]} stroke={themeColor} strokeWidth={1} lineCap="round" />
          <Line points={[-2, 2, 2, -2]} stroke={themeColor} strokeWidth={1} lineCap="round" />
        </Group>
      )}
    </Layer>
  );
});

const LocationLayer = ({ stageWidth, stageHeight, ...props }) => {
  return (
    <Stage width={stageWidth} height={stageHeight}>
      <LocationLayerInner {...props} stageWidth={stageWidth} stageHeight={stageHeight} />
    </Stage>
  );
};

export const LocationGroup = ({ stageWidth, stageHeight, isEdit = true, onClick, currentPage, ...props }) => {
  const [value, onChange] = useControlValue(
    Object.assign(
      {},
      {
        defaultValue: []
      },
      props
    )
  );

  const [active, setActive] = useState(0);

  return (
    <Stage width={stageWidth} height={stageHeight}>
      {value.map((item, index) => {
        if (item.page && item.page !== currentPage) {
          return null;
        }
        return (
          <LocationLayerInner
            {...props}
            key={index}
            stageWidth={stageWidth}
            stageHeight={stageHeight}
            value={item}
            signature={item.signature}
            active={isEdit && active === index}
            onClick={() => {
              if (isEdit) {
                if (active !== index) {
                  setActive(index);
                }
              } else {
                onClick && onClick({ value: value[index], index, allValue: value });
              }
            }}
            onClose={() => {
              onChange(value => {
                const newValue = value.slice(0);
                newValue.splice(index, 1);
                return newValue;
              });
            }}
            onChange={item => {
              onChange(value => {
                const newValue = value.slice(0);
                newValue[index] = item;
                return newValue;
              });
            }}
          />
        );
      })}
    </Stage>
  );
};

export default LocationLayer;
