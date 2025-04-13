"use client";

import React from 'react';
import { 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle, 
  ChevronUp, 
  ChevronDown,
  HelpCircle
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SkillGapAnalysisProps {
  skillData: {
    name: string;
    score: number;
  }[];
}

const SkillGapAnalysis = ({ skillData }: SkillGapAnalysisProps) => {
  // Define target scores for different skills (industry benchmarks)
  const targetScores = {
    'Communication Skills': 85,
    'Technical Knowledge': 80,
    'Problem-Solving': 85,
    'Cultural & Role Fit': 80,
    'Confidence & Clarity': 80,
  };

  // Sort skills by gap (largest gap first)
  const sortedSkills = [...skillData].sort((a, b) => {
    const gapA = (targetScores[a.name as keyof typeof targetScores] || 80) - a.score;
    const gapB = (targetScores[b.name as keyof typeof targetScores] || 80) - b.score;
    return gapB - gapA;
  });

  const getSkillStatus = (score: number, targetScore: number) => {
    const gap = targetScore - score;
    if (gap <= 5) return { status: 'excellent', icon: CheckCircle, color: 'text-green-400' }; 
    if (gap <= 15) return { status: 'good', icon: ChevronUp, color: 'text-blue-400' };
    if (gap <= 30) return { status: 'needsImprovement', icon: ChevronDown, color: 'text-amber-400' };
    return { status: 'critical', icon: AlertTriangle, color: 'text-red-400' };
  };

  const getRecommendation = (name: string, score: number, targetScore: number) => {
    const gap = targetScore - score;
    
    if (gap <= 5) return "Excellent! Consider mentoring others in this area.";
    
    const recommendations: Record<string, Record<string, string>> = {
      'Communication Skills': {
        needsImprovement: "Practice more structured responses with the STAR method.",
        critical: "Consider joining a speaking club or recording yourself to improve clarity."
      },
      'Technical Knowledge': {
        needsImprovement: "Review core concepts and try to explain them in simpler terms.",
        critical: "Focus on building foundational knowledge through tutorials and documentation."
      },
      'Problem-Solving': {
        needsImprovement: "Practice breaking down complex problems into smaller components.",
        critical: "Work on more algorithm challenges and discuss your thought process aloud."
      },
      'Cultural & Role Fit': {
        needsImprovement: "Research company values and practice aligning your experiences with them.",
        critical: "Practice storytelling that demonstrates your alignment with company culture."
      },
      'Confidence & Clarity': {
        needsImprovement: "Record practice interviews to improve delivery and body language.",
        critical: "Use pauses effectively and practice interview questions with a friend for feedback."
      }
    };

    if (gap <= 15) return "Good progress. " + (recommendations[name]?.needsImprovement || "Continue practicing consistently.");
    if (gap <= 30) return recommendations[name]?.needsImprovement || "Focus on improving this skill through regular practice.";
    return recommendations[name]?.critical || "This area needs significant attention. Consider focused practice.";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Skill Gap Analysis</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-neutral-400 hover:text-neutral-300">
                <HelpCircle className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">This analysis compares your current skill levels to industry benchmarks for successful interviews.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {sortedSkills.length === 0 ? (
        <div className="text-center text-neutral-400 py-8">
          <p>Complete interviews to see your skill gap analysis</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedSkills.map(skill => {
            const targetScore = targetScores[skill.name as keyof typeof targetScores] || 80;
            const { status, icon: StatusIcon, color } = getSkillStatus(skill.score, targetScore);
            const recommendation = getRecommendation(skill.name, skill.score, targetScore);
            
            return (
              <div key={skill.name} className="bg-neutral-800/70 p-4 rounded-lg border border-neutral-700/50 hover:border-primary-500/20 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <StatusIcon className={`w-4 h-4 ${color} mr-2`} />
                    <p className="font-medium">{skill.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-400">Current:</span>
                    <span className="text-primary-300 font-medium">{skill.score}</span>
                    <ChevronRight className="w-3 h-3 text-neutral-500" />
                    <span className="text-sm text-neutral-400">Target:</span>
                    <span className="text-green-400 font-medium">{targetScore}</span>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-2 w-full h-2 bg-neutral-700 rounded-full overflow-hidden">
                  <div className="relative w-full h-full">
                    <div 
                      className="absolute h-full bg-gradient-to-r from-primary-700 to-primary-300" 
                      style={{ width: `${skill.score}%` }}
                    />
                    <div 
                      className="absolute h-full w-px bg-green-400"
                      style={{ left: `${targetScore}%` }}
                    >
                      <div className="w-2 h-2 rounded-full bg-green-400 -ml-1 -mt-0.5"></div>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm mt-2 text-neutral-300">{recommendation}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SkillGapAnalysis; 