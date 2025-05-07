import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Battle from "./battle";
import BottomMenu from "./components/BottomMenu";
import Leaderboard from "./leaderboard";
import Profile from "./profile";

function App() {
  const [user, setUser] = useState(null);
  const [zahar, setZahar] = useState(null);

  useEffect(() => {
    if (window?.Telegram?.WebApp?.initDataUnsafe?.user) {
      setUser(window.Telegram.WebApp.initDataUnsafe.user);
    } else {
      // console.log("Not in Telegram WebApp — using mock user");
      if (!user) {
        setUser({
          id: 123456,
          first_name: "Захар",
          photo_url: "https://placekitten.com/100/100"
        });
      }
    }

    if (window?.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
     
      console.log("=== Telegram WebApp info at start ===");
      console.log("isExpanded:", tg.isExpanded);
      console.log("viewportHeight:", tg.viewportHeight);
      console.log("viewportStableHeight:", tg.viewportStableHeight);

      tg.expand();

      setTimeout(() => {
        console.log("=== Telegram WebApp info after expand() ===");
        console.log("isExpanded:", tg.isExpanded);
        console.log("viewportHeight:", tg.viewportHeight);
        console.log("viewportStableHeight:", tg.viewportStableHeight);
      }, 1000); // ждём секунду чтобы увидеть реальные изменения

      // tg.MainButton.setText('Начать битву за семечки!');
      // tg.MainButton.show();

      // tg.MainButton.onClick(() => {
      //   const newZahar = createRandomZahar(user?.first_name || "Захар");
      //   setZahar(newZahar);
      //   alert(`Ты теперь ${newZahar.name} в ${newZahar.hat} и ${newZahar.glasses}!`);
      // });
    }
  }, [user, setUser]);

  if (!user) return <div>Loading...</div>;

  return (
    <Router>
      <div className="App" style={{ paddingBottom: "60px" }}>
        <Routes>
          <Route path="/" element={<Profile zahar={zahar} setZahar={setZahar} user={user} />} />
          <Route path="/battle" element={<Battle />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
        <BottomMenu />
      </div>
    </Router>
  );
}

export default App;
