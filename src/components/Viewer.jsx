import * as THREE from 'three'
import {useRef, useMemo, useLayoutEffect, useContext, useState, useCallback, useEffect} from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import {
  useGLTF,
  Caustics,
  CubeCamera,
  Environment,
  OrbitControls,
  RandomizedLight,
  AccumulativeShadows,
  MeshRefractionMaterial,
  MeshTransmissionMaterial
} from '@react-three/drei'
import {folder, useControls} from 'leva'

// import hdrUrl from '../assets/images/christmas_photo_studio_03_1k.hdr'
// import hdrUrl from '../assets/images/christmas_photo_studio_04_1k.hdr' //?nice
// import hdrUrl from '../assets/images/brown_photostudio_02_1k.hdr' // not bad
// import hdrUrl from '../assets/images/brown_photostudio_06_1k.hdr' //==nice
// import hdrUrl from '../assets/images/studio_country_hall_1k.hdr' // close (white)
// import hdrUrl from '../assets/images/rostock_laage_airport_1k.hdr' // close
// import hdrUrl from '../assets/images/photo_studio_01_1k.hdr'
// import hdrUrl from '../assets/images/studio_small_08_1k.hdr'
// import hdrUrl from '../assets/images/studio_small_03_1k.hdr'
// console.log(hdrUrl)

import glbUrl from '/models/ring_ver3_3gem_1.glb?url'
import {HDRLoader} from "three/examples/jsm/loaders/HDRLoader.js";
import {Bloom, EffectComposer, EffectComposerContext, N8AO, ToneMapping} from "@react-three/postprocessing";
// import {MotionBlurEffect, SSGIEffect, TRAAEffect, VelocityDepthNormalPass} from "realism-effects";

const gemMatConf_ = {
  color: 0xffffff,
  side: THREE.DoubleSide,
  envMap: null,
  aberrationStrength: 0.02,
  toneMapped: false,
}

// const goldMaterial = new THREE.MeshPhysicalMaterial({
//   // Точный цвет настоящего золота (желтый с теплым оттенком)
//   color: new THREE.Color(0xff7b00),
//
//   // Физические свойства золота
//   metalness: 1.0,
//   roughness: 0.1,
//
//   // Усиленные отражения для реалистичного блеска
//   envMapIntensity: 2.0,
//
//   // Clearcoat для эффекта полированного золота
//   clearcoat: 1.0,
//   clearcoatRoughness: 0.03,
//
//   // Максимальная отражающая способность
//   reflectivity: 1.0,
//
//   // Индекс преломления золота (IOR)
//   ior: 1.5,
//
//   // Sheen для мягкого блеска на краях
//   sheen: 1.0,
//   sheenRoughness: 0.2,
//   sheenColor: new THREE.Color(1.0, 0.9, 0.6),
//
//   // Спекулярная интенсивность для дополнительного блеска
//   specularIntensity: 1.0,
//   specularColor: new THREE.Color(1.0, 0.95, 0.8)
// });

function Ring({ modelUrl, hdrUrl, ...props }) {
  const refColor = useRef()
  const { nodes } = useGLTF(modelUrl || glbUrl)
  // Use a custom envmap/scene-backdrop for the diamond material
  // This way we can have a clear BG while cube-cam can still film other objects
  const env = useLoader(HDRLoader, hdrUrl)

  // env.mapping = THREE.EquirectangularReflectionMapping
  // Optional config
  const gemMatConf = useControls('Gem', {
    color:  'white',
    bounces: { value: 3, min: 0, max: 8, step: 1 },
    aberrationStrength: { value: 0.01, min: 0.0001, max: 0.5, step: 0.001 },
    ior: { value: 2.75, min: 0, max: 10 },
    fresnel: { value: 1, min: 0, max: 1 },
  })

  const goldMatConf = useControls('Gold', {
    // color: props.modelColor,
    // color: '#fffff4',
    color: props.modelColor || 'red',
    roughness: { value: 0.15, min: 0, max: 1 },
    metalness: { value: 1, min: 0, max: 1 },
    envMapIntensity: { value: 1.5, min: 0, max: 5 },
    clearcoat: { value: 1.0, min: 0, max: 2 },
    clearcoatRoughness: { value: 0.03, min: 0, max: 2 },
    reflectivity: { value: 1, min: 0, max: 1 },
    ior: { value: 1.5, min: 0, max: 10 },
    sheen: { value: 1, min: 0, max: 2 },
    sheenRoughness: { value: 0.2, min: 0, max: 2 },
    // sheenColor: '#ffe81b',
    sheenColor: '#ffffff',
    specularIntensity: { value: 1, min: 0, max: 2 },
    specularColor: '#ffffff',
  })

  const [colorGold, setColorGold] = useState(goldMatConf.color)

  useEffect(() => {
    setColorGold(props.modelColor);
  }, [props.modelColor]);

  // useEffect(() => {
  //   setColorGold(goldMatConf.color);
  // }, [goldMatConf.color]);


  const gemMat = useMemo(() => {
    return <MeshRefractionMaterial {...gemMatConf} side={THREE.DoubleSide} envMap={env} toneMapped={false} />
  }, [gemMatConf, env])



  return (
    <group>
      {Object.values(nodes).map((node) => {
        if (!node.isMesh) return null;
        if ([
          props.stoneSelected !== 'Cushion' && 'gem_top_square',
          props.stoneSelected !== 'Round' && 'gem_top_round',
          props.stoneSelected !== 'Oval' && 'gem_top_oval'
        ].includes(node.name)) return null;
        if (props.withDiamond === 'Without Diamond Pavé' && node.name === "gem_buttom") return null;

        // if (node.name.toLowerCase().includes("gem_mid")) {
        //   return (
        //     <group key={node.id} position={node.position} rotation={node.rotation} scale={node.scale}>
        //       <instancedMesh args={[node.geometry, null, 1]} >
        //         {gemMat}
        //       </instancedMesh>
        //     </group>
        //   )
        // }

        // if (['gem_top_square', 'gem_top_round', 'gem_buttom'].includes(node.name)) return null;

        if (["gem_buttom", "gem_mid"].includes(node.name)) {
          let gemCount = node.name === "gem_buttom" ? 100 : 16;
          return (
            <instancedMesh key={node.id} args={[node.geometry, null, gemCount]} instanceMatrix={node.instanceMatrix}>
              {gemMat}
            </instancedMesh>
          )
        }


        // const isGem = node.name.toLowerCase().includes("gem");
        let isGem = node.name.toLowerCase().includes("gem");
        // if (['gem_top_square', 'gem_top_round', 'gem_buttom', 'gem_mid'].includes(node.name)) isGem = false;
        const isFloor = node.name === "Plane_alpha";

        return (
          <mesh key={node.id} position={node.position} rotation={node.rotation} scale={node.scale} geometry={node.geometry} material={node.material}>
            {isGem
              ? gemMat
              : (isFloor || <meshPhysicalMaterial {...goldMatConf} color={colorGold} />)
            }
          </mesh>
        )
      })}
      {/* <mesh castShadow ref={ref} geometry={nodes.Diamond_1_0.geometry} {...props}> */}
        {/* <MeshRefractionMaterial envMap={texture} {...config} toneMapped={false} /> */}
        {/* <meshStandardMaterial color="hotpink" /> */}
      {/* </mesh> */}
    </group>
  )
}

function RealismEffect({ children }) {
  const { scene, camera, composer } = useContext(EffectComposerContext)

  const options = useControls({
    SSGIEffect: folder(
      // see: https://realism-effects.vercel.app/
      {
        General: folder({
          distance: {
            value: 2.7200000000000104,
            min: 0,
            max: 10
          },
          autoThickness: false,
          thickness: {
            value: 1.2999999999999972,
            min: 0,
            max: 5
          },
          maxRoughness: {
            value: 1,
            min: 0,
            max: 1
          },
          envBlur: {
            value: 0.42,
            min: 0,
            max: 1
          },
          importanceSampling: true,
          maxEnvLuminance: {
            value: 50,
            min: 0,
            max: 100
          }
          // directLightMultiplier: 1
        }),
        'Temporal Resolve': folder({
          blend: {
            value: 0.925,
            min: 0,
            max: 1
          }
        }),
        Denoise: folder({
          denoiseIterations: {
            value: 3,
            min: 0,
            max: 5
          },
          denoiseKernel: {
            value: 3,
            min: 0,
            max: 5
          },
          denoiseDiffuse: {
            value: 40,
            min: 0,
            max: 50
          },
          denoiseSpecular: {
            value: 40,
            min: 0,
            max: 50
          },
          depthPhi: {
            value: 5,
            min: 0,
            max: 15
          },
          normalPhi: {
            value: 28,
            min: 0,
            max: 50
          },
          roughnessPhi: {
            value: 18.75,
            min: 0,
            max: 100
          }
        }),
        Tracing: folder({
          steps: {
            value: 20,
            min: 0,
            max: 256
          },
          refineSteps: {
            value: 4,
            min: 0,
            max: 16
          },
          spp: {
            value: 1,
            min: 0,
            max: 32
          },
          missedRays: false
        }),
        Resolution: folder({
          resolutionScale: {
            value: 1,
            min: 0,
            max: 1
          }
        })
      },
      { collapsed: true }
    )
  })

  const velocityDepthNormalPass = useMemo(() => new VelocityDepthNormalPass(scene, camera), [scene, camera])
  useLayoutEffect(() => {
    composer.addPass(velocityDepthNormalPass)
    return () => {
      composer.removePass(velocityDepthNormalPass)
    }
  }, [velocityDepthNormalPass, composer])

  const ssgiEffect = useMemo(() => new SSGIEffect(scene, camera, velocityDepthNormalPass, options), [scene, camera, velocityDepthNormalPass, options])
  const traaEffect = useMemo(() => new TRAAEffect(scene, camera, velocityDepthNormalPass), [scene, camera, velocityDepthNormalPass])
  const motionBlurEffect = useMemo(() => new MotionBlurEffect(velocityDepthNormalPass), [velocityDepthNormalPass])

  return (
    <>
      <primitive object={ssgiEffect} />
      {/* <primitive object={traaEffect} />
      <primitive object={motionBlurEffect} /> */}
    </>
  )
}


export default function Viewer({environmentSettings, stoneSelected, withDiamond }) {
  const [modelUrl, setModelUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const hdrUrl = Object.values(environmentSettings)[0]?.hdrPath
  const modelColor = Object.values(environmentSettings)[0]?.materialColor



  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0]
    if (!file) return

    // Проверяем тип файла
    if (!file.name.toLowerCase().endsWith('.glb') && !file.name.toLowerCase().endsWith('.gltf')) {
      alert('Пожалуйста, выберите файл формата .glb или .gltf')
      return
    }

    setIsLoading(true)

    // Создаем URL для загруженного файла
    const fileUrl = URL.createObjectURL(file)
    setModelUrl(fileUrl)
    setIsLoading(false)

    // Очищаем значение input для возможности повторной загрузки того же файла
    event.target.value = ''
  }, [])

  // Очищаем URL при размонтировании компонента
  useLayoutEffect(() => {
    return () => {
      if (modelUrl && modelUrl.startsWith('blob:')) {
        URL.revokeObjectURL(modelUrl)
      }
    }
  }, [modelUrl])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* UI для загрузки файла */}
      {/*<div style={{*/}
      {/*  position: 'absolute',*/}
      {/*  top: '10px',*/}
      {/*  left: '10px',*/}
      {/*  zIndex: 10,*/}
      {/*  background: 'rgba(255, 255, 255, 0.9)',*/}
      {/*  padding: '10px',*/}
      {/*  borderRadius: '5px',*/}
      {/*  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'*/}
      {/*}}>*/}
      {/*  <input*/}
      {/*    type="file"*/}
      {/*    accept=".glb,.gltf"*/}
      {/*    onChange={handleFileUpload}*/}
      {/*    style={{ marginBottom: '5px' }}*/}
      {/*  />*/}
      {/*  {isLoading && <div>Загрузка...</div>}*/}
      {/*  {modelUrl && (*/}
      {/*    <div style={{ fontSize: '12px', color: '#666' }}>*/}
      {/*      Загружена пользовательская модель*/}
      {/*    </div>*/}
      {/*  )}*/}
      {/*</div>*/}

      <Canvas shadows camera={{ position: [15, 10, 40], fov: 45 }}>
        {/*<color attach="background" args={['#f0f0f0']} />*/}
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <Ring
          modelUrl={modelUrl}
          modelColor={modelColor}
          stoneSelected={stoneSelected}
          withDiamond={withDiamond}
          hdrUrl={hdrUrl}
          rotation={[0, 0, 0]}
          position={[0, 0, 0]}
        />

        {/*<AccumulativeShadows*/}
        {/*  temporal*/}
        {/*  frames={100}*/}
        {/*  color="orange"*/}
        {/*  colorBlend={2}*/}
        {/*  toneMapped={true}*/}
        {/*  alphaTest={0.7}*/}
        {/*  opacity={1}*/}
        {/*  scale={12}*/}
        {/*  position={[0, -0.5, 0]}*/}
        {/*>*/}
        {/*  <RandomizedLight amount={8} radius={10} ambient={0.5} position={[5, 5, -10]} bias={0.001} />*/}
        {/*</AccumulativeShadows>*/}
        <Environment files={hdrUrl} />
        <OrbitControls makeDefault autoRotate minDistance={27} maxDistance={60} autoRotateSpeed={0.1} minPolarAngle={0} maxPolarAngle={Math.PI / 2.25} />
        {/*<EffectComposer>*/}
          {/*<RealismEffect />*/}
          {/*<N8AO aoRadius={0.15} intensity={4} distanceFalloff={2} />*/}
        {/*  <Bloom luminanceThreshold={3.5} intensity={0.85} levels={9} mipmapBlur />*/}
        {/*  <ToneMapping />*/}
        {/*</EffectComposer>*/}
      </Canvas>
    </div>
  )
}
