import { NextRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import getCookie from "../getCookie";
/** Calls the /api/authorize API endpoint to recieve an Authorization Code
 * The API comes back with a URL where users can sign in with spotify
 * This method router.replaces the current url with the sign up with spotify url
 * Then, they are redirected back to our homepage.
 */
export const getAuthorizationCode = async (
  router: NextRouter
): Promise<Response> => {
  const req = await fetch("/api/authorize");
  const authResponse = await req.json();

  await router.replace(authResponse.url);
  return authResponse;
};

/** Sends the authorization code to the /api/getToken endpoint
 * Recieves back a recievedTokenObject which contains the refresh token and the access token
 * If there was no access token provided, throws an error.
 * Sets two cookies in memory - 1 for access token and 1 for refresh token
 */
export const getTokenObject = async (
  routerQuery: ParsedUrlQuery
): Promise<Object> => {
  const userCode: string | string[] | undefined = routerQuery.code;

  const req: Response = await fetch(`/api/getToken?user_code=${userCode}`);
  const recievedTokenObject = await req.json();

  if (recievedTokenObject.access_token) {
    // Successfully Got back a token object - Store it
    document.cookie = `access_token=${recievedTokenObject.access_token}`;
    document.cookie = `refresh_token=${recievedTokenObject.refresh_token}`;
    return recievedTokenObject;
  } else {
    throw new Error(
      `No Access token was provided. API Returned back: ${JSON.stringify(
        recievedTokenObject
      )}`
    );
  }
};

/** Given a refresh token, returns back a new access token string
 * Sends a request to the /api/getNewAccessToken/ API
 * Returns the new access token as a string.
 */
export const getNewAccessToken = async (): Promise<String | undefined> => {
  let refreshToken: String | undefined = getCookie("refresh_token");
  if (refreshToken) {
    let req: Response = await fetch(
      `/api/getNewAccessToken?refresh_token=${refreshToken}`
    );
    let res = await req.json();
    if (res.access_token) {
      document.cookie = `access_token=${res.access_token}; path=/`;
      return res.access_token;
    }
  } else {
    throw new Error(`No Access Token was returned back from getNewAccessToken`);
  }
};

export const getUserId = async (
  access_token: any
): Promise<String | undefined> => {
  if (access_token) {
    const req: Response = await fetch(
      `/api/getUserId?access_token=${access_token}`
    );
    console.log("A):", req);
    const res = await req.json();
    console.log("Got back recievedUserId:", res);
    const id = res.id;
    console.log("Id extract:", id);
    return id;
  }
};
