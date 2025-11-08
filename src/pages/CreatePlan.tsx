import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StepWizard } from "@/components/StepWizard";
import { FileUploadZone } from "@/components/FileUploadZone";
import { ChipInput } from "@/components/ChipInput";
import { ProcessingModal } from "@/components/ProcessingModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { toast } from "sonner";

export default function CreatePlan() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    subject: "",
    examDate: "",
    dailyMinutes: 60,
    sessionLength: 45,
    topics: [] as string[],
    files: [] as File[]
  });

  const steps = ["Basic Info", "Topics", "Resources", "Review"];

  const handleNext = () => {
    if (currentStep === 1 && (!formData.subject || !formData.examDate)) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (currentStep === 2 && formData.topics.length === 0) {
      toast.error("Please add at least one topic");
      return;
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setIsProcessing(true);
    
    // Calculate days until exam
    const today = new Date();
    const examDate = new Date(formData.examDate);
    const daysUntilExam = Math.max(7, Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Create daily breakdown based on topics
    // In the future, this will be powered by AI analysis of uploaded files
    const topicsPerDay = Math.ceil(formData.topics.length / Math.min(daysUntilExam, 7));
    const dailySchedule = [];
    
    for (let day = 0; day < Math.min(daysUntilExam, 7); day++) {
      const startIdx = day * topicsPerDay;
      const dayTopics = formData.topics.slice(startIdx, startIdx + topicsPerDay);
      
      if (dayTopics.length > 0) {
        dailySchedule.push({
          day: day + 1,
          topics: dayTopics,
          summary: `Study ${dayTopics.join(', ')}. Focus on understanding core concepts and practicing problems.`,
          videos: [
            {
              title: `${dayTopics[0]} - Complete Tutorial`,
              channel: "Educational Channel",
              duration: "15:30",
              views: "1.2M",
              url: `https://youtube.com/results?search_query=${encodeURIComponent(dayTopics[0] + ' ' + formData.subject)}`,
              thumbnail: "",
              relevance: 0.95
            },
            {
              title: `${dayTopics[0]} - Practice Problems`,
              channel: "Study Helper",
              duration: "12:45",
              views: "850K",
              url: `https://youtube.com/results?search_query=${encodeURIComponent(dayTopics[0] + ' practice ' + formData.subject)}`,
              thumbnail: "",
              relevance: 0.88
            }
          ]
        });
      }
    }
    
    // Create the study plan
    const newPlan = {
      id: `plan-${Date.now()}`,
      subject: formData.subject,
      examDate: formData.examDate,
      topics: formData.topics,
      dailySchedule,
      resources: formData.files.map(file => ({
        filename: file.name,
        size: file.size,
        type: file.type
      })),
      dailyMinutes: formData.dailyMinutes,
      sessionLength: formData.sessionLength,
      createdAt: new Date().toISOString(),
      progress: 0,
      sessionsCompleted: 0,
      totalSessions: dailySchedule.length,
    };
    
    // Simulate AI processing
    setTimeout(() => {
      // Save to localStorage
      const existingPlans = JSON.parse(localStorage.getItem('studyPlans') || '[]');
      existingPlans.push(newPlan);
      localStorage.setItem('studyPlans', JSON.stringify(existingPlans));
      
      // Update stats
      const stats = JSON.parse(localStorage.getItem('userStats') || JSON.stringify({
        totalStudyHours: 0,
        questionsAnswered: 0,
        averageScore: 0,
        activePlans: 0
      }));
      stats.activePlans = existingPlans.length;
      localStorage.setItem('userStats', JSON.stringify(stats));
      
      setIsProcessing(false);
      toast.success("Study plan created successfully!");
      // Navigate directly to the study schedule
      navigate(`/session?planId=${newPlan.id}&subject=${encodeURIComponent(formData.subject)}&topic=${encodeURIComponent(formData.topics[0] || 'General')}`);
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Create Study Plan</h1>
          <p className="text-muted-foreground mb-8">Let's build your personalized study schedule</p>
          
          <StepWizard currentStep={currentStep} steps={steps} />

          <div className="bg-card rounded-2xl shadow-md p-8 mt-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Physics, Mathematics"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="examDate">Exam Date *</Label>
                  <div className="relative mt-2">
                    <Input
                      id="examDate"
                      type="date"
                      value={formData.examDate}
                      onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                    />
                    <Calendar className="absolute right-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="dailyMinutes">Daily Study Time (minutes)</Label>
                  <Input
                    id="dailyMinutes"
                    type="number"
                    min="15"
                    max="180"
                    value={formData.dailyMinutes}
                    onChange={(e) => setFormData({ ...formData, dailyMinutes: parseInt(e.target.value) })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="sessionLength">Session Length (minutes)</Label>
                  <select
                    id="sessionLength"
                    value={formData.sessionLength}
                    onChange={(e) => setFormData({ ...formData, sessionLength: parseInt(e.target.value) })}
                    className="mt-2 w-full rounded-lg border-2 border-input bg-background px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label>Topics to Cover *</Label>
                  <p className="text-sm text-muted-foreground mb-3">Add topics one by one or upload a CSV file</p>
                  <ChipInput
                    values={formData.topics}
                    onChange={(topics) => setFormData({ ...formData, topics })}
                    placeholder="Type a topic and press Enter"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label>Upload Study Materials</Label>
                  <p className="text-sm text-muted-foreground mb-3">PDF, TXT, DOCX, MD, Images (max 50MB per file)</p>
                  <FileUploadZone
                    files={formData.files}
                    onChange={(files) => setFormData({ ...formData, files })}
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold mb-4">Review Your Plan</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Subject:</span>
                    <span className="font-semibold">{formData.subject}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Exam Date:</span>
                    <span className="font-semibold">{new Date(formData.examDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Daily Study Time:</span>
                    <span className="font-semibold">{formData.dailyMinutes} minutes</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Topics:</span>
                    <span className="font-semibold">{formData.topics.length} topics</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Files:</span>
                    <span className="font-semibold">{formData.files.length} files</span>
                  </div>
                </div>

                {formData.topics.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Topics:</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.topics.map((topic, i) => (
                        <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              <Button onClick={handleNext} className="gradient-primary text-white">
                {currentStep === 4 ? "Generate Plan" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {isProcessing && (
        <ProcessingModal
          progress={65}
          currentStep="Analyzing content and generating daily summaries"
          onCancel={() => setIsProcessing(false)}
        />
      )}
    </div>
  );
}
