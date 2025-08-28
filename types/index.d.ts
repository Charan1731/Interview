interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}

interface Interview {
  id: string;
  role: string;
  level: string;
  questions: string[];
  techstack: string[];
  createdAt: string;
  userId: string;
  type: string;
  coverImage: string;
  finalized: boolean;
}

interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
}

interface User {
  name: string;
  email: string;
  id: string;
}

interface InterviewCardProps {
  id?: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt?: string;
  coverImage?: string;
}

interface AgentProps {
  userName: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

interface GetLatestInterviewsParams {
  userId: string;
  limit?: number;
}

interface SignInParams {
  email: string;
  idToken: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

type FormType = "sign-in" | "sign-up";

interface InterviewFormProps {
  interviewId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  amount: number;
}

interface TechIconProps {
  techStack: string[];
}

// Clinical Case Simulator Types
interface ClinicalCase {
  id: string;
  title: string;
  patientAge: number;
  patientGender: 'male' | 'female' | 'other';
  chiefComplaint: string;
  symptoms: string[];
  vitals: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    respiratoryRate: number;
    oxygenSaturation: number;
  };
  medicalHistory: string[];
  physicalExam: string;
  labResults?: Record<string, string>;
  correctDiagnosis: string;
  correctTreatment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  specialty: string;
  createdAt: string;
  userId?: string;
}

interface CaseAttempt {
  id: string;
  caseId: string;
  userId: string;
  studentDiagnosis: string;
  studentTreatment: string[];
  reasoning: string;
  score: number;
  feedback: string;
  timeSpent: number; // in seconds
  completedAt: string;
  transcript?: { role: string; content: string }[];
}

interface ClinicalCaseAgentProps {
  userName: string;
  userId: string;
  caseId?: string;
  type: "generate-case" | "solve-case";
  currentCase?: ClinicalCase;
}

interface LeaderboardEntry {
  userId: string;
  userName: string;
  totalScore: number;
  casesCompleted: number;
  averageScore: number;
  rank: number;
  specialty?: string;
}

interface MedicalReference {
  title: string;
  url: string;
  source: 'pubmed' | 'medscape' | 'uptodate';
  relevanceScore: number;
}

interface CreateCaseAttemptParams {
  caseId: string;
  userId: string;
  diagnosis: string;
  treatment: string[];
  reasoning: string;
  transcript?: { role: string; content: string }[];
}

interface ClinicalCaseFeedback {
  id: string;
  caseAttemptId: string;
  caseId: string;
  userId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  diagnosticAccuracy: number;
  treatmentAppropriate: number;
  clinicalReasoning: number;
  timeEfficiency: number;
  correctDiagnosis: string;
  studentDiagnosis: string;
  correctTreatment: string[];
  studentTreatment: string[];
  strengths: string[];
  areasForImprovement: string[];
  detailedFeedback: string;
  recommendedReading: MedicalReference[];
  createdAt: string;
}
