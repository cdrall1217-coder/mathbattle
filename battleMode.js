/**
 * 대결 모드
 * - 정답: 해당 플레이어 +10점
 * - 오답: 해당 플레이어 -5점 (최소 0)
 */
const BattleMode = {
    id: "battle",

    init(gameState) {
        gameState.players.p1.score = 0;
        gameState.players.p2.score = 0;
        gameState.sharedScore = 0;
        gameState.boss = { maxHp: 0, hp: 0, difficulty: null };
        gameState.coopVictory = false;
    },

    isActive(gameState) {
        return gameState.playStyle === "battle";
    },

    onCorrect(gameState, playerNum) {
        const playerKey = playerNum === 1 ? "p1" : "p2";
        gameState.players[playerKey].score += 10;
        playBeep("success");
        showFloatingFeedback(playerNum, "+10 점! 🎉", "text-emerald-600");
    },

    onWrong(gameState, playerNum) {
        const playerKey = playerNum === 1 ? "p1" : "p2";
        gameState.players[playerKey].score = Math.max(0, gameState.players[playerKey].score - 5);
        playBeep("fail");
        showFloatingFeedback(playerNum, "-5 점 😢", "text-rose-600");
    },

    canContinue(gameState) {
        return true;
    },

    updateUI(gameState) {
        document.getElementById("score-battle-view").classList.remove("hidden");
        document.getElementById("score-coop-view").classList.add("hidden");
        document.getElementById("boss-bar").classList.add("hidden");
        document.getElementById("victory-screen").classList.add("hidden");

        updateScoreUI();
    }
};
