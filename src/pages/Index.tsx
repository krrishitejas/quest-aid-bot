import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Dashboard } from "@/components/Dashboard";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const Index = () => {
  // Mock user state - toggle between landing and dashboard view
  const [user] = useState({
    name: "Alex",
    xp: 1250,
    level: 5,
    streak: 7,
  });

  // Show dashboard if user is logged in
  const showDashboard = true; // Set to false to see landing page

  return (
    <div className="min-h-screen bg-background">
      <Header user={showDashboard ? user : undefined} />
      
      {showDashboard ? (
        <Dashboard />
      ) : (
        <>
          <Hero />
          <Features />
          <HowItWorks />
          <CTA />
        </>
      )}
      
      <Footer />
    </div>
  );
};

export default Index;
