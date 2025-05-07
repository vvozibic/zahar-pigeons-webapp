import style from '../app.module.css';


function Profile({ zahar, setZahar, user }) {
  const createRandomPigeons = (count = 4) => {
    const names = ["Степан", "Марфа", "Пафнутий", "Кеша", "Гоша", "Гертруда", "Фома"];
    const traits = ["Наглый", "Быстрый", "Хитрый", "Ленивый", "Отважный"];
  
    const randomFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const pigeons = [];
  
    for (let i = 0; i < count; i++) {
      pigeons.push({
        name: randomFromArray(names),
        power: Math.floor(Math.random() * 5) + 1, // от 1 до 5
        trait: randomFromArray(traits)
      });
    }
  
    return pigeons;
  };

  const createRandomZahar = (userName) => {
    const hats = ["Шапка-ушанка", "Кепка", "Берет", "Панама", "Бандана"];
    const glasses = ["Очки в сердечках", "Солидные очки", "Нет очков"];
    const emotions = ["😎", "😲", "😂", "🤔"];
    const greetings = [
      "Семечки спасут мир!",
      "Полетели к лавке!",
      "Голуби в атаку!",
      "Сегодня мы не делим семечки!",
      "Вижу лавку — вижу цель."
    ];
    const randomFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];
  
    return {
      name: userName,
      hat: randomFromArray(hats),
      glasses: randomFromArray(glasses),
      emotion: randomFromArray(emotions),
      greeting: randomFromArray(greetings),
      seeds: 50,
      pigeons: createRandomPigeons(4) // Генерируем 4 голубя
    };
  };

  if (!user) return <div>Loading...</div>;

  // if (!zahar) {
  //   return (
  //     <div style={{ textAlign: "center", padding: "20px" }}>
  //       <h1>Создай своего Захара!</h1>
  //       <button onClick={() => {
  //         const hats = ["Шапка-ушанка", "Кепка", "Берет", "Панама", "Бандана"];
  //         const glasses = ["Очки в сердечках", "Солидные очки", "Нет очков"];
  //         const emotions = ["😎", "😲", "😐", "😂", "🤔"];
  //         const greetings = [
  //           "Семечки спасут мир!",
  //           "Полетели к лавке!",
  //           "Голуби в атаку!",
  //           "Сегодня мы не делим семечки!",
  //           "Вижу лавку — вижу цель."
  //         ];
  //         const randomFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

  //         setZahar({
  //           name: user.first_name || "Захар",
  //           hat: randomFromArray(hats),
  //           glasses: randomFromArray(glasses),
  //           emotion: randomFromArray(emotions),
  //           greeting: randomFromArray(greetings),
  //           seeds: 50,
  //           pigeons: []
  //         });
  //       }}>
  //         🎩 Создать Захара
  //       </button>
  //     </div>
  //   );
  // }

console.log(user, zahar);

  return (
  <div className={style.main}>
      {!zahar && (
        <>
          <h1>Привет, {user.first_name}!</h1>
          {/* <img src={user.photo_url} alt="avatar" style={{ width: 100, borderRadius: "50%" }} /> */}
          <p>Готов к битве за семечки?</p>
        </>
      )}

      {!zahar ? (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h1>Создай своего Захара!</h1>
          <button
            style={{ fontSize: "18px", padding: "10px 20px", marginTop: "20px" }}
            onClick={() => {
              const newZahar = createRandomZahar(user?.first_name || "Захар");
              setZahar(newZahar);
            }}
          >
            🎩 Создать Захара
          </button>
        </div>
      ) : (
        <div className={style.zahar}>
          <h2>Твой Захар:</h2>
          <p>{zahar.name} {zahar.emotion}</p>
          <p>Головной убор: {zahar.hat}</p>
          <p>{zahar.glasses !== "Нет очков" ? zahar.glasses : "Без очков"}</p>
          <p>Фраза: "{zahar.greeting}"</p>
          <p>Семечки: {zahar.seeds} 🌰</p>

          <h3>Твоя стая:</h3>
          <ul>
            {zahar.pigeons.map((pigeon, index) => (
              <li key={index}>
                🕊 {pigeon.name} — Сила: {pigeon.power} — {pigeon.trait}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Profile;
