import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils';

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

const Agent = ({userName, userId, type} : AgentProps) => {
  
  const callStatus = CallStatus.INACTIVE;
  const isSpeaking = true;

  const messages = ["What's your name?", "What's your favorite color?", "What's your favorite food?"];

  const lastMessage = messages[messages.length - 1];

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
            <Image src="/user-avatar.png" alt="user-avatar" width={540} height={540} className="object-cover rounded-full size-[120px]" />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length>0 && (
        <div className='transcript-border mt-10'>
          <div className='transcript'>
            <p key={lastMessage} className=''>{lastMessage}</p>
          </div>
        </div>
      )}

      <div className='w-full flex justify-center'>
        { callStatus !== 'ACTIVE' ? (
          <button className='btn-call relative mt-10'>
            <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus !== 'CONNECTING' && 'hidden')}/>
            <span >
              {callStatus === 'INACTIVE' || callStatus === 'FINISHED' ? 'Call' : '...'} 
            </span>
          </button>
        ):(
          <button className='btn-disconnect mt-10'>
            End
          </button>
        ) }
      </div>
    </>
  )
}

export default Agent