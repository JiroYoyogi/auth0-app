# 追加ライブラリインストール

```
npm i react-icons axios express cors express-oauth2-jwt-bearer
```

# いいねボタンのUIを作る

- App.jsx

```jsx
import { useState, useEffect } from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";

function App() {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();
  const [userName, setUserName] = useState('ゲスト');
  const [countLike, setCountLike] = useState(0);

  const doLike = async () => {
    console.log('いいね');
  }

  useEffect(() => {
    if (!isAuthenticated) return;
    setUserName(user.name);
  }, [isAuthenticated, user]);

  // ログインチェック中...
  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <main>
      <p>ようこそ、{userName}さん</p>
      <div className="like">
        <span>{countLike}</span>
        <button className="btn--like" onClick={doLike}>
          <FaHeart color="#E34043" size="32px" />
        </button>
      </div>
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

# いいねAPIを作成する

## ファイル追加

- server.mjs

```js
import express from 'express'
import cors from 'cors';
const app = express();
import { auth, claimIncludes } from 'express-oauth2-jwt-bearer';
const port = process.env.PORT || 8080;

const jwtCheck = auth({
  audience: '',
  issuerBaseURL: '',
  tokenSigningAlg: 'RS256'
});

// CORSを有効
app.use(cors());
// リクエストBodyを取得
app.use(express.json()); 

// 全てのリクエストでjwtのチェックをする
// app.use(jwtCheck);

let dbLikeCount = 0;

app.get('/likes', function (req, res) {
    res.json({
        count: dbLikeCount
    });
});

app.post('/likes', jwtCheck, async function (req, res) {
    dbLikeCount++;
    res.json({
        count: dbLikeCount
    });
});

app.listen(port);
console.log('Running on port ', port);
```

## ファイル変更

- package.json

start-apiのスクリプトを追加する

```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "start-api": "node server.mjs"
  },
```

# いいねの初期値をAPIから取得する

- App.jsx

カウント数を管理

```jsx
const [countLike, setCountLike] = useState(0);
```

ページロードのタイミングでいいね数をAPIからGET

```jsx
  // いいね
  useEffect(() => {
    axios
      .get(`${API_DOMAIN}/likes`)
      .then((r) => {
        if (!r.data.count) return;
        setCountLike(r.data.count);
      });
  }, []);
```

APIのドメインを定義

```jsx
const API_DOMAIN = "http://localhost:8080";
```

# ログインユーザーのみいいね出来る

- Auth.jsx

audienceの値を追加

```jsx
    <Auth0Provider
      domain=""
      clientId=""
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "http://localhost:8080",
      }}
    >
      <App />
    </Auth0Provider>
```

- App.jsx

アクセストークンを取得する関数を読み込む

```jsx
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();
```

アクセストークンの状態を管理

```jsx
const [accessToken, setAccessToken] = useState("");
```

アクセストークンを取得して保存

```jsx
  // アクセストークン
  useEffect(() => {
    if (!isAuthenticated) return;
    getAccessTokenSilently().then((res) => {
      console.log(res);
      setAccessToken(res);
    });
  }, [isAuthenticated, getAccessTokenSilently]);
```

アクセストークンをヘッダーに入れる

```jsx
  const doLike = async () => {
    const res = await axios.post(`${API_DOMAIN}/likes`, {}, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log(res);
    setCountLike(res.data.count);
  }
```