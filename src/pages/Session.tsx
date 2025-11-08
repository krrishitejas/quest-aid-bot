import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SessionContent } from "@/components/SessionContent";
import { CitationCard } from "@/components/CitationCard";
import { YouTubeVideoCard } from "@/components/YouTubeVideoCard";
import { ImportantQuestions } from "@/components/ImportantQuestions";
import { SessionQuiz } from "@/components/SessionQuiz";
import { DaySchedule } from "@/components/DaySchedule";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Download, FileDown, Clock, BookOpen, Youtube, Trophy } from "lucide-react";
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
  citations: [
    {
      filename: "physics_notes.pdf",
      page: 12,
      relevance: 0.89,
      excerpt: "Newton's first law states that every object will remain at rest or in uniform motion unless acted upon by an external force..."
    },
    {
      filename: "mechanics_chapter3.pdf",
      page: 45,
      relevance: 0.82,
      excerpt: "The mathematical formulation F=ma represents the relationship between force, mass, and acceleration..."
    }
  ],
  youtubeVideos: [
    {
      title: "Newton's Laws of Motion Explained",
      channel: "Physics Explained",
      duration: "12:45",
      views: "2.3M",
      url: "https://www.youtube.com/watch?v=example1",
      thumbnail: "",
      relevance: 0.92
    },
    {
      title: "Real World Examples of Newton's Laws",
      channel: "Science Academy",
      duration: "8:30",
      views: "890K",
      url: "https://www.youtube.com/watch?v=example2",
      thumbnail: "",
      relevance: 0.85
    }
  ],
  commonMistakes: ["Confusing mass with weight"],
  mnemonics: ["FBI: Force = Base × Increase"]
};

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
  
  const [activeTab, setActiveTab] = useState("content");

  const handleComplete = () => {
    // This is now handled by the day schedule component
    toast.success("Great work! Mark today's session as complete in the schedule below.");
  };

  const handleExport = (format: string) => {
    toast.success(`Exporting as ${format.toUpperCase()}...`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{sessionData.subject} - {sessionData.topic}</h1>
              <p className="text-muted-foreground text-lg mb-4">{mockSession.objective}</p>
              
              <div className="flex items-center gap-4">
                <div className="flex-1 max-w-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">Overall Progress</span>
                    <span className="text-sm text-primary font-bold flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={progress} />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleExport("markdown")}>
                <FileDown className="w-4 h-4 mr-2" />
                MD
              </Button>
              <Button variant="outline" onClick={() => handleExport("pdf")}>
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-2xl grid-cols-3 mb-6">
              <TabsTrigger value="content">Study Content</TabsTrigger>
              <TabsTrigger value="important">Important Questions</TabsTrigger>
              <TabsTrigger value="quiz">Quiz</TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <SessionContent session={mockSession} />
                  
                  <DaySchedule 
                    planId={sessionData.planId}
                    subject={sessionData.subject}
                    topic={sessionData.topic}
                  />
                </div>

                <div className="space-y-6">
                  <Card className="p-6 sticky top-6">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Citations from PDFs
                    </h3>
                    <div className="space-y-3">
                      {mockSession.citations.map((citation, i) => (
                        <CitationCard key={i} citation={citation} />
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6 sticky top-6">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Youtube className="w-5 h-5 text-destructive" />
                      Related Videos
                    </h3>
                    <div className="space-y-3">
                      {mockSession.youtubeVideos.map((video, i) => (
                        <YouTubeVideoCard key={i} video={video} />
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="important">
              <ImportantQuestions />
            </TabsContent>

            <TabsContent value="quiz">
              <SessionQuiz />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
