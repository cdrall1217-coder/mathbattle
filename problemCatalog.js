/**
 * 문제 종목 카탈로그
 * - grade: 1~6
 * - areas[].subjects[].id 는 problemGenerators 의 키와 일치해야 함
 * - areas[].subjects[].semester: 1(1학기) 또는 2(2학기). 아직 학기가 구분되지 않은
 *   종목(3학년 외 학년)은 semester 값이 없으며, 학기 필터에 걸려 메뉴에 노출되지 않는다.
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
                    { id: "add2", label: "두 자리 덧셈", semester: 1 },
                    { id: "sub2", label: "두 자리 뺄셈", semester: 1 },
                    { id: "add3", label: "세 자리 덧셈", semester: 1 },
                    { id: "sub3", label: "세 자리 뺄셈", semester: 1 },
                    { id: "div_single", label: "두 자리 ÷ 한 자리 (몫 한 자리)", semester: 1 },
                    { id: "mul_tens", label: "몇십몇 × 몇", semester: 1 },
                    { id: "mul_hundreds", label: "세 자리 × 한 자리", semester: 1 },
                    { id: "div_no_rem2", label: "두 자리 ÷ 한 자리 (나머지 없음)", semester: 1 },
                    { id: "frac_of", label: "~의 몇 분의 몇", semester: 1 },
                    { id: "mul_double", label: "두 자리 × 두 자리", semester: 2 },
                    { id: "div_rem2", label: "두 자리 ÷ 한 자리 (나머지 있음)", semester: 2 },
                    { id: "div_no_rem3", label: "세 자리 ÷ 한 자리 (나머지 없음)", semester: 2 },
                    { id: "div_rem3", label: "세 자리 ÷ 한 자리 (나머지 있음)", semester: 2 },
                    { id: "frac_imp", label: "가분수 ↔ 대분수", semester: 2 }
                ]
            },
            {
                id: "measure",
                label: "측정",
                subjects: [
                    { id: "unit_len", label: "cm ↔ mm 단위 변환", semester: 1 },
                    { id: "unit_dist", label: "km ↔ m 단위 변환", semester: 1 },
                    { id: "time_add_no", label: "시간 덧셈 (받아올림 없음)", semester: 1 },
                    { id: "time_add_yes", label: "시간 덧셈 (받아올림 있음)", semester: 1 },
                    { id: "time_sub_no", label: "시간 뺄셈 (받아내림 없음)", semester: 1 },
                    { id: "time_sub_yes", label: "시간 뺄셈 (받아내림 있음)", semester: 1 }
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
                    // 학기 미배정(준비 중) 기존 항목 - semester 없음
                    { id: "add3", label: "세 자리 덧셈" },
                    { id: "sub3", label: "세 자리 뺄셈" },
                    { id: "mul_hundreds", label: "세 자리 × 한 자리" },
                    { id: "mul_double", label: "두 자리 × 두 자리" },
                    { id: "div_no_rem3", label: "세 자리 ÷ 한 자리 (나머지 없음)" },
                    { id: "div_rem3", label: "세 자리 ÷ 한 자리 (나머지 있음)" },
                    { id: "frac_of", label: "~의 몇 분의 몇" },
                    { id: "frac_imp", label: "가분수 ↔ 대분수" },
                    // 4학년 1학기 - 큰 수
                    { id: "g4s1_large_compare", label: "큰 수의 크기 비교", semester: 1 },
                    { id: "g4s1_place_value", label: "큰 수의 자릿값", semester: 1 },
                    { id: "g4s1_pow10", label: "자연수의 10배·100배·1000배", semester: 1 },
                    // 4학년 1학기 - 곱셈
                    { id: "g4s1_mul_3x2", label: "세 자리 수 × 두 자리 수", semester: 1 },
                    { id: "g4s1_mul_round", label: "몇백몇십 × 몇십", semester: 1 },
                    // 4학년 1학기 - 나눗셈
                    { id: "g4s1_div_3x2_no_rem", label: "세 자리 수 ÷ 두 자리 수 (나머지 없음)", semester: 1 },
                    { id: "g4s1_div_3x2_rem", label: "세 자리 수 ÷ 두 자리 수 (나머지 있음)", semester: 1 },
                    // 4학년 2학기 - 분수의 덧셈과 뺄셈
                    { id: "g4s2_frac_proper_add", label: "진분수 + 진분수", semester: 2 },
                    { id: "g4s2_frac_mixed_proper_add", label: "대분수 + 진분수", semester: 2 },
                    { id: "g4s2_frac_mixed_add", label: "대분수 + 대분수", semester: 2 },
                    { id: "g4s2_frac_proper_sub", label: "진분수 - 진분수", semester: 2 },
                    { id: "g4s2_frac_mixed_proper_sub", label: "대분수 - 진분수", semester: 2 },
                    { id: "g4s2_frac_mixed_sub", label: "대분수 - 대분수", semester: 2 },
                    { id: "g4s2_frac_whole_sub", label: "자연수 - 진분수", semester: 2 },
                    // 4학년 2학기 - 소수의 덧셈과 뺄셈
                    { id: "g4s2_decimal_1_add", label: "소수 한 자리 수의 덧셈", semester: 2 },
                    { id: "g4s2_decimal_2_add", label: "소수 두 자리 수의 덧셈", semester: 2 },
                    { id: "g4s2_decimal_mixed_add", label: "소수 자릿수가 다른 덧셈", semester: 2 },
                    { id: "g4s2_decimal_1_sub", label: "소수 한 자리 수의 뺄셈", semester: 2 },
                    { id: "g4s2_decimal_2_sub", label: "소수 두 자리 수의 뺄셈", semester: 2 },
                    { id: "g4s2_decimal_mixed_sub", label: "소수 자릿수가 다른 뺄셈", semester: 2 }
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
            },
            {
                id: "shape_measure",
                label: "도형과 측정",
                subjects: [
                    { id: "g4s1_angle_add", label: "각도의 합", semester: 1 },
                    { id: "g4s1_angle_sub", label: "각도의 차", semester: 1 },
                    { id: "g4s1_angle_complement", label: "직각·평각을 만드는 각", semester: 1 },
                    // 4학년 2학기 - 삼각형
                    { id: "g4s2_triangle_side_type", label: "삼각형 변의 길이로 분류하기", semester: 2 },
                    { id: "g4s2_triangle_angle_type", label: "삼각형 각의 크기로 분류하기", semester: 2 },
                    { id: "g4s2_triangle_missing_angle", label: "삼각형의 나머지 한 각", semester: 2 },
                    // 4학년 2학기 - 사각형
                    { id: "g4s2_quadrilateral_name", label: "사각형 이름 찾기", semester: 2 },
                    { id: "g4s2_quadrilateral_property", label: "사각형의 성질 판단", semester: 2 },
                    // 4학년 2학기 - 다각형
                    { id: "g4s2_polygon_name", label: "다각형의 이름", semester: 2 },
                    { id: "g4s2_polygon_count", label: "다각형의 변과 꼭짓점 수", semester: 2 },
                    { id: "g4s2_regular_polygon_property", label: "정다각형의 성질", semester: 2 }
                ]
            },
            {
                id: "pattern",
                label: "변화와 관계",
                subjects: [
                    { id: "g4s1_seq_up", label: "일정하게 커지는 수의 규칙", semester: 1 },
                    { id: "g4s1_seq_down", label: "일정하게 작아지는 수의 규칙", semester: 1 }
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
                    // 학기 미배정(준비 중) 기존 항목 - semester 없음
                    { id: "mul_double", label: "두 자리 × 두 자리" },
                    { id: "div_no_rem3", label: "세 자리 ÷ 한 자리 (나머지 없음)" },
                    { id: "div_rem3", label: "세 자리 ÷ 한 자리 (나머지 있음)" },
                    { id: "frac_of", label: "~의 몇 분의 몇" },
                    { id: "frac_imp", label: "가분수 ↔ 대분수" },
                    { id: "dec_add", label: "소수 덧셈" },
                    { id: "dec_sub", label: "소수 뺄셈" },
                    // 5학년 1학기 - 자연수의 혼합 계산
                    { id: "g5s1_mixed_add_sub", label: "덧셈과 뺄셈의 혼합 계산", semester: 1 },
                    { id: "g5s1_mixed_mul_div", label: "곱셈과 나눗셈의 혼합 계산", semester: 1 },
                    { id: "g5s1_mixed_add_sub_mul", label: "덧셈·뺄셈·곱셈의 혼합 계산", semester: 1 },
                    { id: "g5s1_mixed_all_ops", label: "사칙연산 혼합 계산", semester: 1 },
                    { id: "g5s1_mixed_parentheses", label: "괄호가 있는 혼합 계산", semester: 1 },
                    // 5학년 1학기 - 약수와 배수
                    { id: "g5s1_factor_list", label: "자연수의 약수 찾기", semester: 1 },
                    { id: "g5s1_factor_count", label: "약수의 개수", semester: 1 },
                    { id: "g5s1_multiple_nth", label: "몇 번째 배수", semester: 1 },
                    { id: "g5s1_multiple_check", label: "배수인지 판단하기", semester: 1 },
                    { id: "g5s1_gcd", label: "최대공약수", semester: 1 },
                    { id: "g5s1_lcm", label: "최소공배수", semester: 1 },
                    // 5학년 1학기 - 약분과 통분
                    { id: "g5s1_fraction_equivalent", label: "크기가 같은 분수의 빈칸", semester: 1 },
                    { id: "g5s1_fraction_reduce", label: "분수를 약분하기", semester: 1 },
                    { id: "g5s1_fraction_reduce_gcd", label: "약분할 수 있는 수 찾기", semester: 1 },
                    { id: "g5s1_fraction_common_denom", label: "두 분수 통분하기", semester: 1 },
                    { id: "g5s1_fraction_compare", label: "분수의 크기 비교", semester: 1 },
                    // 5학년 1학기 - 분수의 덧셈과 뺄셈 (분모가 다름)
                    { id: "g5s1_unlike_fraction_add", label: "진분수 + 진분수 (분모가 다름)", semester: 1 },
                    { id: "g5s1_unlike_fraction_mixed_proper_add", label: "대분수 + 진분수 (분모가 다름)", semester: 1 },
                    { id: "g5s1_unlike_fraction_mixed_add", label: "대분수 + 대분수 (분모가 다름)", semester: 1 },
                    { id: "g5s1_unlike_fraction_sub", label: "진분수 - 진분수 (분모가 다름)", semester: 1 },
                    { id: "g5s1_unlike_fraction_mixed_proper_sub", label: "대분수 - 진분수 (분모가 다름)", semester: 1 },
                    { id: "g5s1_unlike_fraction_mixed_sub", label: "대분수 - 대분수 (분모가 다름)", semester: 1 },
                    // 5학년 2학기 - 수의 범위와 어림하기
                    { id: "g5s2_range_inclusive", label: "이상·이하 범위 판단", semester: 2 },
                    { id: "g5s2_range_exclusive", label: "초과·미만 범위 판단", semester: 2 },
                    { id: "g5s2_range_count", label: "범위에 속하는 자연수의 개수", semester: 2 },
                    { id: "g5s2_range_extreme", label: "조건을 만족하는 가장 작은 수·가장 큰 수", semester: 2 },
                    { id: "g5s2_round_up", label: "올림", semester: 2 },
                    { id: "g5s2_round_down", label: "버림", semester: 2 },
                    { id: "g5s2_round_nearest", label: "반올림", semester: 2 },
                    { id: "g5s2_round_reverse_range", label: "반올림한 값으로 원래 수의 범위 찾기", semester: 2 },
                    // 5학년 2학기 - 분수의 곱셈
                    { id: "g5s2_fraction_proper_natural_mul", label: "진분수 × 자연수", semester: 2 },
                    { id: "g5s2_fraction_mixed_natural_mul", label: "대분수 × 자연수", semester: 2 },
                    { id: "g5s2_fraction_natural_proper_mul", label: "자연수 × 진분수", semester: 2 },
                    { id: "g5s2_fraction_natural_mixed_mul", label: "자연수 × 대분수", semester: 2 },
                    { id: "g5s2_fraction_proper_proper_mul", label: "진분수 × 진분수", semester: 2 },
                    { id: "g5s2_fraction_proper_mixed_mul", label: "진분수 × 대분수", semester: 2 },
                    { id: "g5s2_fraction_mixed_mixed_mul", label: "대분수 × 대분수", semester: 2 },
                    // 5학년 2학기 - 소수의 곱셈
                    { id: "g5s2_decimal_1_mul_natural", label: "소수 한 자리 수 × 자연수", semester: 2 },
                    { id: "g5s2_decimal_2_mul_natural", label: "소수 두 자리 수 × 자연수", semester: 2 },
                    { id: "g5s2_natural_mul_decimal_1", label: "자연수 × 소수 한 자리 수", semester: 2 },
                    { id: "g5s2_natural_mul_decimal_2", label: "자연수 × 소수 두 자리 수", semester: 2 },
                    { id: "g5s2_decimal_1_mul_decimal_1", label: "소수 한 자리 수 × 소수 한 자리 수", semester: 2 },
                    { id: "g5s2_decimal_mixed_mul", label: "자릿수가 다른 소수의 곱셈", semester: 2 },
                    { id: "g5s2_decimal_point_shift", label: "곱의 소수점 위치", semester: 2 }
                ]
            },
            {
                id: "pattern",
                label: "변화와 관계",
                subjects: [
                    { id: "g5s1_correspondence_forward", label: "대응 관계의 값 구하기", semester: 1 },
                    { id: "g5s1_correspondence_backward", label: "대응 관계에서 처음 값 구하기", semester: 1 },
                    { id: "g5s1_correspondence_table", label: "대응표의 빈칸", semester: 1 }
                ]
            },
            {
                id: "shape_measure",
                label: "도형과 측정",
                subjects: [
                    { id: "g5s1_rect_perimeter", label: "직사각형의 둘레", semester: 1 },
                    { id: "g5s1_square_perimeter", label: "정사각형의 둘레", semester: 1 },
                    { id: "g5s1_rect_area", label: "직사각형의 넓이", semester: 1 },
                    { id: "g5s1_square_area", label: "정사각형의 넓이", semester: 1 },
                    { id: "g5s1_parallelogram_area", label: "평행사변형의 넓이", semester: 1 },
                    { id: "g5s1_triangle_area", label: "삼각형의 넓이", semester: 1 },
                    { id: "g5s1_trapezoid_area", label: "사다리꼴의 넓이", semester: 1 },
                    { id: "g5s1_rhombus_area", label: "마름모의 넓이", semester: 1 },
                    // 5학년 2학기 - 합동과 대칭
                    { id: "g5s2_congruent_vertex", label: "합동인 도형의 대응 꼭짓점", semester: 2 },
                    { id: "g5s2_congruent_side", label: "합동인 도형의 대응변 길이", semester: 2 },
                    { id: "g5s2_congruent_angle", label: "합동인 도형의 대응각", semester: 2 },
                    { id: "g5s2_line_symmetry_distance", label: "선대칭도형의 대응점과 대칭축 사이 거리", semester: 2 },
                    { id: "g5s2_point_symmetry_distance", label: "점대칭도형의 대응점과 대칭 중심 사이 거리", semester: 2 },
                    // 5학년 2학기 - 직육면체
                    { id: "g5s2_cuboid_name", label: "입체도형 이름 찾기", semester: 2 },
                    { id: "g5s2_cuboid_count", label: "면·모서리·꼭짓점의 개수", semester: 2 },
                    { id: "g5s2_cuboid_vertex_meet", label: "한 꼭짓점에서 만나는 구성 요소", semester: 2 },
                    { id: "g5s2_cuboid_edge_total", label: "직육면체의 모든 모서리 길이의 합", semester: 2 },
                    { id: "g5s2_cuboid_edge_reverse", label: "모든 모서리 길이의 합으로 한 변의 길이 찾기", semester: 2 },
                    { id: "g5s2_cuboid_opposite_face", label: "마주 보는 면의 성질", semester: 2 }
                ]
            },
            {
                id: "data",
                label: "자료와 가능성",
                subjects: [
                    { id: "g5s2_average_basic", label: "여러 수의 평균", semester: 2 },
                    { id: "g5s2_average_to_sum", label: "평균과 자료 수로 합계 구하기", semester: 2 },
                    { id: "g5s2_average_missing_value", label: "평균을 이용하여 빠진 값 구하기", semester: 2 },
                    { id: "g5s2_average_after_change", label: "한 값이 변했을 때 새로운 평균", semester: 2 },
                    { id: "g5s2_probability_number", label: "일이 일어날 가능성을 수로 나타내기", semester: 2 },
                    { id: "g5s2_probability_compare", label: "가능성 비교하기", semester: 2 }
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

/** 학년 선택 메뉴에 노출할 학년 목록 (요구사항: 3~6학년만 선택 가능) */
const SELECTABLE_GRADES = [3, 4, 5, 6];

const semesterOptions = [
    { id: 1, label: "1학기" },
    { id: 2, label: "2학기" }
];

function getGradeEntry(grade) {
    return problemCatalog.find((g) => g.grade === Number(grade)) || null;
}

function getAreaEntry(grade, areaId) {
    const gradeEntry = getGradeEntry(grade);
    if (!gradeEntry) return null;
    return gradeEntry.areas.find((a) => a.id === areaId) || null;
}

/**
 * 선택한 학년의 학기에 해당하는 문제(semester 일치)만 남긴 영역 목록을 반환한다.
 * 세부 종목이 하나도 없는 영역은 결과에서 제외된다.
 */
function getAreasForGradeSemester(grade, semester) {
    const gradeEntry = getGradeEntry(grade);
    if (!gradeEntry || semester == null) return [];
    return gradeEntry.areas
        .map((area) => ({
            id: area.id,
            label: area.label,
            subjects: area.subjects.filter((s) => s.semester === Number(semester))
        }))
        .filter((area) => area.subjects.length > 0);
}

/** 선택한 학년·영역·학기에 해당하는 세부 종목 목록을 반환한다. */
function getSubjectsForGradeAreaSemester(grade, areaId, semester) {
    const areas = getAreasForGradeSemester(grade, semester);
    const area = areas.find((a) => a.id === areaId);
    return area ? area.subjects : [];
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
