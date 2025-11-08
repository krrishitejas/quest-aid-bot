import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SessionContent } from "@/components/SessionContent";
import { SessionQuiz } from "@/components/SessionQuiz";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const mockSession = {
  topic: "Newton's Laws of Motion",
  objective: "Understand the three fundamental laws of motion and their applications",
  duration: 45,
  summary: "Newton's three laws of motion form the foundation of classical mechanics. This content is extracted from your uploaded PDF documents and customized to match your learning objectives.",
  keyPoints: [
    "First Law (Inertia): Objects at rest stay at rest",
    "Second Law (F=ma): Force equals mass times acceleration",
    "Third Law (Action-Reaction): Equal and opposite reactions"
  ],
  formulas: [
    {
      name: "Newton's Second Law",
      formula: "F = ma",
      variables: "F: Force (N), m: mass (kg), a: acceleration (m/s²)",
      whenToUse: "When calculating force given mass and acceleration"
    }
  ],
  examples: [
    {
      description: "A hockey puck sliding on ice",
      relatesTo: "First Law",
      explanation: "The puck continues moving until friction slows it down"
    }
  ],
  citations: [],
  youtubeVideos: [],
  commonMistakes: ["Confusing mass with weight"],
  mnemonics: ["FBI: Force = Base × Increase"]
};

export default function SessionDay() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("content");
  const [contentCompleted, setContentCompleted] = useState(false);
  const [quizAttempted, setQuizAttempted] = useState(false);

  const dayNumber = searchParams.get('dayNumber') || '1';
  const planId = searchParams.get('plan') || '';
  const subject = searchParams.get('subject') || '';
  const topic = searchParams.get('topic') || '';
  const date = searchParams.get('date') || '';

  const dayTopics = [
    "Introduction & Basics",
    "Core Concepts",
    "Advanced Topics",
    "Practice Problems",
    "Review & Revision",
    "Mock Test",
    "Final Review"
  ];

  const handleContentComplete = () => {
    setContentCompleted(true);
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

      // Update study hours
      const stats = JSON.parse(localStorage.getItem('userStats') || JSON.stringify({
        totalStudyHours: 0,
        questionsAnswered: 0,
        averageScore: 0,
        activePlans: 0
      }));
      stats.totalStudyHours += mockSession.duration / 60;
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
                {dayTopics[parseInt(dayNumber) - 1] || `Day ${dayNumber}`}
              </h1>
            </div>
            <p className="text-muted-foreground text-lg mb-4">
              {subject} - {topic}
            </p>
            <div className="flex items-center gap-4">
              {contentCompleted && (
                <Badge variant="outline" className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Content Reviewed
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
              <TabsTrigger value="content">Study Content</TabsTrigger>
              <TabsTrigger value="quiz" disabled={!contentCompleted}>
                Quiz {!contentCompleted && "(Complete content first)"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              <SessionContent session={mockSession} />
              
              {!contentCompleted && (
                <Card className="p-6 mt-6 bg-accent/5 border-primary">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold mb-1">Ready for the quiz?</h3>
                      <p className="text-sm text-muted-foreground">
                        Make sure you've reviewed all the content above
                      </p>
                    </div>
                    <Button onClick={handleContentComplete} className="gradient-primary">
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
