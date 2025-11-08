import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle, Lock, Clock } from "lucide-react";
import { toast } from "sonner";

interface DayScheduleProps {
  planId: string;
  subject: string;
  topic: string;
}

interface DayTask {
  day: number;
  date: string;
  title: string;
  duration: number;
  completed: boolean;
  locked: boolean;
}

export const DaySchedule = ({ planId, subject, topic }: DayScheduleProps) => {
  const [schedule, setSchedule] = useState<DayTask[]>([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  useEffect(() => {
    // Generate 7-day schedule starting from today
    const today = new Date();
    const tasks: DayTask[] = [];
    
    for (let i = 0; i < 7; i++) {
      const taskDate = new Date(today);
      taskDate.setDate(today.getDate() + i);
      
      tasks.push({
        day: i + 1,
        date: taskDate.toISOString().split('T')[0],
        title: `Day ${i + 1}: ${i === 0 ? 'Introduction & Basics' : i === 1 ? 'Core Concepts' : i === 2 ? 'Advanced Topics' : i === 3 ? 'Practice Problems' : i === 4 ? 'Review & Revision' : i === 5 ? 'Mock Test' : 'Final Review'}`,
        duration: 45 + (i * 5),
        completed: false,
        locked: i > 0
      });
    }

    // Load saved progress
    const savedProgress = localStorage.getItem(`schedule_${planId}`);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      tasks.forEach((task, index) => {
        if (progress[task.date]) {
          task.completed = progress[task.date].completed;
          task.locked = progress[task.date].locked;
        }
      });
      
      // Find current day
      const currentIndex = tasks.findIndex(t => !t.completed);
      setCurrentDayIndex(currentIndex >= 0 ? currentIndex : tasks.length - 1);
    }

    setSchedule(tasks);
  }, [planId]);

  const handleCompleteDay = (dayIndex: number) => {
    const task = schedule[dayIndex];
    const today = new Date().toISOString().split('T')[0];
    
    // Check if trying to complete future task
    if (task.date > today) {
      toast.error("You can only complete today's tasks. Come back on " + new Date(task.date).toLocaleDateString());
      return;
    }

    // Check if task is locked
    if (task.locked) {
      toast.error("Complete previous days first!");
      return;
    }

    // Check if trying to complete past task
    if (task.date < today && !task.completed) {
      toast.error("This day has passed. Focus on today's task!");
      return;
    }

    // Mark as complete
    const updatedSchedule = [...schedule];
    updatedSchedule[dayIndex].completed = true;
    
    // Unlock next day
    if (dayIndex + 1 < updatedSchedule.length) {
      updatedSchedule[dayIndex + 1].locked = false;
    }
    
    setSchedule(updatedSchedule);

    // Save progress
    const progress: Record<string, any> = {};
    updatedSchedule.forEach(task => {
      progress[task.date] = {
        completed: task.completed,
        locked: task.locked
      };
    });
    localStorage.setItem(`schedule_${planId}`, JSON.stringify(progress));

    // Update study hours
    const stats = JSON.parse(localStorage.getItem('userStats') || JSON.stringify({
      totalStudyHours: 0,
      questionsAnswered: 0,
      averageScore: 0,
      activePlans: 0
    }));
    stats.totalStudyHours += task.duration / 60;
    localStorage.setItem('userStats', JSON.stringify(stats));

    toast.success(`Day ${task.day} completed! +${task.duration} minutes of study time`);
    setCurrentDayIndex(Math.min(dayIndex + 1, schedule.length - 1));
  };

  const completedDays = schedule.filter(t => t.completed).length;
  const progressPercentage = (completedDays / schedule.length) * 100;
  const today = new Date().toISOString().split('T')[0];

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold">7-Day Study Schedule</h3>
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {completedDays}/{schedule.length} Days
          </Badge>
        </div>
        <Progress value={progressPercentage} className="mb-2" />
        <p className="text-sm text-muted-foreground">
          {progressPercentage.toFixed(0)}% Complete
        </p>
      </div>

      <div className="space-y-3">
        {schedule.map((task, index) => {
          const isToday = task.date === today;
          const isPast = task.date < today;
          const isFuture = task.date > today;
          
          return (
            <Card
              key={task.day}
              className={`p-4 ${
                isToday ? 'border-primary border-2' : ''
              } ${task.completed ? 'bg-success/5' : ''} ${
                task.locked ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={isToday ? "default" : "outline"}>
                      Day {task.day}
                    </Badge>
                    {isToday && (
                      <Badge className="bg-primary/10 text-primary">Today</Badge>
                    )}
                    {task.completed && (
                      <CheckCircle className="w-4 h-4 text-success" />
                    )}
                    {task.locked && (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <h4 className="font-semibold mb-1">{task.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {task.duration} min
                    </span>
                    <span>{new Date(task.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                <Button
                  variant={isToday ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCompleteDay(index)}
                  disabled={task.completed || task.locked || isFuture || isPast}
                  className={isToday ? "gradient-primary" : ""}
                >
                  {task.completed ? "Completed" : task.locked ? "Locked" : isFuture ? "Not Yet" : isPast ? "Missed" : "Complete"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </Card>
  );
};
