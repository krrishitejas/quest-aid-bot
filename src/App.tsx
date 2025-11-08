import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreatePlan from "./pages/CreatePlan";
import Quiz from "./pages/Quiz";
import Session from "./pages/Session";
import SessionDay from "./pages/SessionDay";
import Review from "./pages/Review";
import Auth from "./pages/Auth";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Achievements from "./pages/Achievements";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import StudyHours from "./pages/StudyHours";
import QuestionsAnswered from "./pages/QuestionsAnswered";
import AverageScore from "./pages/AverageScore";
import ActivePlans from "./pages/ActivePlans";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/create-plan" element={<CreatePlan />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/session" element={<Session />} />
          <Route path="/session/day" element={<SessionDay />} />
          <Route path="/review" element={<Review />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/study-hours" element={<StudyHours />} />
          <Route path="/questions-answered" element={<QuestionsAnswered />} />
          <Route path="/average-score" element={<AverageScore />} />
          <Route path="/active-plans" element={<ActivePlans />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
