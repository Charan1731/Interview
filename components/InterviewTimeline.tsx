import React from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { AlarmClockCheck, Clock, Medal, TrendingUp, TrendingDown } from 'lucide-react';

interface InterviewTimelineProps {
  interviews: Interview[];
  feedbacks: Feedback[];
}

const InterviewTimeline = ({ interviews, feedbacks }: InterviewTimelineProps) => {
  // Create a map of latest feedback by interviewId for quick lookup
  const feedbackMap = new Map<string, Feedback>();
  
  // Group all feedbacks by interviewId
  const feedbacksByInterviewId = feedbacks.reduce((acc, feedback) => {
    if (!acc[feedback.interviewId]) {
      acc[feedback.interviewId] = [];
    }
    acc[feedback.interviewId].push(feedback);
    return acc;
  }, {} as Record<string, Feedback[]>);
  
  // For each interview, get the latest feedback based on createdAt date
  Object.entries(feedbacksByInterviewId).forEach(([interviewId, interviewFeedbacks]) => {
    // Sort feedbacks by createdAt in descending order (newest first)
    const sortedFeedbacks = interviewFeedbacks.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // Store the latest feedback in the map
    if (sortedFeedbacks.length > 0) {
      feedbackMap.set(interviewId, sortedFeedbacks[0]);
    }
  });

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-neutral-700/50"></div>
      
      <div className="space-y-5">
        {interviews.map((interview, index) => {
          const hasFeedback = feedbackMap.has(interview.id);
          const feedback = feedbackMap.get(interview.id);
          
          // Get the previous feedback score if available for comparison
          const feedbackHistory = feedbacksByInterviewId[interview.id] || [];
          const hasPreviousFeedback = feedbackHistory.length > 1;
          const previousFeedback = hasPreviousFeedback ? feedbackHistory[1] : null;
          const scoreImprovement = hasPreviousFeedback && feedback 
            ? feedback.totalScore - previousFeedback!.totalScore 
            : 0;
          
          return (
            <div key={interview.id} className="relative pl-12">
              {/* Timeline marker */}
              <div className="absolute left-0 top-2 w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center z-10 border-2 border-neutral-800">
                {hasFeedback ? (
                  <Medal className="w-4 h-4 text-primary-300" />
                ) : (
                  <Clock className="w-4 h-4 text-neutral-400" />
                )}
              </div>
              
              {/* Interview card */}
              <div className="bg-neutral-800/70 p-4 rounded-lg border border-neutral-700/50 hover:border-primary-500/30 transition-all">
                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <div>
                    <h3 className="font-medium capitalize mb-1">{interview.role} Interview</h3>
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                      <AlarmClockCheck className="w-3.5 h-3.5" />
                      <span>{dayjs(interview.createdAt).format('MMM D, YYYY h:mm A')}</span>
                    </div>
                  </div>
                  
                  {hasFeedback && feedback && (
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1">
                          <div className="text-sm font-medium">
                            Score: <span className="text-primary-300">{feedback.totalScore}</span>
                          </div>
                          {hasPreviousFeedback && (
                            <div className="flex items-center text-xs">
                              {scoreImprovement > 0 ? (
                                <span className="text-green-400 flex items-center">
                                  <TrendingUp className="w-3 h-3 mr-0.5" />+{scoreImprovement}
                                </span>
                              ) : scoreImprovement < 0 ? (
                                <span className="text-red-400 flex items-center">
                                  <TrendingDown className="w-3 h-3 mr-0.5" />{scoreImprovement}
                                </span>
                              ) : null}
                            </div>
                          )}
                        </div>
                        {hasPreviousFeedback && (
                          <div className="text-xs text-neutral-400">
                            {feedbackHistory.length > 1 ? `${feedbackHistory.length} attempts` : "1 attempt"}
                          </div>
                        )}
                      </div>
                      <Link 
                        href={`/interview/${interview.id}/feedback`}
                        className="text-sm text-primary-300 hover:text-primary-200 underline-offset-2 hover:underline"
                      >
                        View Feedback
                      </Link>
                    </div>
                  )}
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <div className="text-xs bg-neutral-700/50 text-neutral-300 px-2 py-1 rounded capitalize">
                    {interview.type}
                  </div>
                  {interview.techstack.slice(0, 3).map((tech, i) => (
                    <div key={i} className="text-xs bg-primary-500/10 text-primary-300 px-2 py-1 rounded">
                      {tech}
                    </div>
                  ))}
                  {interview.techstack.length > 3 && (
                    <div className="text-xs bg-neutral-700/50 text-neutral-300 px-2 py-1 rounded">
                      +{interview.techstack.length - 3} more
                    </div>
                  )}
                </div>
                
                {/* Latest feedback details */}
                {hasFeedback && feedback && (
                  <div className="mt-3 pt-3 border-t border-neutral-700/50">
                    <div className="flex flex-wrap gap-2">
                      {feedback.categoryScores.slice(0, 3).map((category, idx) => (
                        <div key={idx} className="text-xs bg-neutral-800 border border-neutral-700 px-2 py-1 rounded">
                          {category.name}: <span className="text-primary-300">{category.score}</span>
                        </div>
                      ))}
                      {feedback.categoryScores.length > 3 && (
                        <div className="text-xs bg-neutral-800 border border-neutral-700 px-2 py-1 rounded">
                          +{feedback.categoryScores.length - 3} more
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 mt-2 line-clamp-2">
                      {feedback.finalAssessment}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InterviewTimeline; 