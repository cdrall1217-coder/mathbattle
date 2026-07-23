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
    ],
    // 교사용 학습 범위 제한(learningScope.js) 관련 상태.
    // learningScope: validateLearningScope()의 결과 객체 또는 null(제한 없음).
    learningScope: null,
    // scopeBlocked: 제한 링크가 걸려 있는데 허용 가능한 문제가 하나도 없는 경우 true.
    // true인 동안에는 게임을 시작할 수 없다.
    scopeBlocked: false
};

const MENU_STEPS = [
    { id: "grade", shortLabel: "학년" },
    { id: "semester", shortLabel: "학기" },
    { id: "area", shortLabel: "영역" },
    { id: "subjects", shortLabel: "종목" },
    { id: "playstyle", shortLabel: "방식" }
];

const STEP_ORDER = MENU_STEPS.map((s) => s.id);

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
    const targetIdx = STEP_ORDER.indexOf(stepId);
    if (targetIdx < 0) return;

    // 학습 범위 제한으로 잠긴 단계에는 (탭 클릭 등으로도) 진입할 수 없다.
    if (isStepLocked(stepId)) return;

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

/* ========== 학습 범위 제한(교사용 링크) 연동 헬퍼 ==========
 * 필터링/검증 로직 자체는 learningScope.js 의 순수 함수만 사용하고,
 * 여기서는 그 결과를 화면 상태(gameState)에 반영하는 역할만 한다. */

function isGradeLocked() {
    const scope = gameState.learningScope;
    return !!(scope && scope.active && scope.isValid);
}

function isSemesterLocked() {
    const scope = gameState.learningScope;
    return !!(scope && scope.active && scope.isValid && scope.semester != null);
}

function isAreaLocked() {
    const scope = gameState.learningScope;
    if (!scope || !scope.active || !scope.isValid) return false;
    if (scope.area) return true;
    // 영역 자체는 지정하지 않았어도, topics 제한으로 인해 영역이 사실상 하나로만
    // 좁혀지는 경우(예: 특정 영역의 종목 2개만 지정)에도 영역 단계를 자동 확정한다.
    if (scope.topics && scope.topics.length && gameState.selectedSemester != null) {
        const areaIds = new Set(
            scope.allowedSubjects.filter((s) => s.semester === gameState.selectedSemester).map((s) => s.areaId)
        );
        return areaIds.size === 1;
    }
    return false;
}

/** 세부 종목이 정확히 1개로 좁혀진 경우(예: topics를 1개만 지정한 링크)에는 종목 선택 단계 자체를 건너뛴다. */
function isSubjectsStepLocked() {
    const scope = gameState.learningScope;
    if (!scope || !scope.active || !scope.isValid) return false;
    if (gameState.selectedGrade == null || gameState.selectedSemester == null || gameState.selectedAreaId == null) return false;
    return getEffectiveSubjectOptions().length === 1;
}

function isStepLocked(stepId) {
    if (stepId === "grade") return isGradeLocked();
    if (stepId === "semester") return isSemesterLocked();
    if (stepId === "area") return isAreaLocked();
    if (stepId === "subjects") return isSubjectsStepLocked();
    return false;
}

/** 현재 잠금 상태를 반영해, 학생에게 실제로 보여줄 메뉴 단계 목록(순번 포함)을 반환한다. */
function getVisibleMenuSteps() {
    return MENU_STEPS.filter((s) => !isStepLocked(s.id)).map((s, idx) => ({ ...s, number: idx + 1 }));
}

function stepNumber(stepId) {
    const found = getVisibleMenuSteps().find((s) => s.id === stepId);
    return found ? found.number : "";
}

/** stepId 이전에 있는, 잠겨있지 않은 가장 가까운 단계 id를 반환한다. 없으면 null. */
function getPrevVisibleStep(stepId) {
    let idx = STEP_ORDER.indexOf(stepId) - 1;
    while (idx >= 0) {
        if (!isStepLocked(STEP_ORDER[idx])) return STEP_ORDER[idx];
        idx--;
    }
    return null;
}

/** 현재 선택된 학년·학기 기준 영역 목록을, 학습 범위 제한과 다시 교집합 처리해 반환한다. */
function getEffectiveAreaOptions() {
    const baseAreas = getAreasForGradeSemester(gameState.selectedGrade, gameState.selectedSemester);
    const scope = gameState.learningScope;
    if (!scope || !scope.active) return baseAreas; // 제한 없음: 기존과 동일하게 동작
    if (!scope.isValid) return []; // 잘못된 링크: 전체 허용으로 폴백하지 않음

    const allowedIds = new Set(
        scope.allowedSubjects.filter((s) => s.semester === gameState.selectedSemester).map((s) => s.id)
    );
    return baseAreas
        .map((area) => ({ id: area.id, label: area.label, subjects: area.subjects.filter((s) => allowedIds.has(s.id)) }))
        .filter((area) => area.subjects.length > 0);
}

/** 현재 선택된 학년·학기·영역 기준 세부 종목 목록을, 학습 범위 제한과 다시 교집합 처리해 반환한다. */
function getEffectiveSubjectOptions() {
    const baseSubjects = getSubjectsForGradeAreaSemester(gameState.selectedGrade, gameState.selectedAreaId, gameState.selectedSemester);
    const scope = gameState.learningScope;
    if (!scope || !scope.active) return baseSubjects; // 제한 없음: 기존과 동일하게 동작
    if (!scope.isValid) return []; // 잘못된 링크: 전체 허용으로 폴백하지 않음

    const allowedIds = new Set(scope.allowedSubjects.map((s) => s.id));
    return baseSubjects.filter((s) => allowedIds.has(s.id));
}

/**
 * 실제 문제를 출제할 최종 풀. 화면(gameState.selectedSubjects)에 무엇이 남아있든
 * 신뢰하지 않고, 매번 학습 범위 제한과 다시 교집합 처리한다.
 */
function getFinalSubjectPool() {
    const scope = gameState.learningScope;
    if (!scope || !scope.active) return gameState.selectedSubjects.slice(); // 제한 없음: 기존과 동일하게 동작
    if (!scope.isValid) return []; // 잘못된 링크: 화면에 남은 값이 있어도 항상 빈 풀

    const allowedIds = new Set(scope.allowedSubjects.map((s) => s.id));
    return gameState.selectedSubjects.filter((id) => allowedIds.has(id));
}

/**
 * 학습 범위 제한으로 고정된 학년/학기/영역 값을 자동으로 채우고, 세부 종목이
 * 하나로 좁혀지면 자동 선택한 뒤, 다음에 보여줄 메뉴 단계를 계산한다.
 * 학년/학기/영역 선택 함수들이 값을 바꾼 직후 공통으로 호출한다.
 * (제한이 없는 일반 모드에서는 기존과 동일하게 동작한다.)
 */
function resolveLockedFieldsAndAdvance() {
    const scope = gameState.learningScope;

    if (scope && scope.active && scope.isValid) {
        if (gameState.selectedGrade == null) gameState.selectedGrade = scope.grade;
        if (scope.semester != null && gameState.selectedSemester == null) gameState.selectedSemester = scope.semester;

        if (gameState.selectedAreaId == null && gameState.selectedSemester != null) {
            if (scope.area) {
                gameState.selectedAreaId = scope.area;
            } else if (scope.topics && scope.topics.length) {
                // 영역 자체는 지정하지 않았지만, topics 제한으로 영역이 사실상 하나로만 좁혀지면 자동 확정한다.
                const areaIds = [...new Set(
                    scope.allowedSubjects.filter((s) => s.semester === gameState.selectedSemester).map((s) => s.areaId)
                )];
                if (areaIds.length === 1) gameState.selectedAreaId = areaIds[0];
            }
        }

        if (
            gameState.selectedGrade != null &&
            gameState.selectedSemester != null &&
            gameState.selectedAreaId != null &&
            gameState.selectedSubjects.length === 0
        ) {
            const options = getEffectiveSubjectOptions();
            if (options.length === 1) {
                gameState.selectedSubjects = [options[0].id];
            }
        }
    }

    if (gameState.selectedGrade == null) gameState.menuStep = "grade";
    else if (gameState.selectedSemester == null) gameState.menuStep = "semester";
    else if (gameState.selectedAreaId == null) gameState.menuStep = "area";
    else if (gameState.selectedSubjects.length === 0) gameState.menuStep = "subjects";
    else gameState.menuStep = "playstyle";
}

/** 페이지 로드시 URL을 분석해 학습 범위 제한을 계산하고 gameState에 반영한다. */
function initLearningScopeForSession() {
    const rawScope = parseLearningScope();
    const validated = validateLearningScope(rawScope, problemCatalog);
    gameState.learningScope = validated;
    gameState.scopeBlocked = validated.active && !validated.isValid;

    if (!gameState.scopeBlocked && validated.active) {
        resolveLockedFieldsAndAdvance();
    }

    renderScopeBanners();
}

/** 화면 상단(및 시작 화면)의 학습 범위 안내/오류 배너를 갱신한다. */
function renderScopeBanners() {
    const scope = gameState.learningScope;
    const bannerBar = document.getElementById('scope-banner-bar');
    const bannerText = document.getElementById('scope-banner-text');
    const errorBar = document.getElementById('scope-error-bar');
    const errorText = document.getElementById('scope-error-text');
    const setupNote = document.getElementById('setup-scope-note');
    const startBtn = document.getElementById('start-game-btn');

    if (!scope || !scope.active) {
        if (bannerBar) bannerBar.classList.add('hidden');
        if (errorBar) errorBar.classList.add('hidden');
        if (setupNote) setupNote.classList.add('hidden');
        if (startBtn) startBtn.disabled = false;
        return;
    }

    if (!scope.isValid) {
        if (bannerBar) bannerBar.classList.add('hidden');
        if (errorBar) {
            errorBar.classList.remove('hidden');
            errorText.textContent = LEARNING_SCOPE_ERROR_MESSAGE;
        }
        if (setupNote) {
            setupNote.classList.remove('hidden', 'text-indigo-700', 'bg-indigo-50', 'border-indigo-200');
            setupNote.classList.add('text-rose-700', 'bg-rose-50', 'border-rose-200');
            setupNote.textContent = LEARNING_SCOPE_ERROR_MESSAGE;
        }
        if (startBtn) startBtn.disabled = true;
        return;
    }

    const label = getLearningScopeLabel(scope);
    if (bannerBar) bannerBar.classList.remove('hidden');
    if (bannerText) bannerText.textContent = `${label} 학습 링크입니다`;
    if (errorBar) errorBar.classList.add('hidden');
    if (setupNote) {
        setupNote.classList.remove('hidden', 'text-rose-700', 'bg-rose-50', 'border-rose-200');
        setupNote.classList.add('text-indigo-700', 'bg-indigo-50', 'border-indigo-200');
        setupNote.textContent = `🔒 ${label} 학습 링크입니다`;
    }
    if (startBtn) startBtn.disabled = false;
}

function selectGrade(grade) {
    gameState.selectedGrade = Number(grade);
    gameState.selectedSemester = null;
    gameState.selectedAreaId = null;
    gameState.selectedSubjects = [];
    gameState.playStyle = null;
    gameState.bossDifficulty = null;
    gameState.selectionReady = false;
    resolveLockedFieldsAndAdvance();
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
    resolveLockedFieldsAndAdvance();
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
    resolveLockedFieldsAndAdvance();
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
    const visibleSteps = getVisibleMenuSteps();
    const order = visibleSteps.map((s) => s.id);
    const currentIdx = order.indexOf(gameState.menuStep);

    visibleSteps.forEach((step, idx) => {
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

        btn.textContent = `${step.number}. ${step.shortLabel}`;
        if (reachable) {
            btn.onclick = () => setMenuStep(step.id);
        }
        tabsEl.appendChild(btn);
    });
}

/** 학습 범위 제한 링크의 설정이 잘못되어 허용 가능한 문제가 하나도 없을 때 표시하는 메뉴 상태. */
function renderScopeBlockedMenu() {
    const tabsEl = document.getElementById('menu-step-tabs');
    const titleEl = document.getElementById('menu-step-title');
    const optionsEl = document.getElementById('menu-options');
    const actionsEl = document.getElementById('menu-actions');

    tabsEl.innerHTML = "";
    titleEl.textContent = "⚠️ 학습 링크 오류";
    optionsEl.innerHTML = "";
    actionsEl.innerHTML = "";
    hideMenuHint();

    const notice = document.createElement('div');
    notice.className = "w-full text-center text-rose-300 font-jua text-base py-4 whitespace-pre-line";
    notice.textContent = LEARNING_SCOPE_ERROR_MESSAGE;
    optionsEl.appendChild(notice);
}

function renderSelectionMenu() {
    if (gameState.scopeBlocked) {
        renderScopeBlockedMenu();
        return;
    }

    renderStepTabs();
    hideMenuHint();

    const titleEl = document.getElementById('menu-step-title');
    const optionsEl = document.getElementById('menu-options');
    const actionsEl = document.getElementById('menu-actions');
    optionsEl.innerHTML = "";
    actionsEl.innerHTML = "";

    if (gameState.menuStep === "grade") {
        titleEl.textContent = `${stepNumber('grade')}. 학년을 선택하세요`;
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
        titleEl.textContent = `${stepNumber('semester')}. 학기를 선택하세요`;
        semesterOptions.forEach((sem) => {
            const btn = document.createElement('button');
            btn.type = "button";
            btn.className = gameState.selectedSemester === sem.id ? BTN_ACTIVE : BTN_IDLE;
            btn.textContent = sem.label;
            btn.onclick = () => selectSemester(sem.id);
            optionsEl.appendChild(btn);
        });

        const prevStep = getPrevVisibleStep("semester");
        if (prevStep) {
            const backBtn = document.createElement('button');
            backBtn.type = "button";
            backBtn.className = "px-4 py-2 rounded-xl text-xs font-bold bg-slate-600 text-white border border-slate-500 hover:bg-slate-500";
            backBtn.textContent = "← 학년으로";
            backBtn.onclick = () => setMenuStep(prevStep);
            actionsEl.appendChild(backBtn);
        }
        return;
    }

    if (gameState.menuStep === "area") {
        titleEl.textContent = `${stepNumber('area')}. 영역을 선택하세요`;
        const areas = getEffectiveAreaOptions();

        const prevStep = getPrevVisibleStep("area");
        const backBtn = document.createElement('button');
        backBtn.type = "button";
        backBtn.className = "px-4 py-2 rounded-xl text-xs font-bold bg-slate-600 text-white border border-slate-500 hover:bg-slate-500";
        backBtn.textContent = "← 학기로";
        backBtn.onclick = () => { if (prevStep) setMenuStep(prevStep); };

        if (areas.length === 0) {
            const notice = document.createElement('div');
            notice.className = "w-full text-center text-amber-200 font-jua text-lg py-4";
            notice.textContent = "🚧 문제 준비 중이에요! 다른 학년/학기를 선택해 주세요.";
            optionsEl.appendChild(notice);
            if (prevStep) actionsEl.appendChild(backBtn);
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

        if (prevStep) actionsEl.appendChild(backBtn);
        return;
    }

    if (gameState.menuStep === "subjects") {
        titleEl.textContent = `${stepNumber('subjects')}. 세부 종목을 선택하세요 (여러 개 가능)`;
        const subjects = getEffectiveSubjectOptions();
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

        const prevStep = getPrevVisibleStep("subjects");
        if (prevStep) {
            const backBtn = document.createElement('button');
            backBtn.type = "button";
            backBtn.className = "px-4 py-2 rounded-xl text-xs font-bold bg-slate-600 text-white border border-slate-500 hover:bg-slate-500";
            backBtn.textContent = "← 영역으로";
            backBtn.onclick = () => setMenuStep(prevStep);
            actionsEl.appendChild(backBtn);
        }

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
            titleEl.textContent = `${stepNumber('playstyle')}. 보스전 난이도를 선택하세요`;
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

        titleEl.textContent = `${stepNumber('playstyle')}. 게임 방식을 선택하세요`;
        playStyleOptions.forEach((opt) => {
            const btn = document.createElement('button');
            btn.type = "button";
            btn.className = gameState.playStyle === opt.id ? BTN_PLAY_ACTIVE : BTN_PLAY_IDLE;
            btn.innerHTML = `<div>${opt.label}</div><div class="text-[11px] font-nanum opacity-80 mt-1">${opt.description}</div>`;
            btn.onclick = () => selectPlayStyle(opt.id);
            optionsEl.appendChild(btn);
        });

        const prevStep = getPrevVisibleStep("playstyle");
        if (prevStep) {
            const backBtn = document.createElement('button');
            backBtn.type = "button";
            backBtn.className = "px-4 py-2 rounded-xl text-xs font-bold bg-slate-600 text-white border border-slate-500 hover:bg-slate-500";
            backBtn.textContent = prevStep === "subjects" ? "← 종목으로" : "← 영역으로";
            backBtn.onclick = () => setMenuStep(prevStep);
            actionsEl.appendChild(backBtn);
        }
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
    if (gameState.scopeBlocked) return; // 방어적 처리: 버튼이 비활성화되어 있어도 실행되지 않게 함

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

    if (gameState.selectionReady && getFinalSubjectPool().length) {
        resetCard(0);
        resetCard(1);
    }
    updateScoreUI();
    getActivePlayMode().updateUI(gameState);

    document.getElementById('setup-screen').classList.add('hidden');
    initAudio();
}

function resetCard(cardIdx) {
    // 화면에 선택되어 있는 값(gameState.selectedSubjects)을 그대로 신뢰하지 않고,
    // 매번 학습 범위 제한(URL scope)과 다시 교집합 처리한 최종 풀로 문제를 생성한다.
    const pool = getFinalSubjectPool();

    if (!pool.length) {
        document.getElementById(`card-tag-front-${cardIdx}`).textContent = "종목 미선택";
        document.getElementById(`card-formula-${cardIdx}`).innerHTML = "-- + --";
        document.getElementById(`card-formula-back-${cardIdx}`).innerHTML = "-- + --";
        document.getElementById(`card-answer-${cardIdx}`).innerHTML = "--";
        document.getElementById(`card-inner-${cardIdx}`).classList.remove('is-flipped');
        toggleScoreButtons(cardIdx, false);
        return;
    }

    const problem = generateMathProblem(null, pool);
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
    if (gameState.scopeBlocked) return; // 방어적 처리: 링크 오류 상태에서는 카드 진행 불가

    if (!gameState.selectionReady || !getFinalSubjectPool().length) {
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
    initLearningScopeForSession();
    BattleMode.init(gameState);
    BattleMode.updateUI(gameState);
    renderSelectionMenu();
    updateSelectionSummary();
    updateMenuPanelVisibility();
});
