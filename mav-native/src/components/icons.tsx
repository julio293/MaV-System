import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

type IconProps = { size?: number; color?: string; strokeWidth?: number };

const base = (size = 20, strokeWidth = 2) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export const CheckIcon = ({ size = 20, color = '#fff', strokeWidth = 2.4 }: IconProps) => (
  <Svg {...base(size, strokeWidth)} stroke={color}>
    <Path d="M20 6L9 17l-5-5" />
  </Svg>
);

export const CloseIcon = ({ size = 20, color = '#171717', strokeWidth = 1.8 }: IconProps) => (
  <Svg {...base(size, strokeWidth)} stroke={color}>
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

export const InfoIcon = ({ size = 20, color = '#352eff', strokeWidth = 1.8 }: IconProps) => (
  <Svg {...base(size, strokeWidth)} stroke={color}>
    <Circle cx={12} cy={12} r={9} />
    <Path d="M12 11v5M12 8h.01" />
  </Svg>
);

export const AlertIcon = ({ size = 20, color = '#ff0000', strokeWidth = 1.8 }: IconProps) => (
  <Svg {...base(size, strokeWidth)} stroke={color}>
    <Circle cx={12} cy={12} r={9} />
    <Path d="M12 7.5v5.5M12 16.5h.01" />
  </Svg>
);
