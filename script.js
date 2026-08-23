// Base de données des anomalies et de leurs QCM
const qcmData = {
    "poubelle": {
        question: "Vous remarquez une poubelle positionnée sous une fenêtre du rez-de-chaussée. Que faites-vous ?",
        options: [
            { texte: "Je la laisse ici, c'est le travail des agents d'entretien.", correct: false },
            { texte: "Je la déplace loin de la façade pour éviter l'escalade et le risque incendie, et je le signale sur ma main courante.", correct: true },
            { texte: "Je regarde ce qu'il y a à l'intérieur pour chercher des indices.", correct: false }
        ],
        explication: "Une poubelle sous une fenêtre est un 'marchepied' facilitant l'intrusion et un danger en cas d'incendie (propagation à la façade)."
    },
    "issue": {
        question: "L'issue de secours du bâtiment est entrouverte. Quelle est la bonne procédure ?",
        options: [
            { texte: "Je referme et verrouille la porte, puis j'alerte le PC Sécurité pour une levée de doute à l'intérieur.", correct: true },
            { texte: "Je rentre seul à l'intérieur pour inspecter le bâtiment.", correct: false },
            { texte: "Je continue ma ronde extérieure, l'intérieur ne me concerne pas.", correct: false }
        ],
        explication: "L'entrebâillement d'une issue peut être une préparation au vol ou à l'intrusion. Il faut sécuriser l'accès et déclencher une vérification en binôme ou via le PC."
    },
    "grillage": {
        question: "Vous constatez un trou découpé dans le grillage d'enceinte. Que devez-vous faire ?",
        options: [
            { texte: "Je répare le grillage moi-même avec du fil de fer.", correct: false },
            { texte: "Je passe à travers pour voir ce qu'il y a de l'autre côté.", correct: false },
            { texte: "J'alerte le PC Sécurité immédiatement, je fige les lieux et je reste en observation en attendant du renfort.", correct: true }
        ],
        explication: "Un grillage découpé est une effraction avérée. Il faut prévenir, sécuriser la zone pour ne pas détruire d'éventuelles traces et attendre les consignes."
    }
};

let score = 0;
let anomalieEnCours = null;

// Éléments du DOM
const modal = document.getElementById('qcm-modal');
const titreQcm = document.getElementById('qcm-titre');
const optionsContainer = document.getElementById('qcm-options');
const feedback = document.getElementById('qcm-feedback');
const btnFermer = document.getElementById('btn-fermer');
const affichageScore = document.getElementById('score');

// Ajouter le clic sur chaque anomalie
document.querySelectorAll('.anomalie').forEach(zone => {
    zone.addEventListener('click', function() {
        anomalieEnCours = this;
        ouvrirQCM(this.dataset.id);
    });
});

function ouvrirQCM(idAnomalie) {
    const data = qcmData[idAnomalie];
    titreQcm.textContent = data.question;
    optionsContainer.innerHTML = '';
    feedback.classList.add('cache');
    btnFermer.classList.add('cache');

    // Générer les boutons de réponses
    data.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.classList.add('btn-option');
        btn.textContent = opt.texte;
        btn.onclick = () => verifierReponse(btn, opt.correct, data.explication);
        optionsContainer.appendChild(btn);
    });

    modal.classList.remove('cache');
}

function verifierReponse(bouton, estCorrect, explication) {
    // Désactiver tous les boutons après le clic
    document.querySelectorAll('.btn-option').forEach(b => b.disabled = true);

    feedback.classList.remove('cache');

    if (estCorrect) {
        bouton.classList.add('correct');
        feedback.textContent = "Bonne réponse ! " + explication;
        feedback.style.color = "#2ecc71";
        
        // Valider l'anomalie
        anomalieEnCours.classList.add('traitee');
        score++;
        affichageScore.textContent = score;

        // Fin du jeu ?
        if (score === 3) {
            setTimeout(() => alert("Félicitations, ronde terminée avec succès ! Vous maîtrisez les procédures."), 1000);
        }
    } else {
        bouton.classList.add('erreur');
        feedback.textContent = "Mauvaise réponse. " + explication;
        feedback.style.color = "#e74c3c";
    }

    btnFermer.classList.remove('cache');
}

// Fermer la modale
btnFermer.addEventListener('click', () => {
    modal.classList.add('cache');
});