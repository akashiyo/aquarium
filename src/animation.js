// ============================================================================
// ANIMATION MODULE - Gère les animations des hotspots
// Les fonctions d'animation de mesh spécifiques du fichier a été corrigé par l'IA pour débugger (sans trop de succès) les animations, notamment au niveaux cu calcul des coordonnées
// ============================================================================

// Stockage des informations sur le hotspot actuellement sélectionné
let currentHotspotData = null;

// Liste des animaux exclus de l'animation en cercle
// (tortue, crabe, requin, pieuvres/calamars)
const EXCLUDED_FROM_CIRCLE_ANIMATION = [
    "turtle.glb",
    "crab.glb",
    "stylized_crab.glb",
    "pelagic_thresher_shark.glb",
    "octopus.glb",
    "animal_crossing_new_horizons_octopus.glb"
];

/**
 * Enregistre les données du hotspot sélectionné
 */
export function setCurrentHotspot(data) {
    currentHotspotData = data;
}

/**
 * Récupère les données du hotspot actuel
 */
export function getCurrentHotspot() {
    return currentHotspotData;
}

/**
 * Trouve tous les clones RACINES d'un même modèle à partir du mesh cible
 * Ne retourne que les clones principaux (ex: fish.glb_clone_0, fish.glb_clone_1)
 * et pas les sous-meshes (ex: fish.glb_clone_0.Sketchfab_model...)
 */
export function findAllClones(scene, targetMesh) {
    // Extraire le nom de base du fichier depuis le nom du mesh
    // Format attendu: "fish.glb_clone_0" -> "fish.glb"
    let meshName = targetMesh.name;

    // Si le targetMesh est un sous-mesh, extraire le nom du clone racine
    const subMeshMatch = meshName.match(/^(.+\.glb_clone_\d+)\./);
    if (subMeshMatch) {
        meshName = subMeshMatch[1];
    }

    const match = meshName.match(/^(.+\.glb)_clone_\d+$/);

    if (!match) {
        // Si ce n'est pas un clone, retourner juste le mesh cible
        return [targetMesh];
    }

    const baseFileName = match[1];

    // Trouver uniquement les clones racines (ceux qui matchent exactement le pattern)
    // Utilise une regex pour s'assurer que le nom se termine par _clone_N
    const clonePattern = new RegExp(`^${baseFileName.replace('.', '\\.')}_clone_\\d+$`);

    return scene.meshes.filter(m =>
        clonePattern.test(m.name) && m.isEnabled()
    );
}

/**
 * Trouve les AnimationGroups associés à un modèle
 */
export function findAnimationGroups(scene, targetMesh) {
    const meshName = targetMesh.name;
    const match = meshName.match(/^(.+\.glb)_clone_\d+$/);

    if (!match) return [];

    const baseFileName = match[1].replace('.glb', '');

    // Les AnimationGroups de GLB ont souvent un nom lié au modèle
    // On cherche ceux qui ciblent des meshes avec le même préfixe
    return scene.animationGroups.filter(ag => {
        // Vérifier si l'AnimationGroup cible des meshes de ce modèle
        return ag.targetedAnimations.some(ta => {
            const target = ta.target;
            if (target && target.name) {
                return target.name.includes(baseFileName) ||
                       (target.parent && target.parent.name && target.parent.name.includes(baseFileName));
            }
            return false;
        });
    });
}

/**
 * Animation de mouvement en cercle pour tous les clones
 * Approche simple : on anime le mesh racine, les enfants suivent automatiquement
 */
export function animateCircleMovement(scene, clones, duration = 2000) {
    const frameRate = 60;
    const totalFrames = (duration / 1000) * frameRate;
    const radius = 2; // Petit rayon pour rester dans l'aquarium

    // Limites de l'aquarium (50x50x50 centré à 0,0,0)
    const BOUNDS = {
        minX: -22, maxX: 22,
        minZ: -22, maxZ: 22
    };

    clones.forEach((clone) => {
        // Position de départ
        const startX = clone.position.x;
        const startY = clone.position.y;
        const startZ = clone.position.z;

        // Ajuster le rayon si proche des bords
        let safeRadius = radius;
        if (startX + radius > BOUNDS.maxX || startX - radius < BOUNDS.minX) {
            safeRadius = Math.min(safeRadius, Math.min(BOUNDS.maxX - startX, startX - BOUNDS.minX));
        }
        if (startZ + radius > BOUNDS.maxZ || startZ - radius < BOUNDS.minZ) {
            safeRadius = Math.min(safeRadius, Math.min(BOUNDS.maxZ - startZ, startZ - BOUNDS.minZ));
        }
        safeRadius = Math.max(0.5, safeRadius);

        // Créer l'animation de position X
        const animX = new BABYLON.Animation(
            `animX_${clone.name}`,
            "position.x",
            frameRate,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        // Créer l'animation de position Z
        const animZ = new BABYLON.Animation(
            `animZ_${clone.name}`,
            "position.z",
            frameRate,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        // Définir les keyframes (mouvement circulaire lisse)
        const keysX = [];
        const keysZ = [];
        const steps = 32;

        for (let i = 0; i <= steps; i++) {
            const frame = (i / steps) * totalFrames;
            const angle = (i / steps) * Math.PI * 2;

            keysX.push({
                frame: frame,
                value: startX + Math.sin(angle) * safeRadius
            });

            keysZ.push({
                frame: frame,
                value: startZ + (Math.cos(angle) - 1) * safeRadius
            });
        }

        // S'assurer du retour exact à la position de départ
        keysX[keysX.length - 1].value = startX;
        keysZ[keysZ.length - 1].value = startZ;

        animX.setKeys(keysX);
        animZ.setKeys(keysZ);

        // Attacher les animations au mesh racine (comme dans la doc)
        clone.animations = clone.animations || [];
        clone.animations.push(animX);
        clone.animations.push(animZ);

        // Lancer l'animation
        scene.beginAnimation(clone, 0, totalFrames, false, 1, () => {
            // Callback à la fin pour garantir le retour à la position exacte
            clone.position.x = startX;
            clone.position.y = startY;
            clone.position.z = startZ;
        });
    });
}

/**
 * Joue les animations natives du modèle
 */
export function playNativeAnimations(animationGroups, duration = 2000) {
    if (animationGroups.length === 0) {
        console.log("Aucune animation native trouvée pour ce modèle");
        return false;
    }

    animationGroups.forEach(ag => {
        // Arrêter l'animation si elle est en cours
        ag.stop();
        // Réinitialiser au début
        ag.reset();
        // Jouer une fois
        ag.play(false);

        console.log(`🎬 Animation native jouée: ${ag.name}`);
    });

    return true;
}

/**
 * Vérifie si un mesh est exclu de l'animation en cercle
 */
function isExcludedFromCircleAnimation(meshName) {
    return EXCLUDED_FROM_CIRCLE_ANIMATION.some(excluded =>
        meshName.startsWith(excluded.replace('.glb', '')) ||
        meshName.includes(excluded)
    );
}

/**
 * Animation automatique de la tortue : fait le tour du cube de l'aquarium
 * en suivant les bords tout en gardant la même distance des parois
 */
export function animateTurtleLoop(scene, turtleMesh) {
    // Position initiale: x: -15, y: 5, z: -10
    // L'aquarium fait 50x50x50, centré à (0,0,0), donc les limites vont de -25 à +25

    // DEBUG: Afficher les infos du mesh
    console.log("🔍 Informations du mesh de la tortue:");
    console.log("  - Nom:", turtleMesh.name);
    console.log("  - Position:", turtleMesh.position);
    console.log("  - Rotation:", turtleMesh.rotation);
    console.log("  - Scaling:", turtleMesh.scaling);
    console.log("  - Nombre d'enfants:", turtleMesh.getChildMeshes().length);

    const childMeshes = turtleMesh.getChildMeshes();
    console.log("  - Meshes enfants:");
    childMeshes.forEach((child, index) => {
        console.log(`    [${index}] ${child.name}`);
        console.log(`        Position: x=${child.position.x.toFixed(2)}, y=${child.position.y.toFixed(2)}, z=${child.position.z.toFixed(2)}`);
        console.log(`        Rotation: x=${child.rotation.x.toFixed(2)}, y=${child.rotation.y.toFixed(2)}, z=${child.rotation.z.toFixed(2)}`);
        console.log(`        Scaling: x=${child.scaling.x.toFixed(2)}, y=${child.scaling.y.toFixed(2)}, z=${child.scaling.z.toFixed(2)}`);
    });

    const Y = 5; // Hauteur constante

    // Définir les points du parcours (rectangle suivant les bords du cube)
    // On commence par aller vers l'arrière (Z négatif) puis on fait le tour
    const points = [
        new BABYLON.Vector3(-15, Y, -10),  // Point de départ (arrière-gauche)
        new BABYLON.Vector3(-15, Y, -15),  // Arrière-gauche (recule vers l'arrière)
        new BABYLON.Vector3(15, Y, -15),   // Arrière-droite (avance en X)
        new BABYLON.Vector3(15, Y, 15),    // Avant-droite (avance en Z)
        new BABYLON.Vector3(-15, Y, 15),   // Avant-gauche (recule en X)
        new BABYLON.Vector3(-15, Y, -10)   // Retour au point de départ
    ];

    const frameRate = 60;
    const duration = 60; // 60 secondes pour faire le tour complet
    const totalFrames = duration * frameRate;

    // Animation de position (seulement pour le mesh parent)
    const animPosition = new BABYLON.Animation(
        "turtlePathAnimation",
        "position",
        frameRate,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    const positionKeys = [];
    const framesPerSegment = totalFrames / (points.length - 1);

    for (let i = 0; i < points.length; i++) {
        const frame = i * framesPerSegment;
        positionKeys.push({
            frame: frame,
            value: points[i]
        });
    }

    animPosition.setKeys(positionKeys);

    // Appliquer un easing pour des mouvements plus fluides
    const easingFunction = new BABYLON.SineEase();
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    animPosition.setEasingFunction(easingFunction);

    // Attacher l'animation de position au mesh principal
    turtleMesh.animations = turtleMesh.animations || [];
    turtleMesh.animations.push(animPosition);

    // Sauvegarder la rotation initiale pour la préserver
    const initialRotationX = turtleMesh.rotation.x;
    const initialRotationY = turtleMesh.rotation.y;
    const initialRotationZ = turtleMesh.rotation.z;

    console.log("🔄 Rotation initiale sauvegardée:", { x: initialRotationX, y: initialRotationY, z: initialRotationZ });

    // Utiliser onBeforeRender pour orienter la tortue dynamiquement vers sa direction de mouvement
    let lastPosition = turtleMesh.position.clone();

    const updateRotation = () => {
        // Calculer la direction du mouvement
        const currentPosition = turtleMesh.position.clone();
        const direction = currentPosition.subtract(lastPosition);

        // Si le mouvement est significatif, orienter la tortue
        if (direction.length() > 0.01) {
            // Calculer l'angle de rotation basé sur la direction du mouvement
            const movementAngle = Math.atan2(direction.x, direction.z);

            // IMPORTANT: Ajouter l'angle de mouvement à la rotation initiale
            // Le scaling Z négatif inverse le sens, donc on soustrait au lieu d'ajouter
            turtleMesh.rotation.y = initialRotationY + movementAngle + Math.PI;
            turtleMesh.rotation.x = initialRotationX;
            turtleMesh.rotation.z = initialRotationZ;
        }

        lastPosition = currentPosition.clone();
    };

    // Observer pour mettre à jour la rotation à chaque frame
    scene.onBeforeRenderObservable.add(updateRotation);

    // Lancer l'animation de position en boucle infinie
    scene.beginAnimation(turtleMesh, 0, totalFrames, true);

    console.log("🐢 Animation de la tortue lancée (tour de l'aquarium en boucle)");
}

/**
 * Animation automatique des carpes koi : fait le tour du cube de l'aquarium
 * en suivant les bords tout en gardant la même distance des parois
 */
export function animateKoiFishLoop(scene, koiMeshes) {
    // Position initiale: x: -5, y: 15, z: -8
    // Il y a 5 carpes koi qui nagent ensemble

    const Y = 15; // Hauteur constante (plus haut que la tortue)

    // Définir les points du parcours (rectangle suivant les bords du cube)
    const points = [
        new BABYLON.Vector3(-5, Y, -8),    // Point de départ
        new BABYLON.Vector3(-5, Y, -15),   // Vers l'arrière
        new BABYLON.Vector3(15, Y, -15),   // Vers la droite
        new BABYLON.Vector3(15, Y, 15),    // Vers l'avant
        new BABYLON.Vector3(-15, Y, 15),   // Vers la gauche
        new BABYLON.Vector3(-15, Y, -8),   // Continue à gauche
        new BABYLON.Vector3(-5, Y, -8)     // Retour au point de départ
    ];

    const frameRate = 60;
    const duration = 50; // 50 secondes pour faire le tour
    const totalFrames = duration * frameRate;

    koiMeshes.forEach((koiMesh, index) => {
        // DEBUG: Afficher les infos du premier mesh seulement
        if (index === 0) {
            console.log("🔍 Informations du mesh carpe koi:");
            console.log("  - Nom:", koiMesh.name);
            console.log("  - Position:", koiMesh.position);
            console.log("  - Rotation:", koiMesh.rotation);
            console.log("  - Scaling:", koiMesh.scaling);
        }

        // Chaque poisson garde sa position initiale et suit le même parcours décalé
        const startPos = koiMesh.position.clone();
        const offsetX = startPos.x - points[0].x;
        const offsetZ = startPos.z - points[0].z;

        // Créer un parcours personnalisé pour ce poisson
        const personalPoints = points.map(p =>
            new BABYLON.Vector3(p.x + offsetX, p.y, p.z + offsetZ)
        );

        // Animation de position
        const animPosition = new BABYLON.Animation(
            `koiPathAnimation_${index}`,
            "position",
            frameRate,
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );

        const positionKeys = [];
        const framesPerSegment = totalFrames / (points.length - 1);

        for (let i = 0; i < personalPoints.length; i++) {
            const frame = i * framesPerSegment;
            positionKeys.push({
                frame: frame,
                value: personalPoints[i]
            });
        }

        animPosition.setKeys(positionKeys);

        // Appliquer un easing pour des mouvements plus fluides
        const easingFunction = new BABYLON.SineEase();
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        animPosition.setEasingFunction(easingFunction);

        // Attacher l'animation de position
        koiMesh.animations = koiMesh.animations || [];
        koiMesh.animations.push(animPosition);

        // Sauvegarder la rotation initiale
        const initialRotationY = koiMesh.rotation.y;
        const hasNegativeScaleZ = koiMesh.scaling.z < 0;

        if (index === 0) {
            console.log("🐟 DEBUG Carpe koi:");
            console.log("  - Rotation Y initiale:", initialRotationY);
            console.log("  - Scaling Z négatif?", hasNegativeScaleZ);
        }

        // Créer une animation de rotation avec des keyframes
        const animRotation = new BABYLON.Animation(
            `koiRotationAnimation_${index}`,
            "rotation.y",
            frameRate,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );

        const rotationKeys = [];

        for (let i = 0; i < personalPoints.length - 1; i++) {
            const currentFrame = i * framesPerSegment;
            const direction = personalPoints[i + 1].subtract(personalPoints[i]);
            // Si scaling Z négatif, inverser la direction pour l'angle
            const movementAngle = hasNegativeScaleZ
                ? Math.atan2(-direction.x, -direction.z)
                : Math.atan2(direction.x, direction.z);
            const finalAngle = movementAngle;

            rotationKeys.push({
                frame: currentFrame,
                value: finalAngle
            });

            if (index === 0 && i < 3) {
                console.log(`  - Segment ${i}: frame=${currentFrame}, direction=(${direction.x.toFixed(2)}, ${direction.z.toFixed(2)}), angle=${movementAngle.toFixed(2)}, finalAngle=${finalAngle.toFixed(2)}`);
            }
        }

        // Ajouter la rotation finale (retour au début)
        const lastFrame = (personalPoints.length - 1) * framesPerSegment;
        rotationKeys.push({
            frame: lastFrame,
            value: rotationKeys[0].value
        });

        if (index === 0) {
            console.log("  - Nombre de keyframes rotation:", rotationKeys.length);
            console.log("  - Keyframes triés (3 premiers):", rotationKeys.slice(0, 3));
        }

        animRotation.setKeys(rotationKeys);
        animRotation.setEasingFunction(easingFunction);

        koiMesh.animations.push(animRotation);

        // Appliquer aussi la rotation aux meshes enfants (où se trouve la géométrie visible)
        koiMesh.getChildMeshes().forEach(child => {
            child.animations = child.animations || [];
            child.animations.push(animRotation.clone());
        });

        if (index === 0) {
            console.log("  - Nombre total d'animations sur le mesh:", koiMesh.animations.length);
            console.log("  - Nombre d'enfants avec animation de rotation:", koiMesh.getChildMeshes().length);
        }

        // Lancer les animations en boucle infinie (position + rotation)
        const animatable = scene.beginAnimation(koiMesh, 0, totalFrames, true);

        // Lancer aussi sur les enfants
        koiMesh.getChildMeshes().forEach(child => {
            scene.beginAnimation(child, 0, totalFrames, true);
        });

        if (index === 0) {
            console.log("  - Animation lancée, animatable:", animatable);
            console.log("  - Animations actives:", animatable.getAnimations().map(a => a.animation.targetProperty));
        }
    });

    console.log(`🐟 Animation de ${koiMeshes.length} carpes koi lancée (tour de l'aquarium en boucle)`);
}

/**
 * Animation automatique des poissons (hotspot 1) : fait le tour du cube de l'aquarium
 * en suivant les bords tout en gardant la même distance des parois
 */
export function animateFishLoop(scene, fishMeshes) {
    // Position initiale: x: -8, y: 0, z: 8
    // Il y a 3 poissons qui nagent ensemble

    const Y = 0; // Hauteur constante (centre de l'aquarium)

    // Définir les points du parcours (rectangle suivant les bords du cube)
    const points = [
        new BABYLON.Vector3(-8, Y, 8),     // Point de départ
        new BABYLON.Vector3(-8, Y, -15),   // Vers l'arrière
        new BABYLON.Vector3(15, Y, -15),   // Vers la droite
        new BABYLON.Vector3(15, Y, 15),    // Vers l'avant
        new BABYLON.Vector3(-15, Y, 15),   // Vers la gauche
        new BABYLON.Vector3(-15, Y, 8),    // Continue à gauche
        new BABYLON.Vector3(-8, Y, 8)      // Retour au point de départ
    ];

    const frameRate = 60;
    const duration = 45; // 45 secondes pour faire le tour
    const totalFrames = duration * frameRate;

    fishMeshes.forEach((fishMesh, index) => {
        // DEBUG: Afficher les infos du premier mesh seulement
        if (index === 0) {
            console.log("🔍 Informations du mesh poisson (hotspot 1):");
            console.log("  - Nom:", fishMesh.name);
            console.log("  - Position:", fishMesh.position);
            console.log("  - Rotation:", fishMesh.rotation);
            console.log("  - Scaling:", fishMesh.scaling);
            console.log("  - Nombre d'enfants:", fishMesh.getChildMeshes().length);

            const childMeshes = fishMesh.getChildMeshes();
            if (childMeshes.length > 0) {
                console.log("  - Premier enfant:");
                console.log("    Position:", childMeshes[0].position);
                console.log("    Rotation:", childMeshes[0].rotation);
                console.log("    Scaling:", childMeshes[0].scaling);
            }
        }

        // Chaque poisson garde sa position initiale et suit le même parcours décalé
        const startPos = fishMesh.position.clone();
        const offsetX = startPos.x - points[0].x;
        const offsetZ = startPos.z - points[0].z;

        // Créer un parcours personnalisé pour ce poisson
        const personalPoints = points.map(p =>
            new BABYLON.Vector3(p.x + offsetX, p.y, p.z + offsetZ)
        );

        // Animation de position
        const animPosition = new BABYLON.Animation(
            `fishPathAnimation_${index}`,
            "position",
            frameRate,
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );

        const positionKeys = [];
        const framesPerSegment = totalFrames / (points.length - 1);

        for (let i = 0; i < personalPoints.length; i++) {
            const frame = i * framesPerSegment;
            positionKeys.push({
                frame: frame,
                value: personalPoints[i]
            });
        }

        animPosition.setKeys(positionKeys);

        // Appliquer un easing pour des mouvements plus fluides
        const easingFunction = new BABYLON.SineEase();
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        animPosition.setEasingFunction(easingFunction);

        // Attacher l'animation de position
        fishMesh.animations = fishMesh.animations || [];
        fishMesh.animations.push(animPosition);

        // Sauvegarder la rotation initiale
        const initialRotationY = fishMesh.rotation.y;
        const hasNegativeScaleZ = fishMesh.scaling.z < 0;

        if (index === 0) {
            console.log("🐠 DEBUG Poisson:");
            console.log("  - Rotation Y initiale:", initialRotationY);
            console.log("  - Scaling Z négatif?", hasNegativeScaleZ);
        }

        // Créer une animation de rotation avec des keyframes
        const animRotation = new BABYLON.Animation(
            `fishRotationAnimation_${index}`,
            "rotation.y",
            frameRate,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );

        const rotationKeys = [];

        for (let i = 0; i < personalPoints.length - 1; i++) {
            const currentFrame = i * framesPerSegment;
            const direction = personalPoints[i + 1].subtract(personalPoints[i]);
            // Si scaling Z négatif, inverser la direction pour l'angle
            const movementAngle = hasNegativeScaleZ
                ? Math.atan2(-direction.x, -direction.z)
                : Math.atan2(direction.x, direction.z);
            const finalAngle = movementAngle;

            rotationKeys.push({
                frame: currentFrame,
                value: finalAngle
            });

            if (index === 0 && i < 3) {
                console.log(`  - Segment ${i}: frame=${currentFrame}, direction=(${direction.x.toFixed(2)}, ${direction.z.toFixed(2)}), angle=${movementAngle.toFixed(2)}, finalAngle=${finalAngle.toFixed(2)}`);
            }
        }

        // Ajouter la rotation finale (retour au début)
        const lastFrame = (personalPoints.length - 1) * framesPerSegment;
        rotationKeys.push({
            frame: lastFrame,
            value: rotationKeys[0].value
        });

        if (index === 0) {
            console.log("  - Nombre de keyframes rotation:", rotationKeys.length);
            console.log("  - Keyframes triés (3 premiers):", rotationKeys.slice(0, 3));
        }

        animRotation.setKeys(rotationKeys);
        animRotation.setEasingFunction(easingFunction);

        fishMesh.animations.push(animRotation);

        // Appliquer aussi la rotation aux meshes enfants (où se trouve la géométrie visible)
        fishMesh.getChildMeshes().forEach(child => {
            child.animations = child.animations || [];
            child.animations.push(animRotation.clone());
        });

        if (index === 0) {
            console.log("  - Nombre total d'animations sur le mesh:", fishMesh.animations.length);
            console.log("  - Nombre d'enfants avec animation de rotation:", fishMesh.getChildMeshes().length);
        }

        // Lancer les animations en boucle infinie (position + rotation)
        const animatable = scene.beginAnimation(fishMesh, 0, totalFrames, true);

        // Lancer aussi sur les enfants
        fishMesh.getChildMeshes().forEach(child => {
            scene.beginAnimation(child, 0, totalFrames, true);
        });

        if (index === 0) {
            console.log("  - Animation lancée, animatable:", animatable);
            console.log("  - Animations actives:", animatable.getAnimations().map(a => a.animation.targetProperty));
        }
    });

    console.log(`🐠 Animation de ${fishMeshes.length} poissons lancée (tour de l'aquarium en boucle)`);
}

/**
 * Fonction principale appelée par le bouton Animation
 */
export function triggerAnimation() {
    if (!currentHotspotData) {
        console.warn("Aucun hotspot sélectionné");
        return;
    }

    const { scene, targetMesh } = currentHotspotData;

    // Trouver tous les clones
    const clones = findAllClones(scene, targetMesh);
    console.log(`🐠 Animation de ${clones.length} mesh(es)`);

    // Trouver et jouer les animations natives
    const animationGroups = findAnimationGroups(scene, targetMesh);
    const hasNativeAnim = playNativeAnimations(animationGroups);

    if (hasNativeAnim) {
        console.log(`Animation native trouvée et jouée`);
    }

    // Vérifier si cet animal est exclu de l'animation en cercle
    if (isExcludedFromCircleAnimation(targetMesh.name)) {
        console.log(` ${targetMesh.name} est exclu de l'animation en cercle`);
        return;
    }

    // Lancer l'animation de mouvement en cercle
    animateCircleMovement(scene, clones);
}

// ============================================================================
// INITIALISATION DES BOUTONS
// ============================================================================

/**
 * Initialise les event listeners sur les boutons
 */
export function initAnimationButtons() {
    const btnAnimation = document.getElementById("btnAnimation");

    if (btnAnimation) {
        btnAnimation.addEventListener("click", (e) => {
            e.stopPropagation();
            triggerAnimation();
        });
    }
}

// Auto-initialisation quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimationButtons);
} else {
    initAnimationButtons();
}
