import React from 'react';
import Svg, {
  Path,
  Rect,
  Circle,
  G,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

export default function NewBusinessSvg({ width = 100, height = 95 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 120 110" fill="none">
      <Defs>
        <LinearGradient id="woodPost" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#9C6644" />
          <Stop offset="1" stopColor="#7F5539" />
        </LinearGradient>
        <LinearGradient id="signGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#E6CCB2" />
          <Stop offset="1" stopColor="#DDB892" />
        </LinearGradient>
        <LinearGradient id="manSkin" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#A8765A" />
          <Stop offset="1" stopColor="#8C5C43" />
        </LinearGradient>
      </Defs>

      {/* Ground Shadow */}
      <Ellipse cx="60" cy="104" rx="50" ry="5" fill="#E8DED1" opacity="0.7" />

      {/* Main Vertical Wooden Pole */}
      <Rect x="58" y="24" width="8" height="80" rx="2" fill="url(#woodPost)" stroke="#582F0E" strokeWidth="1" />

      {/* Directional Sign 1 (Top Sign - Right Arrow with Lightbulb) */}
      <G id="sign1">
        <Path d="M52 26 L94 26 L104 35 L94 44 L52 44 Z" fill="url(#signGrad)" stroke="#7F5539" strokeWidth="1.2" />
        {/* Lightbulb Icon */}
        <Circle cx="76" cy="35" r="5" fill="#F4A261" stroke="#D97706" strokeWidth="1" />
        <Path d="M74 41 H78" stroke="#D97706" strokeWidth="1.5" />
        <Path d="M76 28 V26 M82 30 L84 28 M70 30 L68 28" stroke="#F4A261" strokeWidth="1" strokeLinecap="round" />
      </G>

      {/* Directional Sign 2 (Middle Sign - Left Arrow with Leaf) */}
      <G id="sign2">
        <Path d="M72 48 L30 48 L20 57 L30 66 L72 66 Z" fill="url(#signGrad)" stroke="#7F5539" strokeWidth="1.2" />
        {/* Leaf Icon */}
        <Path d="M46 51 C40 51 38 57 38 63 C44 63 50 61 50 55 Z" fill="#588157" />
        <Path d="M40 61 L48 53" stroke="#A3B18A" strokeWidth="1" />
      </G>

      {/* Directional Sign 3 (Bottom Sign - Right Arrow with Gear) */}
      <G id="sign3">
        <Path d="M52 70 L92 70 L102 79 L92 88 L52 88 Z" fill="url(#signGrad)" stroke="#7F5539" strokeWidth="1.2" />
        {/* Gear Icon */}
        <Circle cx="75" cy="79" r="4.5" fill="#524846" />
        <Circle cx="75" cy="79" r="2" fill="#E6CCB2" />
        <Path d="M75 72 V86 M68 79 H82 M70 74 L80 84 M70 84 L80 74" stroke="#524846" strokeWidth="1.5" />
      </G>

      {/* Man Standing on Left */}
      <G id="man">
        {/* Legs / Trousers */}
        <Path d="M22 84 L20 104 H26 L27 84 Z" fill="#4E443F" />
        <Path d="M28 84 L30 104 H35 L33 84 Z" fill="#3D3430" />

        {/* Torso / Shirt */}
        <Path d="M14 62 C14 56 38 56 38 62 L35 84 H17 Z" fill="#FAF9F6" stroke="#D3CDC6" strokeWidth="1" />

        {/* Terracotta Cloth / Gamcha over Shoulder */}
        <Path d="M15 62 C18 64 24 72 23 88 C20 88 16 80 14 66 Z" fill="#BD5D38" />

        {/* Arm thinking (hand on chin) */}
        <Path d="M34 64 L39 74 L30 68" stroke="url(#manSkin)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

        {/* Head & Neck */}
        <Rect x="23" y="52" width="6" height="7" fill="url(#manSkin)" />
        <Circle cx="26" cy="46" r="8" fill="url(#manSkin)" />
        
        {/* Hair */}
        <Path d="M18 45 C18 38 34 38 34 45 C32 40 22 40 18 45 Z" fill="#2B231F" />
      </G>

      {/* Plants at Base */}
      <Path d="M48 104 C44 94 54 88 56 82 C60 92 64 98 62 104 Z" fill="#588157" />
      <Path d="M52 104 C50 96 56 90 54 84" stroke="#3A5A40" strokeWidth="1" fill="none" />
      
      <Path d="M66 104 C64 92 74 86 76 80 C80 90 84 96 82 104 Z" fill="#3A5A40" />
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
