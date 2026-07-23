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

    // ⑩ 직각(90°)·평각(180°)을 만드는 각
    g4s1_angle_complement() {
        const target = Math.random() < 0.5 ? 90 : 180;
        const given = Math.floor(Math.random() * (target - 1)) + 1; // 1 ~ target-1
        const answer = target - given;
        return {
            formulaFront: `${given}°와 합하여 ${target}°가 되는 각`,
            formulaBack: `${given}°와 합하여 ${target}°가 되는 각`,
            answer: `${answer}°`
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
    }
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
