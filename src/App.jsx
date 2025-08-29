import React, { useState, useEffect } from "react";
import "./App.css";

// Фон: положите файл с ИМЕНЕМ ровно "android_reseized.png" в папку public/
const BG_IMAGE = "/android_reseized.png";

const App = () => {
  const [votes, setVotes] = useState([]);
  const [userVote, setUserVote] = useState({
    emotionality: 5,   // Эмоциональность
    masculinity: 5,    // Мужественность
    sexuality: 5,      // Сексуальность
    intellect: 5,      // Интеллект
    athleticism: 5,    // Атлетичность
    decisiveness: 5,   // Решительность
  });
  const [showResults, setShowResults] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const [userResult, setUserResult] = useState(null);

  // Параметры и метки для UI
  const parameters = [
    { name: "Эмоциональность", key: "emotionality" },
    { name: "Мужественность", key: "masculinity" },
    { name: "Сексуальность", key: "sexuality" },
    { name: "Интеллект", key: "intellect" },
    { name: "Атлетичность", key: "athleticism" },
    { name: "Решительность", key: "decisiveness" },
  ];

  // Определение типа (амплуа)
  // Подбираем веса под новую логику:
  // - "интеллектуал": упор на интеллект, немного на эмоции и решительность
  // - "решала": решительность + мужественность, чуть интеллект/сексуальность
  // - "спортик": атлетичность + мужественность, плюс немного сексуальности
  const determineType = (v) => {
    const scores = {
      "интеллектуал": v.intellect * 0.5 + v.emotionality * 0.2 + v.decisiveness * 0.2 + v.masculinity * 0.1,
      "решала":       v.decisiveness * 0.45 + v.masculinity * 0.35 + v.intellect * 0.1 + v.sexuality * 0.1,
      "спортик":      v.athleticism * 0.5 + v.masculinity * 0.3 + v.sexuality * 0.2,
    };
    const max = Math.max(...Object.values(scores));
    return Object.keys(scores).find((k) => scores[k] === max);
  };

  const handleInputChange = (key, value) => {
    setUserVote((prev) => ({ ...prev, [key]: parseInt(value) }));
  };

  const handleSubmitVote = () => {
    const result = determineType(userVote);
    setUserResult(result);
    setVotes((prev) => [...prev, { ...userVote, type: result }]);
    setShowResults(true);
  };

  const calculateFinalResult = () => {
    if (votes.length === 0) return null;
    const counts = { "интеллектуал": 0, "решала": 0, "спортик": 0 };
    votes.forEach((v) => (counts[v.type] += 1));
    const max = Math.max(...Object.values(counts));
    return Object.keys(counts).find((k) => counts[k] === max);
  };

  useEffect(() => {
    if (showResults && votes.length > 0) {
      setFinalResult(calculateFinalResult());
    }
  }, [votes, showResults]);

  return (
    <div
      className="page-bg"
      style={{ backgroundImage: `url('${BG_IMAGE}')` }}
    >
      <div className="wrap">
        <div className="card">
          <header className="card-header">
            <h1 className="title">
              Добро пожаловать в Humanitas Engineering
              <br />
              <span className="subtitle">Создайте своего идеального партнёра</span>
            </h1>
            <p className="lead">Выберите значения для каждого параметра от 1 до 10.</p>
          </header>

          <section className="sliders">
            {parameters.map((p) => (
              <div key={p.key} className="slider-row">
                <label className="slider-label" htmlFor={p.key}>{p.name}</label>
                <div className="slider-control">
                  <input
                    id={p.key}
                    type="range"
                    min="1"
                    max="10"
                    value={userVote[p.key]}
                    onChange={(e) => handleInputChange(p.key, e.target.value)}
                  />
                  <span className="slider-value">{userVote[p.key]}</span>
                </div>
              </div>
            ))}
          </section>

          {!showResults ? (
            <button className="submit-btn" onClick={handleSubmitVote}>
              Отправить голос
            </button>
          ) : (
            <section className="results">
              <div className="result-box green">
                <h3>Ваш результат:</h3>
                <p className="result-text">{userResult}</p>
              </div>
              {finalResult && (
                <div className="result-box blue">
                  <h3>Финальный результат:</h3>
                  <p className="result-text">{finalResult}</p>
                  <p className="muted">Определено на основе голосов {votes.length} участников</p>
                </div>
              )}
            </section>
          )}
        </div>

        <p className="footnote">Голосование проходит анонимно</p>
      </div>
    </div>
  );
};

export default App;
