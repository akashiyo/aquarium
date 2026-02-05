import { createHotspot } from "./point.js";
import { animalInfo } from "./animalInfo.js";

// ============================================================================
// RANDOM AVEC GRAINE (pour un placement reproductible des éléments au sol)
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
        { file: "model_50a_-_hawksbill_sea_turtle.glb", count: 1, scale: 15, x: -15, y: 5, z: -10 },
        { file: "crab.glb", count: 10, scale: [2, 3], y: -23, x: 8, z: -8 },
        { file: "seahorse.glb", count: 10, scale: 0.35, x: -12, y: -15, z: 10 },
        { file: "fish-nem.glb", count: 10, scale: 1.7, x: 8, y: -20, z: -5 },
        { file: "fishie.glb", count: 6, scale: 0.80, x: 15, y: 8, z: 10 },
        { file: "koi_fish.glb", count: 5, scale: 0.90, x: -5, y: 15, z: -8 },
        { file: "red_betta_fish.glb", count: 7, scale: 0.01, x: 12, y: -5, z: 12 },
        { file: "animal_crossing_new_horizons_octopus.glb", count: 1, scale: 1, x: -19, y: -23, z: -19 },
        { file: "fishoo.glb", count: 2, scale: 1, x: 5, y: 18, z: 5 },
        { file: "lowpoly_fish.glb", count: 4, scale: 0.2, x: -18, y: -12, z: 0 },
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
            { file: "purple_sea_anemone_l.glb", scale: 5, y: -24.5, min: 2, max: 3 },
            { file: "rainbow_haven_reef_-_coral.glb", scale: 5, y: -25.5, min: 2, max: 2 }
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
 * Récupère la valeur d'échelle depuis la config (gère nombre et tableau)
 */
function getScaleValue(scale) {
    return Array.isArray(scale)
        ? scale[Math.floor(Math.random() * scale.length)]
        : scale;
}

/**
 * Crée une position en grille avec décalage aléatoire
 */
function createGridPosition(baseX, baseY, baseZ, index, spacing) {
    return new BABYLON.Vector3(
        baseX + (index % 2) * spacing - spacing / 2 + BABYLON.Scalar.RandomRange(-1, 1),
        baseY + BABYLON.Scalar.RandomRange(-2, 2),
        baseZ + Math.floor(index / 2) * spacing - spacing / 2 + BABYLON.Scalar.RandomRange(-1, 1)
    );
}

/**
 * Applique les valeurs par défaut à l'objet de configuration
 */
function applyDefaults(config, defaults) {
    return { ...defaults, ...config };
}

/**
 * Centre le mesh sur les axes X/Z et le pose au sol (bas à Y=0)
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
// CHARGEMENT DES MODÈLES
// ============================================================================

/**
 * Fonction générique pour charger et cloner des modèles
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

                // Appliquer l'échelle
                const scaleValue = getScaleValue(config.scale);
                clone.scaling.scaleInPlace(scaleValue);

                // Recalculer le bounding box après le scaling
                clone.refreshBoundingInfo();

                // Calculer le décalage du centre du bounding box par rapport à la position du mesh
                // Cela corrige les modèles dont le pivot n'est pas au centre géométrique
                const boundingInfo = clone.getHierarchyBoundingVectors(true);
                const center = boundingInfo.min.add(boundingInfo.max).scale(0.5);
                const pivotOffset = center.subtract(clone.position);

                // Appliquer la position avec compensation du décalage de pivot
                const targetPosition = createGridPosition(baseX, baseY, baseZ, i, spacing);
                clone.position = targetPosition.subtract(pivotOffset);

                // Appliquer la rotation (avec rotations initiales optionnelles depuis la config)
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

                // Ajouter des métadonnées pour l'animation (seulement pour les animaux)
                if (options.isAnimal) {
                    clone.metadata = {
                        speed: BABYLON.Scalar.RandomRange(0.005, 0.02),
                        turn: Math.random() > 0.5 ? 1 : -1,
                        animalType: config.file // Stocker le type d'animal
                    };

                    // Créer un hotspot seulement pour le premier clone
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
                                info.text,
                                config.file
                            );
                        }
                    }

                    // Ajouter un event listener pour le clic sur les animaux bioluminescents
                    const animalType = getAnimalTypeFromMesh(clone.name);
                    if (animalType) {
                        // Attacher l'ActionManager au clone principal ET à tous ses enfants
                        const meshesToMakeClickable = [clone, ...clone.getChildMeshes()];

                        meshesToMakeClickable.forEach(mesh => {
                            mesh.actionManager = new BABYLON.ActionManager(scene);
                            mesh.actionManager.registerAction(
                                new BABYLON.ExecuteCodeAction(
                                    BABYLON.ActionManager.OnPickTrigger,
                                    () => {
                                        console.log(`🖱️ Clic détecté sur ${mesh.name}`);
                                        toggleIndividualBioluminescence(animalType);
                                    }
                                )
                            );
                        });
                    }
                }
            }
        }
    );
}

/**
 * Charge un modèle unique (sans clonage)
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
 * Charge les éléments au sol avec placement aléatoire avec graine et évitement de collision
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
// CRÉATION DE LA SCÈNE
// ============================================================================

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

// Variable globale pour la lumière (pour le contrôle jour/nuit)
let light;

const createScene = function() {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

    // Lumière principale (contrôlée par le slider)
    light = new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0, 1, 0),
        scene
    );
    light.intensity = 1;
    light.diffuse = new BABYLON.Color3(1, 1, 1); // Blanc jour
    light.groundColor = new BABYLON.Color3(0.5, 0.7, 1); // Bleu clair au sol

    // Boîte de l'aquarium
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
// CHARGEMENT DES ÉLÉMENTS DE LA SCÈNE
// ============================================================================

// Charger tous les animaux
CONFIG.animals.forEach(animalConfig => {
    loadModel(animalConfig, "./assets/models/animals/", scene, { isAnimal: true });
});

// Charger les éléments au sol (algues, coraux, anémones) avec placement aléatoire avec graine
loadGroundElements(scene);

// Charger les rochers
CONFIG.rocks.forEach(rockConfig => {
    loadSingleModel(rockConfig, "./assets/models/ground/ground/", scene);
});

// Sol avec texture de sable
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
// CONTRÔLE JOUR/NUIT
// ============================================================================

const timeSlider = document.getElementById('timeSlider');
const timeLabel = document.getElementById('timeLabel');

if (timeSlider && timeLabel) {
    timeSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);

        // Interpoler entre jour (0), coucher de soleil (50), et nuit (100)
        let lightColor, groundColor, intensity, label, clearColor;

        if (value <= 50) {
            // Jour → Coucher de soleil
            const t = value / 50; // 0 à 1

            // Couleur principale: blanc → orange
            lightColor = new BABYLON.Color3(
                1,
                1 - t * 0.3,  // 1 → 0.7
                1 - t * 0.6   // 1 → 0.4
            );

            // Couleur du sol: bleu clair → orange sombre
            groundColor = new BABYLON.Color3(
                0.5 + t * 0.4,  // 0.5 → 0.9
                0.7 - t * 0.2,  // 0.7 → 0.5
                1 - t * 0.7     // 1 → 0.3
            );

            intensity = 1 - t * 0.3; // 1 → 0.7
            label = value < 25 ? 'Jour' : 'Coucher de soleil';

            // Background ciel
            clearColor = new BABYLON.Color4(
                t * 0.1,
                t * 0.05,
                t * 0.05,
                1
            );
        } else {
            // Coucher de soleil → Nuit
            const t = (value - 50) / 50; // 0 à 1

            // Couleur principale: orange → bleu nuit
            lightColor = new BABYLON.Color3(
                1 - t * 0.8,    // 1 → 0.2
                0.7 - t * 0.5,  // 0.7 → 0.2
                0.4 + t * 0.4   // 0.4 → 0.8
            );

            // Couleur du sol: orange sombre → bleu très sombre
            groundColor = new BABYLON.Color3(
                0.9 - t * 0.7,  // 0.9 → 0.2
                0.5 - t * 0.3,  // 0.5 → 0.2
                0.3 + t * 0.2   // 0.3 → 0.5
            );

            intensity = 0.7 - t * 0.4; // 0.7 → 0.3
            label = 'Nuit';

            // Background nuit
            clearColor = new BABYLON.Color4(
                0.1 - t * 0.05,
                0.05 - t * 0.03,
                0.05 + t * 0.1,
                1
            );
        }

        // Appliquer les changements
        light.diffuse = lightColor;
        light.groundColor = groundColor;
        light.intensity = intensity;
        scene.clearColor = clearColor;
        timeLabel.textContent = label;
    });
}

// ============================================================================
// EFFET DE TRAINE DE BULLES (Interaction souris)
// ============================================================================

// Créer un système de particules pour les bulles
const bubbleSystem = new BABYLON.ParticleSystem("bubbles", 2000, scene);
bubbleSystem.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", scene);

// Émetteur initial (sera mis à jour)
const bubbleEmitter = BABYLON.MeshBuilder.CreateSphere("bubbleEmitter", { diameter: 0.1 }, scene);
bubbleEmitter.isVisible = false;
bubbleSystem.emitter = bubbleEmitter;

// Zone d'émission locale
bubbleSystem.minEmitBox = new BABYLON.Vector3(-0.2, -0.2, -0.2);
bubbleSystem.maxEmitBox = new BABYLON.Vector3(0.2, 0.2, 0.2);

// Apparence des bulles
bubbleSystem.color1 = new BABYLON.Color4(0.8, 0.95, 1, 1);
bubbleSystem.color2 = new BABYLON.Color4(0.6, 0.85, 1, 0.8);
bubbleSystem.colorDead = new BABYLON.Color4(0.5, 0.7, 1, 0);

// Taille des bulles (plus grandes)
bubbleSystem.minSize = 0.3;
bubbleSystem.maxSize = 0.8;

// Durée de vie
bubbleSystem.minLifeTime = 1.5;
bubbleSystem.maxLifeTime = 3;

// Vitesse d'émission (continue mais faible par défaut)
bubbleSystem.emitRate = 0;

// Direction des bulles (vers le haut avec variation)
bubbleSystem.direction1 = new BABYLON.Vector3(-0.5, 0.8, -0.5);
bubbleSystem.direction2 = new BABYLON.Vector3(0.5, 1.2, 0.5);

// Vitesse
bubbleSystem.minEmitPower = 1;
bubbleSystem.maxEmitPower = 2;

// Gravité légère vers le haut
bubbleSystem.gravity = new BABYLON.Vector3(0, 0.5, 0);

// Mode de fusion ADD pour masquer les carrés noirs et ne garder que le cercle blanc
bubbleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;

// Démarrer le système
bubbleSystem.start();

// Variables pour le suivi du curseur
let lastMouseTime = 0;

// Fonction pour convertir les coordonnées 2D de la souris en position 3D dans l'aquarium
canvas.addEventListener("mousemove", (event) => {
    const pickResult = scene.pick(event.clientX, event.clientY);

    if (pickResult.hit) {
        const worldPos = pickResult.pickedPoint;

        // Vérifier si on est dans les limites de l'aquarium
        const inBounds =
            Math.abs(worldPos.x) < CONFIG.aquarium.width / 2 &&
            Math.abs(worldPos.y) < CONFIG.aquarium.height / 2 &&
            Math.abs(worldPos.z) < CONFIG.aquarium.depth / 2;

        if (inBounds) {
            // Mettre à jour la position de l'émetteur
            bubbleEmitter.position.copyFrom(worldPos);

            // Activer l'émission de bulles
            const now = Date.now();
            if (now - lastMouseTime > 30) { // Limitation de fréquence
                bubbleSystem.emitRate = 100; // Activer
                lastMouseTime = now;
            }
        } else {
            // Désactiver hors de l'aquarium
            bubbleSystem.emitRate = 0;
        }
    }
});

// Désactiver les bulles quand la souris sort du canvas
canvas.addEventListener("mouseleave", () => {
    bubbleSystem.emitRate = 0;
});

// ============================================================================
// BOUCLE DE RENDU
// ============================================================================

engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());
canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
});

// ============================================================================
// MODE BIOLUMINESCENCE
// ============================================================================

// Liste des animaux pouvant être bioluminescents
const BIOLUMINESCENT_ANIMALS = [
    'fish.glb',
    'jellyfish.glb',
    'model_50a_-_hawksbill_sea_turtle.glb',
    'crab.glb',
    'seahorse.glb',
    'fish-nem.glb',
    'fishie.glb',
    'koi_fish.glb',
    'red_betta_fish.glb',
    'animal_crossing_new_horizons_octopus.glb',
    'fishoo.glb',
    'lowpoly_fish.glb',
    'octopus.glb',
    'pelagic_thresher_shark.glb',
    'stylized_crab.glb'
];

let isBioActive = false;
const bioMaterials = []; // Stocke les matériaux originaux pour restauration
const individualBioTypes = new Set(); // Stocke les types d'animaux avec bio individuelle activée

const bioBtn = document.getElementById('bioBtn');
if (bioBtn) {
    bioBtn.addEventListener('click', () => {
        isBioActive = !isBioActive;
        bioBtn.classList.toggle('active', isBioActive);

        if (isBioActive) {
            activateBioluminescence();
        } else {
            deactivateBioluminescence();
        }
    });
}

function activateBioluminescence() {
    // Parcourir tous les meshes de la scène
    scene.meshes.forEach(mesh => {
        // Vérifier si c'est un animal bioluminescent
        const animalType = getAnimalTypeFromMesh(mesh.name);
        const isBio = animalType !== null;

        // Ne pas activer si ce type a déjà la bio individuelle
        const hasIndividualBio = animalType && individualBioTypes.has(animalType);

        if (isBio && mesh.material && !hasIndividualBio) {
            // Sauvegarder le matériau original
            bioMaterials.push({
                mesh: mesh,
                originalMaterial: mesh.material.clone(),
                originalEmissive: mesh.material.emissiveColor ? mesh.material.emissiveColor.clone() : null
            });

            // Créer l'effet bioluminescent avec des couleurs selon le type
            if (mesh.name.includes('jellyfish')) {
                mesh.material.emissiveColor = new BABYLON.Color3(0.2, 0.8, 1); // Bleu cyan
            } else if (mesh.name.includes('octopus')) {
                mesh.material.emissiveColor = new BABYLON.Color3(0.8, 0.2, 1); // Violet/rose
            } else if (mesh.name.includes('fish.glb') || mesh.name.includes('fishie') || mesh.name.includes('fishoo') || mesh.name.includes('lowpoly_fish')) {
                mesh.material.emissiveColor = new BABYLON.Color3(0.3, 1, 0.5); // Vert lumineux
            } else if (mesh.name.includes('fish-nem')) {
                mesh.material.emissiveColor = new BABYLON.Color3(1, 0.5, 0); // Orange (poisson clown)
            } else if (mesh.name.includes('koi_fish')) {
                mesh.material.emissiveColor = new BABYLON.Color3(1, 0.8, 0.2); // Jaune/or
            } else if (mesh.name.includes('red_betta_fish')) {
                mesh.material.emissiveColor = new BABYLON.Color3(1, 0.1, 0.3); // Rouge vif
            } else if (mesh.name.includes('seahorse')) {
                mesh.material.emissiveColor = new BABYLON.Color3(1, 1, 0.4); // Jaune clair
            } else if (mesh.name.includes('turtle')) {
                mesh.material.emissiveColor = new BABYLON.Color3(0.4, 1, 0.8); // Turquoise
            } else if (mesh.name.includes('crab')) {
                mesh.material.emissiveColor = new BABYLON.Color3(1, 0.3, 0.1); // Orange-rouge
            } else if (mesh.name.includes('shark')) {
                mesh.material.emissiveColor = new BABYLON.Color3(0.5, 0.7, 1); // Bleu pâle
            } else {
                mesh.material.emissiveColor = new BABYLON.Color3(0.6, 0.9, 1); // Bleu par défaut
            }

            // Augmenter la luminosité
            mesh.material.emissiveIntensity = 0.8;

            // Créer une lumière ponctuelle pour chaque animal bioluminescent
            const glowLight = new BABYLON.PointLight(
                `bioLight_${mesh.name}`,
                mesh.position.clone(),
                scene
            );
            glowLight.intensity = 2;
            glowLight.range = 8;
            glowLight.diffuse = mesh.material.emissiveColor.clone();

            // Attacher la lumière au mesh pour qu'elle suive
            glowLight.parent = mesh;

            // Stocker la lumière pour pouvoir la supprimer plus tard
            mesh.metadata = mesh.metadata || {};
            mesh.metadata.bioLight = glowLight;
        }
    });

    console.log("Mode bioluminescence activé");
}

function deactivateBioluminescence() {
    // Restaurer les matériaux originaux
    bioMaterials.forEach(({ mesh, originalMaterial, originalEmissive }) => {
        // Ne pas désactiver si ce type a la bio individuelle
        const animalType = getAnimalTypeFromMesh(mesh.name);
        const hasIndividualBio = animalType && individualBioTypes.has(animalType);

        if (!hasIndividualBio) {
            if (mesh.material) {
                mesh.material.emissiveColor = originalEmissive || new BABYLON.Color3(0, 0, 0);
                mesh.material.emissiveIntensity = 0;
            }

            // Supprimer la lumière ponctuelle
            if (mesh.metadata && mesh.metadata.bioLight) {
                mesh.metadata.bioLight.dispose();
                delete mesh.metadata.bioLight;
            }
        }
    });

    // Vider le tableau (garder seulement ceux en mode individuel)
    bioMaterials.length = 0;

    console.log("🌑 Mode bioluminescence désactivé");
}

/**
 * Active/désactive la bioluminescence pour un type d'animal spécifique
 */
function toggleIndividualBioluminescence(animalType) {
    // Vérifier si ce type est bioluminescent
    const isBioType = BIOLUMINESCENT_ANIMALS.includes(animalType);
    if (!isBioType) {
        console.log(`${animalType} n'est pas un animal bioluminescent`);
        return;
    }

    const baseFileName = animalType.replace('.glb', '');
    const isActive = individualBioTypes.has(animalType);

    if (isActive) {
        // Désactiver la bioluminescence pour ce type
        individualBioTypes.delete(animalType);

        scene.meshes.forEach(mesh => {
            if (meshBelongsToAnimalType(mesh.name, animalType)) {
                if (mesh.material) {
                    mesh.material.emissiveColor = new BABYLON.Color3(0, 0, 0);
                    mesh.material.emissiveIntensity = 0;
                }

                if (mesh.metadata && mesh.metadata.bioLight) {
                    mesh.metadata.bioLight.dispose();
                    delete mesh.metadata.bioLight;
                }
            }
        });

        console.log(`🌑 Bioluminescence désactivée pour ${animalType}`);
    } else {
        // Activer la bioluminescence pour ce type
        individualBioTypes.add(animalType);

        scene.meshes.forEach(mesh => {
            if (meshBelongsToAnimalType(mesh.name, animalType) && mesh.material) {
                // Créer l'effet bioluminescent avec des couleurs selon le type
                if (mesh.name.includes('jellyfish')) {
                    mesh.material.emissiveColor = new BABYLON.Color3(0.2, 0.8, 1); // Bleu cyan
                } else if (mesh.name.includes('octopus')) {
                    mesh.material.emissiveColor = new BABYLON.Color3(0.8, 0.2, 1); // Violet/rose
                } else if (mesh.name.includes('fish.glb') || mesh.name.includes('fishie') || mesh.name.includes('fishoo') || mesh.name.includes('lowpoly_fish')) {
                    mesh.material.emissiveColor = new BABYLON.Color3(0.3, 1, 0.5); // Vert lumineux
                } else if (mesh.name.includes('fish-nem')) {
                    mesh.material.emissiveColor = new BABYLON.Color3(1, 0.5, 0); // Orange (poisson clown)
                } else if (mesh.name.includes('koi_fish')) {
                    mesh.material.emissiveColor = new BABYLON.Color3(1, 0.8, 0.2); // Jaune/or
                } else if (mesh.name.includes('red_betta_fish')) {
                    mesh.material.emissiveColor = new BABYLON.Color3(1, 0.1, 0.3); // Rouge vif
                } else if (mesh.name.includes('seahorse')) {
                    mesh.material.emissiveColor = new BABYLON.Color3(1, 1, 0.4); // Jaune clair
                } else if (mesh.name.includes('turtle')) {
                    mesh.material.emissiveColor = new BABYLON.Color3(0.4, 1, 0.8); // Turquoise
                } else if (mesh.name.includes('crab')) {
                    mesh.material.emissiveColor = new BABYLON.Color3(1, 0.3, 0.1); // Orange-rouge
                } else if (mesh.name.includes('shark')) {
                    mesh.material.emissiveColor = new BABYLON.Color3(0.5, 0.7, 1); // Bleu pâle
                } else {
                    mesh.material.emissiveColor = new BABYLON.Color3(0.6, 0.9, 1); // Bleu par défaut
                }

                mesh.material.emissiveIntensity = 0.8;

                // Créer une lumière ponctuelle
                const glowLight = new BABYLON.PointLight(
                    `bioLight_${mesh.name}`,
                    mesh.position.clone(),
                    scene
                );
                glowLight.intensity = 2;
                glowLight.range = 8;
                glowLight.diffuse = mesh.material.emissiveColor.clone();
                glowLight.parent = mesh;

                mesh.metadata = mesh.metadata || {};
                mesh.metadata.bioLight = glowLight;
            }
        });

        console.log(`Bioluminescence activée pour ${animalType}`);
    }
}

/**
 * Détermine le type d'animal à partir du nom du mesh
 * Cherche d'abord les noms les plus longs pour éviter les faux positifs
 */
function getAnimalTypeFromMesh(meshName) {
    // Trier par longueur décroissante pour matcher d'abord les noms les plus spécifiques
    const sortedAnimals = [...BIOLUMINESCENT_ANIMALS].sort((a, b) => b.length - a.length);

    for (const bioAnimal of sortedAnimals) {
        const baseName = bioAnimal.replace('.glb', '');
        // Vérifier si le nom du mesh correspond exactement au pattern de clone
        if (meshName.startsWith(bioAnimal + '_clone_') ||
            meshName.includes('/' + bioAnimal + '_clone_')) {
            return bioAnimal;
        }
    }
    return null;
}

/**
 * Vérifie si un mesh appartient à un type d'animal spécifique
 * Utilise un matching précis pour éviter les faux positifs
 */
function meshBelongsToAnimalType(meshName, animalType) {
    // Le nom d'un mesh clone suit le format: "fichier.glb_clone_N" ou "fichier.glb_clone_N.sous_mesh"
    // On vérifie que le nom commence par le fichier exact
    return meshName.startsWith(animalType + '_clone_') ||
           meshName.includes('/' + animalType + '_clone_');
}

// ============================================================================
