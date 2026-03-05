'use strict';

// ===== إدارة الترجمة =====
const translations = {
    ar: {
        subtitle: 'نظام تنبؤ هجين: تردد + ماركوف + k-NN',
        rounds: 'جولة',
        
        windowTitle: '📊 نافذة التحليل',
        inputTitle: '🎯 إدخال النتائج',
        statsTitle: '📈 الإحصاءات',
        confidenceTitle: '⚡ مؤشر الثقة',
        predTitle: '🔮 توقع الجولة القادمة',
        predSub: 'تردد + ماركوف + k-NN',
        accuracyTitle: '📊 دقة التوقعات',
        
        windowLabel: 'عدد الجولات المحللة:',
        windowDesc: 'تحليل آخر 5 جولات + خوارزميات متعددة',
        statsTeam: 'الجهة',
        statsTotal: 'المجموع',
        statsWin: 'فوز',
        statsPct: 'نسبة %',
        
        btnP: '🔵 لاعب',
        btnB: '🔴 مصرفي',
        btnT: '🟢 تعادل',
        btnUndo: '↩️ تراجع',
        btnReset: '🔄 إعادة تعيين',
        
        player: 'لاعب',
        banker: 'مصرفي',
        tie: 'تعادل',
        
        confidenceLow: 'منخفضة',
        confidenceMedium: 'متوسطة',
        confidenceHigh: 'عالية',
        
        currentAcc: 'الحالية',
        bestAcc: 'أفضل',
        avgAcc: 'المتوسط',
        
        reason: 'تردد + ماركوف + k-NN',
        result: 'التوقع النهائي:',
        
        knnEnabled: 'تفعيل k-NN',
        knnK: 'عدد الجيران (k)',
        knnM: 'طول النمط (m)',
        knnWeight: 'وزن k-NN',
        
        errorWindow: 'حدث خطأ في النافذة'
    },
    
    en: {
        subtitle: 'Hybrid Prediction: Frequency + Markov + k-NN',
        rounds: 'Rounds',
        
        windowTitle: '📊 Analysis Window',
        inputTitle: '🎯 Enter Results',
        statsTitle: '📈 Statistics',
        confidenceTitle: '⚡ Confidence Meter',
        predTitle: '🔮 Next Round Prediction',
        predSub: 'Freq + Markov + k-NN',
        accuracyTitle: '📊 Prediction Accuracy',
        
        windowLabel: 'Rounds analyzed:',
        windowDesc: 'Last 5 rounds + multiple algorithms',
        statsTeam: 'Team',
        statsTotal: 'Total',
        statsWin: 'Win',
        statsPct: 'Rate %',
        
        btnP: '🔵 Player',
        btnB: '🔴 Banker',
        btnT: '🟢 Tie',
        btnUndo: '↩️ Undo',
        btnReset: '🔄 Reset',
        
        player: 'Player',
        banker: 'Banker',
        tie: 'Tie',
        
        confidenceLow: 'Low',
        confidenceMedium: 'Medium',
        confidenceHigh: 'High',
        
        currentAcc: 'Current',
        bestAcc: 'Best',
        avgAcc: 'Average',
        
        reason: 'Frequency + Markov + k-NN',
        result: 'Final Prediction:',
        
        knnEnabled: 'Enable k-NN',
        knnK: 'Number of neighbors (k)',
        knnM: 'Pattern length (m)',
        knnWeight: 'k-NN weight',
        
        errorWindow: 'Window error'
    },
    
    fr: {
        subtitle: 'Prédiction hybride: Fréquence + Markov + k-NN',
        rounds: 'Tours',
        
        windowTitle: '📊 Fenêtre d\'Analyse',
        inputTitle: '🎯 Saisir les Résultats',
        statsTitle: '📈 Statistiques',
        confidenceTitle: '⚡ Niveau de Confiance',
        predTitle: '🔮 Prédiction Prochain Tour',
        predSub: 'Fréq + Markov + k-NN',
        accuracyTitle: '📊 Précision des Prédictions',
        
        windowLabel: 'Tours analysés:',
        windowDesc: '5 derniers tours + algorithmes multiples',
        statsTeam: 'Équipe',
        statsTotal: 'Total',
        statsWin: 'Gain',
        statsPct: 'Taux %',
        
        btnP: '🔵 Joueur',
        btnB: '🔴 Banquier',
        btnT: '🟢 Égalité',
        btnUndo: '↩️ Annuler',
        btnReset: '🔄 Réinitialiser',
        
        player: 'Joueur',
        banker: 'Banquier',
        tie: 'Égalité',
        
        confidenceLow: 'Faible',
        confidenceMedium: 'Moyen',
        confidenceHigh: 'Élevé',
        
        currentAcc: 'Actuelle',
        bestAcc: 'Meilleure',
        avgAcc: 'Moyenne',
        
        reason: 'Fréquence + Markov + k-NN',
        result: 'Prédiction finale:',
        
        knnEnabled: 'Activer k-NN',
        knnK: 'Nombre de voisins (k)',
        knnM: 'Longueur du motif (m)',
        knnWeight: 'Poids k-NN',
        
        errorWindow: 'Erreur de fenêtre'
    }
};

// ===== الحالة العامة =====
const state = {
    rounds: [],
    windowSize: 5,
    count: { P: 0, B: 0, T: 0 },
    win: { P: 0, B: 0, T: 0 },
    loss: { P: 0, B: 0, T: 0 },
    lastPrediction: null,
    accuracyHistory: [],
    predictionsHistory: [],
    // إحصائيات لكل خوارزمية
    algoStats: {
        freq: { correct: 0, total: 0 },
        markov: { correct: 0, total: 0 },
        knn: { correct: 0, total: 0 },
        ensemble: { correct: 0, total: 0 }
    },
    currentLang: 'ar',
    confidenceThreshold: 45,
    // مصفوفات ماركوف
    transition1: { P: { P: 0, B: 0, T: 0 }, B: { P: 0, B: 0, T: 0 }, T: { P: 0, B: 0, T: 0 } },
    transition2: {
        'P,P': { P: 0, B: 0, T: 0 }, 'P,B': { P: 0, B: 0, T: 0 }, 'P,T': { P: 0, B: 0, T: 0 },
        'B,P': { P: 0, B: 0, T: 0 }, 'B,B': { P: 0, B: 0, T: 0 }, 'B,T': { P: 0, B: 0, T: 0 },
        'T,P': { P: 0, B: 0, T: 0 }, 'T,B': { P: 0, B: 0, T: 0 }, 'T,T': { P: 0, B: 0, T: 0 }
    },
    // إعدادات k-NN
    knnEnabled: true,
    kValue: 5,
    mValue: 3,
    knnWeight: 30 // نسبة مئوية
};

// ===== الوظائف المساعدة =====
const el = id => document.getElementById(id);

// ===== الترجمة =====
function setLanguage(lang) {
    if (!translations[lang]) return;
    
    state.currentLang = lang;
    const t = translations[lang];
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    el(`lang${lang.charAt(0).toUpperCase() + lang.slice(1)}`).classList.add('active');
    
    // تحديث النصوص العامة
    el('subtitle').textContent = t.subtitle;
    el('windowTitle').textContent = t.windowTitle;
    el('inputTitle').textContent = t.inputTitle;
    el('statsTitle').textContent = t.statsTitle;
    el('confidenceTitle').textContent = t.confidenceTitle;
    el('predTitle').textContent = t.predTitle;
    el('predSub').textContent = t.predSub;
    el('accuracyTitle').textContent = t.accuracyTitle;
    
    el('windowLabel').textContent = t.windowLabel;
    el('windowDesc').textContent = t.windowDesc;
    
    document.querySelectorAll('#statsTeam').forEach(el => el.textContent = t.statsTeam);
    document.querySelectorAll('#statsTotal').forEach(el => el.textContent = t.statsTotal);
    document.querySelectorAll('#statsWin').forEach(el => el.textContent = t.statsWin);
    document.querySelectorAll('#statsPct').forEach(el => el.textContent = t.statsPct);
    
    el('btnP').innerHTML = t.btnP;
    el('btnB').innerHTML = t.btnB;
    el('btnT').innerHTML = t.btnT;
    el('btnUndo').innerHTML = t.btnUndo;
    el('btnReset').innerHTML = t.btnReset;
    
    el('predLabelP').textContent = t.player;
    el('predLabelB').textContent = t.banker;
    el('predLabelT').textContent = t.tie;
    
    el('resultLabel').textContent = t.result;
    el('predictionReason').textContent = t.reason;
    
    el('currentAccLabel').textContent = t.currentAcc;
    el('bestAccLabel').textContent = t.bestAcc;
    el('avgAccLabel').textContent = t.avgAcc;
    
    // تحديث تسميات إعدادات k-NN
    const knnEnabledLabel = document.querySelector('label[for="knnEnabled"]');
    if (knnEnabledLabel) knnEnabledLabel.textContent = t.knnEnabled;
    
    updateConfidenceLabel();
    updateRoundsCount();
}

// ===== تحديث إعدادات k-NN من الواجهة =====
function updateKNNSettings() {
    state.knnEnabled = el('knnEnabled').checked;
    state.kValue = parseInt(el('kValue').value) || 5;
    state.mValue = parseInt(el('mValue').value) || 3;
    state.knnWeight = parseInt(el('knnWeight').value) || 30;
    
    // تحديث واجهة badge
    const knnBadge = el('knnBadge');
    if (knnBadge) {
        if (state.knnEnabled) {
            knnBadge.classList.remove('disabled');
            knnBadge.textContent = '🧠 k-NN (مفعل)';
        } else {
            knnBadge.classList.add('disabled');
            knnBadge.textContent = '🧠 k-NN (معطل)';
        }
    }
}

// ===== خوارزمية الجيران الأقرب (k-NN) =====
function knnPrediction() {
    if (!state.knnEnabled || state.rounds.length < state.mValue + 1) {
        return null; // لا يمكن التنبؤ
    }
    
    const m = state.mValue;
    const k = state.kValue;
    
    // النمط الحالي (آخر m جولة)
    const currentPattern = state.rounds.slice(-m);
    
    // البحث عن أنماط مطابقة في التاريخ (باستثناء آخر m جولة لأنها غير مكتملة)
    const matches = [];
    for (let i = 0; i <= state.rounds.length - m - 1; i++) {
        const pattern = state.rounds.slice(i, i + m);
        if (pattern.every((val, idx) => val === currentPattern[idx])) {
            // النتيجة التالية بعد هذا النمط
            const next = state.rounds[i + m];
            matches.push(next);
        }
    }
    
    if (matches.length === 0) return null;
    
    // أخذ آخر k نتيجة (الأحدث) أو كلها إذا كان عددها أقل
    const recentMatches = matches.slice(-k);
    
    // حساب التكرارات
    const counts = { P: 0, B: 0, T: 0 };
    recentMatches.forEach(r => counts[r]++);
    
    const total = recentMatches.length;
    return {
        P: (counts.P / total) * 100,
        B: (counts.B / total) * 100,
        T: (counts.T / total) * 100
    };
}

// ===== تحديث نماذج ماركوف عند إضافة جولة جديدة =====
function updateMarkovModels(newRound) {
    const rounds = state.rounds;
    const len = rounds.length;
    if (len < 2) return;
    
    // تحديث transition1 (من الجولة قبل الأخيرة إلى الأخيرة)
    const prev = rounds[len - 2];
    state.transition1[prev][newRound]++;
    
    // تحديث transition2 (من الجولتين قبل الأخيرتين إلى الأخيرة)
    if (len >= 3) {
        const prev2 = rounds[len - 3];
        const key = `${prev2},${prev}`;
        if (state.transition2[key]) {
            state.transition2[key][newRound]++;
        }
    }
}

// ===== التنبؤ باستخدام سلاسل ماركوف =====
function markovPrediction() {
    const rounds = state.rounds;
    const len = rounds.length;
    
    if (len === 0) return null;
    
    // الاحتمالات من الرتبة 1
    let prob1 = null;
    if (len >= 1) {
        const last = rounds[len - 1];
        const trans = state.transition1[last];
        const total = trans.P + trans.B + trans.T;
        if (total > 0) {
            prob1 = {
                P: trans.P / total,
                B: trans.B / total,
                T: trans.T / total
            };
        }
    }
    
    // الاحتمالات من الرتبة 2
    let prob2 = null;
    if (len >= 2) {
        const lastTwo = rounds.slice(-2);
        const key = `${lastTwo[0]},${lastTwo[1]}`;
        const trans = state.transition2[key];
        if (trans) {
            const total = trans.P + trans.B + trans.T;
            if (total > 0) {
                prob2 = {
                    P: trans.P / total,
                    B: trans.B / total,
                    T: trans.T / total
                };
            }
        }
    }
    
    // دمج الاحتمالات (أولوية للرتبة 2)
    if (prob2) {
        return prob2;
    } else if (prob1) {
        return prob1;
    } else {
        return null;
    }
}

// ===== تحليل التردد =====
function frequencyAnalysis(rounds) {
    if (!rounds || !rounds.length) return { P: 33.3, B: 33.3, T: 33.4 };
    
    const counts = { P: 0, B: 0, T: 0 };
    rounds.forEach(x => counts[x]++);
    
    const total = rounds.length;
    return {
        P: (counts.P / total) * 100,
        B: (counts.B / total) * 100,
        T: (counts.T / total) * 100
    };
}

// ===== التنبؤ الموحد =====
function predict() {
    const n = Math.min(state.windowSize, state.rounds.length);
    const recent = state.rounds.slice(-n);
    
    if (recent.length === 0) {
        return {
            P: 33.3, B: 33.3, T: 33.4,
            final: '—',
            confidence: 0,
            probs: { P:33.3, B:33.3, T:33.4 }
        };
    }
    
    // 1. تحليل التردد
    const freq = frequencyAnalysis(recent);
    const sumFreq = freq.P + freq.B + freq.T;
    const normFreq = {
        P: (freq.P / sumFreq) * 100,
        B: (freq.B / sumFreq) * 100,
        T: (freq.T / sumFreq) * 100
    };
    
    // 2. تنبؤ ماركوف
    const markovProbs = markovPrediction();
    const markov = markovProbs ? {
        P: markovProbs.P * 100,
        B: markovProbs.B * 100,
        T: markovProbs.T * 100
    } : null;
    
    // 3. تنبؤ k-NN
    const knnProbs = knnPrediction();
    
    // دمج النتائج حسب الأوزان
    let combined = { P: 0, B: 0, T: 0 };
    let totalWeight = 0;
    
    // وزن التردد (30%)
    const freqWeight = 30;
    combined.P += normFreq.P * freqWeight;
    combined.B += normFreq.B * freqWeight;
    combined.T += normFreq.T * freqWeight;
    totalWeight += freqWeight;
    
    // وزن ماركوف (40%)
    if (markov) {
        const markovWeight = 40;
        combined.P += markov.P * markovWeight;
        combined.B += markov.B * markovWeight;
        combined.T += markov.T * markovWeight;
        totalWeight += markovWeight;
    } else {
        // إذا لم يتوفر ماركوف، نوزع وزنه على التردد
        combined.P += normFreq.P * 40;
        combined.B += normFreq.B * 40;
        combined.T += normFreq.T * 40;
        totalWeight += 40;
    }
    
    // وزن k-NN (قابل للتعديل)
    if (knnProbs && state.knnEnabled) {
        const knnWeight = state.knnWeight;
        combined.P += knnProbs.P * knnWeight;
        combined.B += knnProbs.B * knnWeight;
        combined.T += knnProbs.T * knnWeight;
        totalWeight += knnWeight;
    } else {
        // إذا لم يتوفر k-NN، نوزع وزنه على التردد وماركوف
        const extraWeight = state.knnWeight;
        combined.P += normFreq.P * (extraWeight * 0.4) + (markov ? markov.P * extraWeight * 0.6 : normFreq.P * extraWeight);
        combined.B += normFreq.B * (extraWeight * 0.4) + (markov ? markov.B * extraWeight * 0.6 : normFreq.B * extraWeight);
        combined.T += normFreq.T * (extraWeight * 0.4) + (markov ? markov.T * extraWeight * 0.6 : normFreq.T * extraWeight);
        totalWeight += extraWeight;
    }
    
    // تطبيع النسب
    if (totalWeight > 0) {
        combined.P /= totalWeight;
        combined.B /= totalWeight;
        combined.T /= totalWeight;
    }
    
    // إعادة تطبيع المجموع إلى 100%
    const sumCombined = combined.P + combined.B + combined.T;
    combined = {
        P: (combined.P / sumCombined) * 100,
        B: (combined.B / sumCombined) * 100,
        T: (combined.T / sumCombined) * 100
    };
    
    // تحديد النتيجة المتوقعة
    const entries = Object.entries(combined);
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    const finalPrediction = sorted[0][0];
    const confidence = sorted[0][1] - (sorted[1] ? sorted[1][1] : 0);
    const finalConfidence = Math.min(100, Math.max(0, confidence * 2));
    
    // تخزين احتمالات كل خوارزمية للتقييم
    state.lastAlgoProbs = {
        freq: normFreq,
        markov: markov,
        knn: knnProbs,
        ensemble: combined
    };
    
    if (finalConfidence < state.confidenceThreshold) {
        return {
            P: combined.P.toFixed(1),
            B: combined.B.toFixed(1),
            T: combined.T.toFixed(1),
            final: '—',
            confidence: finalConfidence,
            probs: combined
        };
    }
    
    return {
        P: combined.P.toFixed(1),
        B: combined.B.toFixed(1),
        T: combined.T.toFixed(1),
        final: finalPrediction,
        confidence: finalConfidence,
        probs: combined
    };
}

// ===== تحديث إحصائيات الخوارزميات =====
function updateAlgoStats(actualResult) {
    const last = state.lastAlgoProbs;
    if (!last) return;
    
    // دالة مساعدة لتحديث إحصاءات خوارزمية معينة
    const updateStat = (algo, probs) => {
        if (!probs) return;
        const entries = Object.entries(probs);
        const sorted = entries.sort((a, b) => b[1] - a[1]);
        const prediction = sorted[0][0];
        const isCorrect = prediction === actualResult;
        state.algoStats[algo].total++;
        if (isCorrect) state.algoStats[algo].correct++;
    };
    
    updateStat('freq', last.freq);
    updateStat('markov', last.markov);
    updateStat('knn', last.knn);
    
    // توقع المجمّع (من الدالة predict)
    if (state.lastPrediction && state.lastPrediction !== '—') {
        state.algoStats.ensemble.total++;
        if (state.lastPrediction === actualResult) state.algoStats.ensemble.correct++;
    }
    
    // تحديث العرض
    el('freqAccuracy').textContent = getAlgoAccuracy('freq');
    el('markovAccuracy').textContent = getAlgoAccuracy('markov');
    el('knnAccuracy').textContent = getAlgoAccuracy('knn');
    el('ensembleAccuracy').textContent = getAlgoAccuracy('ensemble');
}

function getAlgoAccuracy(algo) {
    const stats = state.algoStats[algo];
    if (!stats || stats.total === 0) return '0%';
    return ((stats.correct / stats.total) * 100).toFixed(1) + '%';
}

// ===== رسم اللوحة (Big Road) بشكل منظم =====
function renderBigRoad() {
    const canvas = el('bigRoad');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const cellSize = 40;
    const rounds = state.rounds;
    
    if (rounds.length === 0) return;
    
    // بناء الأعمدة: كل عمود يمثل سلسلة متتالية من نفس النتيجة
    let columns = [];
    let currentColumn = [];
    let lastResult = null;
    
    for (let i = 0; i < rounds.length; i++) {
        const r = rounds[i];
        if (lastResult === null) {
            currentColumn = [r];
            columns.push(currentColumn);
        } else {
            if (r === lastResult) {
                currentColumn.push(r);
            } else {
                currentColumn = [r];
                columns.push(currentColumn);
            }
        }
        lastResult = r;
    }
    
    // رسم الأعمدة
    for (let col = 0; col < columns.length; col++) {
        const column = columns[col];
        const x = col * cellSize;
        for (let row = 0; row < column.length; row++) {
            const r = column[row];
            const y = row * cellSize;
            
            ctx.fillStyle = r === 'P' ? '#2980b9' : r === 'B' ? '#c0392b' : '#27ae60';
            ctx.fillRect(x, y, cellSize - 2, cellSize - 2);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 16px Inter';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(r, x + cellSize / 2, y + cellSize / 2);
        }
    }
}

// ===== إضافة جولة جديدة =====
function pushRound(r) {
    if (!['P', 'B', 'T'].includes(r)) return;
    
    // تحديث إعدادات k-NN قبل التوقع
    updateKNNSettings();
    
    const pred = predict();
    state.lastPrediction = pred.final;
    
    state.rounds.push(r);
    state.count[r]++;
    
    updateMarkovModels(r);
    
    if (state.lastPrediction !== '—' && state.lastPrediction !== null) {
        if (r === state.lastPrediction) {
            state.win[state.lastPrediction]++;
        } else {
            state.loss[state.lastPrediction] = (state.loss[state.lastPrediction] || 0) + 1;
        }
    }
    
    // تحديث إحصائيات الخوارزميات
    updateAlgoStats(r);
    
    // تحديث سجل الدقة الكلي
    updateAccuracyData(r);
    
    updateAll();
    showResult(r, pred.final === r);
}

// ===== تراجع =====
function undoRound() {
    if (state.rounds.length === 0) return;
    
    const lastRound = state.rounds.pop();
    state.count[lastRound] = Math.max(0, state.count[lastRound] - 1);
    
    // إعادة بناء نماذج ماركوف
    rebuildMarkovModels();
    
    // تحديث إحصائيات الخوارزميات (لا يمكن التراجع بسهولة، نعيد تعيينها)
    // يمكن إعادة تعيين الإحصائيات أو تركها كما هي، لكن الأسهل إعادة تعيينها
    state.algoStats = {
        freq: { correct: 0, total: 0 },
        markov: { correct: 0, total: 0 },
        knn: { correct: 0, total: 0 },
        ensemble: { correct: 0, total: 0 }
    };
    
    if (state.lastPrediction && state.lastPrediction !== '—') {
        if (lastRound === state.lastPrediction) {
            state.win[state.lastPrediction] = Math.max(0, state.win[state.lastPrediction] - 1);
        } else {
            state.loss[state.lastPrediction] = Math.max(0, (state.loss[state.lastPrediction] || 0) - 1);
        }
    }
    
    if (state.accuracyHistory.length > 0) {
        state.accuracyHistory.pop();
        state.predictionsHistory.pop();
    }
    
    state.lastPrediction = null;
    updateAll();
}

// ===== إعادة بناء نماذج ماركوف =====
function rebuildMarkovModels() {
    state.transition1 = { P: { P: 0, B: 0, T: 0 }, B: { P: 0, B: 0, T: 0 }, T: { P: 0, B: 0, T: 0 } };
    state.transition2 = {
        'P,P': { P: 0, B: 0, T: 0 }, 'P,B': { P: 0, B: 0, T: 0 }, 'P,T': { P: 0, B: 0, T: 0 },
        'B,P': { P: 0, B: 0, T: 0 }, 'B,B': { P: 0, B: 0, T: 0 }, 'B,T': { P: 0, B: 0, T: 0 },
        'T,P': { P: 0, B: 0, T: 0 }, 'T,B': { P: 0, B: 0, T: 0 }, 'T,T': { P: 0, B: 0, T: 0 }
    };
    
    const rounds = state.rounds;
    for (let i = 1; i < rounds.length; i++) {
        const prev = rounds[i-1];
        const curr = rounds[i];
        state.transition1[prev][curr]++;
    }
    for (let i = 2; i < rounds.length; i++) {
        const key = `${rounds[i-2]},${rounds[i-1]}`;
        const curr = rounds[i];
        if (state.transition2[key]) {
            state.transition2[key][curr]++;
        }
    }
}

// ===== إعادة تعيين =====
function resetAll() {
    if (state.rounds.length === 0) return;
    
    if (!confirm(translations[state.currentLang] === 'ar' ? 
        'هل تريد إعادة تعيين جميع البيانات؟' : 
        translations[state.currentLang] === 'en' ? 
        'Do you want to reset all data?' : 
        'Voulez-vous réinitialiser toutes les données?')) {
        return;
    }
    
    state.rounds = [];
    state.count = { P: 0, B: 0, T: 0 };
    state.win = { P: 0, B: 0, T: 0 };
    state.loss = { P: 0, B: 0, T: 0 };
    state.lastPrediction = null;
    state.accuracyHistory = [];
    state.predictionsHistory = [];
    state.previousPredictions = { P: 33.3, B: 33.3, T: 33.4 };
    
    state.algoStats = {
        freq: { correct: 0, total: 0 },
        markov: { correct: 0, total: 0 },
        knn: { correct: 0, total: 0 },
        ensemble: { correct: 0, total: 0 }
    };
    
    rebuildMarkovModels();
    
    updateAll();
}

// ===== تحديث سجل الدقة =====
function updateAccuracyData(actualResult) {
    if (state.lastPrediction && state.lastPrediction !== '—') {
        const isCorrect = state.lastPrediction === actualResult;
        state.predictionsHistory.push({
            prediction: state.lastPrediction,
            correct: isCorrect
        });
        
        const correctCount = state.predictionsHistory.filter(p => p.correct).length;
        const accuracy = (correctCount / state.predictionsHistory.length) * 100;
        state.accuracyHistory.push(accuracy);
    }
}

// ===== تحديث كل شيء =====
function updateAll() {
    renderStats();
    renderBigRoad();
    updatePredictionDisplay();
    updateAccuracyStats();
    updateConfidenceMeter();
    updateRoundsCount();
}

// ===== عرض الإحصاءات =====
function renderStats() {
    el('pTotal').textContent = state.count.P;
    el('bTotal').textContent = state.count.B;
    el('tTotal').textContent = state.count.T;
    
    el('pWin').textContent = state.win.P;
    el('bWin').textContent = state.win.B;
    el('tWin').textContent = state.win.T;
    
    el('pPct').textContent = calculatePercentage(state.win.P, state.loss.P);
    el('bPct').textContent = calculatePercentage(state.win.B, state.loss.B);
    el('tPct').textContent = calculatePercentage(state.win.T, state.loss.T);
}

function calculatePercentage(win, loss) {
    const total = win + loss;
    return total > 0 ? ((win / total) * 100).toFixed(1) + '%' : '0%';
}

// ===== تحديث عرض التنبؤ =====
function updatePredictionDisplay() {
    const pred = predict();
    
    el('predPctP').textContent = pred.P + '%';
    el('predPctB').textContent = pred.B + '%';
    el('predPctT').textContent = pred.T + '%';
    
    ['predP', 'predB', 'predT'].forEach(id => {
        el(id).classList.remove('active');
    });
    
    if (pred.final !== '—') {
        const activeEl = el('pred' + pred.final);
        if (activeEl) activeEl.classList.add('active');
    }
    
    const finalText = pred.final === 'P' ? translations[state.currentLang].player :
                     pred.final === 'B' ? translations[state.currentLang].banker :
                     pred.final === 'T' ? translations[state.currentLang].tie : '—';
    el('finalCard').textContent = finalText;
    
    updateConfidenceValue(pred.confidence);
}

// ===== تحديث مؤشر الثقة =====
function updateConfidenceMeter() {
    const pred = predict();
    updateConfidenceValue(pred.confidence);
}

function updateConfidenceValue(confidence) {
    const fill = el('confidenceFill');
    const value = el('confidenceValue');
    
    if (fill && value) {
        fill.style.width = confidence + '%';
        value.textContent = confidence.toFixed(0) + '%';
    }
    
    updateConfidenceLabel();
}

function updateConfidenceLabel() {
    const pred = predict();
    const confidence = pred.confidence;
    const label = el('confidenceLabel');
    
    if (!label) return;
    
    let text;
    if (confidence >= 70) {
        text = translations[state.currentLang].confidenceHigh;
    } else if (confidence >= 40) {
        text = translations[state.currentLang].confidenceMedium;
    } else {
        text = translations[state.currentLang].confidenceLow;
    }
    
    label.textContent = text;
}

// ===== تحديث إحصاءات الدقة =====
function updateAccuracyStats() {
    if (state.accuracyHistory.length === 0) {
        el('currentAccuracy').textContent = '0%';
        el('bestAccuracy').textContent = '0%';
        el('averageAccuracy').textContent = '0%';
        return;
    }
    
    const current = state.accuracyHistory[state.accuracyHistory.length - 1];
    const best = Math.max(...state.accuracyHistory);
    const avg = state.accuracyHistory.reduce((a, b) => a + b, 0) / state.accuracyHistory.length;
    
    el('currentAccuracy').textContent = current.toFixed(1) + '%';
    el('bestAccuracy').textContent = best.toFixed(1) + '%';
    el('averageAccuracy').textContent = avg.toFixed(1) + '%';
}

// ===== تحديث عداد الجولات =====
function updateRoundsCount() {
    const roundsEl = document.querySelector('#roundsCount');
    if (roundsEl) {
        const t = translations[state.currentLang];
        roundsEl.textContent = `${state.rounds.length} ${t.rounds}`;
    }
}

// ===== تأثير النتيجة =====
function showResult(r, didWin) {
    const finalCard = el('finalCard');
    if (!finalCard) return;
    
    finalCard.classList.remove('win-effect', 'loss-effect');
    setTimeout(() => {
        finalCard.classList.add(didWin ? 'win-effect' : 'loss-effect');
    }, 10);
}

// ===== تبديل الوضع =====
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    el('themeToggle').textContent = newTheme === 'dark' ? '🌙' : '☀️';
}

// ===== التهيئة =====
function init() {
    console.log('Initializing Baccarat with k-NN...');
    
    if (!document.documentElement.hasAttribute('data-theme')) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    el('btnP').onclick = () => pushRound('P');
    el('btnB').onclick = () => pushRound('B');
    el('btnT').onclick = () => pushRound('T');
    el('btnUndo').onclick = undoRound;
    el('btnReset').onclick = resetAll;
    el('themeToggle').onclick = toggleTheme;
    
    el('langAr').onclick = () => setLanguage('ar');
    el('langEn').onclick = () => setLanguage('en');
    el('langFr').onclick = () => setLanguage('fr');
    
    // ربط أحداث إعدادات k-NN
    el('knnEnabled').onchange = updateKNNSettings;
    el('kValue').onchange = updateKNNSettings;
    el('mValue').onchange = updateKNNSettings;
    el('knnWeight').onchange = updateKNNSettings;
    
    setLanguage('ar');
    updateKNNSettings();
    updateAll();
    
    console.log('Initialization complete');
}

window.addEventListener('DOMContentLoaded', init);
