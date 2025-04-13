"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlarmClockCheck, 
  Clock, 
  Medal, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  BookOpen,
  Calendar,
  BarChart2,
  FileText,
  CheckCircle2
} from 'lucide-react';

interface EnhancedInterviewTimelineProps {
  interviews: Interview[];
  feedbacks: Feedback[];
}

// Filter types
type FilterType = 'all' | 'with-feedback' | 'pending-feedback';
type SortType = 'newest' | 'oldest' | 'highest-score' | 'lowest-score';

const EnhancedInterviewTimeline = ({ interviews, feedbacks }: EnhancedInterviewTimelineProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('newest');
  const [filterOpen, setFilterOpen] = useState(false);
  const [expandedInterview, setExpandedInterview] = useState<string | null>(null);

  // Create a map of latest feedback by interviewId for quick lookup
  const feedbackMap = useMemo(() => {
    const map = new Map<string, Feedback>();
    
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
        map.set(interviewId, sortedFeedbacks[0]);
      }
    });

    return map;
  }, [feedbacks]);
  
  // Get all feedback history grouped by interview
  const feedbackHistory = useMemo(() => {
    return feedbacks.reduce((acc, feedback) => {
      if (!acc[feedback.interviewId]) {
        acc[feedback.interviewId] = [];
      }
      acc[feedback.interviewId].push(feedback);
      return acc;
    }, {} as Record<string, Feedback[]>);
  }, [feedbacks]);

  // Filter and sort interviews
  const filteredInterviews = useMemo(() => {
    let results = [...interviews];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(interview => 
        interview.role.toLowerCase().includes(query) || 
        interview.type.toLowerCase().includes(query) ||
        interview.techstack.some(tech => tech.toLowerCase().includes(query))
      );
    }
    
    // Apply category filter
    if (activeFilter === 'with-feedback') {
      results = results.filter(interview => feedbackMap.has(interview.id));
    } else if (activeFilter === 'pending-feedback') {
      results = results.filter(interview => !feedbackMap.has(interview.id));
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        results.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'highest-score':
        results.sort((a, b) => {
          const scoreA = feedbackMap.get(a.id)?.totalScore || 0;
          const scoreB = feedbackMap.get(b.id)?.totalScore || 0;
          return scoreB - scoreA;
        });
        break;
      case 'lowest-score':
        results.sort((a, b) => {
          const scoreA = feedbackMap.get(a.id)?.totalScore || 0;
          const scoreB = feedbackMap.get(b.id)?.totalScore || 0;
          return scoreA - scoreB;
        });
        break;
    }
    
    return results;
  }, [interviews, searchQuery, activeFilter, sortBy, feedbackMap]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = interviews.length;
    const withFeedback = interviews.filter(interview => feedbackMap.has(interview.id)).length;
    const pending = total - withFeedback;
    
    return { total, withFeedback, pending };
  }, [interviews, feedbackMap]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
  };

  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by role, type, or technology..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-800/50 border border-neutral-700/50 focus:border-primary-500/50 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/30"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="flex gap-3 self-start sm:self-center">
          <div className="relative">
            <button 
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-1 px-3 py-2 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 rounded-lg text-sm transition-colors"
            >
              <Filter className="h-4 w-4 text-neutral-400" />
              <span>Filter</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {filterOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg p-2 z-10">
                <div className="p-2 mb-2 border-b border-neutral-700">
                  <h4 className="text-sm font-medium mb-1">Filter by status</h4>
                  <div className="space-y-1">
                    {[
                      { value: 'all', label: 'All interviews', icon: BookOpen },
                      { value: 'with-feedback', label: 'With feedback', icon: FileText },
                      { value: 'pending-feedback', label: 'Pending feedback', icon: Clock }
                    ].map((filter) => (
                      <button
                        key={filter.value}
                        onClick={() => setActiveFilter(filter.value as FilterType)}
                        className={`w-full flex items-center gap-2 px-3 py-1.5 text-left text-sm rounded ${
                          activeFilter === filter.value 
                            ? 'bg-primary-500/20 text-primary-300' 
                            : 'hover:bg-neutral-700/50'
                        }`}
                      >
                        <filter.icon className="w-4 h-4" />
                        <span>{filter.label}</span>
                        {activeFilter === filter.value && <CheckCircle2 className="w-3 h-3 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="p-2">
                  <h4 className="text-sm font-medium mb-1">Sort by</h4>
                  <div className="space-y-1">
                    {[
                      { value: 'newest', label: 'Newest first', icon: Calendar },
                      { value: 'oldest', label: 'Oldest first', icon: Calendar },
                      { value: 'highest-score', label: 'Highest score', icon: BarChart2 },
                      { value: 'lowest-score', label: 'Lowest score', icon: BarChart2 }
                    ].map((sort) => (
                      <button
                        key={sort.value}
                        onClick={() => setSortBy(sort.value as SortType)}
                        className={`w-full flex items-center gap-2 px-3 py-1.5 text-left text-sm rounded ${
                          sortBy === sort.value 
                            ? 'bg-primary-500/20 text-primary-300' 
                            : 'hover:bg-neutral-700/50'
                        }`}
                      >
                        <sort.icon className="w-4 h-4" />
                        <span>{sort.label}</span>
                        {sortBy === sort.value && <CheckCircle2 className="w-3 h-3 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-2 bg-neutral-800/30 p-2 rounded-lg">
        <div className="flex flex-col items-center p-2 rounded border border-neutral-700/50 bg-neutral-800/50">
          <span className="text-2xl font-semibold text-primary-300">{stats.total}</span>
          <span className="text-xs text-neutral-400">Total</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded border border-neutral-700/50 bg-neutral-800/50">
          <span className="text-2xl font-semibold text-green-400">{stats.withFeedback}</span>
          <span className="text-xs text-neutral-400">Completed</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded border border-neutral-700/50 bg-neutral-800/50">
          <span className="text-2xl font-semibold text-amber-400">{stats.pending}</span>
          <span className="text-xs text-neutral-400">Pending</span>
        </div>
      </div>
      
      {/* Applied filters chips */}
      {(activeFilter !== 'all' || searchQuery || sortBy !== 'newest') && (
        <div className="flex flex-wrap gap-2">
          {activeFilter !== 'all' && (
            <div className="flex items-center gap-1 px-2 py-1 bg-primary-500/10 text-primary-300 rounded text-sm">
              <span>Status: {activeFilter === 'with-feedback' ? 'With feedback' : 'Pending feedback'}</span>
              <button onClick={() => setActiveFilter('all')}>
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          
          {searchQuery && (
            <div className="flex items-center gap-1 px-2 py-1 bg-primary-500/10 text-primary-300 rounded text-sm">
              <span>Search: {searchQuery}</span>
              <button onClick={() => setSearchQuery('')}>
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          
          {sortBy !== 'newest' && (
            <div className="flex items-center gap-1 px-2 py-1 bg-primary-500/10 text-primary-300 rounded text-sm">
              <span>Sort: {
                sortBy === 'oldest' ? 'Oldest first' : 
                sortBy === 'highest-score' ? 'Highest score' : 
                'Lowest score'
              }</span>
              <button onClick={() => setSortBy('newest')}>
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          
          <button 
            onClick={() => {
              setActiveFilter('all');
              setSearchQuery('');
              setSortBy('newest');
            }}
            className="text-xs text-neutral-400 hover:text-white underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* No results state */}
      {filteredInterviews.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-neutral-500" />
          </div>
          <h4 className="text-lg font-medium mb-1">No interviews found</h4>
          <p className="text-neutral-400 text-sm mb-4">Try adjusting your filters or search query</p>
          <button 
            onClick={() => {
              setActiveFilter('all');
              setSearchQuery('');
              setSortBy('newest');
            }}
            className="text-primary-300 hover:text-primary-200 text-sm"
          >
            Reset filters
          </button>
        </div>
      )}
      
      {/* Timeline */}
      {filteredInterviews.length > 0 && (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-neutral-700/50"></div>
          
          <motion.div 
            className="space-y-5"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence>
              {filteredInterviews.map((interview) => {
                const hasFeedback = feedbackMap.has(interview.id);
                const feedback = feedbackMap.get(interview.id);
                
                // Get feedback history for this interview
                const interviewFeedbacks = feedbackHistory[interview.id] || [];
                interviewFeedbacks.sort((a, b) => 
                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                
                const hasPreviousFeedback = interviewFeedbacks.length > 1;
                const previousFeedback = hasPreviousFeedback ? interviewFeedbacks[1] : null;
                const scoreImprovement = hasPreviousFeedback && feedback 
                  ? feedback.totalScore - previousFeedback!.totalScore 
                  : 0;
                
                const isExpanded = expandedInterview === interview.id;
                
                return (
                  <motion.div 
                    key={interview.id}
                    variants={itemVariants}
                    layout
                    className="relative pl-12"
                  >
                    {/* Timeline marker */}
                    <motion.div 
                      className={`absolute left-0 top-2 w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 border-neutral-800 ${
                        hasFeedback 
                          ? 'bg-primary-500/30' 
                          : 'bg-neutral-700'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {hasFeedback ? (
                        <Medal className="w-4 h-4 text-primary-300" />
                      ) : (
                        <Clock className="w-4 h-4 text-neutral-400" />
                      )}
                    </motion.div>
                    
                    {/* Interview card */}
                    <motion.div 
                      className={`bg-neutral-800/70 p-4 rounded-lg border border-neutral-700/50 hover:border-primary-500/30 transition-all hover:shadow-md hover:shadow-primary-900/10 ${
                        isExpanded ? 'border-primary-500/50' : ''
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                      <div className="flex flex-col sm:flex-row justify-between gap-2">
                        <div className="flex gap-3">
                          <Image 
                            src={interview.coverImage || '/default-interview.png'} 
                            alt={interview.role} 
                            width={40} height={40} 
                            className="rounded-full object-cover h-10 w-10" 
                          />
                          <div>
                            <h3 className="font-medium capitalize mb-1">{interview.role} Interview</h3>
                            <div className="flex items-center gap-2 text-sm text-neutral-400">
                              <AlarmClockCheck className="w-3.5 h-3.5" />
                              <span>{dayjs(interview.createdAt).format('MMM D, YYYY h:mm A')}</span>
                            </div>
                          </div>
                        </div>
                        
                        {hasFeedback && feedback && (
                          <div className="flex sm:flex-col items-center sm:items-end gap-1 sm:gap-0">
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
                                {interviewFeedbacks.length} attempts
                              </div>
                            )}
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
                      
                      {/* Actions */}
                      <div className="flex justify-between items-center mt-4">
                        <button
                          onClick={() => setExpandedInterview(isExpanded ? null : interview.id)}
                          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
                        >
                          {isExpanded ? 'Show less' : 'Show details'}
                          <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <div className="flex gap-2">
                          {hasFeedback && (
                            <Link 
                              href={`/interview/${interview.id}/feedback`}
                              className="text-xs bg-primary-500/20 text-primary-300 hover:bg-primary-500/30 px-3 py-1.5 rounded transition-colors"
                            >
                              View Feedback
                            </Link>
                          )}
                          <Link 
                            href={`/interview/${interview.id}`}
                            className="text-xs bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1.5 rounded transition-colors"
                          >
                            Review Interview
                          </Link>
                        </div>
                      </div>
                      
                      {/* Expanded content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            {hasFeedback && feedback ? (
                              <div className="mt-4 pt-4 border-t border-neutral-700/50">
                                <h4 className="font-medium text-sm mb-2">Feedback Summary</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                                  {feedback.categoryScores.map((category, idx) => (
                                    <div key={idx} className="bg-neutral-800 border border-neutral-700 px-2 py-1.5 rounded">
                                      <div className="text-xs text-neutral-400">{category.name}</div>
                                      <div className="font-medium text-primary-300 mt-1">{category.score}%</div>
                                      <div className="w-full h-1 bg-neutral-700 rounded mt-1 overflow-hidden">
                                        <div 
                                          className="h-full bg-primary-300"
                                          style={{ width: `${category.score}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-2">
                                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
                                    <div>
                                      <span className="text-neutral-400">Strengths:</span>
                                      <div className="text-neutral-300 line-clamp-2">{feedback.strengths.join(', ')}</div>
                                    </div>
                                    <div>
                                      <span className="text-neutral-400">Areas for improvement:</span>
                                      <div className="text-neutral-300 line-clamp-2">{feedback.areasForImprovement.join(', ')}</div>
                                    </div>
                                  </div>
                                  <div className="mt-2">
                                    <span className="text-neutral-400 text-sm">Assessment:</span>
                                    <p className="text-sm text-neutral-300 line-clamp-3">
                                      {feedback.finalAssessment}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="mt-4 pt-4 border-t border-neutral-700/50 text-center">
                                <p className="text-neutral-400 text-sm mb-2">No feedback available yet</p>
                                <Link
                                  href={`/interview/${interview.id}`}
                                  className="inline-block text-xs bg-primary-500/20 text-primary-300 hover:bg-primary-500/30 px-3 py-1.5 rounded transition-colors"
                                >
                                  Continue Interview
                                </Link>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EnhancedInterviewTimeline; 