import { createHotspot } from "./point.js";
import { animalInfo } from "./animalInfo.js";

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
        { file: "fish-nem.glb", count: 10, scale: 3.5, x: 10, y: -8, z: -5 },
        { file: "fishie.glb", count: 6, scale: 0.80, x: 15, y: 8, z: 10 },
        { file: "koi_fish.glb", count: 5, scale: 0.90, x: -5, y: 15, z: -8 },
        { file: "red_betta_fish.glb", count: 7, scale: 0.01, x: 12, y: -5, z: 12 },
        { file: "animal_crossing_new_horizons_octopus.glb", count: 1, scale: 1, x: -10, y: -24, z: -15 },
        { file: "fishoo.glb", count: 2, scale: 1, x: 5, y: 18, z: 5 },
        { file: "lowpoly_fish.glb", count: 1, scale: 0.2, x: -18, y: -12, z: 0 },
        { file: "octopus.glb", count: 1, scale: 0.5, x: -5, y: -18, z: -8 },
        { file: "pelagic_thresher_shark.glb", count: 1, scale: 0.05, x: -8, y: 12, z: 15 },
        { file: "stylized_crab.glb", count: 2, scale: 1, x: -15, y: -22, z: 8 }
    ],

    groundElements: [
        { file: "alga.glb", x: -18, z: -20, scale: 2, y: -25, count: 30, spacing: 3 },
        { file: "alga.glb", x: 15, z: -20, scale: 2, y: -25, count: 30, spacing: 3 },
        { file: "alga.glb", x: -12, z: 12, scale: 2, y: -25, count: 10, spacing: 3 },
        { file: "alga.glb", x: 12, z: -8, scale: 2, y: -25, count: 10, spacing: 3 },
        { file: "algue_rouge_actuelle.glb", x: 0, z: 18, scale: 2, y: -25, count: 1, spacing: 3 }
    ],

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

                // Apply position
                clone.position = createGridPosition(baseX, baseY, baseZ, i, spacing);
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
        new BABYLON.Vector3(5, 1, 0),
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

// Load ground elements (algae)
CONFIG.groundElements.forEach(elementConfig => {
    loadModel(elementConfig, "./assets/models/ground/", scene, { isAnimal: false });
});

// Load rocks
CONFIG.rocks.forEach(rockConfig => {
    loadSingleModel(rockConfig, "./assets/models/ground/", scene);
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
