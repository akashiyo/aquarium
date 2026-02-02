import { createHotspot } from "./point.js";
import { animalInfo } from "./animalInfo.js";

// ============================================================================
// SEEDED RANDOM (for reproducible ground element placement)
// ============================================================================

function seededRandom(seed) {
    let value = seed % 2147483647;
    if (value <= 0) value += 2147483646;

    return function () {
        value = value * 16807 % 2147483647;
        return (value - 1) / 2147483646;
    };
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
    aquarium: {
        width: 50,
        height: 50,
        depth: 50,
        glassAlpha: 0.3,
        glassColor: [0.2, 0.6, 0.8]
    },

    ground: {
        width: 50,
        height: 3,
        depth: 50,
        positionY: -26.5,
        textureUrl: "https://playground.babylonjs.com/textures/sand.jpg",
        textureScale: 5
    },

    defaults: {
        animal: {
            count: 1,
            scale: 1,
            spacing: 3,
            x: 0,
            y: 0,
            z: 0
        },
        groundElement: {
            count: 1,
            scale: 1,
            spacing: 3,
            y: -25
        }
    },

    animals: [
        { file: "fish.glb", count: 3, scale: 0.01, x: -8, y: 0, z: 8 },
        { file: "jellyfish.glb", count: 4, scale: [0.0010, 0.0015, 0.0020], x: 0, y: 12, z: 0 },
        { file: "turtle.glb", count: 1, scale: 15, x: -15, y: 5, z: -10 },
        { file: "crab.glb", count: 10, scale: [2, 3], y: -23, x: 8, z: -8 },
        { file: "seahorse.glb", count: 10, scale: 0.35, x: -12, y: -15, z: 10 },
        { file: "fish-nem.glb", count: 10, scale: 1.7, x: 8, y: -20, z: -5 },
        { file: "fishie.glb", count: 6, scale: 0.80, x: 15, y: 8, z: 10 },
        { file: "koi_fish.glb", count: 5, scale: 0.90, x: -5, y: 15, z: -8 },
        { file: "red_betta_fish.glb", count: 7, scale: 0.01, x: 12, y: -5, z: 12 },
        { file: "animal_crossing_new_horizons_octopus.glb", count: 1, scale: 1, x: -19, y: -23, z: -19 },
        { file: "fishoo.glb", count: 2, scale: 1, x: 5, y: 18, z: 5 },
        { file: "lowpoly_fish.glb", count: 1, scale: 0.2, x: -18, y: -12, z: 0 },
        { file: "octopus.glb", count: 1, scale: 0.5, x: -5, y: -18, z: -8 },
        { file: "pelagic_thresher_shark.glb", count: 1, scale: 0.05, x: -8, y: 12, z: 15, rotationX: Math.PI / 2 },
        { file: "stylized_crab.glb", count: 2, scale: 7, x: -10, y: -21, z: -12 }
    ],

    groundElements: {
        seed: 987654,
        groundMin: -20,
        groundMax: 20,
        minDistance: 2.2,
        types: [
            { file: "alga.glb", scale: 2.5, y: -24, min: 8, max: 30 },
            { file: "algue_rouge_actuelle.glb", scale: 1.2, y: -24.5, min: 15, max: 25 },
            { file: "blue_sea_anemone_l.glb", scale: 4.2, y: -24.5, min: 6, max: 10 },
            { file: "coral(1).glb", scale: 1, y: -24.5, min: 3, max: 7 },
            { file: "algue_rouge_actuelle.glb", scale: 2.8, y: -24.5, min: 6, max: 22 },
            { file: "coral.glb", scale: 0.5, y: -24.5, min: 6, max: 10 },
            { file: "coral_piece.glb", scale: 1, y: -24.5, min: 4, max: 9 },
            { file: "algae.glb", scale: 5, y: -25.5, min: 3, max: 6 },
            { file: "algas.glb",  pos:{ x: -25, y: -48.5, z: 9 }, scale: 2, count:1},
            { file: "algas.glb",  pos:{ x: -22, y: -48.5, z: -30 }, scale: 2, count:1},
            { file: "algas.glb",  pos:{ x: -21, y: -37, z: -28 }, scale: 1, count:1},
            { file: "algas.glb",  pos:{ x: -5, y: -48.5, z: -12 }, scale: 2, count:1},
            { file: "algas.glb",  pos:{ x: -13, y: -37, z: -8 }, scale: 1, count:1},
            { file: "algas.glb",  pos:{ x: 16, y: -48.5, z: -20 }, scale: 2, count:1},
            { file: "algas.glb",  pos:{ x: 5, y: -37, z: 2 }, scale: 1, count:1},
            { file: "algas.glb",  pos:{ x: 19, y: -37, z: 16 }, scale: 1, count:1},
            { file: "algas_calcareas.glb", scale: 0.08, y: -30, min: 7, max: 20 },
            { file: "blue_sea_anemone_l.glb", scale: 6, y: -23.4, min: 6, max: 10 },
            { file:"coral_v2.0.glb", pos:{ x: 42, y: 1, z: -51 }, scale: 2 },
            { file:"coral_v2.0.glb", pos:{ x: -2, y: -9.5, z: -2 }, scale: 1.2 },
            { file:"coral_v2.0.glb", pos:{ x: 42, y: 7, z: -22}, scale: 2.5 },
            { file: "emberdrop_-_coral.glb", scale: 4, y: -25.5, min: 3, max: 5 },
            { file: "lambis_shell.glb", scale: 40, y: -25, min: 2, max: 3 },
            { file: "lowpoly_coral.glb", scale: 0.7, y: -24.8, min: 8, max: 21 },
            { file: "pink_sea_anemone_l.glb", scale: 6, y: -24, min: 2, max: 3 },
            { file: "pocillopora_eydouxi.glb", scale: 0.3, y: -23, min: 7, max: 14 },
            { file: "purple_sea_anemone_l.glb", scale: 5, y: -24.5, min: 1, max: 3 },
            { file: "rainbow_haven_reef_-_coral.glb", scale: 5, y: -25.5, min: 1, max: 2 }
        ]
    },

    rocks: [
        { file: "lyme_bay.glb", scale: 0.8, y: -24.5 }
    ]
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get scale value from config (handles both number and array)
 */
function getScaleValue(scale) {
    return Array.isArray(scale)
        ? scale[Math.floor(Math.random() * scale.length)]
        : scale;
}

/**
 * Create grid position with random offset
 */
function createGridPosition(baseX, baseY, baseZ, index, spacing) {
    return new BABYLON.Vector3(
        baseX + (index % 2) * spacing - spacing / 2 + BABYLON.Scalar.RandomRange(-1, 1),
        baseY + BABYLON.Scalar.RandomRange(-2, 2),
        baseZ + Math.floor(index / 2) * spacing - spacing / 2 + BABYLON.Scalar.RandomRange(-1, 1)
    );
}

/**
 * Apply defaults to config object
 */
function applyDefaults(config, defaults) {
    return { ...defaults, ...config };
}

/**
 * Center mesh on X/Z axes and ground it (set bottom to Y=0)
 */
function centerMeshXZAndGround(mesh) {
    mesh.computeWorldMatrix(true);
    const boundingInfo = mesh.getBoundingInfo();
    const bbox = boundingInfo.boundingBox;

    const centerX = (bbox.maximumWorld.x + bbox.minimumWorld.x) / 2;
    const centerZ = (bbox.maximumWorld.z + bbox.minimumWorld.z) / 2;
    const bottomY = bbox.minimumWorld.y;

    mesh.position.x -= centerX;
    mesh.position.z -= centerZ;
    mesh.position.y -= bottomY;
}

// ============================================================================
// MODEL LOADING
// ============================================================================

/**
 * Generic function to load and clone models
 */
function loadModel(modelConfig, basePath, scene, options = {}) {
    const defaults = options.isAnimal ? CONFIG.defaults.animal : CONFIG.defaults.groundElement;
    const config = applyDefaults(modelConfig, defaults);

    BABYLON.SceneLoader.ImportMesh(
        "",
        basePath,
        config.file,
        scene,
        (meshes) => {
            const template = meshes[0];
            template.setEnabled(false);

            const baseX = config.x;
            const baseY = config.y;
            const baseZ = config.z;
            const spacing = config.spacing;

            for (let i = 0; i < config.count; i++) {
                const clone = template.clone(`${config.file}_clone_${i}`);
                clone.setEnabled(true);

                // Apply scale
                const scaleValue = getScaleValue(config.scale);
                clone.scaling.scaleInPlace(scaleValue);

                // Recalculer le bounding box après le scaling
                clone.refreshBoundingInfo();

                // Calculer le décalage du centre du bounding box par rapport à la position du mesh
                // Cela corrige les modèles dont le pivot n'est pas au centre géométrique
                const boundingInfo = clone.getHierarchyBoundingVectors(true);
                const center = boundingInfo.min.add(boundingInfo.max).scale(0.5);
                const pivotOffset = center.subtract(clone.position);

                // Apply position avec compensation du décalage de pivot
                const targetPosition = createGridPosition(baseX, baseY, baseZ, i, spacing);
                clone.position = targetPosition.subtract(pivotOffset);

                // Apply rotation (with optional initial rotations from config)
                // Appliquer aux meshes enfants aussi car certains modèles GLB ont leur géométrie dans les enfants
                if (config.rotationX) {
                    clone.rotation.x = config.rotationX;
                    clone.getChildMeshes().forEach(child => child.rotation.x = config.rotationX);
                }
                if (config.rotationZ) {
                    clone.rotation.z = config.rotationZ;
                    clone.getChildMeshes().forEach(child => child.rotation.z = config.rotationZ);
                }
                clone.rotation.y = Math.random() * Math.PI * 2;

                // Add metadata for animation (only for animals)
                if (options.isAnimal) {
                    clone.metadata = {
                        speed: BABYLON.Scalar.RandomRange(0.005, 0.02),
                        turn: Math.random() > 0.5 ? 1 : -1
                    };

                    // Create hotspot for first clone only
                    if (i === 0) {
                        const info = animalInfo[config.file];
                        if (info) {
                            createHotspot(
                                scene,
                                camera,
                                advancedTexture,
                                clone,
                                info.number,
                                info.title,
                                info.text
                            );
                        }
                    }
                }
            }
        }
    );
}

/**
 * Load a single model (no cloning)
 */
function loadSingleModel(modelConfig, basePath, scene) {
    BABYLON.SceneLoader.ImportMesh(
        "",
        basePath,
        modelConfig.file,
        scene,
        (meshes) => {
            meshes[0].scaling = new BABYLON.Vector3(
                modelConfig.scale,
                modelConfig.scale,
                modelConfig.scale
            );
            meshes[0].position.y = modelConfig.y;
        }
    );
}

/**
 * Load ground elements with seeded random placement and collision avoidance
 */
function loadGroundElements(scene) {
    const config = CONFIG.groundElements;
    const rand = seededRandom(config.seed);
    const placedPositions = [];

    function isFarEnough(pos) {
        return placedPositions.every(p =>
            BABYLON.Vector3.Distance(p, pos) > config.minDistance
        );
    }

    config.types.forEach(algae => {
        BABYLON.SceneLoader.ImportMesh(
            "",
            "./assets/models/ground/ground/",
            algae.file,
            scene,
            (meshes) => {
                const template = meshes[0];
                template.setEnabled(false);

                // Si une position FIXE est fournie
                if (algae.pos) {
                    const pos = new BABYLON.Vector3(algae.pos.x, algae.pos.y, algae.pos.z);

                    // place exactement une instance ici
                    const clone = template.clone(`${algae.file}_fixed`);
                    clone.setEnabled(true);

                    const s = algae.scale ?? 1;
                    clone.scaling.set(s, s, s);

                    // garde le centre / alignement bottom
                    centerMeshXZAndGround(clone);

                    clone.position = pos.clone();
                    return;  // on ne fait pas l’aléatoire
                }

                // Sinon on fait l’aléatoire
                const count = Math.floor(
                    BABYLON.Scalar.Lerp(algae.min, algae.max, rand())
                );

                for (let i = 0; i < count; i++) {
                    let position;
                    let tries = 0;

                    do {
                        position = new BABYLON.Vector3(
                            BABYLON.Scalar.Lerp(config.groundMin, config.groundMax, rand()),
                            algae.y,
                            BABYLON.Scalar.Lerp(config.groundMin, config.groundMax, rand())
                        );
                        tries++;
                    } while (!isFarEnough(position) && tries < 30);

                    if (tries >= 30) continue;

                    placedPositions.push(position.clone());

                    const parent = new BABYLON.TransformNode(`${algae.file}_parent_${i}`, scene);

                    const clone = template.clone(`${algae.file}_${i}`);
                    clone.setEnabled(true);

                    const scaleFactor = BABYLON.Scalar.Lerp(0.8, 1.2, rand());
                    const finalScale = (algae.scale ?? 1) * scaleFactor;
                    clone.scaling.set(finalScale, finalScale, finalScale);

                    centerMeshXZAndGround(clone);

                    clone.parent = parent;
                    parent.position = position;

                    parent.rotation.y = rand() * Math.PI * 2;
                }
            }
        );
    });
}

// ============================================================================
// SCENE CREATION
// ============================================================================

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = function() {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

    // Light
    new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0, 0, 0),
        scene
    );

    // Aquarium box
    const aquarium = BABYLON.MeshBuilder.CreateBox(
        "aquarium",
        {
            width: CONFIG.aquarium.width,
            height: CONFIG.aquarium.height,
            depth: CONFIG.aquarium.depth
        },
        scene
    );

    const glassMat = new BABYLON.StandardMaterial("glass", scene);
    glassMat.alpha = CONFIG.aquarium.glassAlpha;
    glassMat.diffuseColor = new BABYLON.Color3(
        ...CONFIG.aquarium.glassColor
    );
    aquarium.material = glassMat;

    return scene;
}

const scene = createScene();

// Créer l'interface GUI fullscreen pour les hotspots
const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("hotspotsUI", true, scene);

// Camera
const camera = new BABYLON.ArcRotateCamera(
    "camera",
    0, 1, 10,
    BABYLON.Vector3.Zero(),
    scene
);
camera.attachControl(canvas, true);

// ============================================================================
// LOAD SCENE ELEMENTS
// ============================================================================

// Load all animals
CONFIG.animals.forEach(animalConfig => {
    loadModel(animalConfig, "./assets/models/animals/", scene, { isAnimal: true });
});

// Load ground elements (algae, corals, anemones) with seeded random placement
loadGroundElements(scene);

// Load rocks
CONFIG.rocks.forEach(rockConfig => {
    loadSingleModel(rockConfig, "./assets/models/ground/ground/", scene);
});

// Ground with sand texture
const ground = BABYLON.MeshBuilder.CreateBox(
    "ground",
    {
        width: CONFIG.ground.width,
        height: CONFIG.ground.height,
        depth: CONFIG.ground.depth
    },
    scene
);

const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
groundMat.diffuseTexture = new BABYLON.Texture(CONFIG.ground.textureUrl, scene);
groundMat.diffuseTexture.uScale = CONFIG.ground.textureScale;
groundMat.diffuseTexture.vScale = CONFIG.ground.textureScale;
ground.material = groundMat;
ground.position.y = CONFIG.ground.positionY;

// ============================================================================
// RENDER LOOP
// ============================================================================

engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());
canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
});
