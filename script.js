'use strict';

// ===== إدارة الترجمة =====
const translations = {
    ar: {
        subtitle: 'نظام تنبؤ متعدد الأنماط',
        rounds: 'جولة',
        
        windowTitle: '📊 نافذة التحليل',
        inputTitle: '🎯 إدخال النتائج',
        statsTitle: '📈 الإحصاءات',
        confidenceTitle: '⚡ مؤشر الثقة',
        predTitle: '🔮 توقع الجولة القادمة',
        predSub: 'نمط أساسي + تحليل أنماط',
        accuracyTitle: '📊 دقة التوقعات',
        
        windowLabel: 'عدد الجولات المحللة:',
        windowDesc: 'تحليل آخر 5 جولات بأنماط متقدمة',
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
        
        reason: 'تحليل تردد + أنماط',
        result: 'التوقع:',
        
        // تحليل الأنماط
        patternTitle: '📐 تحليل الأنماط',
        patternDetectedLabel: 'النمط المكتشف:',
        patternConfidenceLabel: 'ثقة النمط:',
        patternPredictionLabel: 'توقع النمط:',
        patternNone: 'لا يوجد نمط',
        
        errorWindow: 'حدث خطأ في النافذة'
    },
    
    en: {
        subtitle: 'Multi-Pattern Prediction System',
        rounds: 'Rounds',
        
        windowTitle: '📊 Analysis Window',
        inputTitle: '🎯 Enter Results',
        statsTitle: '📈 Statistics',
        confidenceTitle: '⚡ Confidence Meter',
        predTitle: '🔮 Next Round Prediction',
        predSub: 'Basic Mode + Pattern Analysis',
        accuracyTitle: '📊 Prediction Accuracy',
        
        windowLabel: 'Rounds analyzed:',
        windowDesc: 'Analyzing last 5 rounds with advanced patterns',
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
        
        reason: 'Frequency + Pattern Analysis',
        result: 'Prediction:',
        
        patternTitle: '📐 Pattern Analysis',
        patternDetectedLabel: 'Detected Pattern:',
        patternConfidenceLabel: 'Pattern Confidence:',
        patternPredictionLabel: 'Pattern Prediction:',
        patternNone: 'No pattern',
        
        errorWindow: 'Window error'
    },
    
    fr: {
        subtitle: 'Système de Prédiction Multi-patrons',
        rounds: 'Tours',
        
        windowTitle: '📊 Fenêtre d\'Analyse',
        inputTitle: '🎯 Saisir les Résultats',
        statsTitle: '📈 Statistiques',
        confidenceTitle: '⚡ Niveau de Confiance',
        predTitle: '🔮 Prédiction Prochain Tour',
        predSub: 'Mode Basique + Analyse de motifs',
        accuracyTitle: '📊 Précision des Prédictions',
        
        windowLabel: 'Tours analysés:',
        windowDesc: 'Analyse des 5 derniers tours avec motifs avancés',
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
        
        reason: 'Fréquence + Analyse de motifs',
        result: 'Prédiction:',
        
        patternTitle: '📐 Analyse de motifs',
        patternDetectedLabel: 'Motif détecté:',
        patternConfidenceLabel: 'Confiance du motif:',
        patternPredictionLabel: 'Prédiction du motif:',
        patternNone: 'Aucun motif',
        
        errorWindow: 'Erreur de fenêtre'
    }
};

// ===== الحالة العامة =====
const state = {
    rounds: [],
    windowSize: 5, // تغيير من 8 إلى 5
    count: { P: 0, B: 0, T: 0 },
    win: { P: 0, B: 0, T: 0 },
    loss: { P: 0, B: 0, T: 0 },
    lastPrediction: null,
    accuracyHistory: [],
    predictionsHistory: [],
    previousPredictions: { P: 33.3, B: 33.3, T: 33.4 },
    currentLang: 'ar',
    confidenceThreshold: 45,
    // متغيرات تحليل الأنماط
    lastPattern: null,
    patternConfidence: 0
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
    
    // تحديث عناصر تحليل الأنماط
    const patternTitle = el('patternTitle');
    if (patternTitle) patternTitle.textContent = t.patternTitle;
    
    const patternDetectedLabel = el('patternDetectedLabel');
    if (patternDetectedLabel) patternDetectedLabel.textContent = t.patternDetectedLabel;
    
    const patternConfidenceLabel = el('patternConfidenceLabel');
    if (patternConfidenceLabel) patternConfidenceLabel.textContent = t.patternConfidenceLabel;
    
    const patternPredictionLabel = el('patternPredictionLabel');
    if (patternPredictionLabel) patternPredictionLabel.textContent = t.patternPredictionLabel;
    
    updateConfidenceLabel();
    updateRoundsCount();
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

// ===== تحليل الأنماط (اكتشاف النمط المتكرر) =====
function detectPatterns(rounds) {
    if (rounds.length < 3) return { pattern: null, next: null, confidence: 0 };
    
    // نأخذ آخر 5 جولات كحد أقصى للتحليل
    const recent = rounds.slice(-5);
    
    // محاولة اكتشاف أنماط بطول 2 أو 3
    let bestPattern = null;
    let bestNext = null;
    let bestConfidence = 0;
    
    // البحث عن أنماط ثنائية (مثل P B P B)
    for (let len = 2; len <= 3; len++) {
        if (recent.length < len * 2) continue;
        
        const pattern = recent.slice(0, len);
        let matches = 0;
        let total = 0;
        
        for (let i = len; i < recent.length - len + 1; i += len) {
            const segment = recent.slice(i, i + len);
            if (segment.length === len) {
                total++;
                let match = true;
                for (let j = 0; j < len; j++) {
                    if (segment[j] !== pattern[j]) {
                        match = false;
                        break;
                    }
                }
                if (match) matches++;
            }
        }
        
        if (total > 0) {
            const confidence = (matches / total) * 100;
            if (confidence > bestConfidence && confidence > 50) {
                bestConfidence = confidence;
                bestPattern = pattern.join(' → ');
                // توقع العنصر التالي بناءً على النمط
                const nextIndex = recent.length % len;
                bestNext = pattern[nextIndex];
            }
        }
    }
    
    // إذا لم نجد نمطاً واضحاً، نبحث عن تكرار بسيط (آخر نتيجتين)
    if (!bestPattern && recent.length >= 2) {
        const lastTwo = recent.slice(-2);
        if (lastTwo[0] === lastTwo[1]) {
            // إذا تكررت النتيجة، نتوقع نفسها
            bestPattern = `${lastTwo[0]} → ${lastTwo[0]}`;
            bestNext = lastTwo[0];
            bestConfidence = 70; // ثقة عالية في التكرار
        } else {
            // إذا اختلفت، نتوقع عكسها (تبادل)
            const opposite = lastTwo[0] === 'P' ? 'B' : lastTwo[0] === 'B' ? 'P' : 'T';
            bestPattern = `${lastTwo[0]} → ${lastTwo[1]}`;
            bestNext = opposite;
            bestConfidence = 60; // ثقة متوسطة في التبادل
        }
    }
    
    return {
        pattern: bestPattern,
        next: bestNext,
        confidence: bestConfidence
    };
}

// ===== التنبؤ الموحد (تردد + أنماط) =====
function predict() {
    const n = Math.min(state.windowSize, state.rounds.length);
    const recent = state.rounds.slice(-n);
    
    if (recent.length === 0) {
        return {
            P: 33.3, B: 33.3, T: 33.4,
            final: '—',
            confidence: 0,
            pattern: null,
            patternNext: null,
            patternConfidence: 0
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
    
    const freqEntries = Object.entries(normalizedFreq);
    const sortedFreq = freqEntries.sort((a, b) => b[1] - a[1]);
    const freqPrediction = sortedFreq[0][0];
    const freqConfidence = sortedFreq[0][1] - (sortedFreq[1] ? sortedFreq[1][1] : 0);
    
    // تحليل الأنماط
    const patternResult = detectPatterns(state.rounds);
    const patternPrediction = patternResult.next;
    const patternConfidence = patternResult.confidence;
    
    // دمج التوقعين (نعطي الأولوية للنمط إذا كانت ثقته أعلى من التردد)
    let finalPrediction = freqPrediction;
    let finalConfidence = freqConfidence * 2; // تحويل إلى مقياس 100
    
    if (patternPrediction && patternConfidence > finalConfidence) {
        finalPrediction = patternPrediction;
        finalConfidence = patternConfidence;
    }
    
    // إذا كانت الثقة منخفضة جداً، نعرض "—"
    if (finalConfidence < state.confidenceThreshold) {
        finalPrediction = '—';
    }
    
    // تخزين آخر نمط للعرض
    state.lastPattern = patternResult.pattern;
    state.patternConfidence = patternConfidence;
    
    return {
        P: normalizedFreq.P.toFixed(1),
        B: normalizedFreq.B.toFixed(1),
        T: normalizedFreq.T.toFixed(1),
        final: finalPrediction,
        confidence: Math.min(100, Math.max(0, finalConfidence)),
        pattern: patternResult.pattern,
        patternNext: patternPrediction,
        patternConfidence: patternConfidence
    };
}

// ===== إضافة جولة جديدة =====
function pushRound(r) {
    if (!['P', 'B', 'T'].includes(r)) return;
    
    const pred = predict();
    state.lastPrediction = pred.final;
    
    state.rounds.push(r);
    state.count[r]++;
    
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
    state.lastPattern = null;
    state.patternConfidence = 0;
    
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
        
        ctx.fillStyle = r === 'P' ? '#3498db' : r === 'B' ? '#e74c3c' : '#2ecc71';
        ctx.fillRect(x * size, y * size, size - 2, size - 2);
        
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
    
    // تحديث معلومات الأنماط
    const patternDetected = el('patternDetected');
    const patternConfidence = el('patternConfidence');
    const patternPrediction = el('patternPrediction');
    
    if (patternDetected) {
        patternDetected.textContent = pred.pattern || translations[state.currentLang].patternNone;
    }
    if (patternConfidence) {
        patternConfidence.textContent = (pred.patternConfidence || 0).toFixed(0) + '%';
    }
    if (patternPrediction) {
        let patternNextText = '—';
        if (pred.patternNext) {
            patternNextText = pred.patternNext === 'P' ? translations[state.currentLang].player :
                             pred.patternNext === 'B' ? translations[state.currentLang].banker :
                             pred.patternNext === 'T' ? translations[state.currentLang].tie : '—';
        }
        patternPrediction.textContent = patternNextText;
    }
    
    updateConfidenceValue(pred.confidence);
}

// ===== مؤشر الثقة =====
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
    console.log('Initializing Baccarat with Pattern Analysis...');
    
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
