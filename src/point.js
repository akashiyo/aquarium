import { setCurrentHotspot } from "./animation.js";
import { animalInfo } from "./animalInfo.js";

export function createHotspot(scene, camera, advancedTexture, targetMesh, number, title, text, fileName) {
    // Créer un point d'ancrage indépendant pour le hotspot
    const anchor = new BABYLON.TransformNode(`hotspot-anchor-${number}`, scene);

    // Fonction pour calculer le centre de tous les meshes enfants
    const updateAnchorPosition = () => {
        const childMeshes = targetMesh.getChildMeshes();

        // Calculer le centre de tous les enfants
        let min = new BABYLON.Vector3(Infinity, Infinity, Infinity);
        let max = new BABYLON.Vector3(-Infinity, -Infinity, -Infinity);

        childMeshes.forEach(mesh => {
            mesh.computeWorldMatrix(true);
            const boundingInfo = mesh.getBoundingInfo();
            const bbMin = boundingInfo.boundingBox.minimumWorld;
            const bbMax = boundingInfo.boundingBox.maximumWorld;

            min = BABYLON.Vector3.Minimize(min, bbMin);
            max = BABYLON.Vector3.Maximize(max, bbMax);
        });

        anchor.position.copyFrom(min.add(max).scale(0.5));
    };

    // Position initiale
    updateAnchorPosition();

    // Mettre à jour la position à chaque frame pour suivre le mesh
    scene.onBeforeRenderObservable.add(updateAnchorPosition);

    // Créer un conteneur pour le hotspot
    const container = new BABYLON.GUI.Ellipse(`hotspot-${number}`);
    container.width = "32px";
    container.height = "32px";
    container.color = "white";
    container.thickness = 2;
    container.background = "white";

    // Ajouter le numéro au centre
    const textBlock = new BABYLON.GUI.TextBlock(`hotspot-text-${number}`, number.toString());
    textBlock.color = "black";
    textBlock.fontSize = "16px";
    textBlock.fontWeight = "bold";
    container.addControl(textBlock);

    // Ajouter au GUI AVANT de lier au mesh
    advancedTexture.addControl(container);

    // Maintenant lier le hotspot à l'ancre pour qu'il suive automatiquement
    container.linkWithMesh(anchor);
    container.linkOffsetY = -50; // Offset au-dessus du mesh

    // Gestion du clic
    container.onPointerClickObservable.add(() => {
        focusCameraOnHotspot(camera, scene, targetMesh);

        // Stocker les données du hotspot pour le module animation
        setCurrentHotspot({
            scene: scene,
            targetMesh: targetMesh,
            number: number,
            title: title
        });

        // Afficher l'info box (garder HTML pour cela)
        document.getElementById("infoTitle").innerText = `${number}. ${title}`;
        document.getElementById("infoText").innerHTML = text;

        // Afficher ou masquer le bouton Animation selon hasAnimation
        const btnAnimation = document.getElementById("btnAnimation");
        const info = animalInfo[fileName];
        if (btnAnimation) {
            if (info && info.hasAnimation) {
                btnAnimation.style.display = "block";
            } else {
                btnAnimation.style.display = "none";
            }
        }

        document.getElementById("infoBox").classList.remove("hidden");
    });

    // Effet hover optionnel
    container.onPointerEnterObservable.add(() => {
        container.scaleX = 1.2;
        container.scaleY = 1.2;
    });

    container.onPointerOutObservable.add(() => {
        container.scaleX = 1;
        container.scaleY = 1;
    });

    return container;
}



function focusCameraOnHotspot(camera, scene, targetMesh) {
    // Utiliser getHierarchyBoundingVectors pour inclure tous les meshes enfants
    const bounds = targetMesh.getHierarchyBoundingVectors(true);
    const targetPos = bounds.min.add(bounds.max).scale(0.5);

    const canvas = document.getElementById("renderCanvas");
    camera.detachControl(canvas);

    // Calculer la taille du mesh pour ajuster le radius dynamiquement
    const meshSize = bounds.max.subtract(bounds.min);
    const maxDimension = Math.max(meshSize.x, meshSize.y, meshSize.z);
    const targetRadius = Math.max(maxDimension * 3, 5); // Distance minimum de 2.5

    // Angles de vue optimaux pour regarder le mesh de face
    const targetAlpha = Math.PI / 4; // 45° - positionné devant à droite
    const targetBeta = Math.PI / 3;  // 60° - vue légèrement élevée

    const animTarget = new BABYLON.Animation(
        "animTarget",
        "target",
        60,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    animTarget.setKeys([
        { frame: 0, value: camera.target.clone() },
        { frame: 60, value: targetPos }
    ]);

    const animAlpha = new BABYLON.Animation(
        "animAlpha",
        "alpha",
        60,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    animAlpha.setKeys([
        { frame: 0, value: camera.alpha },
        { frame: 60, value: targetAlpha }
    ]);

    const animBeta = new BABYLON.Animation(
        "animBeta",
        "beta",
        60,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    animBeta.setKeys([
        { frame: 0, value: camera.beta },
        { frame: 60, value: targetBeta }
    ]);

    const animRadius = new BABYLON.Animation(
        "animRadius",
        "radius",
        60,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    animRadius.setKeys([
        { frame: 0, value: camera.radius },
        { frame: 60, value: targetRadius }
    ]);

    camera.animations = [animTarget, animAlpha, animBeta, animRadius];

    scene.beginAnimation(camera, 0, 60, false, 1, () => {
        camera.attachControl(canvas, true);
    });
}
