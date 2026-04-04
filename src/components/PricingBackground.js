/**
 * pricingBackground.js
 * Interactive Three.js animated mesh background for pricing sections.
 *
 * Dependencies (load before this script):
 *   - three.js (r128+)          https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js
 *   - simplex-noise (3.x)       https://cdnjs.cloudflare.com/ajax/libs/simplex-noise/2.4.0/simplex-noise.min.js
 *   - chroma-js (optional)      https://cdnjs.cloudflare.com/ajax/libs/chroma-js/2.4.2/chroma.min.js
 *
 * Usage:
 *   <canvas id="pricingBackground"></canvas>
 *   <script src="pricingBackground.js"></script>
 *
 * Or with custom config:
 *   initPricingBackground({ light1Color: 0xff0000, zCoef: 8 });
 */

function initPricingBackground(userConf) {
  const conf = {
    el: 'pricingBackground',
    fov: 75,
    cameraZ: 75,
    xyCoef: 50,
    zCoef: 10,
    lightIntensity: 0.9,
    ambientColor: 0x000000,
    light1Color: 0x0E09DC,
    light2Color: 0x1CD1E1,
    light3Color: 0x18C02C,
    light4Color: 0xee3bcf,
    ...userConf
  };

  let renderer, scene, camera;
  let width, height, wWidth, wHeight;
  let plane;
  let light1, light2, light3, light4;
  let animFrameId;

  const simplex = new SimplexNoise();
  const mouse = new THREE.Vector2();
  const mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const mousePosition = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();

  init();

  function init() {
    const canvas = document.getElementById(conf.el);
    if (!canvas) {
      console.warn(`pricingBackground: No canvas found with id "${conf.el}"`);
      return;
    }

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    camera = new THREE.PerspectiveCamera(conf.fov);
    camera.position.z = conf.cameraZ;

    updateSize();
    window.addEventListener('resize', updateSize, false);

    document.addEventListener('mousemove', onMouseMove, false);

    initScene();
    animate();
  }

  function onMouseMove(e) {
    const v = new THREE.Vector3();
    camera.getWorldDirection(v);
    v.normalize();
    mousePlane.normal = v;
    mouse.x = (e.clientX / width) * 2 - 1;
    mouse.y = -(e.clientY / height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(mousePlane, mousePosition);
  }

  function initScene() {
    scene = new THREE.Scene();
    initLights();

    const mat = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const geo = new THREE.PlaneBufferGeometry(wWidth, wHeight, wWidth / 2, wHeight / 2);
    plane = new THREE.Mesh(geo, mat);
    scene.add(plane);

    plane.rotation.x = -Math.PI / 2 - 0.2;
    plane.position.y = -25;
    camera.position.z = 60;
  }

  function initLights() {
    const r = 30;
    const y = 10;
    const lightDistance = 500;

    light1 = new THREE.PointLight(conf.light1Color, conf.lightIntensity, lightDistance);
    light1.position.set(0, y, r);
    scene.add(light1);

    light2 = new THREE.PointLight(conf.light2Color, conf.lightIntensity, lightDistance);
    light2.position.set(0, -y, -r);
    scene.add(light2);

    light3 = new THREE.PointLight(conf.light3Color, conf.lightIntensity, lightDistance);
    light3.position.set(r, y, 0);
    scene.add(light3);

    light4 = new THREE.PointLight(conf.light4Color, conf.lightIntensity, lightDistance);
    light4.position.set(-r, y, 0);
    scene.add(light4);
  }

  function animate() {
    animFrameId = requestAnimationFrame(animate);
    animatePlane();
    animateLights();
    renderer.render(scene, camera);
  }

  function animatePlane() {
    const gArray = plane.geometry.attributes.position.array;
    const time = Date.now() * 0.0002;
    for (let i = 0; i < gArray.length; i += 3) {
      gArray[i + 2] = simplex.noise4D(
        gArray[i] / conf.xyCoef,
        gArray[i + 1] / conf.xyCoef,
        time,
        mouse.x + mouse.y
      ) * conf.zCoef;
    }
    plane.geometry.attributes.position.needsUpdate = true;
  }

  function animateLights() {
    const time = Date.now() * 0.001;
    const d = 50;
    light1.position.x = Math.sin(time * 0.1) * d;
    light1.position.z = Math.cos(time * 0.2) * d;
    light2.position.x = Math.cos(time * 0.3) * d;
    light2.position.z = Math.sin(time * 0.4) * d;
    light3.position.x = Math.sin(time * 0.5) * d;
    light3.position.z = Math.sin(time * 0.6) * d;
    light4.position.x = Math.sin(time * 0.7) * d;
    light4.position.z = Math.cos(time * 0.8) * d;
  }

  function updateSize() {
    width = window.innerWidth;
    height = window.innerHeight;
    if (renderer && camera) {
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const wsize = getRendererSize();
      wWidth = wsize[0];
      wHeight = wsize[1];
    }
  }

  function getRendererSize() {
    const cam = new THREE.PerspectiveCamera(camera.fov, camera.aspect);
    const vFOV = cam.fov * Math.PI / 180;
    const h = 2 * Math.tan(vFOV / 2) * Math.abs(conf.cameraZ);
    const w = h * cam.aspect;
    return [w, h];
  }

  // Public API
  return {
    /**
     * Randomise light colours. Pass an array of 4 hex strings,
     * or leave empty to use chroma.js random colours (if available).
     * @param {string[]} [colors]
     */
    randomColors(colors) {
      const pick = (i) => {
        if (colors && colors[i]) return new THREE.Color(colors[i]);
        if (typeof chroma !== 'undefined') return new THREE.Color(chroma.random().hex());
        return new THREE.Color(Math.random() * 0xffffff);
      };
      light1.color = pick(0);
      light2.color = pick(1);
      light3.color = pick(2);
      light4.color = pick(3);
    },

    /** Update noise / height coefficients at runtime. */
    setNoiseCoef(value) { conf.xyCoef = value; },
    setHeightCoef(value) { conf.zCoef = value; },

    /** Stop the animation loop and remove event listeners. */
    destroy() {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', updateSize);
      document.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
    }
  };
}

// Auto-init if the default canvas exists
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('pricingBackground')) initPricingBackground();
  });
} else {
  if (document.getElementById('pricingBackground')) initPricingBackground();
}