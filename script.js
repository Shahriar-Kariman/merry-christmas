import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'
import GUI from 'lil-gui'
import { TorusKnotGeometry } from 'three'


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x1c5c00)

// Textures
const textureLoader = new THREE.TextureLoader()
const textTexture = textureLoader.load('textures/matcaps/1.png')
// const spheretexture = textureLoader.load('textures/matcaps/12.jpg')
// Text
const fontLoader = new FontLoader()
fontLoader.load(
    'Fonts/ChristmasWish_Regular.json',
    (font) => {
    const textGeometry = new TextGeometry(
        'Merry Christmas',
        {
            font: font,
            size: 0.5,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5,
        }
    )
        
    textGeometry.center()

    const textMaterial = new THREE.MeshMatcapMaterial()
    textMaterial.matcap = textTexture
    const text = new THREE.Mesh(textGeometry,textMaterial)
    scene.add(text)
    }
)
// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

// Objects
const l = 12
const sphereGeometry = new THREE.SphereGeometry(0.12,32,32)
const sphereMaterial = new THREE.MeshStandardMaterial(
    {
        roughness: 0.01,
        metalness: 0.4,
        color: 0x0047AB
    }
)

const heartShape = new THREE.Shape();
const x = -2.5;
const y = -5;
heartShape.moveTo(x + 2.5, y + 2.5);
heartShape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
heartShape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
heartShape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
heartShape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
heartShape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
heartShape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

const extrudeSettings = {
  steps: 2,
  depth: 2,
  bevelEnabled: true,
  bevelThickness: 1,
  bevelSize: 2,
  bevelSegments: 7,
};

const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
const heartMaterial = new THREE.MeshStandardMaterial(
    {
        roughness: 0.01,
        metalness: 0.4,
        color: 0xEF0107,
    }
)

const torusKnotGeometry = new THREE.TorusKnotGeometry(0.05,0.03,16,32,2,3)
const torusKnotMaterial = new THREE.MeshStandardMaterial(
    {
        roughness: 0.01,
        metalness: 0.4,
        color: 0xFDDA0D,
    }
)

for(let i = 0; i < 64; i++){
    const sphere = new THREE.Mesh(sphereGeometry,sphereMaterial)
    sphere.position.x = Math.random() * l - l/2
    sphere.position.y = Math.random() * l - l/2
    sphere.position.z = Math.random() * l - l/2
    const scale = (Math.random() + 1) * 1.2 - 1
    sphere.scale.x = scale
    sphere.scale.y = scale
    sphere.scale.z = scale
    const heart = new THREE.Mesh(heartGeometry,heartMaterial)
    heart.position.x = Math.random() * l - l/2
    heart.position.y = Math.random() * l - l/2
    heart.position.z = Math.random() * l - l/2
    heart.scale.x = scale * 0.04
    heart.scale.y = scale * 0.04
    heart.scale.z = scale * 0.04
    heart.rotation.x = Math.random() * Math.PI
    heart.rotation.y = Math.random() * Math.PI
    const torusKnot = new THREE.Mesh(torusKnotGeometry,torusKnotMaterial)
    torusKnot.position.x = Math.random() * l - l/2
    torusKnot.position.y = Math.random() * l - l/2
    torusKnot.position.z = Math.random() * l - l/2
    torusKnot.scale.x = scale
    torusKnot.scale.y = scale
    torusKnot.scale.z = scale
    torusKnot.rotation.x = Math.random() * Math.PI
    torusKnot.rotation.y = Math.random() * Math.PI
    scene.add(sphere,heart,torusKnot)
}
// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 1
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width,sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate

const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene,camera)

    // next frame
    window.requestAnimationFrame(tick)
}

tick()

// Debug
const gui = new GUI()

gui.addColor(scene, 'background')
gui.addColor(sphereMaterial,'color').name('orb color')
gui.addColor(heartMaterial, 'color').name('heart color')