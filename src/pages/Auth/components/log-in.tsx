import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import clientAPI from "../../../client-api/rest-client";
import { useNavigate } from "react-router-dom";
import ApiResponse from "model/ApiResponse";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { setUser } from "../../../redux/features/userSlice";
import { useDispatch } from "react-redux";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errAccount, setErrAccount] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const dispatch = useDispatch();


  useEffect(() => {
    const userToken = localStorage.getItem("userToken");

    if (userToken) {
      try {
        const payloadBase64 = userToken.split(".")[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));

        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedPayload.exp > currentTime) {
          navigate("/admin");
        } else {
          console.log("Token has expired");
        }
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, [navigate]);
  const handleLogin = async () => {
    setLoading(true);
    setErrAccount("");
    setErrPassword("");
    try {
      const data = await clientAPI
        .service("Auth/login")
        .authentication("local", account, password);
      //const userRole = data?.data?.role;
      // Lưu thông tin người dùng và token vào localStorage
      //localStorage.setItem('user', JSON.stringify(data)); 
      localStorage.setItem("userToken", data.result.token); 
      
      navigate(`/admin`);
    } catch (error: any) {
      if (error.response) {
        const { data } = error.response;
        if (data.errors) {
          setErrAccount(data.errors.account || "");
          setErrPassword(data.errors.password || "");
        } else {
          console.error("Login error:", data.message);
        }
      } else {
        console.error("Login error:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleSuccessLoginGoogle = async (response: any) => {
    try {
      const formData = new FormData();
      formData.append("TokenId", response?.credential);
      let data: ApiResponse = await clientAPI.service("auth/login-google").create(formData);
      localStorage.setItem("userToken", data?.result?.token);

      dispatch(setUser(data.result));
      if (data.isSuccess) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="min-h flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center">
          Chào mừng bạn ghé thăm
        </h1>
        <h2 className="text-3xl font-bold text-center text-red-700 mb-6">
          SRING HOME
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Hãy nhập thông tin của bạn
        </p>

        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <div className="relative">
              <span className="absolute top-1/2 transform -translate-y-1/2 left-3 text-red-400">
                @
              </span>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Số điện thoại / Email"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full px-4 py-2 pl-10 border rounded-md focus:ring focus:ring-red-300 focus:outline-none"
              />
            </div>
            {errAccount && (
              <p className="text-red-500 text-sm mt-1">{errAccount}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <span className="absolute top-1/2 transform -translate-y-1/2 left-3 text-red-400">
                🔒
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full px-4 py-2 pl-10 border rounded-md focus:ring focus:ring-red-300 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errPassword && (
              <p className="text-red-500 text-sm mt-1">{errPassword}</p>
            )}
          </div>

          {/* <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-gray-600 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div> */}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-red-700 hover:bg-red-800 text-white py-2 rounded-md font-semibold transition disabled:opacity-70"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

           <div className="mt-2 mx-auto text-center">
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ""}>
              <GoogleLogin
                onSuccess={handleSuccessLoginGoogle}
                onError={() => {
                  console.log('Login Failed');
                }}
              />
            </GoogleOAuthProvider>
          </div>

          {/* <div className="text-center mt-4">
            <span className="text-gray-600">Bạn chưa có tài khoản? </span>
            <Link to="/register" className="text-red-700 hover:underline">
              Hãy đăng ký ngay
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
