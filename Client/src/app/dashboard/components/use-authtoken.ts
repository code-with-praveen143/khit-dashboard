import { useState, useEffect } from "react";

export default function useAuthToken() {
  const [authToken, setAuthToken] = useState<string | null>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("auth_token");
      setAuthToken(token);
    }
  }, []);

  return authToken;
}
