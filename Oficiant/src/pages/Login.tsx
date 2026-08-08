type LoginProps = {
  onLogin: () => void;
};

function Login({ onLogin }: LoginProps) {
  return (
    <div className="app">
      <div className="card">
        <h1>☕ Официант</h1>

        <p className="subtitle">
          Обучение и рейтинг персонала
        </p>

        <input placeholder="Логин" />

        <input 
          type="password"
          placeholder="Пароль"
        />

        <button onClick={onLogin}>
          ВОЙТИ
        </button>
      </div>
    </div>
  );
}

export default Login;