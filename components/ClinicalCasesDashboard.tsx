"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClinicalCaseAgent from '@/components/ClinicalCaseAgent';
import ClinicalCaseCard from '@/components/ClinicalCaseCard';
import Leaderboard from '@/components/Leaderboard';
import { getClinicalCases as fetchClinicalCases, getUserCaseAttempts as fetchUserCaseAttempts } from '@/lib/actions/clinical.action';
import { getCurrentUser } from '@/lib/actions/auth.action';

const ClinicalCasesDashboard = () => {
  const [activeTab, setActiveTab] = useState('cases');
  const [selectedCase, setSelectedCase] = useState<ClinicalCase | null>(null);
  const [showAgent, setShowAgent] = useState(false);
  const [agentType, setAgentType] = useState<"generate-case" | "solve-case">("solve-case");
  const [cases, setCases] = useState<ClinicalCase[]>([]);
  const [userAttempts, setUserAttempts] = useState<CaseAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  useEffect(() => {
    loadUserAndData();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadCasesData();
    }
  }, [selectedSpecialty, selectedDifficulty, currentUser]);

  const loadUserAndData = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      setCurrentUser(user);
      
      if (user) {
        const [casesData, attemptsData] = await Promise.all([
          fetchClinicalCases(selectedSpecialty || undefined, selectedDifficulty || undefined),
          fetchUserCaseAttempts(user.id)
        ]);
        setCases(casesData);
        setUserAttempts(attemptsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCasesData = async () => {
    try {
      setLoading(true);
      const casesData = await fetchClinicalCases(
        selectedSpecialty || undefined, 
        selectedDifficulty || undefined
      );
      setCases(casesData);
    } catch (error) {
      console.error('Error loading cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartCase = (clinicalCase: ClinicalCase) => {
    setSelectedCase(clinicalCase);
    setAgentType("solve-case");
    setShowAgent(true);
  };

  const handleGenerateCase = () => {
    setSelectedCase(null);
    setAgentType("generate-case");
    setShowAgent(true);
  };

  const handleBackToDashboard = () => {
    setShowAgent(false);
    setSelectedCase(null);
    loadUserAndData();
  };

  if (showAgent) {
    return (
      <div className="space-y-6">
        <Button 
          onClick={handleBackToDashboard}
          className="mb-4 bg-white cursor-pointer transition-all transition-duration-600 hover:bg-gray-100 hover:scale-105 "
        >
          ← Back to Dashboard
        </Button>
        <ClinicalCaseAgent
          userName={currentUser?.name || "Student"} 
          userId={currentUser?.id || "user123"}
          type={agentType}
          currentCase={selectedCase || undefined}
          caseId={selectedCase?.id}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-primary-500/10 to-primary-300/10 border-primary-500/20 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
              <Image src="/icons/ai.svg" alt="Generate Case" width={24} height={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">Generate New Case</h3>
              <p className="text-light-100 text-sm mb-4">Create AI-generated patient scenarios</p>
              <Button 
                onClick={handleGenerateCase}
                className="w-full cursor-pointer transition-all transition-duration-600 hover:bg-gray-100 hover:scale-105"
              >
                Generate Case
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-success-100/10 to-success-200/10 border-success-100/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-success-100/20 rounded-xl flex items-center justify-center">
              <Image src="/icons/track.svg" alt="Cases Solved" width={24} height={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">Cases Solved</h3>
              <p className="text-3xl font-bold text-success-100">{userAttempts.length}</p>
              <p className="text-light-100 text-sm">Total attempts</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-400/10 border-yellow-500/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <Image src="/icons/feedback.svg" alt="Average Score" width={24} height={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">Average Score</h3>
              <p className="text-3xl font-bold text-yellow-500">
                {userAttempts.length > 0 
                  ? Math.round(userAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / userAttempts.length)
                  : 0}%
              </p>
              <p className="text-light-100 text-sm">Diagnostic accuracy</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-dark-200">
          <TabsTrigger value="cases" className="data-[state=active]:bg-primary-500">
            Available Cases
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-primary-500">
            My Attempts
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="data-[state=active]:bg-primary-500">
            Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cases" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-white">Available Cases</h2>
            <div className="flex gap-2">
              <select 
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="bg-dark-200 border border-neutral-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="">All Specialties</option>
                <option value="cardiology">Cardiology</option>
                <option value="neurology">Neurology</option>
                <option value="emergency">Emergency Medicine</option>
                <option value="internal">Internal Medicine</option>
              </select>
              <select 
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-dark-200 border border-neutral-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {cases.length === 0 ? (
            <div className='flex justify-center items-center h-full'>
              <div className="flex flex-col items-center">
                <p className="text-light-100">No cases found.</p>
                <Button onClick={handleGenerateCase} className="mt-4 cursor-pointer bg-gradient-to-br from-primary-200 to-primary-300 border-primary-500/20 hover:bg-primary-600 hover:scale-105 transition-all transition-duration-600">Generate Case</Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cases.map((clinicalCase) => (
                <ClinicalCaseCard
                  key={clinicalCase.id}
                  case={clinicalCase}
                  onStart={() => handleStartCase(clinicalCase)}
                  userAttempt={userAttempts.find(attempt => attempt.caseId === clinicalCase.id)}
                />
              ))}
            </div>
          )}

          {loading && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[1, 2, 3].map((i) => (
             <div key={i} className="animate-pulse">
               <div className="bg-dark-200 rounded-xl h-48"></div>
             </div>
           ))}
         </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">My Case Attempts</h2>
          <div className="space-y-4">
            {userAttempts.map((attempt) => {
              const clinicalCase = cases.find(c => c.id === attempt.caseId);
              return (
                <Card key={attempt.id} className="p-6 bg-dark-200 border-neutral-700">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {clinicalCase?.title || 'Unknown Case'}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-light-100">Score</p>
                          <p className="text-white font-semibold">{attempt.score}%</p>
                        </div>
                        <div>
                          <p className="text-light-100">Time Spent</p>
                          <p className="text-white font-semibold">{Math.round(attempt.timeSpent / 60)}m</p>
                        </div>
                        <div>
                          <p className="text-light-100">Diagnosis</p>
                          <p className="text-white font-semibold">{attempt.studentDiagnosis}</p>
                        </div>
                        <div>
                          <p className="text-light-100">Completed</p>
                          <p className="text-white font-semibold">
                            {new Date(attempt.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      attempt.score >= 80 ? 'bg-success-100/20 text-success-100' :
                      attempt.score >= 60 ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-destructive-100/20 text-destructive-100'
                    }`}>
                      {attempt.score >= 80 ? 'Excellent' :
                       attempt.score >= 60 ? 'Good' : 'Needs Improvement'}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Leaderboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClinicalCasesDashboard;
