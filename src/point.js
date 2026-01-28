export function createHotspot(scene, camera, engine, targetMesh, number, title, text) {
    if (!targetMesh) return;

    // 🔵 Ancre 3D invisible sur le mesh
    const hotspotAnchor = new BABYLON.TransformNode("hotspotAnchor", scene);
    hotspotAnchor.position = targetMesh.getBoundingInfo().boundingBox.centerWorld;

    // 🔵 Élément HTML correspondant
    const hotspotEl = document.getElementById(`hotspot-${number}`);
    hotspotEl.innerText = number;

    // Positionner le hotspot chaque frame
    scene.onBeforeRenderObservable.add(() => {
        const pos = BABYLON.Vector3.Project(
            hotspotAnchor.getAbsolutePosition(),
            BABYLON.Matrix.Identity(),
            scene.getTransformMatrix(),
            camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight())
        );
        hotspotEl.style.left = pos.x + "px";
        hotspotEl.style.top = pos.y + "px";
        hotspotEl.style.display = pos.z < 0 ? "none" : "flex";
    });

    // Au clic : zoom + infos
    hotspotEl.addEventListener("click", () => {
        focusCameraOnHotspot(camera, scene, document.getElementById("renderCanvas"), hotspotAnchor);
        document.getElementById("infoTitle").innerText = `${number}. ${title}`;
        document.getElementById("infoText").innerText = text;
        document.getElementById("infoBox").classList.remove("hidden");
    });
}

// 🔑 Une seule fonction qui gère tout
function focusCameraOnHotspot(camera, scene, canvas, target) {
    const targetPos = target.getAbsolutePosition().clone(); // <-- toujours un Vector3

    camera.detachControl(canvas);

    const camPos = camera.position.clone();
    const direction = targetPos.subtract(camPos).normalize();

    const alpha = Math.atan2(direction.z, direction.x) + Math.PI / 2;
    const beta = Math.acos(direction.y);
    const targetRadius = 2.2; // zoom final

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
        { frame: 60, value: alpha }
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
        { frame: 60, value: beta }
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
