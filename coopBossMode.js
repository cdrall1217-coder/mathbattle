/**
 * 협동 보스전 모드
 * - 정답: 보스 체력 -10
 * - 오답: 보통/어려움에서 보스 반격 (공동 점수 감소)
 */
const BOSS_DIFFICULTIES = {
    easy: { id: "easy", label: "쉬움", hp: 100, counterDamage: 0, description: "체력 100 · 반격 없음" },
    normal: { id: "normal", label: "보통", hp: 200, counterDamage: 5, description: "체력 200 · 오답 시 공동 -5" },
    hard: { id: "hard", label: "어려움", hp: 300, counterDamage: 10, description: "체력 300 · 오답 시 공동 -10" }
};

const CoopBossMode = {
    id: "coop",

    init(gameState, difficultyId) {
        const difficulty = BOSS_DIFFICULTIES[difficultyId] || BOSS_DIFFICULTIES.easy;
        gameState.bossDifficulty = difficulty.id;
        gameState.boss = {
            maxHp: difficulty.hp,
            hp: difficulty.hp,
            difficulty: difficulty.id
        };
        gameState.sharedScore = 0;
        gameState.players.p1.score = 0;
        gameState.players.p2.score = 0;
        gameState.coopVictory = false;
    },

    isActive(gameState) {
        return gameState.playStyle === "coop";
    },

    getDifficulty(difficultyId) {
        return BOSS_DIFFICULTIES[difficultyId] || BOSS_DIFFICULTIES.easy;
    },

    onCorrect(gameState, playerNum) {
        gameState.boss.hp = Math.max(0, gameState.boss.hp - 10);
        playBeep("success");
        showFloatingFeedback(playerNum, "보스 -10! ⚔️", "text-emerald-600");

        if (gameState.boss.hp === 0) {
            gameState.coopVictory = true;
            setTimeout(() => showVictoryScreen(gameState), 300);
        }

        updateBossBar(gameState);
    },

    onWrong(gameState, playerNum) {
        const difficulty = this.getDifficulty(gameState.bossDifficulty);
        playBeep("fail");

        if (difficulty.counterDamage > 0) {
            gameState.sharedScore = Math.max(0, gameState.sharedScore - difficulty.counterDamage);
            showFloatingFeedback(playerNum, `반격! 공동 -${difficulty.counterDamage} 😢`, "text-rose-600");
        } else {
            showFloatingFeedback(playerNum, "오답! (반격 없음)", "text-rose-600");
        }

        updateSharedScoreUI();
    },

    canContinue(gameState) {
        return !gameState.coopVictory && gameState.boss.hp > 0;
    },

    updateUI(gameState) {
        document.getElementById("score-battle-view").classList.add("hidden");
        document.getElementById("score-coop-view").classList.remove("hidden");
        document.getElementById("boss-bar").classList.remove("hidden");

        updateBossBar(gameState);
        updateSharedScoreUI();
    },

    resetAfterVictory(gameState) {
        const difficulty = this.getDifficulty(gameState.bossDifficulty);
        gameState.boss.hp = difficulty.hp;
        gameState.boss.maxHp = difficulty.hp;
        gameState.sharedScore = 0;
        gameState.coopVictory = false;
        document.getElementById("victory-screen").classList.add("hidden");
        updateBossBar(gameState);
        updateSharedScoreUI();
    }
};

function updateBossBar(gameState) {
    const bar = document.getElementById("boss-bar");
    if (!CoopBossMode.isActive(gameState) || !gameState.selectionReady) {
        bar.classList.add("hidden");
        return;
    }

    bar.classList.remove("hidden");
    const difficulty = CoopBossMode.getDifficulty(gameState.bossDifficulty);
    const pct = Math.max(0, (gameState.boss.hp / gameState.boss.maxHp) * 100);

    document.getElementById("boss-hp-fill").style.width = `${pct}%`;
    document.getElementById("boss-hp-label").textContent = `HP ${Math.max(0, gameState.boss.hp)} / ${gameState.boss.maxHp}`;
    document.getElementById("boss-difficulty-label").textContent = `${difficulty.label} 난이도`;
}

function updateSharedScoreUI() {
    const score = typeof gameState !== "undefined" ? gameState.sharedScore : 0;
    document.getElementById("shared-score-display").textContent = `${score} 점`;
}

function showVictoryScreen(gameState) {
    const screen = document.getElementById("victory-screen");
    const difficulty = CoopBossMode.getDifficulty(gameState.bossDifficulty);
    document.getElementById("victory-title").textContent = "보스 격파! 🐉✨";
    document.getElementById("victory-message").textContent =
        `${gameState.players.p1.name}와(과) ${gameState.players.p2.name}가 함께 ${difficulty.label} 난이도 보스를 물리쳤어요!`;
    document.getElementById("victory-shared-score").textContent = `공동 점수 ${gameState.sharedScore}점`;
    screen.classList.remove("hidden");
}

function closeVictoryScreen() {
    CoopBossMode.resetAfterVictory(gameState);
    resetCard(0);
    resetCard(1);
}
