// Base de données : Constat factuel (Id) + Évaluation du risque (Justification)
const qcmData = {
    "bloc1": {
        titre: "Zone : Issue de secours",
        id: [
            { texte: "La porte coupe-feu est endommagée", correct: false },
            { texte: "L'issue de secours est laissée entrouverte", correct: true },
            { texte: "La serrure de la porte a été fracturée", correct: false }
        ],
        justif: [
            { texte: "Cela bloque l'évacuation du public en cas d'incendie majeur.", correct: false },
            { texte: "Cela provoque une déperdition thermique et ne respecte pas les normes écologiques.", correct: false },
            { texte: "Cela facilite une intrusion extérieure et constitue une faille volontaire ou involontaire de la sûreté.", correct: true }
        ],
        explication: "Une issue entrouverte est souvent une technique de préparation au vol. Il faut sécuriser l'accès et déclencher une vérification ou une levée de doute."
    },
    "bloc2": {
        titre: "Zone : Périmètre extérieur",
        id: [
            { texte: "Le grillage d'enceinte a été découpé", correct: true },
            { texte: "Le poteau de clôture est oxydé et fragilisé", correct: false },
            { texte: "Un objet suspect est accroché au grillage", correct: false }
        ],
        justif: [
            { texte: "C'est un risque d'accident pour le personnel d'entretien des espaces verts.", correct: false },
            { texte: "C'est une effraction caractérisée qui prouve qu'une intrusion a eu lieu ou est en cours.", correct: true },
            { texte: "Cela nécessite uniquement un rapport pour l'équipe de maintenance technique.", correct: false }
        ],
        explication: "Un grillage découpé nécessite d'alerter immédiatement le PC, de figer les lieux pour préserver les traces, et d'attendre des renforts."
    },
    "bloc3": {
        titre: "Zone : Façade du bâtiment",
        id: [
            { texte: "Des détritus jonchent le sol près de la porte", correct: false },
            { texte: "Une poubelle a été volontairement placée sous une fenêtre", correct: true },
            { texte: "Le conteneur obstrue la voie de circulation des véhicules", correct: false }
        ],
        justif: [
            { texte: "Cela sert de « marchepied » facilitant l'intrusion par la fenêtre et crée un risque de propagation d'incendie.", correct: true },
            { texte: "Cela attire les nuisibles à proximité immédiate des zones de stockage alimentaire.", correct: false },
            { texte: "Cela empêche le ramassage par les services de la voirie.", correct: false }
        ],
        explication: "Tout objet sous une ouverture facilite l'escalade. Il faut l'éloigner de la façade et rédiger une main courante (rapport factuel)."
    }
};

let score = 0;
let anomalieEnCours = null;
let selectionId = null;
let selectionJustif = null;

const modal = document.getElementById('qcm-modal');
const titreQcm = document.getElementById('qcm-titre');
const conteneurId = document.getElementById('options-id');
const conteneurJustif = document.getElementById('options-justif');
const btnValider = document.getElementById('btn-valider-analyse');
const feedback = document.getElementById('qcm-feedback');
const btnFermer = document.getElementById('btn-fermer');
const affichageScore = document.getElementById('score');

document.querySelectorAll('.anomalie').forEach(zone => {
    zone.addEventListener('click', function() {
        anomalieEnCours = this;
        ouvrirQCM(this.dataset.id);
    });
});

function ouvrirQCM(idAnomalie) {
    const data = qcmData[idAnomalie];
    titreQcm.textContent = data.titre;
    
    // Réinitialiser la modale
    selectionId = null;
    selectionJustif = null;
    conteneurId.innerHTML = '';
    conteneurJustif.innerHTML = '';
    feedback.classList.add('cache');
    btnFermer.classList.add('cache');
    btnValider.classList.remove('cache');
    btnValider.disabled = true;

    // Générer la colonne 1 (Identification)
    data.id.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.classList.add('btn-option');
        btn.textContent = opt.texte;
        btn.dataset.correct = opt.correct;
        btn.onclick = () => {
            selectionId = selectionnerOption(conteneurId, btn);
            verifierBoutonValidation();
        };
        conteneurId.appendChild(btn);
    });

    // Générer la colonne 2 (Justification)
    data.justif.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.classList.add('btn-option');
        btn.textContent = opt.texte;
        btn.dataset.correct = opt.correct;
        btn.onclick = () => {
            selectionJustif = selectionnerOption(conteneurJustif, btn);
            verifierBoutonValidation();
        };
        conteneurJustif.appendChild(btn);
    });

    modal.classList.remove('cache');
}

// Gère le style visuel de la sélection exclusive dans une colonne
function selectionnerOption(conteneur, boutonClique) {
    // Retirer la classe 'selectionne' de tous les boutons de cette colonne
    conteneur.querySelectorAll('.btn-option').forEach(b => b.classList.remove('selectionne'));
    // Ajouter la classe au bouton cliqué
    boutonClique.classList.add('selectionne');
    return boutonClique; // Retourne l'élément cliqué
}

// Active le bouton valider si les deux colonnes ont une sélection
function verifierBoutonValidation() {
    if (selectionId !== null && selectionJustif !== null) {
        btnValider.disabled = false;
    }
}

// Action au clic sur "Valider mon analyse"
btnValider.addEventListener('click', () => {
    const data = qcmData[anomalieEnCours.dataset.id];
    const idEstCorrect = selectionId.dataset.correct === "true";
    const justifEstCorrect = selectionJustif.dataset.correct === "true";

    // Désactiver tous les boutons pour empêcher de modifier la réponse
    document.querySelectorAll('.btn-option').forEach(b => b.disabled = true);
    btnValider.classList.add('cache');
    feedback.classList.remove('cache');

    // Vérification du résultat
    if (idEstCorrect && justifEstCorrect) {
        selectionId.classList.add('correct');
        selectionJustif.classList.add('correct');
        feedback.textContent = "Excellente analyse ! " + data.explication;
        feedback.style.color = "#2ecc71";
        
        if (!anomalieEnCours.classList.contains('traitee')) {
            anomalieEnCours.classList.add('traitee');
            anomalieEnCours.classList.remove('visible');
            score++;
            affichageScore.textContent = score;
        }

        if (score === 3) {
            setTimeout(() => alert("Mission accomplie : périmètre sécurisé et rapports factuels validés."), 1000);
        }
    } else {
        // Affichage des erreurs
        if (!idEstCorrect) selectionId.classList.add('erreur');
        if (!justifEstCorrect) selectionJustif.classList.add('erreur');
        feedback.innerHTML = "Analyse incorrecte ou incomplète.<br>" + data.explication;
        feedback.style.color = "#e74c3c";
    }

    btnFermer.classList.remove('cache');
});

// Fermetures de la modale
btnFermer.addEventListener('click', () => modal.classList.add('cache'));
document.getElementById('fermer-croix').addEventListener('click', () => modal.classList.add('cache'));

// Gestion du bouton d'aide
const btnToggleZones = document.getElementById('btn-toggle-zones');
const anomalies = document.querySelectorAll('.anomalie');
let zonesAffichees = false;

btnToggleZones.addEventListener('click', () => {
    zonesAffichees = !zonesAffichees;
    anomalies.forEach(zone => {
        if (!zone.classList.contains('traitee')) {
            zonesAffichees ? zone.classList.add('visible') : zone.classList.remove('visible');
        }
    });
});
