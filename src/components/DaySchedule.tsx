import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle, Lock, Clock, Bell } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<DayTask[]>([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [remindersEnabled, setRemindersEnabled] = useState(false);

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

    // Check if reminders are enabled
    const remindersPref = localStorage.getItem(`reminders_${planId}`);
    setRemindersEnabled(remindersPref === 'true');
  }, [planId]);

  const enableReminders = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        localStorage.setItem(`reminders_${planId}`, 'true');
        setRemindersEnabled(true);
        
        // Schedule reminders for upcoming days
        schedule.forEach((task) => {
          if (!task.completed && !task.locked) {
            const taskTime = new Date(task.date);
            taskTime.setHours(9, 0, 0, 0); // Set reminder for 9 AM
            
            const now = new Date();
            const timeUntilReminder = taskTime.getTime() - now.getTime();
            
            if (timeUntilReminder > 0) {
              setTimeout(() => {
                new Notification('Study Reminder', {
                  body: `Time to study: ${task.title}`,
                  icon: '/favicon.ico'
                });
              }, timeUntilReminder);
            }
          }
        });
        
        toast.success("Study reminders enabled! You'll be notified at 9 AM each day.");
      } else {
        toast.error("Please enable notifications in your browser settings.");
      }
    } else {
      toast.error("Notifications not supported in this browser.");
    }
  };

  const handleStartDay = (dayIndex: number) => {
    const task = schedule[dayIndex];
    const today = new Date().toISOString().split('T')[0];
    
    // Check if trying to start future task
    if (task.date > today) {
      toast.error("You can only start today's task. Come back on " + new Date(task.date).toLocaleDateString());
      return;
    }

    // Check if task is locked
    if (task.locked) {
      toast.error("Complete previous days first!");
      return;
    }

    // Check if trying to start past task
    if (task.date < today && !task.completed) {
      toast.error("This day has passed. Focus on today's task!");
      return;
    }

    if (task.completed) {
      toast.info("You've already completed this day!");
      return;
    }

    // Navigate to day-specific study page
    navigate(`/session/day?dayNumber=${task.day}&plan=${planId}&subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}&date=${task.date}`);
  };

  const completedDays = schedule.filter(t => t.completed).length;
  const progressPercentage = (completedDays / schedule.length) * 100;
  const today = new Date().toISOString().split('T')[0];

  return (
    <Card className="p-8 gradient-card">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h3 className="text-2xl font-bold">7-Day Study Schedule</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/10 text-secondary border-secondary/20">
              <Calendar className="w-3.5 h-3.5" />
              {completedDays}/{schedule.length} Days
            </Badge>
            {!remindersEnabled && (
              <Button
                variant="outline"
                size="sm"
                onClick={enableReminders}
                className="flex items-center gap-1.5 hover-lift"
              >
                <Bell className="w-3.5 h-3.5" />
                Enable Reminders
              </Button>
            )}
          </div>
        </div>
        <Progress value={progressPercentage} className="mb-3 h-3" />
        <p className="text-sm text-muted-foreground">
          {progressPercentage.toFixed(0)}% Complete - Keep up the great work!
        </p>
      </div>

      <div className="space-y-4">
        {schedule.map((task, index) => {
          const isToday = task.date === today;
          const isPast = task.date < today;
          const isFuture = task.date > today;
          
          return (
            <Card
              key={task.day}
              className={`p-6 transition-smooth hover-lift ${
                isToday ? 'border-primary border-2 shadow-glow bg-primary/5' : ''
              } ${task.completed ? 'bg-success/5 border-success/20' : ''} ${
                task.locked ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge 
                      variant={isToday ? "default" : "outline"}
                      className={isToday ? "bg-primary shadow-card" : ""}
                    >
                      Day {task.day}
                    </Badge>
                    {isToday && (
                      <Badge className="bg-accent/10 text-accent border-accent/20 animate-pulse">
                        Today
                      </Badge>
                    )}
                    {task.completed && (
                      <CheckCircle className="w-5 h-5 text-success" />
                    )}
                    {task.locked && (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <h4 className="font-semibold text-lg mb-2">{task.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {task.duration} min
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(task.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <Button
                  variant={isToday ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStartDay(index)}
                  disabled={task.completed || task.locked || isFuture || isPast}
                  className={isToday ? "gradient-primary shadow-glow" : ""}
                >
                  {task.completed ? "Completed" : task.locked ? "Locked" : isFuture ? "Not Yet" : isPast ? "Missed" : "Start"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </Card>
  );
};
