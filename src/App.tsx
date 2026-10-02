import { useState, useEffect } from 'react';
import './App.css';

// 상수의 타입을 number로 명시
const WORK_TIME: number = 25 * 60; // 25분 (초 단위)
const BREAK_TIME: number = 5 * 60; // 5분 (초 단위)

function App() {
  // 1. 상태(State) 관리 - 제네릭(<>)을 사용하여 타입을 엄격하게 지정합니다.
  const [timeLeft, setTimeLeft] = useState<number>(WORK_TIME);
  const [isWorking, setIsWorking] = useState<boolean>(true);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // 2. 타이머 1초마다 줄어드는 로직 (useEffect)
  useEffect(() => {
    // ReturnType을 사용해 브라우저와 Node 환경 상관없이 올바른 타이머 ID 타입을 추론합니다.
    let timer: ReturnType<typeof setInterval>;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      setIsWorking((prev) => !prev);
      setTimeLeft(!isWorking ? WORK_TIME : BREAK_TIME);
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isWorking]);

  // 3. 브라우저 탭 제목에 시간 표시
  useEffect(() => {
    const min: string = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const sec: string = String(timeLeft % 60).padStart(2, '0');
    document.title = `${min}:${sec} - 뽀모도로`;
  }, [timeLeft]);

  // 4. 버튼 동작 함수 - 반환값이 없으므로 void 타입을 지정합니다.
  const startTimer = (): void => setIsRunning(true);
  const pauseTimer = (): void => setIsRunning(false);
  const resetTimer = (): void => {
    setIsRunning(false);
    setTimeLeft(isWorking ? WORK_TIME : BREAK_TIME);
  };

  // 5. 화면에 보여줄 시간 형식 계산
  const minutes: string = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds: string = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className={`app-container ${!isWorking ? 'break-mode' : ''}`}>
      <div className="pomodoro-container">
        <h1>{isWorking ? '집중 시간' : '휴식 시간'}</h1>

        <div className="timer-display">
          {minutes}:{seconds}
        </div>

        <div className="controls">
          <button onClick={startTimer} className="btn btn-primary">시작</button>
          <button onClick={pauseTimer} className="btn">일시정지</button>
          <button onClick={resetTimer} className="btn btn-danger">초기화</button>
        </div>
      </div>
    </div>
  );
}

export default App;