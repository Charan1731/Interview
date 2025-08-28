"use server";

import { db } from '@/firebase/admin';
import { generateObject, generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

// Schema for AI-generated clinical cases
const clinicalCaseSchema = z.object({
  title: z.string(),
  patientAge: z.number(),
  patientGender: z.enum(['male', 'female', 'other']),
  chiefComplaint: z.string(),
  symptoms: z.array(z.string()),
  vitals: z.object({
    bloodPressure: z.string(),
    heartRate: z.number(),
    temperature: z.number(),
    respiratoryRate: z.number(),
    oxygenSaturation: z.number(),
  }),
  medicalHistory: z.array(z.string()),
  physicalExam: z.string(),
  labResults: z.record(z.string()).optional(),
  correctDiagnosis: z.string(),
  correctTreatment: z.array(z.string()),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  specialty: z.string(),
});

// Generate a new clinical case using AI
export async function generateClinicalCase({ userId, transcript }: { userId: string; transcript: { role: string; content: string }[] }) {
  try {
    const conversationContext = transcript
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const result = await generateObject({
      model: google('gemini-1.5-pro'),
      schema: clinicalCaseSchema,
      prompt: `Based on this conversation about generating a clinical case:
      
${conversationContext}

Generate a realistic clinical case for medical students. The case should be:
- Medically accurate and educational
- Appropriate for the specified difficulty level
- Include realistic vital signs and symptoms
- Have a clear diagnosis and treatment plan
- Be engaging and challenging

Create a complete patient scenario with all necessary clinical information.`,
    });

    const clinicalCase: ClinicalCase = {
      id: `case_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...result.object,
      createdAt: new Date().toISOString(),
      userId,
    };

    // Save to Firebase
    await db.collection('clinical_cases').doc(clinicalCase.id).set(clinicalCase);

    return { success: true, case: clinicalCase };
  } catch (error) {
    console.error('Error generating clinical case:', error);
    return { success: false, error: 'Failed to generate clinical case' };
  }
}

// Get all available clinical cases
export async function getClinicalCases(specialty?: string, difficulty?: string): Promise<ClinicalCase[]> {
  try {
    let query = db.collection('clinical_cases').orderBy('createdAt', 'desc');

    if (specialty) {
      query = query.where('specialty', '==', specialty);
    }
    if (difficulty) {
      query = query.where('difficulty', '==', difficulty);
    }

    const snapshot = await query.limit(50).get();
    return snapshot.docs.map(doc => doc.data() as ClinicalCase);
  } catch (error) {
    console.error('Error fetching clinical cases:', error);
    return [];
  }
}

// Evaluate student's case attempt using AI
export async function evaluateCaseAttempt(
  clinicalCase: ClinicalCase,
  studentDiagnosis: string,
  studentTreatment: string[],
  reasoning: string
) {
  try {
    const evaluationPrompt = `
You are a medical education expert evaluating a student's clinical case attempt.

CASE DETAILS:
Title: ${clinicalCase.title}
Correct Diagnosis: ${clinicalCase.correctDiagnosis}
Correct Treatment: ${clinicalCase.correctTreatment.join(', ')}
Patient Age: ${clinicalCase.patientAge}
Chief Complaint: ${clinicalCase.chiefComplaint}
Symptoms: ${clinicalCase.symptoms.join(', ')}
Physical Exam: ${clinicalCase.physicalExam}

STUDENT'S RESPONSE:
Diagnosis: ${studentDiagnosis}
Treatment Plan: ${studentTreatment.join(', ')}
Reasoning: ${reasoning}

Evaluate the student's performance and provide:
1. A score from 0-100 based on diagnostic accuracy and treatment appropriateness
2. Detailed feedback explaining what was correct and what needs improvement
3. Educational points to help the student learn

Be constructive and educational in your feedback.`;

    const evaluation = await generateText({
      model: google('gemini-1.5-pro'),
      prompt: evaluationPrompt,
    });

    // Extract score from evaluation (simple regex approach)
    const scoreMatch = evaluation.text.match(/score[:\s]*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;

    return {
      score: Math.min(Math.max(score, 0), 100), // Ensure score is between 0-100
      feedback: evaluation.text,
    };
  } catch (error) {
    console.error('Error evaluating case attempt:', error);
    return {
      score: 0,
      feedback: 'Unable to evaluate attempt. Please try again.',
    };
  }
}

// Create a new case attempt
export async function createCaseAttempt({
  caseId,
  userId,
  diagnosis,
  treatment,
  reasoning,
  transcript
}: CreateCaseAttemptParams) {
  try {
    // Get the clinical case
    const caseDoc = await db.collection('clinical_cases').doc(caseId).get();
    if (!caseDoc.exists) {
      throw new Error('Clinical case not found');
    }

    const clinicalCase = caseDoc.data() as ClinicalCase;

    // Evaluate the attempt
    const evaluation = await evaluateCaseAttempt(
      clinicalCase,
      diagnosis,
      treatment,
      reasoning
    );

    const attempt: CaseAttempt = {
      id: `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      caseId,
      userId,
      studentDiagnosis: diagnosis,
      studentTreatment: treatment,
      reasoning,
      score: evaluation.score,
      feedback: evaluation.feedback,
      timeSpent: 0, // This should be calculated from the frontend
      completedAt: new Date().toISOString(),
      transcript,
    };

    // Save attempt to Firebase
    await db.collection('case_attempts').doc(attempt.id).set(attempt);

    // Update user statistics
    await updateUserStats(userId, evaluation.score, clinicalCase.specialty);

    return { success: true, attemptId: attempt.id, score: evaluation.score, feedback: evaluation.feedback };
  } catch (error) {
    console.error('Error creating case attempt:', error);
    return { success: false, error: 'Failed to submit case attempt' };
  }
}

// Get user's case attempts
export async function getUserCaseAttempts(userId?: string): Promise<CaseAttempt[]> {
  try {
    if (!userId) return [];

    const snapshot = await db
      .collection('case_attempts')
      .where('userId', '==', userId)
      .orderBy('completedAt', 'desc')
      .get();

    return snapshot.docs.map(doc => doc.data() as CaseAttempt);
  } catch (error) {
    console.error('Error fetching user case attempts:', error);
    return [];
  }
}

// Update user statistics
async function updateUserStats(userId: string, score: number, specialty: string) {
  try {
    const userStatsRef = db.collection('user_stats').doc(userId);
    const userStatsDoc = await userStatsRef.get();

    if (userStatsDoc.exists) {
      const currentStats = userStatsDoc.data();
      const newTotalScore = (currentStats?.totalScore || 0) + score;
      const newCasesCompleted = (currentStats?.casesCompleted || 0) + 1;
      const newAverageScore = newTotalScore / newCasesCompleted;

      await userStatsRef.update({
        totalScore: newTotalScore,
        casesCompleted: newCasesCompleted,
        averageScore: newAverageScore,
        lastActivity: new Date().toISOString(),
        specialties: {
          ...currentStats?.specialties,
          [specialty]: (currentStats?.specialties?.[specialty] || 0) + 1,
        },
      });
    } else {
      await userStatsRef.set({
        userId,
        totalScore: score,
        casesCompleted: 1,
        averageScore: score,
        lastActivity: new Date().toISOString(),
        specialties: {
          [specialty]: 1,
        },
      });
    }
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
}

// Get leaderboard
export async function getLeaderboard(specialty?: string): Promise<LeaderboardEntry[]> {
  try {
    let query = db.collection('user_stats')
      .where('casesCompleted', '>', 0)
      .orderBy('averageScore', 'desc')
      .limit(50);

    const snapshot = await query.get();
    const stats = snapshot.docs.map(doc => doc.data());

    // Get user names
    const userIds = stats.map(stat => stat.userId);
    const userDocs = await Promise.all(
      userIds.map(id => db.collection('users').doc(id).get())
    );

    const leaderboard: LeaderboardEntry[] = stats.map((stat, index) => {
      const userDoc = userDocs[index];
      const userData = userDoc.exists ? userDoc.data() : null;

      return {
        userId: stat.userId,
        userName: userData?.name || 'Anonymous',
        totalScore: stat.totalScore || 0,
        casesCompleted: stat.casesCompleted || 0,
        averageScore: stat.averageScore || 0,
        rank: index + 1,
        specialty: specialty || undefined,
      };
    });

    return leaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

// Search medical references (placeholder for PubMed/Medscape integration)
// export async function searchMedicalReferences(query: string): Promise<MedicalReference[]> {
//   try {
//     // This is a placeholder implementation
//     // In a real application, you would integrate with PubMed API, Medscape, etc.
    
//     const mockReferences: MedicalReference[] = [
//       {
//         title: `Clinical Guidelines for ${query}`,
//         url: `https://pubmed.ncbi.nlm.nih.gov/search?term=${encodeURIComponent(query)}`,
//         source: 'pubmed',
//         relevanceScore: 0.95,
//       },
//       {
//         title: `${query} - Clinical Overview`,
//         url: `https://reference.medscape.com/search?q=${encodeURIComponent(query)}`,
//         source: 'medscape',
//         relevanceScore: 0.90,
//       },
//     ];

//     return mockReferences;
//   } catch (error) {
//     console.error('Error searching medical references:', error);
//     return [];
//   }
// }
