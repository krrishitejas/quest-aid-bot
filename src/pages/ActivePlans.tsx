import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Plus, BookOpen, Clock, Target, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ActivePlans() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    const savedPlans = JSON.parse(localStorage.getItem('studyPlans') || '[]');
    setPlans(savedPlans);
  }, []);

  const user = {
    name: "Alex",
    xp: 1250,
    level: 5,
    streak: 7,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Active Study Plans</h1>
              <p className="text-muted-foreground">Manage all your study plans in one place</p>
            </div>
            <Button 
              onClick={() => navigate("/create-plan")}
              className="gradient-primary text-white"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Plan
            </Button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">{plans.length}</div>
              <div className="text-sm text-muted-foreground">Active Plans</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {plans.reduce((acc, plan) => acc + (plan.totalSessions || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Sessions</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {plans.length > 0 
                  ? Math.round(plans.reduce((acc, plan) => acc + (plan.progress || 0), 0) / plans.length)
                  : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Progress</div>
            </Card>
          </div>

          {/* Plans List */}
          {plans.length === 0 ? (
            <Card className="p-12 text-center">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">No Active Plans</h3>
              <p className="text-muted-foreground mb-6">
                Create your first study plan to get started
              </p>
              <Button 
                onClick={() => navigate("/create-plan")}
                className="gradient-primary text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Plan
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {plans.map((plan) => {
                const daysUntil = Math.ceil(
                  (new Date(plan.examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                
                return (
                  <Card key={plan.id} className="p-6 hover:shadow-elegant transition-smooth">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Plan Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold mb-1">{plan.subject}</h3>
                            <p className="text-muted-foreground">
                              Exam: {new Date(plan.examDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                            {daysUntil}d left
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Topics</div>
                            <div className="font-semibold">{plan.topics?.length || 0}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Sessions</div>
                            <div className="font-semibold">{plan.totalSessions || 0}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Daily Time</div>
                            <div className="font-semibold">{plan.dailyMinutes || 0}m</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Resources</div>
                            <div className="font-semibold">{plan.resources?.length || 0} files</div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Overall Progress</span>
                            <span className="font-semibold">{plan.progress || 0}%</span>
                          </div>
                          <Progress value={plan.progress || 0} className="h-2" />
                        </div>

                        {plan.nextSession && (
                          <div className="bg-muted/50 rounded-lg p-4">
                            <div className="text-sm text-muted-foreground mb-1">Next Session</div>
                            <div className="font-semibold">{plan.nextSession.topic}</div>
                            <div className="text-sm text-muted-foreground">
                              {plan.nextSession.date} at {plan.nextSession.time}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-3 lg:w-48">
                        <Button 
                          onClick={() => navigate(`/session?plan=${plan.id}&subject=${encodeURIComponent(plan.subject)}&topic=${encodeURIComponent(plan.nextSession?.topic || 'Introduction')}`)}
                          className="w-full gradient-primary text-white group"
                        >
                          Start Session
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => navigate(`/analytics?plan=${plan.id}`)}
                          className="w-full"
                        >
                          View Analytics
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => {/* Edit plan */}}
                          className="w-full"
                        >
                          Edit Plan
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
