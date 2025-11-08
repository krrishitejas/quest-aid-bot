import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SessionContent } from "@/components/SessionContent";
import { CitationCard } from "@/components/CitationCard";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, BookOpen } from "lucide-react";
import { toast } from "sonner";

const mockSession = {
  topic: "Newton's Laws of Motion",
  objective: "Understand the three fundamental laws of motion and their applications",
  duration: 45,
  summary: "Newton's three laws of motion form the foundation of classical mechanics. The first law introduces the concept of inertia, the second law quantifies the relationship between force, mass, and acceleration, and the third law describes action-reaction pairs.",
  keyPoints: [
    "First Law (Inertia): Objects at rest stay at rest, objects in motion stay in motion unless acted upon by an external force",
    "Second Law (F=ma): Force equals mass times acceleration, quantifying the relationship between force and motion",
    "Third Law (Action-Reaction): For every action, there is an equal and opposite reaction"
  ],
  formulas: [
    {
      name: "Newton's Second Law",
      formula: "F = ma",
      variables: "F: Force (N), m: mass (kg), a: acceleration (m/s²)",
      whenToUse: "When calculating force given mass and acceleration, or vice versa"
    }
  ],
  examples: [
    {
      description: "A hockey puck sliding on ice",
      relatesTo: "First Law",
      explanation: "The puck continues moving at constant velocity until friction gradually slows it down"
    }
  ],
  citations: [
    {
      filename: "physics_notes.pdf",
      page: 12,
      relevance: 0.89,
      excerpt: "Newton's first law states that every object will remain at rest or in uniform motion in a straight line unless compelled to change its state by the action of an external force."
    },
    {
      filename: "2023_exam_paper.pdf",
      page: 3,
      relevance: 0.82,
      excerpt: "Calculate the force required to accelerate a 10kg object at 5m/s²..."
    }
  ],
  commonMistakes: [
    "Confusing mass (kg) with weight (N)",
    "Forgetting that forces always come in pairs",
    "Not drawing proper free body diagrams"
  ],
  mnemonics: [
    "FBI: Force = Base × Increase (F=ma)"
  ]
};

export default function Session() {
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    toast.success("Session completed! +25 XP earned");
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{mockSession.topic}</h1>
              <p className="text-muted-foreground text-lg">{mockSession.objective}</p>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-5 h-5" />
              <span>{mockSession.duration} minutes</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              <SessionContent session={mockSession} />
              
              {!isCompleted && (
                <Button
                  onClick={handleComplete}
                  size="lg"
                  className="w-full mt-8 gradient-primary text-white"
                >
                  <CheckCircle className="mr-2 w-5 h-5" />
                  Mark as Completed
                </Button>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-2xl shadow-md p-6 sticky top-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Citations
                </h3>
                <div className="space-y-4">
                  {mockSession.citations.map((citation, i) => (
                    <CitationCard key={i} citation={citation} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
