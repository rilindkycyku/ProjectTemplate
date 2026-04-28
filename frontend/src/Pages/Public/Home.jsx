import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import NavBar from "../../Components/layout/NavBar";
import Footer from "../../Components/layout/Footer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faShieldHalved, faBolt, faCode, faDatabase, faLayerGroup, faServer, faArrowRight } from '@fortawesome/free-solid-svg-icons';

function Home() {
    return (
        <div className="bg-bg-darker min-h-screen flex flex-col w-full overflow-x-hidden">
            <Helmet>
                <title>Home | Project Template</title>
                <meta name="description" content="A clean, modern, and pre-configured boilerplate for your ASP.NET Core and React applications." />
            </Helmet>
            
            <NavBar />
            
            <main className="flex-1 overflow-x-hidden">
                {/* Hero Section */}
                <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_20%_30%,_rgba(99,102,241,0.2)_0%,_transparent_55%),radial-gradient(ellipse_at_80%_70%,_rgba(139,92,246,0.15)_0%,_transparent_55%),radial-gradient(ellipse_at_50%_50%,_rgba(236,72,153,0.06)_0%,_transparent_70%),var(--color-bg-darker)]">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,rgba(0,0,0,0.6)_0%,transparent_70%)] pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-bg-darker to-transparent pointer-events-none"></div>
                    
                    <div className="text-center max-w-[860px] px-6 md:px-8 z-10 relative animate-[fadeInUp_0.8s_ease-out_both]">
                        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 text-sm font-semibold text-primary-light mb-8 tracking-wide">
                            <span className="w-1.5 h-1.5 bg-primary-light rounded-full animate-[pulse-ring_2s_infinite]"></span> React 19 + ASP.NET Core 6 Ready
                        </div>
                        <h1 className="text-[clamp(1.5rem,8.5vw,4.5rem)] leading-[1.15] mb-6 tracking-[-0.04em] font-black break-words overflow-hidden">
                            Build Faster With Our <br />
                            <span className="bg-gradient-to-br from-primary-light via-accent-light to-secondary-light bg-clip-text text-transparent">Premium Template</span>
                        </h1>
                        <p className="text-lg text-text-muted mb-11 leading-relaxed max-w-[640px] mx-auto">
                            Skip the tedious setup and boilerplate. Get a fully configured, production-ready foundation with authentication, authorization, and a modern dashboard out of the box.
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Link to="/SignUp" className="btn-premium">
                                Get Started Free <FontAwesomeIcon icon={faArrowRight} className="text-[0.85em]" />
                            </Link>
                            <Link to="/AboutUs" className="btn-outline">
                                View Documentation
                            </Link>
                        </div>

                        <div className="hidden sm:flex justify-center gap-12 mt-20 pt-10 border-t border-white/5">
                            <div className="text-center">
                                <span className="text-3xl font-extrabold bg-gradient-to-br from-white to-primary-light bg-clip-text text-transparent block leading-none mb-1">100%</span>
                                <span className="text-xs text-text-dim uppercase tracking-[0.1em]">Open Source</span>
                            </div>
                            <div className="text-center">
                                <span className="text-3xl font-extrabold bg-gradient-to-br from-white to-primary-light bg-clip-text text-transparent block leading-none mb-1">0.0</span>
                                <span className="text-xs text-text-dim uppercase tracking-[0.1em]">Config Needed</span>
                            </div>
                            <div className="text-center">
                                <span className="text-3xl font-extrabold bg-gradient-to-br from-white to-primary-light bg-clip-text text-transparent block leading-none mb-1">2x</span>
                                <span className="text-xs text-text-dim uppercase tracking-[0.1em]">Faster Dev</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 md:py-24 px-6 md:px-8 max-w-[1200px] mx-auto w-full">
                    <div className="text-center mb-16" data-aos="fade-up">
                        <span className="section-title">Features</span>
                        <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] mb-4 tracking-[-0.03em]">Everything you need to scale</h2>
                        <p className="text-lg text-text-muted max-w-[520px] mx-auto leading-relaxed">
                            We've carefully selected and configured the best tools so you can focus on writing business logic instead of configuration.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="glass-card p-8 md:p-10 relative overflow-hidden group" data-aos="fade-up" data-aos-delay="100">
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6 bg-primary/10 border border-primary/20 text-primary-light">
                                <FontAwesomeIcon icon={faRocket} />
                            </div>
                            <h3 className="text-xl mb-3 font-bold">Lightning Fast Setup</h3>
                            <p className="text-text-muted leading-relaxed text-sm">Clone the repository and run the development servers. No complex configuration steps needed to get your project up and running.</p>
                        </div>

                        <div className="glass-card p-8 md:p-10 relative overflow-hidden group" data-aos="fade-up" data-aos-delay="200">
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-teal to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6 bg-primary/10 border border-primary/20 text-primary-light">
                                <FontAwesomeIcon icon={faShieldHalved} />
                            </div>
                            <h3 className="text-xl mb-3 font-bold">Secure Authentication</h3>
                            <p className="text-text-muted leading-relaxed text-sm">Built-in ASP.NET Core Identity with JWT tokens and secure, role-based access control protecting your API endpoints.</p>
                        </div>

                        <div className="glass-card p-8 md:p-10 relative overflow-hidden group" data-aos="fade-up" data-aos-delay="300">
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6 bg-amber/10 border border-amber/20 text-amber-400">
                                <FontAwesomeIcon icon={faBolt} />
                            </div>
                            <h3 className="text-xl mb-3 font-bold">High Performance</h3>
                            <p className="text-text-muted leading-relaxed text-sm">Powered by Vite for instant server start and HMR, backed by the raw performance of ASP.NET Core for API responses.</p>
                        </div>
                    </div>
                </section>

                {/* Tech Stack Section */}
                <section className="py-20 px-8 bg-surface border-y border-white/5">
                    <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
                        <div data-aos="fade-right">
                            <span className="section-title">Technology</span>
                            <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] mb-5 tracking-[-0.03em]">Built on a modern stack</h2>
                            <p className="text-text-muted leading-relaxed mb-8">We leverage industry-standard technologies to ensure your application is maintainable, scalable, and a joy to work on.</p>
                            
                            <div className="flex flex-wrap gap-2.5">
                                <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3.5 py-1.5 text-sm font-semibold text-text-muted transition-all hover:bg-primary/10 hover:border-primary/25 hover:text-primary-light">React 19</span>
                                <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3.5 py-1.5 text-sm font-semibold text-text-muted transition-all hover:bg-primary/10 hover:border-primary/25 hover:text-primary-light">Vite</span>
                                <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3.5 py-1.5 text-sm font-semibold text-text-muted transition-all hover:bg-primary/10 hover:border-primary/25 hover:text-primary-light">ASP.NET Core 6</span>
                                <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3.5 py-1.5 text-sm font-semibold text-text-muted transition-all hover:bg-primary/10 hover:border-primary/25 hover:text-primary-light">Entity Framework</span>
                                <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3.5 py-1.5 text-sm font-semibold text-text-muted transition-all hover:bg-primary/10 hover:border-primary/25 hover:text-primary-light">JWT Auth</span>
                                <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3.5 py-1.5 text-sm font-semibold text-text-muted transition-all hover:bg-primary/10 hover:border-primary/25 hover:text-primary-light">Tailwind v4</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:bg-primary/5 hover:border-primary/15 hover:-translate-y-1" data-aos="fade-up" data-aos-delay="100">
                                <div className="text-2xl mb-3 text-[#61dafb]">
                                    <FontAwesomeIcon icon={faCode} />
                                </div>
                                <h4 className="text-[0.95rem] mb-1.5">React Frontend</h4>
                                <p className="text-[0.8rem] text-text-dim leading-relaxed">Component-driven architecture with React Router and Context API state management.</p>
                            </div>
                            
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:bg-primary/5 hover:border-primary/15 hover:-translate-y-1" data-aos="fade-up" data-aos-delay="200">
                                <div className="text-2xl mb-3 text-[#512bd4]">
                                    <FontAwesomeIcon icon={faServer} />
                                </div>
                                <h4 className="text-[0.95rem] mb-1.5">ASP.NET Core API</h4>
                                <p className="text-[0.8rem] text-text-dim leading-relaxed">Robust REST API with built-in dependency injection, middleware, and swagger UI.</p>
                            </div>
                            
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:bg-primary/5 hover:border-primary/15 hover:-translate-y-1" data-aos="fade-up" data-aos-delay="300">
                                <div className="text-2xl mb-3 text-[#f59e0b]">
                                    <FontAwesomeIcon icon={faDatabase} />
                                </div>
                                <h4 className="text-[0.95rem] mb-1.5">Entity Framework</h4>
                                <p className="text-[0.8rem] text-text-dim leading-relaxed">Code-first database migrations and strongly typed data access with LINQ.</p>
                            </div>
                            
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:bg-primary/5 hover:border-primary/15 hover:-translate-y-1" data-aos="fade-up" data-aos-delay="400">
                                <div className="text-2xl mb-3 text-[#0ea5e9]">
                                    <FontAwesomeIcon icon={faLayerGroup} />
                                </div>
                                <h4 className="text-[0.95rem] mb-1.5">Tailwind CSS</h4>
                                <p className="text-[0.8rem] text-text-dim leading-relaxed">Utility-first framework replacing complex custom CSS with direct styling primitives.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-8 text-center relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(99,102,241,0.12)_0%,transparent_70%)] pointer-events-none"></div>
                    <div className="relative z-10 max-w-[640px] mx-auto" data-aos="zoom-in">
                        <h2 className="text-[clamp(2rem,5vw,3rem)] mb-5 tracking-[-0.03em]">Ready to start your next project?</h2>
                        <p className="text-text-muted text-lg leading-relaxed mb-10">Join developers who are saving hours of setup time. Clone the template and launch your MVP faster than ever.</p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Link to="/SignUp" className="btn-premium">
                                Create an Account <FontAwesomeIcon icon={faArrowRight} className="text-[0.85em]" />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default Home;
