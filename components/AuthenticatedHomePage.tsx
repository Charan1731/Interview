import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId, getAllInterviews } from "@/lib/actions/general.action";
import InterviewCard from "./InterviewCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const AuthenticatedHomePage = async () => {
    const user = await getCurrentUser();
    const [userInterviews, allInterviews] = await Promise.all([
      getInterviewsByUserId(user?.id || ""),
      getAllInterviews({userId: user?.id || ""})
    ]);
  
    const hasPastInterviews = userInterviews?.length ?? 0 > 0;
    const hasAllInterviews = allInterviews?.length ?? 0 > 0;
  
    return (
      <div className="space-y-16">
        {/* Enhanced CTA Section for authenticated users */}
        <section className="relative">
          <div className="card-border w-full">
            <div className="card p-12 rounded-2xl relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-200/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-primary-300/10 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-success-100/10 to-primary-200/10 rounded-full border border-success-100/20">
                      <div className="w-2 h-2 bg-success-100 rounded-full animate-pulse"></div>
                      <span className="text-success-100 font-medium text-sm">Welcome back!</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                      <span className="text-white block">Continue Your</span>
                      <span className="bg-gradient-to-r from-primary-200 to-primary-300 bg-clip-text text-transparent block">
                        Practice Journey
                      </span>
                    </h2>
                    
                    <p className="text-xl text-light-100 leading-relaxed font-light">
                      Ready to practice? Choose between tech interviews and clinical cases. Get AI-powered feedback and track your progress with advanced analytics.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button asChild className="group bg-gradient-to-r from-primary-200 to-primary-300 hover:from-primary-300 hover:to-primary-200 text-dark-100 font-bold px-6 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-200/25">
                      <Link href="/interview" className="flex items-center gap-3">
                        <span className="text-lg">Tech Interview</span>
                        <div className="transition-transform duration-300 group-hover:translate-x-1">
                          💻
                        </div>
                      </Link>
                    </Button>
                    
                    <Button asChild className="group bg-gradient-to-r from-success-100 to-success-200 hover:from-success-200 hover:to-success-100 text-dark-100 font-bold px-6 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-success-100/25">
                      <Link href="/clinical-cases" className="flex items-center gap-3">
                        <span className="text-lg">Clinical Cases</span>
                        <div className="transition-transform duration-300 group-hover:translate-x-1">
                          🩺
                        </div>
                      </Link>
                    </Button>
                    
                    <Button asChild variant="outline" className="group border-2 border-primary-200/30 hover:border-primary-200 bg-transparent text-primary-200 font-bold px-6 py-4 rounded-full transition-all duration-300 hover:bg-primary-200/10">
                      <Link href="/dashboard" className="flex items-center gap-2">
                        <span className="text-lg">Dashboard</span>
                        📊
                      </Link>
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-center lg:justify-end">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-200/20 to-primary-300/20 rounded-full filter blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                    <Image 
                      src="/robot.png" 
                      alt="AI Assistant" 
                      width={400} 
                      height={400} 
                      className="relative object-contain group-hover:scale-110 transition-transform duration-500" 
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Your Interviews Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-light-100 bg-clip-text text-transparent">Your Interviews</h2>
            <div className="h-px bg-gradient-to-r from-primary-200/50 to-transparent flex-1"></div>
          </div>
          
          <div className="interviews-section">
            {hasPastInterviews ? (
              userInterviews?.map((interview) => (
                <InterviewCard key={interview.id} {...interview}/>
              ))
            ) : (
              <div className="card-border w-full">
                <div className="card p-12 rounded-2xl text-center space-y-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-200/20 to-primary-300/20 rounded-full flex items-center justify-center">
                    <span className="text-4xl">🎯</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">No interviews yet</h3>
                    <p className="text-light-100">Start your first AI-powered interview session!</p>
                  </div>
                  <Button asChild className="bg-gradient-to-r from-primary-200 to-primary-300 text-dark-100 font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform duration-200">
                    <Link href="/interview">Take Your First Interview</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
        
        {/* Available Interviews Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-light-100 bg-clip-text text-transparent">Available Interviews</h2>
            <div className="h-px bg-gradient-to-r from-primary-200/50 to-transparent flex-1"></div>
          </div>
          
          <div className="interviews-section">
            {hasAllInterviews ? (
              allInterviews?.map((interview) => (
                <InterviewCard key={interview.id} {...interview}/>
              ))
            ) : (
              <div className="card-border w-full">
                <div className="card p-12 rounded-2xl text-center space-y-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-200/20 to-primary-300/20 rounded-full flex items-center justify-center">
                    <span className="text-4xl">📚</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">No interviews available</h3>
                    <p className="text-light-100">Check back soon for new interview opportunities!</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  };

  export default AuthenticatedHomePage
  