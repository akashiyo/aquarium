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

fishFiles.forEach((animal) => {

    const info = animalInfo[animal.file];
    if (!info) return; // sécurité si pas d'info définie

    BABYLON.SceneLoader.ImportMesh(
        "",
        "./assets/models/",
        animal.file,
        scene,
        (meshes) => {

            const template = meshes[0];
            template.setEnabled(false);

            const clone = template.clone(`${animal.file}_clone`);
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

            // Lie les infos contenu dans animalInfo.js
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

        // Désactiver le template original
        groundTemplate.setEnabled(false);

        const ground = groundTemplate.clone("aquariumGround");
        ground.setEnabled(true);

        // ground.scaling.scaleInPlace(0.1);

        // Hauteur de l'aquarium (définie dans CreateBox)
        const aquariumHeight = 50;

        // Calcul du bas de l'aquarium (centré à l'origine, donc bas = -hauteur/2)
        const aquariumBottomY = aquarium.position.y - (aquariumHeight / 2);

        // Bounding box du mesh pour ajuster la position verticale
        const bbox = ground.getBoundingInfo().boundingBox;
        const groundMinY = bbox.minimum.y;

        // Positionner le sol au bas de l'aquarium
        ground.position = new BABYLON.Vector3(
            aquarium.position.x,
            aquariumBottomY - groundMinY,  // Aligne le bas du mesh avec le bas de l'aquarium
            aquarium.position.z
        );
    }
);


engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());
