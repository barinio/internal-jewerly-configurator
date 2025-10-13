import * as THREE from "three";
import {FBXLoader, OrbitControls} from "three/addons";
import {useEffect, useRef} from "react";

const ModelSection = () => {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xffffff)
        const width = 826
        const height = 826

        const camera = new THREE.PerspectiveCamera(
            45,
            width / height,
            0.1,
            1500
        )
        camera.position.set(0, 100, 500)

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
        renderer.setSize(width, height)
        renderer.setPixelRatio(window.devicePixelRatio)

        const loader = new FBXLoader()
        loader.load(
            './models/st1.fbx',
            (object) => {
                object.scale.set(0.1, 0.1, 0.1)
                scene.add(object)
            },
            () => {
                // console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.error('Error loading FBX:', error)
            }
        )

        const ambient = new THREE.AmbientLight(0xffffff, 0.5)
        scene.add(ambient)
        const light = new THREE.DirectionalLight(0xffffff, 1)
        light.position.set(100, 200, 100)
        scene.add(light)

        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;

        const updFrame = () => {
            controls.update();
            renderer.render(scene, camera);
            window.requestAnimationFrame(updFrame);
        }
        updFrame()

        const handleResize = () => {
            const width = 826
            const height = 826
            camera.aspect = width / height
            camera.updateProjectionMatrix()
            renderer.setSize(width, height)
        }
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            renderer.dispose()
        }
    }, [])

    return (
        <section className="section viewerSection">

            <div className="wrapperPrice">
                <p className="textPrice">
                    Price:
                </p>
                <p className="textPrice priceValue">
                    $489
                </p>
            </div>

            <canvas ref={canvasRef} className="webgl"></canvas>

        </section>
    );
};

export default ModelSection;
