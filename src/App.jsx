import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { FaHeart, FaHeartBroken } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const API_DOMAIN = "http://localhost:8080";

function App() {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();
  const [userName, setUserName] = useState("ゲスト");
  const [userId, setUserId] = useState("");
  const [countLike, setCountLike] = useState(0);
  const [accessToken, setAccessToken] = useState("");
  const [isGold, setIsGold] = useState(false);

  const doLike = async () => {
    const res = await axios.post(
      `${API_DOMAIN}/likes`,
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    console.log(res);
    setCountLike(res.data.count);
  };

  const deleteLike = async () => {
    const res = await axios.delete(`${API_DOMAIN}/likes`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log(res);
    setCountLike(res.data.count);
  };

  const doRankUp = async () => {
    const res = await axios.put(
      `${API_DOMAIN}/users/${userId}/goldmember`,
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    console.log(res);
  };
  const doRankDown = async () => {
    const res = await axios.delete(`${API_DOMAIN}/users/${userId}/goldmember`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log(res);
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    setUserName(user.name);
    setUserId(user.sub);
  }, [isAuthenticated, user]);

  // いいね
  useEffect(() => {
    axios.get(`${API_DOMAIN}/likes`).then((r) => {
      if (!r.data.count) return;
      setCountLike(r.data.count);
    });
  }, []);

  // アクセストークン
  useEffect(() => {
    if (!isAuthenticated) return;
    getAccessTokenSilently().then((res) => {
      console.log(res);
      setAccessToken(res);
      const decoded = jwtDecode(res);
      console.log(decoded);
      const isGold = decoded.permissions.includes("delete:likes");
      setIsGold(isGold);
    });
  }, [isAuthenticated, getAccessTokenSilently]);

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
        <button className="btn--like" onClick={deleteLike}>
          <FaHeartBroken color="#FFF" size="32px" />
        </button>
      </div>
      {isAuthenticated ? (
        <>
          {isGold ? (
            <button className="btn--rankup" onClick={doRankDown}>
              ゴールド会員を止める
            </button>
          ) : (
            <button className="btn--rankup" onClick={doRankUp}>
              ゴールド会員になる
            </button>
          )}
          <button className="btn--logout" onClick={logout}>
            ログアウト
          </button>
        </>
      ) : (
        <button className="btn--login" onClick={loginWithRedirect}>
          ログイン
        </button>
      )}
    </main>
  );
}

export default App;
