import React from 'react';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getInterviewsByUserId, getAllFeedbacksByUserId } from '@/lib/actions/general.action';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import DashboardMetrics from '@/components/DashboardMetrics';
import InterviewTimeline from '@/components/InterviewTimeline';
import SkillRadarChart from '@/components/SkillRadarChart';
import dayjs from 'dayjs';

const DashboardPage = async () => {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  const [userInterviews, userFeedbacks] = await Promise.all([
    getInterviewsByUserId(user.id),
    getAllFeedbacksByUserId(user.id)
  ]);

  const interviewCount = userInterviews?.length || 0;
  const completedFeedbacks = userFeedbacks?.length || 0;
  
  const showFirebaseIndexNote = interviewCount > 0 && completedFeedbacks === 0;
  
  const averageScore = userFeedbacks?.length 
    ? Math.round(userFeedbacks.reduce((sum, feedback) => sum + feedback.totalScore, 0) / userFeedbacks.length) 
    : 0;

  const latestInterviewDate = userInterviews?.length && userInterviews[0]?.createdAt
    ? dayjs(userInterviews[0].createdAt).format('MMM D, YYYY')
    : 'N/A';

  const feedbacksByDate = userFeedbacks ? [...userFeedbacks].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  ) : [];
  
  const currentFeedbacks = feedbacksByDate.length > 0 
    ? feedbacksByDate.slice(Math.floor(feedbacksByDate.length / 2)) 
    : [];
  
  const previousFeedbacks = feedbacksByDate.length > 3 
    ? feedbacksByDate.slice(0, Math.floor(feedbacksByDate.length / 2)) 
    : [];
  
  const currentSkillData = currentFeedbacks.length 
    ? calculateAverageSkillScores(currentFeedbacks)
    : [];
    
  const previousSkillData = previousFeedbacks.length 
    ? calculateAverageSkillScores(previousFeedbacks)
    : [];
  
  const latestFeedbackMap = createLatestFeedbackMap(userFeedbacks || []);

  return (
    <div className="dashboard-container flex flex-col gap-8 py-6">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-neutral-300">Track your interview progress and skill development</p>
        </div>
        <Button asChild className="btn-primary">
          <Link href="/interview">Start New Interview</Link>
        </Button>
      </section>

      {/* Metrics Overview */}
      <DashboardMetrics 
        interviewCount={interviewCount} 
        completedFeedbacks={completedFeedbacks} 
        averageScore={averageScore} 
        latestInterviewDate={latestInterviewDate} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Skill Radar Chart */}
        <div className="lg:col-span-1 card-container p-6 rounded-xl bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50">
          <h2 className="text-xl font-semibold mb-4">Skill Analysis</h2>
          <div className="h-[300px] flex items-center justify-center">
            {currentSkillData.length > 0 ? (
              <SkillRadarChart 
                skillData={currentSkillData} 
                previousSkillData={previousSkillData.length > 0 ? previousSkillData : undefined} 
              />
            ) : (
              <div className="text-center text-neutral-400">
                <p>Complete interviews to see your skill analysis</p>
              </div>
            )}
          </div>
        </div>

        {/* Interview Timeline */}
        <div className="lg:col-span-2 card-container p-6 rounded-xl bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50">
          <h2 className="text-xl font-semibold mb-4">Interview History</h2>
          {showFirebaseIndexNote && (
            <div className="bg-amber-900/30 border border-amber-500/20 p-3 rounded-md mb-4">
              <p className="text-amber-300 text-sm">
                You need to create a Firebase index to view your feedback history. 
                <a href="/feedbacks-index.html" target="_blank" rel="noopener" className="text-amber-300 font-medium underline ml-1">
                  Click here to create the required index
                </a>
              </p>
            </div>
          )}
          <div className="h-[400px] overflow-y-auto">
            {userInterviews && userInterviews.length > 0 ? (
              <InterviewTimeline interviews={userInterviews} feedbacks={userFeedbacks || []} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Image src="/empty-state.svg" alt="No interviews" width={120} height={120} className="mb-4 opacity-50" />
                <p className="text-neutral-400 mb-2">You haven't taken any interviews yet</p>
                <Button asChild variant="outline" className="mt-2">
                  <Link href="/interview">Start your first interview</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Interviews Section */}
      {userInterviews && userInterviews.length > 0 && (
        <section className="card-container p-6 rounded-xl bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Interviews</h2>
            {userInterviews.length > 5 && (
              <Button variant="outline" asChild size="sm">
                <Link href="#" className="text-sm">View All</Link>
              </Button>
            )}
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userInterviews.slice(0, 6).map((interview) => {
                const feedback = latestFeedbackMap.get(interview.id);
                const hasFeedback = !!feedback;
                
                return (
                  <div key={interview.id} className="bg-neutral-800/80 p-4 rounded-lg border border-neutral-700/50 hover:border-primary-500/30 transition-all hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Image 
                        src={interview.coverImage || '/default-interview.png'} 
                        alt={interview.role} 
                        width={40} 
                        height={40} 
                        className="rounded-full object-cover size-[40px]" 
                      />
                      <div>
                        <h3 className="font-medium capitalize">{interview.role} Interview</h3>
                        <p className="text-sm text-neutral-400">{dayjs(interview.createdAt).format('MMM D, YYYY')}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex gap-2 items-center">
                        <div className="text-sm bg-primary-500/10 text-primary-300 px-2 py-1 rounded capitalize">
                          {interview.type}
                        </div>
                        {hasFeedback && (
                          <div className="text-sm font-medium">
                            Score: <span className="text-primary-300">{feedback.totalScore}</span>
                          </div>
                        )}
                      </div>
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/interview/${interview.id}`}>
                          Review
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

const createLatestFeedbackMap = (feedbacks: Feedback[]) => {
  const map = new Map<string, Feedback>();
  
  const feedbacksByInterviewId = feedbacks.reduce((acc, feedback) => {
    if (!acc[feedback.interviewId]) {
      acc[feedback.interviewId] = [];
    }
    acc[feedback.interviewId].push(feedback);
    return acc;
  }, {} as Record<string, Feedback[]>);
  
  Object.entries(feedbacksByInterviewId).forEach(([interviewId, interviewFeedbacks]) => {
    const sortedFeedbacks = interviewFeedbacks.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    if (sortedFeedbacks.length > 0) {
      map.set(interviewId, sortedFeedbacks[0]);
    }
  });
  
  return map;
};

const calculateAverageSkillScores = (feedbacks: Feedback[]) => {
  const categoryMap = new Map<string, { sum: number; count: number }>();
  
  feedbacks.forEach(feedback => {
    feedback.categoryScores.forEach(category => {
      const existingCategory = categoryMap.get(category.name);
      if (existingCategory) {
        categoryMap.set(category.name, {
          sum: existingCategory.sum + category.score,
          count: existingCategory.count + 1
        });
      } else {
        categoryMap.set(category.name, { sum: category.score, count: 1 });
      }
    });
  });
  
  return Array.from(categoryMap).map(([name, { sum, count }]) => ({
    name,
    score: Math.round(sum / count)
  }));
};

export default DashboardPage; 