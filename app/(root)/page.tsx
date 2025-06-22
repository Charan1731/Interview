import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import InterviewCard from '@/components/InterviewCard'
import { getCurrentUser, isAuthenticated } from '@/lib/actions/auth.action'
import { getInterviewsByUserId, getAllInterviews } from '@/lib/actions/general.action'

const LandingPage = () => {
  return (
    <div className="flex flex-col gap-24 py-8 overflow-hidden relative">
      {/* Ambient background effects */}
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
              <span className="text-primary-200 font-medium text-sm tracking-wide">AI-Powered Interview Practice</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl font-bold leading-none tracking-tight">
                <span className="block text-white mb-2">Master Your</span>
                <span className="relative block">
                  <span className="bg-gradient-to-r from-primary-200 via-primary-300 via-primary-200 via-primary-300 to-primary-200 bg-clip-text text-transparent animate-gradient-x">
                    Tech Interviews
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-200/20 via-primary-300/20 to-primary-200/20 blur-xl opacity-50 animate-pulse"></div>
                </span>
                <span className="block text-white/80 text-4xl md:text-5xl font-normal mt-4">
                  with AI Guidance
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-light-100 max-w-2xl leading-relaxed font-light">
                Transform your interview preparation with AI-powered practice sessions. 
                Get <span className="text-primary-200 font-medium">instant feedback</span>, track progress, and build unshakeable confidence.
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
            Why Developers Choose
            <span className="block bg-gradient-to-r from-primary-200 to-primary-300 bg-clip-text text-transparent mt-2">
              Mocksy
            </span>
          </h2>
          
          <p className="text-xl text-light-100 leading-relaxed font-light max-w-2xl mx-auto">
            Experience the future of interview preparation with our cutting-edge AI technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Feature Card 1 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-200/10 to-primary-300/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            <div className="relative card-border">
              <div className="card p-8 rounded-2xl flex flex-col items-center text-center space-y-6 group-hover:transform group-hover:scale-105 transition-all duration-300">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-200/20 to-primary-300/20 border border-primary-200/30 flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                    <Image src="/icons/ai.svg" alt="AI" width={40} height={40} className="filter brightness-0 invert opacity-80" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-200 rounded-full flex items-center justify-center">
                    <span className="text-dark-100 text-xs font-bold">AI</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white">Intelligent AI Interviews</h3>
                  <p className="text-light-100 leading-relaxed">
                    Practice with our adaptive AI that learns your weaknesses and tailors questions to your experience level.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Card 2 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-200/10 to-primary-300/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            <div className="relative card-border">
              <div className="card p-8 rounded-2xl flex flex-col items-center text-center space-y-6 group-hover:transform group-hover:scale-105 transition-all duration-300">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-200/20 to-primary-300/20 border border-primary-200/30 flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                    <Image src="/icons/feedback.svg" alt="Feedback" width={40} height={40} className="filter brightness-0 invert opacity-80" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-success-100 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white">Real-time Feedback</h3>
                  <p className="text-light-100 leading-relaxed">
                    Get instant, actionable feedback on your responses with detailed improvement suggestions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Card 3 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-200/10 to-primary-300/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            <div className="relative card-border">
              <div className="card p-8 rounded-2xl flex flex-col items-center text-center space-y-6 group-hover:transform group-hover:scale-105 transition-all duration-300">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-200/20 to-primary-300/20 border border-primary-200/30 flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                    <Image src="/icons/track.svg" alt="Progress" width={40} height={40} className="filter brightness-0 invert opacity-80" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-300 rounded-full flex items-center justify-center">
                    <span className="text-dark-100 text-xs">📊</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white">Progress Analytics</h3>
                  <p className="text-light-100 leading-relaxed">
                    Monitor your improvement with detailed analytics, skill tracking, and performance insights.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="relative py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            {/* Quote icon with glow */}
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-200 to-primary-300 rounded-full blur-lg opacity-30"></div>
              <div className="relative w-16 h-16 bg-gradient-to-r from-primary-200 to-primary-300 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-dark-100" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                </svg>
              </div>
            </div>

            <blockquote className="text-3xl md:text-4xl font-light leading-relaxed mb-10 text-light-100 italic">
              "Mocksy transformed my interview preparation. The realistic AI scenarios and detailed feedback helped me land my dream role at 
              <span className="text-primary-200 font-medium"> Google</span>."
            </blockquote>

            <div className="flex items-center justify-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-200 to-primary-300 rounded-full blur opacity-50"></div>
                <Image 
                  src="/user-avatar.png" 
                  alt="Jennifer Smith" 
                  width={64} 
                  height={64} 
                  className="relative rounded-full border-2 border-primary-200/30" 
                />
              </div>
              <div className="text-left">
                <p className="font-bold text-xl text-white">Jennifer Smith</p>
                <p className="text-primary-200 font-medium">Senior Software Engineer</p>
                <p className="text-light-400 text-sm">Google • 2024</p>
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
                    <span className="text-white block">Ready to Ace Your</span>
                    <span className="bg-gradient-to-r from-primary-200 to-primary-300 bg-clip-text text-transparent block">
                      Next Interview?
                    </span>
                  </h2>
                  <p className="text-xl text-light-100 leading-relaxed font-light">
                    Join thousands of developers who have transformed their careers with our AI-powered platform.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="group bg-gradient-to-r from-primary-200 to-primary-300 hover:from-primary-300 hover:to-primary-200 text-dark-100 font-bold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-200/25">
                    <Link href="/sign-up" className="flex items-center gap-3">
                      <span className="text-lg">Start Your Journey</span>
                      <div className="transition-transform duration-300 group-hover:translate-x-1">
                        ✨
                      </div>
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

const AuthenticatedHomePage = async () => {
  const user = await getCurrentUser();

  const [userInterviews, allInterviews] = await Promise.all([
    getInterviewsByUserId(user?.id || ""),
    getAllInterviews({userId: user?.id || ""})
  ]);

  const hasPastInterviews = userInterviews?.length ?? 0 > 0;
  const hasAllInterviews = allInterviews?.length ?? 0 > 0;

  return (
    <div className="space-y-16">
      {/* Enhanced CTA Section for authenticated users */}
      <section className="relative">
        <div className="card-border w-full">
          <div className="card p-12 rounded-2xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-200/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-primary-300/10 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-success-100/10 to-primary-200/10 rounded-full border border-success-100/20">
                    <div className="w-2 h-2 bg-success-100 rounded-full animate-pulse"></div>
                    <span className="text-success-100 font-medium text-sm">Welcome back!</span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                    <span className="text-white block">Continue Your</span>
                    <span className="bg-gradient-to-r from-primary-200 to-primary-300 bg-clip-text text-transparent block">
                      Interview Journey
                    </span>
                  </h2>
                  
                  <p className="text-xl text-light-100 leading-relaxed font-light">
                    Ready to practice? Get AI-powered feedback and track your progress with advanced analytics.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="group bg-gradient-to-r from-primary-200 to-primary-300 hover:from-primary-300 hover:to-primary-200 text-dark-100 font-bold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-200/25">
                    <Link href="/interview" className="flex items-center gap-3">
                      <span className="text-lg">Start Interview</span>
                      <div className="transition-transform duration-300 group-hover:translate-x-1">
                        🚀
                      </div>
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="group border-2 border-primary-200/30 hover:border-primary-200 bg-transparent text-primary-200 font-bold px-8 py-4 rounded-full transition-all duration-300 hover:bg-primary-200/10">
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <span className="text-lg">View Dashboard</span>
                      📊
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
                    width={400} 
                    height={400} 
                    className="relative object-contain group-hover:scale-110 transition-transform duration-500" 
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Your Interviews Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-light-100 bg-clip-text text-transparent">Your Interviews</h2>
          <div className="h-px bg-gradient-to-r from-primary-200/50 to-transparent flex-1"></div>
        </div>
        
        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard key={interview.id} {...interview}/>
            ))
          ) : (
            <div className="card-border w-full">
              <div className="card p-12 rounded-2xl text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-200/20 to-primary-300/20 rounded-full flex items-center justify-center">
                  <span className="text-4xl">🎯</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">No interviews yet</h3>
                  <p className="text-light-100">Start your first AI-powered interview session!</p>
                </div>
                <Button asChild className="bg-gradient-to-r from-primary-200 to-primary-300 text-dark-100 font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform duration-200">
                  <Link href="/interview">Take Your First Interview</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Available Interviews Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-light-100 bg-clip-text text-transparent">Available Interviews</h2>
          <div className="h-px bg-gradient-to-r from-primary-200/50 to-transparent flex-1"></div>
        </div>
        
        <div className="interviews-section">
          {hasAllInterviews ? (
            allInterviews?.map((interview) => (
              <InterviewCard key={interview.id} {...interview}/>
            ))
          ) : (
            <div className="card-border w-full">
              <div className="card p-12 rounded-2xl text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-200/20 to-primary-300/20 rounded-full flex items-center justify-center">
                  <span className="text-4xl">📚</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">No interviews available</h3>
                  <p className="text-light-100">Check back soon for new interview opportunities!</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const Page = async () => {
  const userAuthenticated = await isAuthenticated();
  
  return userAuthenticated ? <AuthenticatedHomePage /> : <LandingPage />;
};

export default Page;