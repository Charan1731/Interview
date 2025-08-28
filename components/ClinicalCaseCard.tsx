"use client";

import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ClinicalCaseCardProps {
  case: ClinicalCase;
  onStart: () => void;
  userAttempt?: CaseAttempt;
}

const ClinicalCaseCard = ({ case: clinicalCase, onStart, userAttempt }: ClinicalCaseCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-success-100 bg-success-100/20';
      case 'intermediate': return 'text-yellow-500 bg-yellow-500/20';
      case 'advanced': return 'text-destructive-100 bg-destructive-100/20';
      default: return 'text-neutral-400 bg-neutral-400/20';
    }
  };

  const getSpecialtyIcon = (specialty: string) => {
    const icons: Record<string, string> = {
      'cardiology': '❤️',
      'neurology': '🧠',
      'emergency': '🚨',
      'internal': '🩺',
      'pediatrics': '👶',
      'surgery': '🔪',
      'radiology': '📡',
      'psychiatry': '🧘',
    };
    return icons[specialty.toLowerCase()] || '🏥';
  };

  return (
    <Card className="group relative overflow-hidden bg-dark-200 border-neutral-700 hover:border-primary-500/50 transition-all duration-300">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-200 transition-colors">
              {clinicalCase.title}
            </h3>
            <p className="text-sm text-light-100 line-clamp-2">
              {clinicalCase.chiefComplaint}
            </p>
          </div>
          <div className="text-2xl ml-3">
            {getSpecialtyIcon(clinicalCase.specialty)}
          </div>
        </div>

        {/* Patient Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-light-100">Age</p>
            <p className="text-white font-medium">{clinicalCase.patientAge}</p>
          </div>
          <div>
            <p className="text-light-100">Gender</p>
            <p className="text-white font-medium capitalize">{clinicalCase.patientGender}</p>
          </div>
        </div>

        {/* Vital Signs Preview */}
        <div className="bg-dark-100/50 rounded-lg p-3">
          <h4 className="text-sm font-medium text-white mb-2">Vital Signs</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-light-100">BP:</span>
              <span className="text-white ml-1">{clinicalCase.vitals.bloodPressure}</span>
            </div>
            <div>
              <span className="text-light-100">HR:</span>
              <span className="text-white ml-1">{clinicalCase.vitals.heartRate}</span>
            </div>
            <div>
              <span className="text-light-100">Temp:</span>
              <span className="text-white ml-1">{clinicalCase.vitals.temperature}°F</span>
            </div>
            <div>
              <span className="text-light-100">O2:</span>
              <span className="text-white ml-1">{clinicalCase.vitals.oxygenSaturation}%</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            getDifficultyColor(clinicalCase.difficulty)
          )}>
            {clinicalCase.difficulty}
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-200">
            {clinicalCase.specialty}
          </span>
        </div>

        {/* User Progress */}
        {userAttempt && (
          <div className="bg-dark-100/30 rounded-lg p-3 border border-neutral-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Previous Attempt</p>
                <p className="text-xs text-light-100">
                  Score: {userAttempt.score}% • {new Date(userAttempt.completedAt).toLocaleDateString()}
                </p>
              </div>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                userAttempt.score >= 80 ? "bg-success-100/20 text-success-100" :
                userAttempt.score >= 60 ? "bg-yellow-500/20 text-yellow-500" :
                "bg-destructive-100/20 text-destructive-100"
              )}>
                {userAttempt.score}
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={onStart}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2.5 transition-all duration-300 group-hover:scale-105"
        >
          <div className="flex items-center justify-center gap-2">
            <Image src="/icons/ai.svg" alt="Start" width={16} height={16} />
            {userAttempt ? 'Retry Case' : 'Start Case'}
          </div>
        </Button>
      </div>
    </Card>
  );
};

export default ClinicalCaseCard;
