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

        // Define offsets
        float a = 0.0; // Base offset multiplier
        float b = 0.0; // Additional offset multiplier

        // Apply sine distortion
        uv = sineDistortion(uv, u_time);

        // Apply offsets and mirror repeat
        vec2 offsetUV1 = mirrorRepeat(uv + a * (0.1 - imageprogress) + b * imageprogress); // Offset for texture 1
        vec2 offsetUV2 = mirrorRepeat(uv + a * imageprogress - b * (0.1 - imageprogress)); // Offset for texture 2

        // Diagonal progression logic
        uv.y = 1.7 - uv.y;
        float diagonalProgress = smoothstep(imageprogress, imageprogress + 0.1, (uv.x + uv.y) / 2.7);

        // Sample both textures with mirrored offsets
        vec4 T1 = texture2D(t1, offsetUV1); // Mirrored offset first texture
        vec4 T2 = texture2D(t2, offsetUV2); // Mirrored offset second texture

        // Mix textures based on diagonal progress
        vec4 outputColor = mix(T1, T2, diagonalProgress);

        gl_FragColor = outputColor;
      }
    `,
    uniforms: {
        t1: { value: texture1 }, // First texture uniform
        t2: { value: texture2 }, // Second texture uniform
        imageprogress: { value: 0.0 }, // Progress uniform for revealing
        u_resolution: { value: new THREE.Vector2(w, h) }, // Resolution uniform
        u_time: { value: 0.0 } // Time uniform
    }
});

// Full-screen plane geometry
const geometry = new THREE.PlaneGeometry(2, 2);
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);


// Scroll control
let progress = 0.0; // Current progress value
let targetProgress = 0.0; // Smoothly interpolated progress target
const threshold = .9; // Threshold for auto-complete
let scrollTimeout; // Timer for delayed revert
const revertDelay = 2000; // Delay in milliseconds before revert starts
async function updatePage() {
    const container = document.getElementById('page-container');
    if (progress < 0.5) {
        const { default: renderPage1 } = await import('./Page1.js');
        renderPage1(container);
    } else {
        const { default: renderPage2 } = await import('./Page2.js');
        renderPage2(container);
    }
}



function animateProgress() {
    if (Math.abs(targetProgress - progress) > 0.001) {
        progress += (targetProgress - progress) * 0.01; // Smoothly interpolate towards target
        material.uniforms.imageprogress.value = progress; // Update shader uniform
        updatePage(); // Dynamically update the page content
        requestAnimationFrame(animateProgress); // Continue animation
    }
}



// Trigger a revert after a delay
function delayedRevert() {
    scrollTimeout = setTimeout(() => {
        if (progress > 0.0 && progress < 1.0) {
            targetProgress = progress < threshold ? 0.0 : 1.0; // Revert or complete based on current state
            animateProgress(); // Start smooth revert or completion
        }
    }, revertDelay);
}
// Normalize the delta value to handle both mouse and trackpad scrolling
function normalizeWheel(event) {
    let normalized = event.deltaY;

    // Scale delta for trackpad gestures
    if (event.deltaMode === 1) { // DOM_DELTA_LINE: Trackpad gestures
        normalized *= 33; // Adjust this multiplier for sensitivity
    } else if (event.deltaMode === 0) { // DOM_DELTA_PIXEL: Mouse wheel
        normalized *= 0.5;
    }

    return normalized;
}
function onScroll(event) {
    const delta = normalizeWheel(event) * 0.08; // Increase multiplier for testing
    targetProgress = THREE.MathUtils.clamp(targetProgress + delta, 0.0, 1.0);

    event.preventDefault();
    clearTimeout(scrollTimeout);

    if (targetProgress > threshold && targetProgress < 1.0) {
        targetProgress = 1.0;
    } else if (targetProgress < threshold && targetProgress > 0.0) {
        targetProgress = 0.0;
    }

    animateProgress();
    delayedRevert();
}



// Add scroll event listener
window.addEventListener('wheel', onScroll, { passive: false }); // Use passive: false to allow event.preventDefault()
// Animation loop
function animate(time) {
    material.uniforms.u_time.value = time * 0.001; // Update time uniform for sine distortion
    requestAnimationFrame(animate); // Continue animation loop
    renderer.render(scene, camera); // Render the scene
}
animate();

// Handle resizing
window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    material.uniforms.u_resolution.value.set(w, h); // Update resolution uniform
});
