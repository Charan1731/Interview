import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

const LandingPage = () => {

    return (
      <div className="flex flex-col gap-24 py-8 overflow-hidden relative">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200/5 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-primary-300/8 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-primary-200/6 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
  
        <section className="relative min-h-[80vh] flex items-center -mt-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full relative z-10">
            <div className="space-y-10 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-200/10 to-primary-300/10 rounded-full border border-primary-200/20 backdrop-blur-sm group hover:border-primary-200/40 transition-all duration-300">
                <div className="w-2 h-2 bg-primary-200 rounded-full animate-pulse"></div>
                <span className="text-primary-200 font-medium text-sm tracking-wide">AI-Powered Practice Platform</span>
              </div>
  
              {/* Main Heading */}
              <div className="space-y-6">
                <h1 className="text-6xl md:text-7xl font-bold leading-none tracking-tight">
                  <span className="block text-white mb-2">Master Your</span>
                  <span className="relative block">
                    <span className="bg-gradient-to-r from-primary-200 via-primary-300 via-primary-200 via-primary-300 to-primary-200 bg-clip-text text-transparent animate-gradient-x">
                      Career Skills
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-200/20 via-primary-300/20 to-primary-200/20 blur-xl opacity-50 animate-pulse"></div>
                  </span>
                  <span className="block text-white/80 text-4xl md:text-5xl font-normal mt-4">
                    with AI Guidance
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-light-100 max-w-2xl leading-relaxed font-light">
                  Transform your career preparation with AI-powered practice sessions for 
                  <span className="text-primary-200 font-medium">tech interviews</span> and 
                  <span className="text-success-100 font-medium">clinical diagnostics</span>. 
                  Get instant feedback, track progress, and build unshakeable confidence.
                </p>
              </div>
  
              {/* CTA Section */}
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="group relative overflow-hidden bg-gradient-to-r from-primary-200 to-primary-300 hover:from-primary-300 hover:to-primary-200 text-dark-100 font-bold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-200/25">
                    <Link href="/sign-up" className="flex items-center gap-3">
                      <span className="text-lg">Start Free Trial</span>
                      <div className="w-6 h-6 rounded-full bg-dark-100/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  </Button>
                  
                  <Button asChild size="lg" variant="outline" className="group border-2 border-primary-200/30 hover:border-primary-200 bg-transparent text-primary-200 font-bold px-8 py-4 rounded-full transition-all duration-300 hover:bg-primary-200/10">
                    <Link href="/sign-in" className="flex items-center gap-2">
                      <span className="text-lg">Sign In</span>
                    </Link>
                  </Button>
                </div>
  
                {/* Social Proof */}
                <div className="flex items-center gap-6">
                  <div className="flex -space-x-3">
                    {['🚀', '💻', '⚡', '🎯', '🔥'].map((emoji, index) => (
                      <div
                        key={index}
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-dark-200 to-dark-300 border-2 border-primary-200/20 flex items-center justify-center text-lg hover:scale-110 transition-transform duration-200 cursor-pointer"
                        style={{animationDelay: `${index * 0.1}s`}}
                      >
                        {emoji}
                      </div>
                    ))}
                  </div>
                  <div className="text-light-100">
                    <p className="text-lg">
                      <span className="text-white font-bold text-xl">12,000+</span> developers practicing
                    </p>
                    <p className="text-sm text-light-400">Join the community</p>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Hero Visual */}
            <div className="order-1 lg:order-2 flex justify-center relative">
              <div className="relative group">
                {/* Floating elements */}
                <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-primary-200 to-primary-300 rounded-xl opacity-20 rotate-12 animate-bounce" style={{animationDelay: '1s'}}></div>
                <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-gradient-to-br from-primary-300 to-primary-200 rounded-lg opacity-30 rotate-45 animate-bounce" style={{animationDelay: '2s'}}></div>
                
                {/* Main robot image with glow effect */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-200/20 to-primary-300/20 rounded-full filter blur-3xl scale-110 group-hover:scale-125 transition-transform duration-500"></div>
                  <Image
                    src="/robot.png"
                    alt="AI Interview Assistant"
                    width={600}
                    height={600}
                    className="relative object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>
                
                {/* Orbiting elements */}
                <div className="absolute top-1/4 left-0 w-8 h-8 bg-primary-200/30 rounded-full animate-ping"></div>
                <div className="absolute bottom-1/4 right-0 w-6 h-6 bg-primary-300/30 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
          </div>
        </section>
  
        {/* Features Section */}
        <section className="relative py-20">
          <div className="text-center mb-20 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-200/10 to-primary-300/10 rounded-full border border-primary-200/20 backdrop-blur-sm mb-8">
              <span className="text-primary-200 font-medium text-sm tracking-wide">Platform Features</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-white to-light-100 bg-clip-text text-transparent">
              Why Professionals Choose
              <span className="block bg-gradient-to-r from-primary-200 to-primary-300 bg-clip-text text-transparent mt-2">
                Mocksy
              </span>
            </h2>
            
            <p className="text-xl text-light-100 leading-relaxed font-light max-w-2xl mx-auto">
              Experience the future of career preparation with our cutting-edge AI technology for both tech and healthcare professionals
            </p>
          </div>
  
          {/* Main Feature Cards - Tech vs Medical */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Tech Interview Feature */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-200/10 to-primary-300/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              <div className="relative card-border">
                <div className="card p-10 rounded-3xl space-y-8 group-hover:transform group-hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-200/20 to-primary-300/20 border border-primary-200/30 flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                        <Image src="/icons/ai.svg" alt="AI" width={32} height={32} className="filter brightness-0 invert opacity-80" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-200 rounded-full flex items-center justify-center">
                        <span className="text-xs text-dark-100 font-bold">💻</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white">Tech Interviews</h3>
                      <p className="text-primary-200 font-medium">Coding • System Design • Behavioral</p>
                    </div>
                  </div>
                  
                  <p className="text-lg text-light-100 leading-relaxed">
                    Master technical interviews with AI-powered practice sessions. Get real-time feedback on coding problems, system design challenges, and behavioral questions from top tech companies.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary-200 rounded-full"></div>
                      <span className="text-light-100 text-sm">Live Coding Practice</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary-200 rounded-full"></div>
                      <span className="text-light-100 text-sm">System Design Reviews</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary-200 rounded-full"></div>
                      <span className="text-light-100 text-sm">Behavioral Analysis</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary-200 rounded-full"></div>
                      <span className="text-light-100 text-sm">Company-Specific Prep</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Clinical Cases Feature */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-success-100/10 to-success-200/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              <div className="relative card-border">
                <div className="card p-10 rounded-3xl space-y-8 group-hover:transform group-hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-success-100/20 to-success-200/20 border border-success-100/30 flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                        <span className="text-2xl">🩺</span>
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-success-100 rounded-full flex items-center justify-center">
                        <span className="text-xs text-dark-100 font-bold">NEW</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white">Clinical Cases</h3>
                      <p className="text-success-100 font-medium">Diagnostics • Patient Care • Medical Knowledge</p>
                    </div>
                  </div>
                  
                  <p className="text-lg text-light-100 leading-relaxed">
                    Sharpen your diagnostic skills with AI-generated patient cases. Practice clinical reasoning, differential diagnosis, and treatment planning with realistic medical scenarios.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-success-100 rounded-full"></div>
                      <span className="text-light-100 text-sm">AI Patient Simulation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-success-100 rounded-full"></div>
                      <span className="text-light-100 text-sm">Diagnostic Evaluation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-success-100 rounded-full"></div>
                      <span className="text-light-100 text-sm">Medical References</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-success-100 rounded-full"></div>
                      <span className="text-light-100 text-sm">Performance Leaderboard</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Supporting Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            {/* Real-time Feedback */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-yellow-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              <div className="relative card-border">
                <div className="card p-8 rounded-2xl flex flex-col items-center text-center space-y-6 group-hover:transform group-hover:scale-105 transition-all duration-300">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-400/20 border border-yellow-500/30 flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                      <Image src="/icons/feedback.svg" alt="Feedback" width={40} height={40} className="filter brightness-0 invert opacity-80" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-dark-100 text-xs font-bold">⚡</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-white">Real-time Feedback</h3>
                    <p className="text-light-100 leading-relaxed">
                      Get instant, detailed feedback on your performance with actionable insights for improvement across both domains.
                    </p>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Progress Analytics */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-purple-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              <div className="relative card-border">
                <div className="card p-8 rounded-2xl flex flex-col items-center text-center space-y-6 group-hover:transform group-hover:scale-105 transition-all duration-300">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-400/20 border border-purple-500/30 flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                      <Image src="/icons/track.svg" alt="Analytics" width={40} height={40} className="filter brightness-0 invert opacity-80" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-dark-100 text-xs font-bold">📊</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-white">Progress Analytics</h3>
                    <p className="text-light-100 leading-relaxed">
                      Monitor your improvement with detailed analytics, skill tracking, and performance insights for both tech and medical practice.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
  
        {/* Testimonial Section */}
        <section className="relative py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-200/10 to-primary-300/10 rounded-full border border-primary-200/20 backdrop-blur-sm mb-8">
                <span className="text-primary-200 font-medium text-sm tracking-wide">Success Stories</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-white to-light-100 bg-clip-text text-transparent">
                Trusted by Professionals
                <span className="block bg-gradient-to-r from-primary-200 to-primary-300 bg-clip-text text-transparent mt-2">
                  Across Industries
                </span>
              </h2>
            </div>
  
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Tech Professional Testimonial */}
              <div className="relative">
                <div className="card-border">
                  <div className="card p-8 rounded-2xl relative">
                    <div className="absolute top-6 right-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-200/20 to-primary-300/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">💻</span>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex text-primary-200 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <blockquote className="text-lg text-light-100 leading-relaxed mb-6 italic">
                        "Mocksy's AI interviews were incredibly realistic. The coding challenges and system design feedback helped me ace my Google interview. The platform's depth is unmatched."
                      </blockquote>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-200 to-primary-300 rounded-full blur opacity-50"></div>
                        <Image 
                          src="/user-avatar.png" 
                          alt="Jennifer Smith" 
                          width={48} 
                          height={48} 
                          className="relative rounded-full border-2 border-primary-200/30" 
                        />
                      </div>
                      <div>
                        <p className="font-bold text-white">Jennifer Smith</p>
                        <p className="text-primary-200 font-medium text-sm">Senior Software Engineer</p>
                        <p className="text-light-400 text-xs">Google • 2024</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Medical Professional Testimonial */}
              <div className="relative">
                <div className="card-border">
                  <div className="card p-8 rounded-2xl relative">
                    <div className="absolute top-6 right-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-success-100/20 to-success-200/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🩺</span>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex text-success-100 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <blockquote className="text-lg text-light-100 leading-relaxed mb-6 italic">
                        "The clinical case simulator is revolutionary! The AI patients respond so realistically, and the diagnostic feedback has sharpened my clinical reasoning significantly."
                      </blockquote>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-success-100 to-success-200 rounded-full blur opacity-50"></div>
                        <Image 
                          src="/user-avatar.png" 
                          alt="Dr. Michael Chen" 
                          width={48} 
                          height={48} 
                          className="relative rounded-full border-2 border-success-100/30" 
                        />
                      </div>
                      <div>
                        <p className="font-bold text-white">Dr. Michael Chen</p>
                        <p className="text-success-100 font-medium text-sm">Internal Medicine Resident</p>
                        <p className="text-light-400 text-xs">Johns Hopkins • 2024</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
  
        {/* Final CTA Section */}
        <section className="relative">
          <div className="card-border w-full">
            <div className="card p-12 rounded-2xl relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary-200/10 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-primary-300/10 to-transparent rounded-full translate-y-36 -translate-x-36"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                      <span className="text-white block">Ready to Advance</span>
                      <span className="bg-gradient-to-r from-primary-200 to-primary-300 bg-clip-text text-transparent block">
                        Your Career?
                      </span>
                    </h2>
                    <p className="text-xl text-light-100 leading-relaxed font-light">
                      Join thousands of professionals who have transformed their careers with our AI-powered platform for both tech and healthcare.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild className="group bg-gradient-to-r from-primary-200 to-primary-300 hover:from-primary-300 hover:to-primary-200 text-dark-100 font-bold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-200/25">
                      <Link href="/sign-up" className="flex items-center gap-3">
                        <span className="text-lg">Start Free Trial</span>
                        <div className="transition-transform duration-300 group-hover:translate-x-1">
                          🚀
                        </div>
                      </Link>
                    </Button>
                    
                    <Button asChild variant="outline" className="group border-2 border-success-100/30 hover:border-success-100 bg-transparent text-success-100 font-bold px-8 py-4 rounded-full transition-all duration-300 hover:bg-success-100/10">
                      <Link href="/clinical-cases" className="flex items-center gap-2">
                        <span className="text-lg">Try Clinical Cases</span>
                        🩺
                      </Link>
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-center lg:justify-end">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-200/20 to-primary-300/20 rounded-full filter blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                    <Image 
                      src="/robot.png" 
                      alt="AI Assistant" 
                      width={300} 
                      height={300} 
                      className="relative object-contain group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };
  
  export default LandingPage
  