import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Star, Calendar, ChevronRight, Trophy, Target } from "lucide-react";
import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id || "",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with Breadcrumb */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Interview Feedback</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight bg-primary-200 bg-clip-text text-transparent">
            Interview Feedback
          </h1>
          <p className="mt-2 text-xl text-muted-foreground">
            {interview.role} Position Assessment
          </p>
        </div>

        {/* Score Overview */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-card to-card/95 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-semibold mb-2">Overall Performance</h2>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                <span className="text-4xl font-bold text-primary">
                  {feedback?.totalScore}
                  <span className="text-xl text-muted-foreground">/100</span>
                </span>
              </div>
            </div>
            <div className="h-24 w-px bg-border hidden md:block" />
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Calendar className="w-4 h-4" />
                <span>
                  {feedback?.createdAt
                    ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                    : "N/A"}
                </span>
              </div>
              <p className="text-sm leading-relaxed">{feedback?.finalAssessment}</p>
            </div>
          </div>
        </Card>

        {/* Category Scores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Performance Breakdown</h2>
            <div className="space-y-6">
              {feedback?.categoryScores?.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-primary font-semibold">{category.score}%</span>
                  </div>
                  <Progress value={category.score} className="h-2" />
                  <p className="mt-2 text-sm text-muted-foreground">{category.comment}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-8">
            {/* Strengths */}
            <Card className="p-8 border-green-200/20 bg-gradient-to-br from-card to-green-500/5">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-6 h-6 text-green-500" />
                <h3 className="text-2xl font-semibold">Key Strengths</h3>
              </div>
              <ul className="space-y-3">
                {feedback?.strengths?.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                    <span className="text-muted-foreground">{strength}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Areas for Improvement */}
            <Card className="p-8 border-amber-200/20 bg-gradient-to-br from-card to-amber-500/5">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-amber-500" />
                <h3 className="text-2xl font-semibold">Improvements</h3>
              </div>
              <ul className="space-y-3">
                {feedback?.areasForImprovement?.map((area, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2" />
                    <span className="text-muted-foreground">{area}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            className="flex-1 btn-secondary"
          >
            <Link href="/" className="w-full">
              Return to Home
            </Link>
          </Button>
          <Button
            className="flex-1 btn-primary"
          >
            <Link href={`/interview/${id}`} className="w-full">
              Retake Interview
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;