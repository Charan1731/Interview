import React from 'react';
import { Activity, Calendar, CheckCircle2, TrendingUp } from 'lucide-react';

interface DashboardMetricsProps {
  interviewCount: number;
  completedFeedbacks: number;
  averageScore: number;
  latestInterviewDate: string;
}

const DashboardMetrics = ({
  interviewCount,
  completedFeedbacks,
  averageScore,
  latestInterviewDate,
}: DashboardMetricsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Interviews */}
      <div className="card-container p-6 rounded-xl bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 hover:border-primary-500/30 transition-all">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-neutral-400 text-sm mb-1">Total Interviews</p>
            <h3 className="text-3xl font-semibold">{interviewCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary-300" />
          </div>
        </div>
      </div>

      {/* Completed Feedbacks */}
      <div className="card-container p-6 rounded-xl bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 hover:border-primary-500/30 transition-all">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-neutral-400 text-sm mb-1">Completed Feedbacks</p>
            <h3 className="text-3xl font-semibold">{completedFeedbacks}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-primary-300" />
          </div>
        </div>
      </div>

      {/* Average Score */}
      <div className="card-container p-6 rounded-xl bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 hover:border-primary-500/30 transition-all">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-neutral-400 text-sm mb-1">Average Score</p>
            <h3 className="text-3xl font-semibold">{averageScore}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-300" />
          </div>
        </div>
        <div className="mt-2 w-full h-2 bg-neutral-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-700 to-primary-400" 
            style={{ width: `${averageScore}%` }}
          ></div>
        </div>
      </div>

      {/* Latest Interview */}
      <div className="card-container p-6 rounded-xl bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 hover:border-primary-500/30 transition-all">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-neutral-400 text-sm mb-1">Latest Interview</p>
            <h3 className="text-xl font-semibold">{latestInterviewDate}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics; 