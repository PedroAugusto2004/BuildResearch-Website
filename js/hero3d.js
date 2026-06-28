/* =============================================================================
   BuildResearch — interior hero 3D models (Three.js)
   data-model on the canvas selects the scene:
     helix    → Services  (DNA double helix — rigorous research/method)
     gallery  → Portfolio (rotating carousel of project tiles)
     rings    → About     (interlocking rings — the collective / collaboration)
   Cohesive with the Think Tank globe: glowing line-art on white, slow auto-spin,
   drag-to-rotate, reduced-motion aware, graceful fallback.
   ============================================================================= */
(function () {
  "use strict";
  var canvas = document.querySelector("canvas[data-model]");
  if (!canvas) return;
  var stage = canvas.parentElement;
  var model = canvas.getAttribute("data-model");
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function fallback() { stage.classList.add("globe-fallback"); }

  import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js")
    .then(function (THREE) { try { build(THREE); } catch (e) { fallback(); } })
    .catch(fallback);

  /* shared helpers ---------------------------------------------------------- */
  function glowSprite(THREE) {
    var c = document.createElement("canvas"); c.width = c.height = 64;
    var x = c.getContext("2d"); var g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.45, "rgba(255,255,255,0.6)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = g; x.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }
  function points(THREE, arr, size, color, sprite) {
    var g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
    return new THREE.Points(g, new THREE.PointsMaterial({
      size: size, map: sprite, color: color, transparent: true, depthWrite: false, sizeAttenuation: true
    }));
  }
  function segs(THREE, arr, color, opacity) {
    var g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
    return new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: opacity, depthWrite: false }));
  }
  function line(THREE, vecs, color, opacity) {
    var g = new THREE.BufferGeometry().setFromPoints(vecs);
    return new THREE.Line(g, new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: opacity, depthWrite: false }));
  }

  /* ---------- Services: DNA double helix ---------- */
  function buildHelix(THREE, group, sprite) {
    var turns = 2.6, steps = 150, R = 0.6, H = 2.5;
    var aVecs = [], bVecs = [], rungs = [], aNodes = [], bNodes = [], goldNodes = [];
    for (var i = 0; i < steps; i++) {
      var f = i / (steps - 1);
      var y = -H / 2 + f * H;
      var ang = f * turns * Math.PI * 2;
      var a = new THREE.Vector3(Math.cos(ang) * R, y, Math.sin(ang) * R);
      var b = new THREE.Vector3(Math.cos(ang + Math.PI) * R, y, Math.sin(ang + Math.PI) * R);
      aVecs.push(a); bVecs.push(b);
      if (i % 9 === 0) {
        rungs.push(a.x, a.y, a.z, b.x, b.y, b.z);
        (i % 27 === 0 ? goldNodes : aNodes).push(a.x, a.y, a.z);
        bNodes.push(b.x, b.y, b.z);
      }
    }
    group.add(line(THREE, aVecs, 0x2563eb, 0.85));
    group.add(line(THREE, bVecs, 0x6f97d8, 0.8));
    group.add(segs(THREE, rungs, 0x9bb6e2, 0.45));
    group.add(points(THREE, aNodes, 0.085, 0x2563eb, sprite));
    group.add(points(THREE, bNodes, 0.085, 0x5f8fd6, sprite));
    if (goldNodes.length) group.add(points(THREE, goldNodes, 0.11, 0xC8924A, sprite));
    return { fit: 1.45, spin: 0.0018, update: null };
  }

  /* ---------- Portfolio: a single stylised portfolio piece (live face) ---------- */
  function buildFolio(THREE, group) {
    var W = 1.5, H = 1.95, D = 0.055;

    // live card face — drawn each frame so the globe spins & the bars rise,
    // while the card model itself stays put.
    var fc = document.createElement("canvas"); fc.width = 320; fc.height = 416;
    var fx = fc.getContext("2d");

    function drawGlobe(cx, cy, R, phase) {
      fx.lineWidth = 1.4; fx.strokeStyle = "rgba(245,243,238,0.55)";
      fx.beginPath(); fx.arc(cx, cy, R, 0, Math.PI * 2); fx.stroke();
      fx.strokeStyle = "rgba(245,243,238,0.3)";
      for (var p = -2; p <= 2; p++) {
        if (p === 0) continue;
        var py = cy + (p / 2.6) * R, rw = Math.sqrt(Math.max(0, R * R - (py - cy) * (py - cy)));
        fx.beginPath(); fx.moveTo(cx - rw, py); fx.lineTo(cx + rw, py); fx.stroke();
      }
      fx.strokeStyle = "rgba(245,243,238,0.45)";
      fx.beginPath(); fx.moveTo(cx - R, cy); fx.lineTo(cx + R, cy); fx.stroke();
      for (var m = 0; m < 5; m++) {                 // meridians sweep => rotation
        var a = phase + m * Math.PI / 5, rx = Math.abs(R * Math.cos(a));
        var op = 0.16 + 0.4 * Math.abs(Math.cos(a));
        fx.strokeStyle = "rgba(245,243,238," + op.toFixed(2) + ")"; fx.lineWidth = 1.2;
        fx.beginPath(); fx.ellipse(cx, cy, rx, R, 0, 0, Math.PI * 2); fx.stroke();
      }
    }

    function drawFace(t) {
      var bg = fx.createLinearGradient(0, 0, 0, 416);
      bg.addColorStop(0, "#ffffff"); bg.addColorStop(1, "#eef3fa");
      fx.fillStyle = bg; fx.fillRect(0, 0, 320, 416);
      fx.strokeStyle = "rgba(20,34,59,0.22)"; fx.lineWidth = 2; fx.strokeRect(6, 6, 308, 404);
      fx.strokeStyle = "rgba(200,146,74,0.92)"; fx.lineWidth = 2; fx.strokeRect(13, 13, 294, 390);
      fx.fillStyle = "#B07F39"; fx.font = "700 12px Arial, sans-serif";
      fx.fillText("S E L E C T E D   W O R K", 30, 46);
      var hg = fx.createLinearGradient(30, 60, 290, 214);
      hg.addColorStop(0, "#16243F"); hg.addColorStop(1, "#244a78");
      fx.fillStyle = hg; fx.fillRect(30, 60, 260, 154);
      fx.save(); fx.beginPath(); fx.rect(30, 60, 260, 154); fx.clip();
      // bars rise once (staggered, slow) then stay up
      var hs = [30, 52, 74, 100], bx = 58, by = 200;
      for (var i = 0; i < hs.length; i++) {
        var p = Math.min(1, Math.max(0, (t - 0.5 - i * 0.45) / 2.2));
        p = 1 - Math.pow(1 - p, 3);
        var h = hs[i] * p;
        fx.fillStyle = i === hs.length - 1 ? "#C8924A" : "rgba(245,243,238,0.92)";
        fx.fillRect(bx + i * 26, by - h, 16, h);
      }
      drawGlobe(228, 138, 40, t * 0.32);           // slow spinning globe
      fx.restore();
      fx.fillStyle = "rgba(20,34,59,0.88)"; fx.fillRect(30, 250, 214, 16);
      fx.fillStyle = "rgba(20,34,59,0.42)"; fx.fillRect(30, 278, 176, 11); fx.fillRect(30, 298, 146, 11);
      fx.fillStyle = "rgba(20,34,59,0.6)"; fx.font = "600 12px Arial, sans-serif";
      fx.fillText("Policy & government", 30, 366);
      fx.fillStyle = "#C8924A"; fx.font = "700 24px Georgia, serif"; fx.fillText("→", 268, 372);
    }

    var t = reduce ? 6 : 0; drawFace(t);            // start empty (animate once); settled if reduced-motion
    var faceTex = new THREE.CanvasTexture(fc);

    function navy(col) { return new THREE.MeshStandardMaterial({ color: col, roughness: 0.6, metalness: 0.2 }); }
    function card(detailed, tex) {
      var front = detailed ? new THREE.MeshBasicMaterial({ map: tex }) : navy(0x21386b);
      var mats = [navy(0x16243F), navy(0x16243F), navy(0x16243F), navy(0x16243F), front, navy(0x12203a)];
      var box = new THREE.Mesh(new THREE.BoxGeometry(W, H, D), mats);
      box.add(new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(W, H, D)),
        new THREE.LineBasicMaterial({ color: 0xC8924A, transparent: true, opacity: detailed ? 0.7 : 0.38 })
      ));
      return box;
    }
    var c3 = card(false); c3.position.set(-0.2, -0.07, -0.2); c3.rotation.z = 0.09; group.add(c3);
    var c2 = card(false); c2.position.set(-0.1, -0.035, -0.1); c2.rotation.z = 0.045; group.add(c2);
    var c1 = card(true, faceTex); c1.rotation.z = -0.02; group.add(c1);
    group.rotation.set(0.14, -0.42, 0);   // resting 3/4 view (model does not rotate)
    return {
      fit: 1.4, spin: 0,
      update: function () { t += 0.016; drawFace(t); faceTex.needsUpdate = true; }
    };
  }

  /* ---------- About: an open book (our story / knowledge) ---------- */
  function buildBook(THREE, group) {
    var Wp = 0.92, Dp = 1.16, pageT = 0.085;
    function navyMat(c) { return new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, metalness: 0.25 }); }
    var creamMat = new THREE.MeshStandardMaterial({ color: 0xece3d0, roughness: 0.9, metalness: 0.0 });
    function goldEdge(mesh, op) {
      mesh.add(new THREE.LineSegments(
        new THREE.EdgesGeometry(mesh.geometry),
        new THREE.LineBasicMaterial({ color: 0xC8924A, transparent: true, opacity: op })
      ));
    }
    // faint text on the pages
    function pageTex() {
      var c = document.createElement("canvas"); c.width = 256; c.height = 320;
      var x = c.getContext("2d");
      x.fillStyle = "#efe7d6"; x.fillRect(0, 0, 256, 320);
      x.fillStyle = "rgba(20,34,59,0.24)";
      for (var r = 0; r < 11; r++) {
        var w = r === 0 ? 104 : 150 + Math.random() * 54;
        x.fillRect(34, 36 + r * 23, Math.min(188, w), 6);
      }
      return new THREE.CanvasTexture(c);
    }
    var pageFaceMat = new THREE.MeshStandardMaterial({ map: pageTex(), roughness: 0.9, side: THREE.DoubleSide });

    // page stacks (cream, gilt edges)
    var rStack = new THREE.Mesh(new THREE.BoxGeometry(Wp, pageT, Dp), creamMat); rStack.position.set(Wp / 2 + 0.015, 0, 0);
    var lStack = new THREE.Mesh(new THREE.BoxGeometry(Wp, pageT, Dp), creamMat); lStack.position.set(-Wp / 2 - 0.015, 0, 0);
    goldEdge(rStack, 0.4); goldEdge(lStack, 0.4);
    group.add(rStack); group.add(lStack);
    // covers (navy, larger, gold edge)
    var rCover = new THREE.Mesh(new THREE.BoxGeometry(Wp + 0.07, 0.05, Dp + 0.1), navyMat(0x14223B)); rCover.position.set(Wp / 2 + 0.015, -pageT / 2 - 0.027, 0);
    var lCover = new THREE.Mesh(new THREE.BoxGeometry(Wp + 0.07, 0.05, Dp + 0.1), navyMat(0x14223B)); lCover.position.set(-Wp / 2 - 0.015, -pageT / 2 - 0.027, 0);
    goldEdge(rCover, 0.55); goldEdge(lCover, 0.55);
    group.add(rCover); group.add(lCover);
    // spine
    group.add(new THREE.Mesh(new THREE.BoxGeometry(0.07, pageT + 0.07, Dp + 0.1), navyMat(0x14223B)));
    // turning pages (hinged at the spine)
    var pages = [];
    for (var k = 0; k < 2; k++) {
      var pivot = new THREE.Group();
      var page = new THREE.Mesh(new THREE.PlaneGeometry(Wp, Dp), pageFaceMat);
      page.rotation.x = -Math.PI / 2;                 // lie flat
      page.position.set(Wp / 2, pageT / 2 + 0.004, 0); // left edge on the spine
      pivot.add(page);
      group.add(pivot);
      pages.push({ pivot: pivot, phase: k * (Math.PI / 2) });
    }
    group.rotation.set(-0.95, -0.32, 0);   // looking into the open book
    var t = 0;
    return {
      fit: 1.45, spin: 0,
      update: function () {
        t += 0.016;
        for (var i = 0; i < pages.length; i++) {
          pages[i].pivot.rotation.z = (t + pages[i].phase) % Math.PI;  // flip right → left, reset hidden
        }
      }
    };
  }

  /* shared scene ------------------------------------------------------------ */
  function build(THREE) {
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.z = 4;
    var group = new THREE.Group(); scene.add(group);
    var sprite = glowSprite(THREE);

    // lights (only the solid Portfolio card uses them; line/point models ignore them)
    scene.add(new THREE.AmbientLight(0xaebfd9, 0.95));
    var key = new THREE.DirectionalLight(0xffffff, 0.9); key.position.set(-1.6, 2.4, 3); scene.add(key);

    var built = model === "helix"  ? buildHelix(THREE, group, sprite)
              : model === "folio"  ? buildFolio(THREE, group)
              :                      buildBook(THREE, group);
    var fitR = built.fit || 1.3;
    var spin = (typeof built.spin === "number") ? built.spin : 0.0016;

    function resize() {
      var w = stage.clientWidth, h = canvas.clientHeight || 480;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      var half = Math.tan((34 * Math.PI / 180) / 2);
      var fit = fitR / half;
      camera.position.z = Math.max(fit, fit / camera.aspect) * 1.06;
      camera.updateProjectionMatrix();
    }
    resize(); window.addEventListener("resize", resize);

    var dragging = false, px = 0, py = 0, hold = 0;
    canvas.addEventListener("pointerdown", function (e) { dragging = true; px = e.clientX; py = e.clientY; try { canvas.setPointerCapture(e.pointerId); } catch (x) {} canvas.style.cursor = "grabbing"; });
    canvas.addEventListener("pointermove", function (e) { if (!dragging) return; var dx = e.clientX - px, dy = e.clientY - py; px = e.clientX; py = e.clientY; group.rotation.y += dx * 0.006; group.rotation.x += dy * 0.004; hold = 45; });
    function ed() { dragging = false; canvas.style.cursor = "grab"; }
    canvas.addEventListener("pointerup", ed);
    canvas.addEventListener("pointercancel", ed);

    var raf = null;
    function frame() {
      if (!dragging) { group.rotation.y += reduce ? 0 : (hold > 0 ? (hold--, 0) : spin); }
      if (built.update && !reduce) { built.update(); }
      try { renderer.render(scene, camera); } catch (e) { stop(); fallback(); return; }
      raf = requestAnimationFrame(frame);
    }
    function start() { if (!raf) frame(); }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }
    start();
    if (reduce) setTimeout(stop, 1500);
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { if (!reduce) start(); } else { stop(); } });
    }, { threshold: 0 }).observe(canvas);
  }
})();
