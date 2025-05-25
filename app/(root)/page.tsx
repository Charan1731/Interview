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
        {/* Subtle background accents */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-500/30 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-primary-300/30 rounded-full filter blur-3xl opacity-20"></div>

        {/* Text Content */}
        <div className="flex-1 space-y-8 z-10 -mt-20">
          <div className="inline-block px-4 py-2 bg-primary-500/10 rounded-full mb-4 backdrop-blur-sm">
            <p className="text-primary-200 font-medium text-sm">AI-Powered Interview Practice</p>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            <span className="text-primary-200 block">Master Your Tech Interviews</span>
            <span className="text-white block mt-2">With AI Guidance</span>
          </h1>

          <p className="text-xl text-light-100 max-w-xl">
            Get ready for your next job interview with personalised AI practice sessions.
            Receive instant feedback, track your progress, and build confidence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild size="lg" className="btn-primary relative overflow-hidden group">
              <Link href="/sign-up" className="flex items-center gap-2">
                <span>Sign Up Free</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="btn-secondary">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-4 pt-6">
            <div className="flex -space-x-2">
              {['JD', 'SK', 'ML'].map((initials) => (
                <div
                  key={initials}
                  className="w-8 h-8 rounded-full bg-dark-200 flex items-center justify-center text-xs border border-primary-900"
                >
                  {initials}
                </div>
              ))}
            </div>
            <p className="text-sm text-light-100">
              <span className="text-white font-medium">1,200+</span> developers use our platform
            </p>
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex-1 flex justify-center relative">
          <Image
            src="/robot.png"
            alt="AI Interview Assistant"
            width={500}
            height={500}
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-block px-4 py-2 bg-primary-500/10 rounded-full mb-4">
            <p className="text-primary-200 font-medium text-sm">Why Choose Our Platform</p>
          </div>
          <h2 className="text-4xl font-bold mb-4">Supercharge Your Interview Skills</h2>
          <p className="text-light-100 text-lg">
            Our AI-powered platform helps you prepare for technical interviews effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature Card 1 */}
          <div className="card p-8 rounded-xl flex flex-col items-center text-center border border-neutral-700/50 hover:border-primary-500/20 transition-all">
            <div className="w-16 h-16 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-4">
              <Image src="/icons/ai.svg" alt="AI" width={32} height={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Interviews</h3>
            <p className="text-light-100">
              Practice with our intelligent AI that adapts to your skill level and provides realistic scenarios.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="card p-8 rounded-xl flex flex-col items-center text-center border border-neutral-700/50 hover:border-primary-500/20 transition-all">
            <div className="w-16 h-16 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-4">
              <Image src="/icons/feedback.svg" alt="Feedback" width={32} height={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Feedback</h3>
            <p className="text-light-100">
              Get detailed feedback on your answers, with suggestions for improvement.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="card p-8 rounded-xl flex flex-col items-center text-center border border-neutral-700/50 hover:border-primary-500/20 transition-all">
            <div className="w-16 h-16 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-4">
              <Image src="/icons/track.svg" alt="Progress" width={32} height={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-light-100">
              Monitor your improvement over time with clear analytics and metrics.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-12 text-center max-w-3xl mx-auto">
        <svg className="w-10 h-10 mx-auto mb-6 text-primary-300/60" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
        </svg>
        <p className="text-2xl italic font-light mb-6 text-light-100">
          "This platform transformed my interview preparation. The realistic AI interviews and detailed feedback helped me land my dream job."
        </p>
        <div className="flex items-center justify-center gap-3">
          <Image src="/user-avatar.png" alt="User" width={48} height={48} className="rounded-full" />
          <div className="text-left">
            <p className="font-medium">Jennifer Smith</p>
            <p className="text-sm text-light-100">Software Engineer @ Google</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="card-cta">
        <div className="flex flex-col gap-4">
          <h2>Ready to Ace Your Next Interview?</h2>
          <p className="text-light-100 text-lg">
            Join thousands who have improved their interview skills with our platform.
          </p>
          <Button asChild className="btn-primary max-w-fit mt-2">
            <Link href="/sign-up">Get Started Today</Link>
          </Button>
        </div>
        <Image src="/robot.png" alt="Robot" width={200} height={200} className="max-sm:hidden" />
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
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className='btn-primary max-sm:w-full'>
              <Link href="/interview">Start an interview</Link>
            </Button>
            <Button asChild className='btn-secondary max-sm:w-full'>
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </div>
        <Image 
          src="/robot.png" 
          alt="robot" 
          width={400} 
          height={400} 
          className="max-sm:hidden" 
          priority
        />
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