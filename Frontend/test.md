import * as THREE from 'three';

// Set up renderer, scene, and camera
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 100);
camera.position.z = 1;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// Load textures
const loader = new THREE.TextureLoader();
const texture1 = loader.load('./texture1.jpg', (texture) => {
    texture.flipY = false; // Disable vertical flipping
});
const texture2 = loader.load('./texture2.jpg', (texture) => {
    texture.flipY = false; // Disable vertical flipping
});

const material = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D t1; // First texture
      uniform sampler2D t2; // Second texture
      uniform float imageprogress; // Progress uniform
      uniform vec2 u_resolution; // Resolution uniform
      uniform float u_time; // Time uniform
      varying vec2 vUv;

      // Custom mirrorRepeat function
      vec2 mirrorRepeat(vec2 uv) {
        return abs(mod(uv, 2.0) - 1.0); // Mirror repeat logic
      }

      // Sine distortion function
      vec2 sineDistortion(vec2 uv, float time) {
        float frequency = .5; // Frequency of sine waves
        float amplitude = 0.009; // Amplitude of sine waves
        uv.x += amplitude * sin(frequency * uv.y + time);
        uv.y += amplitude * sin(frequency * uv.x + time);
        return uv;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy; // Normalize pixel coordinates

        // Apply sine distortion
        uv = sineDistortion(uv, u_time);

        // Diagonal progression logic
        uv.y = 1.7 - uv.y;
        float diagonalProgress = smoothstep(imageprogress, imageprogress + 0.1, (uv.x + uv.y) / 2.7);

        // Sample both textures
        vec4 T1 = texture2D(t1, uv); // First texture
        vec4 T2 = texture2D(t2, uv); // Second texture

        // Mix textures based on diagonal progress
        vec4 outputColor = mix(T1, T2, diagonalProgress);

        gl_FragColor = outputColor;
      }
    `,
    uniforms: {
        t1: { value: texture1 },
        t2: { value: texture2 },
        imageprogress: { value: 0.0 },
        u_resolution: { value: new THREE.Vector2(w, h) },
        u_time: { value: 0.0 }
    }
});

// Full-screen plane geometry
const geometry = new THREE.PlaneGeometry(2, 2);
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

// Scroll control
let progress = 0.0;
let targetProgress = 0.0;
const threshold = 0.9; // Threshold for auto-complete
let scrollTimeout; // Timer for delayed revert
const revertDelay = 2000; // Delay before reverting

// Normalize the delta value to handle both mouse and trackpad scrolling
function normalizeWheel(event) {
    let normalized = event.deltaY;

    if (event.deltaMode === 1) { // DOM_DELTA_LINE: Trackpad gestures
        normalized *= 33; // Adjust this multiplier for sensitivity
    } else if (event.deltaMode === 0) { // DOM_DELTA_PIXEL: Mouse wheel
        normalized *= 0.5;
    }

    return normalized;
}

// Map normalized scroll to targetProgress and decide if it should complete or revert
function onScroll(event) {
    const delta = normalizeWheel(event) * 0.0015; // Adjust sensitivity
    targetProgress = THREE.MathUtils.clamp(targetProgress + delta, 0.0, 1.0); // Clamp progress

    event.preventDefault(); // Prevent default scroll behavior

    // Clear any existing timeout to avoid premature revert
    clearTimeout(scrollTimeout);

    // Trigger revert after delay
    delayedRevert();

    animateProgress(); // Smoothly animate towards target progress
}

// Smoothly animate towards the target progress
function animateProgress() {
    if (Math.abs(targetProgress - progress) > 0.001) {
        progress += (targetProgress - progress) * 0.1; // Smooth interpolation
        material.uniforms.imageprogress.value = progress; // Update shader uniform
        requestAnimationFrame(animateProgress);
    }
}

// Revert or complete the animation after a delay
function delayedRevert() {
    scrollTimeout = setTimeout(() => {
        if (progress > 0.0 && progress < 1.0) {
            targetProgress = progress < threshold ? 0.0 : 1.0; // Complete or revert
            animateProgress();
        }
    }, revertDelay);
}

// Add scroll event listener
window.addEventListener('wheel', onScroll, { passive: false });

// Animation loop
function animate(time) {
    material.uniforms.u_time.value = time * 0.001; // Update time uniform
    requestAnimationFrame(animate); // Continue animation
    renderer.render(scene, camera);
}
animate();

// Handle resizing
window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    material.uniforms.u_resolution.value.set(w, h);
});
