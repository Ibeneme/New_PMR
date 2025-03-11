import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface IoTHistoryIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const IoTHistoryIcon: React.FC<IoTHistoryIconProps> = ({ width = 24, height = 24, color = '#1C274C' }) => {
  return (
    <Svg
      viewBox="0 0 24 24"
      fill="none"
      width={width}
      height={height}
    >
      <Path
        d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M12 9V13H16"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="0.5 3.5"
      />
    </Svg>
  );
};

export default IoTHistoryIcon;