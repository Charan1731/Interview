"use client";

import React, { useEffect, useState } from 'react'
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

  // console.log(userName, userId, type);

  const router = useRouter();

  const [isSpeaking, setIsSpeaking] = useState(false)
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

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
    <>
      <div className='call-view'>
        <div className='card-interviewer'>
          <div className='avatar'>
            <Image src="/ai-avatar.png" alt="vapi" width={65} height={54} className="object-cover" />
            {isSpeaking && <span className='animate-speak'/>}
          </div>
          <h3>AI Interviewer</h3>
        </div>
        <div className='card-border'>
          <div className='card-content'>
            <Image src="/gpt.png" alt="user-avatar" width={540} height={540} className="object-cover rounded-full size-[120px]" />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length>0 && (
        <div className='transcript-border mt-10'>
          <div className='transcript'>
            <p key={latestMessage} className='transition-opacity duration-500 animate-fadeIn opacity-100'>{latestMessage}</p>
          </div>
        </div>
      )}

      <div className='w-full flex justify-center'>
        { callStatus !== 'ACTIVE' ? (
          <button className='btn-call relative mt-10' onClick={handleCall}>
            <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus !== 'CONNECTING' && 'hidden')}/>
            <span >
              {isCallInactiveOrFinished ? 'Call' : '...'} 
            </span>
          </button>
        ):(
          <button className='btn-disconnect mt-10' onClick={handleDisconnectCall}>
            End
          </button>
        ) }
      </div>
    </>
  )
}

export default Agent