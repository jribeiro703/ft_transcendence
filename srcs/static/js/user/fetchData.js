import { isAuthenticated } from "./isAuthenticated.js";

const API_BASE_URL = `https://${window.location.hostname}:8081`;

function getCookie(name) {
  const cookies = document.cookie.split(";");
  const cookie = cookies.find((cookie) => cookie.trim().startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : "";
}

async function makeOptions(method, body, isFormData) {
  const options = {
    method: method,
    headers: {},
    credentials: "include",
  };

  if (body) {
    if (isFormData) {
      options.body = body;
    } else {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }
  }

  return options;
}

async function makeAuthOptions(method, body, isFormData) {
  const options = await makeOptions(method, body, isFormData);

  if (await isAuthenticated()) {
    // const accessToken = sessionStorage.getItem('access_token');
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      options.headers["Authorization"] = `Bearer ${accessToken}`;
    }
  }

  return options;
}

async function refreshToken() {
  const refreshToken = getCookie("refresh_token");
  if (!refreshToken) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/user/token/refresh/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("access_token", data.access_token);
    return data.access_token;
  } else {
    localStorage.removeItem("access_token");
    return null;
  }
}

async function fetchData(
  endpoint,
  method = "GET",
  body = null,
  isFormData = false,
) {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = await makeOptions(method, body, isFormData);

  const responseObject = {
    data: { message: "fetchData: error occurred while fetching data" },
    status: 400,
  };

  try {
    const response = await fetch(url, options);
    responseObject.status = response.status;
    responseObject.data = await response.json();
    return responseObject;
  } catch (error) {
    console.error(`fetchData(): ${error}`);
    return responseObject;
  }
}

async function fetchAuthData(
  endpoint,
  method = "GET",
  body = null,
  isFormData = false,
) {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = await makeAuthOptions(method, body, isFormData);

  const responseObject = {
    data: { message: "fetchAuthData: error occurred while fetching data" },
    status: 400,
  };

  try {
    // console.log("fetchAuthData: ", url);

    let response = await fetch(url, options);
    if (response.status === 401) {
      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        options = await makeAuthOptions(method, body, isFormData);
        response = await fetch(url, options);
      }
    }
    responseObject.status = response.status;
    responseObject.data = await response.json();
    return responseObject;
  } catch (error) {
    console.error(`fetchAuthData(): ${error}`);
    return responseObject;
  }
}

export { fetchData, fetchAuthData, API_BASE_URL, getCookie };

