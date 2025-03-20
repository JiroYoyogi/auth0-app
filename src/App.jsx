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
  if (isLoading) {
    return <div>Loading ...</div>;
  }

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