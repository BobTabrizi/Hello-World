export default async function GetRefreshToken(refToken) {
  let refreshToken = await fetch(
    `${process.env.NEXT_PUBLIC_PROD_URL}/api/auth/refreshToken?tokenValue=${refToken}&?Type=RefreshToken`
  );
  let tokenInfo = await refreshToken.json();
  localStorage.setItem("Token", tokenInfo.access_token);
  let currTime = Date.now();
  localStorage.setItem("TokenTime", currTime);

  return tokenInfo.acess_token;
  //setToken(tokenInfo.access_token);
}
