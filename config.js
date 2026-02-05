/**
 * Configuration du Quiz Éco KDM
 * Ce fichier est partagé entre participant et animateur
 */

const CONFIG = {
    // Durées en secondes
    voteDuration: 120,        // 2 min pour voter
    explainDuration: 60,      // 1 min pour l'explication
    // Total par question = 3 min

    // Google Sheet
    sheetUrl: 'https://script.google.com/macros/s/AKfycbzE4npctaZ7I7bZfyTCdxkZACe3jFfaqDlEUzPo2Z0hb71cGirnjiL1OH5nbdFpxYGm8w/exec',
    
    // Mode : 'loop' (boucle infinie) ou 'session' (début fixe)
    mode: 'session',
    
    // Équipes
    teams: {
        blue: { name: 'Équipe Bleue', emoji: '🚌', color: '#1E88E5' },
        red: { name: 'Équipe Rouge', emoji: '🚋', color: '#E53935' }
    }
};

const QUESTIONS = [
    {
        id: 1,
        text: "Combien coûte réellement une voiture par mois en moyenne (achat, assurance, carburant, entretien) ?",
        options: ["200 €", "400 €", "600 €", "800 €"],
        correct: 2, // Index 0-based, donc "600 €"
        infoFile: "infos/q1.html"
    },
    {
        id: 2,
        text: "Quel pourcentage d'économie réalise-t-on en baissant son chauffage de 1°C ?",
        options: ["3%", "5%", "7%", "Ça dépend de l'isolation"],
        correct: 3,
        infoFile: "infos/q2.html"
    },
    {
        id: 3,
        text: "Combien de litres d'eau faut-il pour produire 1 kg de bœuf ?",
        options: ["1 500 L", "5 000 L", "10 000 L", "15 000 L"],
        correct: 3,
        infoFile: "infos/q3.html"
    },
    {
        id: 4,
        text: "Quelle est la durée de vie moyenne d'un smartphone en France ?",
        options: ["1 an", "2 ans", "3 ans", "5 ans"],
        correct: 1,
        infoFile: "infos/q4.html"
    },
    {
        id: 5,
        text: "Quel est le montant maximum du Forfait Mobilités Durables (FMD) ?",
        options: ["400 €/an", "600 €/an", "800 €/an", "900 €/an"],
        correct: 3,
        infoFile: "infos/q5.html"
    },
    {
        id: 6,
        text: "Quel mode de transport émet le moins de CO2 par km et par passager ?",
        options: ["Voiture électrique", "TER", "Bus urbain", "Tramway"],
        correct: 3,
        infoFile: "infos/q6.html"
    },
    {
        id: 7,
        text: "Combien économise-t-on par an en remplaçant 5 trajets voiture/semaine par le bus ?",
        options: ["500 €", "1 500 €", "3 000 €", "5 000 €"],
        correct: 2,
        infoFile: "infos/q7.html"
    },
    {
        id: 8,
        text: "Quelle part de l'empreinte carbone d'un smartphone vient de sa fabrication ?",
        options: ["30%", "50%", "70%", "80%"],
        correct: 3,
        infoFile: "infos/q8.html"
    },
    {
        id: 9,
        text: "Quel est le coût moyen d'un repas fait maison vs. livré ?",
        options: ["2x moins cher", "3x moins cher", "4x moins cher", "5x moins cher"],
        correct: 1,
        infoFile: "infos/q9.html"
    },
    {
        id: 10,
        text: "Combien de kg de CO2 évite-t-on par an en prenant les transports en commun au lieu de la voiture ?",
        options: ["500 kg", "1 000 kg", "1 500 kg", "2 000 kg"],
        correct: 2,
        infoFile: "infos/q10.html"
    }
];

/**
 * Calcule l'état actuel du quiz basé sur l'heure de référence
 * @param {number} referenceTime - Timestamp de début (ms) depuis le Sheet
 * @returns {Object} { questionIndex, phase, timeRemaining, totalElapsed }
 */
function getQuizState(referenceTime) {
    const now = Date.now();
    const elapsed = (now - referenceTime) / 1000; // en secondes
    
    const cycleLength = CONFIG.voteDuration + CONFIG.explainDuration;
    const totalCycleLength = cycleLength * QUESTIONS.length;
    
    // Position dans le cycle (avec boucle)
    const positionInTotal = elapsed % totalCycleLength;
    const questionIndex = Math.floor(positionInTotal / cycleLength);
    const positionInQuestion = positionInTotal % cycleLength;
    
    let phase, timeRemaining;
    
    if (positionInQuestion < CONFIG.voteDuration) {
        phase = 'vote';
        timeRemaining = CONFIG.voteDuration - positionInQuestion;
    } else {
        phase = 'explain';
        timeRemaining = cycleLength - positionInQuestion;
    }
    
    return {
        questionIndex,
        phase,
        timeRemaining: Math.ceil(timeRemaining),
        totalElapsed: Math.floor(elapsed),
        currentQuestion: QUESTIONS[questionIndex]
    };
}

/**
 * Formate un temps en secondes en MM:SS
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
