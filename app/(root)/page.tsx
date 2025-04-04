import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { dummyInterviews } from '@/constants'
import InterviewCard from '@/components/InterviewCard'
import { getAllInterviews, getCurrentUser, getInterviewsByUserId } from '@/lib/actions/auth.action'

const page = async() => {

  const user = await getCurrentUser();

  const [userInterviews, allInterviews] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getAllInterviews({userId: user?.id!})
  ])

  const hasPastInterviews = userInterviews?.length > 0;

  const hasAllInterviews = allInterviews?.length > 0;

  return (
    <>
      <section className='card-cta mt-10'>
        <div className='flex flex-col gap-6 max-lg'>
          <h2>Get Interview Ready with AI Powered Practice and Feedback</h2>
          <p className='text-lg'>Practice Job Interviews with AI</p>
          <Button asChild className='btn-primary max-sm:w-full'>
            <Link href="/interview">Start and interview</Link>
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
  )
}

export default page