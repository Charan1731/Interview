"use client";

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { vapi } from '@/lib/vapi.sdk';
import { CallStatus } from '@/components/Agent';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MedicalReferences from '@/components/MedicalReferences';
// Temporary placeholder functions until clinical.action.ts is properly set up
const createCaseAttempt = async (params: any) => {
  console.log('Creating case attempt:', params);
  return { success: true, attemptId: 'temp', score: 85, feedback: 'Good work!' };
};

const generateClinicalCase = async (params: any) => {
  console.log('Generating clinical case:', params);
  return { success: true, case: null };
};
import { clinicalCaseGenerator, clinicalCaseSolver } from '@/constants';

interface SavedMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const ClinicalCaseAgent = ({ userName, userId, type, currentCase, caseId }: ClinicalCaseAgentProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startTimeRef = useRef<number>(0);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [currentPhase, setCurrentPhase] = useState<'presentation' | 'diagnosis' | 'treatment' | 'complete'>('presentation');
  const [studentDiagnosis, setStudentDiagnosis] = useState('');
  const [studentTreatment, setStudentTreatment] = useState<string[]>([]);
  const [reasoning, setReasoning] = useState('');
  const [showCaseDetails, setShowCaseDetails] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio('/iphone.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (callStatus === CallStatus.CONNECTING && audioRef.current) {
      audioRef.current.play();
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [callStatus]);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
      startTimeRef.current = Date.now();
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: any) => {
      if (message.type === 'transcript' && message.transcriptType === 'final' && message.transcript && message.transcript !== 'final') {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        
        // Analyze message content to determine phase
        const content = message.transcript.toLowerCase();
        if (content.includes('diagnosis') || content.includes('what do you think')) {
          setCurrentPhase('diagnosis');
        } else if (content.includes('treatment') || content.includes('how would you treat')) {
          setCurrentPhase('treatment');
        }
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.error('VAPI Error:', error);

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('error', onError);
    };
  }, []);

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      if (type === 'solve-case' && currentCase) {
        handleSubmitAttempt();
      } else if (type === 'generate-case') {
        handleGenerateCase();
      }
    }
  }, [callStatus, type, currentCase]);

  const handleSubmitAttempt = async () => {
    if (!currentCase || !caseId) return;

    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    
    try {
      const result = await createCaseAttempt({
        caseId,
        userId,
        diagnosis: studentDiagnosis,
        treatment: studentTreatment,
        reasoning,
        transcript: messages
      });

      if (result.success) {
        // Redirect to feedback page
        window.location.href = `/clinical-cases/${caseId}/feedback`;
      }
    } catch (error) {
      console.error('Error submitting attempt:', error);
    }
  };

  const handleGenerateCase = async () => {
    try {
      await generateClinicalCase({
        userId,
        transcript: messages
      });
    } catch (error) {
      console.error('Error generating case:', error);
    }
  };

  const handleStartCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === 'generate-case') {
      await vapi.start(clinicalCaseGenerator, {
        variableValues: {
          username: userName,
          userid: userId,
        }
      });
    } else if (currentCase) {
      const caseContext = `
        Patient Case: ${currentCase.title}
        Age: ${currentCase.patientAge}, Gender: ${currentCase.patientGender}
        Chief Complaint: ${currentCase.chiefComplaint}
        Symptoms: ${currentCase.symptoms.join(', ')}
        Vitals: BP ${currentCase.vitals.bloodPressure}, HR ${currentCase.vitals.heartRate}, 
               Temp ${currentCase.vitals.temperature}°F, RR ${currentCase.vitals.respiratoryRate}, 
               O2 Sat ${currentCase.vitals.oxygenSaturation}%
        Medical History: ${currentCase.medicalHistory.join(', ')}
        Physical Exam: ${currentCase.physicalExam}
        ${currentCase.labResults ? `Lab Results: ${JSON.stringify(currentCase.labResults)}` : ''}
      `;

      await vapi.start(clinicalCaseSolver, {
        variableValues: {
          caseContext,
          studentName: userName,
        }
      });
    }
  };

  const handleEndCall = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const latestMessage = messages[messages.length - 1]?.content;

  return (
    <div className="space-y-8">
      {/* Case Information Panel */}
      {currentCase && (
        <Card className="p-6 bg-dark-200 border-neutral-700">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-white">{currentCase.title}</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCaseDetails(!showCaseDetails)}
            >
              {showCaseDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
          
          {showCaseDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-white mb-2">Patient Information</h4>
                <p className="text-light-100">Age: {currentCase.patientAge}</p>
                <p className="text-light-100">Gender: {currentCase.patientGender}</p>
                <p className="text-light-100">Chief Complaint: {currentCase.chiefComplaint}</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Vital Signs</h4>
                <p className="text-light-100">BP: {currentCase.vitals.bloodPressure}</p>
                <p className="text-light-100">HR: {currentCase.vitals.heartRate} bpm</p>
                <p className="text-light-100">Temp: {currentCase.vitals.temperature}°F</p>
                <p className="text-light-100">RR: {currentCase.vitals.respiratoryRate}/min</p>
                <p className="text-light-100">O2 Sat: {currentCase.vitals.oxygenSaturation}%</p>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* AI Doctor and Student Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Doctor */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-primary-300/20 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          
          <div className="relative card p-8 border border-neutral-700/50 hover:border-primary-500/30 transition-all duration-300">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500/20 to-primary-300/20 p-1">
                  <div className="w-full h-full rounded-full bg-dark-100 flex items-center justify-center relative overflow-hidden">
                    <Image 
                      src="/ai-avatar.png" 
                      alt="AI Doctor" 
                      width={80} 
                      height={80} 
                      className="object-cover z-10" 
                    />
                    {isSpeaking && (
                      <>
                        <div className="absolute inset-0 bg-primary-500/20 rounded-full animate-pulse"></div>
                        <div className="absolute inset-2 border-2 border-primary-500/50 rounded-full animate-ping"></div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="absolute -bottom-2 -right-2">
                  <div className={cn(
                    "w-6 h-6 rounded-full border-3 border-dark-100 flex items-center justify-center",
                    callStatus === CallStatus.ACTIVE ? "bg-success-100" : 
                    callStatus === CallStatus.CONNECTING ? "bg-yellow-500 animate-pulse" : 
                    "bg-neutral-500"
                  )}>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-white">
                  {type === 'generate-case' ? 'AI Case Generator' : 'AI Patient'}
                </h3>
                <p className="text-sm text-light-100">
                  {callStatus === CallStatus.ACTIVE ? "Speaking..." :
                   callStatus === CallStatus.CONNECTING ? "Connecting..." :
                   callStatus === CallStatus.FINISHED ? "Session Complete" :
                   "Ready to start"}
                </p>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-200/50 border border-neutral-700/50">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  callStatus === CallStatus.ACTIVE ? "bg-success-100 animate-pulse" :
                  callStatus === CallStatus.CONNECTING ? "bg-yellow-500 animate-pulse" :
                  "bg-neutral-500"
                )}></div>
                <span className="text-xs text-light-100 font-medium">
                  {callStatus === CallStatus.ACTIVE ? "Live" :
                   callStatus === CallStatus.CONNECTING ? "Connecting" :
                   "Offline"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Student */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-neutral-600/20 to-neutral-400/20 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          
          <div className="relative card p-8 border border-neutral-700/50 hover:border-neutral-500/30 transition-all duration-300">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-neutral-600/20 to-neutral-400/20 p-1">
                  <div className="w-full h-full rounded-full bg-dark-100 flex items-center justify-center overflow-hidden">
                    <Image 
                      src="/gpt.png" 
                      alt="Student" 
                      width={80} 
                      height={80} 
                      className="object-cover rounded-full" 
                    />
                  </div>
                </div>
                
                <div className="absolute -bottom-2 -right-2">
                  <div className="w-6 h-6 bg-primary-500 rounded-full border-3 border-dark-100 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-white">{userName}</h3>
                <p className="text-sm text-light-100">Medical Student</p>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-200/50 border border-neutral-700/50">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span className="text-xs text-light-100 font-medium">Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Phase Indicator */}
      {type === 'solve-case' && (
        <Card className="p-4 bg-dark-200 border-neutral-700">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-white">Current Phase</h4>
            <div className="flex gap-2">
              {['presentation', 'diagnosis', 'treatment', 'complete'].map((phase) => (
                <div
                  key={phase}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium capitalize",
                    currentPhase === phase 
                      ? "bg-primary-500 text-white" 
                      : "bg-neutral-700 text-light-100"
                  )}
                >
                  {phase}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Live Transcript */}
      {messages.length > 0 && (
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/10 to-primary-300/10 rounded-2xl blur"></div>
          <div className="relative card p-6 border border-neutral-700/50">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                <Image src="/icons/feedback.svg" alt="Transcript" width={20} height={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-3 text-white">Live Transcript</h4>
                <div className="bg-dark-200/50 rounded-xl p-4 border border-neutral-700/30 max-h-60 overflow-y-auto">
                  <div className="space-y-3">
                    {messages.slice(-5).map((message, index) => (
                      <div key={index} className={cn(
                        "p-3 rounded-lg",
                        message.role === 'assistant' 
                          ? "bg-primary-500/10 border-l-4 border-primary-500" 
                          : "bg-neutral-700/30 border-l-4 border-neutral-500"
                      )}>
                        <p className="text-sm font-medium text-light-100 mb-1">
                          {message.role === 'assistant' ? 'AI Doctor' : 'You'}
                        </p>
                        <p className="text-white">{message.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Medical References Section */}
      {type === 'solve-case' && currentCase && (
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-blue-300/10 rounded-2xl blur"></div>
          <div className="relative card p-6 border border-neutral-700/50">
            <MedicalReferences 
              initialQuery={currentCase.correctDiagnosis}
              onReferenceSelect={(reference) => {
                console.log('Selected reference:', reference);
              }}
            />
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex justify-center">
        {callStatus !== CallStatus.ACTIVE ? (
          <Button 
            className="group relative overflow-hidden bg-gradient-to-r from-success-100 to-success-200 hover:from-success-200 hover:to-success-100 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            onClick={handleStartCall}
            disabled={callStatus === CallStatus.CONNECTING}
          >
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            
            <div className="relative flex items-center gap-3">
              {callStatus === CallStatus.CONNECTING ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-success-100 rounded-full"></div>
                  </div>
                  <span>
                    {type === 'generate-case' ? 'Generate Case' : 'Start Case'}
                  </span>
                </>
              )}
            </div>
          </Button>
        ) : (
          <Button 
            className="group relative overflow-hidden bg-gradient-to-r from-destructive-100 to-destructive-200 hover:from-destructive-200 hover:to-destructive-100 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            onClick={handleEndCall}
          >
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            <div className="relative flex items-center gap-3">
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-destructive-100 rounded-full"></div>
              </div>
              <span>End Session</span>
            </div>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ClinicalCaseAgent;
