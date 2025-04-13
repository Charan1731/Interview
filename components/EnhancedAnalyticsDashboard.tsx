"use client";

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SkillRadarChart from './SkillRadarChart';
import SkillGapAnalysis from './SkillGapAnalysis';
import PerformanceTrends from './PerformanceTrends';
import { PieChart, BarChartBig, TrendingUp, ChevronDown, LineChart, BarChart2, MoveUpRight } from 'lucide-react';

interface EnhancedAnalyticsDashboardProps {
  currentSkillData: Array<{
    name: string;
    score: number;
  }>;
  previousSkillData: Array<{
    name: string;
    score: number;
  }>;
  feedbacks: Array<{
    totalScore: number;
    createdAt: string;
    categoryScores: Array<{
      name: string;
      score: number;
    }>;
  }>;
}

const EnhancedAnalyticsDashboard = ({ 
  currentSkillData, 
  previousSkillData, 
  feedbacks 
}: EnhancedAnalyticsDashboardProps) => {
  const [expandedView, setExpandedView] = useState(false);

  // Calculate improvement percentage
  const calculateImprovement = () => {
    if (!currentSkillData.length || !previousSkillData.length) return 0;
    
    // Calculate average scores
    const currentAvg = currentSkillData.reduce((sum, item) => sum + item.score, 0) / currentSkillData.length;
    const previousAvg = previousSkillData.reduce((sum, item) => sum + item.score, 0) / previousSkillData.length;
    
    // Calculate percentage improvement
    if (previousAvg === 0) return 0;
    return Math.round(((currentAvg - previousAvg) / previousAvg) * 100);
  };

  const improvementPercentage = calculateImprovement();
  
  // Get strongest and weakest skills
  const getSkillInsights = () => {
    if (!currentSkillData.length) return { strongest: null, weakest: null };
    
    const sorted = [...currentSkillData].sort((a, b) => b.score - a.score);
    return {
      strongest: sorted[0],
      weakest: sorted[sorted.length - 1]
    };
  };
  
  const { strongest, weakest } = getSkillInsights();

  return (
    <div className={`transition-all duration-300 ${expandedView ? 'col-span-3' : 'col-span-full lg:col-span-2'}`}>
      <div className="card-container p-6 rounded-xl bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-700/30 via-primary-300/50 to-primary-700/30"></div>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <BarChart2 className="text-primary-300 w-5 h-5" />
              <h2 className="text-xl font-semibold">Enhanced Analytics</h2>
            </div>
            <p className="text-neutral-400 text-sm mt-1">Detailed insight into your interview performance</p>
          </div>
          
          <button 
            onClick={() => setExpandedView(!expandedView)}
            className="text-neutral-400 hover:text-primary-300 transition-colors"
            aria-label={expandedView ? "Collapse view" : "Expand view"}
          >
            {expandedView ? (
              <ChevronDown className="w-5 h-5 transform rotate-180" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Summary Cards */}
        {feedbacks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Overall Improvement */}
            <div className="bg-neutral-800/70 p-4 rounded-lg border border-neutral-700/50 flex items-center">
              <div className="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center mr-4">
                <TrendingUp className="text-primary-300 w-6 h-6" />
              </div>
              <div>
                <p className="text-neutral-400 text-xs mb-1">Overall Improvement</p>
                <div className="flex items-center">
                  <span className="text-2xl font-semibold">
                    {improvementPercentage > 0 ? '+' : ''}{improvementPercentage}%
                  </span>
                  {improvementPercentage !== 0 && (
                    <MoveUpRight className={`w-4 h-4 ml-1 ${improvementPercentage > 0 ? 'text-green-400' : 'text-red-400 transform rotate-90'}`} />
                  )}
                </div>
              </div>
            </div>
            
            {/* Strongest Skill */}
            {strongest && (
              <div className="bg-neutral-800/70 p-4 rounded-lg border border-neutral-700/50 flex items-center">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mr-4">
                  <PieChart className="text-green-400 w-6 h-6" />
                </div>
                <div>
                  <p className="text-neutral-400 text-xs mb-1">Strongest Skill</p>
                  <p className="text-lg font-semibold">{strongest.name}</p>
                  <p className="text-green-400 text-sm">{strongest.score}%</p>
                </div>
              </div>
            )}
            
            {/* Weakest Skill */}
            {weakest && (
              <div className="bg-neutral-800/70 p-4 rounded-lg border border-neutral-700/50 flex items-center">
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mr-4">
                  <BarChartBig className="text-amber-400 w-6 h-6" />
                </div>
                <div>
                  <p className="text-neutral-400 text-xs mb-1">Focus Area</p>
                  <p className="text-lg font-semibold">{weakest.name}</p>
                  <p className="text-amber-400 text-sm">{weakest.score}%</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tabs for different views */}
        <Tabs defaultValue="trends">
          <TabsList className="mb-6">
            <TabsTrigger value="trends" className="flex items-center gap-1">
              <LineChart className="w-4 h-4" />
              <span>Performance Trends</span>
            </TabsTrigger>
            <TabsTrigger value="radar" className="flex items-center gap-1">
              <PieChart className="w-4 h-4" />
              <span>Skill Radar</span>
            </TabsTrigger>
            <TabsTrigger value="gaps" className="flex items-center gap-1">
              <BarChart2 className="w-4 h-4" />
              <span>Skill Gaps</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trends" className="min-h-[350px]">
            <PerformanceTrends feedbacks={feedbacks} />
          </TabsContent>
          
          <TabsContent value="radar" className="min-h-[350px]">
            <div className="flex flex-col h-full">
              <h3 className="text-lg font-semibold mb-3">Skill Analysis</h3>
              <div className="flex-1 min-h-[300px]">
                {currentSkillData.length > 0 ? (
                  <SkillRadarChart 
                    skillData={currentSkillData} 
                    previousSkillData={previousSkillData.length > 0 ? previousSkillData : undefined} 
                  />
                ) : (
                  <div className="text-center text-neutral-400 h-full flex items-center justify-center">
                    <p>Complete interviews to see your skill analysis</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="gaps" className="min-h-[350px]">
            <SkillGapAnalysis skillData={currentSkillData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedAnalyticsDashboard; 