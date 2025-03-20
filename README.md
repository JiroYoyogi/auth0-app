# ライブラリインストール

```
npm install @auth0/auth0-react
```

# 不要ファイルを削除

- App.css

# ファイル追加

- Auth.jsx

```jsx
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

function Auth() {
  return (
    <Auth0Provider
      domain="自分のドメイン"
      clientId="自分のclientId"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <App />
    </Auth0Provider>
  );
}

export default Auth;
```

# ファイル内容変更

- App.jsx

```jsx
import { useState, useEffect } from 'react'
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();
  const [userName, setUserName] = useState('ゲスト');

  useEffect(() => {
    if (!isAuthenticated) return;
    setUserName(user.name);
  }, [isAuthenticated, user]);

  // ログインチェック中...
  // if (isLoading) {
  //   return <div>Loading ...</div>;
  // }

  return (
    <main>
      <p>ようこそ、{userName}さん</p>
      {
        isAuthenticated ? (
          <>
            <button className='btn--logout' onClick={logout}>ログアウト</button>
          </>
        ) : (
          <button className='btn--login' onClick={loginWithRedirect}>ログイン</button>
        )
      }
    </main>
  )
}

export default App
```

- main.jsx

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Auth from './Auth.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth />
  </StrictMode>,
)
```

- index.css

```
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  outline: none;
}

body {
  background-color: #282C36;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

button {
  width: 180px;
  padding: 8px 0;
  border: none;
  color: #fff;
  cursor: pointer;
}

.like {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 16px;

}
.like span {
  font-size: 32px;
}

.like .btn--like {
  width: auto;
  padding: 0;
  background: none;
}

.btn--rankup {
  background-color: #F6AE54;
}

.btn--logout {
  background-color: #E34043;
}
.btn--login {
  background-color: #405BE3;
}

```