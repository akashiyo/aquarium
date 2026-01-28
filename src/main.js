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
    { file: "seahorse.glb", count: 1, scale: 0.35 }
];

const fishTemplates = {};

fishFiles.forEach(fish => {
    BABYLON.SceneLoader.ImportMesh(
        "",
        "./assets/models/",
        fish.file,
        scene,
        (meshes) => {
            const template = meshes[0];
            template.setEnabled(false);

            fishTemplates[fish.file] = template;

            createFishesFromTemplate(template, fish.count, fish.scale);
        }
    );
});

engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());
