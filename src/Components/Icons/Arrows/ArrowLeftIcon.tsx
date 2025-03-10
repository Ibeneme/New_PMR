import React from 'react';
import Svg, {Line, Polyline} from 'react-native-svg';

const ArrowLeftIcon = ({
  width = 24,
  height = 24,
  color = '#000',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 32 32" fill="none">
      <Line
        x1="6"
        y1="16"
        x2="28"
        y2="16"
        stroke={color}
        strokeWidth="2"
        strokeMiterlimit="10"
      />
      <Polyline
        points="11.515,22 5.515,16 11.515,10"
        stroke={color}
        strokeWidth="2"
        strokeMiterlimit="10"
      />
    </Svg>
  );
};

export default ArrowLeftIcon;
