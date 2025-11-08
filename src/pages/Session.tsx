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
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2">{sessionData.topic}</h1>
            <p className="text-muted-foreground text-lg">{sessionData.subject}</p>
          </div>

          {/* Progress Section */}
          <Card className="p-6 mb-6 bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">Your Progress</h3>
              <Badge variant="outline" className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                {progress.toFixed(0)}% Complete
              </Badge>
            </div>
            <Progress value={progress} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              Keep going! Complete all days to finish this plan.
            </p>
          </Card>

          <DaySchedule 
            planId={sessionData.planId}
            subject={sessionData.subject}
            topic={sessionData.topic}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
