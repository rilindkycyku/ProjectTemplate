import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import NavBar from "../../Components/layout/NavBar";
import Footer from "../../Components/layout/Footer";
import apiClient from "../../api/apiClient";
import { useAuth } from "../../Context/AuthContext";
import Mesazhi from "../../Components/layout/Mesazhi";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faIdCard, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";

const SignUp = () => {
  const [emri, setEmri] = useState("");
  const [mbiemri, setMbiemri] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nrTelefonit, setNrTelefonit] = useState("");
  const [qyteti, setQyteti] = useState("");
  const [adresa, setAdresa] = useState("");
  const [shteti, setShteti] = useState("");
  const [zipKodi, setZipKodi] = useState("");

  const [shfaqMesazhin, setShfaqMesazhin] = useState(false);
  const [tipiMesazhit, setTipiMesazhit] = useState("");
  const [pershkrimiMesazhit, setPershkrimiMesazhit] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSignUp(e) {
    e.preventDefault();

    if (!emri || !mbiemri || !username || !email || !password) {
      setPershkrimiMesazhit("<strong>Please fill in all required fields (*)</strong>");
      setTipiMesazhit("danger");
      setShfaqMesazhin(true);
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.post("/Authenticate/register", {
        name: emri,
        lastName: mbiemri,
        username,
        email,
        password,
        adresa,
        qyteti,
        shteti,
        zipKodi: zipKodi ? parseInt(zipKodi) : null,
        nrTelefonit
      });

      setPershkrimiMesazhit("<strong>Account created successfully!</strong> Redirecting to login...");
      setTipiMesazhit("success");
      setShfaqMesazhin(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setPershkrimiMesazhit("<strong>An error occurred on the server. Please try again.</strong>");
      setTipiMesazhit("danger");
      setShfaqMesazhin(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Sign Up | Project Template</title>
      </Helmet>
      
      <NavBar />
      
      <div className="orb-bg"></div>

      <main className="flex-1 flex justify-center items-start py-10 md:py-24 px-4 md:px-6 relative z-10">
        <div className="glass-card w-full max-w-[720px] p-6 sm:p-10 md:p-14 relative z-10 before:content-[''] before:absolute before:-inset-px before:bg-gradient-to-br before:from-secondary/50 before:to-primary/50 before:rounded-[15px] before:z-[-1] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-400" data-aos="fade-up" data-aos-duration="600">
          <div className="text-center mb-12">
            <h2 className="text-[1.75rem] md:text-[2.25rem] mb-2 font-extrabold tracking-[-0.02em]">Create Account</h2>
            <p className="text-text-muted text-[1rem]">Join our professional platform today</p>
          </div>

          <form onSubmit={handleSignUp} className="flex flex-col">
            <div className="mb-4">
              <h5 className="section-title"><FontAwesomeIcon icon={faIdCard} className="me-2"/> Personal Info</h5>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <div className="form-group-premium">
                  <label htmlFor="formGridName">First Name *</label>
                  <input
                    id="formGridName"
                    placeholder="John"
                    className="form-control-premium"
                    value={emri}
                    onChange={(e) => setEmri(e.target.value)}
                    required
                  />
              </div>
              <div className="form-group-premium">
                  <label htmlFor="formGridLastName">Last Name *</label>
                  <input
                    id="formGridLastName"
                    placeholder="Doe"
                    className="form-control-premium"
                    value={mbiemri}
                    onChange={(e) => setMbiemri(e.target.value)}
                    required
                  />
              </div>
            </div>

            <div className="form-group-premium">
              <label htmlFor="formGridUsername">Username *</label>
              <input
                id="formGridUsername"
                placeholder="johndoe123"
                className="form-control-premium"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group-premium">
              <label htmlFor="formGridEmail">Email Address *</label>
              <input
                id="formGridEmail"
                type="email"
                placeholder="john@example.com"
                className="form-control-premium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group-premium mb-4">
              <label htmlFor="formGridPassword">Password *</label>
              <input
                id="formGridPassword"
                type="password"
                placeholder="Min. 8 characters"
                className="form-control-premium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4 mt-4">
              <h5 className="section-title"><FontAwesomeIcon icon={faMapLocationDot} className="me-2"/> Location Details</h5>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <div className="form-group-premium">
                  <label htmlFor="formGridPhone">Phone Number</label>
                  <input
                    id="formGridPhone"
                    placeholder="+1 (555) 000-0000"
                    className="form-control-premium"
                    value={nrTelefonit}
                    onChange={(e) => setNrTelefonit(e.target.value)}
                  />
              </div>
              <div className="form-group-premium">
                  <label htmlFor="formGridCity">City</label>
                  <input
                    id="formGridCity"
                    placeholder="New York"
                    className="form-control-premium"
                    value={qyteti}
                    onChange={(e) => setQyteti(e.target.value)}
                  />
              </div>
            </div>

            <div className="form-group-premium">
              <label htmlFor="formGridAddress">Street Address</label>
              <input
                id="formGridAddress"
                placeholder="123 Main St, Apt 4"
                className="form-control-premium"
                value={adresa}
                onChange={(e) => setAdresa(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <div className="form-group-premium">
                  <label htmlFor="formGridState">State / Country</label>
                  <input
                    id="formGridState"
                    placeholder="NY"
                    className="form-control-premium"
                    value={shteti}
                    onChange={(e) => setShteti(e.target.value)}
                  />
              </div>
              <div className="form-group-premium">
                  <label htmlFor="formGridZip">Zip Code</label>
                  <input
                    id="formGridZip"
                    placeholder="10001"
                    className="form-control-premium"
                    value={zipKodi}
                    onChange={(e) => setZipKodi(e.target.value)}
                  />
              </div>
            </div>

            <button type="submit" className="btn-premium w-full py-3 mt-4" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : (
                <><FontAwesomeIcon icon={faUserPlus} className="me-2"/> Register Account</>
              )}
            </button>
          </form>

          <div className="text-center mt-10 text-text-muted text-[0.9rem] border-t border-white/5 pt-6">
            <p>Already have an account? <Link to="/LogIn" className="font-semibold text-white ml-1 hover:text-primary-light">Log In</Link></p>
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

export default SignUp;
