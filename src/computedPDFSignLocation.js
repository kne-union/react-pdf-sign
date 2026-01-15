const computedPDFSignLocation = ({ size, location }) => {
  const scaleX = 1;
  const scaleY = 1;
  const pdfX = Math.round(location.size.x / scaleX);
  const pdfY = Math.round(size.originalHeight - location.size.y / scaleY);
  const signWidth = Math.round(location.size.width / scaleX);
  const signHeight = Math.round(location.size.height / scaleY);

  return {
    pdfX,
    pdfY,
    width: signWidth,
    height: signHeight,
    x: pdfX,
    y: pdfY - signHeight
  };
};

export default computedPDFSignLocation;
