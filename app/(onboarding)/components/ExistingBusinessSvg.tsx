import React from 'react';
import Svg, {
  Path,
  Rect,
  Circle,
  Text as SvgText,
  G,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

export default function ExistingBusinessSvg({ width = 100, height = 95 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 120 110" fill="none">
      <Defs>
        <LinearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#C86D46" />
          <Stop offset="1" stopColor="#A8522E" />
        </LinearGradient>
        <LinearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#F5EBE1" />
          <Stop offset="1" stopColor="#E6D7C8" />
        </LinearGradient>
        <LinearGradient id="woodGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#8C5C38" />
          <Stop offset="1" stopColor="#6E442B" />
        </LinearGradient>
      </Defs>

      {/* Ground & Shadow */}
      <Ellipse cx="60" cy="104" rx="52" ry="5" fill="#E8DED1" opacity="0.7" />

      {/* Shop Main Building Structure */}
      <Rect x="26" y="32" width="68" height="68" rx="4" fill="url(#wallGrad)" stroke="#B8A490" strokeWidth="1.5" />
      
      {/* Shop Interior Back Wall & Shelves */}
      <Rect x="34" y="42" width="52" height="52" rx="2" fill="#D9C7B6" />
      {/* Shelf lines */}
      <Path d="M34 56 H86" stroke="#B8A390" strokeWidth="2" />
      <Path d="M34 70 H86" stroke="#B8A390" strokeWidth="2" />

      {/* Shelved Goods Jars */}
      {/* Top Shelf Jars */}
      <Rect x="38" y="46" width="7" height="10" rx="1.5" fill="#E07A5F" />
      <Rect x="47" y="45" width="8" height="11" rx="1.5" fill="#F4A261" />
      <Rect x="57" y="47" width="6" height="9" rx="1.5" fill="#2A9D8F" />
      <Rect x="65" y="45" width="8" height="11" rx="1.5" fill="#81B29A" />
      <Rect x="75" y="46" width="7" height="10" rx="1.5" fill="#BD5D38" />

      {/* Middle Shelf Jars */}
      <Rect x="37" y="60" width="8" height="10" rx="1.5" fill="#81B29A" />
      <Rect x="47" y="59" width="9" height="11" rx="1.5" fill="#E07A5F" />
      <Rect x="58" y="60" width="8" height="10" rx="1.5" fill="#F4A261" />
      <Rect x="68" y="59" width="7" height="11" rx="1.5" fill="#2A9D8F" />
      <Rect x="77" y="60" width="6" height="10" rx="1.5" fill="#C86D46" />

      {/* Bottom Counter */}
      <Rect x="32" y="80" width="56" height="16" rx="2" fill="#B38B6D" stroke="#8C6647" strokeWidth="1" />

      {/* Shop Pillars */}
      <Rect x="25" y="30" width="7" height="72" fill="url(#woodGrad)" rx="1.5" />
      <Rect x="88" y="30" width="7" height="72" fill="url(#woodGrad)" rx="1.5" />

      {/* Terracotta Roof / Awning */}
      <Path
        d="M16 32 C16 18, 104 18, 104 32 L98 34 H22 Z"
        fill="url(#roofGrad)"
        stroke="#8C3A1A"
        strokeWidth="1.5"
      />
      {/* Roof tile lines */}
      <Path d="M22 34 Q60 14 98 34" stroke="#D98A6C" strokeWidth="2" fill="none" />
      <Path d="M26 34 L32 20 M42 34 L46 18 M58 34 L60 18 M74 34 L74 18 M88 34 L84 20" stroke="#8C3A1A" strokeWidth="1.2" opacity="0.6" />

      {/* Overhanging Awning Scallops */}
      <Path d="M18 34 Q24 39 30 34 Q36 39 42 34 Q48 39 54 34 Q60 39 66 34 Q72 39 78 34 Q84 39 90 34 Q96 39 102 34" fill="#BD5D38" stroke="#8C3A1A" strokeWidth="1" />

      {/* Left Standing Blackboard Sign "माझा व्यवसाय" */}
      <G id="chalkboard">
        {/* Legs */}
        <Path d="M4 104 L10 68 M22 104 L18 68" stroke="#6E442B" strokeWidth="2.5" strokeLinecap="round" />
        {/* Frame */}
        <Rect x="6" y="68" width="20" height="26" rx="2" fill="#E8DED1" stroke="#6E442B" strokeWidth="1.5" />
        {/* Inner Black Board */}
        <Rect x="8" y="70" width="16" height="22" rx="1" fill="#3D3A38" />
        {/* Chalk Marathi Text */}
        <SvgText x="16" y="79" fill="#FFFFFF" fontSize="5" fontWeight="bold" textAnchor="middle">
          माझा
        </SvgText>
        <SvgText x="16" y="87" fill="#FFFFFF" fontSize="4.5" fontWeight="bold" textAnchor="middle">
          व्यवसाय
        </SvgText>
      </G>

      {/* Potted Plants around shop */}
      {/* Left Plant */}
      <Path d="M2 104 C-2 88 10 82 12 76 C14 84 22 92 18 104 Z" fill="#588157" />
      <Path d="M5 104 C4 90 14 85 10 78" stroke="#3A5A40" strokeWidth="1" fill="none" />
      
      {/* Right Plant */}
      <Path d="M96 104 C92 90 102 82 106 74 C110 84 116 94 114 104 Z" fill="#588157" />
      <Path d="M102 104 C100 92 108 86 104 78" stroke="#3A5A40" strokeWidth="1" fill="none" />
      <Path d="M108 104 C112 94 118 90 115 82" stroke="#3A5A40" strokeWidth="1" fill="none" />
    </Svg>
  );
}

// Ellipse helper
function Ellipse({ cx, cy, rx, ry, fill, opacity }: any) {
  return (
    <Path
      d={`M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`}
      fill={fill}
      opacity={opacity}
    />
  );
}
