import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DaySchedule } from "@/components/DaySchedule";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Trophy } from "lucide-react";


export default function Session() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sessionData, setSessionData] = useState({
    subject: "Physics",
    topic: "Newton's Laws of Motion",
    planId: "plan-1"
  });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const subject = searchParams.get('subject');
    const topic = searchParams.get('topic');
    const planId = searchParams.get('plan');
    
    if (subject && topic) {
      setSessionData({
        subject: decodeURIComponent(subject),
        topic: decodeURIComponent(topic),
        planId: planId || "plan-1"
      });
    }

    // Load progress for this plan
    const savedProgress = localStorage.getItem(`schedule_${planId || "plan-1"}`);
    if (savedProgress) {
      const scheduleData = JSON.parse(savedProgress);
      const completedDays = Object.values(scheduleData).filter((day: any) => day.completed).length;
      const totalDays = 7; // 7-day schedule
      setProgress((completedDays / totalDays) * 100);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 animate-fade-in">
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-8 hover-lift"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="mb-8 animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {sessionData.topic}
            </h1>
            <p className="text-muted-foreground text-lg">{sessionData.subject}</p>
          </div>

          {/* Progress Section */}
          <Card className="p-8 mb-8 gradient-card border-primary/10 hover-lift animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Your Progress</h3>
              <Badge className="flex items-center gap-1.5 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
                <Trophy className="w-4 h-4" />
                {progress.toFixed(0)}% Complete
              </Badge>
            </div>
            <Progress value={progress} className="mb-3 h-3" />
            <p className="text-sm text-muted-foreground">
              Keep going! Complete all days to finish this plan.
            </p>
          </Card>

          <div className="animate-slide-up">
            <DaySchedule 
              planId={sessionData.planId}
              subject={sessionData.subject}
              topic={sessionData.topic}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
