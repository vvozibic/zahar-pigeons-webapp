import { useState } from 'react';
import style from '../app.module.css';
import ActiveScreen from './active';

function Battle() {
  const [active, setActive] = useState(false)

  return active ? <ActiveScreen /> :
    <div className={style.main}>
      <h1>Битва за семечки!</h1>
      <p>Тут скоро появится выбор точки и отправка голубей!</p>
      <button onClick={() => setActive(true)}>В бой!</button>
    </div>
}

export default Battle;
