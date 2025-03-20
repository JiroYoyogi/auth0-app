import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

function Auth() {
  return (
    <Auth0Provider
      domain=""
      clientId=""
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <App />
    </Auth0Provider>
  );
}

export default Auth;