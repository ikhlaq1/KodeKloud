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
      <Path
        d="M7.05 1.536a5.243 5.243 0 017.414 7.414L12.415 11 11 9.586l2.05-2.05A3.243 3.243 0 008.464 2.95L6.414 5 5 3.586l2.05-2.05zM7.536 13.05L9.586 11 11 12.414l-2.05 2.05A5.243 5.243 0 011.536 7.05L3.586 5 5 6.414l-2.05 2.05a3.243 3.243 0 004.586 4.586z"
        fill="#000"
      />
      <Path d="M5.707 11.707l6-6-1.414-1.414-6 6 1.414 1.414z" fill="#000" />
    </Svg>
  );
}

export default SvgComponent;
