import React from 'react';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getInterviewsByUserId, getAllFeedbacksByUserId } from '@/lib/actions/general.action';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import DashboardMetrics from '@/components/DashboardMetrics';
import EnhancedInterviewTimeline from '@/components/EnhancedInterviewTimeline';
import EnhancedAnalyticsDashboard from '@/components/EnhancedAnalyticsDashboard';
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
        {/* Enhanced Analytics Dashboard */}
        <EnhancedAnalyticsDashboard 
          currentSkillData={currentSkillData}
          previousSkillData={previousSkillData}
          feedbacks={userFeedbacks || []}
        />

        {/* Interview Timeline - Updated to use enhanced version */}
        <div className="lg:col-span-1 card-container p-6 rounded-xl bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50">
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
          <div className="h-[550px] overflow-y-auto pr-2">
            {userInterviews && userInterviews.length > 0 ? (
              <EnhancedInterviewTimeline interviews={userInterviews} feedbacks={userFeedbacks || []} />
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

      {/* Recent Interviews Section - Removing since we have better timeline now */}
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