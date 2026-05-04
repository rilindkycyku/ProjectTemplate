import React from "react";
import NavBar from "../../Components/layout/NavBar";
import Footer from "../../Components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faCodeBranch } from "@fortawesome/free-solid-svg-icons";

const AboutUs = () => {
  return (
    <div className="bg-bg-darker min-h-screen flex flex-col">
      <Helmet>
        <title>About Us | Project Template</title>
      </Helmet>
      
      <NavBar />
      <div className="orb-bg"></div>
      
      <main className="flex-1 max-w-[1000px] mx-auto py-12 md:py-24 px-5 md:px-8 w-full">
        <section className="text-center mb-10 md:mb-20" data-aos="fade-up" data-aos-duration="600">
            <h1 className="text-[clamp(2.5rem,6vw,4rem)] mb-5 font-extrabold tracking-[-0.03em]">About the <span className="gradient-text">Template</span></h1>
            <p className="text-[1.15rem] text-text-muted max-w-[600px] mx-auto leading-relaxed">Empowering developers with a rock-solid foundation for modern, secure, and scalable full-stack development.</p>
        </section>

        <section className="flex flex-col gap-8 md:gap-10 relative before:content-[''] before:absolute before:top-8 before:bottom-8 before:left-8 before:w-[2px] before:bg-gradient-to-b before:from-transparent before:via-primary/30 before:to-transparent before:z-0 md:before:hidden">
          <div className="glass-card p-6 md:p-14 md:pl-20 relative overflow-hidden after:content-[''] after:absolute after:top-1/2 after:left-[26px] after:-translate-y-1/2 after:w-3.5 after:h-3.5 after:bg-bg after:border-2 after:border-primary-light after:rounded-full after:shadow-[0_0_10px_var(--color-primary-light)] after:z-10 md:after:hidden" data-aos="fade-right" data-aos-delay="100">
            <h3 className="text-xl md:text-[1.75rem] mb-4 md:mb-5 text-primary-light flex items-center gap-3">
              <FontAwesomeIcon icon={faBullseye} /> Our Mission
            </h3>
            <p className="text-sm md:text-[1.05rem] leading-relaxed md:leading-[1.8] text-text-muted m-0">
              We believe that developer productivity is the key to innovation. 
              Our mission is to provide a clean, high-performance starting point 
              that handles the repetitive parts of application development—like authentication, 
              routing, and state management—so you can focus entirely on building unique features 
              and business value.
            </p>
          </div>

          <div className="glass-card p-6 md:p-14 md:pl-20 relative overflow-hidden after:content-[''] after:absolute after:top-1/2 after:left-[26px] after:-translate-y-1/2 after:w-3.5 after:h-3.5 after:bg-bg after:border-2 after:border-secondary-light after:rounded-full after:shadow-[0_0_10px_var(--color-secondary-light)] after:z-10 md:after:hidden" data-aos="fade-left" data-aos-delay="200">
            <h3 className="text-xl md:text-[1.75rem] mb-4 md:mb-5 text-secondary-light flex items-center gap-3">
              <FontAwesomeIcon icon={faCodeBranch} /> The Tech Stack
            </h3>
            <p className="text-sm md:text-[1.05rem] leading-relaxed md:leading-[1.8] text-text-muted m-0">
              This template combines the best of both worlds: 
              <strong className="text-white font-semibold"> ASP.NET Core</strong> for a robust, secure backend API and 
              <strong className="text-white font-semibold"> React + Vite</strong> for a lightning-fast, interactive frontend experience. 
              Everything is written with modern standards, strict typing, and best practices in mind, 
              wrapped in a beautiful glassmorphism design system.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
