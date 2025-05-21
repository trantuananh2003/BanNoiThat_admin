import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import clientAPI from '../../../client-api/rest-client';

const SignUp: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errEmail, setErrEmail] = useState('');
    const [errPassword, setErrPassword] = useState('');
    const [errConfirmPassword, setErrConfirmPassword] = useState('');

    const handleSignUp = async () => {
        setLoading(true);
        setErrEmail('');
        setErrPassword('');
        setErrConfirmPassword('');
        
        if (!email) {
            setErrEmail('Email không được để trống');
            setLoading(false);
            return;
        }

        if (!password) {
            setErrPassword('Mật khẩu không được để trống');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setErrConfirmPassword('Mật khẩu xác nhận không khớp');
            setLoading(false);
            return;
        }
        const formData = new FormData();
        formData.append('FullName', 'Người dùng mới');
        formData.append('Email', email);
        formData.append('Password', password);
        try {
            const response = await clientAPI.service('Auth/register').create(formData);
        } catch (error: any) {
            // Handle error (e.g., display error message)
            console.error('Đăng ký thất bại:', error);
            if (error.response && error.response.data) {
                const { message } = error.response.data;
                if (message.includes('Email')) {
                    setErrEmail(message);
                } else if (message.includes('Password')) {
                    setErrPassword(message);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center">Chào mừng bạn ghé thăm</h1>
                <h2 className="text-3xl font-bold text-center text-red-700 mb-6">COME HOME</h2>
                <p className="text-center text-gray-600 mb-4">Hãy nhập thông tin của bạn</p>

                <div className="flex flex-col gap-4">
                    {/* Input Email */}
                    <div>
                        <label htmlFor="email" className="sr-only">
                            Email
                        </label>
                        <div className="relative">
                            <span className="absolute top-1/2 transform -translate-y-1/2 left-3 text-red-400">@</span>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 pl-10 border rounded-md focus:ring focus:ring-red-300 focus:outline-none"
                            />
                        </div>
                        {errEmail && <p className="text-red-500 text-sm mt-1">{errEmail}</p>}
                    </div>

                    {/* Input Password */}
                    <div>
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>
                        <div className="relative">
                            <span className="absolute top-1/2 transform -translate-y-1/2 left-3 text-red-400">🔒</span>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                        {errPassword && <p className="text-red-500 text-sm mt-1">{errPassword}</p>}
                    </div>

                    {/* Input Confirm Password */}
                    <div>
                        <label htmlFor="confirmPassword" className="sr-only">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <span className="absolute top-1/2 transform -translate-y-1/2 left-3 text-red-400">🔒</span>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                id="confirmPassword"
                                placeholder="Xác nhận mật khẩu"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 pl-10 border rounded-md focus:ring focus:ring-red-300 focus:outline-none"
                            />
                        </div>
                        {errConfirmPassword && <p className="text-red-500 text-sm mt-1">{errConfirmPassword}</p>}
                    </div>

                    {/* Nút Đăng ký */}
                    <button
                        onClick={handleSignUp}
                        disabled={loading}
                        className="bg-red-700 hover:bg-red-800 text-white py-2 rounded-md font-semibold transition disabled:opacity-70"
                    >
                        {loading ? "Đang đăng ký..." : "Đăng ký"}
                    </button>

                    {/* Đăng ký bằng Google */}
                    <div className="mt-4">
                        <p className="text-center text-gray-600">Hoặc đăng ký bằng:</p>
                        <button
                            type="button"
                            className="w-full mt-2 p-2 border rounded-lg flex items-center justify-center gap-2"
                        >
                            <img
                                src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg"
                                alt="Google"
                                className="w-6 h-6"
                            />
                        </button>
                    </div>

                    {/* Chuyển đến trang đăng nhập */}
                    <div className="text-center mt-4">
                        <span className="text-gray-600">Bạn đã có tài khoản? </span>
                        <Link to="/login" className="text-red-700 hover:underline">
                            Đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;