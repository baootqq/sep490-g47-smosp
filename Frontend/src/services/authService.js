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

export const logout = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken) {
    try {
      await api.post("/auth/logout", { refreshToken });
    } catch (err) {
      console.error("Logout error:", err);
    }
  }
  localStorage.clear();
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/password/forgot", { email });
  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await api.post("/auth/password/reset", { token, newPassword });
  return response.data;
};

export const verifyEmail = async (token) => {
  const response = await api.post("/auth/verify-email", { token });
  return response.data;
};

export const resendVerifyEmail = async (email) => {
  const response = await api.post("/auth/verify-email/resend", { email });
  return response.data;
};