const ocean = document.getElementById("ocean");

function creerPoisson() {
    const poisson = document.createElement("img");

    const poissons = [
        "poisson.png",
        "poisson_dory.png",
        "poisson_nemo.png",
        "sardine.png"
    ];

    const type = poissons[Math.floor(Math.random() * poissons.length)];
    poisson.src = "./assets/images/" + type;
    poisson.classList.add("poisson");

    const vaAGauche = type.includes("dory") || type.includes("sardine");
    const direction = vaAGauche ? -1 : 1;

    let x = vaAGauche ? window.innerWidth + 120 : -120;

    let angle = Math.random() * Math.PI * 2;
    const hauteurOcean = ocean.offsetHeight;
    const baseY = Math.random() * (hauteurOcean - 100);

    const vitesse = 1 + Math.random() * 2.5;
    const amplitude = 10 + Math.random() * 20;
    const frequence = 0.03 + Math.random() * 0.02;

    poisson.style.transform = vaAGauche ? "scaleX(-1)" : "scaleX(1)";

    ocean.appendChild(poisson);

    function animer() {
        x += vitesse * direction;
        angle += frequence;

        const y = baseY + Math.sin(angle) * amplitude;
        const rotation = Math.sin(angle) * 5;

        poisson.style.left = x + "px";
        poisson.style.top = y + "px";
        poisson.style.transform =
            `scaleX(${vaAGauche ? -1 : 1}) rotate(${rotation}deg)`;

        if (
            (direction === 1 && x < window.innerWidth + 150) ||
            (direction === -1 && x > -150)
        ) {
            requestAnimationFrame(animer);
        } else {
            poisson.remove();
            creerPoisson();
        }
    }

    animer();
}

for (let i = 0; i < 7; i++) {
    setTimeout(creerPoisson, i * 800);
}
