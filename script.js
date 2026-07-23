// 게임 상태 관리 객체
const gameState = {
    players: {
        p1: { name: "민우", score: 0 },
        p2: { name: "지아", score: 0 }
    },
    selectedGrade: null,
    selectedSemester: null, // 1 | 2
    selectedAreaId: null,
    selectedSubjects: [],
    playStyle: null, // 'battle' | 'coop'
    bossDifficulty: null, // 'easy' | 'normal' | 'hard'
    menuStep: "grade", // grade | semester | area | subjects | playstyle
    menuOpen: true,
    selectionReady: false,
    currentSubjectId: "add2",
    sharedScore: 0,
    coopVictory: false,
    boss: { maxHp: 0, hp: 0, difficulty: null },
    cards: [
        { formulaFront: "", formulaBack: "", answer: 0, isFlipped: false, subjectId: "" },
        { formulaFront: "", formulaBack: "", answer: 0, isFlipped: false, subjectId: "" }
    ]
};

const MENU_STEPS = [
    { id: "grade", label: "1. 학년" },
    { id: "semester", label: "2. 학기" },
    { id: "area", label: "3. 영역" },
    { id: "subjects", label: "4. 종목" },
    { id: "playstyle", label: "5. 방식" }
];

const BTN_BASE = "px-3.5 py-2 rounded-xl text-xs font-black border-2 transition-all duration-150 active:scale-95";
const BTN_IDLE = `${BTN_BASE} bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600`;
const BTN_ACTIVE = `${BTN_BASE} bg-indigo-500 border-indigo-400 text-white shadow-md`;
const BTN_PLAY_IDLE = "px-5 py-3 rounded-2xl font-jua text-base border-2 transition-all duration-150 active:scale-95 bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600";
const BTN_PLAY_ACTIVE = "px-5 py-3 rounded-2xl font-jua text-base border-2 transition-all duration-150 active:scale-95 bg-indigo-500 border-indigo-400 text-white shadow-md";

// 오디오 컨텍스트 (효과음 발생기)
let audioCtx = null;
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playBeep(type) {
    try {
        initAudio();
        const now = audioCtx.currentTime;

        if (type === 'success') {
            const freqs = [523.25, 659.25, 783.99, 1046.50];
            freqs.forEach((freq, index) => {
                const playTime = now + index * 0.07;
                const osc1 = audioCtx.createOscillator();
                const gain1 = audioCtx.createGain();
                osc1.type = 'sine';
                osc1.frequency.setValueAtTime(freq, playTime);
                
                const osc2 = audioCtx.createOscillator();
                const gain2 = audioCtx.createGain();
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(freq * 2, playTime);

                const mainGain = audioCtx.createGain();
                osc1.connect(gain1); gain1.connect(mainGain);
                osc2.connect(gain2); gain2.connect(mainGain);
                mainGain.connect(audioCtx.destination);

                gain1.gain.setValueAtTime(0.08, playTime);
                gain2.gain.setValueAtTime(0.02, playTime);
                mainGain.gain.setValueAtTime(0, playTime);
                mainGain.gain.linearRampToValueAtTime(0.12, playTime + 0.02);
                mainGain.gain.exponentialRampToValueAtTime(0.001, playTime + 0.35);

                osc1.start(playTime); osc2.start(playTime);
                osc1.stop(playTime + 0.4); osc2.stop(playTime + 0.4);
            });
        } else if (type === 'fail') {
            const playTap = (time) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(180, time);
                osc.frequency.exponentialRampToValueAtTime(110, time + 0.15);
                osc.connect(gain); gain.connect(audioCtx.destination);
                gain.gain.setValueAtTime(0, time);
                gain.gain.linearRampToValueAtTime(0.14, time + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.001, time + 0.16);
                osc.start(time); osc.stop(time + 0.2);
            };
            playTap(now); playTap(now + 0.08);
        } else if (type === 'flip') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.exponentialRampToValueAtTime(320, now + 0.18);
            osc.connect(gain); gain.connect(audioCtx.destination);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.06, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
            osc.start(now); osc.stop(now + 0.2);
        }
    } catch (e) {
        console.log("Audio play blocked or unsupported:", e);
    }
}

/* ========== 문제 선택 메뉴 (problemCatalog 기반) ========== */

function toggleSelectionMenu() {
    gameState.menuOpen = !gameState.menuOpen;
    playBeep('flip');
    updateMenuPanelVisibility();
}

function updateMenuPanelVisibility() {
    const panel = document.getElementById('selection-panel');
    const arrow = document.getElementById('menu-arrow');
    const label = document.getElementById('btn-toggle-menu-label');
    if (gameState.menuOpen) {
        panel.classList.add('is-open');
        arrow.style.transform = "rotate(180deg)";
        label.textContent = "설정 닫기";
    } else {
        panel.classList.remove('is-open');
        arrow.style.transform = "rotate(0deg)";
        label.textContent = "문제 설정";
    }
}

function setMenuStep(stepId) {
    const order = MENU_STEPS.map((s) => s.id);
    const targetIdx = order.indexOf(stepId);
    if (targetIdx < 0) return;

    if (stepId === "semester" && gameState.selectedGrade == null) return;
    if (stepId === "area" && (gameState.selectedGrade == null || gameState.selectedSemester == null)) return;
    if (stepId === "subjects" && (!gameState.selectedGrade || !gameState.selectedSemester || !gameState.selectedAreaId)) return;
    if (stepId === "playstyle" && gameState.selectedSubjects.length === 0) return;

    gameState.menuStep = stepId;
    playBeep('flip');
    renderSelectionMenu();
}

function getActivePlayMode() {
    if (gameState.playStyle === "coop") return CoopBossMode;
    return BattleMode;
}

function selectGrade(grade) {
    gameState.selectedGrade = Number(grade);
    gameState.selectedSemester = null;
    gameState.selectedAreaId = null;
    gameState.selectedSubjects = [];
    gameState.playStyle = null;
    gameState.bossDifficulty = null;
    gameState.selectionReady = false;
    gameState.menuStep = "semester";
    playBeep('flip');
    renderSelectionMenu();
    updateSelectionSummary();
    getActivePlayMode().updateUI(gameState);
}

function selectSemester(semester) {
    if (gameState.selectedGrade == null) return;
    gameState.selectedSemester = Number(semester);
    gameState.selectedAreaId = null;
    gameState.selectedSubjects = [];
    gameState.playStyle = null;
    gameState.bossDifficulty = null;
    gameState.selectionReady = false;
    gameState.menuStep = "area";
    playBeep('flip');
    renderSelectionMenu();
    updateSelectionSummary();
    getActivePlayMode().updateUI(gameState);
}

function selectArea(areaId) {
    if (gameState.selectedGrade == null || gameState.selectedSemester == null) return;
    gameState.selectedAreaId = areaId;
    gameState.selectedSubjects = [];
    gameState.playStyle = null;
    gameState.bossDifficulty = null;
    gameState.selectionReady = false;
    gameState.menuStep = "subjects";
    playBeep('flip');
    renderSelectionMenu();
    updateSelectionSummary();
    getActivePlayMode().updateUI(gameState);
}

function toggleSubject(subjectId) {
    const idx = gameState.selectedSubjects.indexOf(subjectId);
    if (idx >= 0) {
        gameState.selectedSubjects.splice(idx, 1);
    } else {
        gameState.selectedSubjects.push(subjectId);
    }
    gameState.playStyle = null;
    gameState.bossDifficulty = null;
    gameState.selectionReady = false;
    playBeep('flip');
    renderSelectionMenu();
    updateSelectionSummary();
    getActivePlayMode().updateUI(gameState);
}

function goToPlayStyleStep() {
    if (gameState.selectedSubjects.length === 0) {
        showMenuHint("세부 종목을 하나 이상 선택해 주세요!");
        return;
    }
    hideMenuHint();
    gameState.menuStep = "playstyle";
    playBeep('flip');
    renderSelectionMenu();
}

function selectPlayStyle(styleId) {
    if (gameState.selectedSubjects.length === 0) {
        showMenuHint("세부 종목을 하나 이상 선택해 주세요!");
        return;
    }

    gameState.playStyle = styleId;
    gameState.bossDifficulty = null;
    gameState.selectionReady = false;

    if (styleId === "coop") {
        playBeep('flip');
        renderSelectionMenu();
        updateSelectionSummary();
        return;
    }

    finishPlayStyleSelection();
}

function selectBossDifficulty(difficultyId) {
    if (gameState.playStyle !== "coop") return;
    gameState.bossDifficulty = difficultyId;
    finishPlayStyleSelection();
}

function finishPlayStyleSelection() {
    gameState.selectionReady = true;
    playBeep('success');
    applySelectionAndRefresh();
    renderSelectionMenu();
    updateSelectionSummary();

    gameState.menuOpen = false;
    updateMenuPanelVisibility();
}

function applySelectionAndRefresh() {
    const mode = getActivePlayMode();
    if (mode === CoopBossMode) {
        CoopBossMode.init(gameState, gameState.bossDifficulty || "easy");
    } else {
        BattleMode.init(gameState);
    }
    resetCard(0);
    resetCard(1);
    mode.updateUI(gameState);
}

function showMenuHint(msg) {
    const hint = document.getElementById('menu-hint');
    hint.textContent = msg;
    hint.classList.remove('hidden');
}

function hideMenuHint() {
    const hint = document.getElementById('menu-hint');
    hint.textContent = "";
    hint.classList.add('hidden');
}

function renderStepTabs() {
    const tabsEl = document.getElementById('menu-step-tabs');
    tabsEl.innerHTML = "";
    const order = MENU_STEPS.map((s) => s.id);
    const currentIdx = order.indexOf(gameState.menuStep);

    MENU_STEPS.forEach((step, idx) => {
        const btn = document.createElement('button');
        btn.type = "button";
        const reachable =
            step.id === "grade" ||
            (step.id === "semester" && gameState.selectedGrade != null) ||
            (step.id === "area" && gameState.selectedGrade != null && gameState.selectedSemester != null) ||
            (step.id === "subjects" && gameState.selectedAreaId) ||
            (step.id === "playstyle" && gameState.selectedSubjects.length > 0);

        const isCurrent = step.id === gameState.menuStep;
        btn.className = isCurrent
            ? "px-3 py-1.5 rounded-full text-xs font-black bg-indigo-500 text-white border border-indigo-300"
            : reachable
                ? "px-3 py-1.5 rounded-full text-xs font-black bg-slate-700 text-slate-200 border border-slate-500 hover:bg-slate-600"
                : "px-3 py-1.5 rounded-full text-xs font-black bg-slate-800 text-slate-500 border border-slate-700 opacity-60 cursor-not-allowed";

        if (idx < currentIdx && reachable) {
            btn.className = "px-3 py-1.5 rounded-full text-xs font-black bg-emerald-700 text-emerald-100 border border-emerald-500 hover:bg-emerald-600";
        }

        btn.textContent = step.label;
        if (reachable) {
            btn.onclick = () => setMenuStep(step.id);
        }
        tabsEl.appendChild(btn);
    });
}

function renderSelectionMenu() {
    renderStepTabs();
    hideMenuHint();

    const titleEl = document.getElementById('menu-step-title');
    const optionsEl = document.getElementById('menu-options');
    const actionsEl = document.getElementById('menu-actions');
    optionsEl.innerHTML = "";
    actionsEl.innerHTML = "";

    if (gameState.menuStep === "grade") {
        titleEl.textContent = "1. 학년을 선택하세요";
        SELECTABLE_GRADES.forEach((grade) => {
            const gradeEntry = getGradeEntry(grade);
            const btn = document.createElement('button');
            btn.type = "button";
            btn.className = gameState.selectedGrade === grade ? BTN_ACTIVE : BTN_IDLE;
            btn.textContent = gradeEntry ? gradeEntry.label : `${grade}학년`;
            btn.onclick = () => selectGrade(grade);
            optionsEl.appendChild(btn);
        });
        return;
    }

    if (gameState.menuStep === "semester") {
        titleEl.textContent = "2. 학기를 선택하세요";
        semesterOptions.forEach((sem) => {
            const btn = document.createElement('button');
            btn.type = "button";
            btn.className = gameState.selectedSemester === sem.id ? BTN_ACTIVE : BTN_IDLE;
            btn.textContent = sem.label;
            btn.onclick = () => selectSemester(sem.id);
            optionsEl.appendChild(btn);
        });

        const backBtn = document.createElement('button');
        backBtn.type = "button";
        backBtn.className = "px-4 py-2 rounded-xl text-xs font-bold bg-slate-600 text-white border border-slate-500 hover:bg-slate-500";
        backBtn.textContent = "← 학년으로";
        backBtn.onclick = () => setMenuStep("grade");
        actionsEl.appendChild(backBtn);
        return;
    }

    if (gameState.menuStep === "area") {
        titleEl.textContent = "3. 영역을 선택하세요";
        const areas = getAreasForGradeSemester(gameState.selectedGrade, gameState.selectedSemester);

        const backBtn = document.createElement('button');
        backBtn.type = "button";
        backBtn.className = "px-4 py-2 rounded-xl text-xs font-bold bg-slate-600 text-white border border-slate-500 hover:bg-slate-500";
        backBtn.textContent = "← 학기로";
        backBtn.onclick = () => setMenuStep("semester");

        if (areas.length === 0) {
            const notice = document.createElement('div');
            notice.className = "w-full text-center text-amber-200 font-jua text-lg py-4";
            notice.textContent = "🚧 문제 준비 중이에요! 다른 학년/학기를 선택해 주세요.";
            optionsEl.appendChild(notice);
            actionsEl.appendChild(backBtn);
            return;
        }

        areas.forEach((area) => {
            const btn = document.createElement('button');
            btn.type = "button";
            btn.className = gameState.selectedAreaId === area.id ? BTN_ACTIVE : BTN_IDLE;
            btn.textContent = area.label;
            btn.onclick = () => selectArea(area.id);
            optionsEl.appendChild(btn);
        });

        actionsEl.appendChild(backBtn);
        return;
    }

    if (gameState.menuStep === "subjects") {
        titleEl.textContent = "4. 세부 종목을 선택하세요 (여러 개 가능)";
        const subjects = getSubjectsForGradeAreaSemester(gameState.selectedGrade, gameState.selectedAreaId, gameState.selectedSemester);
        if (!subjects.length) return;

        subjects.forEach((subject) => {
            const btn = document.createElement('button');
            btn.type = "button";
            const selected = gameState.selectedSubjects.includes(subject.id);
            btn.className = selected ? BTN_ACTIVE : BTN_IDLE;
            btn.textContent = (selected ? "✓ " : "") + subject.label;
            btn.onclick = () => toggleSubject(subject.id);
            optionsEl.appendChild(btn);
        });

        const backBtn = document.createElement('button');
        backBtn.type = "button";
        backBtn.className = "px-4 py-2 rounded-xl text-xs font-bold bg-slate-600 text-white border border-slate-500 hover:bg-slate-500";
        backBtn.textContent = "← 영역으로";
        backBtn.onclick = () => setMenuStep("area");
        actionsEl.appendChild(backBtn);

        const nextBtn = document.createElement('button');
        nextBtn.type = "button";
        nextBtn.className = "px-4 py-2 rounded-xl text-xs font-black bg-indigo-600 text-white border border-indigo-400 hover:bg-indigo-500";
        nextBtn.textContent = `다음: 게임 방식 (${gameState.selectedSubjects.length}개 선택)`;
        nextBtn.onclick = goToPlayStyleStep;
        actionsEl.appendChild(nextBtn);
        return;
    }

    if (gameState.menuStep === "playstyle") {
        if (gameState.playStyle === "coop" && !gameState.selectionReady) {
            titleEl.textContent = "5. 보스전 난이도를 선택하세요";
            Object.values(BOSS_DIFFICULTIES).forEach((diff) => {
                const btn = document.createElement('button');
                btn.type = "button";
                btn.className = gameState.bossDifficulty === diff.id ? BTN_PLAY_ACTIVE : BTN_PLAY_IDLE;
                btn.innerHTML = `<div>${diff.label}</div><div class="text-[11px] font-nanum opacity-80 mt-1">${diff.description}</div>`;
                btn.onclick = () => selectBossDifficulty(diff.id);
                optionsEl.appendChild(btn);
            });

            const backBtn = document.createElement('button');
            backBtn.type = "button";
            backBtn.className = "px-4 py-2 rounded-xl text-xs font-bold bg-slate-600 text-white border border-slate-500 hover:bg-slate-500";
            backBtn.textContent = "← 게임 방식으로";
            backBtn.onclick = () => {
                gameState.playStyle = null;
                gameState.bossDifficulty = null;
                renderSelectionMenu();
                updateSelectionSummary();
            };
            actionsEl.appendChild(backBtn);
            return;
        }

        titleEl.textContent = "5. 게임 방식을 선택하세요";
        playStyleOptions.forEach((opt) => {
            const btn = document.createElement('button');
            btn.type = "button";
            btn.className = gameState.playStyle === opt.id ? BTN_PLAY_ACTIVE : BTN_PLAY_IDLE;
            btn.innerHTML = `<div>${opt.label}</div><div class="text-[11px] font-nanum opacity-80 mt-1">${opt.description}</div>`;
            btn.onclick = () => selectPlayStyle(opt.id);
            optionsEl.appendChild(btn);
        });

        const backBtn = document.createElement('button');
        backBtn.type = "button";
        backBtn.className = "px-4 py-2 rounded-xl text-xs font-bold bg-slate-600 text-white border border-slate-500 hover:bg-slate-500";
        backBtn.textContent = "← 종목으로";
        backBtn.onclick = () => setMenuStep("subjects");
        actionsEl.appendChild(backBtn);
    }
}

function updateSelectionSummary() {
    const el = document.getElementById('selection-summary');
    const gradeEntry = getGradeEntry(gameState.selectedGrade);
    const semesterEntry = semesterOptions.find((s) => s.id === gameState.selectedSemester);
    const area = gameState.selectedAreaId
        ? getAreasForGradeSemester(gameState.selectedGrade, gameState.selectedSemester).find((a) => a.id === gameState.selectedAreaId)
        : null;
    const style = playStyleOptions.find((p) => p.id === gameState.playStyle);

    if (!gradeEntry) {
        el.textContent = "① 학년 → ② 학기 → ③ 영역 → ④ 종목(복수) → ⑤ 게임 방식을 선택하세요";
        return;
    }

    const parts = [`📚 ${gradeEntry.label}`];
    if (semesterEntry) parts.push(`🗓️ ${semesterEntry.label}`);
    if (area) parts.push(`📂 ${area.label}`);
    if (gameState.selectedSubjects.length) {
        const names = gameState.selectedSubjects.map(getSubjectLabel);
        const preview = names.length <= 2 ? names.join(", ") : `${names.slice(0, 2).join(", ")} 외 ${names.length - 2}개`;
        parts.push(`✏️ ${preview}`);
    }
    if (style) {
        if (gameState.playStyle === "coop" && gameState.bossDifficulty) {
            const diff = CoopBossMode.getDifficulty(gameState.bossDifficulty);
            parts.push(`🎮 ${style.label} (${diff.label})`);
        } else {
            parts.push(`🎮 ${style.label}`);
        }
    } else if (gameState.selectedSubjects.length) parts.push("🎮 방식 미선택");

    el.textContent = parts.join("  ·  ");
}

function startGame() {
    const p1Val = document.getElementById('p1-input').value.trim();
    const p2Val = document.getElementById('p2-input').value.trim();
    const warningEl = document.getElementById('warning-msg');

    if (!p1Val || !p2Val) {
        warningEl.classList.remove('hidden');
        return;
    }

    warningEl.classList.add('hidden');
    gameState.players.p1.name = p1Val;
    gameState.players.p2.name = p2Val;
    gameState.players.p1.score = 0;
    gameState.players.p2.score = 0;

    document.getElementById('p1-score-label').textContent = p1Val;
    document.getElementById('p2-score-label').textContent = p2Val;
    
    const p1Labels = document.querySelectorAll('.p1-name');
    const p2Labels = document.querySelectorAll('.p2-name');
    p1Labels.forEach(el => el.textContent = p1Val);
    p2Labels.forEach(el => el.textContent = p2Val);

    if (gameState.selectionReady && gameState.selectedSubjects.length) {
        resetCard(0);
        resetCard(1);
    }
    updateScoreUI();
    getActivePlayMode().updateUI(gameState);

    document.getElementById('setup-screen').classList.add('hidden');
    initAudio();
}

function resetCard(cardIdx) {
    if (!gameState.selectedSubjects.length) {
        document.getElementById(`card-tag-front-${cardIdx}`).textContent = "종목 미선택";
        document.getElementById(`card-formula-${cardIdx}`).innerHTML = "-- + --";
        document.getElementById(`card-formula-back-${cardIdx}`).innerHTML = "-- + --";
        document.getElementById(`card-answer-${cardIdx}`).innerHTML = "--";
        document.getElementById(`card-inner-${cardIdx}`).classList.remove('is-flipped');
        toggleScoreButtons(cardIdx, false);
        return;
    }

    const problem = generateMathProblem();
    gameState.cards[cardIdx] = {
        formulaFront: problem.formulaFront,
        formulaBack: problem.formulaBack,
        answer: problem.answer,
        isFlipped: false,
        subjectId: problem.subjectId
    };
    gameState.currentSubjectId = problem.subjectId;

    const cardInner = document.getElementById(`card-inner-${cardIdx}`);
    cardInner.classList.remove('is-flipped');

    document.getElementById(`card-tag-front-${cardIdx}`).textContent = getSubjectLabel(problem.subjectId);
    document.getElementById(`card-formula-${cardIdx}`).innerHTML = problem.formulaFront;
    document.getElementById(`card-formula-back-${cardIdx}`).innerHTML = problem.formulaBack;
    document.getElementById(`card-answer-${cardIdx}`).innerHTML = problem.answer;

    toggleScoreButtons(cardIdx, false);
}

function flipCard(cardIdx) {
    if (!gameState.selectionReady || !gameState.selectedSubjects.length) {
        gameState.menuOpen = true;
        updateMenuPanelVisibility();
        showMenuHint("학년 → 학기 → 영역 → 종목 → 게임 방식을 먼저 선택해 주세요!");
        return;
    }

    if (!getActivePlayMode().canContinue(gameState)) return;

    const card = gameState.cards[cardIdx];
    if (card.isFlipped) return;

    playBeep('flip');
    card.isFlipped = true;
    
    const cardInner = document.getElementById(`card-inner-${cardIdx}`);
    cardInner.classList.add('is-flipped');

    toggleScoreButtons(cardIdx, true);
}

function toggleScoreButtons(cardIdx, enable) {
    const p1Correct = document.getElementById(`p1-card${cardIdx}-correct`);
    const p1Wrong = document.getElementById(`p1-card${cardIdx}-wrong`);
    const p2Correct = document.getElementById(`p2-card${cardIdx}-correct`);
    const p2Wrong = document.getElementById(`p2-card${cardIdx}-wrong`);

    if (enable) {
        p1Correct.removeAttribute('disabled'); p1Wrong.removeAttribute('disabled');
        p2Correct.removeAttribute('disabled'); p2Wrong.removeAttribute('disabled');
    } else {
        p1Correct.setAttribute('disabled', 'true'); p1Wrong.setAttribute('disabled', 'true');
        p2Correct.setAttribute('disabled', 'true'); p2Wrong.setAttribute('disabled', 'true');
    }
}

function scoreAction(cardIdx, playerNum, isCorrect) {
    if (!gameState.cards[cardIdx].isFlipped) return;

    const mode = getActivePlayMode();
    if (!mode.canContinue(gameState)) return;

    if (isCorrect) {
        mode.onCorrect(gameState, playerNum);
    } else {
        mode.onWrong(gameState, playerNum);
    }

    if (mode === BattleMode) {
        updateScoreUI();
    }

    const cardInner = document.getElementById(`card-inner-${cardIdx}`);
    cardInner.classList.remove('is-flipped');

    toggleScoreButtons(cardIdx, false);

    if (mode.canContinue(gameState)) {
        setTimeout(() => {
            resetCard(cardIdx);
        }, 200);
    }
}

function showFloatingFeedback(playerNum, text, colorClass) {
    const scoreDisplayId = playerNum === 1 ? 'p1-score-display' : 'p2-score-display';
    const displayEl = document.getElementById(scoreDisplayId);
    
    displayEl.classList.add('scale-110', 'transition-transform', 'duration-100');
    setTimeout(() => displayEl.classList.remove('scale-110'), 150);

    const rect = displayEl.getBoundingClientRect();
    const badge = document.createElement('div');
    badge.className = `fixed font-jua text-2xl ${colorClass} pointer-events-none z-50 transition-all duration-1000 ease-out opacity-100 filter drop-shadow-md`;
    badge.style.left = `${rect.left + rect.width / 2 - 20}px`;
    badge.style.top = `${rect.top - 20}px`;
    badge.textContent = text;
    
    document.body.appendChild(badge);
    
    setTimeout(() => {
        badge.style.transform = "translateY(-40px)";
        badge.style.opacity = "0";
    }, 50);

    setTimeout(() => { badge.remove(); }, 1050);
}

function updateScoreUI() {
    document.getElementById('p1-score-display').textContent = `${gameState.players.p1.score} 점`;
    document.getElementById('p2-score-display').textContent = `${gameState.players.p2.score} 점`;
}

function resetGame() {
    document.getElementById('victory-screen').classList.add('hidden');
    gameState.coopVictory = false;
    const setupScreen = document.getElementById('setup-screen');
    setupScreen.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    BattleMode.init(gameState);
    BattleMode.updateUI(gameState);
    renderSelectionMenu();
    updateSelectionSummary();
    updateMenuPanelVisibility();
});
