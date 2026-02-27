export interface GoogleAccessToken {
  access_token: string;
  expiry_date: number;
  scope: string;
  token_type: string;
  refresh_token?: string;
}

const GOOGLE_ACCESS_TOKEN_STORAGE_KEY = "google_access_token";

export function setAccessTokenData(token: GoogleAccessToken) {
  sessionStorage.setItem(GOOGLE_ACCESS_TOKEN_STORAGE_KEY, JSON.stringify(token));
}

export const getAccessTokenData = async (): Promise<GoogleAccessToken> => {
  let tokenData = sessionStorage.getItem(GOOGLE_ACCESS_TOKEN_STORAGE_KEY);
  if (!tokenData) {
    const params = new URLSearchParams(location.search);
    if (params.get("code")) {
      const response = await fetch(
        `/api/google-token-generate?code=${params.get("code")}`
      );
      const json = await response.json();
      tokenData = JSON.stringify(json.tokens);
      sessionStorage.setItem(GOOGLE_ACCESS_TOKEN_STORAGE_KEY, tokenData);
      window.history.replaceState(null, "", "/");
    } else {
      const response = await fetch("/api/google-token-url");
      const json = await response.json();
      location.href = json.url;
    }
    if (!tokenData) {
      throw new Error();
    }
  }
  return JSON.parse(tokenData);
};
