import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SessionQuiz } from "@/components/SessionQuiz";
import { YouTubeVideoCard } from "@/components/YouTubeVideoCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, ArrowLeft, BookOpen, Target, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function SessionDay() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("videos");
  const [videosWatched, setVideosWatched] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sessionData = {
    dayNumber: parseInt(searchParams.get('dayNumber') || '1'),
    planId: searchParams.get('plan') || '',
    subject: searchParams.get('subject') || '',
    topic: searchParams.get('topic') || '',
    date: searchParams.get('date') || ''
  };

  // Load the study plan and get the daily content
  const studyPlans = JSON.parse(localStorage.getItem('studyPlans') || '[]');
  const currentPlan = studyPlans.find((p: any) => p.id === sessionData.planId);
  const dayIndex = sessionData.dayNumber - 1;
  const dayContent = currentPlan?.dailySchedule?.[dayIndex] || {
    topics: sessionData.topic,
    summary: "Study the fundamentals and practice problems to master today's topics.",
    videos: []
  };

  const handleVideosComplete = () => {
    setVideosWatched(true);
    setActiveTab("quiz");
    toast.success("Great! Now complete the quiz to mark this day as finished.");
  };

  const handleQuizComplete = (score: number, totalMarks: number) => {
    const percentage = (score / totalMarks) * 100;

    if (percentage >= 75) {
      setQuizCompleted(true);
      toast.success(`🎉 Excellent! You scored ${percentage.toFixed(1)}%`);
    } else {
      toast.error(`You scored ${percentage.toFixed(1)}%. You need 75% or higher. Try again!`);
    }
  };

  const handleCompleteDay = () => {
    // Mark day as complete
    const savedProgress = localStorage.getItem(`schedule_${sessionData.planId}`);
    const progress = savedProgress ? JSON.parse(savedProgress) : {};
    
    progress[sessionData.date] = {
      completed: true,
      locked: false
    };

    // Unlock next day
    const tomorrow = new Date(sessionData.date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    if (progress[tomorrowStr]) {
      progress[tomorrowStr].locked = false;
    }

    localStorage.setItem(`schedule_${sessionData.planId}`, JSON.stringify(progress));

    // Update study hours
    const stats = JSON.parse(localStorage.getItem('userStats') || JSON.stringify({
      totalStudyHours: 0,
      questionsAnswered: 0,
      averageScore: 0,
      activePlans: 0
    }));
    stats.totalStudyHours += 0.75; // 45 minutes
    localStorage.setItem('userStats', JSON.stringify(stats));

    toast.success(`🎉 Day ${sessionData.dayNumber} completed! Excellent work!`);
    
    setTimeout(() => {
      navigate(`/session?plan=${sessionData.planId}&subject=${encodeURIComponent(sessionData.subject)}&topic=${encodeURIComponent(sessionData.topic)}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(`/session?subject=${encodeURIComponent(sessionData.subject)}&topic=${encodeURIComponent(sessionData.topic)}&plan=${sessionData.planId}`)}
            className="mb-8 hover-lift"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Schedule
          </Button>

          <div className="mb-8 animate-slide-up">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1">Day {sessionData.dayNumber}</Badge>
              <Badge className="bg-secondary/10 text-secondary border-secondary/20 px-3 py-1">
                {sessionData.date ? new Date(sessionData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {dayContent?.topics || sessionData.topic}
            </h1>
            <p className="text-muted-foreground text-lg">{sessionData.subject}</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 animate-slide-up">
            <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="videos" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-card">
                <BookOpen className="w-4 h-4" />
                Study Videos
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-card">
                <Target className="w-4 h-4" />
                Quiz
              </TabsTrigger>
            </TabsList>

            <TabsContent value="videos" className="space-y-6 animate-scale-in">
              {/* Today's Focus */}
              <Card className="p-8 gradient-card border-primary/10 hover-lift">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                  Today's Focus
                </h3>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {dayContent?.summary || "Understanding the fundamental concepts and their practical applications. This session will help you build a strong foundation for more advanced topics."}
                </p>
              </Card>

              {/* Study Videos */}
              <Card className="p-8 gradient-card hover-lift">
                <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                  <ExternalLink className="w-6 h-6 text-secondary" />
                  Study Videos
                </h3>
                {dayContent?.videos && dayContent.videos.length > 0 ? (
                  <div className="space-y-4">
                    {dayContent.videos.map((video: any, index: number) => (
                      <YouTubeVideoCard
                        key={index}
                        {...video}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 px-4">
                    <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground text-base mb-2">
                      No videos available for this day yet.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Videos will be generated based on your uploaded materials.
                    </p>
                  </div>
                )}
              </Card>
              
              {!videosWatched && (
                <Card className="p-6 gradient-card border-accent/20 hover-lift animate-scale-in">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg mb-1">Ready for the quiz?</h3>
                      <p className="text-sm text-muted-foreground">
                        Make sure you've reviewed the content above
                      </p>
                    </div>
                    <Button onClick={handleVideosComplete} size="lg" className="gradient-primary shadow-glow">
                      I'm Ready
                    </Button>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="quiz" className="animate-scale-in">
              <SessionQuiz
                onQuizComplete={handleQuizComplete}
                minimumScore={75}
              />
            </TabsContent>
          </Tabs>

          {(videosWatched && quizCompleted) && (
            <Card className="p-8 mt-6 gradient-card border-success/20 shadow-elegant animate-scale-in">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center shadow-card">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-bold text-xl mb-2">Day {sessionData.dayNumber} Complete!</h3>
                  <p className="text-muted-foreground">
                    Great job! You've finished today's study session.
                  </p>
                </div>
                <Button
                  onClick={handleCompleteDay}
                  size="lg"
                  className="gradient-primary shadow-glow hover-lift"
                >
                  Continue
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
