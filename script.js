@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');

/* ===== المتغيرات المحسنة ===== */
:root {
    --gold: #d4af37;
    --gold-light: #f1c40f;
    --gold-dark: #b8860b;
    --bg-dark: #0a0f1e;
    --bg-light: #f4f7fb;
    --card-dark: #16213e;
    --card-light: #ffffff;
    --text-dark: #ecf0f1;
    --text-light: #2c3e50;
    --muted-dark: #95a5a6;
    --muted-light: #7f8c8d;
    --player: #2980b9;
    --player-light: #3498db;
    --banker: #c0392b;
    --banker-light: #e74c3c;
    --tie: #27ae60;
    --tie-light: #2ecc71;
    --border-radius: 20px;
    --transition: all 0.25s ease;
}

/* الوضع الليلي (افتراضي) */
:root {
    --bg: var(--bg-dark);
    --card-bg: var(--card-dark);
    --text: var(--text-dark);
    --muted: var(--muted-dark);
    --border: rgba(212, 175, 55, 0.25);
}

/* الوضع النهاري */
:root[data-theme="light"] {
    --bg: var(--bg-light);
    --card-bg: var(--card-light);
    --text: var(--text-light);
    --muted: var(--muted-light);
    --border: rgba(0, 0, 0, 0.1);
}

/* ===== القواعد العامة ===== */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Inter', sans-serif;
    background: var(--bg);
    color: var(--text);
    padding: 20px;
    min-height: 100vh;
    transition: var(--transition);
}

.app {
    max-width: 1200px;
    margin: 0 auto;
}

/* ===== البطاقات ===== */
.card {
    background: var(--card-bg);
    border-radius: var(--border-radius);
    padding: 22px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
    border: 1px solid var(--border);
    margin-bottom: 18px;
    transition: var(--transition);
    backdrop-filter: blur(5px);
}

:root[data-theme="light"] .card {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* ===== التخطيط ===== */
.layout {
    display: flex;
    gap: 22px;
    flex-wrap: wrap;
}

.left {
    width: 350px;
    min-width: 300px;
    flex: 1;
}

.right {
    flex: 2;
    min-width: 300px;
}

/* ===== الرأس ===== */
.top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 15px;
    background: linear-gradient(145deg, var(--card-bg), rgba(0,0,0,0.3));
}

.logo {
    font-size: 1.7rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--gold), var(--gold-light));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.badge-ai {
    background: linear-gradient(135deg, #6c5ce7, #a463f5);
    color: white;
    padding: 5px 14px;
    border-radius: 30px;
    font-size: 0.8rem;
    font-weight: 700;
    margin-left: 10px;
    box-shadow: 0 2px 8px rgba(108, 92, 231, 0.5);
}

.subtitle {
    color: var(--muted);
    font-size: 0.95rem;
    margin-top: 6px;
    font-weight: 300;
}

/* ===== أزرار اللغة ===== */
.language-selector {
    display: flex;
    gap: 6px;
    background: rgba(255, 255, 255, 0.08);
    padding: 5px;
    border-radius: 40px;
}

.lang-btn {
    background: transparent;
    border: none;
    font-size: 1.3rem;
    padding: 8px 14px;
    border-radius: 30px;
    cursor: pointer;
    transition: var(--transition);
    opacity: 0.7;
}

.lang-btn.active {
    background: rgba(255, 255, 255, 0.2);
    opacity: 1;
    transform: scale(1.1);
    box-shadow: 0 0 10px var(--gold);
}

/* ===== الأزرار الرئيسية ===== */
.btn {
    padding: 14px 22px;
    border: none;
    border-radius: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    font-size: 1rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    letter-spacing: 0.3px;
}

.btn:hover {
    transform: translateY(-3px);
    filter: brightness(1.1);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.btn.gold {
    background: linear-gradient(135deg, var(--gold), var(--gold-dark));
    color: #1a1a1a;
    font-weight: 700;
}

.btn.player {
    background: linear-gradient(145deg, var(--player), var(--player-light));
    color: white;
    flex: 1;
    border: 1px solid rgba(255,255,255,0.2);
}

.btn.banker {
    background: linear-gradient(145deg, var(--banker), var(--banker-light));
    color: white;
    flex: 1;
    border: 1px solid rgba(255,255,255,0.2);
}

.btn.tie {
    background: linear-gradient(145deg, var(--tie), var(--tie-light));
    color: white;
    flex: 1;
    border: 1px solid rgba(255,255,255,0.2);
}

.undo-btn {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text);
    border: 1px solid var(--border);
    width: 100%;
    backdrop-filter: blur(5px);
}

.theme-toggle {
    background: rgba(255, 255, 255, 0.05);
    border: none;
    font-size: 1.8rem;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.theme-toggle:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: rotate(20deg);
}

/* ===== عناصر التحكم ===== */
.controls {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
}

.row {
    display: flex;
    gap: 12px;
    margin: 12px 0;
}

.section-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--gold);
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 2px solid var(--border);
    padding-bottom: 8px;
}

/* ===== معلومات ===== */
.info-box {
    background: rgba(255, 255, 255, 0.05);
    padding: 16px;
    border-radius: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.info-label {
    color: var(--muted);
    font-size: 0.95rem;
}

.info-value {
    font-size: 1.7rem;
    font-weight: 800;
    color: var(--gold);
    text-shadow: 0 0 10px rgba(212,175,55,0.5);
}

/* ===== الجدول ===== */
.stat-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
}

.stat-table th,
.stat-table td {
    padding: 14px 8px;
    text-align: center;
    border-bottom: 1px solid var(--border);
}

.stat-table th {
    color: var(--muted);
    font-weight: 600;
    background: rgba(0,0,0,0.1);
}

.player {
    color: var(--player-light);
    font-weight: 700;
}

.banker {
    color: var(--banker-light);
    font-weight: 700;
}

.tie {
    color: var(--tie-light);
    font-weight: 700;
}

/* ===== مؤشر الثقة ===== */
.confidence-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.confidence-label {
    color: var(--muted);
    font-size: 0.95rem;
}

.confidence-value {
    font-size: 1.6rem;
    font-weight: 800;
    color: var(--gold);
}

.confidence-meter {
    height: 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: inset 0 2px 5px rgba(0,0,0,0.3);
}

.confidence-fill {
    height: 100%;
    background: linear-gradient(90deg, #e74c3c, #f39c12, #2ecc71);
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 10px;
}

/* ===== حاوية اللوحة مع تمرير أفقي ===== */
.canvas-container {
    overflow-x: auto;
    overflow-y: hidden;
    margin: 18px 0;
    border-radius: 16px;
    background: rgba(0, 0, 0, 0.25);
    white-space: nowrap;
    padding: 5px;
}

canvas {
    display: block;
    background: rgba(10, 20, 30, 0.5);
    border-radius: 12px;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
}

:root[data-theme="light"] canvas {
    background: rgba(220, 230, 240, 0.8);
}

/* ===== بطاقات التوقع ===== */
.prediction-cards {
    display: flex;
    gap: 18px;
    margin: 22px 0;
    flex-wrap: wrap;
}

.pred-card {
    flex: 1;
    min-width: 110px;
    padding: 22px 12px;
    border-radius: 20px;
    text-align: center;
    transition: var(--transition);
    cursor: pointer;
    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.1);
}

.pred-card.player {
    background: linear-gradient(145deg, var(--player), #1f4f7a);
}

.pred-card.banker {
    background: linear-gradient(145deg, var(--banker), #8b2c1d);
}

.pred-card.tie {
    background: linear-gradient(145deg, var(--tie), #1d6b3c);
}

.pred-card.active {
    transform: scale(1.08);
    box-shadow: 0 0 0 4px var(--gold), 0 15px 30px black;
}

.pred-emoji {
    font-size: 2.3rem;
    margin-bottom: 12px;
    filter: drop-shadow(0 4px 6px black);
}

.pred-label {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 8px;
}

.pred-value {
    font-size: 1.7rem;
    font-weight: 800;
    text-shadow: 0 2px 5px black;
}

/* ===== وسائل الإيضاح ===== */
.color-legend {
    display: flex;
    gap: 22px;
    justify-content: center;
    margin: 18px 0;
    flex-wrap: wrap;
}

.color-legend span {
    padding: 8px 18px;
    border-radius: 30px;
    font-weight: 600;
    box-shadow: 0 5px 12px rgba(0,0,0,0.3);
}

.legend-player {
    background: linear-gradient(145deg, var(--player), var(--player-light));
    color: white;
}

.legend-banker {
    background: linear-gradient(145deg, var(--banker), var(--banker-light));
    color: white;
}

.legend-tie {
    background: linear-gradient(145deg, var(--tie), var(--tie-light));
    color: white;
}

/* ===== نتيجة التحليل ===== */
.analysis-result {
    text-align: center;
    padding: 22px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    backdrop-filter: blur(10px);
}

.result-label {
    color: var(--muted);
    font-size: 0.95rem;
    margin-bottom: 6px;
}

.final {
    font-size: 3rem;
    font-weight: 800;
    margin: 12px 0 8px;
    color: var(--gold);
    text-shadow: 0 0 20px rgba(212,175,55,0.7);
}

.ai-badge {
    display: inline-block;
    background: linear-gradient(135deg, #6c5ce7, #a463f5);
    color: white;
    padding: 5px 18px;
    border-radius: 30px;
    font-size: 0.85rem;
    font-weight: 600;
    margin-top: 8px;
    box-shadow: 0 4px 12px rgba(108,92,231,0.6);
}

/* ===== إحصاءات الدقة ===== */
.accuracy-stats {
    display: flex;
    gap: 22px;
    justify-content: space-around;
    text-align: center;
    flex-wrap: wrap;
}

.accuracy-stats > div {
    flex: 1;
    min-width: 110px;
    background: rgba(0,0,0,0.1);
    padding: 12px;
    border-radius: 16px;
}

.accuracy-label {
    color: var(--muted);
    font-size: 0.9rem;
    margin-bottom: 6px;
}

.accuracy-value {
    font-size: 1.8rem;
    font-weight: 800;
    color: var(--gold);
}

/* ===== التذييل ===== */
.foot {
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0,0,0,0.3);
}

.credits {
    color: var(--muted);
    font-size: 0.95rem;
    display: flex;
    gap: 12px;
    align-items: center;
}

/* ===== التأثيرات ===== */
.win-effect {
    animation: winPulse 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.loss-effect {
    animation: lossShake 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes winPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); filter: brightness(1.3); }
}

@keyframes lossShake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
}

/* ===== التجاوب مع الشاشات ===== */
@media (max-width: 768px) {
    .layout {
        flex-direction: column;
    }
    
    .left, .right {
        width: 100%;
    }
    
    .prediction-cards {
        flex-direction: column;
    }
    
    .pred-card {
        width: 100%;
    }
    
    .controls {
        justify-content: center;
    }
}

@media (max-width: 480px) {
    body {
        padding: 12px;
    }
    
    .card {
        padding: 18px;
    }
    
    .logo {
        font-size: 1.3rem;
    }
    
    .final {
        font-size: 2.4rem;
    }
}
