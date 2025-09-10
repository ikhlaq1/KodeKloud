import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: style */

function SvgComponent(props) {
  const { height, width } = props;
  return (
    <Svg
      id="_x32_"
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      xmlSpace="preserve"
      {...props}>
      <Path className="st0" d="M106.667 106.667H405.33299999999997V213.333H106.667z" />
      <Path className="st0" d="M0 0v512h512V0H0zm458.667 458.667H53.333V53.333h405.334v405.334z" />
      <Path className="st0" d="M256 277.333H405.33299999999997V309.333H256z" />
      <Path className="st0" d="M256 362.667H405.33299999999997V394.667H256z" />
      <Path className="st0" d="M106.667 277.333H213.333V394.66700000000003H106.667z" />
    </Svg>
  );
}

export default SvgComponent;
