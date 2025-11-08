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
import { CheckCircle, ArrowLeft, BookOpen } from "lucide-react";
import { toast } from "sonner";

export default function SessionDay() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("videos");
  const [videosWatched, setVideosWatched] = useState(false);
  const [quizAttempted, setQuizAttempted] = useState(false);

  const dayNumber = searchParams.get('dayNumber') || '1';
  const planId = searchParams.get('plan') || '';
  const subject = searchParams.get('subject') || '';
  const topic = searchParams.get('topic') || '';
  const date = searchParams.get('date') || '';

  // Load the study plan and get the daily content
  const studyPlans = JSON.parse(localStorage.getItem('studyPlans') || '[]');
  const currentPlan = studyPlans.find((p: any) => p.id === planId);
  const dayIndex = parseInt(dayNumber) - 1;
  const dayContent = currentPlan?.dailySchedule?.[dayIndex] || {
    topics: [topic],
    summary: "Study the fundamentals and practice problems to master today's topics.",
    videos: []
  };

  const handleVideosComplete = () => {
    setVideosWatched(true);
    setActiveTab("quiz");
    toast.success("Great! Now complete the quiz to mark this day as finished.");
  };

  const handleQuizComplete = (score: number, totalMarks: number) => {
    setQuizAttempted(true);
    const percentage = (score / totalMarks) * 100;

    if (percentage >= 75) {
      // Mark day as complete
      const savedProgress = localStorage.getItem(`schedule_${planId}`);
      const progress = savedProgress ? JSON.parse(savedProgress) : {};
      
      progress[date] = {
        completed: true,
        locked: false,
        score: percentage
      };

      // Unlock next day
      const tomorrow = new Date(date);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      if (progress[tomorrowStr]) {
        progress[tomorrowStr].locked = false;
      }

      localStorage.setItem(`schedule_${planId}`, JSON.stringify(progress));

      // Update study hours (assuming 45 min per day on average)
      const stats = JSON.parse(localStorage.getItem('userStats') || JSON.stringify({
        totalStudyHours: 0,
        questionsAnswered: 0,
        averageScore: 0,
        activePlans: 0
      }));
      stats.totalStudyHours += 0.75; // 45 minutes
      localStorage.setItem('userStats', JSON.stringify(stats));

      toast.success(`🎉 Day ${dayNumber} completed with ${percentage.toFixed(1)}%! Excellent work!`);
      
      setTimeout(() => {
        navigate(`/session?plan=${planId}&subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}`);
      }, 2000);
    } else {
      toast.error(`You scored ${percentage.toFixed(1)}%. You need 75% or higher to complete this day. Review the content and try again!`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(`/session?plan=${planId}&subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}`)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Schedule
          </Button>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="default" className="text-lg px-3 py-1">
                Day {dayNumber}
              </Badge>
              <h1 className="text-4xl font-bold">
                {dayContent.topics.join(' • ')}
              </h1>
            </div>
            <p className="text-muted-foreground text-lg mb-4">
              {subject}
            </p>
            <div className="flex items-center gap-4">
              {videosWatched && (
                <Badge variant="outline" className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Videos Watched
                </Badge>
              )}
              {quizAttempted && (
                <Badge variant="outline">
                  Quiz Attempted
                </Badge>
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="videos">Study Videos</TabsTrigger>
              <TabsTrigger value="quiz" disabled={!videosWatched}>
                Quiz {!videosWatched && "(Watch videos first)"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="videos">
              <Card className="p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                  Today's Focus
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {dayContent.summary}
                </p>
              </Card>

              <Card className="p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Study Videos</h2>
                <p className="text-muted-foreground mb-6">
                  Watch these videos to understand today's topics thoroughly. Click any video to open it on YouTube.
                </p>

                {dayContent.videos.length > 0 ? (
                  <div className="space-y-4">
                    {dayContent.videos.map((video: any, index: number) => (
                      <YouTubeVideoCard key={index} video={video} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-accent/5 rounded-xl border border-dashed border-border">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      Video recommendations will be generated based on your uploaded study materials.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      This feature will be powered by AI analysis of your notes and previous year papers.
                    </p>
                  </div>
                )}
              </Card>
              
              {!videosWatched && (
                <Card className="p-6 bg-accent/5 border-primary">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold mb-1">Ready for the quiz?</h3>
                      <p className="text-sm text-muted-foreground">
                        Make sure you've watched the videos above
                      </p>
                    </div>
                    <Button onClick={handleVideosComplete} className="gradient-primary">
                      I'm Ready
                    </Button>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="quiz">
              <Card className="p-6 mb-6 bg-warning/5 border-warning">
                <h3 className="font-bold mb-2">📝 Quiz Requirements</h3>
                <p className="text-sm text-muted-foreground">
                  You need to score 75% or higher to complete this day and unlock the next day.
                </p>
              </Card>
              
              <SessionQuiz onQuizComplete={handleQuizComplete} minimumScore={75} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
