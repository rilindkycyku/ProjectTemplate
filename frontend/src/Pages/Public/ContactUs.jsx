import React from "react";
import NavBar from "../../Components/layout/NavBar";
import Footer from "../../Components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faLocationDot, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const ContactUs = () => {
  return (
    <div className="bg-bg-darker min-h-screen flex flex-col">
      <Helmet>
        <title>Contact Us | Project Template</title>
      </Helmet>
      
      <NavBar />
      <div className="orb-bg"></div>
      
      <main className="flex-1 max-w-[1200px] mx-auto py-16 md:py-24 px-6 md:px-8 w-full">
        <div className="text-center mb-20" data-aos="fade-down" data-aos-duration="600">
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] mb-5 font-extrabold tracking-[-0.03em]">Get in <span className="gradient-text">Touch</span></h1>
          <p className="text-[1.15rem] text-text-muted max-w-[600px] mx-auto">Have questions or suggestions? We'd love to hear from you. Fill out the form and we'll be in touch shortly.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 items-start md:grid-cols-[1fr_1.5fr] md:gap-12">
          <div className="flex flex-col gap-5" data-aos="fade-right" data-aos-delay="100">
            <div className="glass-card flex items-center gap-4 md:gap-6 p-5 md:p-6 transition-transform duration-300 hover:translate-x-[5px] hover:border-primary/30">
              <div className="w-[48px] h-[48px] md:w-[52px] md:h-[52px] bg-gradient-to-br from-primary/15 to-accent/15 rounded-xl flex justify-center items-center text-lg md:text-[1.35rem] text-primary-light border border-primary/25 shrink-0"><FontAwesomeIcon icon={faEnvelope} /></div>
              <div>
                <h4 className="m-0 mb-1 text-[0.95rem] md:text-[1rem] text-white">Email Support</h4>
                <p className="m-0 text-text-muted text-[0.85rem] md:text-[0.9rem] break-all">support@template.com</p>
              </div>
            </div>
            <div className="glass-card flex items-center gap-4 md:gap-6 p-5 md:p-6 transition-transform duration-300 hover:translate-x-[5px] hover:border-primary/30">
              <div className="w-[48px] h-[48px] md:w-[52px] md:h-[52px] bg-gradient-to-br from-primary/15 to-accent/15 rounded-xl flex justify-center items-center text-lg md:text-[1.35rem] text-primary-light border border-primary/25 shrink-0"><FontAwesomeIcon icon={faPhone} /></div>
              <div>
                <h4 className="m-0 mb-1 text-[0.95rem] md:text-[1rem] text-white">Phone Call</h4>
                <p className="m-0 text-text-muted text-[0.85rem] md:text-[0.9rem]">+383 (44) 123-456</p>
              </div>
            </div>
            <div className="glass-card flex items-center gap-4 md:gap-6 p-5 md:p-6 transition-transform duration-300 hover:translate-x-[5px] hover:border-primary/30">
              <div className="w-[48px] h-[48px] md:w-[52px] md:h-[52px] bg-gradient-to-br from-primary/15 to-accent/15 rounded-xl flex justify-center items-center text-lg md:text-[1.35rem] text-primary-light border border-primary/25 shrink-0"><FontAwesomeIcon icon={faLocationDot} /></div>
              <div>
                <h4 className="m-0 mb-1 text-[0.95rem] md:text-[1rem] text-white">Office Location</h4>
                <p className="m-0 text-text-muted text-[0.85rem] md:text-[0.9rem]">Prishtina, Kosovo</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 md:p-12 relative z-10 before:content-[''] before:absolute before:-inset-px before:bg-gradient-to-br before:from-primary/30 before:to-transparent before:rounded-2xl before:z-[-1]" data-aos="fade-left" data-aos-delay="200">
            <form>
              <div className="form-group-premium">
                <label>Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="form-control-premium"
                />
              </div>
              
              <div className="form-group-premium">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  className="form-control-premium"
                />
              </div>
              
              <div className="form-group-premium">
                <label>Message</label>
                <textarea 
                  rows={4} 
                  placeholder="How can we help you?" 
                  className="form-control-premium"
                ></textarea>
              </div>
              
              <button type="button" className="btn-premium w-full py-3.5 mt-2">
                <FontAwesomeIcon icon={faPaperPlane} className="me-2"/> Send Message
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactUs;
