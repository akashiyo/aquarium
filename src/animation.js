// ============================================================================
// ANIMATION MODULE - Gère les animations des hotspots
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
