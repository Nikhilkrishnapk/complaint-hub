import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import StatusBadge from "@/components/complaints/StatusBadge";
import PriorityBadge from "@/components/complaints/PriorityBadge";
import { Database } from "@/integrations/supabase/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Complaint = Database["public"]["Tables"]["complaints"]["Row"];
type Comment = Database["public"]["Tables"]["comments"]["Row"] & {
  profiles: { full_name: string; role: string };
};

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchComplaintDetails();
    checkUserRole();
  }, [id]);

  const checkUserRole = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();
      setIsAdmin(profile?.role === "admin");
    }
  };

  const fetchComplaintDetails = async () => {
    const { data: complaintData } = await supabase
      .from("complaints")
      .select("*")
      .eq("id", id)
      .single();

    const { data: commentsData } = await supabase
      .from("comments")
      .select("*, profiles(full_name, role)")
      .eq("complaint_id", id)
      .order("created_at", { ascending: true });

    setComplaint(complaintData);
    setComments(commentsData || []);
    setLoading(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase.from("comments").insert({
      complaint_id: id!,
      user_id: session.user.id,
      content: newComment,
    });

    if (error) {
      toast.error("Failed to add comment");
    } else {
      setNewComment("");
      fetchComplaintDetails();
      toast.success("Comment added");
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    const { error } = await supabase
      .from("complaints")
      .update({ status: newStatus as any })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success("Status updated");
      fetchComplaintDetails();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Complaint not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-2xl">{complaint.title}</CardTitle>
              <div className="flex gap-2">
                <StatusBadge status={complaint.status} />
                <PriorityBadge priority={complaint.priority} />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="outline" className="capitalize">
                {complaint.category.replace("_", " ")}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground whitespace-pre-wrap">{complaint.description}</p>
            
            {isAdmin && (
              <div className="mt-6 pt-6 border-t">
                <label className="text-sm font-medium mb-2 block">Update Status</label>
                <Select
                  value={complaint.status}
                  onValueChange={handleStatusUpdate}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className={`p-4 rounded-lg ${
                  comment.profiles.role === "admin"
                    ? "bg-primary/5 border border-primary/20"
                    : "bg-muted"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{comment.profiles.full_name}</span>
                    {comment.profiles.role === "admin" && (
                      <Badge variant="outline" className="text-xs">Admin</Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-foreground">{comment.content}</p>
              </div>
            ))}

            <div className="flex gap-2 pt-4">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <Button onClick={handleAddComment} size="icon" className="shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ComplaintDetail;
