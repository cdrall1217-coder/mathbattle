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
                    { id: "g4s2_triangle_missing_angle", label: "삼각형의 나머지 한 각", semester: 2 }
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
                    // 5학년 2학기 - 직육면체 (길이 계산만)
                    { id: "g5s2_cuboid_edge_total", label: "직육면체의 모든 모서리 길이의 합", semester: 2 },
                    { id: "g5s2_cuboid_edge_reverse", label: "모든 모서리 길이의 합으로 한 변의 길이 찾기", semester: 2 }
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
                    // 학기 미배정(준비 중) 기존 항목 - semester 없음
                    { id: "frac_of", label: "~의 몇 분의 몇" },
                    { id: "frac_imp", label: "가분수 ↔ 대분수" },
                    { id: "dec_add", label: "소수 덧셈" },
                    { id: "dec_sub", label: "소수 뺄셈" },
                    { id: "percent", label: "백분율 구하기" },
                    { id: "ratio", label: "비와 비율" },
                    // 6학년 1학기 - 분수의 나눗셈
                    { id: "g6s1_natural_div_natural_proper", label: "자연수 ÷ 자연수 (몫이 1보다 작음)", semester: 1 },
                    { id: "g6s1_natural_div_natural_mixed", label: "자연수 ÷ 자연수 (몫이 1보다 큼)", semester: 1 },
                    { id: "g6s1_proper_fraction_div_natural", label: "진분수 ÷ 자연수", semester: 1 },
                    { id: "g6s1_improper_fraction_div_natural", label: "가분수 ÷ 자연수", semester: 1 },
                    { id: "g6s1_mixed_fraction_div_natural", label: "대분수 ÷ 자연수", semester: 1 },
                    // 6학년 1학기 - 소수의 나눗셈
                    { id: "g6s1_decimal_1_div_natural", label: "소수 한 자리 수 ÷ 자연수", semester: 1 },
                    { id: "g6s1_decimal_2_div_natural", label: "소수 두 자리 수 ÷ 자연수", semester: 1 },
                    { id: "g6s1_decimal_div_natural_under_1", label: "몫이 1보다 작은 소수 ÷ 자연수", semester: 1 },
                    { id: "g6s1_decimal_div_zero_tenths", label: "몫의 소수 첫째 자리에 0이 있는 나눗셈", semester: 1 },
                    { id: "g6s1_decimal_div_append_zero", label: "소수점 아래 0을 내려 계산하는 나눗셈", semester: 1 },
                    { id: "g6s1_natural_div_natural_decimal", label: "자연수 ÷ 자연수의 몫을 소수로 나타내기", semester: 1 },
                    // 6학년 2학기 - 분수의 나눗셈
                    { id: "g6s2_same_den_fraction_div_exact", label: "분모가 같고 나누어떨어지는 분수 ÷ 분수", semester: 2 },
                    { id: "g6s2_same_den_fraction_div_nonexact", label: "분모가 같고 나누어떨어지지 않는 분수 ÷ 분수", semester: 2 },
                    { id: "g6s2_unlike_fraction_div", label: "분모가 다른 진분수 ÷ 진분수", semester: 2 },
                    { id: "g6s2_natural_div_unit_fraction", label: "자연수 ÷ 단위분수", semester: 2 },
                    { id: "g6s2_natural_div_fraction", label: "자연수 ÷ 진분수", semester: 2 },
                    { id: "g6s2_fraction_div_fraction", label: "진분수 또는 가분수 ÷ 분수", semester: 2 },
                    { id: "g6s2_mixed_fraction_div_fraction", label: "대분수 ÷ 대분수 또는 진분수", semester: 2 },
                    // 6학년 2학기 - 소수의 나눗셈
                    { id: "g6s2_decimal_1_div_decimal_1", label: "소수 한 자리 수 ÷ 소수 한 자리 수", semester: 2 },
                    { id: "g6s2_decimal_2_div_decimal_2", label: "소수 두 자리 수 ÷ 소수 두 자리 수", semester: 2 },
                    { id: "g6s2_decimal_mixed_places_div", label: "자릿수가 다른 소수 ÷ 소수", semester: 2 },
                    { id: "g6s2_natural_div_decimal", label: "자연수 ÷ 소수", semester: 2 },
                    { id: "g6s2_decimal_quotient_rounding", label: "몫을 반올림하여 나타내기", semester: 2 },
                    { id: "g6s2_decimal_div_remainder_quantity", label: "일정한 양씩 나누고 남는 양", semester: 2 }
                ]
            },
            {
                id: "pattern",
                label: "변화와 관계",
                subjects: [
                    // 6학년 1학기 - 비와 비율
                    { id: "g6s1_ratio_notation", label: "두 수를 비로 나타내기", semester: 1 },
                    { id: "g6s1_rate_as_fraction", label: "비율을 분수로 나타내기", semester: 1 },
                    { id: "g6s1_rate_as_decimal", label: "비율을 소수로 나타내기", semester: 1 },
                    { id: "g6s1_rate_as_percent", label: "비율을 백분율로 나타내기", semester: 1 },
                    { id: "g6s1_find_comparison_quantity", label: "기준량과 비율로 비교하는 양 구하기", semester: 1 },
                    { id: "g6s1_find_base_quantity", label: "비교하는 양과 비율로 기준량 구하기", semester: 1 },
                    { id: "g6s1_part_whole_percent", label: "전체와 부분을 이용한 백분율", semester: 1 },
                    // 6학년 2학기 - 비례식과 비례배분
                    { id: "g6s2_ratio_simplify_natural", label: "비를 간단한 자연수의 비로 나타내기", semester: 2 },
                    { id: "g6s2_ratio_decimal_to_natural", label: "소수의 비를 자연수의 비로 나타내기", semester: 2 },
                    { id: "g6s2_ratio_fraction_to_natural", label: "분수의 비를 자연수의 비로 나타내기", semester: 2 },
                    { id: "g6s2_equivalent_ratio_blank", label: "같은 비의 빈칸", semester: 2 },
                    { id: "g6s2_proportion_blank", label: "비례식의 빈칸", semester: 2 },
                    { id: "g6s2_proportion_application", label: "비례 관계의 값 구하기", semester: 2 },
                    { id: "g6s2_proportional_distribution", label: "비례배분", semester: 2 }
                ]
            },
            {
                id: "data",
                label: "자료와 가능성",
                subjects: [
                    // 6학년 1학기 - 여러 가지 그래프
                    { id: "g6s1_graph_category_percent", label: "전체 자료에서 항목의 백분율 구하기", semester: 1 },
                    { id: "g6s1_graph_category_count", label: "전체 수와 백분율로 항목 수 구하기", semester: 1 },
                    { id: "g6s1_graph_missing_percent", label: "여러 항목의 빠진 백분율", semester: 1 },
                    { id: "g6s1_graph_largest_smallest", label: "백분율이 가장 큰 항목 또는 작은 항목", semester: 1 },
                    { id: "g6s1_graph_percent_difference", label: "두 항목의 백분율 차", semester: 1 }
                ]
            },
            {
                id: "shape_measure",
                label: "도형과 측정",
                subjects: [
                    // 6학년 1학기 - 직육면체의 겉넓이와 부피
                    { id: "g6s1_cuboid_surface_area", label: "직육면체의 겉넓이", semester: 1 },
                    { id: "g6s1_cube_surface_area", label: "정육면체의 겉넓이", semester: 1 },
                    { id: "g6s1_cuboid_missing_dimension_surface", label: "겉넓이로 직육면체의 한 변 구하기", semester: 1 },
                    { id: "g6s1_cuboid_volume", label: "직육면체의 부피", semester: 1 },
                    { id: "g6s1_cube_volume", label: "정육면체의 부피", semester: 1 },
                    { id: "g6s1_cuboid_missing_dimension_volume", label: "부피로 직육면체의 한 변 구하기", semester: 1 },
                    { id: "g6s1_cuboid_volume_compare", label: "두 직육면체의 부피 비교", semester: 1 },
                    // 6학년 2학기 - 원의 둘레와 넓이
                    { id: "g6s2_circle_circumference_diameter", label: "지름으로 원주 구하기", semester: 2 },
                    { id: "g6s2_circle_circumference_radius", label: "반지름으로 원주 구하기", semester: 2 },
                    { id: "g6s2_circle_diameter_from_circumference", label: "원주로 지름 구하기", semester: 2 },
                    { id: "g6s2_circle_radius_from_circumference", label: "원주로 반지름 구하기", semester: 2 },
                    { id: "g6s2_circle_area_radius", label: "반지름으로 원의 넓이 구하기", semester: 2 },
                    { id: "g6s2_circle_area_diameter", label: "지름으로 원의 넓이 구하기", semester: 2 },
                    { id: "g6s2_circle_radius_from_area", label: "원의 넓이로 반지름 구하기", semester: 2 },
                    { id: "g6s2_semicircle_perimeter", label: "반원의 둘레", semester: 2 }
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
