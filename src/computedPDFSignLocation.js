const computedPDFSignLocation = ({ size, location }) => {
  const scaleX = size.width / size.originalWidth;
  const scaleY = size.height / size.originalHeight;
  const pdfX = Math.round(location.size.x / scaleX);
  const pdfY = Math.round(size.originalHeight - location.size.y / scaleY);
  const signWidth = Math.round(location.size.width / scaleX);
  const signHeight = Math.round(location.size.height / scaleY);

  return {
    scaleX,
    scaleY,
    pdfX,
    pdfY,
    width: signWidth,
    height: signHeight,
    x: pdfX,
    y: pdfY - signHeight
  };
};

export default computedPDFSignLocation;
