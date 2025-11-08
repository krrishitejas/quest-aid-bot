import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SessionContent } from "@/components/SessionContent";
import { CitationCard } from "@/components/CitationCard";
import { ImportantQuestions } from "@/components/ImportantQuestions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Download, FileDown, Clock, BookOpen } from "lucide-react";
import { toast } from "sonner";

const mockSession = {
  topic: "Newton's Laws of Motion",
  objective: "Understand the three fundamental laws of motion and their applications",
  duration: 45,
  summary: "Newton's three laws of motion form the foundation of classical mechanics.",
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
      excerpt: "Newton's first law states that every object will remain at rest..."
    }
  ],
  commonMistakes: ["Confusing mass with weight"],
  mnemonics: ["FBI: Force = Base × Increase"]
};

export default function Session() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("content");

  const handleComplete = () => {
    toast.success("Session completed! +25 XP earned");
    setTimeout(() => navigate("/"), 1500);
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
            <div>
              <h1 className="text-4xl font-bold mb-2">{mockSession.topic}</h1>
              <p className="text-muted-foreground text-lg">{mockSession.objective}</p>
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
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="content">Study Content</TabsTrigger>
              <TabsTrigger value="important">Important Questions</TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <SessionContent session={mockSession} />
                  <Button onClick={handleComplete} size="lg" className="w-full mt-6 gradient-primary text-white">
                    <CheckCircle className="mr-2 w-5 h-5" />
                    Mark as Complete
                  </Button>
                </div>

                <div className="space-y-6">
                  <Card className="p-6 sticky top-6">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Citations
                    </h3>
                    <div className="space-y-3">
                      {mockSession.citations.map((citation, i) => (
                        <CitationCard key={i} citation={citation} />
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="important">
              <ImportantQuestions />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
