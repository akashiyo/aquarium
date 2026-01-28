import { createHotspot } from "./point.js";
import { animalInfo } from "./animalInfo.js";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

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
    new BABYLON.Vector3(0, 1, 0),
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

function createFishesFromTemplate(template, count, scale) {
    for (let i = 0; i < count; i++) {
        const fish = template.clone(`${template.name}_${i}`);
        fish.setEnabled(true);

        fish.scaling.scaleInPlace(scale);

        fish.position = new BABYLON.Vector3(
            BABYLON.Scalar.RandomRange(-20, 20),
            BABYLON.Scalar.RandomRange(-12, 12),
            BABYLON.Scalar.RandomRange(-20, 20)
        );

        fish.rotation.y = Math.random() * Math.PI * 2;

        fish.metadata = {
            speed: BABYLON.Scalar.RandomRange(0.005, 0.02),
            turn: Math.random() > 0.5 ? 1 : -1
        };
    }
}

// Fishs
const fishFiles = [
    { file: "fish.glb", count: 1, scale: 0.01 },
    { file: "jellyfish.glb", count: 1, scale: 0.0010},
    { file: "turtle.glb", count: 1, scale: 15 },
    { file: "crab.glb", count: 1, scale: 2 },
    { file: "seahorse.glb", count: 1, scale: 0.35 },
    { file: "fish-nem.glb", count: 1, scale: 3.5 },
    { file: "fishie.glb", count: 1, scale: 0.80 },
    { file: "koi_fish.glb", count: 1, scale: 0.90 },
    { file: "red_betta_fish.glb", count: 1, scale: 0.01 }
];

const fishTemplates = {};

fishFiles.forEach((animal, index) => {
    const hotspotNumber = index + 1; // correspondra au div #hotspot-1, #hotspot-2, etc.

    BABYLON.SceneLoader.ImportMesh(
        "",
        "./assets/models/",
        animal.file,
        scene,
        (meshes) => {
            const template = meshes[0];
            template.setEnabled(false); // template pour cloner

            // Clone unique (ou plusieurs si tu veux count>1)
            const clone = template.clone(`${template.name}_0`);
            clone.setEnabled(true);
            clone.scaling.scaleInPlace(animal.scale);

            clone.position = new BABYLON.Vector3(
                BABYLON.Scalar.RandomRange(-20, 20),
                BABYLON.Scalar.RandomRange(-12, 12),
                BABYLON.Scalar.RandomRange(-20, 20)
            );
            clone.rotation.y = Math.random() * Math.PI * 2;

            clone.metadata = {
                speed: BABYLON.Scalar.RandomRange(0.005, 0.02),
                turn: Math.random() > 0.5 ? 1 : -1
            };

            // 🔵 Crée le hotspot pour ce clone
            createHotspot(scene, camera, engine, clone, hotspotNumber, animal.title, animal.text);
        }
    );
});

BABYLON.SceneLoader.ImportMesh(
    "",
    "./assets/models/ground/",
    "lyme_bay.glb",
    scene,
    (meshes) => {
        const groundTemplate = meshes.find(m => m.getTotalVertices() > 0);
        if (!groundTemplate) return;

        const ground = groundTemplate.clone("aquariumGround");
        ground.setEnabled(true);

        ground.scaling.scaleInPlace(0.1);

        // Bounding box du mesh après scaling
        const bbox = ground.getBoundingInfo().boundingBox;
        const height = bbox.maximum.y - bbox.minimum.y;

        // Calcul du bas de l'aquarium
        const aquariumBottomY = aquarium.position.y - (aquarium.scaling.y * 0.5);

        // Positionner le sol au bas de l'aquarium
        ground.position = new BABYLON.Vector3(
            aquarium.position.x,  // Centré X
            aquariumBottomY + height * 0.1,
            aquarium.position.z
        );
    }
);


engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());
