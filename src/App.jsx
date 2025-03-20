import { useState, useEffect } from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";

const API_DOMAIN = "http://localhost:8080";

function App() {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();
  const [userName, setUserName] = useState('ゲスト');
  const [countLike, setCountLike] = useState(0);
  const [accessToken, setAccessToken] = useState("");

  const doLike = async () => {
    const res = await axios.post(`${API_DOMAIN}/likes`, {}, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log(res);
    setCountLike(res.data.count);
  }

  useEffect(() => {
    if (!isAuthenticated) return;
    setUserName(user.name);
  }, [isAuthenticated, user]);

  // いいね
  useEffect(() => {
    axios
      .get(`${API_DOMAIN}/likes`)
      .then((r) => {
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