const getInitLocation = ({ stageWidth, stageHeight, width, height }) => {
  return {
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
  };
};

export default getInitLocation;
