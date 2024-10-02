import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setisRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(null);
  const [isLoginLoading, setisLoginLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  console.log("loginInfo", loginInfo);
  useEffect(() => {
    const user = localStorage.getItem("User");
    setUser(JSON.parse(user));
  }, []);

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);
  const updateLoginInfo = useCallback((info)=>{
    setLoginInfo(info);
  })

  const registerUser = useCallback(
    async (e) => {
      e.preventDefault();
      setisRegisterLoading(true);
      setRegisterError(null);
      const response = await postRequest(
        `${baseUrl}/users/register`,
        JSON.stringify(registerInfo)
      );
      setisRegisterLoading(false);

      if (response.error) {
        return setRegisterError(response);
      }
      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    },
    [registerInfo, baseUrl]
  );
  const loginUser = useCallback(async (e) => {
    e.preventDefault();
    
    setisLoginLoading(true);
    setLoginError(null);
    
    try {
      // Ensure loginInfo is properly structured and serialized
      const response = await postRequest(
        `${baseUrl}/users/login`,
        JSON.stringify(loginInfo), // Convert loginInfo object to a JSON string
        {
          headers: {
            "Content-Type": "application/json", // Ensure the correct header is set
          },
        }
      );
      
      setisLoginLoading(false);
      
      if (response.error) {
        return setLoginError(response.error);
      }
  
      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    } catch (error) {
      setisLoginLoading(false);
      setLoginError("Something went wrong. Please try again.");
      console.error("Login error: ", error);
    }
  }, [loginInfo]);
  



  const logoutUser = useCallback(() => {
    localStorage.removeItem("User");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,
        logoutUser,
        loginUser,
        loginError,
        loginInfo,
        updateLoginInfo,
        isLoginLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
