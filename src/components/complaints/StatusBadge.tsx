import { Badge } from "@/components/ui/badge";
import { Database } from "@/integrations/supabase/types";

type Status = Database["public"]["Enums"]["complaint_status"];

interface StatusBadgeProps {
  status: Status;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "new":
        return "bg-status-new text-white";
      case "in_progress":
        return "bg-status-progress text-white";
      case "resolved":
        return "bg-status-resolved text-white";
      case "closed":
        return "bg-status-closed text-white";
      default:
        return "bg-muted";
    }
  };

  const getStatusLabel = () => {
    return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Badge className={getStatusColor()}>
      {getStatusLabel()}
    </Badge>
  );
};

export default StatusBadge;
