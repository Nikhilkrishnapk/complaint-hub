import { Badge } from "@/components/ui/badge";
import { Database } from "@/integrations/supabase/types";
import { AlertCircle, ArrowUp, Minus } from "lucide-react";

type Priority = Database["public"]["Enums"]["complaint_priority"];

interface PriorityBadgeProps {
  priority: Priority;
}

const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const getIcon = () => {
    switch (priority) {
      case "high":
        return <AlertCircle className="w-3 h-3" />;
      case "medium":
        return <ArrowUp className="w-3 h-3" />;
      case "low":
        return <Minus className="w-3 h-3" />;
    }
  };

  const getColor = () => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Badge variant="outline" className={getColor()}>
      {getIcon()}
      <span className="ml-1 capitalize">{priority}</span>
    </Badge>
  );
};

export default PriorityBadge;
