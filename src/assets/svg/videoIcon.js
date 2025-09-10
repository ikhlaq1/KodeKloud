import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
  const { height, width } = props;
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path d="M10 3H0v10h10V3zM15 3l-3 3v4l3 3h1V3h-1z" fill="#000" />
    </Svg>
  );
}

export default SvgComponent;
