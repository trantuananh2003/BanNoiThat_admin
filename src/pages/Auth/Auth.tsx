import React, { useState } from 'react';
import Login from './components/Login';
import SignUp from './components/SignUp';

const Auth: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

    return (
        <div className="flex flex-col justify-center items-center min-h bg-gray-100">
            <div className="m-4 p-6 bg-white shadow-md rounded-lg w-full max-w-md">
                <div className="flex justify-around mb-4">
                    <button
                        className={`px-4 py-2 ${activeTab === 'login' ? 'border-b-2 border-blue-500' : ''}`}
                        onClick={() => setActiveTab('login')}
                    >
                        Login
                    </button>
                    <button
                        className={`px-4 py-2 ${activeTab === 'signup' ? 'border-b-2 border-blue-500' : ''}`}
                        onClick={() => setActiveTab('signup')}
                    >
                        Sign Up
                    </button>
                </div>
                {activeTab === 'login' ? <Login /> : <SignUp />}
            </div>
        </div>
    );
};

export default Auth;