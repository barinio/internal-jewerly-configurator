import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { useGLTF, MeshRefractionMaterial } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { RGBELoader } from 'three-stdlib'

import hdrUrl from '../assets/images/christmas_photo_studio_03_1k.hdr'
import glbUrl from '/models/ring_ver3_3gem.glb?url'

export function Ring({ modelColor, withDiamond, stoneSelected }) {
    const group = useRef()
    const { nodes } = useGLTF(glbUrl)
    const texture = useLoader(RGBELoader, hdrUrl)

    // Матеріали
    const goldMaterial = useMemo(() => (
        new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(modelColor),
            metalness: 1,
            roughness: 0.1,
            envMapIntensity: 2,
            clearcoat: 1,
            clearcoatRoughness: 0.03,
            reflectivity: 1,
            ior: 1.5,
            sheen: 1,
            sheenRoughness: 0.2,
            sheenColor: new THREE.Color(1.0, 0.9, 0.6),
            specularIntensity: 1,
            specularColor: new THREE.Color(1.0, 0.95, 0.8)
        })
    ), [modelColor])

    const gemMaterial = useMemo(() => (
        <MeshRefractionMaterial
            envMap={texture}
            toneMapped={false}
            side={THREE.DoubleSide}
            aberrationStrength={0.02}
            color="white"
            ior={2.4}
            fresnel={1}
        />
    ), [texture])

    // Відображення каменів за станом
    const stoneMap = {
        "Oval": "gem_top_oval",
        "Cushion": "gem_top_square",
        "Round": "gem_top_round"
    }

    return (
        <group ref={group} scale={[13,13,13]} rotation={[0, -0.5, -0.1]} position={[0, 20, 0]} >
            {Object.values(nodes).map((node) => {
                if (!node.isMesh) return null
                if (node.name === "Plane_alpha") return null

                const name = node.name.toLowerCase()
                const isGemTop = name.startsWith('gem_top_')
                const isGemBottom = name.includes('gem_buttom')

                if (isGemTop && name !== stoneMap[stoneSelected]?.toLowerCase()) return null

                if (isGemBottom && withDiamond !== "With Diamond Pavé") return null

                const isGem = isGemTop || isGemBottom


                return (
                    <mesh
                        key={node.name}
                        geometry={node.geometry}
                        position={node.position}
                        rotation={node.rotation}
                        scale={node.scale}
                        castShadow
                        receiveShadow
                        material={!isGem ? goldMaterial : undefined}
                    >
                        {isGem && gemMaterial}

                    </mesh>
                )
            })}
        </group>
    )
}
