import * as THREE from "three";
// import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader.js";
import hdrUrl from "../assets/images/christmas_photo_studio_03_1k.hdr"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {useEffect, useRef} from "react";
import {DRACOLoader, GLTFLoader, RGBELoader} from "three/addons";

const ModelSection = ({modelColor, withDiamond}) => {
    const canvasRef = useRef(null);
    const modelRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const controlsRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);

        const getCanvasSize = () => {
            if (window.innerWidth >= 1350) return {width: 826, height: 826};
            if (window.innerWidth >= 768) return {width: 600, height: 600};
            return {width: 400, height: 400};
        };
        const {width, height} = getCanvasSize();

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1500);
        camera.position.set(0, 350, 500);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        rendererRef.current = renderer;
        sceneRef.current = scene;

        const ambient = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambient);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(-150, 300, 150);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);

        const goldMaterial = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(1.0, 0.766, 0.336),
            metalness: 1.0,
            roughness: 0.1,
            envMapIntensity: 2.0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.03,
            reflectivity: 1.0,
            ior: 1.5,
            sheen: 1.0,
            sheenRoughness: 0.2,
            sheenColor: new THREE.Color(1.0, 0.9, 0.6),
            specularIntensity: 1.0,
            specularColor: new THREE.Color(1.0, 0.95, 0.8)
        });
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(1.0, 1.0, 1.0),
            metalness: 0.0,
            roughness: 0.02,
            transmission: 1.0,
            transparent: true,
            opacity: 0.8,
            ior: 2.4,
            thickness: 0.1,
            attenuationColor: new THREE.Color(0xbbbbbb),
            attenuationDistance: 2.0,
            clearcoat: 0.2,
            clearcoatRoughness: 0.03,
            envMapIntensity: 1.5,
            reflectivity: 0.9,
            specularIntensity: 1.0,
            specularColor: new THREE.Color(1.0, 1.0, 1.0),
            sheen: 0.5,
            sheenRoughness: 0.1,
            sheenColor: new THREE.Color(1.0, 1.0, 1.0),
            side: THREE.DoubleSide
        });

        const rgbeLoader = new RGBELoader()
        rgbeLoader.load(hdrUrl, (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping
            scene.environment = texture
        })
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
        dracoLoader.setDecoderConfig({ type: 'js' })

        const loader = new GLTFLoader()
        loader.setDRACOLoader(dracoLoader)

        loader.load(
            "./models/ring_ver3.glb",
            (gltf) => {
                const object = gltf.scene;
                object.scale.set(13,13,13);
                object.rotation.set(0, -0.5, -0.1)
                object.position.y = 20;

                object.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;

                        const name = child.name.toLowerCase();

                        if (name.includes("gold")) {
                            child.material = goldMaterial;
                        } else if (name.includes("gem")) {
                            child.material = glassMaterial;
                        }
                    }
                });

                modelRef.current = object;
                scene.add(object);
            },
            undefined,
            (error) => console.error("Error loading GLB model:", error)
        );

        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;
        controls.minDistance = 500;
        controls.maxDistance = 800;
        controls.enablePan = false;
        controls.maxPolarAngle = Math.PI / 2.3;
        controlsRef.current = controls;

        const animate = () => {
            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();

        const handleResize = () => {
            const {width, height} = getCanvasSize();
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            if (window.innerWidth >= 1350) {
                camera.position.set(0, 350, 500);
                controls.minDistance = 350;
                controls.maxDistance = 700;
            } else if (window.innerWidth >= 768) {
                camera.position.set(0, 300, 450);
                controls.minDistance = 300;
                controls.maxDistance = 600;
            } else {
                camera.position.set(0, 250, 400);
                controls.minDistance = 250;
                controls.maxDistance = 500;
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            renderer.dispose();
        };
    }, []);

    useEffect(() => {
        if (modelRef.current) {
            modelRef.current.traverse((child) => {
                if (child.isMesh && child.material) {
                    const materials = Array.isArray(child.material)
                        ? child.material
                        : [child.material];
                    materials.forEach((mat) => mat.color.set(modelColor));
                }
            });
        }
    }, [modelColor]);

    useEffect(() => {
        if (!modelRef.current) return;

        const show = withDiamond === "With Diamond Pavé";
        modelRef.current.traverse((child) => {
            console.log(child);
            if (child.isMesh && child.name.toLowerCase().includes("gem_buttom")) {
                child.visible = show;
            }
        });
    }, [withDiamond]);

    return (
        <section className="section viewerSection">
            <div className="wrapperPrice">
                <p className="textPrice">Price:</p>
                <p className="textPrice priceValue">$489</p>
            </div>
            <canvas ref={canvasRef} className="webgl"></canvas>
        </section>
    );
};

export default ModelSection;
