import { createHotspot } from "./point.js";
import { animalInfo } from "./animalInfo.js";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

scene.clearColor = new BABYLON.Color4(1, 1, 1, 1);

// Camera
const camera = new BABYLON.ArcRotateCamera(
    "camera",
    0, 1, 10,
    BABYLON.Vector3.Zero(),
    scene
);
camera.attachControl(canvas, true);

// Light
new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(5, 1, 0),
    scene
);

// Aquarium rectangle
const aquarium = BABYLON.MeshBuilder.CreateBox(
    "aquarium",
    { width: 50, height: 50, depth: 50},
    scene
);

const glassMat = new BABYLON.StandardMaterial("glass", scene);
glassMat.alpha = 0.3;
glassMat.diffuseColor = new BABYLON.Color3(0.2, 0.6, 0.8);
aquarium.material = glassMat;

// Fishs
const fishFiles = [
    { file: "fish.glb", count: 3, scale: 0.01, x: 1, y: 2, z: 5},
    { file: "jellyfish.glb", count: 4, scale: [0.0010, 0.0015, 0.0020], x: 3, y: 6, z: 12 },
    { file: "turtle.glb", count: 1, scale: 15, x: 10, y: 11, z: 11 },
    { file: "crab.glb", count: 10, scale: [2,3], y: -23, x: 15, z: 9 },
    { file: "seahorse.glb", count: 10, scale: 0.35, x: 10, y: 16, z: 8 },
    { file: "fish-nem.glb", count: 10, scale: 3.5, x: 13, y: 13, z: 13 },
    { file: "fishie.glb", count: 6, scale: 0.80, x: 12, y: 12, z: 12 },
    { file: "koi_fish.glb", count: 5, scale: 0.90, x: 5, y: 5, z: 5 },
    { file: "red_betta_fish.glb", count: 7, scale: 0.01, x: 8, y: 8, z: 8 },

    { file: "animal_crossing_new_horizons_koi.glb", count: 2, scale: 0.01, x: 22, y: 2, z: 17 },
    { file: "animal_crossing_new_horizons_octopus.glb", count: 1, scale: 1, y: -24 },
    { file: "fishoo.glb", count: 2, scale: 1, x: 10, y: 16, z: 13 },
    { file: "lowpoly_fish.glb", count: 2, scale: 1, x: -10, y: -10, z: 5},
    { file: "octopus.glb", count: 1, scale: 1,x: -1, y: -2, z: -5 },
    { file: "pelagic_thresher_shark.glb", count: 1, scale: 0.05, y: 15, x: -9, z: -12 },
    { file: "stylized_crab.glb", count: 2, scale: 1, x: 1, y: 2, z: 5 }
];

fishFiles.forEach((animal) => {

    const info = animalInfo[animal.file];
    if (!info) return;

    BABYLON.SceneLoader.ImportMesh(
        "",
        "./assets/models/animals/",
        animal.file,
        scene,
        (meshes) => {

            const template = meshes[0];
            template.setEnabled(false);

            // Position de base du groupe (utilise les valeurs définies ou aléatoire)
            const groupBaseX = animal.x; // !== undefined ? animal.x : BABYLON.Scalar.RandomRange(-15, 15);
            const groupBaseY = animal.y; // !== undefined ? animal.y : BABYLON.Scalar.RandomRange(-10, 10);
            const groupBaseZ = animal.z; //!== undefined ? animal.z : BABYLON.Scalar.RandomRange(-20, 15);

            // Espacement entre les clones du groupe
            const spacing = 3;

            // Créer autant de clones que demandé par count
            for (let i = 0; i < animal.count; i++) {
                const clone = template.clone(`${animal.file}_clone_${i}`);
                clone.setEnabled(true);

                // Scale : si tableau, prend une valeur aléatoire parmi les options
                const scaleValue = Array.isArray(animal.scale) 
                    ? animal.scale[Math.floor(Math.random() * animal.scale.length)]
                    : animal.scale;
                clone.scaling.scaleInPlace(scaleValue);

                // Position avec décalage autour du centre du groupe
                clone.position = new BABYLON.Vector3(
                    groupBaseX + (i % 2) * spacing - spacing / 2 + BABYLON.Scalar.RandomRange(-1, 1),
                    groupBaseY + BABYLON.Scalar.RandomRange(-2, 2),
                    groupBaseZ + Math.floor(i / 2) * spacing - spacing / 2 + BABYLON.Scalar.RandomRange(-1, 1)
                );

                clone.rotation.y = Math.random() * Math.PI * 2;

                clone.metadata = {
                    speed: BABYLON.Scalar.RandomRange(0.005, 0.02),
                    turn: Math.random() > 0.5 ? 1 : -1
                };

                // Hotspot seulement pour le premier clone
                if (i === 0) {
                    createHotspot(
                        scene,
                        camera,
                        engine,
                        clone,
                        info.number,
                        info.title,
                        info.text
                    );
                }
            }
        }
    );
});

// Sol avec texture de sable (box pour avoir de l'épaisseur haha)
const ground = BABYLON.MeshBuilder.CreateBox(
    "ground",
    { width: 50, height: 3, depth: 50 },
    scene
);

const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
groundMat.diffuseTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/sand.jpg", scene);
groundMat.diffuseTexture.uScale = 5;
groundMat.diffuseTexture.vScale = 5;
ground.material = groundMat;

// Positionner au bas de l'aquarium (le haut du box à Y = -25)
ground.position.y = -25 - 1.5;
// Algues dans les 4 coins du sol
const algaeFiles = [
    { file: "alga.glb", corner: { x: -20, z: -20 }, scale: 2, y: -25, count: 30, spacing:   3 },
    { file: "alga.glb", corner: { x: 20, z: -20 }, scale: 2, y: -25, count: 30, spacing: 3 },
    { file: "alga.glb", corner: { x: -10, z: 10 }, scale: 2, y: -25, count: 10, spacing: 3 },
    { file: "alga.glb", corner: { x: 10, z: -10 }, scale: 2, y: -25, count: 10, spacing: 3 },
    { file: "algue_rouge_actuelle.glb", corner: { x: 20, z: 20 }, scale: 2, y: -25, count: 1, spacing: 3 }
];

algaeFiles.forEach((algae) => {
    BABYLON.SceneLoader.ImportMesh(
        "",
        "./assets/models/ground/",
        algae.file,
        scene,
        (meshes) => {
            const template = meshes[0];
            template.setEnabled(false);

            const count = algae.count || 1;
            const spacing = algae.spacing || 3;

            for (let i = 0; i < count; i++) {
                const clone = template.clone(`${algae.file}_clone_${i}`);
                clone.setEnabled(true);

                clone.scaling = new BABYLON.Vector3(algae.scale, algae.scale, algae.scale);

                // Position en grille autour du coin
                const offsetX = (i % 2) * spacing - spacing / 2;
                const offsetZ = Math.floor(i / 2) * spacing - spacing / 2;

                clone.position = new BABYLON.Vector3(
                    algae.corner.x + offsetX,
                    algae.y,
                    algae.corner.z + offsetZ
                );

                clone.rotation.y = Math.random() * Math.PI * 2;
            }
        }
    );
});

// roche 
BABYLON.SceneLoader.ImportMesh(
    "",
    "./assets/models/ground/",
    "lyme_bay.glb",
    scene,
    (meshes) => {
        meshes[0].scaling = new BABYLON.Vector3(0.8, 0.8, 0.8);
        meshes[0].position.y = -24.5;
    }
);

engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());
