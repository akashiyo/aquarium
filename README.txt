================================================================================
                    AQUASCOPE - Aquarium 3D Interactif
================================================================================

DESCRIPTION DU PROJET
---------------------
Aquascope est une application web interactive permettant d'explorer un aquarium
virtuel en 3D. Ce projet utilise Babylon.js pour créer une expérience d'observation
éducative de la vie marine.


================================================================================
INTERACTIONS ET FONCTIONNALITÉS
================================================================================

1. PAGE D'ACCUEIL ANIMÉE
========================

Description : Écran d'accueil avec animation de poissons nageant en
arrière-plan, logo animé et description du site.

   - Effet visuel : 7 types de poissons différents en 2D que nous avons fait
        sur Figma nagent dans l'arrière-plan de l'accueil.
   - Interaction : Bouton "Découvrir" qui scrolle vers l'aquarium 3D.

--------------------------------------------------------------------------------

2. SYSTÈME DE HOTSPOTS NUMÉROTÉS dans l'aquarium (Points d'Information)
========================================================

Description : Points cliquables (numéros blancs cerclés) positionnés sur
différentes espèces marines.

Interaction :
   - Clic sur un hotspot : Affiche une fiche d'information du type de l'animal
        mais aussi un bouton qui permet de l'animer pour certains.
   - Hover : Léger agrandissement du hotspot
   - Suivi automatique : Les hotspots suivent les animaux en mouvement, et restent
        attachés aux mesh qui leur correspondent même quand la caméra bouge.


--------------------------------------------------------------------------------

3. SYSTÈME DE FICHES D'INFOS DÉTAILLÉES
===================================

Description : Boîte d'information (InfoBox) s'affichant lors du clic sur un
hotspot.

Contenu affiché :
   - Numéro et nom de l'espèce
   - Description biologique
   - Localisation géographique
   - Régime alimentaire

Interaction :
   - Apparition automatique lors du clic sur un hotspot
   - Bouton "Animation" visible uniquement pour les espèces ayant des
        animations codées comme déclenchables.
   - Les espèces étants soit attachés au sol, soit ayant déjà une animation
        automatique n'ont pas ce bouton sur leur hotspot par exemple

--------------------------------------------------------------------------------

4. ANIMATIONS DES ANIMAUX
==========================

Description : Certaines espèces possèdent des animations de mouvement déclenchabless

Espèces animables (9 types) :
   - Poisson générique
   - Méduse
   - Hippocampe
   - Poisson clown
   - Poisson stylisé
   - Carpe Koi
   - Poisson combattant
   - Poisson low-poly

Types d'animations :
   - Mouvement en cercle : Animation de nage circulaire sans avancement. (mouvement peu naturel)
   - Elles gardent leur animations GLB natives en même temps s'il y en a

--------------------------------------------------------------------------------

5. CONTRÔLE CAMÉRA
==============================

Description : Caméra permettant une exploration libre de l'aquarium.

Contrôles disponibles :
   - Rotation : Clic gauche + glisser
   - Zoom : Molette de la souris
   - Panoramique : Clic droit + glisser

Animation automatique de la caméra :
   - Lors du clic sur un hotspot, la caméra se déplace automatiquement pour
     zoomer sur l'animal sélectionné
   - Animation sur 60 frames (environ 1 seconde)
   - Distance de focus : 2.2 unités de l'animal
   - La caméra se détache temporairement pour l'animation, puis se rattache
     pour permettre le contrôle manuel

--------------------------------------------------------------------------------

6. CONTRÔLE JOUR/NUIT (Slider Temporel)
========================================

Description : Slider interactif permettant de simuler le cycle jour/nuit dans
l'aquarium.

Phases lumineuses (0-100) :
   - 0-50 : Jour -> Coucher de soleil
     * Label : "Jour" puis "Coucher de soleil"

   - 50-100 : Coucher de soleil -> Nuit
     * Label : "Nuit"

Effets visuels :
   - Changement progressif de la couleur ambiante
   - Modification de la couleur du sol (groundColor)
   - Changement de la couleur de fond de la scène (clearColor)

--------------------------------------------------------------------------------

7. MODE BIOLUMINESCENCE GLOBALE
================================

Description : Bouton permettant d'activer/désactiver l'effet bioluminescent
sur tous les animaux en même temps.

Bouton : Icône "Bioluminescence" en haut à gauche du canvas

Effets appliqués :
   - Émission lumineuse sur les matériaux des animaux (emissiveColor)
   - Lumières ponctuelles (PointLight) attachées à chaque animal
   - Couleurs différentes par espèce

Le bouton reste actif jusqu'à nouveau clic

--------------------------------------------------------------------------------

8. BIOLUMINESCENCE INDIVIDUELLE
================================

Description : Activation de la bioluminescence pour une espèce spécifique via
clic sur le mesh correspondant.

Interaction :
   - CLic su le corps d'un un animal -> Active/désactive la bioluminescence pour
        tous les individus de cette espèce uniquement
   - Les espèces avec bioluminescence individuelle active ne sont pas
        affectées par le mode global normalement

--------------------------------------------------------------------------------

9. EFFET DE BULLES INTERACTIF
==============================

Description : Système de particules créant une traînée de bulles qui suit le
curseur de la souris quand on se déplace dans l'aquarium.

Caractéristiques techniques :
   - Système de particules : 2000 particules maximum
   - Texture : Effet de flare pour simuler des bulles
   - Durée de vie : 1.5 à 3 secondes
   - Direction : Ascension vers le haut avec variation aléatoire
   - Mode de fusion : BLENDMODE_ADD pour effet transparent et lumineux
   - Gravité : Légère poussée vers le haut (0, 0.5, 0)

Comportement :
   - Les bulles apparaissent à la position 3D correspondant au curseur dans
     la scène
   - Augmentation du taux d'émission lors du mouvement de la souris
   - Projection rayon (ray picking) pour convertir position 2D écran ->
     position 3D monde

--------------------------------------------------------------------------------

10. ENVIRONNEMENT ET DÉCORATION
================================

10.1 Aquarium
-------------
   - Dimensions : 50x50x50 unités
   - Matériau : Verre semi-transparent
   - Couleur : Bleu-vert

10.2 Sol marin
--------------
   - Dimensions : 50x3x50 unités
   - Texture : Texture de sable procédurale (depuis le playground de babylonjs)

10.3 Éléments de décoration au sol (placement procédural avec seed)
--------------------------------------------------------------------
Algues et coraux :
   - Algues vertes : 8-30 instances
   - Algues rouges : 15-25 instances
   - Anémones de mer bleues : 6-10 instances
   - Coraux variés (6 types différents) : 3-10 instances chacun
   - Algues calcaires
   - Coquillages
   - Coraux low-poly

Positionnement :
   - Distance minimale entre éléments : 2.2 unités
   - Zone de placement : -20 à +20 sur X et Z
   - Variations d'échelle : 0.8 à 1.2
   - Rotations aléatoires sur l'axe Y

10.4 Rochers
------------
   - Modèle : Lyme Bay
   - Position : attaché au Sol de l'aquarium pour faire un genre de récif rocheux

--------------------------------------------------------------------------------

11. POPULATION ANIMALE (15 Espèces)
====================================

Poissons (9 types) :
   1. Poisson générique (fish.glb) - 3 instances - Échelle: 0.01
   2. Méduse (jellyfish.glb) - 4 instances - Échelles variables: 0.0010-0.0020
   3. Poisson clown (fish-nem.glb) - 10 instances - Échelle: 1.7
   4. Poisson stylisé (fishie.glb) - 6 instances - Échelle: 0.80
   5. Carpe Koi (koi_fish.glb) - 5 instances - Échelle: 0.90
   6. Poisson combattant (red_betta_fish.glb) - 7 instances - Échelle: 0.01
   7. Poisson intermédiaire (fishoo.glb) - 2 instances - Échelle: 1
   8. Poisson low-poly (lowpoly_fish.glb) - 4 instances - Échelle: 0.2
   9. Requin blanc (pelagic_thresher_shark.glb) - 1 instance - Échelle: 0.05

Autres créatures (6 types) :
  10. Tortue marine (hawksbill turtle) - 1 instance - Échelle: 15
  11. Crabe (crab.glb) - 10 instances - Échelles: 2-3
  12. Crabe stylisé (stylized_crab.glb) - 2 instances - Échelle: 7
  13. Hippocampe (seahorse.glb) - 10 instances - Échelle: 0.35
  14. Poulpe (Animal Crossing style) - 1 instance - Échelle: 1
  15. Pieuvre rouge (octopus.glb) - 1 instance - Échelle: 0.5

Positionnement :
   - Chaque espèce a une zone de placement définie (x, y, z)
   - Variations aléatoires pour éviter l'alignement parfait
   - Placées plus ou moins en hauteur en fonction de l'espèce

Total : Plus de 60 créatures marines dans l'aquarium


================================================================================
ARCHITECTURE TECHNIQUE
================================================================================

FICHIERS PRINCIPAUX
-------------------

HTML
----
   - index.html : Page principale avec structure HTML et imports des scripts

JavaScript (Modules ES6)
------------------------
   - src/main.js (943 lignes) :
     * Initialisation de la scène Babylon.js
     * Chargement des modèles 3D (GLB)
     * Configuration de l'aquarium, lumières et caméra
     * Système jour/nuit
     * Mode bioluminescence
     * Effet de bulles

   - src/point.js (174 lignes) :
     * Création des hotspots avec Babylon GUI
     * Projection 3D -> 2D
     * Animation de focus de la caméra
     * Gestion des clics et affichage InfoBox

   - src/animation.js (718 lignes) :
     * Animations en cercle pour les poissons
     * Gestion des AnimationGroups des modèles GLB
     * Système de recherche de clones
     * Bioluminescence individuelle (double-clic)

   - src/animalInfo.js (150 lignes) :
     * Base de données d'informations sur les 14 espèces
     * Descriptions, localisations, régimes alimentaires
     * Configuration des animations disponibles

   - src/animation_homepage.js :
     * Animation des poissons de la page d'accueil
     * Système de respawn et mouvement fluide

CSS
---
   - style/style.css : Styles pour interface, page d'accueil, InfoBox, contrôles


TECHNOLOGIES UTILISÉES
----------------------

Core :
   - Babylon.js 7.x (CDN) - Moteur 3D
   - Babylon.js Loaders - Chargement GLB/glTF
   - Babylon.js GUI - Interface 2D overlay
   - Babylon.js Procedural Textures - Textures génératives

Formats :
   - GLB - Modèles 3D (format glTF binaire)
   - ES6 Modules - Organisation du code JavaScript
   - HTML5 Canvas - Rendu WebGL

Pas de build system : Projet exécutable directement dans le navigateur sans
compilation


================================================================================
POINTS D'INTÉRÊT POUR L'ÉVALUATION
================================================================================

1. Système de Template-Based Mesh Cloning
   - Chargement d'un modèle GLB par type d'animal
   - Mesh template désactivé (.setEnabled(false))
   - Clones multiples avec variations (échelle, position, rotation)
   - Optimisation mémoire et performances

2. Projection 3D vers 2D
   - Hotspots GUI liés aux positions 3D des animaux
   - Mise à jour à chaque frame (onBeforeRenderObservable)
   - Calcul du centre des bounding boxes pour positionnement précis

3. Animations Procédurales
   - Génération d'animations de mouvement en cercle
   - Utilisation du système BABYLON.Animation
   - Gestion du frame rate (60 fps)

4. Système de Lumières Dynamiques
   - Lumière hémisphérique principale (jour/nuit)
   - Lumières ponctuelles pour bioluminescence
   - Couleurs et intensités adaptées par espèce

5. Placement Procédural avec Seed
   - Génération déterministe des positions d'algues et coraux
   - Fonction seededRandom pour reproductibilité
   - Détection de collision (distance minimale entre éléments)

6. Optimisation des Recherches
   - Utilisation de regex pour identifier les clones
   - Filtrage efficace des AnimationGroups
   - Système de Set pour tracking des bioluminescences individuelles

7. Responsive Design
   - Canvas pleine taille
   - Adaptation mobile/desktop pour contrôles caméra
   - Interface overlay positionnée de manière absolue


================================================================================
STRUCTURE DES DOSSIERS
================================================================================

603/
├── assets/
│   ├── images/              (Images page d'accueil - poissons PNG/SVG)
│   └── models/
│       ├── animals/         (15 modèles GLB d'animaux)
│       └── ground/          (Éléments de décoration)
│           └── ground/      (~25 modèles GLB de végétation et coraux)
├── src/
│   ├── main.js              (Script principal - scène 3D)
│   ├── point.js             (Système de hotspots)
│   ├── animation.js         (Animations des animaux)
│   ├── animalInfo.js        (Base de données d'informations)
│   └── animation_homepage.js (Animation page d'accueil)
├── style/
│   └── style.css            (Styles globaux)
├── index.html               (Point d'entrée)
├── README.txt               (Ce fichier)
├── package.json             (Configuration npm - optionnel)
└── docker-compose.yaml      (Configuration Docker - optionnel)


================================================================================
COMPATIBILITÉ
================================================================================

Navigateurs supportés :
   - Chrome/Edge 90+ (recommandé)
   - Firefox 88+
   - Safari 14+

Prérequis :
   - Support WebGL 2.0
   - JavaScript ES6 activé
   - Connexion internet (pour CDN Babylon.js)


================================================================================
CRÉDITS ET RESSOURCES
================================================================================

Bibliothèque 3D : Babylon.js (https://www.babylonjs.com/)
Modèles 3D : Sources variées (Sketchfab, bibliothèques libres)
Textures : Babylon.js Playground assets


================================================================================
GUIDE DE TEST RAPIDE
================================================================================

 1. Lancer le projet
    -> Serveur local HTTP

 2. Observer la page d'accueil
    -> Poissons animés en arrière-plan

 3. Cliquer "Découvrir"
    -> Accès à l'aquarium 3D

 4. Naviguer avec la souris
    -> Rotation, zoom, panoramique

 5. Cliquer sur un hotspot (numéro blanc)
    -> Affichage InfoBox + focus caméra

 6. Cliquer "Animation" (si disponible)
    -> Déclenchement animation espèce

 7. Bouger le slider jour/nuit
    -> Observer changement luminosité et couleurs

 8. Cliquer bouton Bioluminescence
    -> Effet lumineux sur tous les animaux

 9. Double-cliquer sur un hotspot
    -> Bioluminescence individuelle de l'espèce

10. Déplacer la souris sur l'aquarium
    -> Traînée de bulles interactive


================================================================================
QUELQUES CHOIX TECHNIQUES
================================================================================

- Reproductibilité : Le placement des éléments au sol utilise un seed fixe
  (987654) pour garantir la même disposition à chaque chargement

- Extensibilité : Architecture permettant l'ajout facile de nouvelles
  espèces (ajouter GLB + entrée dans animalInfo.js + configuration dans
  CONFIG.animals)

