import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Star, Calendar, ChevronRight, Trophy, Target, Brain, Clock, Stethoscope, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getCurrentUser } from "@/lib/actions/auth.action";

// Temporary placeholder functions
const getClinicalCaseFeedback = async (caseId: string, userId: string): Promise<ClinicalCaseFeedback | null> => {
  // Mock feedback data
  return {
    id: 'feedback_1',
    caseAttemptId: 'attempt_1',
    caseId,
    userId,
    totalScore: 87,
    categoryScores: [
      {
        name: "Diagnostic Accuracy",
        score: 90,
        comment: "Excellent diagnostic reasoning. Correctly identified the primary condition with appropriate differential considerations."
      },
      {
        name: "Treatment Planning",
        score: 85,
        comment: "Good treatment approach. Minor improvements needed in medication dosing and monitoring protocols."
      },
      {
        name: "Clinical Reasoning",
        score: 88,
        comment: "Strong analytical thinking. Well-structured approach to case analysis with logical progression."
      },
      {
        name: "Time Efficiency",
        score: 85,
        comment: "Completed case within reasonable timeframe. Could improve efficiency in history taking."
      }
    ],
    diagnosticAccuracy: 90,
    treatmentAppropriate: 85,
    clinicalReasoning: 88,
    timeEfficiency: 85,
    correctDiagnosis: "Acute Myocardial Infarction",
    studentDiagnosis: "Myocardial Infarction",
    correctTreatment: ["Aspirin 325mg", "Atorvastatin 80mg", "Metoprolol 25mg BID", "Lisinopril 5mg daily"],
    studentTreatment: ["Aspirin", "Statin", "Beta-blocker"],
    strengths: [
      "Excellent history taking skills and patient rapport",
      "Systematic approach to physical examination",
      "Accurate interpretation of clinical findings",
      "Appropriate use of diagnostic tests"
    ],
    areasForImprovement: [
      "Include specific medication dosages in treatment plans",
      "Consider contraindications and drug interactions",
      "Develop more comprehensive discharge planning",
      "Improve efficiency in clinical documentation"
    ],
    detailedFeedback: "Overall excellent performance on this cardiovascular case. Your diagnostic skills are strong and you demonstrated good clinical reasoning throughout the case. Focus on being more specific with treatment plans and consider the complete patient care continuum.",
    recommendedReading: [
      {
        title: "Acute Coronary Syndrome Management Guidelines",
        url: "https://pubmed.ncbi.nlm.nih.gov/acs-guidelines",
        source: "pubmed",
        relevanceScore: 0.95
      },
      {
        title: "STEMI Treatment Protocols",
        url: "https://reference.medscape.com/stemi",
        source: "medscape",
        relevanceScore: 0.90
      }
    ],
    createdAt: new Date().toISOString()
  };
};

const getClinicalCaseById = async (caseId: string): Promise<ClinicalCase | null> => {
  // Mock case data
  return {
    id: caseId,
    title: 'Acute Chest Pain in 45-Year-Old Male',
    patientAge: 45,
    patientGender: 'male',
    chiefComplaint: 'Sudden onset chest pain radiating to left arm',
    symptoms: ['chest pain', 'shortness of breath', 'nausea', 'sweating'],
    vitals: {
      bloodPressure: '150/95',
      heartRate: 110,
      temperature: 98.6,
      respiratoryRate: 22,
      oxygenSaturation: 96
    },
    medicalHistory: ['hypertension', 'smoking history'],
    physicalExam: 'Diaphoretic, anxious appearing male. Heart sounds regular with no murmurs.',
    correctDiagnosis: 'Acute Myocardial Infarction',
    correctTreatment: ['aspirin', 'oxygen', 'nitroglycerin', 'morphine', 'cardiac catheterization'],
    difficulty: 'intermediate',
    specialty: 'cardiology',
    createdAt: new Date().toISOString()
  };
};

const ClinicalCaseFeedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const clinicalCase = await getClinicalCaseById(id);
  if (!clinicalCase) redirect("/clinical-cases");

  const feedback = await getClinicalCaseFeedback(id, user?.id || "");
  if (!feedback) redirect("/clinical-cases");

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 80) return "text-blue-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 90) return "from-green-500/20 to-green-600/5";
    if (score >= 80) return "from-blue-500/20 to-blue-600/5";
    if (score >= 70) return "from-yellow-500/20 to-yellow-600/5";
    return "from-red-500/20 to-red-600/5";
  };

  return (
    <div className="min-h-screen bg-dark-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with Breadcrumb */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-sm text-light-100 mb-4">
            <Link href="/clinical-cases" className="hover:text-primary-200 transition-colors">Clinical Cases</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Case Feedback</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary-200 to-primary-300 bg-clip-text text-transparent">
            Clinical Case Feedback
          </h1>
          <p className="mt-2 text-xl text-light-100">
            {clinicalCase.title} - {clinicalCase.specialty}
          </p>
        </div>

        {/* Score Overview */}
        <Card className={`p-8 mb-8 bg-gradient-to-br ${getScoreGradient(feedback.totalScore)} border-neutral-700`}>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-semibold mb-2 text-white">Overall Performance</h2>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Stethoscope className="w-8 h-8 text-primary-200" />
                <span className={`text-4xl font-bold ${getScoreColor(feedback.totalScore)}`}>
                  {feedback.totalScore}
                  <span className="text-xl text-light-100">/100</span>
                </span>
              </div>
              <div className="mt-4 flex items-center gap-4 justify-center md:justify-start">
                <div className="text-center">
                  <div className="text-sm text-light-100">Diagnosis</div>
                  <div className={`text-lg font-semibold ${getScoreColor(feedback.diagnosticAccuracy)}`}>
                    {feedback.diagnosticAccuracy}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-light-100">Treatment</div>
                  <div className={`text-lg font-semibold ${getScoreColor(feedback.treatmentAppropriate)}`}>
                    {feedback.treatmentAppropriate}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-light-100">Reasoning</div>
                  <div className={`text-lg font-semibold ${getScoreColor(feedback.clinicalReasoning)}`}>
                    {feedback.clinicalReasoning}%
                  </div>
                </div>
              </div>
            </div>
            <div className="h-24 w-px bg-neutral-700 hidden md:block" />
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-light-100 mb-4">
                <Calendar className="w-4 h-4" />
                <span>
                  {dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-light-100">{feedback.detailedFeedback}</p>
            </div>
          </div>
        </Card>

        {/* Case Summary */}
        <Card className="p-6 mb-8 bg-dark-200 border-neutral-700">
          <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary-200" />
            Case Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-white mb-2">Your Diagnosis</h4>
              <p className="text-light-100 bg-dark-100 p-3 rounded-lg">{feedback.studentDiagnosis}</p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Correct Diagnosis</h4>
              <p className="text-light-100 bg-dark-100 p-3 rounded-lg">{feedback.correctDiagnosis}</p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Your Treatment Plan</h4>
              <div className="bg-dark-100 p-3 rounded-lg">
                {feedback.studentTreatment.map((treatment, index) => (
                  <div key={index} className="text-light-100">• {treatment}</div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Recommended Treatment</h4>
              <div className="bg-dark-100 p-3 rounded-lg">
                {feedback.correctTreatment.map((treatment, index) => (
                  <div key={index} className="text-light-100">• {treatment}</div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Category Scores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-8 bg-dark-200 border-neutral-700">
            <h2 className="text-2xl font-semibold mb-6 text-white">Performance Breakdown</h2>
            <div className="space-y-6">
              {feedback.categoryScores.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-white">{category.name}</span>
                    <span className={`font-semibold ${getScoreColor(category.score)}`}>{category.score}%</span>
                  </div>
                  <Progress value={category.score} className="h-2" />
                  <p className="mt-2 text-sm text-light-100">{category.comment}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-8">
            {/* Strengths */}
            <Card className="p-8 border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-600/5">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-6 h-6 text-green-400" />
                <h3 className="text-2xl font-semibold text-white">Clinical Strengths</h3>
              </div>
              <ul className="space-y-3">
                {feedback.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2" />
                    <span className="text-light-100">{strength}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Areas for Improvement */}
            <Card className="p-8 border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-yellow-400" />
                <h3 className="text-2xl font-semibold text-white">Areas to Improve</h3>
              </div>
              <ul className="space-y-3">
                {feedback.areasForImprovement.map((area, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2" />
                    <span className="text-light-100">{area}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        {/* Recommended Reading */}
        <Card className="p-8 mb-8 bg-dark-200 border-neutral-700">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-primary-200" />
            <h3 className="text-2xl font-semibold text-white">Recommended Reading</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedback.recommendedReading.map((reference, index) => (
              <div key={index} className="bg-dark-100 p-4 rounded-lg border border-neutral-700">
                <h4 className="font-medium text-white mb-2">{reference.title}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-light-100 capitalize">{reference.source}</span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => window.open(reference.url, '_blank')}
                    className="text-primary-200 border-primary-500/30 hover:bg-primary-500/10"
                  >
                    Read
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            className="flex-1 bg-transparent border-neutral-700 text-light-100 hover:bg-neutral-800"
          >
            <Link href="/clinical-cases" className="w-full">
              Return to Cases
            </Link>
          </Button>
          <Button
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
          >
            <Link href={`/clinical-cases/${id}`} className="w-full">
              Retry Case
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClinicalCaseFeedback;
