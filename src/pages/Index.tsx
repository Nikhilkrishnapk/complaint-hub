import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, MessageSquare, Shield, Clock } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">Student Complaint System</h1>
          </div>
          <Button onClick={() => navigate("/auth")}>Get Started</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Voice Your Concerns
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A transparent and efficient platform for students to submit complaints and
            track their resolution status
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Submission</h3>
            <p className="text-muted-foreground">
              Submit complaints quickly with our intuitive form. Categorize and prioritize
              your concerns easily.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
            <p className="text-muted-foreground">
              Monitor the status of your complaints in real-time. Stay informed about
              every update.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-warning" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Direct Communication</h3>
            <p className="text-muted-foreground">
              Communicate directly with administrators through comments and get timely
              responses.
            </p>
          </Card>
        </div>

        <div className="text-center">
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8">
            Start Submitting Complaints
          </Button>
        </div>
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 Student Complaint Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
