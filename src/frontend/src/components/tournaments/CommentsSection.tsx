import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send } from 'lucide-react';
import { useGetTournamentComments, usePostComment } from '../../hooks/useQueries';
import { toast } from 'sonner';

interface CommentsSectionProps {
  tournamentId: string;
  isRegistered: boolean;
}

export default function CommentsSection({ tournamentId, isRegistered }: CommentsSectionProps) {
  const [comment, setComment] = useState('');
  const { data: comments, isLoading } = useGetTournamentComments(tournamentId);
  const postComment = usePostComment();

  const handleSubmit = () => {
    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    postComment.mutate(
      { tournamentId, comment },
      {
        onSuccess: () => {
          toast.success('Comment posted successfully');
          setComment('');
        },
        onError: () => {
          toast.error('Failed to post comment');
        },
      }
    );
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Card className="bg-gray-900/80 border-2 border-cyan-500/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-cyan-400" />
            Tournament Discussion
          </CardTitle>
          <Badge className="bg-cyan-500/20 text-cyan-400">
            {comments?.length || 0} comments
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Form */}
        {isRegistered ? (
          <div className="space-y-3">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts or ask questions..."
              className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
            />
            <Button
              onClick={handleSubmit}
              disabled={postComment.isPending}
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              <Send className="h-4 w-4 mr-2" />
              {postComment.isPending ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        ) : (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
            <p className="text-gray-400">Register for this tournament to join the discussion</p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-gray-400 text-center">Loading comments...</p>
          ) : !comments || comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            comments.map((c: any) => (
              <div
                key={c.id}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <p className="text-white font-semibold">{c.author}</p>
                  <p className="text-sm text-gray-500">{formatTimestamp(c.timestamp)}</p>
                </div>
                <p className="text-gray-300">{c.comment}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
