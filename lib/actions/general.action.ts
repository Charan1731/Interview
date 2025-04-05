"use server";

import { feedbackSchema } from "@/constants";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";

export async function getInterviewsByUserId(userId: string):Promise<Interview[] | null>{

    const interviews = await db.collection('interviews').where('userId', '==', userId).orderBy('createdAt', 'desc').get();

    return interviews.docs.map((doc) => {
        return {
            id: doc.id,
            ...doc.data(),
        } as Interview;
    })

}

export async function getAllInterviews(params: GetLatestInterviewsParams):Promise<Interview[] | null>{

    const { userId, limit = 20} = params;

    const interviews = await db.collection('interviews').orderBy('createdAt', 'desc').where('finalized', '==', true).where('userId', '!=', userId).limit(limit).get();

    return interviews.docs.map((doc) => {
        return {
            id: doc.id,
            ...doc.data(),
        } as Interview;
    })

}

export async function getInterviewById(id: string):Promise<Interview | null>{

    const interview= await db.collection('interviews').doc(id).get();

    return interview.data() as Interview | null;

}

export async function createFeedback(params: CreateFeedbackParams){

    const { interviewId, userId, transcript } = params;

    try {

        const formattedTranscript = transcript.map((message : {role: string, content: string}) => {
            return `- ${message.role}: ${message.content}\n`;
        }).join('');

        const { object } = await generateObject({
            model: google('gemini-2.0-flash-001',{
                structuredOutputs: false,
            }),
            schema: feedbackSchema,
            prompt:`You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
                Transcript:
                ${formattedTranscript}

                If the transcript is not clear or not enough information, return a score of 0 and a message saying that the transcript is not clear.

                 Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
                - **Communication Skills**: Clarity, articulation, structured responses.
                - **Technical Knowledge**: Understanding of key concepts for the role.
                - **Problem-Solving**: Ability to analyze problems and propose solutions.
                - **Cultural & Role Fit**: Alignment with company values and job role.
                - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
                `,
            system:
                "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
        });

        const feedback = await db.collection('feedbacks').add({
            interviewId: interviewId,
            userId: userId,
            totalScore: object.totalScore,
            categoryScores: object.categoryScores,
            strengths: object.strengths,
            areasForImprovement: object.areasForImprovement,
            finalAssessment: object.finalAssessment,
            createdAt: new Date().toISOString(),
        });

        return {
            success: true,
            message: 'Feedback created successfully',
            feedbackId: feedback.id,
        }
        
    } catch (error) {
        console.error('Error creating feedback', error);
        return {
            success: false,
            message: 'Error creating feedback',
        }
    }
        
}


export async function getFeedbackByInterviewId(params: GetFeedbackByInterviewIdParams):Promise<Feedback | null>{

    const { interviewId, userId} = params;

    const feedback = await db.collection('feedbacks').where('interviewId', '==', interviewId).where('userId', '==', userId).orderBy('createdAt', 'desc').limit(1).get();

    if(feedback.empty) return null;

    const feedbackData = feedback.docs[0]

    return {
        id: feedbackData.id,
        ...feedbackData.data(),
    } as Feedback;
}

export async function getAllFeedbacksByUserId(userId: string): Promise<Feedback[] | null> {
  try {
    const feedbacks = await db.collection('feedbacks')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    return feedbacks.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      } as Feedback;
    });
  } catch (error) {
    console.error('Error getting feedbacks by userId', error);
    return null;
  }
}