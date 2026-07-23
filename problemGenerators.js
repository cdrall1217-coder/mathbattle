/**
 * 문제 생성기 맵
 * - 키(id)는 problemCatalog의 subjects[].id 와 일치해야 함
 * - 각 함수는 { formulaFront, formulaBack, answer } 를 반환
 * - 생성 조건·정답 로직은 기존 generateMathProblem switch 와 동일
 */

function makeFractionHTML(numerator, denominator) {
    return `<span class="fraction"><span class="num">${numerator}</span><span class="den">${denominator}</span></span>`;
}

/** 천 단위 구분 쉼표가 포함된 문자열로 변환 (예: 3500000 -> "3,500,000") */
function formatNumber(n) {
    return Number(n).toLocaleString('en-US');
}

/** 임의의 D자리 자연수를 생성 (맨 앞자리는 1~9) */
function randomDigitNumber(digits) {
    let str = String(Math.floor(Math.random() * 9) + 1);
    for (let i = 1; i < digits; i++) {
        str += String(Math.floor(Math.random() * 10));
    }
    return Number(str);
}

/** min 이상 max 이하의 정수 난수 (양 끝 포함) */
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 조건(isValidFn)을 만족할 때까지 generateFn을 재시도 (무한루프 방지용 최대 시도 횟수 포함) */
function generateUntilValid(generateFn, isValidFn, maxAttempts) {
    let result;
    const limit = maxAttempts || 100;
    for (let i = 0; i < limit; i++) {
        result = generateFn();
        if (isValidFn(result)) return result;
    }
    return result; // 극히 드문 경우: 마지막 시도 결과라도 반환
}

/* ===== 분수 공용 함수 (4학년 2학기) ===== */

/**
 * 가분수를 정규화한다 (분자가 분모 이상이면 자연수 부분으로 이월).
 * numerator는 0 이상이어야 한다.
 * @returns {{whole: number, numerator: number}}
 */
function normalizeMixedNumber(whole, numerator, denominator) {
    const extraWhole = Math.floor(numerator / denominator);
    const finalNumerator = numerator - extraWhole * denominator;
    return { whole: whole + extraWhole, numerator: finalNumerator };
}

/** 한 자리 자연수(0~9 등)를 소리 내어 읽을 때 받침 유무에 따라 "과"/"와"를 고른다. (일의 자리 발음 기준) */
function koreanMixedConnector(n) {
    const connectorByLastDigit = ["과", "과", "와", "과", "와", "와", "과", "과", "과", "와"];
    return connectorByLastDigit[Math.abs(n) % 10];
}

/**
 * 자연수 + 분수를 대분수/진분수/자연수 형태의 HTML 문자열로 표시한다.
 * 세로형 분수 표시(makeFractionHTML)를 사용하며, 필요 시 가분수를 자동으로 정규화한다.
 */
function formatMixedNumber(whole, numerator, denominator) {
    const norm = normalizeMixedNumber(whole, numerator, denominator);
    if (norm.numerator === 0) {
        return String(norm.whole);
    }
    if (norm.whole === 0) {
        return makeFractionHTML(norm.numerator, denominator);
    }
    return `${norm.whole}${koreanMixedConnector(norm.whole)} ${makeFractionHTML(norm.numerator, denominator)}`;
}

/* ===== 소수 공용 함수 (4학년 2학기) - 부동소수점 오차 방지 ===== */

/**
 * 정수로 스케일된 소수 값을 문자열로 표시한다. (예: scaledValue=706, decimals=2 -> "7.06")
 * 소수점 아래 불필요한 0은 제거한다.
 */
function formatScaledDecimal(scaledValue, decimals) {
    const sign = scaledValue < 0 ? "-" : "";
    const abs = Math.abs(scaledValue);
    const scale = Math.pow(10, decimals);
    const intPart = Math.floor(abs / scale);
    let fracPart = String(abs % scale).padStart(decimals, "0");
    fracPart = fracPart.replace(/0+$/, "");
    return fracPart.length > 0 ? `${sign}${intPart}.${fracPart}` : `${sign}${intPart}`;
}

/** 소수점 이하 마지막 자리가 0이 아닌 스케일된 정수를 생성 (진짜 해당 자릿수의 소수가 되도록 보장) */
function randDecimalScaled(minScaled, maxScaled) {
    let v;
    do {
        v = randInt(minScaled, maxScaled);
    } while (v % 10 === 0);
    return v;
}

/* ===== 삼각형 공용 함수 (4학년 2학기) ===== */

/** 세 변의 길이가 실제 삼각형을 이룰 수 있는지 확인 (삼각부등식) */
function isValidTriangleSides(a, b, c) {
    return a + b > c && b + c > a && a + c > b;
}

/* ===== 최대공약수·최소공배수·분수 약분 공용 함수 (5학년 1학기) ===== */

/** 유클리드 호제법으로 최대공약수를 구한다. */
function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { [a, b] = [b, a % b]; }
    return a || 1;
}

/** 최소공배수를 구한다. */
function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
}

/** 분수를 최대공약수로 나누어 기약분수로 만든다. */
function simplifyFraction(numerator, denominator) {
    const g = gcd(numerator, denominator);
    return { numerator: numerator / g, denominator: denominator / g };
}

/** 자연수의 약수를 오름차순으로 모두 구한다. */
function getDivisors(n) {
    const divisors = [];
    for (let i = 1; i <= n; i++) {
        if (n % i === 0) divisors.push(i);
    }
    return divisors;
}

/**
 * 자연수부(whole)+분수부(numerator/denominator)로 표현된 두 수를 통분하여
 * 덧셈 또는 뺄셈한 뒤, 기약분수로 약분하고 대분수로 정규화한 결과를 반환한다.
 * (4학년 2학기에서 만든 normalizeMixedNumber를 재사용)
 * @param {'+'|'-'} op
 * @returns {{whole:number, numerator:number, denominator:number}}
 */
function computeUnlikeFractionResult(w1, n1, d1, w2, n2, d2, op) {
    const commonDenom = lcm(d1, d2);
    const num1 = w1 * commonDenom + n1 * (commonDenom / d1);
    const num2 = w2 * commonDenom + n2 * (commonDenom / d2);
    const totalNumerator = op === "+" ? num1 + num2 : num1 - num2;
    const simplified = simplifyFraction(totalNumerator, commonDenom);
    const norm = normalizeMixedNumber(0, simplified.numerator, simplified.denominator);
    return { whole: norm.whole, numerator: norm.numerator, denominator: simplified.denominator };
}

/** 분모가 다른 두 분수(자연수부 포함)의 크기를 정수 교차곱으로 비교한다 (부동소수점 미사용). */
function compareUnlikeFractions(w1, n1, d1, w2, n2, d2) {
    const val1 = w1 * d1 + n1; // w1 + n1/d1 을 분모 d1 기준 분자로 표현
    const val2 = w2 * d2 + n2;
    const left = val1 * d2;
    const right = val2 * d1;
    if (left > right) return ">";
    if (left < right) return "<";
    return "=";
}

/* ===== 도형 넓이 공용 표시 헬퍼 (5학년 1학기) ===== */
function formatCm(value) { return `${value}cm`; }
function formatCm2(value) { return `${value}cm\u00B2`; }

/* ===== 수의 범위 공용 함수 (5학년 2학기) ===== */

/** value가 [lower, upper] 구간(경곗값 포함 여부를 각각 지정)에 속하는지 판별한다. */
function isInRange(value, lower, lowerInclusive, upper, upperInclusive) {
    const lowerOk = lowerInclusive ? value >= lower : value > lower;
    const upperOk = upperInclusive ? value <= upper : value < upper;
    return lowerOk && upperOk;
}

/** [lower, upper] 구간(경곗값 포함 여부를 각각 지정)에 속하는 자연수의 개수를 구한다. */
function countInRange(lower, lowerInclusive, upper, upperInclusive) {
    const start = lowerInclusive ? lower : lower + 1;
    const end = upperInclusive ? upper : upper - 1;
    return Math.max(0, end - start + 1);
}

/* ===== 올림·버림·반올림 공용 함수 (5학년 2학기) ===== */

const ROUND_PLACES = [10, 100, 1000];
const ROUND_PLACE_LABELS = { 10: "십의 자리", 100: "백의 자리", 1000: "천의 자리" };

/** n을 place(10/100/1000) 단위로 올림·버림·반올림한다. mode: 'up'|'down'|'nearest' */
function roundToPlace(n, place, mode) {
    const remainder = n % place;
    const base = n - remainder;
    if (mode === "down") return base;
    if (mode === "up") return remainder === 0 ? base : base + place;
    return remainder * 2 >= place ? base + place : base; // nearest
}

/** place 단위로 반올림한 결과값(roundedValue)이 나올 수 있는 원래 자연수의 최솟값·최댓값을 구한다. */
function roundedRangeBounds(roundedValue, place) {
    const half = place / 2;
    return { min: roundedValue - half, max: roundedValue + half - 1 };
}

/* ===== 분수 곱셈 공용 함수 (5학년 2학기) ===== */

/**
 * 자연수부(whole)+분수부(numerator/denominator)로 표현된 두 수를 곱한다.
 * 두 수를 모두 가분수 형태의 정수 분자로 바꾼 뒤 분자끼리, 분모끼리 정수로 곱하고
 * (기존 simplifyFraction, normalizeMixedNumber 재사용) 기약분수·대분수로 정규화한다.
 * 자연수는 (해당 수, 0, 1)로 표현하면 동일한 계산식으로 처리된다.
 * @returns {{whole:number, numerator:number, denominator:number}}
 */
function multiplyMixedFractions(w1, n1, d1, w2, n2, d2) {
    const num1 = w1 * d1 + n1; // 가분수 분자
    const num2 = w2 * d2 + n2;
    const resultNumerator = num1 * num2;
    const resultDenominator = d1 * d2;
    const simplified = simplifyFraction(resultNumerator, resultDenominator);
    const norm = normalizeMixedNumber(0, simplified.numerator, simplified.denominator);
    return { whole: norm.whole, numerator: norm.numerator, denominator: simplified.denominator };
}

/* ===== 소수 곱셈 공용 함수 (5학년 2학기) - 기존 randDecimalScaled·formatScaledDecimal 확장 ===== */

/**
 * 정수로 스케일된 두 소수를 정수 곱셈으로만 곱한다 (JS 부동소수점 곱셈 미사용).
 * @returns {{scaledProduct:number, decimals:number}}
 */
function multiplyScaledDecimals(scaledA, decimalsA, scaledB, decimalsB) {
    return { scaledProduct: scaledA * scaledB, decimals: decimalsA + decimalsB };
}

/* ===== 분수 나눗셈 공용 함수 (6학년) ===== */

/**
 * 자연수부(whole)+분수부(numerator/denominator)로 표현된 두 수를 나눈다.
 * "나누는 수의 역수를 곱한다"는 원리를 그대로 이용해 기존 multiplyMixedFractions를 재사용한다.
 * @returns {{whole:number, numerator:number, denominator:number}}
 */
function divideFractions(w1, n1, d1, w2, n2, d2) {
    const divisorNumerator = w2 * d2 + n2; // 나누는 수의 가분수 분자 (0이 되지 않도록 호출부에서 보장)
    // 나누는 수의 역수는 분모(d2) / 가분수 분자(divisorNumerator) 이므로
    // whole=0, numerator=d2, denominator=divisorNumerator 형태로 곱셈에 대입한다.
    return multiplyMixedFractions(w1, n1, d1, 0, d2, divisorNumerator);
}

/* ===== 소수 나눗셈 공용 함수 (6학년) ===== */

/**
 * 정수로 스케일된 두 소수를 나눈 몫을 정확한 소수 문자열로 반환한다. (유한소수가 아니면 null)
 * value = (dividendScaled/10^dividendDecimals) ÷ (divisorScaled/10^divisorDecimals)
 * 정수 분수(numerator/denominator)로 변환한 뒤 분모가 2와 5로만 이루어지는지(유한소수 조건)를 검사한다.
 */
function divideScaledDecimals(dividendScaled, dividendDecimals, divisorScaled, divisorDecimals) {
    let numerator = dividendScaled * Math.pow(10, divisorDecimals);
    let denominator = divisorScaled * Math.pow(10, dividendDecimals);
    const g = gcd(numerator, denominator);
    numerator /= g; denominator /= g;

    let count2 = 0, count5 = 0, temp = denominator;
    while (temp % 2 === 0) { temp /= 2; count2++; }
    while (temp % 5 === 0) { temp /= 5; count5++; }
    if (temp !== 1) return null; // 2, 5 이외의 소인수가 남으면 무한소수

    const k = Math.max(count2, count5);
    const scaledResult = (numerator * Math.pow(10, k)) / denominator;
    return formatScaledDecimal(scaledResult, k);
}

/**
 * 분수(numerator/denominator, 분모>0) 값을 소수 places자리까지 반올림한 소수 문자열로 반환한다.
 * 부동소수점 나눗셈을 직접 사용하지 않고 정수 연산(몫과 나머지)만 사용한다.
 */
function roundRationalHalfUp(numerator, denominator, places) {
    const scale = Math.pow(10, places);
    const scaledNumerator = numerator * scale;
    const quotient = Math.floor(scaledNumerator / denominator);
    const remainder = scaledNumerator - quotient * denominator;
    const roundedScaled = remainder * 2 >= denominator ? quotient + 1 : quotient;
    return formatScaledDecimal(roundedScaled, places);
}

/* ===== 비의 단순화 공용 함수 (6학년) ===== */

/** 자연수 두 개로 이루어진 비를 최대공약수로 나누어 가장 간단한 자연수의 비로 만든다. */
function simplifyRatio(a, b) {
    const g = gcd(a, b);
    return { a: a / g, b: b / g };
}

/* ===== 원의 둘레·넓이 공용 함수 (6학년 2학기) - 원주율 314/100(3.14) 정수 스케일 ===== */

const PI_SCALED = 314; // 3.14 = 314/100

/**
 * 원주율 3.14(314/100)를 이용해 원의 원주 또는 넓이를 계산한다. (정수 스케일 연산만 사용)
 * @param {'circumference'|'area'} type - circumference면 value를 지름으로, area면 value를 반지름으로 취급
 * @returns {string} 소수점 아래 불필요한 0이 제거된 소수 문자열
 */
function calculateCircleValue(type, value) {
    const scaled = type === "circumference" ? value * PI_SCALED : value * value * PI_SCALED;
    return formatScaledDecimal(scaled, 2);
}

/* ===== cm³ 표시 헬퍼 (6학년 1학기) ===== */
function formatCm3(value) { return `${value}cm\u00B3`; }

const problemGenerators = {
    add1() {
        const n1 = Math.floor(Math.random() * 9) + 1;
        const n2 = Math.floor(Math.random() * (10 - n1)) + 1;
        return {
            formulaFront: `${n1} + ${n2}`,
            formulaBack: `${n1} + ${n2}`,
            answer: String(n1 + n2)
        };
    },

    sub1() {
        const n1 = Math.floor(Math.random() * 9) + 1;
        const n2 = Math.floor(Math.random() * n1) + 1;
        return {
            formulaFront: `${n1} - ${n2}`,
            formulaBack: `${n1} - ${n2}`,
            answer: String(n1 - n2)
        };
    },

    make10() {
        const n1 = Math.floor(Math.random() * 9) + 1;
        return {
            formulaFront: `${n1} + ? = 10`,
            formulaBack: `${n1} + ? = 10`,
            answer: String(10 - n1)
        };
    },

    mul_table() {
        const n1 = Math.floor(Math.random() * 8) + 2;
        const n2 = Math.floor(Math.random() * 9) + 1;
        return {
            formulaFront: `${n1} × ${n2}`,
            formulaBack: `${n1} × ${n2}`,
            answer: String(n1 * n2)
        };
    },

    dec_add() {
        const n1 = (Math.floor(Math.random() * 90) + 10) / 10;
        const n2 = (Math.floor(Math.random() * 90) + 10) / 10;
        const sum = Math.round((n1 + n2) * 10) / 10;
        return {
            formulaFront: `${n1} + ${n2}`,
            formulaBack: `${n1} + ${n2}`,
            answer: String(sum)
        };
    },

    dec_sub() {
        let n1 = (Math.floor(Math.random() * 90) + 10) / 10;
        let n2 = (Math.floor(Math.random() * 90) + 10) / 10;
        if (n1 < n2) { [n1, n2] = [n2, n1]; }
        const diff = Math.round((n1 - n2) * 10) / 10;
        return {
            formulaFront: `${n1} - ${n2}`,
            formulaBack: `${n1} - ${n2}`,
            answer: String(diff)
        };
    },

    percent() {
        const whole = (Math.floor(Math.random() * 9) + 2) * 10;
        const percent = (Math.floor(Math.random() * 9) + 1) * 10;
        return {
            formulaFront: `${whole}의 ${percent}%는?`,
            formulaBack: `${whole}의 ${percent}%`,
            answer: String(whole * percent / 100)
        };
    },

    ratio() {
        const a = Math.floor(Math.random() * 8) + 2;
        const b = Math.floor(Math.random() * 8) + 2;
        const k = Math.floor(Math.random() * 5) + 2;
        return {
            formulaFront: `${a} : ${b} = ${a * k} : ?`,
            formulaBack: `${a} : ${b} = ${a * k} : ?`,
            answer: String(b * k)
        };
    },

    add2() {
        const n1 = Math.floor(Math.random() * 80) + 10;
        const n2 = Math.floor(Math.random() * 80) + 10;
        return {
            formulaFront: `${n1} + ${n2}`,
            formulaBack: `${n1} + ${n2}`,
            answer: String(n1 + n2)
        };
    },

    sub2() {
        let n1 = Math.floor(Math.random() * 80) + 10;
        let n2 = Math.floor(Math.random() * 80) + 10;
        if (n1 < n2) { [n1, n2] = [n2, n1]; }
        return {
            formulaFront: `${n1} - ${n2}`,
            formulaBack: `${n1} - ${n2}`,
            answer: String(n1 - n2)
        };
    },

    add3() {
        const n1 = Math.floor(Math.random() * 800) + 100;
        const n2 = Math.floor(Math.random() * 800) + 100;
        return {
            formulaFront: `${n1} + ${n2}`,
            formulaBack: `${n1} + ${n2}`,
            answer: String(n1 + n2)
        };
    },

    sub3() {
        let n1 = Math.floor(Math.random() * 800) + 100;
        let n2 = Math.floor(Math.random() * 800) + 100;
        if (n1 < n2) { [n1, n2] = [n2, n1]; }
        return {
            formulaFront: `${n1} - ${n2}`,
            formulaBack: `${n1} - ${n2}`,
            answer: String(n1 - n2)
        };
    },

    div_single() {
        let divisor, quotient, dividend;
        do {
            divisor = Math.floor(Math.random() * 8) + 2;
            quotient = Math.floor(Math.random() * 8) + 2;
            dividend = divisor * quotient;
        } while (dividend < 10);
        return {
            formulaFront: `${dividend} ÷ ${divisor}`,
            formulaBack: `${dividend} ÷ ${divisor}`,
            answer: String(quotient)
        };
    },

    mul_tens() {
        const n1 = Math.floor(Math.random() * 89) + 10;
        const n2 = Math.floor(Math.random() * 8) + 2;
        return {
            formulaFront: `${n1} × ${n2}`,
            formulaBack: `${n1} × ${n2}`,
            answer: String(n1 * n2)
        };
    },

    unit_len() {
        const cm = Math.floor(Math.random() * 15) + 1;
        const mm = Math.floor(Math.random() * 9) + 1;
        const totalMm = cm * 10 + mm;
        if (Math.random() > 0.5) {
            return {
                formulaFront: `${cm}cm ${mm}mm = ( ? )mm`,
                formulaBack: `${cm}cm ${mm}mm`,
                answer: `${totalMm}mm`
            };
        }
        return {
            formulaFront: `${totalMm}mm = ? cm ? mm`,
            formulaBack: `${totalMm}mm`,
            answer: `${cm}cm ${mm}mm`
        };
    },

    unit_dist() {
        const km = Math.floor(Math.random() * 9) + 1;
        const m = (Math.floor(Math.random() * 99) + 1) * 10;
        const totalM = km * 1000 + m;
        if (Math.random() > 0.5) {
            return {
                formulaFront: `${km}km ${m}m = ( ? )m`,
                formulaBack: `${km}km ${m}m`,
                answer: `${totalM}m`
            };
        }
        return {
            formulaFront: `${totalM}m = ? km ? m`,
            formulaBack: `${totalM}m`,
            answer: `${km}km ${m}m`
        };
    },

    time_add_no() {
        const isHourMin = Math.random() > 0.5;
        const u1 = isHourMin ? "시" : "분";
        const u2 = isHourMin ? "분" : "초";

        const t1 = Math.floor(Math.random() * 5) + 1;
        const t2 = Math.floor(Math.random() * 4) + 1;
        const s1 = Math.floor(Math.random() * 25) + 1;
        const s2 = Math.floor(Math.random() * 25) + 1;

        return {
            formulaFront: `${t1}${u1} ${s1}${u2} + ${t2}${u1} ${s2}${u2}`,
            formulaBack: `${t1}${u1} ${s1}${u2} + ${t2}${u1} ${s2}${u2}`,
            answer: `${t1 + t2}${u1} ${s1 + s2}${u2}`
        };
    },

    time_add_yes() {
        const isHourMin = Math.random() > 0.5;
        const u1 = isHourMin ? "시" : "분";
        const u2 = isHourMin ? "분" : "초";

        const t1 = Math.floor(Math.random() * 5) + 1;
        const t2 = Math.floor(Math.random() * 4) + 1;
        const s1 = Math.floor(Math.random() * 25) + 35;
        const s2 = Math.floor(Math.random() * 24) + 26;

        const totalS = s1 + s2;
        const ansT = t1 + t2 + 1;
        const ansS = totalS - 60;

        return {
            formulaFront: `${t1}${u1} ${s1}${u2} + ${t2}${u1} ${s2}${u2}`,
            formulaBack: `${t1}${u1} ${s1}${u2} + ${t2}${u1} ${s2}${u2}`,
            answer: ansS === 0 ? `${ansT}${u1}` : `${ansT}${u1} ${ansS}${u2}`
        };
    },

    time_sub_no() {
        const isHourMin = Math.random() > 0.5;
        const u1 = isHourMin ? "시" : "분";
        const u2 = isHourMin ? "분" : "초";

        const t2 = Math.floor(Math.random() * 4) + 1;
        const t1 = t2 + Math.floor(Math.random() * 4) + 1;
        const s2 = Math.floor(Math.random() * 25) + 1;
        const s1 = s2 + Math.floor(Math.random() * 30);

        return {
            formulaFront: `${t1}${u1} ${s1}${u2} - ${t2}${u1} ${s2}${u2}`,
            formulaBack: `${t1}${u1} ${s1}${u2} - ${t2}${u1} ${s2}${u2}`,
            answer: `${t1 - t2}${u1} ${s1 - s2}${u2}`
        };
    },

    time_sub_yes() {
        const isHourMin = Math.random() > 0.5;
        const u1 = isHourMin ? "시" : "분";
        const u2 = isHourMin ? "분" : "초";

        const t2 = Math.floor(Math.random() * 4) + 1;
        const t1 = t2 + Math.floor(Math.random() * 4) + 1;
        const s1 = Math.floor(Math.random() * 25) + 1;
        const s2 = s1 + Math.floor(Math.random() * 20) + 10;

        const totalS1 = t1 * 60 + s1;
        const totalS2 = t2 * 60 + s2;
        const diffS = totalS1 - totalS2;
        const ansT = Math.floor(diffS / 60);
        const ansS = diffS % 60;

        return {
            formulaFront: `${t1}${u1} ${s1}${u2} - ${t2}${u1} ${s2}${u2}`,
            formulaBack: `${t1}${u1} ${s1}${u2} - ${t2}${u1} ${s2}${u2}`,
            answer: ansS === 0 ? `${ansT}${u1}` : `${ansT}${u1} ${ansS}${u2}`
        };
    },

    mul_hundreds() {
        const n1 = Math.floor(Math.random() * 890) + 100;
        const n2 = Math.floor(Math.random() * 8) + 2;
        return {
            formulaFront: `${n1} × ${n2}`,
            formulaBack: `${n1} × ${n2}`,
            answer: String(n1 * n2)
        };
    },

    mul_double() {
        const n1 = Math.floor(Math.random() * 89) + 10;
        const n2 = Math.floor(Math.random() * 89) + 10;
        return {
            formulaFront: `${n1} × ${n2}`,
            formulaBack: `${n1} × ${n2}`,
            answer: String(n1 * n2)
        };
    },

    div_no_rem2() {
        const divisor = Math.floor(Math.random() * 8) + 2;
        const quotient = Math.floor(Math.random() * 40) + 10;
        const dividend = divisor * quotient;
        return {
            formulaFront: `${dividend} ÷ ${divisor}`,
            formulaBack: `${dividend} ÷ ${divisor}`,
            answer: String(quotient)
        };
    },

    div_rem2() {
        const divisor = Math.floor(Math.random() * 8) + 2;
        let dividend;
        do {
            dividend = Math.floor(Math.random() * 80) + 15;
        } while (dividend % divisor === 0);
        const quotient = Math.floor(dividend / divisor);
        const remainder = dividend % divisor;
        return {
            formulaFront: `${dividend} ÷ ${divisor}`,
            formulaBack: `${dividend} ÷ ${divisor}`,
            answer: `${quotient} <span class="text-lg">나머지</span> ${remainder}`
        };
    },

    div_no_rem3() {
        const divisor = Math.floor(Math.random() * 8) + 2;
        const quotient = Math.floor(Math.random() * 150) + 100;
        const dividend = divisor * quotient;
        return {
            formulaFront: `${dividend} ÷ ${divisor}`,
            formulaBack: `${dividend} ÷ ${divisor}`,
            answer: String(quotient)
        };
    },

    div_rem3() {
        const divisor = Math.floor(Math.random() * 8) + 2;
        let dividend;
        do {
            dividend = Math.floor(Math.random() * 800) + 150;
        } while (dividend % divisor === 0);
        const quotient = Math.floor(dividend / divisor);
        const remainder = dividend % divisor;
        return {
            formulaFront: `${dividend} ÷ ${divisor}`,
            formulaBack: `${dividend} ÷ ${divisor}`,
            answer: `${quotient} <span class="text-lg">나머지</span> ${remainder}`
        };
    },

    frac_of() {
        const denOptions = [3, 4, 5, 6, 8, 10];
        const denominator = denOptions[Math.floor(Math.random() * denOptions.length)];
        const numerator = Math.floor(Math.random() * (denominator - 1)) + 1;
        const multiplier = Math.floor(Math.random() * 9) + 2;
        const baseNum = denominator * multiplier;
        const fracHTML = makeFractionHTML(numerator, denominator);
        return {
            formulaFront: `${baseNum}의 ${fracHTML}은 얼마?`,
            formulaBack: `${baseNum}의 ${fracHTML}`,
            answer: String(multiplier * numerator)
        };
    },

    frac_imp() {
        const denominator = Math.floor(Math.random() * 8) + 2;
        const wholeNum = Math.floor(Math.random() * 4) + 1;
        const numerator = Math.floor(Math.random() * (denominator - 1)) + 1;
        const impNumerator = wholeNum * denominator + numerator;
        const impFracHTML = makeFractionHTML(impNumerator, denominator);
        const mixedFracHTML = `${wholeNum}${makeFractionHTML(numerator, denominator)}`;
        if (Math.random() > 0.5) {
            return {
                formulaFront: impFracHTML,
                formulaBack: impFracHTML,
                answer: mixedFracHTML
            };
        }
        return {
            formulaFront: mixedFracHTML,
            formulaBack: mixedFracHTML,
            answer: impFracHTML
        };
    },

    /* ========== 4학년 1학기 ========== */

    // ① 큰 수의 크기 비교 (만 단위 ~ 억 단위, 자릿수가 다른 경우 / 같은 경우 모두 생성)
    g4s1_large_compare() {
        const MIN_DIGITS = 5; // 만
        const MAX_DIGITS = 9; // 억
        let a, b;

        if (Math.random() < 0.5) {
            // 자릿수는 같지만 중간 자리에서 크기가 갈리는 경우
            const digits = Math.floor(Math.random() * (MAX_DIGITS - MIN_DIGITS + 1)) + MIN_DIGITS;
            const base = randomDigitNumber(digits);
            const baseStr = String(base);
            const pos = 1 + Math.floor(Math.random() * (digits - 1)); // 맨 앞자리는 유지
            const oldDigit = baseStr[pos];
            let newDigit;
            do {
                newDigit = String(Math.floor(Math.random() * 10));
            } while (newDigit === oldDigit);
            const otherStr = baseStr.slice(0, pos) + newDigit + baseStr.slice(pos + 1);
            a = base;
            b = Number(otherStr);
        } else {
            // 자릿수가 다른 경우
            let d1 = Math.floor(Math.random() * (MAX_DIGITS - MIN_DIGITS + 1)) + MIN_DIGITS;
            let d2;
            do {
                d2 = Math.floor(Math.random() * (MAX_DIGITS - MIN_DIGITS + 1)) + MIN_DIGITS;
            } while (d2 === d1);
            a = randomDigitNumber(d1);
            b = randomDigitNumber(d2);
        }

        if (Math.random() < 0.5) { [a, b] = [b, a]; }

        const formula = `${formatNumber(a)} ( ? ) ${formatNumber(b)}`;
        return {
            formulaFront: formula,
            formulaBack: formula,
            answer: a > b ? "&gt;" : "&lt;"
        };
    },

    // ② 큰 수의 자릿값
    g4s1_place_value() {
        const digits = Math.floor(Math.random() * 5) + 5; // 5~9자리 (만~억)
        const num = randomDigitNumber(digits);
        const numStr = String(num);
        const placeNames = ["일", "십", "백", "천", "만", "십만", "백만", "천만", "억"];

        let power = Math.floor(Math.random() * digits); // 0 ~ digits-1 (오른쪽에서부터)
        let digitChar = numStr[digits - 1 - power];
        let attempts = 0;
        while (digitChar === "0" && attempts < 20) {
            power = Math.floor(Math.random() * digits);
            digitChar = numStr[digits - 1 - power];
            attempts++;
        }

        const placeName = placeNames[power];
        const value = Number(digitChar) * Math.pow(10, power);

        return {
            formulaFront: `${formatNumber(num)}에서 <b>${placeName}의 자리</b> 숫자가 나타내는 값은?`,
            formulaBack: `${formatNumber(num)}에서 ${placeName}의 자리`,
            answer: formatNumber(value)
        };
    },

    // ③ 자연수의 10배·100배·1000배
    g4s1_pow10() {
        const options = [
            { m: 10, baseUnit: 1000 },
            { m: 100, baseUnit: 100 },
            { m: 1000, baseUnit: 10 }
        ];
        const choice = options[Math.floor(Math.random() * options.length)];
        const base = (Math.floor(Math.random() * 999) + 1) * choice.baseUnit;
        const answer = base * choice.m;
        return {
            formulaFront: `${formatNumber(base)}의 ${choice.m}배`,
            formulaBack: `${formatNumber(base)}의 ${choice.m}배`,
            answer: formatNumber(answer)
        };
    },

    // ④ 세 자리 수 × 두 자리 수 (두 자리 수는 10의 배수 제외 - ⑤와 구분)
    g4s1_mul_3x2() {
        const n1 = Math.floor(Math.random() * 900) + 100; // 100~999
        let n2;
        do {
            n2 = Math.floor(Math.random() * 90) + 10; // 10~99
        } while (n2 % 10 === 0);
        return {
            formulaFront: `${n1} × ${n2}`,
            formulaBack: `${n1} × ${n2}`,
            answer: formatNumber(n1 * n2)
        };
    },

    // ⑤ 몇백몇십 × 몇십
    g4s1_mul_round() {
        const hundredsDigit = Math.floor(Math.random() * 9) + 1; // 1~9
        const tensDigit = Math.floor(Math.random() * 9) + 1; // 1~9
        const n1 = hundredsDigit * 100 + tensDigit * 10;
        const n2 = (Math.floor(Math.random() * 9) + 1) * 10; // 10~90
        return {
            formulaFront: `${formatNumber(n1)} × ${formatNumber(n2)}`,
            formulaBack: `${formatNumber(n1)} × ${formatNumber(n2)}`,
            answer: formatNumber(n1 * n2)
        };
    },

    // ⑥ 세 자리 수 ÷ 두 자리 수, 나머지 없음
    g4s1_div_3x2_no_rem() {
        let divisor, minQ, maxQ;
        do {
            divisor = Math.floor(Math.random() * 90) + 10; // 10~99
            minQ = Math.max(2, Math.ceil(100 / divisor));
            maxQ = Math.floor(999 / divisor);
        } while (minQ > maxQ);
        const quotient = Math.floor(Math.random() * (maxQ - minQ + 1)) + minQ;
        const dividend = divisor * quotient;
        return {
            formulaFront: `${dividend} ÷ ${divisor}`,
            formulaBack: `${dividend} ÷ ${divisor}`,
            answer: String(quotient)
        };
    },

    // ⑦ 세 자리 수 ÷ 두 자리 수, 나머지 있음
    g4s1_div_3x2_rem() {
        let divisor, quotient, remainder, dividend;
        do {
            divisor = Math.floor(Math.random() * 90) + 10; // 10~99
            const maxQ = Math.floor(999 / divisor);
            quotient = Math.floor(Math.random() * maxQ) + 1;
            remainder = Math.floor(Math.random() * (divisor - 1)) + 1; // 1 ~ divisor-1
            dividend = divisor * quotient + remainder;
        } while (dividend < 100 || dividend > 999);
        return {
            formulaFront: `${dividend} ÷ ${divisor}`,
            formulaBack: `${dividend} ÷ ${divisor}`,
            answer: `${quotient} <span class="text-lg">나머지</span> ${remainder}`
        };
    },

    // ⑧ 각도의 합 (360도 이하)
    g4s1_angle_add() {
        const a = Math.floor(Math.random() * 179) + 1; // 1~179
        const maxB = 360 - a;
        const b = Math.floor(Math.random() * maxB) + 1; // 1~maxB (합계 <= 360)
        return {
            formulaFront: `${a}° + ${b}°`,
            formulaBack: `${a}° + ${b}°`,
            answer: `${a + b}°`
        };
    },

    // ⑨ 각도의 차 (음수 없음)
    g4s1_angle_sub() {
        const big = Math.floor(Math.random() * 170) + 10; // 10~179
        const small = Math.floor(Math.random() * (big - 1)) + 1; // 1 ~ big-1
        return {
            formulaFront: `${big}° - ${small}°`,
            formulaBack: `${big}° - ${small}°`,
            answer: `${big - small}°`
        };
    },

    // ⑪ 일정하게 커지는 수의 규칙 (증가량 2~100)
    g4s1_seq_up() {
        const step = Math.floor(Math.random() * 99) + 2; // 2~100
        const start = Math.floor(Math.random() * 200) + 1;
        const terms = [];
        for (let i = 0; i < 5; i++) terms.push(start + step * i);

        const blankIdx = Math.floor(Math.random() * 4) + 1; // 1~4 (첫 항은 항상 제시)
        const answer = terms[blankIdx];
        const display = terms.map((t, i) => (i === blankIdx ? "( ? )" : formatNumber(t)));

        const formula = display.join(", ");
        return { formulaFront: formula, formulaBack: formula, answer: formatNumber(answer) };
    },

    // ⑫ 일정하게 작아지는 수의 규칙 (모든 항 0 이상)
    g4s1_seq_down() {
        const step = Math.floor(Math.random() * 99) + 2; // 2~100
        const start = step * 4 + Math.floor(Math.random() * 500); // 마지막 항까지 0 이상 보장
        const terms = [];
        for (let i = 0; i < 5; i++) terms.push(start - step * i);

        const blankIdx = Math.floor(Math.random() * 4) + 1; // 1~4 (첫 항은 항상 제시)
        const answer = terms[blankIdx];
        const display = terms.map((t, i) => (i === blankIdx ? "( ? )" : formatNumber(t)));

        const formula = display.join(", ");
        return { formulaFront: formula, formulaBack: formula, answer: formatNumber(answer) };
    },

    /* ========== 4학년 2학기 - 분수의 덧셈과 뺄셈 ========== */
    // 모든 분수는 분모가 서로 같게 생성하며, 세로형 분수 표시(makeFractionHTML)와
    // 대분수 정규화 공용 함수(formatMixedNumber)를 사용한다.

    // ① 진분수 + 진분수
    g4s2_frac_proper_add() {
        const denominator = randInt(2, 12);
        const n1 = randInt(1, denominator - 1);
        const n2 = randInt(1, denominator - 1);
        const formula = `${makeFractionHTML(n1, denominator)} + ${makeFractionHTML(n2, denominator)}`;
        return {
            formulaFront: formula,
            formulaBack: formula,
            answer: formatMixedNumber(0, n1 + n2, denominator)
        };
    },

    // ② 대분수 + 진분수
    g4s2_frac_mixed_proper_add() {
        const denominator = randInt(2, 12);
        const whole1 = randInt(1, 5);
        const n1 = randInt(1, denominator - 1);
        const n2 = randInt(1, denominator - 1);
        const formula = `${formatMixedNumber(whole1, n1, denominator)} + ${makeFractionHTML(n2, denominator)}`;
        return {
            formulaFront: formula,
            formulaBack: formula,
            answer: formatMixedNumber(whole1, n1 + n2, denominator)
        };
    },

    // ③ 대분수 + 대분수
    g4s2_frac_mixed_add() {
        const denominator = randInt(2, 12);
        const whole1 = randInt(1, 5);
        const whole2 = randInt(1, 5);
        const n1 = randInt(1, denominator - 1);
        const n2 = randInt(1, denominator - 1);
        const formula = `${formatMixedNumber(whole1, n1, denominator)} + ${formatMixedNumber(whole2, n2, denominator)}`;
        return {
            formulaFront: formula,
            formulaBack: formula,
            answer: formatMixedNumber(whole1 + whole2, n1 + n2, denominator)
        };
    },

    // ④ 진분수 - 진분수 (첫 분자 >= 둘째 분자, 음수 없음)
    g4s2_frac_proper_sub() {
        const denominator = randInt(2, 12);
        const n2 = randInt(1, denominator - 1);
        const n1 = randInt(n2, denominator - 1);
        const formula = `${makeFractionHTML(n1, denominator)} - ${makeFractionHTML(n2, denominator)}`;
        return {
            formulaFront: formula,
            formulaBack: formula,
            answer: formatMixedNumber(0, n1 - n2, denominator)
        };
    },

    // ⑤ 대분수 - 진분수 (받아내림 있는 경우/없는 경우 모두 생성)
    g4s2_frac_mixed_proper_sub() {
        const denominator = randInt(2, 12);
        const whole1 = randInt(1, 5);
        const n1 = randInt(1, denominator - 1);
        const n2 = randInt(1, denominator - 1);
        const formula = `${formatMixedNumber(whole1, n1, denominator)} - ${makeFractionHTML(n2, denominator)}`;

        let resultWhole, resultNumerator;
        if (n1 >= n2) {
            resultWhole = whole1;
            resultNumerator = n1 - n2;
        } else {
            resultWhole = whole1 - 1;
            resultNumerator = n1 + denominator - n2;
        }

        return {
            formulaFront: formula,
            formulaBack: formula,
            answer: formatMixedNumber(resultWhole, resultNumerator, denominator)
        };
    },

    // ⑥ 대분수 - 대분수 (결과 0 이상, 받아내림 있는/없는 경우 모두 생성)
    g4s2_frac_mixed_sub() {
        const denominator = randInt(2, 12);
        let whole1, whole2, n1, n2, val1, val2;
        do {
            whole1 = randInt(1, 5);
            whole2 = randInt(1, 5);
            n1 = randInt(1, denominator - 1);
            n2 = randInt(1, denominator - 1);
            val1 = whole1 * denominator + n1;
            val2 = whole2 * denominator + n2;
        } while (val1 < val2); // 완전히 같은 경우(답 0)는 자연 발생 빈도만큼만 허용

        const formula = `${formatMixedNumber(whole1, n1, denominator)} - ${formatMixedNumber(whole2, n2, denominator)}`;

        let resultWhole, resultNumerator;
        if (n1 >= n2) {
            resultWhole = whole1 - whole2;
            resultNumerator = n1 - n2;
        } else {
            resultWhole = whole1 - whole2 - 1;
            resultNumerator = n1 + denominator - n2;
        }

        return {
            formulaFront: formula,
            formulaBack: formula,
            answer: formatMixedNumber(resultWhole, resultNumerator, denominator)
        };
    },

    // ⑦ 자연수 - 진분수 (정답은 대분수로 표시)
    g4s2_frac_whole_sub() {
        const whole = randInt(1, 9);
        const denominator = randInt(2, 12);
        const numerator = randInt(1, denominator - 1);
        const formula = `${whole} - ${makeFractionHTML(numerator, denominator)}`;
        return {
            formulaFront: formula,
            formulaBack: formula,
            answer: formatMixedNumber(whole - 1, denominator - numerator, denominator)
        };
    },

    /* ========== 4학년 2학기 - 소수의 덧셈과 뺄셈 ========== */
    // 모든 계산은 정수로 스케일링해 처리하여 부동소수점 오차를 방지한다 (formatScaledDecimal 참고).

    // ⑧ 소수 한 자리 수의 덧셈 (각 수 0.1~9.9, 합은 20 미만)
    g4s2_decimal_1_add() {
        let a, b;
        do {
            a = randDecimalScaled(1, 99);
            b = randDecimalScaled(1, 99);
        } while (a + b >= 200);
        const formula = `${formatScaledDecimal(a, 1)} + ${formatScaledDecimal(b, 1)}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatScaledDecimal(a + b, 1) };
    },

    // ⑨ 소수 두 자리 수의 덧셈 (각 수 0.01~9.99, 받아올림 있는/없는 경우 모두 생성)
    g4s2_decimal_2_add() {
        const a = randDecimalScaled(1, 999);
        const b = randDecimalScaled(1, 999);
        const formula = `${formatScaledDecimal(a, 2)} + ${formatScaledDecimal(b, 2)}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatScaledDecimal(a + b, 2) };
    },

    // ⑩ 소수 자릿수가 다른 덧셈 (소수 한 자리 + 소수 두 자리)
    g4s2_decimal_mixed_add() {
        const a1 = randDecimalScaled(1, 99); // 소수 한 자리 (십분의 일 단위)
        const b2 = randDecimalScaled(1, 999); // 소수 두 자리 (백분의 일 단위)
        const a2 = a1 * 10; // 백분의 일 단위로 통일
        const sum2 = a2 + b2;
        const formula = `${formatScaledDecimal(a1, 1)} + ${formatScaledDecimal(b2, 2)}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatScaledDecimal(sum2, 2) };
    },

    // ⑪ 소수 한 자리 수의 뺄셈 (첫 수 >= 둘째 수, 음수 없음)
    g4s2_decimal_1_sub() {
        let a, b;
        do {
            a = randDecimalScaled(1, 99);
            b = randDecimalScaled(1, 99);
        } while (a < b);
        const formula = `${formatScaledDecimal(a, 1)} - ${formatScaledDecimal(b, 1)}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatScaledDecimal(a - b, 1) };
    },

    // ⑫ 소수 두 자리 수의 뺄셈 (받아내림 있는/없는 경우 모두 생성, 음수 없음)
    g4s2_decimal_2_sub() {
        let a, b;
        do {
            a = randDecimalScaled(1, 999);
            b = randDecimalScaled(1, 999);
        } while (a < b);
        const formula = `${formatScaledDecimal(a, 2)} - ${formatScaledDecimal(b, 2)}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatScaledDecimal(a - b, 2) };
    },

    // ⑬ 소수 자릿수가 다른 뺄셈 (소수 한 자리에서 소수 두 자리를 뺌, 큰 수 - 작은 수)
    g4s2_decimal_mixed_sub() {
        let a1, b2, a2;
        do {
            a1 = randDecimalScaled(1, 99);
            b2 = randDecimalScaled(1, 999);
            a2 = a1 * 10;
        } while (a2 < b2);
        const diff2 = a2 - b2;
        const formula = `${formatScaledDecimal(a1, 1)} - ${formatScaledDecimal(b2, 2)}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatScaledDecimal(diff2, 2) };
    },

    /* ========== 4학년 2학기 - 도형과 측정: 삼각형 ========== */

    // ⑯ 삼각형의 나머지 한 각 (세 각의 합 180°, 정답은 1° 이상)
    g4s2_triangle_missing_angle() {
        const pair = generateUntilValid(
            () => {
                const a = randInt(10, 150);
                const b = randInt(10, 150);
                return { a, b, c: 180 - a - b };
            },
            (v) => v.c >= 1 && v.c <= 158
        );
        const formula = `삼각형의 두 각이 ${pair.a}°, ${pair.b}°일 때 나머지 한 각`;
        return { formulaFront: formula, formulaBack: formula, answer: `${pair.c}°` };
    },

    /* ========== 4학년 2학기 - 도형과 측정: 사각형 ========== */

    /* ========== 4학년 2학기 - 도형과 측정: 다각형 ========== */

    /* ========== 5학년 1학기 - 자연수의 혼합 계산 ========== */
    // eval을 사용하지 않고, 계산 순서(왼쪽부터/괄호 우선/곱셈 우선)를 구조적으로 직접 계산한다.
    // 나눗셈이 필요한 유형은 몫을 먼저 정한 뒤 피제수를 역산하여 항상 나누어떨어지게 만든다.

    // ① 덧셈과 뺄셈의 혼합 계산 (왼쪽부터 순서대로, 중간·최종 결과 모두 비음수)
    g5s1_mixed_add_sub() {
        const termCount = randInt(3, 4);
        let current = randInt(10, 60);
        const parts = [String(current)];
        for (let i = 1; i < termCount; i++) {
            let isAdd = Math.random() < 0.5;
            if (current === 0) isAdd = true; // 0에서는 반드시 덧셈으로 진행 (음수 방지)
            if (isAdd) {
                const addAmt = randInt(1, 40);
                parts.push("+", String(addAmt));
                current += addAmt;
            } else {
                const subAmt = randInt(1, Math.min(current, 40));
                parts.push("-", String(subAmt));
                current -= subAmt;
            }
        }
        const formula = parts.join(" ");
        return { formulaFront: formula, formulaBack: formula, answer: String(current) };
    },

    // ② 곱셈과 나눗셈의 혼합 계산 (왼쪽부터 계산, 나눗셈은 항상 나누어떨어짐, 답이 너무 커지지 않게 제한)
    g5s1_mixed_mul_div() {
        const divFirst = Math.random() < 0.5;
        let formula, answer;
        if (divFirst) {
            const divisor = randInt(2, 9);
            const quotient = randInt(2, 20);
            const dividend = divisor * quotient;
            let multiplier = randInt(2, 9);
            let result = quotient * multiplier;
            if (result > 200) { multiplier = Math.max(2, Math.floor(200 / quotient)); result = quotient * multiplier; }
            formula = `${dividend} ÷ ${divisor} × ${multiplier}`;
            answer = result;
        } else {
            const n1 = randInt(2, 20);
            const n2 = randInt(2, 9);
            const product = n1 * n2;
            const candidates = [];
            for (let d = 2; d <= 9; d++) if (product % d === 0) candidates.push(d);
            const divisor = candidates[randInt(0, candidates.length - 1)];
            formula = `${n1} × ${n2} ÷ ${divisor}`;
            answer = product / divisor;
        }
        return { formulaFront: formula, formulaBack: formula, answer: String(answer) };
    },

    // ③ 덧셈·뺄셈·곱셈의 혼합 계산 (곱셈을 먼저 계산, 최종 결과 비음수)
    g5s1_mixed_add_sub_mul() {
        const n2 = randInt(2, 9);
        const n3 = randInt(2, 9);
        const mulResult = n2 * n3;

        const op1 = Math.random() < 0.5 ? "+" : "-";
        const n1 = op1 === "+" ? randInt(5, 50) : randInt(mulResult, mulResult + 50);
        const afterFirst = op1 === "+" ? n1 + mulResult : n1 - mulResult;

        let op2 = Math.random() < 0.5 ? "+" : "-";
        if (afterFirst === 0) op2 = "+";
        const n4 = op2 === "+" ? randInt(1, 30) : randInt(1, afterFirst);
        const final = op2 === "+" ? afterFirst + n4 : afterFirst - n4;

        const formula = `${n1} ${op1} ${n2} × ${n3} ${op2} ${n4}`;
        return { formulaFront: formula, formulaBack: formula, answer: String(final) };
    },

    // ④ 사칙연산 혼합 계산 (나눗셈 → 곱셈 순서로 먼저 계산 후 덧셈/뺄셈, 나눗셈은 나누어떨어짐)
    g5s1_mixed_all_ops() {
        const divisor = randInt(2, 9);
        const quotient = randInt(2, 12);
        const n2 = divisor * quotient; // 나눗셈 피제수 (나누어떨어짐 보장)
        const n4 = randInt(2, 9);
        const mulDivResult = quotient * n4;

        const addOp = Math.random() < 0.5 ? "+" : "-";
        const n1 = addOp === "+" ? randInt(5, 60) : randInt(mulDivResult, mulDivResult + 60);
        const final = addOp === "+" ? n1 + mulDivResult : n1 - mulDivResult;

        const formula = `${n1} ${addOp} ${n2} ÷ ${divisor} × ${n4}`;
        return { formulaFront: formula, formulaBack: formula, answer: String(final) };
    },

    // ⑤ 괄호가 있는 혼합 계산 (괄호 안을 먼저 계산, 괄호 결과와 전체 결과 모두 자연수)
    g5s1_mixed_parentheses() {
        const divisor = randInt(2, 9);
        const afterDiv = randInt(2, 15);
        const parenResult = divisor * afterDiv; // 괄호 안 결과 (나눗셈이 나누어떨어지도록 역산)

        const parenOp = Math.random() < 0.5 ? "+" : "-";
        let a, b;
        if (parenOp === "+") {
            b = randInt(1, parenResult - 1);
            a = parenResult - b;
        } else {
            b = randInt(1, 40);
            a = parenResult + b;
        }

        let outerOp = Math.random() < 0.5 ? "+" : "-";
        const d = outerOp === "+" ? randInt(1, 30) : randInt(1, afterDiv);
        const final = outerOp === "+" ? afterDiv + d : afterDiv - d;

        const formula = `(${a} ${parenOp} ${b}) ÷ ${divisor} ${outerOp} ${d}`;
        return { formulaFront: formula, formulaBack: formula, answer: String(final) };
    },

    /* ========== 5학년 1학기 - 약수와 배수 ========== */

    // ⑥ 자연수의 약수 찾기 (목록이 너무 길지 않은 수 위주로 생성)
    g5s1_factor_list() {
        const n = generateUntilValid(
            () => randInt(2, 100),
            (v) => getDivisors(v).length <= 8
        );
        const formula = `${n}의 약수`;
        return { formulaFront: formula, formulaBack: formula, answer: getDivisors(n).join(", ") };
    },

    // ⑦ 약수의 개수
    g5s1_factor_count() {
        const n = randInt(2, 100);
        const formula = `${n}의 약수는 모두 몇 개인가?`;
        return { formulaFront: formula, formulaBack: formula, answer: `${getDivisors(n).length}개` };
    },

    // ⑧ 몇 번째 배수 (0은 배수 목록에 포함하지 않음: 몇 번째가 1 이상이므로 자동 충족)
    g5s1_multiple_nth() {
        const base = randInt(2, 20);
        const nth = randInt(2, 15);
        const formula = `${base}의 ${nth}번째 배수`;
        return { formulaFront: formula, formulaBack: formula, answer: String(base * nth) };
    },

    // ⑨ 배수인지 판단 (두 결과가 충분히 골고루 출제되도록 50% 확률로 분기)
    g5s1_multiple_check() {
        const base = randInt(2, 20);
        const isMultiple = Math.random() < 0.5;
        let candidate;
        if (isMultiple) {
            candidate = base * randInt(1, 15);
        } else {
            candidate = generateUntilValid(
                () => randInt(base + 1, base * 15),
                (v) => v % base !== 0
            );
        }
        const formula = `${candidate}는 ${base}의 배수인가?`;
        return { formulaFront: formula, formulaBack: formula, answer: isMultiple ? "배수입니다" : "배수가 아닙니다" };
    },

    // ⑩ 최대공약수 (1인 경우와 2 이상인 경우 모두 자연 발생)
    g5s1_gcd() {
        const a = randInt(2, 100);
        const b = randInt(2, 100);
        const formula = `${a}${koreanMixedConnector(a)} ${b}의 최대공약수`;
        return { formulaFront: formula, formulaBack: formula, answer: String(gcd(a, b)) };
    },

    // ⑪ 최소공배수 (같은 두 수 제외, 답이 너무 커지지 않도록 제한)
    g5s1_lcm() {
        const pair = generateUntilValid(
            () => ({ a: randInt(2, 30), b: randInt(2, 30) }),
            (v) => v.a !== v.b && lcm(v.a, v.b) <= 200
        );
        const formula = `${pair.a}${koreanMixedConnector(pair.a)} ${pair.b}의 최소공배수`;
        return { formulaFront: formula, formulaBack: formula, answer: String(lcm(pair.a, pair.b)) };
    },

    /* ========== 5학년 1학기 - 변화와 관계: 대응 관계 ========== */

    /* ========== 5학년 1학기 - 약분과 통분 ========== */
    // 세로형 분수 표시(makeFractionHTML)와 대분수 공용 함수(formatMixedNumber)를 재사용한다.

    // ⑮ 크기가 같은 분수의 빈칸
    g5s1_fraction_equivalent() {
        const b = randInt(2, 12);
        const a = randInt(1, b - 1);
        const k = randInt(2, 9);
        const a2 = a * k;
        const b2 = b * k;

        const blankNumerator = Math.random() < 0.5;
        const rightFrac = blankNumerator ? makeFractionHTML("?", b2) : makeFractionHTML(a2, "?");
        const formula = `${makeFractionHTML(a, b)} = ${rightFrac}`;
        return { formulaFront: formula, formulaBack: formula, answer: String(blankNumerator ? a2 : b2) };
    },

    // ⑯ 분수를 약분하기 (처음부터 기약분수인 문제는 생성하지 않음: 배율 k>=2 보장)
    g5s1_fraction_reduce() {
        const k = randInt(2, 9);
        const redA = randInt(1, 11);
        const redB = randInt(redA + 1, 12);
        const simplified = simplifyFraction(redA, redB); // 기약분수 보장
        const a = simplified.numerator * k;
        const b = simplified.denominator * k;

        const formula = `${makeFractionHTML(a, b)}를 가장 간단한 분수로 나타내기`;
        return { formulaFront: formula, formulaBack: formula, answer: makeFractionHTML(simplified.numerator, simplified.denominator) };
    },

    // ⑰ 약분할 수 있는 수 찾기 (분자·분모의 최대공약수를 구함)
    g5s1_fraction_reduce_gcd() {
        const g = randInt(2, 12);
        const redA = randInt(1, 8);
        const redB = randInt(redA + 1, 9);
        const simplified = simplifyFraction(redA, redB);
        const a = simplified.numerator * g;
        const b = simplified.denominator * g;

        const formula = `${makeFractionHTML(a, b)}을 약분할 때 분자와 분모를 함께 나눌 수 있는 가장 큰 수`;
        return { formulaFront: formula, formulaBack: formula, answer: String(g) };
    },

    // ⑱ 두 분수 통분하기 (최소공배수를 공통분모로 사용)
    g5s1_fraction_common_denom() {
        let d1, d2;
        do { d1 = randInt(2, 12); d2 = randInt(2, 12); } while (d1 === d2);
        const n1 = randInt(1, d1 - 1);
        const n2 = randInt(1, d2 - 1);

        const commonDenom = lcm(d1, d2);
        const newN1 = n1 * (commonDenom / d1);
        const newN2 = n2 * (commonDenom / d2);

        const formula = `${makeFractionHTML(n1, d1)}${koreanMixedConnector(d1)} ${makeFractionHTML(n2, d2)}를 통분하기`;
        const answer = `${makeFractionHTML(newN1, commonDenom)}, ${makeFractionHTML(newN2, commonDenom)}`;
        return { formulaFront: formula, formulaBack: formula, answer };
    },

    // ⑲ 분수의 크기 비교 (정수 교차곱만 사용, 같은 크기 문제도 일정 비율 포함)
    g5s1_fraction_compare() {
        const useMixed = Math.random() < 0.4;
        const equalCase = Math.random() < 0.2;

        let d1, d2;
        do { d1 = randInt(2, 12); d2 = randInt(2, 12); } while (d1 === d2);

        const n1 = randInt(1, d1 - 1);
        let n2;
        if (equalCase) {
            const candidateN2 = (n1 * d2) / d1;
            n2 = Number.isInteger(candidateN2) && candidateN2 >= 1 && candidateN2 < d2
                ? candidateN2
                : randInt(1, d2 - 1);
        } else {
            n2 = randInt(1, d2 - 1);
        }

        let whole1 = 0, whole2 = 0;
        if (useMixed) {
            whole1 = randInt(1, 5);
            whole2 = equalCase ? whole1 : randInt(1, 5);
        }

        const symbol = compareUnlikeFractions(whole1, n1, d1, whole2, n2, d2);
        const left = useMixed ? formatMixedNumber(whole1, n1, d1) : makeFractionHTML(n1, d1);
        const right = useMixed ? formatMixedNumber(whole2, n2, d2) : makeFractionHTML(n2, d2);

        const formula = `${left} ( ? ) ${right}`;
        return { formulaFront: formula, formulaBack: formula, answer: symbol };
    },

    /* ========== 5학년 1학기 - 분수의 덧셈과 뺄셈 (분모가 다름) ========== */
    // computeUnlikeFractionResult(통분→계산→약분→정규화)와 formatMixedNumber를 재사용한다.

    // ⑳ 진분수 + 진분수
    g5s1_unlike_fraction_add() {
        let d1, d2;
        do { d1 = randInt(2, 12); d2 = randInt(2, 12); } while (d1 === d2);
        const n1 = randInt(1, d1 - 1);
        const n2 = randInt(1, d2 - 1);

        const result = computeUnlikeFractionResult(0, n1, d1, 0, n2, d2, "+");
        const formula = `${makeFractionHTML(n1, d1)} + ${makeFractionHTML(n2, d2)}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatMixedNumber(result.whole, result.numerator, result.denominator) };
    },

    // ㉑ 대분수 + 진분수
    g5s1_unlike_fraction_mixed_proper_add() {
        let d1, d2;
        do { d1 = randInt(2, 12); d2 = randInt(2, 12); } while (d1 === d2);
        const whole1 = randInt(1, 6);
        const n1 = randInt(1, d1 - 1);
        const n2 = randInt(1, d2 - 1);

        const result = computeUnlikeFractionResult(whole1, n1, d1, 0, n2, d2, "+");
        const formula = `${formatMixedNumber(whole1, n1, d1)} + ${makeFractionHTML(n2, d2)}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatMixedNumber(result.whole, result.numerator, result.denominator) };
    },

    // ㉒ 대분수 + 대분수
    g5s1_unlike_fraction_mixed_add() {
        let d1, d2;
        do { d1 = randInt(2, 12); d2 = randInt(2, 12); } while (d1 === d2);
        const whole1 = randInt(1, 5);
        const whole2 = randInt(1, 5);
        const n1 = randInt(1, d1 - 1);
        const n2 = randInt(1, d2 - 1);

        const result = computeUnlikeFractionResult(whole1, n1, d1, whole2, n2, d2, "+");
        const formula = `${formatMixedNumber(whole1, n1, d1)} + ${formatMixedNumber(whole2, n2, d2)}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatMixedNumber(result.whole, result.numerator, result.denominator) };
    },

    // ㉓ 진분수 - 진분수 (첫 분수 >= 둘째 분수, 음수 없음)
    g5s1_unlike_fraction_sub() {
        let d1, d2;
        do { d1 = randInt(2, 12); d2 = randInt(2, 12); } while (d1 === d2);
        const pair = generateUntilValid(
            () => ({ n1: randInt(1, d1 - 1), n2: randInt(1, d2 - 1) }),
            (v) => v.n1 * d2 >= v.n2 * d1
        );

        const result = computeUnlikeFractionResult(0, pair.n1, d1, 0, pair.n2, d2, "-");
        const formula = `${makeFractionHTML(pair.n1, d1)} - ${makeFractionHTML(pair.n2, d2)}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatMixedNumber(result.whole, result.numerator, result.denominator) };
    },

    // ㉔ 대분수 - 진분수 (받아내림 있는/없는 경우 모두 자연 발생)
    g5s1_unlike_fraction_mixed_proper_sub() {
        let d1, d2;
        do { d1 = randInt(2, 12); d2 = randInt(2, 12); } while (d1 === d2);
        const whole1 = randInt(2, 6); // 받아내림 발생 시에도 비음수가 되도록 여유 확보
        const n1 = randInt(1, d1 - 1);
        const n2 = randInt(1, d2 - 1);

        const result = computeUnlikeFractionResult(whole1, n1, d1, 0, n2, d2, "-");
        const formula = `${formatMixedNumber(whole1, n1, d1)} - ${makeFractionHTML(n2, d2)}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatMixedNumber(result.whole, result.numerator, result.denominator) };
    },

    // ㉕ 대분수 - 대분수 (첫 번째 수 >= 두 번째 수, 결과 0인 문제는 자연 발생 빈도만 허용)
    g5s1_unlike_fraction_mixed_sub() {
        let d1, d2;
        do { d1 = randInt(2, 12); d2 = randInt(2, 12); } while (d1 === d2);

        const pair = generateUntilValid(
            () => ({ whole1: randInt(1, 5), whole2: randInt(1, 5), n1: randInt(1, d1 - 1), n2: randInt(1, d2 - 1) }),
            (v) => (v.whole1 * d1 + v.n1) * d2 >= (v.whole2 * d2 + v.n2) * d1
        );

        const result = computeUnlikeFractionResult(pair.whole1, pair.n1, d1, pair.whole2, pair.n2, d2, "-");
        const formula = `${formatMixedNumber(pair.whole1, pair.n1, d1)} - ${formatMixedNumber(pair.whole2, pair.n2, d2)}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatMixedNumber(result.whole, result.numerator, result.denominator) };
    },

    /* ========== 5학년 1학기 - 도형과 측정: 다각형의 둘레와 넓이 ========== */
    // 모든 넓이 유형은 generateUntilValid + formatCm/formatCm2 공용 헬퍼를 재사용해 중복을 줄인다.

    // ㉖ 직사각형의 둘레
    g5s1_rect_perimeter() {
        const dim = generateUntilValid(
            () => ({ w: randInt(2, 50), h: randInt(2, 50) }),
            (v) => v.w !== v.h
        );
        const formula = `가로 ${dim.w}cm, 세로 ${dim.h}cm인 직사각형의 둘레`;
        return { formulaFront: formula, formulaBack: formula, answer: formatCm(2 * (dim.w + dim.h)) };
    },

    // ㉗ 정사각형의 둘레
    g5s1_square_perimeter() {
        const side = randInt(2, 50);
        const formula = `한 변이 ${side}cm인 정사각형의 둘레`;
        return { formulaFront: formula, formulaBack: formula, answer: formatCm(side * 4) };
    },

    // ㉘ 직사각형의 넓이
    g5s1_rect_area() {
        const dim = generateUntilValid(
            () => ({ w: randInt(2, 50), h: randInt(2, 50) }),
            (v) => v.w !== v.h
        );
        const formula = `가로 ${dim.w}cm, 세로 ${dim.h}cm인 직사각형의 넓이`;
        return { formulaFront: formula, formulaBack: formula, answer: formatCm2(dim.w * dim.h) };
    },

    // ㉙ 정사각형의 넓이
    g5s1_square_area() {
        const side = randInt(2, 30);
        const formula = `한 변이 ${side}cm인 정사각형의 넓이`;
        return { formulaFront: formula, formulaBack: formula, answer: formatCm2(side * side) };
    },

    // ㉚ 평행사변형의 넓이 (밑변 × 높이)
    g5s1_parallelogram_area() {
        const base = randInt(2, 40);
        const height = randInt(2, 30);
        const formula = `밑변 ${base}cm, 높이 ${height}cm인 평행사변형의 넓이`;
        return { formulaFront: formula, formulaBack: formula, answer: formatCm2(base * height) };
    },

    // ㉛ 삼각형의 넓이 (밑변 × 높이가 짝수가 되도록 생성해 답이 자연수)
    g5s1_triangle_area() {
        const dim = generateUntilValid(
            () => ({ base: randInt(2, 40), height: randInt(2, 30) }),
            (v) => (v.base * v.height) % 2 === 0
        );
        const formula = `밑변 ${dim.base}cm, 높이 ${dim.height}cm인 삼각형의 넓이`;
        return { formulaFront: formula, formulaBack: formula, answer: formatCm2((dim.base * dim.height) / 2) };
    },

    // ㉜ 사다리꼴의 넓이 (윗변≠아랫변, (윗변+아랫변)×높이가 짝수)
    g5s1_trapezoid_area() {
        const dim = generateUntilValid(
            () => ({ top: randInt(2, 30), bottom: randInt(2, 40), height: randInt(2, 20) }),
            (v) => v.top !== v.bottom && ((v.top + v.bottom) * v.height) % 2 === 0
        );
        const formula = `윗변 ${dim.top}cm, 아랫변 ${dim.bottom}cm, 높이 ${dim.height}cm인 사다리꼴의 넓이`;
        return { formulaFront: formula, formulaBack: formula, answer: formatCm2(((dim.top + dim.bottom) * dim.height) / 2) };
    },

    // ㉝ 마름모의 넓이 (두 대각선의 곱이 짝수)
    g5s1_rhombus_area() {
        const dim = generateUntilValid(
            () => ({ d1: randInt(2, 40), d2: randInt(2, 40) }),
            (v) => (v.d1 * v.d2) % 2 === 0
        );
        const formula = `두 대각선이 ${dim.d1}cm, ${dim.d2}cm인 마름모의 넓이`;
        return { formulaFront: formula, formulaBack: formula, answer: formatCm2((dim.d1 * dim.d2) / 2) };
    },

    /* ===== 5학년 2학기 - 수의 범위와 어림하기 ===== */

    // ① 이상·이하 범위 판단 (경곗값 포함)
    g5s2_range_inclusive() {
        const lower = randInt(1, 500);
        const upper = randInt(lower + 1, lower + 100);
        const wantIncluded = Math.random() < 0.5;
        let candidate;
        if (wantIncluded) {
            // 절반 정도는 경곗값 자체를, 나머지는 구간 내 임의의 값을 후보로 사용
            candidate = Math.random() < 0.5 ? (Math.random() < 0.5 ? lower : upper) : randInt(lower, upper);
        } else {
            candidate = generateUntilValid(
                () => randInt(Math.max(1, lower - 50), upper + 50),
                (v) => v < lower || v > upper
            );
        }
        const included = isInRange(candidate, lower, true, upper, true);
        const formula = `${lower} 이상 ${upper} 이하인 수의 범위에 ${candidate}은(는) 포함되는가?`;
        return { formulaFront: formula, formulaBack: formula, answer: included ? "범위에 포함됩니다" : "범위에 포함되지 않습니다" };
    },

    // ② 초과·미만 범위 판단 (경곗값 제외)
    g5s2_range_exclusive() {
        const lower = randInt(1, 500);
        const upper = randInt(lower + 2, lower + 100);
        const wantIncluded = Math.random() < 0.5;
        let candidate;
        if (wantIncluded) {
            candidate = randInt(lower + 1, upper - 1);
        } else {
            // 절반 정도는 경곗값과 같은 후보를, 나머지는 구간 밖의 값을 사용
            candidate = Math.random() < 0.5
                ? (Math.random() < 0.5 ? lower : upper)
                : generateUntilValid(
                    () => randInt(Math.max(1, lower - 50), upper + 50),
                    (v) => v <= lower || v >= upper
                );
        }
        const included = isInRange(candidate, lower, false, upper, false);
        const formula = `${lower} 초과 ${upper} 미만인 수의 범위에 ${candidate}은(는) 포함되는가?`;
        return { formulaFront: formula, formulaBack: formula, answer: included ? "범위에 포함됩니다" : "범위에 포함되지 않습니다" };
    },

    // ③ 범위에 속하는 자연수의 개수
    g5s2_range_count() {
        const types = [
            { lowerInclusive: true, upperInclusive: true, lowerWord: "이상", upperWord: "이하" },
            { lowerInclusive: false, upperInclusive: false, lowerWord: "초과", upperWord: "미만" },
            { lowerInclusive: true, upperInclusive: false, lowerWord: "이상", upperWord: "미만" },
            { lowerInclusive: false, upperInclusive: true, lowerWord: "초과", upperWord: "이하" }
        ];
        const type = types[randInt(0, types.length - 1)];
        const result = generateUntilValid(
            () => {
                const lower = randInt(1, 100);
                const upper = randInt(lower + 1, lower + 30);
                const count = countInRange(lower, type.lowerInclusive, upper, type.upperInclusive);
                return { lower, upper, count };
            },
            (v) => v.count >= 1
        );
        const formula = `${result.lower} ${type.lowerWord} ${result.upper} ${type.upperWord}인 자연수는 모두 몇 개인가?`;
        return { formulaFront: formula, formulaBack: formula, answer: `${result.count}개` };
    },

    // ④ 조건을 만족하는 가장 작은 수·가장 큰 수 (답이 하나로 정해짐)
    g5s2_range_extreme() {
        const types = [
            { lowerInclusive: true, upperInclusive: true, lowerWord: "이상", upperWord: "이하" },
            { lowerInclusive: false, upperInclusive: false, lowerWord: "초과", upperWord: "미만" },
            { lowerInclusive: true, upperInclusive: false, lowerWord: "이상", upperWord: "미만" },
            { lowerInclusive: false, upperInclusive: true, lowerWord: "초과", upperWord: "이하" }
        ];
        const type = types[randInt(0, types.length - 1)];
        const askSmallest = Math.random() < 0.5;
        const result = generateUntilValid(
            () => {
                const lower = randInt(1, 500);
                const upper = randInt(lower + 1, lower + 100);
                const count = countInRange(lower, type.lowerInclusive, upper, type.upperInclusive);
                return { lower, upper, count };
            },
            (v) => v.count >= 1
        );
        const start = type.lowerInclusive ? result.lower : result.lower + 1;
        const end = type.upperInclusive ? result.upper : result.upper - 1;
        const target = askSmallest ? "가장 작은 수" : "가장 큰 수";
        const formula = `${result.lower} ${type.lowerWord} ${result.upper} ${type.upperWord}인 자연수 중 ${target}`;
        return { formulaFront: formula, formulaBack: formula, answer: String(askSmallest ? start : end) };
    },

    // ⑤ 올림 (십의 자리·백의 자리·천의 자리)
    g5s2_round_up() {
        const place = ROUND_PLACES[randInt(0, ROUND_PLACES.length - 1)];
        const isExactMultiple = Math.random() < 0.3;
        const n = isExactMultiple
            ? randInt(1, Math.floor(99999 / place)) * place
            : generateUntilValid(() => randInt(place, 99999), (v) => v % place !== 0);
        const rounded = roundToPlace(n, place, "up");
        const formula = `${formatNumber(n)}을 ${ROUND_PLACE_LABELS[place]}까지 올림하기`;
        return { formulaFront: formula, formulaBack: formula, answer: formatNumber(rounded) };
    },

    // ⑥ 버림 (십의 자리·백의 자리·천의 자리)
    g5s2_round_down() {
        const place = ROUND_PLACES[randInt(0, ROUND_PLACES.length - 1)];
        const isExactMultiple = Math.random() < 0.3;
        const n = isExactMultiple
            ? randInt(1, Math.floor(99999 / place)) * place
            : generateUntilValid(() => randInt(place, 99999), (v) => v % place !== 0);
        const rounded = roundToPlace(n, place, "down");
        const formula = `${formatNumber(n)}를 ${ROUND_PLACE_LABELS[place]}까지 버림하기`;
        return { formulaFront: formula, formulaBack: formula, answer: formatNumber(rounded) };
    },

    // ⑦ 반올림 (정확히 절반이 되는 경우도 생성)
    g5s2_round_nearest() {
        const place = ROUND_PLACES[randInt(0, ROUND_PLACES.length - 1)];
        const isExactHalf = Math.random() < 0.2;
        let n;
        if (isExactHalf) {
            const base = randInt(1, Math.floor(99999 / place) - 1) * place;
            n = base + place / 2;
        } else {
            n = generateUntilValid(() => randInt(place, 99999), (v) => v % place !== place / 2);
        }
        const rounded = roundToPlace(n, place, "nearest");
        const formula = `${formatNumber(n)}을 ${ROUND_PLACE_LABELS[place]}까지 반올림하기`;
        return { formulaFront: formula, formulaBack: formula, answer: formatNumber(rounded) };
    },

    // ⑧ 반올림한 값으로 원래 수의 범위 찾기
    g5s2_round_reverse_range() {
        const place = ROUND_PLACES[randInt(0, ROUND_PLACES.length - 1)];
        const roundedValue = randInt(1, Math.floor(99999 / place)) * place;
        const bounds = roundedRangeBounds(roundedValue, place);
        const formula = `${ROUND_PLACE_LABELS[place]}까지 반올림한 값이 ${formatNumber(roundedValue)}인 자연수의 범위`;
        return { formulaFront: formula, formulaBack: formula, answer: `${formatNumber(bounds.min)} 이상 ${formatNumber(bounds.max)} 이하` };
    },

    /* ===== 5학년 2학기 - 분수의 곱셈 ===== */

    // ⑨ 진분수 × 자연수
    g5s2_fraction_proper_natural_mul() {
        const d = randInt(2, 15);
        const n = randInt(1, d - 1);
        const natural = randInt(2, 12);
        const result = multiplyMixedFractions(0, n, d, natural, 0, 1);
        const formula = `${makeFractionHTML(n, d)} × ${natural}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatMixedNumber(result.whole, result.numerator, result.denominator) };
    },

    // ⑩ 대분수 × 자연수
    g5s2_fraction_mixed_natural_mul() {
        const d = randInt(2, 15);
        const whole = randInt(1, 6);
        const n = randInt(1, d - 1);
        const natural = randInt(2, 10);
        const result = multiplyMixedFractions(whole, n, d, natural, 0, 1);
        const formula = `${formatMixedNumber(whole, n, d)} × ${natural}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatMixedNumber(result.whole, result.numerator, result.denominator) };
    },

    // ⑪ 자연수 × 진분수 (약분 가능/불가능 사례 모두 자연 발생)
    g5s2_fraction_natural_proper_mul() {
        const natural = randInt(2, 15);
        const d = randInt(2, 15);
        const n = randInt(1, d - 1);
        const result = multiplyMixedFractions(natural, 0, 1, 0, n, d);
        const formula = `${natural} × ${makeFractionHTML(n, d)}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatMixedNumber(result.whole, result.numerator, result.denominator) };
    },

    // ⑫ 자연수 × 대분수 (답이 지나치게 커지지 않도록 제한)
    g5s2_fraction_natural_mixed_mul() {
        const attempt = generateUntilValid(
            () => {
                const natural = randInt(2, 10);
                const whole = randInt(1, 5);
                const d = randInt(2, 12);
                const n = randInt(1, d - 1);
                const value = natural * (whole + n / d); // 상한 확인용 근사값(실제 정답 계산에는 사용하지 않음)
                return { natural, whole, d, n, value };
            },
            (v) => v.value <= 60
        );
        const result = multiplyMixedFractions(attempt.natural, 0, 1, attempt.whole, attempt.n, attempt.d);
        const formula = `${attempt.natural} × ${formatMixedNumber(attempt.whole, attempt.n, attempt.d)}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatMixedNumber(result.whole, result.numerator, result.denominator) };
    },

    // ⑬ 진분수 × 진분수
    g5s2_fraction_proper_proper_mul() {
        const d1 = randInt(2, 15);
        const d2 = randInt(2, 15);
        const n1 = randInt(1, d1 - 1);
        const n2 = randInt(1, d2 - 1);
        const result = multiplyMixedFractions(0, n1, d1, 0, n2, d2);
        const formula = `${makeFractionHTML(n1, d1)} × ${makeFractionHTML(n2, d2)}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatMixedNumber(result.whole, result.numerator, result.denominator) };
    },

    // ⑭ 진분수 × 대분수
    g5s2_fraction_proper_mixed_mul() {
        const d1 = randInt(2, 15);
        const n1 = randInt(1, d1 - 1);
        const whole2 = randInt(1, 5);
        const d2 = randInt(2, 12);
        const n2 = randInt(1, d2 - 1);
        const result = multiplyMixedFractions(0, n1, d1, whole2, n2, d2);
        const formula = `${makeFractionHTML(n1, d1)} × ${formatMixedNumber(whole2, n2, d2)}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatMixedNumber(result.whole, result.numerator, result.denominator) };
    },

    // ⑮ 대분수 × 대분수 (결과가 지나치게 커지지 않도록 제한)
    g5s2_fraction_mixed_mixed_mul() {
        const attempt = generateUntilValid(
            () => {
                const whole1 = randInt(1, 5);
                const whole2 = randInt(1, 5);
                const d1 = randInt(2, 12);
                const d2 = randInt(2, 12);
                const n1 = randInt(1, d1 - 1);
                const n2 = randInt(1, d2 - 1);
                const value = (whole1 + n1 / d1) * (whole2 + n2 / d2); // 상한 확인용 근사값
                return { whole1, whole2, d1, d2, n1, n2, value };
            },
            (v) => v.value <= 40
        );
        const result = multiplyMixedFractions(attempt.whole1, attempt.n1, attempt.d1, attempt.whole2, attempt.n2, attempt.d2);
        const formula = `${formatMixedNumber(attempt.whole1, attempt.n1, attempt.d1)} × ${formatMixedNumber(attempt.whole2, attempt.n2, attempt.d2)}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatMixedNumber(result.whole, result.numerator, result.denominator) };
    },

    /* ===== 5학년 2학기 - 합동과 대칭 (그림 없이 답이 명확한 문제) ===== */

    /* ===== 5학년 2학기 - 소수의 곱셈 (정수 스케일 연산만 사용) ===== */

    // ㉑ 소수 한 자리 수 × 자연수
    g5s2_decimal_1_mul_natural() {
        const decimalScaled = randDecimalScaled(1, 99); // 0.1~9.9
        const natural = randInt(2, 20);
        const product = multiplyScaledDecimals(decimalScaled, 1, natural, 0);
        const formula = `${formatScaledDecimal(decimalScaled, 1)} × ${natural}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatScaledDecimal(product.scaledProduct, product.decimals) };
    },

    // ㉒ 소수 두 자리 수 × 자연수 (끝자리 0 배제로 실제 소수 두 자리 수 보장)
    g5s2_decimal_2_mul_natural() {
        const decimalScaled = randDecimalScaled(1, 999); // 0.01~9.99
        const natural = randInt(2, 20);
        const product = multiplyScaledDecimals(decimalScaled, 2, natural, 0);
        const formula = `${formatScaledDecimal(decimalScaled, 2)} × ${natural}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatScaledDecimal(product.scaledProduct, product.decimals) };
    },

    // ㉓ 자연수 × 소수 한 자리 수
    g5s2_natural_mul_decimal_1() {
        const natural = randInt(2, 30);
        const decimalScaled = randDecimalScaled(1, 99);
        const product = multiplyScaledDecimals(natural, 0, decimalScaled, 1);
        const formula = `${natural} × ${formatScaledDecimal(decimalScaled, 1)}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatScaledDecimal(product.scaledProduct, product.decimals) };
    },

    // ㉔ 자연수 × 소수 두 자리 수
    g5s2_natural_mul_decimal_2() {
        const natural = randInt(2, 30);
        const decimalScaled = randDecimalScaled(1, 999);
        const product = multiplyScaledDecimals(natural, 0, decimalScaled, 2);
        const formula = `${natural} × ${formatScaledDecimal(decimalScaled, 2)}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatScaledDecimal(product.scaledProduct, product.decimals) };
    },

    // ㉕ 소수 한 자리 수 × 소수 한 자리 수 (곱이 1보다 작은 경우·1 이상인 경우 모두 자연 발생)
    g5s2_decimal_1_mul_decimal_1() {
        const a = randDecimalScaled(1, 99);
        const b = randDecimalScaled(1, 99);
        const product = multiplyScaledDecimals(a, 1, b, 1);
        const formula = `${formatScaledDecimal(a, 1)} × ${formatScaledDecimal(b, 1)}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatScaledDecimal(product.scaledProduct, product.decimals) };
    },

    // ㉖ 자릿수가 다른 소수 × 소수 (순서 무작위)
    g5s2_decimal_mixed_mul() {
        const a1 = randDecimalScaled(1, 99); // 소수 한 자리
        const b2 = randDecimalScaled(1, 999); // 소수 두 자리
        const product = multiplyScaledDecimals(a1, 1, b2, 2);
        const swapOrder = Math.random() < 0.5;
        const formula = swapOrder
            ? `${formatScaledDecimal(b2, 2)} × ${formatScaledDecimal(a1, 1)}`
            : `${formatScaledDecimal(a1, 1)} × ${formatScaledDecimal(b2, 2)}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatScaledDecimal(product.scaledProduct, product.decimals) };
    },

    // ㉗ 곱의 소수점 위치 (자연수 곱셈 결과를 이용해 소수 곱셈 정답을 계산)
    g5s2_decimal_point_shift() {
        // 두 수 중 적어도 하나는 소수가 되도록 자릿수를 배분하고,
        // 실제로 소수점이 드러나도록(끝자리가 0이 되어 정수처럼 보이지 않도록) n1, n2를 함께 생성한다.
        const distributions = [[1, 0], [0, 1], [1, 1], [2, 0], [0, 2]];
        const result = generateUntilValid(
            () => {
                const n1 = randInt(2, 99);
                const n2 = randInt(2, 99);
                const [d1, d2] = distributions[randInt(0, distributions.length - 1)];
                return { n1, n2, d1, d2 };
            },
            (v) => (v.d1 === 0 || v.n1 % Math.pow(10, v.d1) !== 0) && (v.d2 === 0 || v.n2 % Math.pow(10, v.d2) !== 0)
        );
        const { n1, n2, d1, d2 } = result;
        const naturalProduct = n1 * n2;
        const decimal1 = formatScaledDecimal(n1, d1);
        const decimal2 = formatScaledDecimal(n2, d2);
        const answer = formatScaledDecimal(naturalProduct, d1 + d2);
        const formula = `${n1} × ${n2} = ${formatNumber(naturalProduct)}일 때 ${decimal1} × ${decimal2}`;
        return { formulaFront: formula, formulaBack: formula, answer };
    },

    /* ===== 5학년 2학기 - 직육면체 (겨냥도·전개도 없이 텍스트로 판단) ===== */

    // ㉛ 직육면체의 모든 모서리 길이의 합 (같은 길이의 모서리가 각각 4개)
    g5s2_cuboid_edge_total() {
        const w = randInt(2, 30);
        const h = randInt(2, 30);
        const height = randInt(2, 30);
        const total = 4 * (w + h + height);
        const formula = `가로 ${w}cm, 세로 ${h}cm, 높이 ${height}cm인 직육면체의 모든 모서리 길이의 합`;
        return { formulaFront: formula, formulaBack: formula, answer: `${total}cm` };
    },

    // ㉜ 모든 모서리 길이의 합으로 한 변의 길이 찾기 (역산해 항상 자연수가 되도록 생성)
    g5s2_cuboid_edge_reverse() {
        const dims = { 가로: randInt(2, 30), 세로: randInt(2, 30), 높이: randInt(2, 30) };
        const total = 4 * (dims.가로 + dims.세로 + dims.높이);
        const keys = Object.keys(dims);
        const targetKey = keys[randInt(0, keys.length - 1)];
        const givenKeys = keys.filter((k) => k !== targetKey);
        const givenText = givenKeys.map((k) => `${k} ${dims[k]}cm`).join(", ");
        const formula = `${givenText}인 직육면체의 모든 모서리 길이의 합이 ${total}cm일 때 ${targetKey}`;
        return { formulaFront: formula, formulaBack: formula, answer: `${dims[targetKey]}cm` };
    },

    /* ===== 5학년 2학기 - 평균과 가능성 ===== */

    // ㉞ 여러 수의 평균 (합계가 자료 수로 나누어떨어지게 생성)
    g5s2_average_basic() {
        const count = randInt(3, 6);
        const values = generateUntilValid(
            () => {
                const arr = [];
                for (let i = 0; i < count; i++) arr.push(randInt(1, 100));
                return arr;
            },
            (arr) => {
                const sum = arr.reduce((a, b) => a + b, 0);
                const allSame = arr.every((v) => v === arr[0]);
                if (sum % count !== 0) return false;
                return !(allSame && Math.random() < 0.85); // 모두 같은 값은 자주 나오지 않게 함
            }
        );
        const sum = values.reduce((a, b) => a + b, 0);
        const average = sum / count;
        const formula = `${values.join(", ")}의 평균`;
        return { formulaFront: formula, formulaBack: formula, answer: String(average) };
    },

    // ㉟ 평균과 자료 수로 합계 구하기
    g5s2_average_to_sum() {
        const count = randInt(3, 10);
        const average = randInt(10, 100);
        const sum = average * count;
        const formula = `${count}명의 점수 평균이 ${average}점일 때 점수의 합`;
        return { formulaFront: formula, formulaBack: formula, answer: `${sum}점` };
    },

    // ㊱ 평균을 이용하여 빠진 값 구하기
    g5s2_average_missing_value() {
        const count = randInt(3, 5);
        const result = generateUntilValid(
            () => {
                const known = [];
                for (let i = 0; i < count - 1; i++) known.push(randInt(1, 100));
                const average = randInt(10, 100);
                const missing = average * count - known.reduce((a, b) => a + b, 0);
                return { known, average, missing };
            },
            (v) => v.missing >= 1 && v.missing <= 100
        );
        const blankIdx = randInt(0, count - 1);
        const displayValues = [...result.known];
        displayValues.splice(blankIdx, 0, "?");
        const formula = `${displayValues.join(", ")}의 평균이 ${result.average}일 때 빈칸`;
        return { formulaFront: formula, formulaBack: formula, answer: String(result.missing) };
    },

    // ㊲ 한 값이 변했을 때 새로운 평균 (정수 스케일 계산으로 오차 방지)
    g5s2_average_after_change() {
        const result = generateUntilValid(
            () => {
                const count = randInt(3, 10);
                const oldAverage = randInt(10, 100);
                const oldSum = oldAverage * count;
                const isIncrease = Math.random() < 0.5;
                const changeAmount = randInt(1, 20);
                const newSum = isIncrease ? oldSum + changeAmount : oldSum - changeAmount;
                const scaledNewAverage = (newSum * 10) / count; // 정수면 소수 한 자리까지 표현 가능
                return { count, oldAverage, isIncrease, changeAmount, scaledNewAverage, newSum };
            },
            (v) => Number.isInteger(v.scaledNewAverage) && v.newSum > 0
        );
        const changeWord = result.isIncrease ? "높아지면" : "낮아지면";
        const formula = `${result.count}명의 평균이 ${result.oldAverage}점일 때 한 학생의 점수가 ${result.changeAmount}점 ${changeWord} 새로운 평균`;
        return { formulaFront: formula, formulaBack: formula, answer: `${formatScaledDecimal(result.scaledNewAverage, 1)}점` };
    },

    // ㊳ 일이 일어날 가능성을 수로 나타내기 (0, 1/2, 1만 사용)
    g5s2_probability_number() {
        const type = randInt(0, 2); // 0: 반드시 일어나지 않음, 1: 반반, 2: 반드시 일어남
        if (type === 0) {
            const colors = ["빨간", "파란", "노란"];
            const color = colors[randInt(0, colors.length - 1)];
            const otherColor = colors.find((c) => c !== color);
            const count = randInt(2, 8);
            const formula = `${otherColor} 공 ${count}개만 든 주머니에서 ${color} 공을 꺼낼 가능성`;
            return { formulaFront: formula, formulaBack: formula, answer: "0" };
        }
        if (type === 1) {
            const n = randInt(1, 6);
            const formula = `빨간 공 ${n}개와 파란 공 ${n}개가 든 주머니에서 빨간 공을 한 개 꺼낼 가능성`;
            return { formulaFront: formula, formulaBack: formula, answer: makeFractionHTML(1, 2) };
        }
        const colors = ["빨간", "파란", "노란"];
        const color = colors[randInt(0, colors.length - 1)];
        const count = randInt(2, 8);
        const formula = `${color} 공 ${count}개만 든 주머니에서 ${color} 공을 꺼낼 가능성`;
        return { formulaFront: formula, formulaBack: formula, answer: "1" };
    },

    // ㊴ 가능성 비교하기 (같은 가능성인 경우도 생성)
    g5s2_probability_compare() {
        const colorA = "빨간";
        const colorB = "파란";
        const countA = randInt(1, 10);
        const equalCase = Math.random() < 0.25;
        const countB = equalCase ? countA : generateUntilValid(() => randInt(1, 10), (v) => v !== countA);
        const formula = `${colorA} 공 ${countA}개, ${colorB} 공 ${countB}개가 든 주머니에서 ${colorA} 공과 ${colorB} 공 중 어느 공이 나올 가능성이 더 큰가?`;
        let answer;
        if (countA === countB) {
            answer = "두 가능성이 같습니다";
        } else {
            answer = countA > countB ? `${colorA} 공` : `${colorB} 공`;
        }
        return { formulaFront: formula, formulaBack: formula, answer };
    },

    /* ===== 6학년 1학기 - 분수의 나눗셈 ===== */

    // ① 자연수 ÷ 자연수 (몫이 1보다 작음)
    g6s1_natural_div_natural_proper() {
        const divisor = randInt(2, 30);
        const dividend = randInt(1, divisor - 1);
        const simplified = simplifyFraction(dividend, divisor);
        const formula = `${dividend} ÷ ${divisor}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatMixedNumber(0, simplified.numerator, simplified.denominator) };
    },

    // ② 자연수 ÷ 자연수 (몫이 1보다 큼, 나누어떨어짐과 대분수 결과 모두 생성)
    g6s1_natural_div_natural_mixed() {
        const divisor = randInt(2, 12);
        const dividend = randInt(divisor + 1, divisor * 6);
        const simplified = simplifyFraction(dividend, divisor);
        const norm = normalizeMixedNumber(0, simplified.numerator, simplified.denominator);
        const formula = `${dividend} ÷ ${divisor}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatMixedNumber(norm.whole, norm.numerator, simplified.denominator) };
    },

    // ③ 진분수 ÷ 자연수
    g6s1_proper_fraction_div_natural() {
        const d = randInt(2, 15);
        const n = randInt(1, d - 1);
        const natural = randInt(2, 12);
        const result = divideFractions(0, n, d, natural, 0, 1);
        const formula = `${makeFractionHTML(n, d)} ÷ ${natural}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatMixedNumber(result.whole, result.numerator, result.denominator) };
    },

    // ④ 가분수 ÷ 자연수 (결과가 진분수·자연수·대분수 모두 나올 수 있음)
    g6s1_improper_fraction_div_natural() {
        const d = randInt(2, 12);
        const n = randInt(d + 1, d * 4);
        const natural = randInt(2, 10);
        const result = divideFractions(0, n, d, natural, 0, 1);
        const formula = `${makeFractionHTML(n, d)} ÷ ${natural}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatMixedNumber(result.whole, result.numerator, result.denominator) };
    },

    // ⑤ 대분수 ÷ 자연수
    g6s1_mixed_fraction_div_natural() {
        const d = randInt(2, 12);
        const whole = randInt(1, 6);
        const n = randInt(1, d - 1);
        const natural = randInt(2, 10);
        const result = divideFractions(whole, n, d, natural, 0, 1);
        const formula = `${formatMixedNumber(whole, n, d)} ÷ ${natural}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatMixedNumber(result.whole, result.numerator, result.denominator) };
    },

    /* ===== 6학년 1학기 - 각기둥과 각뿔 (그림·전개도 없이 텍스트로 판단) ===== */

    /* ===== 6학년 1학기 - 소수의 나눗셈 (몫을 먼저 정하고 피제수를 역산) ===== */

    // ⑫ 소수 한 자리 수 ÷ 자연수
    g6s1_decimal_1_div_natural() {
        const result = generateUntilValid(
            () => {
                const divisor = randInt(2, 12);
                const quotientScaled = randDecimalScaled(1, 99);
                const dividendScaled = quotientScaled * divisor;
                return { divisor, quotientScaled, dividendScaled };
            },
            (v) => v.dividendScaled % 10 !== 0
        );
        const formula = `${formatScaledDecimal(result.dividendScaled, 1)} ÷ ${result.divisor}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatScaledDecimal(result.quotientScaled, 1) };
    },

    // ⑬ 소수 두 자리 수 ÷ 자연수
    g6s1_decimal_2_div_natural() {
        const result = generateUntilValid(
            () => {
                const divisor = randInt(2, 12);
                const quotientScaled = randDecimalScaled(1, 999);
                const dividendScaled = quotientScaled * divisor;
                return { divisor, quotientScaled, dividendScaled };
            },
            (v) => v.dividendScaled % 10 !== 0
        );
        const formula = `${formatScaledDecimal(result.dividendScaled, 2)} ÷ ${result.divisor}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatScaledDecimal(result.quotientScaled, 2) };
    },

    // ⑭ 몫이 1보다 작은 소수 ÷ 자연수
    g6s1_decimal_div_natural_under_1() {
        const result = generateUntilValid(
            () => {
                const divisor = randInt(2, 12);
                const quotientScaled = randInt(1, 99); // 소수 둘째 자리 스케일, 항상 1 미만(0.01~0.99)
                const dividendScaled = quotientScaled * divisor;
                return { divisor, quotientScaled, dividendScaled };
            },
            (v) => v.dividendScaled % 10 !== 0
        );
        const formula = `${formatScaledDecimal(result.dividendScaled, 2)} ÷ ${result.divisor}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatScaledDecimal(result.quotientScaled, 2) };
    },

    // ⑮ 몫의 소수 첫째 자리에 0이 있는 나눗셈
    g6s1_decimal_div_zero_tenths() {
        const result = generateUntilValid(
            () => {
                const divisor = randInt(2, 9);
                const wholePart = randInt(0, 5);
                const hundredths = randInt(1, 9); // 1~9 (0이면 소수 둘째 자리도 0이 되어버림)
                const quotientScaled = wholePart * 100 + hundredths; // 소수 첫째 자리 = 0, 둘째 자리 = hundredths
                const dividendScaled = quotientScaled * divisor;
                return { divisor, quotientScaled, dividendScaled };
            },
            (v) => v.dividendScaled % 10 !== 0
        );
        const formula = `${formatScaledDecimal(result.dividendScaled, 2)} ÷ ${result.divisor}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatScaledDecimal(result.quotientScaled, 2) };
    },

    // ⑯ 소수점 아래 0을 내려 계산하는 나눗셈 (표시된 피제수 자릿수로는 나누어떨어지지 않아 한 자리를 더 내려야 함)
    g6s1_decimal_div_append_zero() {
        const result = generateUntilValid(
            () => {
                const dDecimals = Math.random() < 0.5 ? 1 : 2;
                const divisor = randInt(2, 9);
                const dividendScaled = dDecimals === 1 ? randDecimalScaled(1, 99) : randDecimalScaled(1, 999);
                const needsAppend = dividendScaled % divisor !== 0;
                const appendedDivisible = (dividendScaled * 10) % divisor === 0;
                return { dDecimals, divisor, dividendScaled, needsAppend, appendedDivisible };
            },
            (v) => v.needsAppend && v.appendedDivisible
        );
        const quotientScaled = (result.dividendScaled * 10) / result.divisor;
        const quotientDecimals = result.dDecimals + 1;
        const formula = `${formatScaledDecimal(result.dividendScaled, result.dDecimals)} ÷ ${result.divisor}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatScaledDecimal(quotientScaled, quotientDecimals) };
    },

    // ⑰ 자연수 ÷ 자연수의 몫을 소수로 나타내기 (유한소수가 되는 조합만 채택, 소수 둘째 자리까지로 제한)
    g6s1_natural_div_natural_decimal() {
        const result = generateUntilValid(
            () => {
                const divisor = randInt(2, 20);
                const dividend = randInt(1, 200);
                const quotientStr = divideScaledDecimals(dividend, 0, divisor, 0);
                return { divisor, dividend, quotientStr };
            },
            (v) => v.quotientStr !== null && /^\d+(\.\d{1,2})?$/.test(v.quotientStr)
        );
        const formula = `${result.dividend} ÷ ${result.divisor}`;
        return { formulaFront: formula, formulaBack: formula, answer: result.quotientStr };
    },

    /* ===== 6학년 1학기 - 비와 비율 ===== */

    // ⑱ 두 수를 비로 나타내기
    g6s1_ratio_notation() {
        const items = ["사과", "배", "귤", "포도", "구슬"];
        const idxA = randInt(0, items.length - 1);
        let idxB = randInt(0, items.length - 1);
        while (idxB === idxA) idxB = randInt(0, items.length - 1);
        const nameA = items[idxA];
        const nameB = items[idxB];
        const itemA = randInt(2, 30);
        const itemB = randInt(2, 30);
        const formula = `${nameA} ${itemA}개와 ${nameB} ${itemB}개의 수의 비를 ${nameA} 수와 ${nameB} 수의 비로 나타내기`;
        return { formulaFront: formula, formulaBack: formula, answer: `${itemA} : ${itemB}` };
    },

    // ⑲ 비율을 분수로 나타내기 (비교하는 양 ÷ 기준량, 기약분수)
    g6s1_rate_as_fraction() {
        const base = randInt(2, 20);
        const compare = randInt(1, base * 2);
        const simplified = simplifyFraction(compare, base);
        const formula = `${compare} : ${base}의 비율을 분수로 나타내기`;
        return { formulaFront: formula, formulaBack: formula, answer: makeFractionHTML(simplified.numerator, simplified.denominator) };
    },

    // ⑳ 비율을 소수로 나타내기 (유한소수가 되는 조합만 생성)
    g6s1_rate_as_decimal() {
        const result = generateUntilValid(
            () => {
                const base = randInt(2, 50);
                const compare = randInt(1, base * 2);
                const decimalStr = divideScaledDecimals(compare, 0, base, 0);
                return { base, compare, decimalStr };
            },
            (v) => v.decimalStr !== null
        );
        const formula = `${result.compare} : ${result.base}의 비율을 소수로 나타내기`;
        return { formulaFront: formula, formulaBack: formula, answer: result.decimalStr };
    },

    // ㉑ 비율을 백분율로 나타내기 (정수 또는 소수 한 자리 백분율만 허용)
    g6s1_rate_as_percent() {
        const result = generateUntilValid(
            () => {
                const base = randInt(2, 50);
                const compare = randInt(0, base); // 0~100% 범위가 기본이 되도록 함
                const percentStr = divideScaledDecimals(compare * 100, 0, base, 0);
                return { base, compare, percentStr };
            },
            (v) => v.percentStr !== null && /^\d+(\.\d)?$/.test(v.percentStr)
        );
        const formula = `${result.compare} : ${result.base}의 비율을 백분율로 나타내기`;
        return { formulaFront: formula, formulaBack: formula, answer: `${result.percentStr}%` };
    },

    // ㉒ 기준량과 비율로 비교하는 양 구하기 (비율을 먼저 정하고 나누어떨어지는 기준량을 역산해 구성)
    g6s1_find_comparison_quantity() {
        const percent = randInt(1, 100);
        const g = gcd(percent, 100);
        const requiredMultiple = 100 / g; // 이 배수여야 기준량 × 비율이 100으로 나누어떨어짐
        const maxMultiplier = Math.max(1, Math.floor(200 / requiredMultiple));
        const multiplier = randInt(1, maxMultiplier);
        const base = requiredMultiple * multiplier;
        const compare = (base * percent) / 100;
        const formula = `기준량이 ${base}이고 비율이 ${percent}%일 때 비교하는 양`;
        return { formulaFront: formula, formulaBack: formula, answer: String(compare) };
    },

    // ㉓ 비교하는 양과 비율로 기준량 구하기 (같은 방식으로 나누어떨어지는 조합을 구성)
    g6s1_find_base_quantity() {
        const percent = randInt(1, 100);
        const g = gcd(percent, 100);
        const requiredMultiple = 100 / g;
        const maxMultiplier = Math.max(1, Math.floor(200 / requiredMultiple));
        const multiplier = randInt(1, maxMultiplier);
        const base = requiredMultiple * multiplier;
        const compare = (base * percent) / 100;
        const formula = `비교하는 양이 ${compare}이고 비율이 ${percent}%일 때 기준량`;
        return { formulaFront: formula, formulaBack: formula, answer: String(base) };
    },

    // ㉔ 전체와 부분을 이용한 백분율 (부분은 전체 이하, 백분율을 먼저 정해 나누어떨어지는 전체를 역산)
    g6s1_part_whole_percent() {
        const percent = randInt(0, 100);
        const g = gcd(percent, 100);
        const requiredMultiple = 100 / g;
        const maxMultiplier = Math.max(1, Math.floor(200 / requiredMultiple));
        const multiplier = randInt(1, maxMultiplier);
        const whole = requiredMultiple * multiplier;
        const part = (whole * percent) / 100;
        const formula = `전체 ${whole} 중 ${part}의 백분율`;
        return { formulaFront: formula, formulaBack: formula, answer: `${percent}%` };
    },

    /* ===== 6학년 1학기 - 여러 가지 그래프 (수치 관계만 카드로 출제) ===== */

    // ㉕ 전체 자료에서 항목의 백분율 구하기 (백분율을 먼저 정해 나누어떨어지는 전체 인원을 역산)
    g6s1_graph_category_percent() {
        const percent = randInt(1, 99);
        const g = gcd(percent, 100);
        const requiredMultiple = 100 / g;
        const minMultiplier = Math.max(1, Math.ceil(20 / requiredMultiple));
        const maxMultiplier = Math.max(minMultiplier, Math.floor(500 / requiredMultiple));
        const multiplier = randInt(minMultiplier, maxMultiplier);
        const total = requiredMultiple * multiplier;
        const count = (total * percent) / 100;
        const label = ["A", "B", "C", "D"][randInt(0, 3)];
        const formula = `전체 ${total}명 중 ${count}명이 ${label}를 선택했다. ${label}의 비율`;
        return { formulaFront: formula, formulaBack: formula, answer: `${percent}%` };
    },

    // ㉖ 전체 수와 백분율로 항목 수 구하기 (답이 자연수, 같은 방식으로 역산해 구성)
    g6s1_graph_category_count() {
        const percent = randInt(1, 99);
        const g = gcd(percent, 100);
        const requiredMultiple = 100 / g;
        const minMultiplier = Math.max(1, Math.ceil(20 / requiredMultiple));
        const maxMultiplier = Math.max(minMultiplier, Math.floor(500 / requiredMultiple));
        const multiplier = randInt(minMultiplier, maxMultiplier);
        const total = requiredMultiple * multiplier;
        const count = (total * percent) / 100;
        const label = ["A", "B", "C", "D"][randInt(0, 3)];
        const formula = `전체 ${total}명 중 ${percent}%가 ${label}를 선택했을 때 ${label}를 선택한 사람 수`;
        return { formulaFront: formula, formulaBack: formula, answer: `${count}명` };
    },

    // ㉗ 여러 항목의 빠진 백분율 (합계는 항상 100%)
    g6s1_graph_missing_percent() {
        const itemCount = randInt(3, 5);
        const labels = ["A", "B", "C", "D", "E"].slice(0, itemCount);
        const percents = generateUntilValid(
            () => {
                const arr = [];
                let remaining = 100;
                for (let i = 0; i < itemCount - 1; i++) {
                    const maxForThis = remaining - (itemCount - 1 - i);
                    const value = randInt(1, Math.max(1, maxForThis - 1));
                    arr.push(value);
                    remaining -= value;
                }
                arr.push(remaining);
                return arr;
            },
            (arr) => arr.every((v) => v >= 1)
        );
        const blankIdx = randInt(0, itemCount - 1);
        const missingValue = percents[blankIdx];
        const display = labels.map((label, idx) => `${label} ${idx === blankIdx ? "?" : percents[idx] + "%"}`).join(", ");
        return { formulaFront: display, formulaBack: display, answer: `${missingValue}%` };
    },

    // ㉘ 백분율이 가장 큰 항목 또는 작은 항목 (서로 다른 값만 사용해 답을 하나로 고정)
    g6s1_graph_largest_smallest() {
        const itemCount = randInt(3, 5);
        const labels = ["A", "B", "C", "D", "E"].slice(0, itemCount);
        const percents = generateUntilValid(
            () => {
                const values = new Set();
                while (values.size < itemCount) values.add(randInt(5, 40));
                return [...values];
            },
            (arr) => new Set(arr).size === arr.length
        );
        const askLargest = Math.random() < 0.5;
        const targetVal = askLargest ? Math.max(...percents) : Math.min(...percents);
        const targetIdx = percents.indexOf(targetVal);
        const display = labels.map((label, idx) => `${label} ${percents[idx]}%`).join(", ");
        const question = askLargest ? "비율이 가장 큰 항목" : "비율이 가장 작은 항목";
        const formula = `${display} 중 ${question}`;
        return { formulaFront: formula, formulaBack: formula, answer: labels[targetIdx] };
    },

    // ㉙ 두 항목의 백분율 차
    g6s1_graph_percent_difference() {
        const percentA = randInt(5, 60);
        const percentB = generateUntilValid(() => randInt(5, 60), (v) => v !== percentA);
        const formula = `A ${percentA}%, B ${percentB}%일 때 두 항목의 백분율 차`;
        const diff = Math.abs(percentA - percentB);
        return { formulaFront: formula, formulaBack: formula, answer: `${diff}%` };
    },

    /* ===== 6학년 1학기 - 직육면체의 겉넓이와 부피 ===== */

    // ㉚ 직육면체의 겉넓이
    g6s1_cuboid_surface_area() {
        const w = randInt(2, 30);
        const h = randInt(2, 30);
        const height = randInt(2, 30);
        const surfaceArea = 2 * (w * h + h * height + w * height);
        const formula = `가로 ${w}cm, 세로 ${h}cm, 높이 ${height}cm인 직육면체의 겉넓이`;
        return { formulaFront: formula, formulaBack: formula, answer: formatCm2(surfaceArea) };
    },

    // ㉛ 정육면체의 겉넓이
    g6s1_cube_surface_area() {
        const side = randInt(2, 30);
        const surfaceArea = 6 * side * side;
        const formula = `한 변이 ${side}cm인 정육면체의 겉넓이`;
        return { formulaFront: formula, formulaBack: formula, answer: formatCm2(surfaceArea) };
    },

    // ㉜ 겉넓이로 직육면체의 한 변 구하기 (세 변을 먼저 만든 뒤 겉넓이를 계산해 출제)
    g6s1_cuboid_missing_dimension_surface() {
        const w = randInt(2, 30);
        const h = randInt(2, 30);
        const height = randInt(2, 30);
        const surfaceArea = 2 * (w * h + h * height + w * height);
        const formula = `가로 ${w}cm, 세로 ${h}cm인 직육면체의 겉넓이가 ${surfaceArea}cm\u00B2일 때 높이`;
        return { formulaFront: formula, formulaBack: formula, answer: formatCm(height) };
    },

    // ㉝ 직육면체의 부피
    g6s1_cuboid_volume() {
        const w = randInt(2, 30);
        const h = randInt(2, 30);
        const height = randInt(2, 30);
        const formula = `가로 ${w}cm, 세로 ${h}cm, 높이 ${height}cm인 직육면체의 부피`;
        return { formulaFront: formula, formulaBack: formula, answer: formatCm3(w * h * height) };
    },

    // ㉞ 정육면체의 부피
    g6s1_cube_volume() {
        const side = randInt(2, 30);
        const formula = `한 변이 ${side}cm인 정육면체의 부피`;
        return { formulaFront: formula, formulaBack: formula, answer: formatCm3(side * side * side) };
    },

    // ㉟ 부피로 직육면체의 한 변 구하기 (두 변과 부피를 제시, 답이 자연수가 되게 역산)
    g6s1_cuboid_missing_dimension_volume() {
        const w = randInt(2, 30);
        const h = randInt(2, 30);
        const height = randInt(2, 30);
        const volume = w * h * height;
        const formula = `가로 ${w}cm, 세로 ${h}cm인 직육면체의 부피가 ${volume}cm\u00B3일 때 높이`;
        return { formulaFront: formula, formulaBack: formula, answer: formatCm(height) };
    },

    // ㊱ 두 직육면체의 부피 비교 (같은 부피인 사례도 일정 비율로 생성)
    g6s1_cuboid_volume_compare() {
        const dims1 = { w: randInt(2, 20), h: randInt(2, 20), d: randInt(2, 20) };
        const wantEqual = Math.random() < 0.25;
        let dims2;
        if (wantEqual) {
            // 세 변의 순서만 바꾸어도 부피가 같다는 성질을 이용
            dims2 = { w: dims1.h, h: dims1.d, d: dims1.w };
        } else {
            dims2 = generateUntilValid(
                () => ({ w: randInt(2, 20), h: randInt(2, 20), d: randInt(2, 20) }),
                (v) => v.w * v.h * v.d !== dims1.w * dims1.h * dims1.d
            );
        }
        const volume1 = dims1.w * dims1.h * dims1.d;
        const volume2 = dims2.w * dims2.h * dims2.d;
        const formula = `가로 ${dims1.w}cm, 세로 ${dims1.h}cm, 높이 ${dims1.d}cm인 직육면체 A와 가로 ${dims2.w}cm, 세로 ${dims2.h}cm, 높이 ${dims2.d}cm인 직육면체 B의 부피 비교 (A ○ B)`;
        let answer;
        if (volume1 > volume2) answer = ">";
        else if (volume1 < volume2) answer = "<";
        else answer = "=";
        return { formulaFront: formula, formulaBack: formula, answer };
    },

    /* ===== 6학년 2학기 - 분수의 나눗셈 ===== */

    // ① 분모가 같고 나누어떨어지는 분수 ÷ 분수
    g6s2_same_den_fraction_div_exact() {
        const result = generateUntilValid(
            () => {
                const d = randInt(4, 15);
                const divisorNum = randInt(1, Math.floor((d - 1) / 2));
                const maxK = Math.floor((d - 1) / divisorNum);
                const k = randInt(1, maxK);
                const dividendNum = divisorNum * k;
                return { d, divisorNum, dividendNum, k };
            },
            (v) => v.dividendNum >= 1 && v.dividendNum <= v.d - 1
        );
        const formula = `${makeFractionHTML(result.dividendNum, result.d)} ÷ ${makeFractionHTML(result.divisorNum, result.d)}`;
        return { formulaFront: formula, formulaBack: formula, answer: String(result.k) };
    },

    // ② 분모가 같고 나누어떨어지지 않는 분수 ÷ 분수
    g6s2_same_den_fraction_div_nonexact() {
        const result = generateUntilValid(
            () => {
                const d = randInt(4, 15);
                const dividendNum = randInt(1, d - 1);
                const divisorNum = randInt(1, d - 1);
                return { d, dividendNum, divisorNum };
            },
            (v) => v.dividendNum % v.divisorNum !== 0
        );
        const computed = divideFractions(0, result.dividendNum, result.d, 0, result.divisorNum, result.d);
        const formula = `${makeFractionHTML(result.dividendNum, result.d)} ÷ ${makeFractionHTML(result.divisorNum, result.d)}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatMixedNumber(computed.whole, computed.numerator, computed.denominator) };
    },

    // ③ 분모가 다른 진분수 ÷ 진분수
    g6s2_unlike_fraction_div() {
        const d1 = randInt(2, 15);
        const d2 = generateUntilValid(() => randInt(2, 15), (v) => v !== d1);
        const n1 = randInt(1, d1 - 1);
        const n2 = randInt(1, d2 - 1);
        const result = divideFractions(0, n1, d1, 0, n2, d2);
        const formula = `${makeFractionHTML(n1, d1)} ÷ ${makeFractionHTML(n2, d2)}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatMixedNumber(result.whole, result.numerator, result.denominator) };
    },

    // ④ 자연수 ÷ 단위분수
    g6s2_natural_div_unit_fraction() {
        const natural = randInt(2, 12);
        const d = randInt(2, 12);
        const result = divideFractions(natural, 0, 1, 0, 1, d);
        const formula = `${natural} ÷ ${makeFractionHTML(1, d)}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatMixedNumber(result.whole, result.numerator, result.denominator) };
    },

    // ⑤ 자연수 ÷ 진분수
    g6s2_natural_div_fraction() {
        const natural = randInt(2, 12);
        const d = randInt(2, 15);
        const n = randInt(1, d - 1);
        const result = divideFractions(natural, 0, 1, 0, n, d);
        const formula = `${natural} ÷ ${makeFractionHTML(n, d)}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatMixedNumber(result.whole, result.numerator, result.denominator) };
    },

    // ⑥ 진분수 또는 가분수 ÷ 분수
    g6s2_fraction_div_fraction() {
        const d1 = randInt(2, 15);
        const isImproper1 = Math.random() < 0.5;
        const n1 = isImproper1 ? randInt(d1 + 1, d1 * 3) : randInt(1, d1 - 1);
        const d2 = randInt(2, 15);
        const isImproper2 = Math.random() < 0.5;
        const n2 = isImproper2 ? randInt(d2 + 1, d2 * 3) : randInt(1, d2 - 1);
        const result = divideFractions(0, n1, d1, 0, n2, d2);
        const formula = `${makeFractionHTML(n1, d1)} ÷ ${makeFractionHTML(n2, d2)}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatMixedNumber(result.whole, result.numerator, result.denominator) };
    },

    // ⑦ 대분수 ÷ 대분수 또는 진분수 (결과가 지나치게 커지지 않도록 제한)
    g6s2_mixed_fraction_div_fraction() {
        const result = generateUntilValid(
            () => {
                const whole1 = randInt(1, 5);
                const d1 = randInt(2, 12);
                const n1 = randInt(1, d1 - 1);
                const useSecondMixed = Math.random() < 0.5;
                const whole2 = useSecondMixed ? randInt(1, 5) : 0;
                const d2 = randInt(2, 12);
                const n2 = randInt(1, d2 - 1);
                const dividendValue = whole1 + n1 / d1;
                const divisorValue = whole2 + n2 / d2;
                const approxAnswer = dividendValue / divisorValue; // 상한 확인용 근사값(정답 계산에는 사용하지 않음)
                return { whole1, n1, d1, whole2, n2, d2, approxAnswer };
            },
            (v) => v.approxAnswer <= 20
        );
        const computed = divideFractions(result.whole1, result.n1, result.d1, result.whole2, result.n2, result.d2);
        const dividendStr = formatMixedNumber(result.whole1, result.n1, result.d1);
        const divisorStr = result.whole2 > 0 ? formatMixedNumber(result.whole2, result.n2, result.d2) : makeFractionHTML(result.n2, result.d2);
        const formula = `${dividendStr} ÷ ${divisorStr}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatMixedNumber(computed.whole, computed.numerator, computed.denominator) };
    },

    /* ===== 6학년 2학기 - 소수의 나눗셈 (몫을 먼저 정하고 피제수를 역산) ===== */

    // ⑧ 소수 한 자리 수 ÷ 소수 한 자리 수 (유한소수가 되는 조합만 채택 - 약 17% 확률로 넉넉히 성립)
    g6s2_decimal_1_div_decimal_1() {
        const result = generateUntilValid(
            () => {
                const dividendScaled = randDecimalScaled(1, 99);
                const divisorScaled = randDecimalScaled(1, 99);
                const quotientStr = divideScaledDecimals(dividendScaled, 1, divisorScaled, 1);
                return { dividendScaled, divisorScaled, quotientStr };
            },
            (v) => v.quotientStr !== null
        );
        const formula = `${formatScaledDecimal(result.dividendScaled, 1)} ÷ ${formatScaledDecimal(result.divisorScaled, 1)}`;
        return { formulaFront: formula, formulaBack: formula, answer: result.quotientStr };
    },

    // ⑨ 소수 두 자리 수 ÷ 소수 두 자리 수 (유한소수 확률이 낮아(약 3%) 시도 횟수를 늘려 안정적으로 생성)
    g6s2_decimal_2_div_decimal_2() {
        const result = generateUntilValid(
            () => {
                const dividendScaled = randDecimalScaled(1, 999);
                const divisorScaled = randDecimalScaled(1, 999);
                const quotientStr = divideScaledDecimals(dividendScaled, 2, divisorScaled, 2);
                return { dividendScaled, divisorScaled, quotientStr };
            },
            (v) => v.quotientStr !== null,
            3000
        );
        const formula = `${formatScaledDecimal(result.dividendScaled, 2)} ÷ ${formatScaledDecimal(result.divisorScaled, 2)}`;
        return { formulaFront: formula, formulaBack: formula, answer: result.quotientStr };
    },

    // ⑩ 자릿수가 다른 소수 ÷ 소수 (제수 자릿수 + 몫 1자리 = 피제수 자릿수, 항상 서로 다르게 됨)
    g6s2_decimal_mixed_places_div() {
        const result = generateUntilValid(
            () => {
                const divisorDecimals = Math.random() < 0.5 ? 1 : 2;
                const divisorMax = divisorDecimals === 1 ? 99 : 999;
                const divisorScaled = randDecimalScaled(1, divisorMax);
                const quotientScaled = randDecimalScaled(1, 99); // 몫은 소수 한 자리
                const dividendDecimals = divisorDecimals + 1;
                const dividendScaled = quotientScaled * divisorScaled;
                return { divisorDecimals, divisorScaled, quotientScaled, dividendDecimals, dividendScaled };
            },
            (v) => v.dividendScaled % 10 !== 0
        );
        const formula = `${formatScaledDecimal(result.dividendScaled, result.dividendDecimals)} ÷ ${formatScaledDecimal(result.divisorScaled, result.divisorDecimals)}`;
        return { formulaFront: formula, formulaBack: formula, answer: formatScaledDecimal(result.quotientScaled, 1) };
    },

    // ⑪ 자연수 ÷ 소수 (몫이 자연수 또는 유한소수가 되는 조합만 채택)
    g6s2_natural_div_decimal() {
        const result = generateUntilValid(
            () => {
                const divisorDecimals = Math.random() < 0.5 ? 1 : 2;
                const divisorMax = divisorDecimals === 1 ? 99 : 999;
                const divisorScaled = randDecimalScaled(1, divisorMax);
                const dividend = randInt(1, 200);
                const quotientStr = divideScaledDecimals(dividend, 0, divisorScaled, divisorDecimals);
                return { divisorDecimals, divisorScaled, dividend, quotientStr };
            },
            (v) => v.quotientStr !== null
        );
        const formula = `${result.dividend} ÷ ${formatScaledDecimal(result.divisorScaled, result.divisorDecimals)}`;
        return { formulaFront: formula, formulaBack: formula, answer: result.quotientStr };
    },

    // ⑫ 몫을 반올림하여 나타내기 (정수 나눗셈으로만 반올림 계산, 5 이상 올림)
    g6s2_decimal_quotient_rounding() {
        const dividend = randInt(1, 50);
        const divisor = randInt(2, 20);
        const places = Math.random() < 0.5 ? 1 : 2;
        const roundedStr = roundRationalHalfUp(dividend, divisor, places);
        const placeLabel = places === 1 ? "소수 첫째 자리" : "소수 둘째 자리";
        const formula = `${dividend} ÷ ${divisor}의 몫을 반올림하여 ${placeLabel}까지 나타내기`;
        return { formulaFront: formula, formulaBack: formula, answer: roundedStr };
    },

    // ⑬ 일정한 양씩 나누고 남는 양 (정수 스케일로 몫과 나머지 계산, 나머지는 0 이상 제수 미만)
    g6s2_decimal_div_remainder_quantity() {
        const units = ["L", "kg", "m"];
        const unit = units[randInt(0, units.length - 1)];
        const result = generateUntilValid(
            () => {
                const unitScaled = randDecimalScaled(1, 99);
                const count = randInt(2, 20);
                const remainderScaled = randInt(0, unitScaled - 1);
                const totalScaled = unitScaled * count + remainderScaled;
                return { unitScaled, count, remainderScaled, totalScaled };
            },
            (v) => v.totalScaled % 10 !== 0
        );
        const formula = `${formatScaledDecimal(result.totalScaled, 1)}${unit}를 ${formatScaledDecimal(result.unitScaled, 1)}${unit}씩 나누면 몇 개를 만들고 얼마가 남는가?`;
        const answer = `${result.count}개, ${formatScaledDecimal(result.remainderScaled, 1)}${unit}`;
        return { formulaFront: formula, formulaBack: formula, answer };
    },

    /* ===== 6학년 2학기 - 공간과 입체 (쌓기나무 수치만 텍스트로 제시) ===== */

    /* ===== 6학년 2학기 - 비례식과 비례배분 ===== */

    // ⑰ 비를 간단한 자연수의 비로 나타내기
    g6s2_ratio_simplify_natural() {
        const base = generateUntilValid(
            () => ({ a: randInt(1, 15), b: randInt(1, 15) }),
            (v) => gcd(v.a, v.b) === 1 && v.a !== v.b
        );
        const factor = randInt(2, 8);
        const before = { a: base.a * factor, b: base.b * factor };
        const formula = `${before.a} : ${before.b}`;
        return { formulaFront: formula, formulaBack: formula, answer: `${base.a} : ${base.b}` };
    },

    // ⑱ 소수의 비를 자연수의 비로 나타내기 (양쪽 모두 실제 소수 한 자리로 보이는 조합만 채택)
    g6s2_ratio_decimal_to_natural() {
        const result = generateUntilValid(
            () => {
                const a = randInt(1, 12);
                const b = randInt(1, 12);
                if (gcd(a, b) !== 1 || a === b) return { valid: false };
                const scaleFactor = randInt(1, 9); // 0.1 단위 배율
                const decimalA = a * scaleFactor;
                const decimalB = b * scaleFactor;
                return { valid: decimalA % 10 !== 0 && decimalB % 10 !== 0, a, b, decimalA, decimalB };
            },
            (v) => v.valid
        );
        const formula = `${formatScaledDecimal(result.decimalA, 1)} : ${formatScaledDecimal(result.decimalB, 1)}`;
        return { formulaFront: formula, formulaBack: formula, answer: `${result.a} : ${result.b}` };
    },

    // ⑲ 분수의 비를 자연수의 비로 나타내기 (분모의 최소공배수 이용 후 최대공약수로 간단히)
    g6s2_ratio_fraction_to_natural() {
        const d1 = randInt(2, 10);
        const d2 = randInt(2, 10);
        const n1 = randInt(1, d1 - 1);
        const n2 = randInt(1, d2 - 1);
        const commonDenom = lcm(d1, d2);
        const scaledN1 = n1 * (commonDenom / d1);
        const scaledN2 = n2 * (commonDenom / d2);
        const simplified = simplifyRatio(scaledN1, scaledN2);
        const formula = `${makeFractionHTML(n1, d1)} : ${makeFractionHTML(n2, d2)}`;
        return { formulaFront: formula, formulaBack: formula, answer: `${simplified.a} : ${simplified.b}` };
    },

    // ⑳ 같은 비의 빈칸
    g6s2_equivalent_ratio_blank() {
        const a = randInt(1, 15);
        const b = randInt(1, 15);
        const factor = randInt(2, 8);
        const scaledA = a * factor;
        const scaledB = b * factor;
        const blankIsA = Math.random() < 0.5;
        let formula, answer;
        if (blankIsA) {
            formula = `${a} : ${b} = ? : ${scaledB}`;
            answer = String(scaledA);
        } else {
            formula = `${a} : ${b} = ${scaledA} : ?`;
            answer = String(scaledB);
        }
        return { formulaFront: formula, formulaBack: formula, answer };
    },

    // ㉑ 비례식의 빈칸 (a:b=c:d, 네 자리 중 무작위로 빈칸)
    g6s2_proportion_blank() {
        const a = randInt(1, 12);
        const b = randInt(1, 12);
        const factor = randInt(2, 8);
        const c = a * factor;
        const d = b * factor;
        const values = [a, b, c, d];
        const blankIdx = randInt(0, 3);
        const answer = values[blankIdx];
        const display = values.map((v, idx) => (idx === blankIdx ? "?" : v));
        const formula = `${display[0]} : ${display[1]} = ${display[2]} : ${display[3]}`;
        return { formulaFront: formula, formulaBack: formula, answer: String(answer) };
    },

    // ㉒ 비례 관계의 값 구하기 (단위당 값을 자연수로 고정해 정확하게 역산)
    g6s2_proportion_application() {
        const result = generateUntilValid(
            () => {
                const unitQty = randInt(2, 10);
                const targetQty = randInt(2, 20);
                const perUnit = randInt(50, 2000);
                const totalPriceForUnitQty = perUnit * unitQty;
                const totalPriceForTargetQty = perUnit * targetQty;
                return { unitQty, targetQty, perUnit, totalPriceForUnitQty, totalPriceForTargetQty };
            },
            (v) => v.targetQty !== v.unitQty
        );
        const items = ["연필", "공책", "지우개", "풀"];
        const item = items[randInt(0, items.length - 1)];
        const formula = `${item} ${result.unitQty}자루가 ${formatNumber(result.totalPriceForUnitQty)}원일 때 같은 ${item} ${result.targetQty}자루의 가격`;
        return { formulaFront: formula, formulaBack: formula, answer: `${formatNumber(result.totalPriceForTargetQty)}원` };
    },

    // ㉓ 비례배분 (전체가 비의 합으로 나누어떨어지게 생성)
    g6s2_proportional_distribution() {
        const result = generateUntilValid(
            () => {
                const a = randInt(1, 10);
                const b = randInt(1, 10);
                const g = gcd(a, b);
                const simplifiedA = a / g, simplifiedB = b / g;
                const multiplier = randInt(2, 20);
                const total = (simplifiedA + simplifiedB) * multiplier;
                const partA = simplifiedA * multiplier;
                const partB = simplifiedB * multiplier;
                return { simplifiedA, simplifiedB, total, partA, partB };
            },
            (v) => v.simplifiedA !== v.simplifiedB
        );
        const formula = `${result.total}를 ${result.simplifiedA} : ${result.simplifiedB}로 비례배분하기`;
        return { formulaFront: formula, formulaBack: formula, answer: `${result.partA}, ${result.partB}` };
    },

    /* ===== 6학년 2학기 - 원의 둘레와 넓이 (원주율 3.14, 정수 스케일 연산) ===== */

    // ㉔ 지름으로 원주 구하기
    g6s2_circle_circumference_diameter() {
        const diameter = randInt(2, 50);
        const circumference = calculateCircleValue("circumference", diameter);
        const formula = `지름이 ${diameter}cm인 원의 원주`;
        return { formulaFront: formula, formulaBack: formula, answer: `${circumference}cm` };
    },

    // ㉕ 반지름으로 원주 구하기
    g6s2_circle_circumference_radius() {
        const radius = randInt(2, 25);
        const circumference = calculateCircleValue("circumference", radius * 2);
        const formula = `반지름이 ${radius}cm인 원의 원주`;
        return { formulaFront: formula, formulaBack: formula, answer: `${circumference}cm` };
    },

    // ㉖ 원주로 지름 구하기 (지름을 먼저 만든 뒤 원주를 계산해 역문제로 출제)
    g6s2_circle_diameter_from_circumference() {
        const diameter = randInt(2, 50);
        const circumference = calculateCircleValue("circumference", diameter);
        const formula = `원주가 ${circumference}cm인 원의 지름`;
        return { formulaFront: formula, formulaBack: formula, answer: `${diameter}cm` };
    },

    // ㉗ 원주로 반지름 구하기
    g6s2_circle_radius_from_circumference() {
        const radius = randInt(2, 25);
        const circumference = calculateCircleValue("circumference", radius * 2);
        const formula = `원주가 ${circumference}cm인 원의 반지름`;
        return { formulaFront: formula, formulaBack: formula, answer: `${radius}cm` };
    },

    // ㉘ 반지름으로 원의 넓이 구하기
    g6s2_circle_area_radius() {
        const radius = randInt(2, 25);
        const area = calculateCircleValue("area", radius);
        const formula = `반지름이 ${radius}cm인 원의 넓이`;
        return { formulaFront: formula, formulaBack: formula, answer: `${area}cm\u00B2` };
    },

    // ㉙ 지름으로 원의 넓이 구하기 (지름은 짝수를 기본으로 생성)
    g6s2_circle_area_diameter() {
        const radius = randInt(2, 25); // 반지름부터 만들어 지름이 항상 짝수가 되게 함
        const diameter = radius * 2;
        const area = calculateCircleValue("area", radius);
        const formula = `지름이 ${diameter}cm인 원의 넓이`;
        return { formulaFront: formula, formulaBack: formula, answer: `${area}cm\u00B2` };
    },

    // ㉚ 원의 넓이로 반지름 구하기 (반지름을 먼저 생성해 넓이를 계산한 뒤 역문제로 출제)
    g6s2_circle_radius_from_area() {
        const radius = randInt(2, 25);
        const area = calculateCircleValue("area", radius);
        const formula = `넓이가 ${area}cm\u00B2인 원의 반지름`;
        return { formulaFront: formula, formulaBack: formula, answer: `${radius}cm` };
    },

    // ㉛ 반원의 둘레 (곡선 부분 + 지름을 모두 포함)
    g6s2_semicircle_perimeter() {
        const radius = randInt(2, 25);
        const diameter = radius * 2;
        const curvedPartScaled = radius * PI_SCALED; // 소수 둘째 자리 스케일
        const totalScaled = curvedPartScaled + diameter * 100; // 지름도 같은 스케일(100)로 변환해 합산
        const perimeter = formatScaledDecimal(totalScaled, 2);
        const formula = `반지름이 ${radius}cm인 반원의 둘레 (지름 포함)`;
        return { formulaFront: formula, formulaBack: formula, answer: `${perimeter}cm` };
    },

    /* ===== 6학년 2학기 - 원기둥, 원뿔, 구 (그림·전개도 없이 구성 요소와 성질만 텍스트로) ===== */
};

/**
 * 선택한 문제 유형 중 하나를 무작위로 골라 문제를 생성한다.
 * @param {string} [modeKey] - 지정 시 해당 유형만 생성
 * @param {string[]} [selectedIds] - 미지정 시 gameState.selectedSubjects 사용
 */
function generateMathProblem(modeKey, selectedIds) {
    const pool = selectedIds || (typeof gameState !== "undefined" ? gameState.selectedSubjects : []);
    const mode = modeKey || (pool.length
        ? pool[Math.floor(Math.random() * pool.length)]
        : "add2");

    const generator = problemGenerators[mode];
    if (!generator) {
        return {
            formulaFront: "1 + 1",
            formulaBack: "1 + 1",
            answer: "2",
            subjectId: mode
        };
    }

    const problem = generator();
    return {
        formulaFront: problem.formulaFront,
        formulaBack: problem.formulaBack,
        answer: problem.answer,
        subjectId: mode
    };
}
