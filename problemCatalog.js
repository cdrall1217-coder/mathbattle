/**
 * 문제 종목 카탈로그
 * - grade: 1~6
 * - areas[].subjects[].id 는 problemGenerators 의 키와 일치해야 함
 * 메뉴는 이 데이터로만 자동 생성된다.
 */
const problemCatalog = [
    {
        grade: 1,
        label: "1학년",
        areas: [
            {
                id: "number",
                label: "수와 연산",
                subjects: [
                    { id: "add1", label: "한 자리 덧셈" },
                    { id: "sub1", label: "한 자리 뺄셈" },
                    { id: "make10", label: "10 만들기" }
                ]
            }
        ]
    },
    {
        grade: 2,
        label: "2학년",
        areas: [
            {
                id: "number",
                label: "수와 연산",
                subjects: [
                    { id: "add2", label: "두 자리 덧셈" },
                    { id: "sub2", label: "두 자리 뺄셈" },
                    { id: "mul_table", label: "구구단" }
                ]
            },
            {
                id: "measure",
                label: "측정",
                subjects: [
                    { id: "unit_len", label: "cm ↔ mm 단위 변환" }
                ]
            }
        ]
    },
    {
        grade: 3,
        label: "3학년",
        areas: [
            {
                id: "number",
                label: "수와 연산",
                subjects: [
                    { id: "add2", label: "두 자리 덧셈" },
                    { id: "sub2", label: "두 자리 뺄셈" },
                    { id: "add3", label: "세 자리 덧셈" },
                    { id: "sub3", label: "세 자리 뺄셈" },
                    { id: "div_single", label: "두 자리 ÷ 한 자리 (몫 한 자리)" },
                    { id: "mul_tens", label: "몇십몇 × 몇" },
                    { id: "mul_hundreds", label: "세 자리 × 한 자리" },
                    { id: "mul_double", label: "두 자리 × 두 자리" },
                    { id: "div_no_rem2", label: "두 자리 ÷ 한 자리 (나머지 없음)" },
                    { id: "div_rem2", label: "두 자리 ÷ 한 자리 (나머지 있음)" },
                    { id: "div_no_rem3", label: "세 자리 ÷ 한 자리 (나머지 없음)" },
                    { id: "div_rem3", label: "세 자리 ÷ 한 자리 (나머지 있음)" },
                    { id: "frac_of", label: "~의 몇 분의 몇" },
                    { id: "frac_imp", label: "가분수 ↔ 대분수" }
                ]
            },
            {
                id: "measure",
                label: "측정",
                subjects: [
                    { id: "unit_len", label: "cm ↔ mm 단위 변환" },
                    { id: "unit_dist", label: "km ↔ m 단위 변환" },
                    { id: "time_add_no", label: "시간 덧셈 (받아올림 없음)" },
                    { id: "time_add_yes", label: "시간 덧셈 (받아올림 있음)" },
                    { id: "time_sub_no", label: "시간 뺄셈 (받아내림 없음)" },
                    { id: "time_sub_yes", label: "시간 뺄셈 (받아내림 있음)" }
                ]
            }
        ]
    },
    {
        grade: 4,
        label: "4학년",
        areas: [
            {
                id: "number",
                label: "수와 연산",
                subjects: [
                    { id: "add3", label: "세 자리 덧셈" },
                    { id: "sub3", label: "세 자리 뺄셈" },
                    { id: "mul_hundreds", label: "세 자리 × 한 자리" },
                    { id: "mul_double", label: "두 자리 × 두 자리" },
                    { id: "div_no_rem3", label: "세 자리 ÷ 한 자리 (나머지 없음)" },
                    { id: "div_rem3", label: "세 자리 ÷ 한 자리 (나머지 있음)" },
                    { id: "frac_of", label: "~의 몇 분의 몇" },
                    { id: "frac_imp", label: "가분수 ↔ 대분수" }
                ]
            },
            {
                id: "measure",
                label: "측정",
                subjects: [
                    { id: "unit_dist", label: "km ↔ m 단위 변환" },
                    { id: "time_add_yes", label: "시간 덧셈 (받아올림 있음)" },
                    { id: "time_sub_yes", label: "시간 뺄셈 (받아내림 있음)" }
                ]
            }
        ]
    },
    {
        grade: 5,
        label: "5학년",
        areas: [
            {
                id: "number",
                label: "수와 연산",
                subjects: [
                    { id: "mul_double", label: "두 자리 × 두 자리" },
                    { id: "div_no_rem3", label: "세 자리 ÷ 한 자리 (나머지 없음)" },
                    { id: "div_rem3", label: "세 자리 ÷ 한 자리 (나머지 있음)" },
                    { id: "frac_of", label: "~의 몇 분의 몇" },
                    { id: "frac_imp", label: "가분수 ↔ 대분수" },
                    { id: "dec_add", label: "소수 덧셈" },
                    { id: "dec_sub", label: "소수 뺄셈" }
                ]
            }
        ]
    },
    {
        grade: 6,
        label: "6학년",
        areas: [
            {
                id: "number",
                label: "수와 연산",
                subjects: [
                    { id: "frac_of", label: "~의 몇 분의 몇" },
                    { id: "frac_imp", label: "가분수 ↔ 대분수" },
                    { id: "dec_add", label: "소수 덧셈" },
                    { id: "dec_sub", label: "소수 뺄셈" },
                    { id: "percent", label: "백분율 구하기" },
                    { id: "ratio", label: "비와 비율" }
                ]
            }
        ]
    }
];

const playStyleOptions = [
    { id: "battle", label: "대결", description: "서로 점수를 겨루는 배틀" },
    { id: "coop", label: "협동 보스전", description: "힘을 합쳐 보스를 쓰러뜨리기" }
];

function getGradeEntry(grade) {
    return problemCatalog.find((g) => g.grade === Number(grade)) || null;
}

function getAreaEntry(grade, areaId) {
    const gradeEntry = getGradeEntry(grade);
    if (!gradeEntry) return null;
    return gradeEntry.areas.find((a) => a.id === areaId) || null;
}

function getSubjectEntry(subjectId) {
    for (const gradeEntry of problemCatalog) {
        for (const area of gradeEntry.areas) {
            const subject = area.subjects.find((s) => s.id === subjectId);
            if (subject) return subject;
        }
    }
    return null;
}

function getSubjectLabel(subjectId) {
    const subject = getSubjectEntry(subjectId);
    return subject ? subject.label : subjectId;
}
