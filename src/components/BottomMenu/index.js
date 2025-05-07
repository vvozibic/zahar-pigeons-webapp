import { useNavigate } from "react-router-dom";

function BottomMenu() {
  const navigate = useNavigate();

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      width: "100%",
      background: "rgba(255,255,255,0.8)",
      display: "flex",
      justifyContent: "space-around",
      padding: "10px 0",
      borderTop: "1px solid #ccc",
      zIndex: 10
    }}>
      <button onClick={() => navigate("/")}>Профиль</button>
      <button onClick={() => navigate("/battle")}>Битва</button>
      <button onClick={() => navigate("/leaderboard")}>Лидерборд</button>
    </div>
  );
}

export default BottomMenu;
