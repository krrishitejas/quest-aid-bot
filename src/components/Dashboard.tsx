import { StatCard } from "./StatCard";
import { PlanCard } from "./PlanCard";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, CheckCircle, Plus, TrendingUp } from "lucide-react";

export const Dashboard = () => {
  // Mock data
  const stats = [
    { icon: Clock, label: "Study Hours", value: "24.5", trend: { value: "12%", positive: true } },
    { icon: CheckCircle, label: "Questions Answered", value: "342", trend: { value: "8%", positive: true } },
    { icon: TrendingUp, label: "Average Score", value: "87%", trend: { value: "5%", positive: true } },
    { icon: BookOpen, label: "Active Plans", value: "3" },
  ];

  const plans = [
    {
      subject: "Physics",
      examDate: "2025-12-15",
      progress: 45,
      nextSession: {
        topic: "Newton's Laws of Motion",
        date: "Tomorrow, 2:00 PM",
      },
      totalSessions: 30,
      completedSessions: 13,
    },
    {
      subject: "Mathematics",
      examDate: "2025-12-20",
      progress: 62,
      nextSession: {
        topic: "Calculus - Derivatives",
        date: "Today, 6:00 PM",
      },
      totalSessions: 25,
      completedSessions: 15,
    },
    {
      subject: "Chemistry",
      examDate: "2025-12-10",
      progress: 78,
      nextSession: {
        topic: "Organic Chemistry Reactions",
        date: "Today, 4:00 PM",
      },
      totalSessions: 20,
      completedSessions: 16,
    },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back! 👋</h1>
            <p className="text-muted-foreground text-lg">Let's continue your learning journey</p>
          </div>
          <Button size="lg" className="gradient-primary text-white rounded-full shadow-elegant hover:shadow-glow transition-smooth">
            <Plus className="mr-2 w-5 h-5" />
            Create New Plan
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <StatCard {...stat} />
            </div>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Your Study Plans</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <PlanCard {...plan} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
