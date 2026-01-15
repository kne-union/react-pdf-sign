const computedPDFSignLocation = ({ size, location }) => {
  const scaleX = size.width / size.originalWidth;
  const scaleY = size.height / size.originalHeight;
  const pdfX = Math.round(location.size.x);
  const pdfY = Math.round(size.originalHeight - location.size.y);
  const signWidth = Math.round(location.size.width);
  const signHeight = Math.round(location.size.height);

  return {
    scaleX,
    scaleY,
    pageWidth: size.originalWidth,
    pageHeight: size.originalHeight,
    pdfX,
    pdfY,
    width: signWidth,
    height: signHeight,
    x: pdfX,
    y: pdfY - signHeight
  };
};

export default computedPDFSignLocation;
