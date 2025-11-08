import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface QuizQuestion {
  id: string;
  question: string;
  type: "mcq" | "short";
  options?: string[];
  correctAnswer: string;
  difficulty: "easy" | "medium" | "hard";
  marks: number;
  explanation: string;
}

interface SessionQuizProps {
  onQuizComplete?: (score: number, totalMarks: number) => void;
  minimumScore?: number;
}

const mockQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "Which of Newton's laws states that an object at rest stays at rest?",
    type: "mcq",
    options: ["First Law", "Second Law", "Third Law", "Law of Gravitation"],
    correctAnswer: "First Law",
    difficulty: "easy",
    marks: 2,
    explanation: "Newton's First Law (Law of Inertia) states that objects at rest stay at rest unless acted upon by an external force."
  },
  {
    id: "q2",
    question: "Calculate the force required to accelerate a 5kg mass at 10m/s².",
    type: "short",
    correctAnswer: "50N",
    difficulty: "medium",
    marks: 3,
    explanation: "Using F=ma: F = 5kg × 10m/s² = 50N"
  },
  {
    id: "q3",
    question: "Derive and explain the mathematical relationship in Newton's Second Law.",
    type: "short",
    correctAnswer: "F=ma",
    difficulty: "hard",
    marks: 5,
    explanation: "Newton's Second Law states that Force (F) equals mass (m) times acceleration (a), expressed as F=ma."
  }
];

export const SessionQuiz = ({ onQuizComplete, minimumScore = 0 }: SessionQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (submitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    let totalScore = 0;
    mockQuestions.forEach((q) => {
      if (answers[q.id]?.toLowerCase().trim() === q.correctAnswer.toLowerCase()) {
        totalScore += q.marks;
      }
    });
    setScore(totalScore);
    setSubmitted(true);

    // Update stats
    const stats = JSON.parse(localStorage.getItem('userStats') || JSON.stringify({
      totalStudyHours: 0,
      questionsAnswered: 0,
      averageScore: 0,
      activePlans: 0
    }));
    
    stats.questionsAnswered += mockQuestions.length;
    const totalMarks = mockQuestions.reduce((sum, q) => sum + q.marks, 0);
    const percentage = (totalScore / totalMarks) * 100;
    stats.averageScore = stats.averageScore === 0 ? percentage : (stats.averageScore + percentage) / 2;
    localStorage.setItem('userStats', JSON.stringify(stats));

    if (onQuizComplete) {
      onQuizComplete(totalScore, totalMarks);
    } else {
      toast.success(`Quiz completed! You scored ${totalScore}/${totalMarks}`);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-success/10 text-success";
      case "medium": return "bg-warning/10 text-warning";
      case "hard": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const currentQ = mockQuestions[currentQuestion];
  const totalMarks = mockQuestions.reduce((sum, q) => sum + q.marks, 0);
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-primary">
              <Clock className="w-5 h-5" />
              <span className="text-2xl font-bold">{formatTime(timeLeft)}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {mockQuestions.length}
            </div>
          </div>
          <Badge variant="outline">
            {answeredCount}/{mockQuestions.length} Answered
          </Badge>
        </div>

        <Progress value={(answeredCount / mockQuestions.length) * 100} className="mb-6" />

        {!submitted ? (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getDifficultyColor(currentQ.difficulty)}>
                    {currentQ.difficulty}
                  </Badge>
                  <Badge variant="outline">{currentQ.marks} marks</Badge>
                </div>
                <h3 className="text-xl font-semibold mb-4">{currentQ.question}</h3>
              </div>
            </div>

            {currentQ.type === "mcq" && currentQ.options ? (
              <RadioGroup
                value={answers[currentQ.id] || ""}
                onValueChange={(value) => handleAnswer(currentQ.id, value)}
              >
                <div className="space-y-3">
                  {currentQ.options.map((option) => (
                    <div
                      key={option}
                      className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-smooth cursor-pointer"
                    >
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            ) : (
              <Textarea
                placeholder="Type your answer here..."
                value={answers[currentQ.id] || ""}
                onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                rows={4}
                className="resize-none"
              />
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              {currentQuestion < mockQuestions.length - 1 ? (
                <Button
                  variant="default"
                  onClick={() => setCurrentQuestion((prev) => prev + 1)}
                  className="flex-1"
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={handleSubmit}
                  disabled={answeredCount < mockQuestions.length}
                  className="flex-1 gradient-primary"
                >
                  Submit Quiz
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className={`text-center p-8 rounded-xl ${
              ((score / totalMarks) * 100) >= minimumScore 
                ? 'bg-success/10 border-2 border-success' 
                : 'bg-destructive/10 border-2 border-destructive'
            }`}>
              <div className="text-6xl font-bold text-primary mb-2">
                {score}/{totalMarks}
              </div>
              <p className="text-lg text-muted-foreground mb-2">
                {((score / totalMarks) * 100).toFixed(1)}% Score
              </p>
              {minimumScore > 0 && (
                <p className={`text-sm font-semibold ${
                  ((score / totalMarks) * 100) >= minimumScore 
                    ? 'text-success' 
                    : 'text-destructive'
                }`}>
                  {((score / totalMarks) * 100) >= minimumScore 
                    ? `✓ Passed! (Required: ${minimumScore}%)` 
                    : `✗ Failed (Required: ${minimumScore}%)`}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Review Answers</h3>
              {mockQuestions.map((q, index) => {
                const userAnswer = answers[q.id];
                const isCorrect = userAnswer?.toLowerCase().trim() === q.correctAnswer.toLowerCase();
                
                return (
                  <Card key={q.id} className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-success mt-1" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive mt-1" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold mb-2">Q{index + 1}. {q.question}</p>
                        <div className="space-y-1 text-sm">
                          <p className="text-muted-foreground">
                            Your answer: <span className={isCorrect ? "text-success" : "text-destructive"}>{userAnswer || "Not answered"}</span>
                          </p>
                          {!isCorrect && (
                            <p className="text-muted-foreground">
                              Correct answer: <span className="text-success">{q.correctAnswer}</span>
                            </p>
                          )}
                        </div>
                        <div className="mt-2 p-3 bg-accent/5 rounded-lg">
                          <p className="text-xs text-muted-foreground flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            {q.explanation}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{q.marks} marks</Badge>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
