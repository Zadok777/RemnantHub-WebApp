import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Plus, MessageCircle, Calendar, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ReadingPlanProps {
  communityId: string;
  isLeader: boolean;
}

interface ReadingPlan {
  id: string;
  title: string;
  book_of_bible: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
}

interface ReadingPortion {
  id: string;
  week_number: number;
  title: string;
  scripture_reference: string;
  reading_text: string;
  reflection_questions: string[];
  start_date: string;
  end_date: string;
}

interface Discussion {
  id: string;
  comment_text: string;
  created_at: string;
  user_id: string;
  parent_comment_id: string | null;
  profiles?: {
    display_name: string | null;
  } | null;
}

const BIBLE_BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Songs', 'Isaiah', 'Jeremiah',
  'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel',
  'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
  'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans',
  '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
  'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
  'James', '1 Peter', '2 Peter', '1 John', '2 John',
  '3 John', 'Jude', 'Revelation'
];

const ReadingPlan: React.FC<ReadingPlanProps> = ({ communityId, isLeader }) => {
  const [readingPlans, setReadingPlans] = useState<ReadingPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ReadingPlan | null>(null);
  const [portions, setPortions] = useState<ReadingPortion[]>([]);
  const [selectedPortion, setSelectedPortion] = useState<ReadingPortion | null>(null);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [showAddPortion, setShowAddPortion] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const [newPlan, setNewPlan] = useState({
    title: '',
    book_of_bible: '',
    description: '',
    start_date: '',
    end_date: ''
  });

  const [newPortion, setNewPortion] = useState({
    week_number: 1,
    title: '',
    scripture_reference: '',
    reading_text: '',
    reflection_questions: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    loadReadingPlans();
  }, [communityId]);

  useEffect(() => {
    if (selectedPlan) {
      loadPortions(selectedPlan.id);
    }
  }, [selectedPlan]);

  useEffect(() => {
    if (selectedPortion) {
      loadDiscussions(selectedPortion.id);
    }
  }, [selectedPortion]);

  const loadReadingPlans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reading_plans')
        .select('*')
        .eq('community_id', communityId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReadingPlans(data || []);
      
      if (data && data.length > 0 && !selectedPlan) {
        setSelectedPlan(data[0]);
      }
    } catch (error) {
      console.error('Error loading reading plans:', error);
      toast({
        title: "Error",
        description: "Failed to load reading plans",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPortions = async (planId: string) => {
    try {
      const { data, error } = await supabase
        .from('reading_portions')
        .select('*')
        .eq('reading_plan_id', planId)
        .order('week_number', { ascending: true });

      if (error) throw error;
      setPortions(data || []);
    } catch (error) {
      console.error('Error loading portions:', error);
    }
  };

  const loadDiscussions = async (portionId: string) => {
    try {
      const { data, error } = await supabase
        .from('reading_discussions')
        .select('*')
        .eq('reading_portion_id', portionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Get profile info for discussions
      const discussionsWithProfiles = await Promise.all(
        (data || []).map(async (discussion) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', discussion.user_id)
            .single();
          
          return {
            ...discussion,
            profiles: profile
          };
        })
      );

      setDiscussions(discussionsWithProfiles);
    } catch (error) {
      console.error('Error loading discussions:', error);
    }
  };

  const handleCreatePlan = async () => {
    if (!user || !newPlan.title || !newPlan.book_of_bible) return;

    try {
      const { error } = await supabase
        .from('reading_plans')
        .insert({
          community_id: communityId,
          created_by: user.id,
          title: newPlan.title,
          book_of_bible: newPlan.book_of_bible,
          description: newPlan.description,
          start_date: newPlan.start_date,
          end_date: newPlan.end_date || null
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reading plan created successfully"
      });

      setNewPlan({
        title: '',
        book_of_bible: '',
        description: '',
        start_date: '',
        end_date: ''
      });
      setShowCreatePlan(false);
      loadReadingPlans();
    } catch (error) {
      console.error('Error creating reading plan:', error);
      toast({
        title: "Error",
        description: "Failed to create reading plan",
        variant: "destructive"
      });
    }
  };

  const handleAddPortion = async () => {
    if (!selectedPlan || !newPortion.title || !newPortion.scripture_reference) return;

    try {
      const reflectionQuestions = newPortion.reflection_questions
        .split('\n')
        .filter(q => q.trim())
        .map(q => q.trim());

      const { error } = await supabase
        .from('reading_portions')
        .insert({
          reading_plan_id: selectedPlan.id,
          week_number: newPortion.week_number,
          title: newPortion.title,
          scripture_reference: newPortion.scripture_reference,
          reading_text: newPortion.reading_text,
          reflection_questions: reflectionQuestions,
          start_date: newPortion.start_date,
          end_date: newPortion.end_date
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reading portion added successfully"
      });

      setNewPortion({
        week_number: portions.length + 1,
        title: '',
        scripture_reference: '',
        reading_text: '',
        reflection_questions: '',
        start_date: '',
        end_date: ''
      });
      setShowAddPortion(false);
      loadPortions(selectedPlan.id);
    } catch (error) {
      console.error('Error adding portion:', error);
      toast({
        title: "Error",
        description: "Failed to add reading portion",
        variant: "destructive"
      });
    }
  };

  const handleAddComment = async () => {
    if (!user || !selectedPortion || !newComment.trim()) return;

    try {
      const { error } = await supabase
        .from('reading_discussions')
        .insert({
          reading_portion_id: selectedPortion.id,
          user_id: user.id,
          comment_text: newComment.trim()
        });

      if (error) throw error;

      setNewComment('');
      loadDiscussions(selectedPortion.id);
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reading Plans</h2>
        {isLeader && (
          <Button onClick={() => setShowCreatePlan(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create Plan
          </Button>
        )}
      </div>

      {/* Reading Plans List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Community Reading Plans
          </CardTitle>
        </CardHeader>
        <CardContent>
          {readingPlans.length === 0 ? (
            <p className="text-muted-foreground">No reading plans created yet.</p>
          ) : (
            <div className="space-y-2">
              {readingPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPlan?.id === plan.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{plan.title}</h4>
                      <p className="text-sm text-muted-foreground">{plan.book_of_bible}</p>
                    </div>
                    <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                      {plan.status}
                    </Badge>
                  </div>
                  {plan.description && (
                    <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {showCreatePlan && isLeader && (
            <div className="mt-6 p-4 border rounded-lg bg-muted/30">
              <h4 className="font-medium mb-3">Create New Reading Plan</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="plan-title">Title</Label>
                  <Input
                    id="plan-title"
                    placeholder="Reading plan title"
                    value={newPlan.title}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="book-of-bible">Book of the Bible</Label>
                  <Select value={newPlan.book_of_bible} onValueChange={(value) => 
                    setNewPlan(prev => ({ ...prev, book_of_bible: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a book" />
                    </SelectTrigger>
                    <SelectContent>
                      {BIBLE_BOOKS.map((book) => (
                        <SelectItem key={book} value={book}>
                          {book}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="plan-description">Description</Label>
                  <Textarea
                    id="plan-description"
                    placeholder="Describe this reading plan..."
                    value={newPlan.description}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={newPlan.start_date}
                      onChange={(e) => setNewPlan(prev => ({ ...prev, start_date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date">End Date (optional)</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={newPlan.end_date}
                      onChange={(e) => setNewPlan(prev => ({ ...prev, end_date: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreatePlan}>Create Plan</Button>
                  <Button variant="outline" onClick={() => setShowCreatePlan(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reading Portions */}
      {selectedPlan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>Weekly Reading Portions</div>
              {isLeader && (
                <Button onClick={() => setShowAddPortion(true)} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Portion
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {portions.map((portion) => (
                <div
                  key={portion.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPortion?.id === portion.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedPortion(portion)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Week {portion.week_number}: {portion.title}</h4>
                    <Badge variant="outline">{portion.scripture_reference}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    {new Date(portion.start_date).toLocaleDateString()} - {new Date(portion.end_date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>

            {showAddPortion && isLeader && (
              <div className="mt-6 p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium mb-3">Add Reading Portion</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="week-number">Week Number</Label>
                      <Input
                        id="week-number"
                        type="number"
                        min="1"
                        value={newPortion.week_number}
                        onChange={(e) => setNewPortion(prev => ({ ...prev, week_number: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="portion-title">Title</Label>
                      <Input
                        id="portion-title"
                        placeholder="Portion title"
                        value={newPortion.title}
                        onChange={(e) => setNewPortion(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="scripture-reference">Scripture Reference</Label>
                    <Input
                      id="scripture-reference"
                      placeholder="e.g., John 3:1-21"
                      value={newPortion.scripture_reference}
                      onChange={(e) => setNewPortion(prev => ({ ...prev, scripture_reference: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reading-text">Reading Text (optional)</Label>
                    <Textarea
                      id="reading-text"
                      placeholder="Paste or type the scripture text..."
                      value={newPortion.reading_text}
                      onChange={(e) => setNewPortion(prev => ({ ...prev, reading_text: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reflection-questions">Reflection Questions (one per line)</Label>
                    <Textarea
                      id="reflection-questions"
                      placeholder="What stands out to you in this passage?&#10;How does this apply to your life?&#10;What questions do you have?"
                      value={newPortion.reflection_questions}
                      onChange={(e) => setNewPortion(prev => ({ ...prev, reflection_questions: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="portion-start">Start Date</Label>
                      <Input
                        id="portion-start"
                        type="date"
                        value={newPortion.start_date}
                        onChange={(e) => setNewPortion(prev => ({ ...prev, start_date: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="portion-end">End Date</Label>
                      <Input
                        id="portion-end"
                        type="date"
                        value={newPortion.end_date}
                        onChange={(e) => setNewPortion(prev => ({ ...prev, end_date: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddPortion}>Add Portion</Button>
                    <Button variant="outline" onClick={() => setShowAddPortion(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Discussion Thread */}
      {selectedPortion && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Discussion: {selectedPortion.title}
            </CardTitle>
            <CardDescription>
              {selectedPortion.scripture_reference}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedPortion.reflection_questions && selectedPortion.reflection_questions.length > 0 && (
              <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">Reflection Questions:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {selectedPortion.reflection_questions.map((question, index) => (
                    <li key={index}>{question}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-4 mb-6">
              {discussions.map((discussion) => (
                <div key={discussion.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">
                        {discussion.profiles?.display_name || 'Member'}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(discussion.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm">{discussion.comment_text}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <Textarea
                placeholder="Share your thoughts on this reading..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                Add Comment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReadingPlan;