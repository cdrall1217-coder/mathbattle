/**
 * 문제 생성기 맵
 * - 키(id)는 problemCatalog의 subjects[].id 와 일치해야 함
 * - 각 함수는 { formulaFront, formulaBack, answer } 를 반환
 * - 생성 조건·정답 로직은 기존 generateMathProblem switch 와 동일
 */

function makeFractionHTML(numerator, denominator) {
    return `<span class="fraction"><span class="num">${numerator}</span><span class="den">${denominator}</span></span>`;
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
