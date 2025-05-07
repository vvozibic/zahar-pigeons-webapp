import { useState } from "react";
import styles from "./active.module.css";

const initialMap = {
  id: "map-001",
  name: "Сквер у вокзала",
  currentRound: 1,
  maxRounds: 5,
  points: [
    { id: "p1", name: "Лавка у киоска", position: [15, 30], emoji: "🪑", claimedBy: null, attackers: [] },
    { id: "p2", name: "Сквер с фонарём", position: [45, 25], emoji: "💡", claimedBy: null, attackers: [] },
    { id: "p3", name: "Памятник скамейке", position: [65, 60], emoji: "🪑", claimedBy: null, attackers: [] },
    { id: "p4", name: "Кусты у дорожки", position: [85, 70], emoji: "🌿", claimedBy: null, attackers: [] }
  ]
};

const initialPigeons = [
  { id: "g1", name: "Гертруда", power: 1, trait: "Хитрый" },
  { id: "g2", name: "Пафнутий", power: 1, trait: "Хитрый" },
  { id: "g3", name: "Кеша", power: 2, trait: "Хитрый" },
  { id: "g4", name: "Кеша", power: 1, trait: "Хитрый" },
  { id: "g5", name: "Фома", power: 1, trait: "Ленивый" }
];

const initialBotPigeons = [
  { id: "b1", name: "Шумный", power: 2, trait: "Наглый" },
  { id: "b2", name: "Васька", power: 1, trait: "Быстрый" },
  { id: "b3", name: "Булка", power: 3, trait: "Толстый" },
  { id: "b4", name: "Лёнька", power: 2, trait: "Хитрый" }
];

function botAct(points, botPigeons, logs) {
  const updatedPoints = [...points];
  const updatedBotPigeons = [...botPigeons];

  const freePoints = updatedPoints.filter(
    p => !p.attackers.some(a => a.playerId === "bot")
  );

  if (freePoints.length && updatedBotPigeons.length) {
    const target = freePoints[Math.floor(Math.random() * freePoints.length)];
    const pigeon = updatedBotPigeons.shift();
    target.attackers.push({ playerId: "bot", pigeon });
    logs.push(`🤖 Бот отправил голубя "${pigeon.name}" (сила: ${pigeon.power}) на "${target.name}"`);
  }

  return [updatedPoints, updatedBotPigeons];
}

export default function BattleScreen() {
  const [battleMap, setBattleMap] = useState(initialMap);
  const [pigeons, setPigeons] = useState(initialPigeons);
  const [botPigeons, setBotPigeons] = useState(initialBotPigeons);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedPigeon, setSelectedPigeon] = useState(null);
  const [battleEnded, setBattleEnded] = useState(false);
  const [finalMap, setFinalMap] = useState(null);
  const [logs, setLogs] = useState([]);

  const handleSendPigeon = () => {
    if (!selectedPoint || !selectedPigeon) return;

    setBattleMap(prev => ({
      ...prev,
      points: prev.points.map(p => {
        if (p.id === selectedPoint.id) {
          return {
            ...p,
            attackers: [...p.attackers, { playerId: "you", pigeon: selectedPigeon }]
          };
        }
        return p;
      })
    }));

    setLogs(prev => [
      ...prev,
      `🕊 Ты отправил голубя "${selectedPigeon.name}" (сила: ${selectedPigeon.power}) на "${selectedPoint.name}"`
    ]);

    setPigeons(prev => prev.filter(p => p.id !== selectedPigeon.id));
    setSelectedPigeon(null);
    setSelectedPoint(null);
  };

  const handleEndRound = () => {
    const logsCopy = [...logs];
    const [pointsWithBot, updatedBotPigeons] = botAct(battleMap.points, botPigeons, logsCopy);
    setBotPigeons(updatedBotPigeons);
    setLogs(logsCopy);

    setBattleMap(prev => {
      const nextRound = prev.currentRound + 1;

      if (nextRound > prev.maxRounds) {
        const finalizedPoints = pointsWithBot.map(point => {
          const groups = point.attackers.reduce((acc, { playerId, pigeon }) => {
            if (!acc[playerId]) acc[playerId] = [];
            acc[playerId].push(pigeon);
            return acc;
          }, {});

          const sumPower = group => (group || []).reduce((sum, p) => sum + p.power, 0);
          const powerYou = sumPower(groups["you"]);
          const powerBot = sumPower(groups["bot"]);

          let claimedBy = null;
          if (powerYou > powerBot) claimedBy = "you";
          else if (powerBot > powerYou) claimedBy = "bot";
          else claimedBy = Math.random() < 0.5 ? "you" : "bot";

          return { ...point, claimedBy };
        });

        setFinalMap({ ...prev, points: finalizedPoints });
        setBattleEnded(true);
        return prev;
      }

      return {
        ...prev,
        points: pointsWithBot,
        currentRound: nextRound
      };
    });
  };

  if (battleEnded && finalMap) {
    const yourPoints = finalMap.points.filter(point => point.claimedBy === "you").length;
    const botPoints = finalMap.points.filter(point => point.claimedBy === "bot").length;

    return (
      <div className={styles.container}>
        <h1 className={styles.title}>🏁 Битва завершена!</h1>
        <p className={styles.subheading}>Результаты:</p>
        <ul>
          <li>Ты: {yourPoints} точек</li>
          <li>Бот: {botPoints} точек</li>
        </ul>
        <button
          className={styles.sendButton}
          style={{ marginTop: "20px" }}
          onClick={() => window.location.reload()}
        >
          Начать заново
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{battleMap.name} — Раунд {battleMap.currentRound}/{battleMap.maxRounds}</h1>

      <div className={styles.mapArea}>
        {battleMap.points.map(point => (
          <div
            key={point.id}
            className={`${styles.pointIcon} ${selectedPoint?.id === point.id ? styles.selected : ''}`}
            style={{ top: `${point.position[1]}%`, left: `${point.position[0]}%` }}
            onClick={() => setSelectedPoint(point)}
            title={point.name}
          >
            <span style={{ fontSize: '48px' }}>{point.emoji}</span>
          </div>
        ))}
      </div>

      {/* <h2 className={styles.subheading}>Лог боя:</h2>
      <ul className={styles.battleLog}>
        {logs.slice().reverse().map((log, i) => (
          <li key={i}>{log}</li>
        ))}
      </ul> */}

      <div className={styles.pigeonPanel}>
        <h2 className={styles.subheading}>Твоя стая:</h2>
        <div className={styles.pigeonList}>
          {pigeons.map(pigeon => (
            <button
              key={pigeon.id}
              className={`${styles.pigeon} ${selectedPigeon?.id === pigeon.id ? styles.selected : ''}`}
              onClick={() => setSelectedPigeon(pigeon)}
            >
              🕊 {pigeon.name} — Сила: {pigeon.power} — {pigeon.trait}
            </button>
          ))}
        </div>

        <button
          className={styles.sendButton}
          disabled={!selectedPoint || !selectedPigeon}
          onClick={handleSendPigeon}
        >
          Отправить голубя в бой
        </button>

        <button
          className={styles.sendButton}
          style={{ marginTop: "10px", backgroundColor: "#28a745" }}
          onClick={handleEndRound}
        >
          Завершить раунд
        </button>
      </div>
    </div>
  );
}
