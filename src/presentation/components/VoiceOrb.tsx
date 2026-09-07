import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import { useSharedValue, useFrameCallback } from 'react-native-reanimated';

const N = 1200;
const BASE_R = 95;
const CX = 140, CY = 140;

interface Point {
  x: number;
  y: number;
  z: number;
  phaseR: number;
  phaseT: number;
  speedR: number;
  speedT: number;
  ampR: number;
  ampT: number;
}

interface ProjPoint {
  nx: number;
  ny: number;
  tx: number;
  ty: number;
  z: number;
  orig: Point;
  color: string;
}

function colorFor(p: Point): string {
  const t = (p.y + 1) / 2;
  const edge = 1 - Math.abs(p.z);
  let r: number, g: number, b: number;
  if (t < 0.45) {
    r = 203;
    g = 125;
    b = 92;
  } else if (t > 0.6) {
    r = 230;
    g = 140;
    b = 80;
  } else {
    r = 180;
    g = 120;
    b = 90;
  }
  const alpha = 0.35 + edge * 0.55;
  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${alpha.toFixed(2)})`;
}

function makeSphereProj(): ProjPoint[] {
  const points: Point[] = [];
  for (let i = 0; i < N; i++) {
    const u = Math.random() * 2 - 1;
    const theta = Math.random() * Math.PI * 2;
    const r = Math.sqrt(1 - u * u);
    points.push({
      x: r * Math.cos(theta),
      y: r * Math.sin(theta),
      z: u,
      phaseR: Math.random() * Math.PI * 2,
      phaseT: Math.random() * Math.PI * 2,
      speedR: 0.5 + Math.random() * 1.8,
      speedT: 0.4 + Math.random() * 1.5,
      ampR: 14 + Math.random() * 30,
      ampT: 8 + Math.random() * 20,
    });
  }

  const proj: ProjPoint[] = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const scale = 1 / (2 - p.z * 0.9);
    const len = Math.sqrt(p.x * p.x + p.y * p.y) || 0.0001;
    proj.push({
      nx: p.x * scale,
      ny: p.y * scale,
      tx: -p.y / len,
      ty: p.x / len,
      z: p.z,
      orig: p,
      color: colorFor(p),
    });
  }

  proj.sort((a, b) => a.z - b.z);
  return proj;
}

export default function VoiceOrb() {
  const projPoints = React.useRef(makeSphereProj()).current;
  const audioLevel = useSharedValue(0.35);
  const smoothedLevel = useSharedValue(0.35);
  const [tick, setTick] = useState(0);

  useFrameCallback(() => {
    // Smooth organic pulse metering without deprecated expo-av
    const pulse = 0.35 + Math.sin(tick * 0.04) * 0.15;
    audioLevel.value = pulse;
    smoothedLevel.value = smoothedLevel.value + (audioLevel.value - smoothedLevel.value) * 0.15;
    setTick((t) => t + 1);
  });

  const elapsed = tick / 60;
  const energy = 0.35 + smoothedLevel.value * 1.3;

  return (
    <View style={styles.container}>
      <Svg width={280} height={280} viewBox="0 0 280 280">
        <G>
          {projPoints.map((pr, i) => {
            const p = pr.orig;
            const rOffset = Math.sin(elapsed * p.speedR + p.phaseR) * p.ampR * energy;
            const tOffset = Math.sin(elapsed * p.speedT + p.phaseT) * p.ampT * energy;

            const sx = CX + pr.nx * BASE_R + pr.nx * rOffset + pr.tx * tOffset;
            const sy = CY + pr.ny * BASE_R + pr.ny * rOffset + pr.ty * tOffset;

            let size = (0.7 + (p.z + 1) * 0.9) * (0.7 + energy * 0.5);
            if (size < 0.3) size = 0.3;

            return (
              <Circle
                key={i}
                cx={sx}
                cy={sy}
                r={size}
                fill={pr.color}
              />
            );
          })}
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
