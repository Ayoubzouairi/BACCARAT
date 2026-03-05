'use strict';

// ===== إدارة الترجمة =====
const translations = {
    ar: {
        // عام
        subtitle: 'نظام تنبؤ بسيط وفعال',
        rounds: 'جولة',
        
        // العناوين
        windowTitle: '📊 نافذة التحليل',
        inputTitle: '🎯 إدخال النتائج',
        statsTitle: '📈 الإحصاءات',
        confidenceTitle: '⚡ مؤشر الثقة',
        predTitle: '🔮 توقع الجولة القادمة',
        predSub: 'نمط أساسي - تحليل تردد بسيط',
        accuracyTitle: '📊 دقة التوقعات',
        
        // التسميات
        windowLabel: 'عدد الجولات المحللة:',
        windowDesc: 'تحليل آخر 8 جولات بنمط أساسي',
        statsTeam: 'الجهة',
        statsTotal: 'المجموع',
        statsWin: 'فوز',
        statsPct: 'نسبة %',
        
        // الأزرار
        btnP: '🔵 لاعب',
        btnB: '🔴 مصرفي',
        btnT: '🟢 تعادل',
        btnUndo: '↩️ تراجع',
        btnReset: '🔄 إعادة تعيين',
        
        // النتائج
        player: 'لاعب',
        banker: 'مصرفي',
        tie: 'تعادل',
        
        // مؤشر الثقة
        confidenceLow: 'منخفضة',
        confidenceMedium: 'متوسطة',
        confidenceHigh: 'عالية',
        
        // دقة التوقعات
        currentAcc: 'الحالية',
        bestAcc: 'أفضل',
        avgAcc: 'المتوسط',
        
        // أسباب التنبؤ
        reason: 'تحليل تردد آخر 8 جولات',
        result: 'التوقع:',
        
        // أخطاء
        errorWindow: 'حدث خطأ في النافذة'
    },
    
    en: {
        subtitle: 'Simple & Effective Prediction System',
        rounds: 'Rounds',
        
        windowTitle: '📊 Analysis Window',
        inputTitle: '🎯 Enter Results',
        statsTitle: '📈 Statistics',
        confidenceTitle: '⚡ Confidence Meter',
        predTitle: '🔮 Next Round Prediction',
        predSub: 'Basic Mode - Simple Frequency Analysis',
        accuracyTitle: '📊 Prediction Accuracy',
        
        windowLabel: 'Rounds analyzed:',
        windowDesc: 'Analyzing last 8 rounds in basic mode',
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
        
        reason: 'Analyzing last 8 rounds frequency',
        result: 'Prediction:',
        
        errorWindow: 'Window error'
    },
    
    fr: {
        subtitle: 'Système de Prédiction Simple et Efficace',
        rounds: 'Tours',
        
        windowTitle: '📊 Fenêtre d\'Analyse',
        inputTitle: '🎯 Saisir les Résultats',
        statsTitle: '📈 Statistiques',
        confidenceTitle: '⚡ Niveau de Confiance',
        predTitle: '🔮 Prédiction Prochain Tour',
        predSub: 'Mode Basique - Analyse de Fréquence Simple',
        accuracyTitle: '📊 Précision des Prédictions',
        
        windowLabel: 'Tours analysés:',
        windowDesc: 'Analyse des 8 derniers tours en mode basique',
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
        
        reason: 'Analyse de fréquence des 8 derniers tours',
        result: 'Prédiction:',
        
        errorWindow: 'Erreur de fenêtre'
    }
};

// ===== الحالة العامة =====
const state = {
    rounds: [],
    windowSize: 8,
    count: { P: 0, B: 0, T: 0 },
    win: { P: 0, B: 0, T: 0 },
    loss: { P: 0, B: 0, T: 0 },
    lastPrediction: null,
    accuracyHistory: [],
    predictionsHistory: [],
    previousPredictions: { P: 33.3, B: 33.3, T: 33.4 },
    currentLang: 'ar',
    confidenceThreshold: 45
};

// ===== الوظائف المساعدة =====
const el = id => document.getElementById(id);

// ===== الترجمة =====
function setLanguage(lang) {
    if (!translations[lang]) return;
    
    state.currentLang = lang;
    const t = translations[lang];
    
    // تحديث أزرار اللغة
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    el(`lang${lang.charAt(0).toUpperCase() + lang.slice(1)}`).classList.add('active');
    
    // تحديث النصوص
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
    
    // تحديث مؤشر الثقة
    updateConfidenceLabel();
    
    // تحديث عداد الجولات
    updateRoundsCount();
}

// ===== تحليل التردد (النمط الأساسي فقط) =====
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

// ===== التنبؤ (نمط أساسي فقط) =====
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
    
    const prediction = frequencyAnalysis(recent);
    
    // تطبيع النسب
    const sum = prediction.P + prediction.B + prediction.T;
    const normalized = {
        P: (prediction.P / sum) * 100,
        B: (prediction.B / sum) * 100,
        T: (prediction.T / sum) * 100
    };
    
    // تحديد النتيجة المتوقعة
    const entries = Object.entries(normalized);
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    
    // حساب الثقة
    const confidence = sorted[0][1] - (sorted[1] ? sorted[1][1] : 0);
    let final = sorted[0][0];
    
    if (sorted[0][1] < state.confidenceThreshold) {
        final = '—';
    }
    
    return {
        P: normalized.P.toFixed(1),
        B: normalized.B.toFixed(1),
        T: normalized.T.toFixed(1),
        final,
        confidence: Math.min(100, Math.max(0, confidence * 2))
    };
}

// ===== إضافة جولة جديدة =====
function pushRound(r) {
    if (!['P', 'B', 'T'].includes(r)) return;
    
    const pred = predict();
    state.lastPrediction = pred.final;
    
    state.rounds.push(r);
    state.count[r]++;
    
    // تحديث الإحصاءات
    if (state.lastPrediction !== '—' && state.lastPrediction !== null) {
        if (r === state.lastPrediction) {
            state.win[state.lastPrediction]++;
        } else {
            state.loss[state.lastPrediction] = (state.loss[state.lastPrediction] || 0) + 1;
        }
    }
    
    // تحديث سجل الدقة
    updateAccuracyData(r);
    
    // تحديث الواجهة
    updateAll();
    
    // تأثير بصري
    showResult(r, pred.final === r);
}

// ===== تراجع =====
function undoRound() {
    if (state.rounds.length === 0) return;
    
    const lastRound = state.rounds.pop();
    state.count[lastRound] = Math.max(0, state.count[lastRound] - 1);
    
    // تحديث الإحصاءات
    if (state.lastPrediction && state.lastPrediction !== '—') {
        if (lastRound === state.lastPrediction) {
            state.win[state.lastPrediction] = Math.max(0, state.win[state.lastPrediction] - 1);
        } else {
            state.loss[state.lastPrediction] = Math.max(0, (state.loss[state.lastPrediction] || 0) - 1);
        }
    }
    
    // تحديث سجل الدقة
    if (state.accuracyHistory.length > 0) {
        state.accuracyHistory.pop();
        state.predictionsHistory.pop();
    }
    
    state.lastPrediction = null;
    
    // تحديث الواجهة
    updateAll();
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

// ===== رسم اللوحة =====
function renderBigRoad() {
    const canvas = el('bigRoad');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const size = 35;
    let x = 0, y = 0;
    const maxCols = Math.floor(canvas.width / size);
    
    for (let i = 0; i < state.rounds.length; i++) {
        const r = state.rounds[i];
        
        // لون الخلفية
        ctx.fillStyle = r === 'P' ? '#3498db' : r === 'B' ? '#e74c3c' : '#2ecc71';
        ctx.fillRect(x * size, y * size, size - 2, size - 2);
        
        // رقم الجولة
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((i + 1).toString(), x * size + size / 2, y * size + size / 2);
        
        y++;
        if (y * size >= canvas.height) {
            y = 0;
            x++;
            if (x >= maxCols) break;
        }
    }
}

// ===== تحديث عرض التنبؤ =====
function updatePredictionDisplay() {
    const pred = predict();
    
    el('predPctP').textContent = pred.P + '%';
    el('predPctB').textContent = pred.B + '%';
    el('predPctT').textContent = pred.T + '%';
    
    // تحديث البطاقة النشطة
    ['predP', 'predB', 'predT'].forEach(id => {
        el(id).classList.remove('active');
    });
    
    if (pred.final !== '—') {
        const activeEl = el('pred' + pred.final);
        if (activeEl) activeEl.classList.add('active');
    }
    
    // تحديث النتيجة النهائية
    const finalText = pred.final === 'P' ? translations[state.currentLang].player :
                     pred.final === 'B' ? translations[state.currentLang].banker :
                     pred.final === 'T' ? translations[state.currentLang].tie : '—';
    el('finalCard').textContent = finalText;
    
    // تحديث الثقة
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
    console.log('Initializing Baccarat...');
    
    // تعيين الوضع الافتراضي
    if (!document.documentElement.hasAttribute('data-theme')) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // ربط الأزرار
    el('btnP').onclick = () => pushRound('P');
    el('btnB').onclick = () => pushRound('B');
    el('btnT').onclick = () => pushRound('T');
    el('btnUndo').onclick = undoRound;
    el('btnReset').onclick = resetAll;
    el('themeToggle').onclick = toggleTheme;
    
    // ربط أزرار اللغة
    el('langAr').onclick = () => setLanguage('ar');
    el('langEn').onclick = () => setLanguage('en');
    el('langFr').onclick = () => setLanguage('fr');
    
    // تعيين اللغة الافتراضية
    setLanguage('ar');
    
    // تحديث الواجهة
    updateAll();
    
    console.log('Initialization complete');
}

// بدء التشغيل
window.addEventListener('DOMContentLoaded', init);
