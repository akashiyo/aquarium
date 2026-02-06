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

Poissons : 9 types (espèces génériques)

Autres créatures : 6 types (crustacés, requins etc.)

Positionnement :
   - Chaque espèce a une zone de placement définie
   - Variations aléatoires pour éviter l'alignement parfait
   - Placées plus ou moins en hauteur en fonction de l'espèce

================================================================================
ARCHITECTURE TECHNIQUE ET MENTIONS IA
================================================================================

HTML
----
   - index.html : Page principale avec structure HTML et imports des scripts

JavaScript : Les calculs abstraits ont été ajustés par l'IA.
------------------------
   - src/main.js : l'IA a débuggé les conflits de bioluminescence globale et individuelle,
         mais aussi les notions spécifiques pour le curseur à bulles (Flare). Le seeding utilisé
         pour la génération complexe du sol a été pensé par l'IA.

     * Initialisation de la scène Babylon.js
     * Chargement des modèles 3D (tous en GLB)
     * Configuration de l'aquarium, lumières et caméra
     * Système jour/nuit
     * Mode bioluminescence
     * Effet de bulles suivant le curseur

   - src/point.js : l'IA a aidé à utiliser le GUI et les positionnements des hotspot en fonction
        du mouvement caméra (suivi de coordonnées)

     * Création des hotspots avec Babylon GUI
     * Projection 3D -> 2D
     * Animation de focus de la caméra
     * Gestion des clics et affichage InfoBox

   - src/animation.js : la majorité des animations n'ont pas fonctionné comme prévu, les logs de debug
        ont été écrits par l'IA, mais ça n'a pas beaucoup aidé. Au final nous avons laissé les suggestions de fonctions faites
        par l'IA pour gérer les orientations des animaux lors du mouvement, même si elles n'ont pas vraiment marché.

     * Animations en cercle pour les poissons
     * Gestion des AnimationGroups des modèles
     * Système de recherche de clones
     * Bioluminescence individuelle

   - src/animalInfo.js :
     * Base de données d'informations sur les 14 espèces
     * Descriptions, localisations, régimes alimentaires
     * Configuration des animations disponibles

   - src/animation_homepage.js :
     * Animation des poissons de la page d'accueil
     * Système de respawn

CSS
---
   - style/style.css : Styles pour interface, page d'accueil, InfoBox, contrôles


TECHNOLOGIES
----------------------
   - Babylon.js 7.x (CDN) - Moteur 3D
   - Babylon.js Loaders - Chargement GLB
   - Babylon.js GUI - Interface 2D overlay
   - Babylon.js Procedural Textures - Textures génératives

Formats :
   - GLB - Modèles 3D

================================================================================
CHOIX TECHNIQUES
================================================================================

1. Système de Template-Based Mesh Cloning
   - Chargement d'un modèle GLB par type d'animal
   - Mesh template désactivé (.setEnabled(false))
   - Clones multiples avec variations (échelle, position, rotation) pour dupliquer rapidement le modèle

2. Projection 3D vers 2D
   - Hotspots GUI liés aux positions 3D des animaux
   - Mise à jour à chaque frame (onBeforeRenderObservable)
   - Calcul du centre des bounding boxes pour positionnement

3. Animations Procédurales
   - Animations de mouvement en cercle
   - Utilisation du système BABYLON.Animation sur la racine parent su mesh pour éviter de séparer les parties de l'animal

4. Système de Lumières
   - Lumière hémisphérique principale (jour/nuit)
   - Lumières ponctuelles pour bioluminescence
   - Couleurs et intensités adaptées par espèce

5. Placement Procédural avec Seed
   - Génération des positions d'algues et coraux
   - Fonction seededRandom
   - Détection de collision (distance minimale entre éléments)

6. Extensibilité : Architecture permettant l'ajout facile de nouvelles
  espèces (ajouter GLB + entrée dans animalInfo.js + configuration dans
  CONFIG.animals)

================================================================================
DIFFICULTÉS
================================================================================

    - La tâche la plus dure a été de comprendre comment controler les mesh, qui n'avaient notamment
    pas tous le même type de centre, d'animation natives et d'orientation.
    - Ensuite, nous n'avons pas réussi à faire les animations que nous souhaitions, même avec l'IA.
    - Les notions dont nous n'avons jamais entendu parler nous ont demandé l'utilisation de l'IA,
        pour avoir une idée de comment initialiser le code :
        textures procédurales, seeding, gestion de positionnement complexe lors d'animation
        et génération dynamique de coordonnées, 2D dans la 3D (GUI bablyon)
    - Le point sur lequel nous étions le plus perdu était l'animation


