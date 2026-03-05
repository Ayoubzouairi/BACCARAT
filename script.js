'use strict';

// ===== إدارة الترجمة =====
const translations = {
    ar: {
        subtitle: 'نظام تنبؤ ذكي بسلاسل ماركوف',
        rounds: 'جولة',
        
        windowTitle: '📊 نافذة التحليل',
        inputTitle: '🎯 إدخال النتائج',
        statsTitle: '📈 الإحصاءات',
        confidenceTitle: '⚡ مؤشر الثقة',
        predTitle: '🔮 توقع الجولة القادمة',
        predSub: 'تردد + ماركوف (AI)',
        accuracyTitle: '📊 دقة التوقعات',
        
        windowLabel: 'عدد الجولات المحللة:',
        windowDesc: 'تحليل آخر 5 جولات + خوارزمية ماركوف',
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
        
        reason: 'تردد + نموذج ماركوف',
        result: 'التوقع النهائي:',
        
        errorWindow: 'حدث خطأ في النافذة'
    },
    
    en: {
        subtitle: 'Smart Markov Chain Prediction',
        rounds: 'Rounds',
        
        windowTitle: '📊 Analysis Window',
        inputTitle: '🎯 Enter Results',
        statsTitle: '📈 Statistics',
        confidenceTitle: '⚡ Confidence Meter',
        predTitle: '🔮 Next Round Prediction',
        predSub: 'Frequency + Markov (AI)',
        accuracyTitle: '📊 Prediction Accuracy',
        
        windowLabel: 'Rounds analyzed:',
        windowDesc: 'Last 5 rounds + Markov algorithm',
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
        
        reason: 'Frequency + Markov Model',
        result: 'Final Prediction:',
        
        errorWindow: 'Window error'
    },
    
    fr: {
        subtitle: 'Prédiction intelligente par chaîne de Markov',
        rounds: 'Tours',
        
        windowTitle: '📊 Fenêtre d\'Analyse',
        inputTitle: '🎯 Saisir les Résultats',
        statsTitle: '📈 Statistiques',
        confidenceTitle: '⚡ Niveau de Confiance',
        predTitle: '🔮 Prédiction Prochain Tour',
        predSub: 'Fréquence + Markov (IA)',
        accuracyTitle: '📊 Précision des Prédictions',
        
        windowLabel: 'Tours analysés:',
        windowDesc: '5 derniers tours + algorithme de Markov',
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
        
        reason: 'Fréquence + Modèle de Markov',
        result: 'Prédiction finale:',
        
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
    previousPredictions: { P: 33.3, B: 33.3, T: 33.4 },
    currentLang: 'ar',
    confidenceThreshold: 45,
    // مصفوفات الانتقال لسلاسل ماركوف (رتبة 1 و 2)
    transition1: { // من نتيجة إلى أخرى
        P: { P: 0, B: 0, T: 0 },
        B: { P: 0, B: 0, T: 0 },
        T: { P: 0, B: 0, T: 0 }
    },
    transition2: { // من زوج نتائج إلى نتيجة تالية
        'P,P': { P: 0, B: 0, T: 0 },
        'P,B': { P: 0, B: 0, T: 0 },
        'P,T': { P: 0, B: 0, T: 0 },
        'B,P': { P: 0, B: 0, T: 0 },
        'B,B': { P: 0, B: 0, T: 0 },
        'B,T': { P: 0, B: 0, T: 0 },
        'T,P': { P: 0, B: 0, T: 0 },
        'T,B': { P: 0, B: 0, T: 0 },
        'T,T': { P: 0, B: 0, T: 0 }
    }
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
    
    updateConfidenceLabel();
    updateRoundsCount();
}

// ===== تحديث مصفوفات ماركوف عند إضافة جولة جديدة =====
function updateMarkovModels(newRound) {
    const rounds = state.rounds;
    const len = rounds.length;
    if (len < 2) return; // لا يمكن تحديث الانتقالات إلا بعد وجود جولتين
    
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
    
    if (len === 0) return null; // لا بيانات
    
    // الاحتمالات من الرتبة 1 (إذا توفرت)
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
    
    // الاحتمالات من الرتبة 2 (إذا توفرت)
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
    
    // دمج الاحتمالات (وزن أكبر للرتبة 2 إذا وجدت)
    if (prob2) {
        return prob2; // نستخدم الرتبة 2 لأنها أكثر دقة
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

// ===== التنبؤ الموحد (تردد + ماركوف) =====
function predict() {
    const n = Math.min(state.windowSize, state.rounds.length);
    const recent = state.rounds.slice(-n);
    
    if (recent.length === 0) {
        return {
            P: 33.3, B: 33.3, T: 33.4,
            final: '—',
            confidence: 0
        };
    }
    
    // تحليل التردد
    const freq = frequencyAnalysis(recent);
    const sum = freq.P + freq.B + freq.T;
    const normalizedFreq = {
        P: (freq.P / sum) * 100,
        B: (freq.B / sum) * 100,
        T: (freq.T / sum) * 100
    };
    
    // تنبؤ ماركوف
    const markovProbs = markovPrediction();
    let combined = { ...normalizedFreq };
    
    if (markovProbs) {
        // دمج بنسبة 60% ماركوف + 40% تردد
        combined = {
            P: 0.6 * markovProbs.P * 100 + 0.4 * normalizedFreq.P,
            B: 0.6 * markovProbs.B * 100 + 0.4 * normalizedFreq.B,
            T: 0.6 * markovProbs.T * 100 + 0.4 * normalizedFreq.T
        };
    }
    
    // تطبيع المجموع إلى 100%
    const total = combined.P + combined.B + combined.T;
    combined = {
        P: (combined.P / total) * 100,
        B: (combined.B / total) * 100,
        T: (combined.T / total) * 100
    };
    
    // تحديد النتيجة المتوقعة (أعلى نسبة)
    const entries = Object.entries(combined);
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    const finalPrediction = sorted[0][0];
    const confidence = sorted[0][1] - (sorted[1] ? sorted[1][1] : 0);
    
    // تحويل الثقة إلى مقياس 100 مع حد أدنى
    let finalConfidence = Math.min(100, Math.max(0, confidence * 1.8));
    
    if (finalConfidence < state.confidenceThreshold) {
        return {
            P: combined.P.toFixed(1),
            B: combined.B.toFixed(1),
            T: combined.T.toFixed(1),
            final: '—',
            confidence: finalConfidence
        };
    }
    
    return {
        P: combined.P.toFixed(1),
        B: combined.B.toFixed(1),
        T: combined.T.toFixed(1),
        final: finalPrediction,
        confidence: finalConfidence
    };
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
    
    const pred = predict();
    state.lastPrediction = pred.final;
    
    state.rounds.push(r);
    state.count[r]++;
    
    // تحديث نماذج ماركوف
    updateMarkovModels(r);
    
    if (state.lastPrediction !== '—' && state.lastPrediction !== null) {
        if (r === state.lastPrediction) {
            state.win[state.lastPrediction]++;
        } else {
            state.loss[state.lastPrediction] = (state.loss[state.lastPrediction] || 0) + 1;
        }
    }
    
    updateAccuracyData(r);
    updateAll();
    showResult(r, pred.final === r);
}

// ===== تراجع =====
function undoRound() {
    if (state.rounds.length === 0) return;
    
    const lastRound = state.rounds.pop();
    state.count[lastRound] = Math.max(0, state.count[lastRound] - 1);
    
    // ملاحظة: لا يمكن التراجع عن تحديث نماذج ماركوف بسهولة، لذلك نعيد بناءها من الصفر
    rebuildMarkovModels();
    
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

// ===== إعادة بناء نماذج ماركوف من الجولات الحالية =====
function rebuildMarkovModels() {
    // إعادة تعيين المصفوفات
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
    
    // إعادة تعيين نماذج ماركوف
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
    console.log('Initializing Baccarat with AI Markov Model...');
    
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
    
    setLanguage('ar');
    updateAll();
    
    console.log('Initialization complete');
}

window.addEventListener('DOMContentLoaded', init);
