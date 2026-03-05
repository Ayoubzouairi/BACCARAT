/**
 * AYOUB BACCARAT PRO - النسخة الكاملة
 * نظام تنبؤ ذكي مع خوارزميات تعلم آلة وحفظ تلقائي
 * @version 3.0
 * @author Ayoub
 */

'use strict';

// ========== فئات وخوارزميات تعلم الآلة ==========

class SimpleKNN {
    constructor(k = 3) {
        this.k = k;
        this.trainingData = [];
        this.predictions = { correct: 0, total: 0 };
    }

    train(features, labels) {
        if (!features?.length || !labels?.length) return;

        features.forEach((f, i) => {
            if (f && labels[i]) {
                this.trainingData.push({ features: f, label: labels[i] });
            }
        });

        // الحفاظ على حجم معقول
        if (this.trainingData.length > 100) {
            this.trainingData = this.trainingData.slice(-100);
        }
    }

    predict(newFeatures) {
        if (!newFeatures || this.trainingData.length === 0) {
            return { P: 33.3, B: 33.3, T: 33.3 };
        }

        try {
            const distances = this.trainingData.map(dataPoint => ({
                distance: this.euclideanDistance(newFeatures, dataPoint.features),
                label: dataPoint.label
            }));

            distances.sort((a, b) => a.distance - b.distance);
            const nearestNeighbors = distances.slice(0, this.k);

            const votes = { P: 0, B: 0, T: 0 };
            nearestNeighbors.forEach(n => {
                if (n.label in votes) {
                    votes[n.label] += 1 / (n.distance + 1);
                }
            });

            const total = votes.P + votes.B + votes.T;
            if (total === 0) return { P: 33.3, B: 33.3, T: 33.3 };

            return {
                P: (votes.P / total) * 100,
                B: (votes.B / total) * 100,
                T: (votes.T / total) * 100
            };
        } catch (e) {
            console.error('KNN prediction error:', e);
            return { P: 33.3, B: 33.3, T: 33.3 };
        }
    }

    euclideanDistance(a, b) {
        if (!a || !b || a.length !== b.length) return 1000;
        return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
    }

    updateAccuracy(prediction, actual) {
        this.predictions.total++;
        if (prediction === actual) this.predictions.correct++;
    }

    getAccuracy() {
        return this.predictions.total > 0 ?
            (this.predictions.correct / this.predictions.total) * 100 : 0;
    }
}

class SimpleLogisticRegression {
    constructor() {
        this.weights = { P: 0.1, B: 0.1, T: 0.1 };
        this.bias = 0;
        this.learningRate = 0.05;
        this.predictions = { correct: 0, total: 0 };
    }

    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    trainOne(features, label) {
        if (!features?.length || !label) return;

        try {
            const labelNum = { P: 0, B: 1, T: 2 }[label];
            if (labelNum === undefined) return;

            const score = features[0] * this.weights.P +
                features[1] * this.weights.B +
                features[2] * this.weights.T + this.bias;
            const prediction = this.sigmoid(score);
            const error = (labelNum / 2) - prediction;

            this.weights.P += this.learningRate * error * features[0];
            this.weights.B += this.learningRate * error * features[1];
            this.weights.T += this.learningRate * error * features[2];
            this.bias += this.learningRate * error;
        } catch (e) {
            console.error('Logistic regression training error:', e);
        }
    }

    predict(features) {
        if (!features?.length) {
            return { P: 33.3, B: 33.3, T: 33.3 };
        }

        try {
            const pScore = this.sigmoid(features[0] * this.weights.P + this.bias);
            const bScore = this.sigmoid(features[1] * this.weights.B + this.bias);
            const tScore = this.sigmoid(features[2] * this.weights.T + this.bias);

            const total = pScore + bScore + tScore;
            if (total === 0) return { P: 33.3, B: 33.3, T: 33.3 };

            return {
                P: (pScore / total) * 100,
                B: (bScore / total) * 100,
                T: (tScore / total) * 100
            };
        } catch (e) {
            console.error('Logistic regression prediction error:', e);
            return { P: 33.3, B: 33.3, T: 33.3 };
        }
    }

    updateAccuracy(prediction, actual) {
        this.predictions.total++;
        if (prediction === actual) this.predictions.correct++;
    }

    getAccuracy() {
        return this.predictions.total > 0 ?
            (this.predictions.correct / this.predictions.total) * 100 : 0;
    }
}

class EnsembleModel {
    constructor() {
        this.models = {
            knn: new SimpleKNN(5),
            logistic: new SimpleLogisticRegression()
        };
        this.weights = { knn: 0.5, logistic: 0.5 };
        this.predictions = { correct: 0, total: 0 };
    }

    train(features, label) {
        if (!features || !label) return;

        try {
            this.models.knn.train([features], [label]);
            this.models.logistic.trainOne(features, label);

            const knnAcc = this.models.knn.getAccuracy();
            const logisticAcc = this.models.logistic.getAccuracy();

            const totalAcc = knnAcc + logisticAcc;
            if (totalAcc > 0) {
                this.weights.knn = knnAcc / totalAcc;
                this.weights.logistic = logisticAcc / totalAcc;
            }
        } catch (e) {
            console.error('Ensemble training error:', e);
        }
    }

    predict(features) {
        if (!features) return { P: 33.3, B: 33.3, T: 33.3 };

        try {
            const knnPred = this.models.knn.predict(features);
            const logisticPred = this.models.logistic.predict(features);

            return {
                P: (knnPred.P * this.weights.knn + logisticPred.P * this.weights.logistic),
                B: (knnPred.B * this.weights.knn + logisticPred.B * this.weights.logistic),
                T: (knnPred.T * this.weights.knn + logisticPred.T * this.weights.logistic)
            };
        } catch (e) {
            console.error('Ensemble prediction error:', e);
            return { P: 33.3, B: 33.3, T: 33.3 };
        }
    }

    updateAccuracy(prediction, actual) {
        this.predictions.total++;
        if (prediction === actual) this.predictions.correct++;

        this.models.knn.updateAccuracy(prediction, actual);
        this.models.logistic.updateAccuracy(prediction, actual);
    }

    getAccuracy() {
        return this.predictions.total > 0 ?
            (this.predictions.correct / this.predictions.total) * 100 : 0;
    }
}

class BaccaratMachineLearning {
    constructor() {
        this.models = {
            knn: new SimpleKNN(5),
            logistic: new SimpleLogisticRegression(),
            ensemble: new EnsembleModel()
        };
        this.activeModel = 'ensemble';
        this.featureHistory = [];
        this.mlPredictions = [];
        this.isEnabled = true;
    }

    extractFeatures(rounds, windowSize) {
        if (!rounds?.length || rounds.length < windowSize) return null;

        try {
            const recent = rounds.slice(-windowSize);
            const pRatio = recent.filter(r => r === 'P').length / windowSize;
            const bRatio = recent.filter(r => r === 'B').length / windowSize;
            const tRatio = recent.filter(r => r === 'T').length / windowSize;

            let pStreak = 0, bStreak = 0;
            for (let i = recent.length - 1; i >= 0; i--) {
                if (recent[i] === 'P') pStreak++;
                else break;
            }
            for (let i = recent.length - 1; i >= 0; i--) {
                if (recent[i] === 'B') bStreak++;
                else break;
            }

            const volatility = this.calculateVolatility(recent);
            const patternType = this.getPatternType(recent);

            return [
                pRatio, bRatio, tRatio,
                pStreak / windowSize,
                bStreak / windowSize,
                recent[recent.length - 1] === recent[recent.length - 2] ? 1 : 0,
                volatility,
                patternType
            ];
        } catch (e) {
            console.error('Feature extraction error:', e);
            return null;
        }
    }

    calculateVolatility(rounds) {
        if (rounds.length < 2) return 0;
        let changes = 0;
        for (let i = 1; i < rounds.length; i++) {
            if (rounds[i] !== rounds[i - 1]) changes++;
        }
        return changes / (rounds.length - 1);
    }

    getPatternType(rounds) {
        if (rounds.length < 3) return 0;
        const lastThree = rounds.slice(-3);
        if (lastThree[0] === lastThree[1] && lastThree[1] === lastThree[2]) return 1;
        if (lastThree[0] !== lastThree[1] && lastThree[1] !== lastThree[2]) return 2;
        return 0;
    }

    updateModel(rounds, windowSize, actualResult) {
        if (!this.isEnabled || !rounds || !actualResult) return;

        const features = this.extractFeatures(rounds, windowSize);
        if (!features) return;

        try {
            this.featureHistory.push({ features, label: actualResult, timestamp: Date.now() });

            if (this.featureHistory.length > 100) {
                this.featureHistory = this.featureHistory.slice(-100);
            }

            if (this.featureHistory.length > 5) {
                const trainingBatch = this.featureHistory.slice(-10);

                trainingBatch.forEach(({ features, label }) => {
                    if (features && label) {
                        this.models.knn.train([features], [label]);
                        this.models.logistic.trainOne(features, label);
                        this.models.ensemble.train(features, label);
                    }
                });
            }
        } catch (e) {
            console.error('ML update error:', e);
        }
    }

    predict(rounds, windowSize) {
        if (!this.isEnabled || !rounds?.length || rounds.length < windowSize) {
            return null;
        }

        const features = this.extractFeatures(rounds, windowSize);
        if (!features) return null;

        try {
            let prediction;
            switch (this.activeModel) {
                case 'knn':
                    prediction = this.models.knn.predict(features);
                    break;
                case 'logistic':
                    prediction = this.models.logistic.predict(features);
                    break;
                case 'ensemble':
                default:
                    prediction = this.models.ensemble.predict(features);
                    break;
            }

            if (prediction) {
                this.mlPredictions.push({
                    features,
                    prediction: this.getPredictedClass(prediction),
                    timestamp: Date.now()
                });

                if (this.mlPredictions.length > 50) {
                    this.mlPredictions = this.mlPredictions.slice(-50);
                }
            }

            return prediction;
        } catch (e) {
            console.error('ML prediction error:', e);
            return null;
        }
    }

    getPredictedClass(prediction) {
        if (!prediction) return null;
        const entries = Object.entries(prediction);
        if (entries.length === 0) return null;
        return entries.sort((a, b) => b[1] - a[1])[0][0];
    }

    getModelAccuracy(modelName) {
        return this.models[modelName]?.getAccuracy?.() || 0;
    }

    getTrainingDataCount() {
        return this.featureHistory.length;
    }

    getMLWeight() {
        const minWeight = 0.1;
        const maxWeight = 0.6;
        const dataPoints = this.getTrainingDataCount();
        return Math.min(minWeight + (maxWeight - minWeight) * (dataPoints / 100), maxWeight);
    }

    enable() {
        this.isEnabled = true;
    }

    disable() {
        this.isEnabled = false;
    }

    setActiveModel(modelName) {
        if (this.models[modelName]) {
            this.activeModel = modelName;
        }
    }

    reset() {
        this.models = {
            knn: new SimpleKNN(5),
            logistic: new SimpleLogisticRegression(),
            ensemble: new EnsembleModel()
        };
        this.featureHistory = [];
        this.mlPredictions = [];
    }

    getStats() {
        return {
            trainingCount: this.featureHistory.length,
            accuracy: this.getModelAccuracy(this.activeModel),
            weight: this.getMLWeight(),
            isEnabled: this.isEnabled,
            activeModel: this.activeModel
        };
    }
}

// ========== نظام حفظ البيانات ==========

class DataManager {
    constructor(state) {
        this.state = state;
        this.storageKey = 'baccaratPro_v3';
        this.autoSaveInterval = null;
        this.lastSaveTime = null;
        this.isSaving = false;
    }

    saveAllData() {
        if (this.isSaving) return false;

        this.isSaving = true;
        try {
            const saveData = {
                state: {
                    rounds: this.state.rounds,
                    count: this.state.count,
                    win: this.state.win,
                    loss: this.state.loss,
                    windowSize: this.state.windowSize,
                    analysisMode: this.state.analysisMode,
                    confidenceThreshold: this.state.confidenceThreshold,
                    timeWeighting: this.state.timeWeighting,
                    useML: this.state.useML,
                    mlModel: this.state.mlModel,
                    modelPerformance: this.state.modelPerformance,
                    previousPredictions: this.state.previousPredictions,
                    lastPrediction: this.state.lastPrediction
                },
                history: {
                    accuracyHistory: this.state.accuracyHistory,
                    predictionsHistory: this.state.predictionsHistory
                },
                mlData: {
                    featureHistory: this.state.ml.featureHistory,
                    mlPredictions: this.state.ml.mlPredictions,
                    activeModel: this.state.ml.activeModel,
                    isEnabled: this.state.ml.isEnabled
                },
                meta: {
                    version: '3.0',
                    lastSave: new Date().toISOString(),
                    totalRounds: this.state.rounds.length
                }
            };

            localStorage.setItem(this.storageKey, JSON.stringify(saveData));
            this.lastSaveTime = new Date();
            this.updateSaveStatus(true);
            return true;
        } catch (e) {
            console.error('Error saving data:', e);
            this.updateSaveStatus(false, 'خطأ في الحفظ');
            return false;
        } finally {
            this.isSaving = false;
        }
    }

    loadAllData() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (!saved) {
                this.updateSaveStatus(true, 'بدون بيانات سابقة');
                return false;
            }

            const data = JSON.parse(saved);

            // تحميل بيانات الحالة
            if (data.state) {
                this.state.rounds = Array.isArray(data.state.rounds) ? data.state.rounds : [];
                this.state.count = data.state.count || { P: 0, B: 0, T: 0 };
                this.state.win = data.state.win || { P: 0, B: 0, T: 0 };
                this.state.loss = data.state.loss || { P: 0, B: 0, T: 0 };
                this.state.windowSize = data.state.windowSize || 8;
                this.state.analysisMode = data.state.analysisMode || 'advanced';
                this.state.confidenceThreshold = data.state.confidenceThreshold || 45;
                this.state.timeWeighting = data.state.timeWeighting || 'linear';
                this.state.useML = data.state.useML !== false;
                this.state.mlModel = data.state.mlModel || 'ensemble';
                this.state.modelPerformance = data.state.modelPerformance || { basic: 0, advanced: 0, pattern: 0, ml: 0 };
                this.state.previousPredictions = data.state.previousPredictions || { P: 0, B: 0, T: 0 };
                this.state.lastPrediction = data.state.lastPrediction || null;
            }

            // تحميل التاريخ
            if (data.history) {
                this.state.accuracyHistory = Array.isArray(data.history.accuracyHistory) ? data.history.accuracyHistory : [];
                this.state.predictionsHistory = Array.isArray(data.history.predictionsHistory) ? data.history.predictionsHistory : [];
            }

            // تحميل ML
            if (data.mlData) {
                this.state.ml.featureHistory = Array.isArray(data.mlData.featureHistory) ? data.mlData.featureHistory : [];
                this.state.ml.mlPredictions = Array.isArray(data.mlData.mlPredictions) ? data.mlData.mlPredictions : [];
                this.state.ml.activeModel = data.mlData.activeModel || 'ensemble';
                this.state.ml.isEnabled = data.mlData.isEnabled !== false;

                // إعادة تدريب النماذج
                setTimeout(() => {
                    if (this.state.ml.featureHistory.length > 0) {
                        this.state.ml.featureHistory.forEach((item, index) => {
                            if (index > 0 && item.features && item.label) {
                                this.state.ml.models.knn.train([item.features], [item.label]);
                                this.state.ml.models.logistic.trainOne(item.features, item.label);
                                this.state.ml.models.ensemble.train(item.features, item.label);
                            }
                        });
                    }
                }, 500);
            }

            this.lastSaveTime = new Date();
            this.updateSaveStatus(true, 'تم تحميل البيانات');
            return true;
        } catch (e) {
            console.error('Error loading data:', e);
            this.updateSaveStatus(false, 'خطأ في التحميل');
            return false;
        }
    }

    exportData() {
        try {
            const exportData = {
                state: {
                    rounds: this.state.rounds,
                    count: this.state.count,
                    win: this.state.win,
                    loss: this.state.loss,
                    windowSize: this.state.windowSize
                },
                ml: {
                    featureHistory: this.state.ml.featureHistory,
                    trainingCount: this.state.ml.getTrainingDataCount()
                },
                meta: {
                    exportDate: new Date().toISOString(),
                    version: 'AYOUB_BACCARAT_PRO_v3.0',
                    totalRounds: this.state.rounds.length
                }
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `baccarat_data_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);

            alert(`✅ تم تصدير ${this.state.rounds.length} جولة و ${this.state.ml.featureHistory.length} عينة تدريب`);
        } catch (e) {
            alert('❌ خطأ في تصدير البيانات: ' + e.message);
        }
    }

    importData(file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);

                if (!confirm(`هل تريد استيراد ${importedData.state?.rounds?.length || 0} جولة؟\nسيتم مسح البيانات الحالية.`)) {
                    return;
                }

                // مسح البيانات الحالية
                this.resetState();

                // تحميل البيانات المستوردة
                if (importedData.state) {
                    this.state.rounds = Array.isArray(importedData.state.rounds) ? importedData.state.rounds : [];
                    this.state.count = importedData.state.count || { P: 0, B: 0, T: 0 };
                    this.state.win = importedData.state.win || { P: 0, B: 0, T: 0 };
                    this.state.loss = importedData.state.loss || { P: 0, B: 0, T: 0 };
                    this.state.windowSize = importedData.state.windowSize || 8;

                    // حساب الإحصاءات من الجولات
                    this.state.rounds.forEach(round => {
                        this.state.count[round]++;
                    });
                }

                if (importedData.ml && Array.isArray(importedData.ml.featureHistory)) {
                    this.state.ml.featureHistory = importedData.ml.featureHistory;

                    // إعادة تدريب ML
                    setTimeout(() => {
                        if (this.state.ml.featureHistory.length > 0) {
                            this.state.ml.featureHistory.forEach((item, index) => {
                                if (index > 0 && item.features && item.label) {
                                    this.state.ml.models.knn.train([item.features], [item.label]);
                                    this.state.ml.models.logistic.trainOne(item.features, item.label);
                                    this.state.ml.models.ensemble.train(item.features, item.label);
                                }
                            });
                        }
                    }, 500);
                }

                // تحديث الواجهة
                window.updateAll();
                window.updateMLStatus?.();
                this.saveAllData();

                alert(`✅ تم استيراد ${this.state.rounds.length} جولة بنجاح!`);
            } catch (error) {
                alert('❌ خطأ في تنسيق الملف: ' + error.message);
            }
        };

        reader.onerror = () => {
            alert('❌ خطأ في قراءة الملف');
        };

        reader.readAsText(file);
    }

    clearAllData() {
        if (confirm('⚠️ هل أنت متأكد من مسح جميع البيانات؟\nلا يمكن التراجع عن هذا الإجراء.')) {
            localStorage.removeItem(this.storageKey);
            this.resetState();
            alert('✅ تم مسح جميع البيانات.');
        }
    }

    resetState() {
        this.state.rounds = [];
        this.state.count = { P: 0, B: 0, T: 0 };
        this.state.win = { P: 0, B: 0, T: 0 };
        this.state.loss = { P: 0, B: 0, T: 0 };
        this.state.lastPrediction = null;
        this.state.accuracyHistory = [];
        this.state.predictionsHistory = [];
        this.state.modelPerformance = { basic: 0, advanced: 0, pattern: 0, ml: 0 };
        this.state.previousPredictions = { P: 0, B: 0, T: 0 };
        this.state.ml.reset();
        window.updateAll();
    }

    startAutoSave(intervalSeconds = 30) {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }

        this.autoSaveInterval = setInterval(() => {
            if (this.state.rounds.length > 0 && !this.isSaving) {
                this.saveAllData();
            }
        }, intervalSeconds * 1000);

        window.addEventListener('beforeunload', () => {
            if (!this.isSaving) {
                this.saveAllData();
            }
        });
    }

    updateSaveStatus(success, message = '') {
        const statusEl = document.getElementById('autoSaveStatus');
        if (statusEl) {
            if (success) {
                const timeStr = this.lastSaveTime ?
                    `💾 آخر حفظ: ${this.lastSaveTime.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}` :
                    '💾 الحفظ التلقائي مفعل';
                statusEl.textContent = message || timeStr;
                statusEl.style.color = '#38b000';
            } else {
                statusEl.textContent = message || '❌ خطأ في الحفظ';
                statusEl.style.color = '#ff006e';
            }
        }
    }

    updateDataStats() {
        const statsEl = document.getElementById('dataStats');
        if (statsEl) {
            statsEl.textContent = `${this.state.rounds.length} جولة • ${this.state.ml.featureHistory.length} عينة تدريب`;
        }
    }
}

// ========== الحالة العامة للتطبيق ==========
const state = {
    rounds: [],
    windowSize: 8,
    count: { P: 0, B: 0, T: 0 },
    win: { P: 0, B: 0, T: 0 },
    loss: { P: 0, B: 0, T: 0 },
    lastPrediction: null,
    accuracyHistory: [],
    predictionsHistory: [],
    analysisMode: 'advanced',
    confidenceThreshold: 45,
    timeWeighting: 'linear',
    modelPerformance: { basic: 0, advanced: 0, pattern: 0, ml: 0 },
    previousPredictions: { P: 0, B: 0, T: 0 },
    ml: new BaccaratMachineLearning(),
    useML: true,
    mlModel: 'ensemble'
};

// إنشاء مدير البيانات وربطه بالحالة
const dataManager = new DataManager(state);

// ========== الوظائف المساعدة ==========
const el = id => document.getElementById(id);

// ========== الوظائف الرئيسية ==========

function init() {
    console.log('Initializing Baccarat Pro...');

    // تحميل البيانات المحفوظة
    dataManager.loadAllData();

    // إعداد عناصر الواجهة
    el('windowSize').value = state.windowSize;

    el('applyWindow').onclick = () => {
        const v = parseInt(el('windowSize').value);
        if (v >= 5 && v <= 15) {
            state.windowSize = v;
            updateAll();
            showToast(`تم تغيير نافذة التحليل إلى ${v} جولات`);
        } else {
            showToast('النافذة يجب أن تكون بين 5 و 15', 'error');
        }
    };

    el('analysisMode').value = state.analysisMode;
    el('analysisMode').onchange = (e) => {
        state.analysisMode = e.target.value;
        updateAll();
        showToast(`تم تغيير نمط التحليل إلى ${getModeName(state.analysisMode)}`);
    };

    el('confidenceSensitivity').value = state.confidenceThreshold;
    el('confidenceSensitivity').oninput = (e) => {
        state.confidenceThreshold = parseInt(e.target.value);
        el('sensitivityValue').textContent = state.confidenceThreshold + '%';
        updateAll();
    };

    el('timeWeighting').value = state.timeWeighting;
    el('timeWeighting').onchange = (e) => {
        state.timeWeighting = e.target.value;
        updateAll();
        showToast(`تم تغيير المرجحة الزمنية إلى ${getWeightingName(state.timeWeighting)}`);
    };

    // إعدادات تعلم الآلة
    el('mlToggle').checked = state.useML;
    el('mlToggle').onchange = (e) => {
        state.useML = e.target.checked;
        state.ml.isEnabled = state.useML;
        updateMLStatus();
        updateAll();
        showToast(`تعلم الآلة ${state.useML ? 'مفعل' : 'معطل'}`);
    };

    el('mlModelSelect').value = state.mlModel;
    el('mlModelSelect').onchange = (e) => {
        state.mlModel = e.target.value;
        state.ml.setActiveModel(state.mlModel);
        updateMLStatus();
        updateAll();
        showToast(`تم تغيير نموذج ML إلى ${getMLModelName(state.mlModel)}`);
    };

    // أزرار الإدخال
    el('btnP').onclick = () => pushRound('P');
    el('btnB').onclick = () => pushRound('B');
    el('btnT').onclick = () => pushRound('T');
    el('btnUndo').onclick = undoRound;
    el('btnReset').onclick = resetAll;

    // أزرار البيانات
    el('btnExport').onclick = () => dataManager.exportData();
    el('btnImport').onclick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            if (e.target.files && e.target.files[0]) {
                dataManager.importData(e.target.files[0]);
            }
        };
        input.click();
    };
    el('btnClearData').onclick = () => dataManager.clearAllData();

    // تبديل الوضع
    el('themeToggle').onclick = toggleTheme;

    // تعيين الوضع الافتراضي
    if (!document.documentElement.hasAttribute('data-theme')) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // بدء الحفظ التلقائي
    dataManager.startAutoSave(30);

    // تحديث الواجهة
    updateAll();
    updateMLStatus();
    dataManager.updateDataStats();

    console.log('Initialization complete');
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    el('themeToggle').textContent = newTheme === 'dark' ? '🌚' : '🌕';
    updateAccuracyChart();
    showToast(`تم التبديل إلى الوضع ${newTheme === 'dark' ? 'الليلي' : 'النهاري'}`);
}

function getModeName(mode) {
    const names = { basic: 'أساسي', advanced: 'متقدم', pattern: 'تحليل الأنماط', ml: 'تعلم الآلة' };
    return names[mode] || mode;
}

function getWeightingName(weighting) {
    const names = { none: 'بدون', linear: 'خطي', exponential: 'أسّي' };
    return names[weighting] || weighting;
}

function getMLModelName(model) {
    const names = { knn: 'K-الجيران الأقرب', logistic: 'الانحدار اللوجستي', ensemble: 'المجمع' };
    return names[model] || model;
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : '#10b981'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (toast.parentNode) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// ========== خوارزميات التحليل ==========

function frequencyAnalysis(rounds) {
    if (!rounds?.length) return { P: 33.3, B: 33.3, T: 33.3 };

    const counts = { P: 0, B: 0, T: 0 };
    rounds.forEach(x => counts[x]++);

    const total = rounds.length;
    return {
        P: (counts.P / total) * 100,
        B: (counts.B / total) * 100,
        T: (counts.T / total) * 100
    };
}

function patternAnalysis(rounds) {
    if (!rounds?.length || rounds.length < 3) return { P: 0, B: 0, T: 0 };

    const patterns = {};
    for (let i = 2; i < rounds.length; i++) {
        const pattern = rounds.slice(i - 2, i).join('');
        const next = rounds[i];

        if (!patterns[pattern]) patterns[pattern] = { P: 0, B: 0, T: 0, total: 0 };
        patterns[pattern][next]++;
        patterns[pattern].total++;
    }

    if (rounds.length >= 2) {
        const lastPattern = rounds.slice(-2).join('');
        const patternData = patterns[lastPattern];

        if (patternData?.total >= 1) {
            return {
                P: (patternData.P / patternData.total) * 100,
                B: (patternData.B / patternData.total) * 100,
                T: (patternData.T / patternData.total) * 100
            };
        }
    }

    return { P: 0, B: 0, T: 0 };
}

function applyTimeWeighting(rounds, basePrediction) {
    if (state.timeWeighting === 'none' || !rounds?.length || rounds.length < 2) {
        return basePrediction;
    }

    const n = rounds.length;
    let weightFactor = 1;

    if (state.timeWeighting === 'linear') {
        weightFactor = 0.8 + (0.4 * (1 / n));
    } else if (state.timeWeighting === 'exponential') {
        weightFactor = 0.7 + (0.6 * Math.pow(0.9, n));
    }

    return {
        P: basePrediction.P * weightFactor,
        B: basePrediction.B * weightFactor,
        T: basePrediction.T * weightFactor
    };
}

function enhancedPredict() {
    const n = Math.min(state.windowSize, state.rounds.length);
    const recent = state.rounds.slice(-n);

    if (recent.length === 0) {
        return {
            P: 33.3, B: 33.3, T: 33.3,
            final: '—',
            confidence: 0,
            model: 'basic',
            mlContribution: 0
        };
    }

    let basePrediction, patternBoost, finalPrediction;
    let modelUsed = state.analysisMode;
    let mlContribution = 0;

    switch (state.analysisMode) {
        case 'basic':
            basePrediction = frequencyAnalysis(recent);
            finalPrediction = basePrediction;
            break;

        case 'advanced':
            basePrediction = frequencyAnalysis(recent);
            patternBoost = patternAnalysis(recent);
            finalPrediction = {
                P: basePrediction.P * 0.7 + patternBoost.P * 0.3,
                B: basePrediction.B * 0.7 + patternBoost.B * 0.3,
                T: basePrediction.T * 0.7 + patternBoost.T * 0.3
            };
            break;

        case 'pattern':
            basePrediction = frequencyAnalysis(recent);
            patternBoost = patternAnalysis(recent);
            finalPrediction = {
                P: basePrediction.P * 0.4 + patternBoost.P * 0.6,
                B: basePrediction.B * 0.4 + patternBoost.B * 0.6,
                T: basePrediction.T * 0.4 + patternBoost.T * 0.6
            };
            break;

        case 'ml':
            basePrediction = frequencyAnalysis(recent);
            const mlPrediction = state.ml.predict(state.rounds, state.windowSize) || { P: 33.3, B: 33.3, T: 33.3 };

            const mlWeight = state.ml.getMLWeight();
            mlContribution = mlWeight * 100;

            finalPrediction = {
                P: basePrediction.P * (1 - mlWeight) + mlPrediction.P * mlWeight,
                B: basePrediction.B * (1 - mlWeight) + mlPrediction.B * mlWeight,
                T: basePrediction.T * (1 - mlWeight) + mlPrediction.T * mlWeight
            };
            break;
    }

    finalPrediction = applyTimeWeighting(recent, finalPrediction);

    const sum = finalPrediction.P + finalPrediction.B + finalPrediction.T;
    if (sum > 0) {
        finalPrediction.P = (finalPrediction.P / sum) * 100;
        finalPrediction.B = (finalPrediction.B / sum) * 100;
        finalPrediction.T = (finalPrediction.T / sum) * 100;
    }

    const sorted = Object.entries(finalPrediction).sort((a, b) => b[1] - a[1]);
    const confidence = sorted[0][1] - (sorted[1]?.[1] || 0);
    let final = sorted[0][0];

    if (sorted[0][1] < state.confidenceThreshold) {
        final = '—';
    }

    return {
        P: finalPrediction.P.toFixed(1),
        B: finalPrediction.B.toFixed(1),
        T: finalPrediction.T.toFixed(1),
        final,
        confidence: Math.min(100, Math.max(0, confidence * 2)),
        model: modelUsed,
        mlContribution: mlContribution.toFixed(1)
    };
}

function pushRound(r) {
    if (!['P', 'B', 'T'].includes(r)) return;

    const pred = enhancedPredict();
    state.lastPrediction = pred.final;

    state.ml.updateModel(state.rounds, state.windowSize, r);

    state.rounds.push(r);
    state.count[r]++;

    if (state.lastPrediction !== '—' && state.lastPrediction !== null) {
        const didWin = (r === state.lastPrediction);

        if (didWin) {
            state.win[state.lastPrediction]++;
            state.modelPerformance[state.analysisMode] = (state.modelPerformance[state.analysisMode] || 0) + 1;
        } else {
            state.loss[state.lastPrediction] = (state.loss[state.lastPrediction] || 0) + 1;
        }
    }

    updateAccuracyData(r);

    const newPred = enhancedPredict();
    updatePredictionDisplay(newPred);
    showResult(r, newPred, state.lastPrediction === r);
    updateAll();
    dataManager.saveAllData();
    dataManager.updateDataStats();

    // إشعار صوتي بسيط
    playSound('click');
}

function undoRound() {
    if (state.rounds.length === 0) return;

    const lastRound = state.rounds.pop();
    state.count[lastRound] = Math.max(0, state.count[lastRound] - 1);

    if (state.rounds.length > 0) {
        const previousPrediction = enhancedPredict();
        if (lastRound === previousPrediction.final) {
            state.win[previousPrediction.final] = Math.max(0, state.win[previousPrediction.final] - 1);
            state.modelPerformance[state.analysisMode] = Math.max(0, state.modelPerformance[state.analysisMode] - 1);
        } else {
            state.loss[previousPrediction.final] = Math.max(0, state.loss[previousPrediction.final] - 1);
        }
    }

    if (state.accuracyHistory.length > 0) {
        state.accuracyHistory.pop();
        state.predictionsHistory.pop();
    }

    state.lastPrediction = null;

    // إعادة تدريب ML مع البيانات المحدثة
    state.ml.reset();
    for (let i = 0; i < state.rounds.length; i++) {
        if (i >= state.windowSize) {
            const recent = state.rounds.slice(i - state.windowSize, i);
            state.ml.updateModel(recent, state.windowSize, state.rounds[i]);
        }
    }

    updateAll();
    dataManager.saveAllData();
    dataManager.updateDataStats();
    playSound('undo');
}

function resetAll() {
    if (state.rounds.length === 0) return;

    if (!confirm('هل تريد إعادة تعيين جميع البيانات؟')) return;

    state.rounds = [];
    state.count = { P: 0, B: 0, T: 0 };
    state.win = { P: 0, B: 0, T: 0 };
    state.loss = { P: 0, B: 0, T: 0 };
    state.lastPrediction = null;
    state.accuracyHistory = [];
    state.predictionsHistory = [];
    state.modelPerformance = { basic: 0, advanced: 0, pattern: 0, ml: 0 };
    state.previousPredictions = { P: 0, B: 0, T: 0 };

    state.ml.reset();

    updateAll();
    dataManager.saveAllData();
    dataManager.updateDataStats();
    playSound('reset');
}

function playSound(type) {
    try {
        if (type === 'click') {
            const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==');
            audio.volume = 0.1;
            audio.play().catch(() => { }); // تجاهل أخطاء التشغيل
        }
    } catch (e) {
        // تجاهل أخطاء الصوت
    }
}

function updatePredictionDisplay(pred) {
    el('predPctP').textContent = pred.P + '%';
    el('predPctB').textContent = pred.B + '%';
    el('predPctT').textContent = pred.T + '%';

    updateTrendIndicators(pred);

    ['predP', 'predB', 'predT'].forEach(id => el(id)?.classList.remove('active'));

    if (pred.final !== '—') {
        const finalEl = el('pred' + pred.final);
        if (finalEl) finalEl.classList.add('active');
    }

    const finalText = pred.final === 'P' ? 'لاعب' : pred.final === 'B' ? 'مصرفي' : pred.final === 'T' ? 'تعادل' : '—';
    el('finalCard').textContent = finalText;

    el('mlContribution').textContent = pred.mlContribution > 0 ?
        `📊 مساهمة تعلم الآلة: ${pred.mlContribution}%` : '';

    updateConfidenceMeter(pred.confidence);
    updateModelInfo(pred);
}

function updateTrendIndicators(pred) {
    const current = {
        P: parseFloat(pred.P) || 0,
        B: parseFloat(pred.B) || 0,
        T: parseFloat(pred.T) || 0
    };
    const previous = state.previousPredictions;

    ['P', 'B', 'T'].forEach(type => {
        const trendEl = el('predTrend' + type);
        if (!trendEl) return;

        if (previous[type] > 0) {
            const diff = current[type] - previous[type];
            if (diff > 2) trendEl.textContent = '↗';
            else if (diff < -2) trendEl.textContent = '↘';
            else trendEl.textContent = '→';
            trendEl.style.color = diff > 0 ? '#38b000' : diff < 0 ? '#ff006e' : '#bfb7a6';
        } else {
            trendEl.textContent = '→';
        }
    });

    state.previousPredictions = current;
}

function updateConfidenceMeter(confidence) {
    const fill = el('confidenceFill');
    const label = el('confidenceLabel');

    if (!fill || !label) return;

    fill.style.width = confidence + '%';

    if (confidence >= 70) {
        fill.className = 'confidence-fill high-confidence';
        label.textContent = 'ثقة عالية';
        label.style.color = '#38b000';
    } else if (confidence >= 40) {
        fill.className = 'confidence-fill medium-confidence';
        label.textContent = 'ثقة متوسطة';
        label.style.color = '#d4af37';
    } else {
        fill.className = 'confidence-fill';
        label.textContent = 'ثقة منخفضة';
        label.style.color = '#ff006e';
    }
}

function updateModelInfo(pred) {
    const modelEl = el('predModel');
    const modelInfoEl = el('modelInfo');
    const reasonEl = el('predictionReason');

    if (!modelEl || !modelInfoEl || !reasonEl) return;

    let modelName, modelClass, reason;

    switch (pred.model) {
        case 'basic':
            modelName = 'أساسي';
            modelClass = 'badge-basic';
            reason = 'يعتمد على تحليل التردد الأساسي';
            break;
        case 'advanced':
            modelName = 'متقدم';
            modelClass = 'badge-advanced';
            reason = 'يجمع بين تحليل التردد والأنماط';
            break;
        case 'pattern':
            modelName = 'الأنماط';
            modelClass = 'badge-pattern';
            reason = 'يركز على تحليل التسلسلات والأنماط';
            break;
        case 'ml':
            modelName = 'تعلم الآلة';
            modelClass = 'badge-ml';
            reason = 'يستخدم خوارزميات ML مع التدريب التلقائي';
            break;
        default:
            modelName = 'أساسي';
            modelClass = 'badge-basic';
            reason = 'يعتمد على تحليل التردد الأساسي';
    }

    modelEl.textContent = modelName;
    modelEl.className = 'model-badge ' + modelClass;

    const efficiency = calculateModelEfficiency();
    modelInfoEl.textContent = `النموذج: ${modelName} - الكفاءة: ${efficiency}%`;

    if (pred.final === '—') {
        reasonEl.textContent = 'عدم كفاية الثقة للتنبؤ (تحت ' + state.confidenceThreshold + '%)';
    } else {
        reasonEl.textContent = reason + ` - الثقة: ${pred.confidence.toFixed(1)}%`;
    }
}

function calculateModelEfficiency() {
    const total = Object.values(state.modelPerformance).reduce((a, b) => a + b, 0);
    const current = state.modelPerformance[state.analysisMode] || 0;
    return total > 0 ? Math.round((current / total) * 100) : 0;
}

function showResult(r, pred, didWin) {
    const finalCard = el('finalCard');
    if (!finalCard) return;

    finalCard.classList.remove('win-effect', 'loss-effect');
    setTimeout(() => {
        finalCard.classList.add(didWin ? 'win-effect' : 'loss-effect');
    }, 10);
}

function updateMLStatus() {
    const trainingCount = state.ml.getTrainingDataCount();
    const mlWeight = state.ml.getMLWeight() * 100;
    const mlAccuracy = state.ml.getModelAccuracy(state.mlModel);

    el('mlTrainingCount').textContent = trainingCount;
    el('mlWeight').textContent = mlWeight.toFixed(0) + '%';
    el('mlAccuracy').textContent = mlAccuracy.toFixed(1) + '%';

    const statusEl = el('mlStatus');
    if (!statusEl) return;

    if (trainingCount < 5) {
        statusEl.innerHTML = '<span class="ml-training-indicator ml-not-trained"></span> يحتاج المزيد من البيانات';
        statusEl.style.color = '#ff006e';
    } else if (trainingCount < 15) {
        statusEl.innerHTML = '<span class="ml-training-indicator ml-training"></span> يتعلم...';
        statusEl.style.color = '#d4af37';
    } else {
        statusEl.innerHTML = '<span class="ml-training-indicator ml-training"></span> جاهز للتنبؤ';
        statusEl.style.color = '#38b000';
    }

    el('mlOverallAccuracy').textContent = mlAccuracy.toFixed(1) + '%';
}

function updateAll() {
    renderStats();
    renderBigRoad();
    updatePredictionCounts();
    updateAccuracyStats();
    updateAccuracyChart();
    updatePatternInfo();
    updateMLStats();
    dataManager.updateDataStats();
}

function updateMLStats() {
    const mlAccuracy = state.ml.getModelAccuracy(state.mlModel);
    el('mlOverallAccuracy').textContent = mlAccuracy.toFixed(1) + '%';

    // تحديث دقة ML لكل نوع (مبسطة)
    el('pMLAccuracy').textContent = (mlAccuracy * 0.9).toFixed(1) + '%';
    el('bMLAccuracy').textContent = (mlAccuracy * 0.95).toFixed(1) + '%';
    el('tMLAccuracy').textContent = (mlAccuracy * 0.7).toFixed(1) + '%';
}

function renderStats() {
    el('pTotal').textContent = state.count.P;
    el('bTotal').textContent = state.count.B;
    el('tTotal').textContent = state.count.T;

    el('pWin').textContent = state.win.P;
    el('bWin').textContent = state.win.B;
    el('tWin').textContent = state.win.T;

    el('pLoss').textContent = state.loss.P;
    el('bLoss').textContent = state.loss.B;
    el('tLoss').textContent = state.loss.T;

    el('pPct').textContent = calculatePercentage(state.win.P, state.loss.P);
    el('bPct').textContent = calculatePercentage(state.win.B, state.loss.B);
    el('tPct').textContent = calculatePercentage(state.win.T, state.loss.T);

    el('pAccuracy').textContent = calculateAccuracy('P');
    el('bAccuracy').textContent = calculateAccuracy('B');
    el('tAccuracy').textContent = calculateAccuracy('T');
}

function calculatePercentage(win, loss) {
    const total = win + loss;
    return total > 0 ? ((win / total) * 100).toFixed(1) + '%' : '0%';
}

function calculateAccuracy(type) {
    const totalPredictions = state.predictionsHistory.filter(p => p.prediction === type).length;
    const correctPredictions = state.predictionsHistory.filter(p => p.prediction === type && p.correct).length;
    return totalPredictions > 0 ? ((correctPredictions / totalPredictions) * 100).toFixed(1) + '%' : '0%';
}

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

        ctx.fillStyle = r === 'P' ? '#3a86ff' : r === 'B' ? '#ff006e' : '#38b000';
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

function updatePredictionCounts() {
    const pred = enhancedPredict();
    updatePredictionDisplay(pred);
}

function updatePatternInfo() {
    const infoEl = el('patternInfo');
    if (!infoEl) return;

    if (state.rounds.length < 3) {
        infoEl.textContent = 'لا توجد أنماط مكتشفة بعد';
        return;
    }

    const trend = calculateTrend(state.rounds);
    const recent = state.rounds.slice(-5);
    const pCount = recent.filter(r => r === 'P').length;
    const bCount = recent.filter(r => r === 'B').length;
    const tCount = recent.filter(r => r === 'T').length;

    let info = `الاتجاه: ${trend.direction === 'volatile' ? 'متقلب' : trend.direction === 'mixed' ? 'مختلط' : 'مستقر'}`;
    info += ` | آخر 5: 🔵${pCount} 🔴${bCount} 🟢${tCount}`;

    infoEl.textContent = info;
}

function calculateTrend(rounds) {
    if (rounds.length < 2) return { direction: 'stable', strength: 0 };

    const changes = [];
    for (let i = 1; i < rounds.length; i++) {
        changes.push(rounds[i] === rounds[i - 1] ? 0 : 1);
    }

    const changeRate = changes.reduce((a, b) => a + b, 0) / changes.length;
    return {
        direction: changeRate > 0.6 ? 'volatile' : changeRate > 0.4 ? 'mixed' : 'stable',
        strength: Math.abs(changeRate - 0.5) * 2
    };
}

function updateAccuracyData(actualResult) {
    if (state.lastPrediction && state.lastPrediction !== '—') {
        const isCorrect = state.lastPrediction === actualResult;
        state.predictionsHistory.push({
            prediction: state.lastPrediction,
            actual: actualResult,
            correct: isCorrect,
            model: state.analysisMode
        });

        const correctPredictions = state.predictionsHistory.filter(p => p.correct).length;
        const totalPredictions = state.predictionsHistory.length;
        const accuracy = totalPredictions > 0 ? (correctPredictions / totalPredictions) * 100 : 0;

        state.accuracyHistory.push(accuracy);
    }
}

function updateAccuracyStats() {
    if (state.accuracyHistory.length === 0) {
        el('currentAccuracy').textContent = '0%';
        el('bestAccuracy').textContent = '0%';
        el('averageAccuracy').textContent = '0%';
        return;
    }

    const currentAccuracy = state.accuracyHistory[state.accuracyHistory.length - 1];
    const bestAccuracy = Math.max(...state.accuracyHistory);
    const averageAccuracy = state.accuracyHistory.reduce((a, b) => a + b, 0) / state.accuracyHistory.length;

    el('currentAccuracy').textContent = currentAccuracy.toFixed(1) + '%';
    el('bestAccuracy').textContent = bestAccuracy.toFixed(1) + '%';
    el('averageAccuracy').textContent = averageAccuracy.toFixed(1) + '%';
}

function updateAccuracyChart() {
    const svg = el('accuracyChart');
    const tooltip = el('accuracyTooltip');
    if (!svg || !tooltip) return;

    svg.innerHTML = '';

    if (state.accuracyHistory.length < 2) return;

    const width = svg.clientWidth || 600;
    const height = svg.clientHeight || 80;
    const padding = 20;

    // رسم الشبكة
    for (let i = 0; i <= 100; i += 20) {
        const y = height - padding - (i / 100) * (height - 2 * padding);
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('class', 'accuracy-grid');
        line.setAttribute('x1', padding);
        line.setAttribute('y1', y);
        line.setAttribute('x2', width - padding);
        line.setAttribute('y2', y);
        svg.appendChild(line);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', padding - 5);
        text.setAttribute('y', y + 4);
        text.setAttribute('text-anchor', 'end');
        text.setAttribute('fill', 'var(--muted)');
        text.setAttribute('font-size', '10px');
        text.textContent = i + '%';
        svg.appendChild(text);
    }

    // رسم الخط
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let pathData = '';

    state.accuracyHistory.forEach((accuracy, index) => {
        const x = padding + (index / (state.accuracyHistory.length - 1)) * (width - 2 * padding);
        const y = height - padding - (accuracy / 100) * (height - 2 * padding);

        if (index === 0) {
            pathData = `M ${x} ${y}`;
        } else {
            pathData += ` L ${x} ${y}`;
        }

        // نقاط تفاعلية
        const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        point.setAttribute('class', 'accuracy-point');
        point.setAttribute('cx', x);
        point.setAttribute('cy', y);
        point.setAttribute('r', 3);

        point.addEventListener('mouseover', (e) => {
            const rect = svg.getBoundingClientRect();
            tooltip.style.left = (e.clientX - rect.left + 10) + 'px';
            tooltip.style.top = (e.clientY - rect.top - 30) + 'px';
            tooltip.textContent = `الجولة ${index + 1}: ${accuracy.toFixed(1)}%`;
            tooltip.style.opacity = '1';
        });

        point.addEventListener('mouseout', () => {
            tooltip.style.opacity = '0';
        });

        svg.appendChild(point);
    });

    path.setAttribute('d', pathData);
    path.setAttribute('class', 'accuracy-line');
    svg.appendChild(path);
}

// جعل بعض الدوال عامة للوصول من DataManager
window.updateAll = updateAll;
window.updateMLStatus = updateMLStatus;

// تهيئة التطبيق عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', init);

// إضافة أنيميشن للتوست
const style = document.createElement('style');
style.textContent = `
@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
@keyframes slideOut {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(100%); opacity: 0; }
}
`;
document.head.appendChild(style);
