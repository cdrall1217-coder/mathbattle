/**
 * 교사용 학습 범위(Learning Scope) 제한 기능
 * -------------------------------------------------------------
 * - 목적: 학생이 자신의 학년/학기에 해당하지 않는 문제를 선택해
 *   선행학습하지 않도록, URL 쿼리스트링을 기준으로 학년/학기/영역/
 *   세부 종목 노출 범위를 제한한다.
 * - problemCatalog.js / problemGenerators.js 는 이 파일에서 절대
 *   수정하지 않으며, 이미 만들어진 카탈로그 데이터만 읽어서 사용한다.
 * - 로드 순서: problemCatalog.js → problemGenerators.js → learningScope.js
 *   → battleMode.js → coopBossMode.js → script.js
 *
 * 공개 함수 (script.js 등에서 사용):
 *   parseLearningScope()          - URL에서 제한 정보 읽기
 *   validateLearningScope(scope, catalog) - catalog 기준 검증/정규화
 *   filterCatalogByScope(catalog, scope)  - 허용된 세부 종목 목록 반환
 *   buildStudentLink(settings)    - 교사용 학생 링크 생성
 *   getLearningScopeLabel(validated)      - 학생 화면 안내 문구 생성
 *   openTeacherLinkModal() / closeTeacherLinkModal() - 교사용 모달 제어
 */

/** 허용 가능한 문제가 하나도 없을 때 학생 화면에 보여줄 안내 문구 */
const LEARNING_SCOPE_ERROR_MESSAGE =
    "학습 링크의 설정이 올바르지 않습니다.\n선생님께 새로운 링크를 요청하세요.";

/**
 * catalog 전체에서 학기(semester)가 1 또는 2로 지정된 세부 종목만
 * 평탄화하여 반환한다. (학기 미배정 상태의 옛 종목은 학년·학기 선택
 * 구조 자체에 노출되지 않으므로 학습 범위 제한 대상에서도 제외한다.)
 * @param {Array} catalog - problemCatalog
 * @returns {Array<{id:string,label:string,grade:number,semester:number,areaId:string,areaLabel:string}>}
 */
function flattenSemesterSubjects(catalog) {
    const flat = [];
    catalog.forEach((gradeEntry) => {
        gradeEntry.areas.forEach((area) => {
            area.subjects.forEach((subject) => {
                if (subject.semester !== 1 && subject.semester !== 2) return;
                flat.push({
                    id: subject.id,
                    label: subject.label,
                    grade: gradeEntry.grade,
                    semester: subject.semester,
                    areaId: area.id,
                    areaLabel: area.label
                });
            });
        });
    });
    return flat;
}

/**
 * 현재 URL의 검색 매개변수에서 학습 범위 제한 정보를 읽어온다.
 * grade 매개변수가 아예 없으면 "제한 없음" 상태로 보고 null을 반환한다.
 * @param {URLSearchParams} [searchParamsOverride] - 테스트 등에서 직접 주입할 때 사용
 * @returns {{grade:number, semester:(number|null), area:(string|null), topics:(string[]|null)}|null}
 */
function parseLearningScope(searchParamsOverride) {
    const params = searchParamsOverride || new URLSearchParams(window.location.search);
    if (!params.has("grade")) return null;

    const grade = Number(params.get("grade"));

    const semesterRaw = params.get("semester");
    const semester = semesterRaw !== null && semesterRaw !== "" ? Number(semesterRaw) : null;

    const area = params.get("area") || null;

    const topicsRaw = params.get("topics");
    let topics = null;
    if (topicsRaw) {
        const list = topicsRaw.split(",").map((t) => t.trim()).filter(Boolean);
        topics = list.length ? list : null;
    }

    return { grade, semester, area, topics };
}

/**
 * catalog를 기준으로 scope에 해당하는 세부 종목 목록을 반환한다.
 * 반드시 grade → semester → area → topics 순서로 교집합 처리하며,
 * 앞 단계에서 이미 제외된 문제는 뒤 단계 조건과 무관하게 절대 허용되지 않는다.
 * 존재하지 않는 학년/학기/영역/세부 종목이 주어지면 그냥 아무것도 매치되지
 * 않을 뿐이므로, 잘못된 값이 전체 허용으로 이어지는 일은 없다.
 * @param {Array} catalog - problemCatalog
 * @param {{grade:number, semester:(number|null), area:(string|null), topics:(string[]|null)}|null} scope
 * @returns {Array} 허용된 세부 종목 목록
 */
function filterCatalogByScope(catalog, scope) {
    if (!scope) return [];
    const all = flattenSemesterSubjects(catalog);

    let result = all.filter((s) => s.grade === scope.grade);
    if (scope.semester !== null && scope.semester !== undefined) {
        result = result.filter((s) => s.semester === scope.semester);
    }
    if (scope.area) {
        result = result.filter((s) => s.areaId === scope.area);
    }
    if (scope.topics && scope.topics.length) {
        const topicSet = new Set(scope.topics);
        result = result.filter((s) => topicSet.has(s.id));
    }
    return result;
}

/**
 * scope를 catalog 기준으로 검증하고, 화면/게임 로직에서 바로 쓸 수 있는
 * 정규화된 형태로 반환한다.
 * @param {{grade:number, semester:(number|null), area:(string|null), topics:(string[]|null)}|null} scope
 * @param {Array} catalog
 * @returns {{active:boolean, isValid:boolean, grade:(number|null), semester:(number|null), area:(string|null), topics:(string[]|null), allowedSubjects:Array}}
 */
function validateLearningScope(scope, catalog) {
    if (!scope) {
        return {
            active: false,
            isValid: true,
            grade: null,
            semester: null,
            area: null,
            topics: null,
            allowedSubjects: []
        };
    }

    const allowedSubjects = filterCatalogByScope(catalog, scope);

    return {
        active: true,
        isValid: allowedSubjects.length > 0,
        grade: scope.grade,
        semester: scope.semester,
        area: scope.area,
        topics: scope.topics,
        allowedSubjects
    };
}

/**
 * 교사 설정으로 학생용 링크를 생성한다. 현재 페이지 주소를 기준으로 하며,
 * 기존 URL에 남아 있던 다른 검색 매개변수는 모두 제거한다.
 * @param {{grade:number, semester:(number|null|undefined), area:(string|null|undefined), topics:(string[]|null|undefined)}} settings
 * @returns {string} 완성된 학생용 URL 문자열
 */
function buildStudentLink(settings) {
    const url = new URL(window.location.href);
    url.search = "";

    const params = new URLSearchParams();
    params.set("grade", String(settings.grade));
    if (settings.semester) params.set("semester", String(settings.semester));
    if (settings.area) params.set("area", settings.area);
    if (settings.topics && settings.topics.length) params.set("topics", settings.topics.join(","));

    url.search = params.toString();
    return url.toString();
}

/**
 * 학생 화면 상단에 표시할 제한 범위 안내 문구를 만든다.
 * URL 매개변수명이나 내부 problem id는 절대 노출하지 않고,
 * problemCatalog의 label만 사용한다.
 * @param {ReturnType<typeof validateLearningScope>} validated
 * @returns {string}
 */
function getLearningScopeLabel(validated) {
    if (!validated || !validated.active || !validated.isValid) return "";

    const gradeSemesterPart = validated.semester
        ? `${validated.grade}학년 ${validated.semester}학기`
        : `${validated.grade}학년`;

    if (validated.topics && validated.topics.length) {
        const labels = [];
        validated.allowedSubjects.forEach((s) => {
            if (!labels.includes(s.label)) labels.push(s.label);
        });
        return `${gradeSemesterPart} · ${labels.join(", ")}`;
    }

    if (validated.area) {
        const areaLabel = validated.allowedSubjects.length ? validated.allowedSubjects[0].areaLabel : validated.area;
        return `${gradeSemesterPart} · ${areaLabel}`;
    }

    return `${gradeSemesterPart} 전용`;
}

/* ================================================================
 * 교사용 "학습 링크 만들기" 모달 UI
 * (위의 순수 함수들만 사용하며, 필터링 로직을 다시 구현하지 않는다.)
 * ================================================================ */

const teacherLinkState = {
    grade: null,
    semester: null, // null = 전체 학기
    area: null, // null = 전체 영역
    topics: [] // 빈 배열 = 전체 세부 주제
};

function resetTeacherLinkState() {
    teacherLinkState.grade = null;
    teacherLinkState.semester = null;
    teacherLinkState.area = null;
    teacherLinkState.topics = [];
}

function openTeacherLinkModal() {
    resetTeacherLinkState();
    renderTeacherLinkModal();
    const modal = document.getElementById("teacher-link-modal");
    if (modal) modal.classList.remove("hidden");
}

function closeTeacherLinkModal() {
    const modal = document.getElementById("teacher-link-modal");
    if (modal) modal.classList.add("hidden");
}

/** 교사가 고른 학년·학기 조건에서 노출 가능한 영역 목록 (전체 학기면 두 학기 합집합) */
function getTeacherAreaOptions() {
    if (teacherLinkState.grade == null) return [];
    const semesters = teacherLinkState.semester ? [teacherLinkState.semester] : [1, 2];
    const map = new Map();
    semesters.forEach((sem) => {
        getAreasForGradeSemester(teacherLinkState.grade, sem).forEach((area) => {
            if (!map.has(area.id)) map.set(area.id, { id: area.id, label: area.label });
        });
    });
    return Array.from(map.values());
}

/** 교사가 고른 학년·학기·영역 조건에서 노출 가능한 세부 종목 목록 */
function getTeacherTopicOptions() {
    if (teacherLinkState.grade == null) return [];
    const semesters = teacherLinkState.semester ? [teacherLinkState.semester] : [1, 2];
    const seen = new Set();
    const list = [];
    semesters.forEach((sem) => {
        getAreasForGradeSemester(teacherLinkState.grade, sem).forEach((area) => {
            if (teacherLinkState.area && area.id !== teacherLinkState.area) return;
            area.subjects.forEach((subject) => {
                if (seen.has(subject.id)) return;
                seen.add(subject.id);
                list.push({ id: subject.id, label: subject.label });
            });
        });
    });
    return list;
}

function teacherSelectGrade(grade) {
    teacherLinkState.grade = Number(grade);
    teacherLinkState.semester = null;
    teacherLinkState.area = null;
    teacherLinkState.topics = [];
    renderTeacherLinkModal();
}

function teacherSelectSemester(semester) {
    teacherLinkState.semester = semester; // 1 | 2 | null(전체)
    teacherLinkState.area = null;
    teacherLinkState.topics = [];
    renderTeacherLinkModal();
}

function teacherSelectArea(areaId) {
    teacherLinkState.area = areaId; // string | null(전체)
    teacherLinkState.topics = [];
    renderTeacherLinkModal();
}

function teacherToggleTopic(topicId) {
    const idx = teacherLinkState.topics.indexOf(topicId);
    if (idx >= 0) teacherLinkState.topics.splice(idx, 1);
    else teacherLinkState.topics.push(topicId);
    renderTeacherLinkModal();
}

const TEACHER_BTN_BASE = "px-3 py-2 rounded-xl text-xs font-black border-2 transition active:scale-95";
const TEACHER_BTN_IDLE = `${TEACHER_BTN_BASE} bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200`;
const TEACHER_BTN_ACTIVE = `${TEACHER_BTN_BASE} bg-indigo-600 border-indigo-500 text-white shadow`;

function renderTeacherLinkModal() {
    const body = document.getElementById("teacher-modal-body");
    if (!body) return;
    body.innerHTML = "";

    const labelClass = "block font-jua text-indigo-900 text-sm mb-2";

    // 1. 학년 (필수)
    const gradeSection = document.createElement("div");
    gradeSection.innerHTML = `<label class="${labelClass}">1. 학년 <span class="text-rose-500">(필수)</span></label>`;
    const gradeRow = document.createElement("div");
    gradeRow.className = "flex flex-wrap gap-2";
    SELECTABLE_GRADES.forEach((grade) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = teacherLinkState.grade === grade ? TEACHER_BTN_ACTIVE : TEACHER_BTN_IDLE;
        btn.textContent = `${grade}학년`;
        btn.onclick = () => teacherSelectGrade(grade);
        gradeRow.appendChild(btn);
    });
    gradeSection.appendChild(gradeRow);
    body.appendChild(gradeSection);

    if (teacherLinkState.grade == null) return; // 학년 선택 전에는 이후 단계를 보여주지 않음

    // 2. 학기
    const semSection = document.createElement("div");
    semSection.className = "mt-4";
    semSection.innerHTML = `<label class="${labelClass}">2. 학기</label>`;
    const semRow = document.createElement("div");
    semRow.className = "flex flex-wrap gap-2";
    [{ id: null, label: "전체 학기" }, { id: 1, label: "1학기" }, { id: 2, label: "2학기" }].forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = teacherLinkState.semester === opt.id ? TEACHER_BTN_ACTIVE : TEACHER_BTN_IDLE;
        btn.textContent = opt.label;
        btn.onclick = () => teacherSelectSemester(opt.id);
        semRow.appendChild(btn);
    });
    semSection.appendChild(semRow);
    body.appendChild(semSection);

    // 3. 영역 (problemCatalog에서 자동 생성)
    const areaSection = document.createElement("div");
    areaSection.className = "mt-4";
    areaSection.innerHTML = `<label class="${labelClass}">3. 영역</label>`;
    const areaRow = document.createElement("div");
    areaRow.className = "flex flex-wrap gap-2";
    const allAreaBtn = document.createElement("button");
    allAreaBtn.type = "button";
    allAreaBtn.className = teacherLinkState.area == null ? TEACHER_BTN_ACTIVE : TEACHER_BTN_IDLE;
    allAreaBtn.textContent = "전체 영역";
    allAreaBtn.onclick = () => teacherSelectArea(null);
    areaRow.appendChild(allAreaBtn);
    getTeacherAreaOptions().forEach((area) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = teacherLinkState.area === area.id ? TEACHER_BTN_ACTIVE : TEACHER_BTN_IDLE;
        btn.textContent = area.label;
        btn.onclick = () => teacherSelectArea(area.id);
        areaRow.appendChild(btn);
    });
    areaSection.appendChild(areaRow);
    body.appendChild(areaSection);

    // 4. 세부 주제 (복수 선택, problemCatalog에서 자동 생성)
    const topicSection = document.createElement("div");
    topicSection.className = "mt-4";
    topicSection.innerHTML = `<label class="${labelClass}">4. 세부 주제 (여러 개 선택 가능 · 선택 안 하면 전체 허용)</label>`;
    const topicRow = document.createElement("div");
    topicRow.className = "flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border-2 border-slate-100 rounded-xl";
    const topicOptions = getTeacherTopicOptions();
    if (!topicOptions.length) {
        const empty = document.createElement("div");
        empty.className = "text-xs text-slate-400 font-bold p-1";
        empty.textContent = "선택 가능한 세부 주제가 없습니다.";
        topicRow.appendChild(empty);
    }
    topicOptions.forEach((topic) => {
        const selected = teacherLinkState.topics.includes(topic.id);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = selected ? TEACHER_BTN_ACTIVE : TEACHER_BTN_IDLE;
        btn.textContent = (selected ? "✓ " : "") + topic.label;
        btn.onclick = () => teacherToggleTopic(topic.id);
        topicRow.appendChild(btn);
    });
    topicSection.appendChild(topicRow);
    body.appendChild(topicSection);

    // 액션 버튼: 학생용 링크 만들기 / 설정 초기화
    const primaryBtnClass = "py-2.5 px-3 rounded-xl font-jua text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition active:scale-95";
    const secondaryBtnClass = "py-2.5 px-3 rounded-xl font-jua text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-300 transition active:scale-95";

    const actionRow = document.createElement("div");
    actionRow.className = "grid grid-cols-2 gap-2 mt-5";

    const makeBtn = document.createElement("button");
    makeBtn.type = "button";
    makeBtn.className = primaryBtnClass;
    makeBtn.textContent = "🔗 학생용 링크 만들기";
    makeBtn.onclick = generateTeacherStudentLink;
    actionRow.appendChild(makeBtn);

    const resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = secondaryBtnClass;
    resetBtn.textContent = "🔄 설정 초기화";
    resetBtn.onclick = () => { resetTeacherLinkState(); renderTeacherLinkModal(); };
    actionRow.appendChild(resetBtn);

    body.appendChild(actionRow);

    // 결과 출력 영역 (링크 생성 전에는 숨김)
    const outputWrap = document.createElement("div");
    outputWrap.id = "teacher-link-output-wrap";
    outputWrap.className = "hidden mt-4 pt-4 border-t-2 border-indigo-100 space-y-2";
    outputWrap.innerHTML = `
        <div class="text-xs font-bold text-indigo-700" id="teacher-link-scope-preview"></div>
        <input type="text" id="teacher-link-output" readonly
            class="w-full px-3 py-2 rounded-xl border-2 border-indigo-200 bg-indigo-50 text-xs font-bold text-slate-700">
        <div class="grid grid-cols-2 gap-2">
            <button type="button" id="teacher-link-copy-btn" class="${secondaryBtnClass}">📋 링크 복사</button>
            <button type="button" id="teacher-link-preview-btn" class="${secondaryBtnClass}">🔍 새 탭에서 미리보기</button>
        </div>
    `;
    body.appendChild(outputWrap);
}

function generateTeacherStudentLink() {
    if (teacherLinkState.grade == null) return;

    const settings = {
        grade: teacherLinkState.grade,
        semester: teacherLinkState.semester,
        area: teacherLinkState.area,
        topics: teacherLinkState.topics.length ? teacherLinkState.topics.slice() : null
    };

    const link = buildStudentLink(settings);
    const validated = validateLearningScope(settings, problemCatalog);

    const outputWrap = document.getElementById("teacher-link-output-wrap");
    const outputInput = document.getElementById("teacher-link-output");
    const previewEl = document.getElementById("teacher-link-scope-preview");
    if (!outputWrap || !outputInput || !previewEl) return;

    outputInput.value = link;
    previewEl.textContent = validated.isValid
        ? `✅ 학생 화면 안내 문구: "${getLearningScopeLabel(validated)}"`
        : "⚠️ 이 조건에 해당하는 문제가 없습니다. 다른 조건을 선택해 주세요.";
    outputWrap.classList.remove("hidden");

    const copyBtn = document.getElementById("teacher-link-copy-btn");
    const previewBtn = document.getElementById("teacher-link-preview-btn");
    if (copyBtn) copyBtn.onclick = () => copyTextToClipboard(link, copyBtn);
    if (previewBtn) previewBtn.onclick = () => window.open(link, "_blank", "noopener");
}

function copyTextToClipboard(text, btnEl) {
    const showCopied = () => {
        if (!btnEl) return;
        const original = btnEl.textContent;
        btnEl.textContent = "✅ 복사됨!";
        setTimeout(() => { btnEl.textContent = original; }, 1500);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(showCopied).catch(() => fallbackCopyText(text, showCopied));
    } else {
        fallbackCopyText(text, showCopied);
    }
}

function fallbackCopyText(text, onDone) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
        document.execCommand("copy");
    } catch (e) {
        // 복사 실패 시에도 조용히 무시 (사용자가 직접 선택해 복사할 수 있음)
    }
    document.body.removeChild(textarea);
    if (onDone) onDone();
}
