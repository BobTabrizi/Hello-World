export default async function FetchToken(hashParams) {
  let token = await fetch(
    `${process.env.NEXT_PUBLIC_PROD_URL}/api/auth/getToken?codeValue=${hashParams}&Type=UserToken`
  );
  let tokenData = await token.json();
  localStorage.setItem("Token", tokenData.access_token);
  localStorage.setItem("RefreshToken", tokenData.refresh_token);
  let currTime = Date.now();
  localStorage.setItem("TokenTime", currTime);
  return tokenData.access_token;
}
