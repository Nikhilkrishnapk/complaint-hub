import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database } from "@/integrations/supabase/types";
import { formatDistanceToNow } from "date-fns";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";

type Complaint = Database["public"]["Tables"]["complaints"]["Row"];

interface ComplaintCardProps {
  complaint: Complaint;
  onClick: () => void;
  showStudent?: boolean;
}

const ComplaintCard = ({ complaint, onClick, showStudent = false }: ComplaintCardProps) => {
  return (
    <Card
      className="p-6 cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{complaint.title}</h3>
          <p className="text-muted-foreground line-clamp-2 mb-3">
            {complaint.description}
          </p>
        </div>
        <div className="flex gap-2 ml-4">
          <StatusBadge status={complaint.status} />
          <PriorityBadge priority={complaint.priority} />
        </div>
      </div>
      
      <div className="flex items-center gap-3 text-sm">
        <Badge variant="outline" className="capitalize">
          {complaint.category.replace("_", " ")}
        </Badge>
        <span className="text-muted-foreground">
          {formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}
        </span>
      </div>
    </Card>
  );
};

export default ComplaintCard;
