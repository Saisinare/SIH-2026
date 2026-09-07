import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import { Audio } from 'expo-av';
import { useSharedValue, withTiming, useFrameCallback } from 'react-native-reanimated';

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
    r = 90 + (1 - t) * 40;
    g = 140 + (1 - t) * 60;
    b = 220;
  } else if (t > 0.6) {
    r = 230;
    g = 190 + (t - 0.6) * 40;
    b = 40;
  } else {
    r = 150;
    g = 165;
    b = 140;
  }
  const alpha = 0.3 + edge * 0.6;
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

  // Sort by z for depth-ordered 3D rendering
  proj.sort((a, b) => a.z - b.z);
  return proj;
}

export default function VoiceOrb() {
  const projPoints = useRef(makeSphereProj()).current;
  const audioLevel = useSharedValue(0.25);
  const smoothedLevel = useSharedValue(0.25);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let recording: Audio.Recording | null = null;
    let isMounted = true;

    (async () => {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') return;

        await Audio.setAudioModeAsync({ allowsRecordingIOS: true });
        recording = new Audio.Recording();
        await recording.prepareToRecordAsync({
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
          isMeteringEnabled: true,
        });
        recording.setOnRecordingStatusUpdate((status) => {
          if (status.metering != null) {
            const normalized = Math.max(0, Math.min(1, (status.metering + 60) / 60));
            audioLevel.value = withTiming(normalized, { duration: 100 });
          }
        });
        if (isMounted) {
          await recording.startAsync();
        }
      } catch (err) {
        // Fallback mic handler
      }
    })();

    return () => {
      isMounted = false;
      if (recording) {
        recording.stopAndUnloadAsync().catch(() => {});
      }
    };
  }, []);

  useFrameCallback(() => {
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
