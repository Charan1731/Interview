import { getInterviewById } from '@/lib/actions/general.action';
import React from 'react'
import { redirect } from 'next/navigation';
import Image from 'next/image';
import DisplayTechIcons from '@/components/DisplayTechIcons';
import { getCurrentUser } from '@/lib/actions/auth.action';
import Agent from '@/components/Agent';

const page = async({params}: RouteParams) => {

  const { id } = await params; 

  const user = await getCurrentUser();

  const interview = await getInterviewById(id);

  if(!interview){
    redirect('/');
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Enhanced Header Section */}
      <div className="relative">
        {/* Subtle background accents */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-primary-500/20 rounded-full filter blur-2xl opacity-30"></div>
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary-300/20 rounded-full filter blur-xl opacity-40"></div>
        
        <div className="card p-8 relative z-10 border border-neutral-700/50 hover:border-primary-500/20 transition-all duration-300">
          <div className='flex flex-col lg:flex-row justify-between gap-6'>
            <div className='flex flex-col sm:flex-row gap-6 items-start sm:items-center'>
              <div className='flex flex-row gap-4 items-center'>
                <div className="relative">
                  <Image 
                    src={interview.coverImage || ''} 
                    alt='cover' 
                    width={56} 
                    height={56} 
                    className='rounded-2xl object-cover size-14 border-2 border-primary-500/20' 
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary-500 rounded-full border-2 border-dark-100"></div>
                </div>
                <div className="flex flex-col gap-1">
                  <h1 className='text-2xl font-bold capitalize text-white'>
                    {interview.role} Interview
                  </h1>
                  <p className="text-light-100 text-sm">
                    Prepare for your next opportunity
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-light-100 font-medium">Tech Stack:</span>
                <DisplayTechIcons techStack={interview.techstack}/>
              </div>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-2">
              <div className='bg-gradient-to-r from-primary-500/20 to-primary-300/20 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-500/30'>
                <p className='text-primary-200 font-semibold capitalize text-sm'>
                  {interview.type} Interview
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-light-100">
                <div className="w-2 h-2 bg-success-100 rounded-full animate-pulse"></div>
                <span>AI-Powered Session</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interview Progress Indicator */}
      <div className="card p-6 border border-neutral-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Interview Progress</h3>
          <span className="text-sm text-light-100">Ready to begin</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
              <span className="text-xs font-bold text-white">1</span>
            </div>
            <span className="text-sm text-white font-medium">Setup</span>
          </div>
          <div className="flex-1 h-1 bg-neutral-700 rounded-full">
            <div className="h-full w-1/3 bg-primary-500 rounded-full"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center">
              <span className="text-xs font-bold text-neutral-400">2</span>
            </div>
            <span className="text-sm text-neutral-400 font-medium">Interview</span>
          </div>
          <div className="flex-1 h-1 bg-neutral-700 rounded-full"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center">
              <span className="text-xs font-bold text-neutral-400">3</span>
            </div>
            <span className="text-sm text-neutral-400 font-medium">Feedback</span>
          </div>
        </div>
      </div>

      {/* Interview Instructions Section */}
      <div className="card p-6 border border-neutral-700/50">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
            <Image src="/icons/ai.svg" alt="AI" width={20} height={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 text-white">Interview Guidelines</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 text-light-100 text-sm">
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  Speak clearly and at a natural pace
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  Take your time to think before answering
                </p>
              </div>
              <div className="space-y-2 text-light-100 text-sm">
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  Ask for clarification if needed
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  Be authentic and showcase your experience
                </p>
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
          <Agent 
            userName={user?.name || ''} 
            userId={user?.id} 
            interviewId={id} 
            type="interview" 
            questions={interview.questions} 
          />
        </div>
      </div>
    </div>
  )
}

export default page