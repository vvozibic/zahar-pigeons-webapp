import { useState } from "react";
import styles from "./active.module.css";

const initialMap = {
  id: "map-001",
  name: "Сквер у вокзала",
  currentRound: 1,
  maxRounds: 5,
  points: [
    { id: "p1", name: "Лавка у киоска", position: [10, 20], owner: null, defendingBird: null, attackers: [] },
    { id: "p2", name: "Сквер с фонарём", position: [30, 60], owner: null, defendingBird: null, attackers: [] },
    { id: "p3", name: "Памятник скамейке", position: [60, 40], owner: null, defendingBird: null, attackers: [] },
    { id: "p4", name: "Кусты у дорожки", position: [80, 70], owner: null, defendingBird: null, attackers: [] }
  ]
};

const initialPigeons = [
  { id: "g1", name: "Гертруда", power: 1, trait: "Хитрый" },
  { id: "g2", name: "Пафнутий", power: 1, trait: "Хитрый" },
  { id: "g3", name: "Кеша", power: 2, trait: "Хитрый" },
  { id: "g4", name: "Кеша", power: 1, trait: "Хитрый" },
  { id: "g5", name: "Фома", power: 1, trait: "Ленивый" }
];

function resolveBattle(point) {
  if (point.attackers.length === 0) return point;

  if (point.attackers.length === 1) {
    const { playerId, pigeon } = point.attackers[0];
    return {
      ...point,
      owner: playerId,
      defendingBird: pigeon,
      attackers: []
    };
  }

  const results = point.attackers.map(({ playerId, pigeon }) => ({
    playerId,
    pigeon,
    score: pigeon.power + Math.random() * 2
  }));

  results.sort((a, b) => b.score - a.score);

  const winner = results[0];

  return {
    ...point,
    owner: winner.playerId,
    defendingBird: winner.pigeon,
    attackers: []
  };
}

export default function BattleScreen() {
  const [battleMap, setBattleMap] = useState(initialMap);
  const [pigeons, setPigeons] = useState(initialPigeons);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedPigeon, setSelectedPigeon] = useState(null);
  const [battleEnded, setBattleEnded] = useState(false);

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

    setPigeons(prev => prev.filter(p => p.id !== selectedPigeon.id));
    setSelectedPigeon(null);
    setSelectedPoint(null);
  };

  const handleEndRound = () => {
    setBattleMap(prev => {
      const updatedPoints = prev.points.map(point => resolveBattle(point));
      const nextRound = prev.currentRound + 1;

      if (nextRound > prev.maxRounds) {
        setBattleEnded(true);
      }

      return {
        ...prev,
        points: updatedPoints,
        currentRound: nextRound
      };
    });
  };

  if (battleEnded) {
    const yourPoints = battleMap.points.filter(point => point.owner === "you").length;

    return (
      <div className={styles.container}>
        <h1 className={styles.title}>🏆 Битва завершена!</h1>
        <p className={styles.subheading}>Твои результаты:</p>
        <ul>
          <li>Захвачено точек: {yourPoints}</li>
          <li>Оставшиеся голуби: {pigeons.length}</li>
        </ul>
        <button
          className={styles.sendButton}
          style={{ marginTop: "20px" }}
          onClick={() => {
            setBattleMap(initialMap)
            setBattleEnded(false)
          }}
        >
          Начать заново
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{battleMap.name} — Раунд {battleMap.currentRound}/{battleMap.maxRounds}</h1>

      <div className={styles.grid}>
        {battleMap.points.map(point => (
          <button
            key={point.id}
            className={`${styles.point} ${selectedPoint?.id === point.id ? styles.selected : ''}`}
            onClick={() => setSelectedPoint(point)}
          >
            <strong>{point.name}</strong><br />
            Владелец: {point.owner || "—"}<br />
            Голубей атакует: {point.attackers.length}
          </button>
        ))}
      </div>

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
  );
}
