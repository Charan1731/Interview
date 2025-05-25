import React from 'react'
import Agent from '@/components/Agent'
import { getCurrentUser } from '@/lib/actions/auth.action'
import Image from 'next/image'

const page = async  () => {

  const user = await getCurrentUser();

  return (
    <div className="flex flex-col gap-8">
      {/* Enhanced Header Section */}
      <div className="relative">
        {/* Subtle background accents */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-primary-500/20 rounded-full filter blur-2xl opacity-30"></div>
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary-300/20 rounded-full filter blur-xl opacity-40"></div>
        
        <div className="card p-8 relative z-10 border border-neutral-700/50 hover:border-primary-500/20 transition-all duration-300">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-300/20 border border-primary-500/30 flex items-center justify-center">
                <Image src="/icons/ai.svg" alt="AI Interview" width={32} height={32} />
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-white">
                  AI Interview Generator
                </h1>
                <p className="text-light-100">
                  Create personalized interview experiences with AI
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500/20 to-primary-300/20 backdrop-blur-sm rounded-full border border-primary-500/30">
              <div className="w-2 h-2 bg-success-100 rounded-full animate-pulse"></div>
              <span className="text-primary-200 font-medium text-sm">AI-Powered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 border border-neutral-700/50 hover:border-primary-500/20 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
              <Image src="/icons/ai.svg" alt="Personalized" width={16} height={16} />
            </div>
            <h3 className="font-semibold text-white">Personalized</h3>
          </div>
          <p className="text-light-100 text-sm">
            Tailored questions based on your profile and experience level
          </p>
        </div>

        <div className="card p-6 border border-neutral-700/50 hover:border-primary-500/20 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
              <Image src="/icons/feedback.svg" alt="Adaptive" width={16} height={16} />
            </div>
            <h3 className="font-semibold text-white">Adaptive</h3>
          </div>
          <p className="text-light-100 text-sm">
            AI adjusts difficulty and follow-up questions based on your responses
          </p>
        </div>

        <div className="card p-6 border border-neutral-700/50 hover:border-primary-500/20 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
              <Image src="/icons/track.svg" alt="Comprehensive" width={16} height={16} />
            </div>
            <h3 className="font-semibold text-white">Comprehensive</h3>
          </div>
          <p className="text-light-100 text-sm">
            Covers technical, behavioral, and situational interview scenarios
          </p>
        </div>
      </div>

      {/* Instructions Section */}
      <div className="card p-6 border border-neutral-700/50">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
            <Image src="/icons/ai.svg" alt="Instructions" width={20} height={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-3 text-white">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">Start the Session</p>
                    <p className="text-light-100 text-xs">Click the button below to begin your AI interview</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">Share Your Background</p>
                    <p className="text-light-100 text-xs">Tell the AI about your experience and goals</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">Get Custom Questions</p>
                    <p className="text-light-100 text-xs">Receive personalized interview questions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white">4</span>
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">Practice & Improve</p>
                    <p className="text-light-100 text-xs">Use generated questions for interview practice</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Agent Section */}
      <div className="relative">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent rounded-3xl"></div>
        
        <div className="relative z-10">
          <Agent userName={user?.name || ''} userId={user?.id} type="generate"/>
        </div>
      </div>
    </div>
  )
}

export default page