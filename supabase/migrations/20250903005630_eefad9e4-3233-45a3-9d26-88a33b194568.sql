-- Create resources table
CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  summary TEXT NOT NULL,
  publication_date DATE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  resource_url TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing resources (public read access)
CREATE POLICY "Anyone can view resources" 
ON public.resources 
FOR SELECT 
USING (true);

-- Create policy for authenticated users to create resources
CREATE POLICY "Authenticated users can create resources" 
ON public.resources 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create policy for users to update their own resources
CREATE POLICY "Users can update their own resources" 
ON public.resources 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_resources_updated_at
BEFORE UPDATE ON public.resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample resources
INSERT INTO public.resources (title, author, category, summary, publication_date, tags, resource_url, icon) VALUES
('The Gospel of Matthew Commentary', 'John Chrysostom', 'Gospels & Acts', 'A comprehensive commentary on the Gospel of Matthew by one of the greatest preachers of the early church.', '2023-01-15', '{"commentary", "matthew", "early-church"}', 'https://example.com/matthew-commentary', 'Book'),
('Understanding Romans', 'Martin Luther', 'Pauline & General Epistles', 'An in-depth study of Paul''s letter to the Romans and its theological implications.', '2023-02-20', '{"romans", "pauline", "theology"}', 'https://example.com/romans-study', 'BookOpen'),
('Acts of the Apostles Study', 'Luke the Evangelist', 'Gospels & Acts', 'A detailed examination of the early church as recorded in the Book of Acts.', '2023-03-10', '{"acts", "early-church", "history"}', 'https://example.com/acts-study', 'Users'),
('Confessions', 'Augustine of Hippo', 'Early Church Fathers', 'The autobiographical work by Augustine describing his spiritual journey.', '2023-04-05', '{"augustine", "autobiography", "spirituality"}', 'https://example.com/confessions', 'Heart'),
('Systematic Theology Volume 1', 'Wayne Grudem', 'Theological Studies', 'A comprehensive introduction to biblical doctrine and systematic theology.', '2023-05-12', '{"systematic", "doctrine", "theology"}', 'https://example.com/systematic-theology', 'GraduationCap'),
('First Letter of John Commentary', 'John Calvin', 'Pauline & General Epistles', 'Calvin''s exposition on the First Letter of John focusing on love and fellowship.', '2023-06-18', '{"john", "calvin", "commentary"}', 'https://example.com/1john-commentary', 'BookOpen'),
('On the Trinity', 'Augustine of Hippo', 'Early Church Fathers', 'Augustine''s masterwork on the doctrine of the Trinity.', '2023-07-22', '{"trinity", "augustine", "doctrine"}', 'https://example.com/trinity-study', 'Star'),
('Church History Volume 1', 'Eusebius', 'Early Church Fathers', 'The foundational work of early church history by Eusebius of Caesarea.', '2023-08-14', '{"history", "eusebius", "early-church"}', 'https://example.com/church-history', 'Clock');