# いいねを取り消す（API）

- server.mjs

```js
app.delete('/likes', jwtCheck, async function (req, res) {
    dbLikeCount--;
    res.json({
        count: dbLikeCount
    });
});
```

# いいねを取り消す（フロント）

- App.jsx

アイコンのインポート

```jsx
import { FaHeart, FaHeartBroken } from "react-icons/fa";
```

いいねを取り消す関数

```jsx
  const deleteLike = async () => {
    const res = await axios.delete(`${API_DOMAIN}/likes`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log(res);
    setCountLike(res.data.count);
  }
```

いいねを取り消すボタン

```jsx
      <div className="like">
        <span>{countLike}</span>
        <button className="btn--like" onClick={doLike}>
          <FaHeart color="#E34043" size="32px" />
        </button>
        <button className="btn--like" onClick={deleteLike}>
          <FaHeartBroken color="#FFF" size="32px" />
        </button>
      </div>
```

# Auth0での設定

- APIにpermissionを追加
- トークンにpermissionが含まれるようにする
- Roleを作成する。ユーザーにRoleを追加する

# APIでパーミッションをチェック

- server.mjs

```js
app.delete(
  "/likes",
  jwtCheck,
  claimIncludes("permissions", "delete:like"),
  async function (req, res) {
    dbLikeCount--;
    res.json({
      count: dbLikeCount,
    });
  }
);
```

# ゴールド会員になる

- server.js

APIのパスを作成

```js
app.put("/users/:id/goldmember", async function (req, res) {
  const id = req.params.id;
  // マネジメントAPIのアクセストークンを取得
  const access_token = await getAccessToken();
  // https://auth0.com/docs/api/management/v2/users/post-user-roles
  await axios.post(
    `${SYSTEM_API_DOMAIN}/api/v2/users/${encodeURIComponent(id)}/roles`,
    {
      roles: ["ロールのID"],
    },
    { headers: { Authorization: `Bearer ${access_token}` } }
  );

  res.json({
    message: "Ranked Up.",
  });
});
```

マネジメントAPIのアクセストークン取得関数

```js
// https://dev-1234567890.us.auth0.com
const SYSTEM_API_DOMAIN = "";
const getAccessToken = async () => {
  // https://auth0.com/docs/secure/tokens/access-tokens/management-api-access-tokens/get-management-api-access-tokens-for-production
  const r = await axios.post(
    `${SYSTEM_API_DOMAIN}/oauth/token`,
    {
      client_id: "", // 設定タブ
      client_secret: "", // 設定タブ
      audience: "", // APIタブ
      grant_type: "client_credentials",
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return r.data.access_token;
};
```

axiosのインポート

```js
import express from "express";
import cors from "cors";
import { auth, claimIncludes } from "express-oauth2-jwt-bearer";
import axios from "axios";

const app = express();
const port = process.env.PORT || 8080;
```

# ゴールド会員になるボタン・関数

- App.jsx

ゴールド会員になるボタン

```jsx
        <>
          <button className="btn--rankup" onClick={doRankUp}>
            ゴールド会員になる
          </button>
          <button className="btn--logout" onClick={logout}>
            ログアウト
          </button>
        </>
```

ゴールド会員になる関数

```jsx
  const doRankUp = async () => {
    const res = await axios.put(`${API_DOMAIN}/users/${userId}/goldmember`, {}, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log(res);
  }
```

ユーザーID管理

```jsx
const [userId, setUserId] = useState("");
```

ユーザーID保存

```jsx
  useEffect(() => {
    if (!isAuthenticated) return;
    setUserName(user.name);
    setUserId(user.sub);
  }, [isAuthenticated, user]);
```

# ゴールド会員を止める（API）

- server.mjs

```js
app.delete("/users/:id/goldmember", async function (req, res) {
  const id = req.params.id;
  console.log(id);
  const access_token = await getAccessToken();
  console.log(access_token);
  // https://auth0.com/docs/api/management/v2/users/delete-user-roles
  await axios.delete(
    `${SYSTEM_API_DOMAIN}/api/v2/users/${encodeURIComponent(id)}/roles`,
    {
      headers: { Authorization: `Bearer ${access_token}` },
      data: { roles: ["ロールのID"] },
    }
  );

  res.json({
    message: "Ranked down.",
  });
});
```

# ゴールド会員を止める（フロント）

- App.jsx

アクセストークンをデコードするライブラリの追加

```
npm i jwt-decode
```

ゴールド会員かどうか状態管理

```jsx
  const [isGold, setIsGold]  = useState(false);
```

トークンを見てゴールド会員か判断

```jsx
  useEffect(() => {
    if (!isAuthenticated) return;
    getAccessTokenSilently().then((res) => {
      console.log(res);
      setAccessToken(res);
      const decoded = jwtDecode(res);
      console.log(decoded);
      const isGold = decoded.permissions.includes('delete:like');
      setIsGold(isGold);
    });
  }, [isAuthenticated, getAccessTokenSilently]);
```

ゴールド会員を止めるボタン

```jsx
        <>
          {
            isGold ? (
              <button className="btn--rankup" onClick={doRankDown}>
                ゴールド会員を止める
              </button>
            ) : (
              <button className="btn--rankup" onClick={doRankUp}>
                ゴールド会員になる
              </button>
            )
          }
          <button className="btn--logout" onClick={logout}>
            ログアウト
          </button>
        </>
```

ゴールド会員を止める関数

```jsx
  const doRankDown = async () => {
    const res = await axios.delete(`${API_DOMAIN}/users/${userId}/goldmember`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log(res);
  }
```