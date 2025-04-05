import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import InterviewCard from '@/components/InterviewCard'
import { getCurrentUser, isAuthenticated } from '@/lib/actions/auth.action'
import { getInterviewsByUserId, getAllInterviews } from '@/lib/actions/general.action'

const LandingPage = () => {
  return (
    <div className="flex flex-col gap-16 py-8 overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex flex-col-reverse md:flex-row items-center gap-8 md:gap-16 py-12">
        {/* Background gradient elements */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-500/30 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-primary-300/30 rounded-full filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        
        <div className="flex-1 space-y-8 z-10 -mt-20">
          <div className="inline-block px-4 py-2 bg-primary-500/10 rounded-full mb-4 backdrop-blur-sm">
            <p className="text-primary-200 font-medium text-sm">AI-Powered Interview Practice</p>
          </div>
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-bold">
              <span className="text-primary-200">Master Your Tech Interviews</span>
              <span className="block mt-2 text-white">With AI Guidance</span>
            </h1>
          </div>
          <p className="text-xl text-neutral-300 max-w-xl">
            Get ready for your next job interview with personalized AI practice sessions. 
            Receive instant feedback, track your progress, and build confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild size="lg" className="btn-primary relative overflow-hidden group">
              <Link href="/sign-up" className="flex items-center gap-2">
                <span>Sign Up Free</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-300/30 hover:bg-primary-500/10 transition-all">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
          <div className="flex items-center gap-4 pt-6">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs border border-primary-900">JD</div>
              <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs border border-primary-900">SK</div>
              <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs border border-primary-900">ML</div>
            </div>
            <p className="text-sm text-neutral-400"><span className="text-white font-medium">1,200+</span> developers use our platform</p>
          </div>
        </div>
        <div className="flex-1 flex justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-primary-300/5 rounded-full filter blur-3xl"></div>
          <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-primary-300 rounded-full opacity-30 blur"></div>
            <div className="relative bg-neutral-900/80 backdrop-blur-sm p-4 rounded-2xl border border-primary-500/10">
              <Image 
                src="/robot.png" 
                alt="AI Interview Assistant" 
                width={500} 
                height={500} 
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/0 via-primary-900/10 to-neutral-900/0"></div>
        <div className="relative z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="inline-block px-4 py-2 bg-primary-500/10 rounded-full mb-4">
              <p className="text-primary-200 font-medium text-sm">Why Choose Our Platform</p>
            </div>
            <h2 className="text-4xl font-bold mb-4">Supercharge Your Interview Skills</h2>
            <p className="text-neutral-300 text-lg">Our AI-powered platform helps you prepare for technical interviews effectively</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 rounded-xl bg-neutral-800/50 backdrop-blur-sm flex flex-col items-center text-center hover:shadow-xl hover:shadow-primary-500/5 hover:bg-neutral-800/70 hover:-translate-y-1 transition-all duration-300 border border-neutral-700/50">
              <div className="w-20 h-20 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-6 transform hover:rotate-6 transition-transform duration-300">
                <Image src="/icons/ai.svg" alt="AI" width={40} height={40} />
              </div>
              <h3 className="text-2xl font-semibold mb-3">AI-Powered Interviews</h3>
              <p className="text-neutral-300">Practice with our intelligent AI that adapts to your skill level and provides realistic interview scenarios.</p>
            </div>
            <div className="card p-8 rounded-xl bg-neutral-800/50 backdrop-blur-sm flex flex-col items-center text-center hover:shadow-xl hover:shadow-primary-500/5 hover:bg-neutral-800/70 hover:-translate-y-1 transition-all duration-300 border border-neutral-700/50">
              <div className="w-20 h-20 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-6 transform hover:rotate-6 transition-transform duration-300">
                <Image src="/icons/feedback.svg" alt="Feedback" width={40} height={40} />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Instant Feedback</h3>
              <p className="text-neutral-300">Get detailed feedback on your answers, with suggestions for improvement and personalized learning paths.</p>
            </div>
            <div className="card p-8 rounded-xl bg-neutral-800/50 backdrop-blur-sm flex flex-col items-center text-center hover:shadow-xl hover:shadow-primary-500/5 hover:bg-neutral-800/70 hover:-translate-y-1 transition-all duration-300 border border-neutral-700/50">
              <div className="w-20 h-20 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-6 transform hover:rotate-6 transition-transform duration-300">
                <Image src="/icons/track.svg" alt="Progress" width={40} height={40} />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Track Progress</h3>
              <p className="text-neutral-300">Monitor your improvement over time with detailed analytics and performance metrics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-12 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>
        <div className="max-w-3xl mx-auto text-center py-8 px-4">
          <svg className="w-12 h-12 mx-auto mb-6 text-primary-300/60" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
          </svg>
          <p className="text-2xl italic font-light mb-6 text-neutral-200">
            This platform completely transformed my interview preparation. The realistic AI interviews and detailed feedback helped me land my dream job at a top tech company.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Image src="/user-avatar.png" alt="user-avatar" width={540} height={540} className="w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center text-lg border-2 border-primary-500/20" />
            <div>
              <p className="font-medium">Jennifer Smith</p>
              <p className="text-sm text-neutral-400">Software Engineer @ Google</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="card-cta py-16 px-8 rounded-2xl bg-gradient-to-r from-primary-900/80 to-primary-700/40 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Ready to Ace Your Next Interview?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-neutral-300">Join thousands of job seekers who have improved their interview skills with our platform.</p>
          <Button asChild size="lg" className="btn-primary px-8 py-6 text-lg relative overflow-hidden group">
            <Link href="/sign-up" className="flex items-center gap-2">
              <span>Get Started Today</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
          </Button>
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
    <>
      <section className='card-cta mt-10'>
        <div className='flex flex-col gap-6 max-lg'>
          <h2>Get Interview Ready with AI Powered Practice and Feedback</h2>
          <p className='text-lg'>Practice Job Interviews with AI</p>
          <Button asChild className='btn-primary max-sm:w-full'>
            <Link href="/interview">Start an interview</Link>
          </Button>
        </div>
        <Image src="/robot.png" alt="robot" width={400} height={400} className="max-sm:hidden" />
      </section>
      <section className='flex flex-col gap-6 mt-8'>
        <h2>Your Interviews</h2>
        <div className='interviews-section'>
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard key={interview.id} {...interview}/>
            ))
          ) : (
            <p>You have not taken any interviews yet</p>
          )}
        </div>
      </section>
      <section className='flex flex-col gap-6 mt-8'>
        <h2>Take an Interview</h2>
        <div className='interviews-section'>
          {hasAllInterviews ? (
            allInterviews?.map((interview) => (
              <InterviewCard key={interview.id} {...interview}/>
            ))
          ) : (
            <p>No interviews found</p>
          )}
        </div>
      </section>
    </>
  );
};

const Page = async () => {
  const userAuthenticated = await isAuthenticated();
  
  return userAuthenticated ? <AuthenticatedHomePage /> : <LandingPage />;
};

export default Page;