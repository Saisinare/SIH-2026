import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

// ── Props ───────────────────────────────────────────────
interface VoiceSphereProps {
  size?: number;
}

// The exact HTML/JS sphere, configured with transparent background
const SPHERE_HTML = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
<style>
  * { margin:0; padding:0; }
  html, body { width:100%; height:100%; background: transparent !important; overflow:hidden; }
  canvas { display:block; width:100%; height:100%; background: transparent !important; }
</style>
</head>
<body>
<canvas id="c"></canvas>
<script>
(function(){
  var canvas = document.getElementById('c');
  var ctx = canvas.getContext('2d');

  function resize(){
    var s = Math.min(window.innerWidth, window.innerHeight);
    canvas.width = s * 2;
    canvas.height = s * 2;
    canvas.style.width = s + 'px';
    canvas.style.height = s + 'px';
  }
  resize();
  window.addEventListener('resize', resize);

  var N = 2800;
  var points = [];

  function randSpherePoint(){
    var u = Math.random()*2-1;
    var theta = Math.random()*Math.PI*2;
    var r = Math.sqrt(1-u*u);
    return { x: r*Math.cos(theta), y: r*Math.sin(theta), z: u };
  }
  for (var i=0;i<N;i++){
    var p = randSpherePoint();
    points.push({
      x: p.x, y: p.y, z: p.z,
      phaseR: Math.random()*Math.PI*2,
      phaseT: Math.random()*Math.PI*2,
      speedR: 0.5 + Math.random()*1.8,
      speedT: 0.4 + Math.random()*1.5,
      ampR: 16 + Math.random()*34,
      ampT: 10 + Math.random()*24
    });
  }

  var proj0 = [];
  for (var i=0;i<points.length;i++){
    var p = points[i];
    var scale = 1/(2 - p.z*0.9);
    var len = Math.sqrt(p.x*p.x + p.y*p.y) || 0.0001;
    proj0.push({
      nx: p.x*scale, ny: p.y*scale,
      tx: -p.y/len, ty: p.x/len,
      z: p.z, orig: p
    });
  }
  proj0.sort(function(a,b){ return a.z - b.z; });

  function colorFor(p){
    var t = (p.y + 1) / 2;
    if (t < 0) t = 0;
    if (t > 1) t = 1;
    
    // Color 1: #CB7D5C (rgb 203, 125, 92)
    // Color 2: #817C6E (rgb 129, 124, 110)
    var r = Math.round(203 * (1 - t) + 129 * t);
    var g = Math.round(125 * (1 - t) + 124 * t);
    var b = Math.round(92 * (1 - t) + 110 * t);

    var edge = 1 - Math.abs(p.z);
    var alpha = 0.45 + edge * 0.5;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha.toFixed(2) + ')';
  }

  var level = 0;
  var targetLevel = 0;

  window.addEventListener('message', function(e){
    try {
      var data = JSON.parse(e.data);
      if (data.type === 'audioLevel') {
        targetLevel = data.value;
      }
    } catch(ex){}
  });
  document.addEventListener('message', function(e){
    try {
      var data = JSON.parse(e.data);
      if (data.type === 'audioLevel') {
        targetLevel = data.value;
      }
    } catch(ex){}
  });

  var t0 = Date.now();
  function frame(){
    var W = canvas.width, H = canvas.height;
    var cx = W/2, cy = H/2;
    var baseR = Math.min(W, H) * 0.42;

    ctx.clearRect(0, 0, W, H);

    level += (targetLevel - level) * 0.15;
    var energy = 0.35 + level*1.3;

    var elapsed = (Date.now() - t0) / 1000;

    for (var i=0;i<proj0.length;i++){
      var pr = proj0[i];
      var p = pr.orig;
      var rOffset = Math.sin(elapsed*p.speedR + p.phaseR) * p.ampR * energy;
      var tOffset = Math.sin(elapsed*p.speedT + p.phaseT) * p.ampT * energy;

      var sx = cx + pr.nx*baseR + pr.nx*rOffset + pr.tx*tOffset;
      var sy = cy + pr.ny*baseR + pr.ny*rOffset + pr.ty*tOffset;

      var size = (0.8 + (p.z+1)*1.0) * (0.8 + energy*0.5);
      if (size < 0.3) size = 0.3;
      size *= 2.2;

      ctx.fillStyle = colorFor(p);
      ctx.beginPath();
      ctx.arc(sx, sy, size, 0, Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
</script>
</body>
</html>
`;

export default function VoiceSphere({ size = 360 }: VoiceSphereProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <WebView
        source={{ html: SPHERE_HTML }}
        style={styles.webview}
        containerStyle={styles.transparentBg}
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        javaScriptEnabled={true}
        originWhitelist={['*']}
        androidLayerType="hardware"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'visible',
    backgroundColor: 'transparent',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  transparentBg: {
    backgroundColor: 'transparent',
  },
});

