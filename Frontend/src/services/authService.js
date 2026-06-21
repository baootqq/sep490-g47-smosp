import api from "./api";

export const login = async (identifier, password) => {
  const response = await api.post(
    "/auth/login",
    {
      identifier,
      password,
    }
  );

  return response.data;
};

export const register = async (fullName, email, password) => {
  const response = await api.post(
    "/auth/register",
    {
      fullName,
      email,
      password,
    }
  );

  return response.data;
};

export const googleLogin = async (idToken) => {
  const response = await api.post(
    "/auth/google",
    {
      idToken,
    }
  );

  return response.data;
};