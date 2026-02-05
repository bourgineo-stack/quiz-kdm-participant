<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Éco-Quiz KDM</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --divia-magenta: #D2007A;
            --divia-magenta-dark: #A80062;
            --divia-magenta-light: #F5E6EF;
            --divia-purple: #2D1B4E;
            --team-blue: #1E88E5;
            --team-blue-light: #E3F2FD;
            --team-red: #E53935;
            --team-red-light: #FFEBEE;
            --gray-light: #F6F2F2;
            --gray-dark: #333333;
            --success: #43A047;
            --warning: #FFA726;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

        body {
            font-family: 'Nunito', -apple-system, BlinkMacSystemFont, sans-serif;
            background: var(--divia-purple);
            min-height: 100vh;
            color: var(--gray-dark);
        }

        .screen { display: none; min-height: 100vh; }
        .screen.active { display: flex; flex-direction: column; }

        /* Header */
        .header {
            background: var(--divia-magenta);
            padding: 1.5rem 1rem 2.5rem;
            text-align: center;
            position: relative;
        }
        .header::after {
            content: '';
            position: absolute;
            bottom: 0; left: 0; right: 0;
            height: 30px;
            background: var(--divia-purple);
            border-radius: 30px 30px 0 0;
        }
        .header-logo { font-size: 0.8rem; color: rgba(255,255,255,0.8); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 0.3rem; }
        .header h1 { color: white; font-size: 1.6rem; font-weight: 800; }

        .container { flex: 1; padding: 1.5rem 1rem; background: var(--divia-purple); }

        .card {
            background: white;
            border-radius: 20px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        .card-title {
            font-size: 1.1rem; font-weight: 700; color: var(--divia-purple);
            margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;
        }
        .card-title::before { content: ''; width: 4px; height: 20px; background: var(--divia-magenta); border-radius: 2px; }

        /* Pseudo généré */
        .pseudo-display { text-align: center; margin-bottom: 1.5rem; }
        .generated-pseudo {
            font-size: 2rem; font-weight: 800; color: var(--divia-purple);
            background: var(--gray-light); padding: 1rem 1.5rem;
            border-radius: 12px; display: inline-block; margin-bottom: 0.8rem;
        }
        .btn-refresh {
            background: transparent; border: 2px solid #E0E0E0; border-radius: 8px;
            padding: 0.5rem 1rem; font-family: inherit; font-size: 0.85rem;
            color: #666; cursor: pointer; transition: all 0.3s ease;
        }
        .btn-refresh:hover { border-color: var(--divia-magenta); color: var(--divia-magenta); }

        /* Boutons */
        .btn {
            width: 100%; padding: 1rem; border: none; border-radius: 12px;
            font-size: 1rem; font-weight: 700; font-family: inherit; cursor: pointer;
            transition: all 0.3s ease;
        }
        .btn-primary { background: var(--divia-magenta); color: white; }
        .btn-primary:hover { background: var(--divia-magenta-dark); }
        .btn-primary:disabled { background: #CCC; cursor: not-allowed; }

        /* Tirage au sort */
        .lottery-wheel {
            width: 180px; height: 180px; margin: 1.5rem auto;
            border-radius: 50%;
            background: conic-gradient(var(--team-blue) 0deg 180deg, var(--team-red) 180deg 360deg);
            position: relative;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            animation: spin 3s cubic-bezier(0.17, 0.67, 0.12, 0.99) forwards;
        }
        .lottery-wheel::before {
            content: ''; position: absolute; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 50px; height: 50px; background: white; border-radius: 50%;
        }
        .lottery-wheel::after {
            content: ''; position: absolute; top: -12px; left: 50%;
            transform: translateX(-50%);
            border: 12px solid transparent; border-bottom: 20px solid white;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(var(--final-rotation, 1800deg)); } }

        .team-result { text-align: center; padding: 1rem 0; }
        .team-badge {
            width: 120px; height: 120px; border-radius: 50%; margin: 0 auto 1rem;
            display: flex; align-items: center; justify-content: center;
            font-size: 3.5rem; animation: popIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        .team-badge.blue { background: linear-gradient(135deg, var(--team-blue) 0%, #1565C0 100%); }
        .team-badge.red { background: linear-gradient(135deg, var(--team-red) 0%, #C62828 100%); }
        @keyframes popIn { 0% { transform: scale(0); } 100% { transform: scale(1); } }

        .team-name { font-size: 1.5rem; font-weight: 800; }
        .team-name.blue { color: var(--team-blue); }
        .team-name.red { color: var(--team-red); }
        .team-slogan { color: #666; font-size: 0.9rem; margin-bottom: 1.5rem; }

        /* Game header */
        .game-header {
            background: var(--divia-magenta); padding: 1rem;
            display: flex; justify-content: space-between; align-items: center; color: white;
        }
        .team-indicator { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; }
        .team-dot { width: 12px; height: 12px; border-radius: 50%; }
        .team-dot.blue { background: var(--team-blue); }
        .team-dot.red { background: var(--team-red); }
        .timer { font-size: 1.3rem; font-weight: 800; font-variant-numeric: tabular-nums; }
        .timer.warning { color: var(--warning); }
        .timer.danger { color: var(--team-red); animation: pulse 0.5s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }

        .phase-bar { background: rgba(0,0,0,0.2); padding: 0.6rem 1rem; text-align: center; color: white; font-weight: 600; font-size: 0.85rem; }
        .phase-bar.vote { background: var(--divia-magenta-dark); }
        .phase-bar.explain { background: var(--success); }

        /* Question */
        .question-card { background: white; margin: 1rem; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
        .question-header { background: var(--gray-light); padding: 1rem; display: flex; justify-content: space-between; align-items: center; }
        .question-number { background: var(--divia-magenta); color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem; font-weight: 700; }
        .question-body { padding: 1.2rem; }
        .question-text { font-size: 1.1rem; font-weight: 700; color: var(--divia-purple); line-height: 1.4; margin-bottom: 1.2rem; }

        .options { display: grid; gap: 0.6rem; }
        .option-btn {
            width: 100%; padding: 1rem; background: white; border: 2px solid #E0E0E0;
            border-radius: 12px; font-size: 1rem; font-family: inherit; font-weight: 600;
            color: var(--gray-dark); cursor: pointer; transition: all 0.2s ease;
            text-align: left; display: flex; align-items: center; gap: 0.8rem;
        }
        .option-btn .letter {
            width: 32px; height: 32px; border-radius: 50%; background: var(--gray-light);
            display: flex; align-items: center; justify-content: center; font-weight: 800; flex-shrink: 0;
        }
        .option-btn:active { transform: scale(0.98); }
        .option-btn.selected { border-color: var(--divia-magenta); background: var(--divia-magenta-light); }
        .option-btn.selected .letter { background: var(--divia-magenta); color: white; }
        .option-btn.correct { border-color: var(--success); background: #E8F5E9; }
        .option-btn.correct .letter { background: var(--success); color: white; }
        .option-btn.wrong { border-color: var(--team-red); background: #FFEBEE; opacity: 0.6; }
        .option-btn:disabled { cursor: default; }

        .status-message { text-align: center; padding: 1rem; font-weight: 600; color: #666; }
        .status-message.success { color: var(--success); }

        /* Info panel */
        .info-panel { margin: 0 1rem 1rem; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
        .info-header { background: var(--success); color: white; padding: 1rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; }
        .info-content { padding: 1.2rem; font-size: 0.95rem; line-height: 1.6; color: var(--gray-dark); }
        .info-content .highlight { background: var(--divia-magenta); color: white; padding: 0.1rem 0.4rem; border-radius: 4px; font-weight: 700; }
        .info-content table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.85rem; }
        .info-content th, .info-content td { padding: 0.6rem; border: 1px solid #E0E0E0; text-align: left; }
        .info-content th { background: var(--gray-light); font-weight: 700; }

        /* Loading */
        .loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: var(--divia-purple); color: white; text-align: center; padding: 2rem; }
        .loading-spinner { width: 60px; height: 60px; border: 4px solid rgba(255,255,255,0.2); border-top-color: var(--divia-magenta); border-radius: 50%; animation: spinner 1s linear infinite; margin-bottom: 1.5rem; }
        @keyframes spinner { to { transform: rotate(360deg); } }
        .loading-text { font-size: 1.1rem; font-weight: 600; }
        .error-message { background: var(--team-red); color: white; padding: 1rem; border-radius: 12px; margin: 1rem; text-align: center; font-weight: 600; }
    </style>
</head>
<body>
    <!-- Loading -->
    <div class="loading" id="loading-screen">
        <div class="loading-spinner"></div>
        <div class="loading-text">Connexion au quiz...</div>
    </div>

    <!-- Inscription -->
    <div class="screen" id="register-screen">
        <header class="header">
            <div class="header-logo">Keolis Dijon Métropole</div>
            <h1>🌱 Éco-Quiz</h1>
        </header>
        <div class="container">
            <div class="card">
                <h2 class="card-title">Bienvenue !</h2>
                <div class="pseudo-display">
                    <p style="font-size: 0.9rem; color: #666; margin-bottom: 0.8rem;">Votre pseudo :</p>
                    <div class="generated-pseudo" id="generated-pseudo">Chargement...</div>
                    <button class="btn-refresh" id="btn-refresh">🔄 Autre pseudo</button>
                </div>
                <button class="btn btn-primary" id="btn-join">🎲 Tirer mon équipe</button>
            </div>
        </div>
    </div>

    <!-- Tirage -->
    <div class="screen" id="lottery-screen">
        <header class="header">
            <div class="header-logo">Keolis Dijon Métropole</div>
            <h1>🌱 Éco-Quiz</h1>
        </header>
        <div class="container">
            <div class="card">
                <h2 class="card-title">Tirage au sort</h2>
                <div id="lottery-anim">
                    <div class="lottery-wheel" id="wheel"></div>
                    <p style="text-align: center; color: #666; margin-top: 1rem;">La roue tourne...</p>
                </div>
                <div class="team-result" id="team-result" style="display: none;">
                    <div class="team-badge" id="team-badge">🚌</div>
                    <h3 class="team-name" id="team-name">Équipe Bleue</h3>
                    <p class="team-slogan" id="team-slogan">Les Éco-conducteurs</p>
                    <button class="btn btn-primary" id="btn-start">✓ C'est parti !</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Jeu -->
    <div class="screen" id="game-screen">
        <header class="game-header">
            <div class="team-indicator">
                <div class="team-dot" id="game-team-dot"></div>
                <span id="game-pseudo">Pseudo</span>
            </div>
            <div class="timer" id="game-timer">2:00</div>
        </header>
        <div class="phase-bar vote" id="phase-bar">⏱️ Phase de vote</div>

        <div id="vote-phase">
            <div class="question-card">
                <div class="question-header">
                    <span class="question-number">Question <span id="q-num">1</span>/<span id="q-total">10</span></span>
                </div>
                <div class="question-body">
                    <div class="question-text" id="question-text">Chargement...</div>
                    <div class="options" id="options-container"></div>
                    <div class="status-message" id="status-message"></div>
                </div>
            </div>
        </div>

        <div id="explain-phase" style="display: none;">
            <div class="question-card">
                <div class="question-header">
                    <span class="question-number">Question <span id="q-num-explain">1</span>/<span id="q-total-explain">10</span></span>
                    <span style="color: var(--success); font-weight: 700;">✓ Terminé</span>
                </div>
                <div class="question-body">
                    <div class="question-text" id="question-text-explain"></div>
                    <div class="options" id="options-reveal"></div>
                </div>
            </div>
            <div class="info-panel">
                <div class="info-header">💡 Le saviez-vous ?</div>
                <div class="info-content" id="info-content"></div>
            </div>
        </div>
    </div>

    <script src="config.js"></script>
    <script>
        // === ÉTAT ===
        const state = {
            referenceTime: null,
            player: { pseudo: '', team: null },
            currentAnswer: null,
            lastQuestionIndex: -1,
            submitted: false
        };

        const $ = id => document.getElementById(id);

        // === PSEUDO ===
        const PSEUDO_WORDS = ['Vélo', 'Tram', 'Bus', 'Trottinette', 'Marche', 'Covoit', 'Solaire', 'Éolien', 'Isolation', 'Pull', 'Gourde', 'Compost'];
        function generatePseudo() {
            const word = PSEUDO_WORDS[Math.floor(Math.random() * PSEUDO_WORDS.length)];
            const number = Math.floor(Math.random() * 900) + 100;
            return `${word}${number}`;
        }

        // === INIT ===
        async function init() {
            try {
                const loaded = await loadConfigFromSheet();
                if (!loaded || QUESTIONS.length === 0) {
                    throw new Error('Impossible de charger les questions');
                }

                state.referenceTime = SETTINGS.startTime || Date.now();
                state.player.pseudo = generatePseudo();
                $('generated-pseudo').textContent = state.player.pseudo;

                $('loading-screen').style.display = 'none';
                $('register-screen').classList.add('active');

                setupEvents();
            } catch (error) {
                console.error('Erreur init:', error);
                $('loading-screen').innerHTML = `<div class="error-message">Erreur de connexion. Rechargez la page.</div>`;
            }
        }

        function setupEvents() {
            $('btn-refresh').addEventListener('click', () => {
                state.player.pseudo = generatePseudo();
                $('generated-pseudo').textContent = state.player.pseudo;
            });

            $('btn-join').addEventListener('click', showLottery);
            $('btn-start').addEventListener('click', startGame);
        }

        function showLottery() {
            $('register-screen').classList.remove('active');
            $('lottery-screen').classList.add('active');

            state.player.team = Math.random() > 0.5 ? 'blue' : 'red';
            const rotation = 1800 + (state.player.team === 'blue' ? 45 : 225) + (Math.random() * 60 - 30);
            $('wheel').style.setProperty('--final-rotation', `${rotation}deg`);

            setTimeout(() => {
                $('lottery-anim').style.display = 'none';
                $('team-result').style.display = 'block';
                $('team-badge').className = `team-badge ${state.player.team}`;
                $('team-badge').textContent = state.player.team === 'blue' ? '🚌' : '🚋';
                $('team-name').className = `team-name ${state.player.team}`;
                $('team-name').textContent = state.player.team === 'blue' ? 'Équipe Bleue' : 'Équipe Rouge';
            }, 3500);
        }

        async function startGame() {
            // Inscrire le participant
            try {
                await fetch(CONFIG.sheetUrl, {
                    method: 'POST', mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'register', pseudo: state.player.pseudo, team: state.player.team })
                });
            } catch (e) { console.error('Erreur inscription:', e); }

            $('lottery-screen').classList.remove('active');
            $('game-screen').classList.add('active');
            $('game-pseudo').textContent = state.player.pseudo;
            $('game-team-dot').className = `team-dot ${state.player.team}`;
            $('q-total').textContent = QUESTIONS.length;
            $('q-total-explain').textContent = QUESTIONS.length;

            startGameLoop();
        }

        function startGameLoop() {
            updateGame();
            setInterval(updateGame, 500);
        }

        function updateGame() {
            // Recharger le startTime périodiquement pour rester synchro
            const quizState = getQuizState(state.referenceTime);

            if (quizState.questionIndex !== state.lastQuestionIndex) {
                state.lastQuestionIndex = quizState.questionIndex;
                state.currentAnswer = null;
                state.submitted = false;
                onQuestionChange(quizState);
            }

            updateTimer(quizState);
            updatePhase(quizState);
        }

        function onQuestionChange(quizState) {
            const q = quizState.currentQuestion;
            if (!q) return;

            $('q-num').textContent = quizState.questionIndex + 1;
            $('question-text').textContent = q.text;
            $('status-message').textContent = '';

            const letters = ['A', 'B', 'C', 'D'];
            $('options-container').innerHTML = q.options.map((opt, i) => `
                <button class="option-btn" data-index="${i}">
                    <span class="letter">${letters[i]}</span>
                    <span>${opt}</span>
                </button>
            `).join('');

            $('options-container').querySelectorAll('.option-btn').forEach(btn => {
                btn.addEventListener('click', () => handleAnswer(parseInt(btn.dataset.index), quizState));
            });
        }

        async function handleAnswer(index, quizState) {
            if (state.submitted || quizState.phase === 'explain') return;

            state.currentAnswer = index;
            state.submitted = true;

            $('options-container').querySelectorAll('.option-btn').forEach((btn, i) => {
                btn.classList.toggle('selected', i === index);
            });

            $('status-message').textContent = '✓ Réponse enregistrée';
            $('status-message').className = 'status-message success';

            try {
                await fetch(CONFIG.sheetUrl, {
                    method: 'POST', mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'answer',
                        pseudo: state.player.pseudo,
                        team: state.player.team,
                        questionId: quizState.currentQuestion.id,
                        answer: index
                    })
                });
            } catch (e) { console.error('Erreur réponse:', e); }
        }

        function updateTimer(quizState) {
            const timer = $('game-timer');
            timer.textContent = formatTime(quizState.timeRemaining);
            timer.className = 'timer';
            if (quizState.phase === 'vote') {
                if (quizState.timeRemaining <= 10) timer.classList.add('danger');
                else if (quizState.timeRemaining <= 30) timer.classList.add('warning');
            }
        }

        function updatePhase(quizState) {
            const q = quizState.currentQuestion;
            if (!q) return;

            const phaseBar = $('phase-bar');
            phaseBar.className = `phase-bar ${quizState.phase}`;
            phaseBar.textContent = quizState.phase === 'vote' ? '⏱️ Phase de vote' : '💡 Explication';

            $('vote-phase').style.display = quizState.phase === 'vote' ? 'block' : 'none';
            $('explain-phase').style.display = quizState.phase === 'explain' ? 'block' : 'none';

            if (quizState.phase === 'explain') {
                showExplanation(quizState);
            }
        }

        function showExplanation(quizState) {
            const q = quizState.currentQuestion;
            $('q-num-explain').textContent = quizState.questionIndex + 1;
            $('question-text-explain').textContent = q.text;

            const letters = ['A', 'B', 'C', 'D'];
            $('options-reveal').innerHTML = q.options.map((opt, i) => {
                let cls = 'option-btn';
                if (i === q.correct) cls += ' correct';
                else if (state.currentAnswer === i) cls += ' wrong';
                return `<button class="${cls}" disabled><span class="letter">${letters[i]}</span><span>${opt}</span></button>`;
            }).join('');

            $('info-content').innerHTML = q.info || '<p>Information non disponible.</p>';
        }

        document.addEventListener('DOMContentLoaded', init);
    </script>
</body>
</html>
