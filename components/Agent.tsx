"use client";

import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { vapi } from '@/lib/vapi.sdk';
import { interviewer } from '@/constants';
import { createFeedback } from '@/lib/actions/general.action';

export enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const Agent = ({userName, userId, type, interviewId, questions} : AgentProps) => {


  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isSpeaking, setIsSpeaking] = useState(false)
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio('/iphone.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5; // Set volume to 50%

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Handle ringing sound based on call status
    if (callStatus === CallStatus.CONNECTING && audioRef.current) {
      audioRef.current.play();
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [callStatus]);

  useEffect(() => {

    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    }

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    }

    const onMessage = (message: Message) => {
      console.log('Received message:', message);

      if(message.type === 'transcript' && message.transcriptType === 'final' && message.transcript && message.transcript !== 'final'){
        const newMessage = {role: message.role, content: message.transcript}
        console.log('Adding new message:', newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    }
    

    const onSpeechStart = () => {
      setIsSpeaking(true);
    }

    const onSpeechEnd = () => {
      setIsSpeaking(false);
    }
    
    const onError = (error: Error) => {
      console.error('Error:', error);
    }

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
    }

      
  }, [])

  const handleGenerateFeedback = async(messages: SavedMessage[]) => {
    console.log('generate feedback');

    //generate dynamic response
    const { success, feedbackId:id } = await createFeedback({
      interviewId: interviewId!,
      userId: userId!,
      transcript: messages,
    })

    if(success && id){
      router.push(`/interview/${interviewId}/feedback`);
    }
    else{
      console.log('error generating feedback');
      router.push('/');
    }


  }


  useEffect(() => {

    if(callStatus === CallStatus.FINISHED){
      if(type === 'generate') router.push('/');
      else handleGenerateFeedback(messages);
    }

  }, [messages, type, callStatus, userId, router, handleGenerateFeedback]);

  const handleCall =  async() => {

    setCallStatus(CallStatus.CONNECTING);

    if(type === 'generate'){
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        }
      })
    }
    else{
      let formattedQuestions = '';
      if(questions){
        formattedQuestions = questions.map((question) => `- ${question}`).join('\n');
      }

      await vapi.start(interviewer,{
        variableValues: {
          questions: formattedQuestions,
        }
      })
    }


  }


  const handleDisconnectCall = async() => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  }

  const latestMessage = messages[messages.length - 1]?.content;

  const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

  return (
    <div className="space-y-8">
      {/* Enhanced Call View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Interviewer Card */}
        <div className="relative group">
          {/* Subtle glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-primary-300/20 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          
          <div className="relative card p-8 border border-neutral-700/50 hover:border-primary-500/30 transition-all duration-300">
            <div className="flex flex-col items-center gap-6">
              {/* Enhanced Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500/20 to-primary-300/20 p-1">
                  <div className="w-full h-full rounded-full bg-dark-100 flex items-center justify-center relative overflow-hidden">
                    <Image 
                      src="/ai-avatar.png" 
                      alt="AI Interviewer" 
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
                
                {/* Status indicator */}
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
                <h3 className="text-xl font-semibold text-white">AI Interviewer</h3>
                <p className="text-sm text-light-100">
                  {callStatus === CallStatus.ACTIVE ? "Speaking..." :
                   callStatus === CallStatus.CONNECTING ? "Connecting..." :
                   callStatus === CallStatus.FINISHED ? "Interview Complete" :
                   "Ready to start"}
                </p>
              </div>
              
              {/* Call status indicator */}
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

        {/* User Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-neutral-600/20 to-neutral-400/20 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          
          <div className="relative card p-8 border border-neutral-700/50 hover:border-neutral-500/30 transition-all duration-300">
            <div className="flex flex-col items-center gap-6">
              {/* User Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-neutral-600/20 to-neutral-400/20 p-1">
                  <div className="w-full h-full rounded-full bg-dark-100 flex items-center justify-center overflow-hidden">
                    <Image 
                      src="/gpt.png" 
                      alt="User Avatar" 
                      width={80} 
                      height={80} 
                      className="object-cover rounded-full" 
                    />
                  </div>
                </div>
                
                {/* User status */}
                <div className="absolute -bottom-2 -right-2">
                  <div className="w-6 h-6 bg-primary-500 rounded-full border-3 border-dark-100 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-white">{userName}</h3>
                <p className="text-sm text-light-100">Candidate</p>
              </div>
              
              {/* Microphone indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-200/50 border border-neutral-700/50">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span className="text-xs text-light-100 font-medium">Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Transcript Section */}
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
                <div className="bg-dark-200/50 rounded-xl p-4 border border-neutral-700/30">
                  <p className="text-white leading-relaxed animate-fadeIn">
                    {latestMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Control Buttons */}
      <div className="flex justify-center">
        {callStatus !== CallStatus.ACTIVE ? (
          <button 
            className="group relative overflow-hidden bg-gradient-to-r from-success-100 to-success-200 hover:from-success-200 hover:to-success-100 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            onClick={handleCall}
            disabled={callStatus === CallStatus.CONNECTING}
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            
            {/* Button content */}
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
                  <span>Start Interview</span>
                </>
              )}
            </div>
          </button>
        ) : (
          <button 
            className="group relative overflow-hidden bg-gradient-to-r from-destructive-100 to-destructive-200 hover:from-destructive-200 hover:to-destructive-100 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            onClick={handleDisconnectCall}
          >
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            <div className="relative flex items-center gap-3">
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-destructive-100 rounded-full"></div>
              </div>
              <span>End Interview</span>
            </div>
          </button>
        )}
      </div>
    </div>
  )
}

export default Agent