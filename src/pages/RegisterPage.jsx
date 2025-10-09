import { useState } from "react";
import { Link } from "react-router-dom";


const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const submitHandler = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
        } else {
        console.log({ username, email, password });
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-center mb-6">Create Account</h1>
            <form onSubmit={submitHandler} className="flex flex-col gap-4">
                <div>
                    <label className="block mb-1 font-medium text-gray-700">
                        Username
                    </label>
                    <input type="text" 
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-blue-500"
                    required  
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">
                        Email Address
                    </label>
                    <input type="email" 
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-blue-500"
                    required  
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">
                        Password
                    </label>
                    <input type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required  
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <input type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required  
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors mt-2"
                >
                    Register
                </button>
            </form>

            <div className="text-center mt-4">
                <p className="text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};
  
export default RegisterPage;