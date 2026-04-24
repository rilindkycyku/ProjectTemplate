import React, { useState } from "react";
import NavBar from "../Components/layout/NavBar";
import Footer from "../Components/layout/Footer";
import apiClient from "../api/apiClient";
import { useAuth } from "../Context/AuthContext";
import Mesazhi from "../Components/layout/Mesazhi";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faEye, faEyeSlash, faSignInAlt } from "@fortawesome/free-solid-svg-icons";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [shfaqMesazhin, setShfaqMesazhin] = useState(false);
  const [tipiMesazhit, setTipiMesazhit] = useState("");
  const [pershkrimiMesazhit, setPershkrimiMesazhit] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      setPershkrimiMesazhit("<strong>Please enter both email and password.</strong>");
      setTipiMesazhit("danger");
      setShfaqMesazhin(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.post("/Authenticate/login", {
        email: email,
        password: password,
      });

      if (response.data && response.data.token) {
        login(response.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login API Error Details:", err.response?.data || err.message, err);
      setPershkrimiMesazhit("<strong>Invalid email or password.</strong> Please try again.");
      setTipiMesazhit("danger");
      setShfaqMesazhin(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-bg min-h-screen flex flex-col relative z-0">
      <Helmet>
        <title>Log In | Project Template</title>
      </Helmet>
      
      <NavBar />
      <div className="orb-bg"></div>

      <main className="flex-1 flex justify-center items-center py-20 px-6 relative z-10">
        <div className="glass-card w-full max-w-[480px] p-12 relative z-10 before:content-[''] before:absolute before:-inset-px before:bg-gradient-to-br before:from-primary/50 before:to-accent/50 before:rounded-[15px] before:z-[-1] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-400 sm:p-8" data-aos="zoom-in" data-aos-duration="600">
          <div className="text-center mb-10">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary to-accent rounded-[18px] flex items-center justify-center text-2xl text-white shadow-[0_8px_24px_rgba(99,102,241,0.4)]">
              <FontAwesomeIcon icon={faSignInAlt} />
            </div>
            <h2 className="text-3xl mb-2 font-extrabold tracking-[-0.02em]">Welcome Back</h2>
            <p className="text-text-muted text-[0.95rem]">Please sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col">
            <div className="form-group-premium relative">
              <label htmlFor="formBasicEmail">Email Address</label>
              <div className="relative">
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted z-10 text-[0.9rem]" />
                <input
                  id="formBasicEmail"
                  type="text"
                  placeholder="name@example.com"
                  className="form-control-premium pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="form-group-premium relative mb-6">
              <div className="flex justify-between items-end mb-2">
                <label htmlFor="formBasicPassword" className="!mb-0">Password</label>
                <Link to="#" className="text-primary-light text-[0.8rem] no-underline font-medium hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted z-10 text-[0.9rem]" />
                <input
                  id="formBasicPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="form-control-premium pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button 
                  type="button" 
                  className="btn-toggle-pass"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            <button type="submit" className="btn-premium w-full py-3.5 mt-2" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-8 text-text-muted text-[0.9rem] border-t border-white/5 pt-6">
            <p>Don't have an account? <Link to="/SignUp" className="font-semibold text-white ml-1 hover:text-primary-light">Sign up</Link></p>
          </div>
        </div>
      </main>

      {shfaqMesazhin && (
        <Mesazhi
          setShfaqMesazhin={setShfaqMesazhin}
          pershkrimi={pershkrimiMesazhit}
          tipi={tipiMesazhit}
        />
      )}

      <Footer />
    </div>
  );
};

export default LogIn;
