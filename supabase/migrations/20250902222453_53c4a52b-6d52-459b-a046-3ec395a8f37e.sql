-- Create reporting workflow table
CREATE TABLE public.reporting_workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL,
  reported_user_id UUID,
  reported_community_id UUID,
  issue_description TEXT NOT NULL,
  current_step TEXT NOT NULL DEFAULT 'private_address',
  private_address_attempted BOOLEAN DEFAULT false,
  private_address_date TIMESTAMP WITH TIME ZONE,
  private_address_notes TEXT,
  witness_brought BOOLEAN DEFAULT false,
  witness_date TIMESTAMP WITH TIME ZONE,
  witness_notes TEXT,
  witness_ids UUID[],
  formal_report_submitted BOOLEAN DEFAULT false,
  formal_report_date TIMESTAMP WITH TIME ZONE,
  resolution_status TEXT DEFAULT 'in_progress',
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reporting_workflows ENABLE ROW LEVEL SECURITY;

-- Create policies for reporting workflows
CREATE POLICY "Users can view their own reports" 
ON public.reporting_workflows 
FOR SELECT 
USING (auth.uid() = reporter_id OR auth.uid() = reported_user_id OR auth.uid() = ANY(witness_ids));

CREATE POLICY "Users can create their own reports" 
ON public.reporting_workflows 
FOR INSERT 
WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can update their own reports" 
ON public.reporting_workflows 
FOR UPDATE 
USING (auth.uid() = reporter_id OR auth.uid() = reported_user_id OR auth.uid() = ANY(witness_ids));

-- Create resource library table
CREATE TABLE public.resource_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  resource_type TEXT NOT NULL DEFAULT 'article',
  external_url TEXT,
  content TEXT,
  recommended_communities UUID[],
  tags TEXT[],
  created_by UUID NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.resource_library ENABLE ROW LEVEL SECURITY;

-- Create policies for resource library
CREATE POLICY "Anyone can view approved resources" 
ON public.resource_library 
FOR SELECT 
USING (is_approved = true);

CREATE POLICY "Users can view their own resources" 
ON public.resource_library 
FOR SELECT 
USING (auth.uid() = created_by);

CREATE POLICY "Authenticated users can create resources" 
ON public.resource_library 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own resources" 
ON public.resource_library 
FOR UPDATE 
USING (auth.uid() = created_by);

-- Create doctrinal statements table
CREATE TABLE public.doctrinal_statements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  full_text TEXT NOT NULL,
  summary TEXT,
  category TEXT NOT NULL DEFAULT 'creed',
  is_predefined BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.doctrinal_statements ENABLE ROW LEVEL SECURITY;

-- Create policies for doctrinal statements
CREATE POLICY "Anyone can view doctrinal statements" 
ON public.doctrinal_statements 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create custom statements" 
ON public.doctrinal_statements 
FOR INSERT 
WITH CHECK (auth.uid() = created_by AND is_predefined = false);

CREATE POLICY "Users can update their own statements" 
ON public.doctrinal_statements 
FOR UPDATE 
USING (auth.uid() = created_by);

-- Add doctrinal alignment to communities table
ALTER TABLE public.communities 
ADD COLUMN doctrinal_statement_id UUID REFERENCES public.doctrinal_statements(id),
ADD COLUMN custom_beliefs_summary TEXT;

-- Insert predefined doctrinal statements
INSERT INTO public.doctrinal_statements (name, full_text, summary, category) VALUES
(
  'Apostles'' Creed',
  'I believe in God, the Father almighty, creator of heaven and earth. I believe in Jesus Christ, God''s only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died, and was buried; he descended to the dead. On the third day he rose again; he ascended into heaven, he is seated at the right hand of the Father, and he will come to judge the living and the dead. I believe in the Holy Spirit, the holy catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and the life everlasting.',
  'Historic Christian statement of faith covering the Trinity, incarnation, and core gospel truths.',
  'creed'
),
(
  'Nicene Creed',
  'We believe in one God, the Father, the Almighty, maker of heaven and earth, of all that is, seen and unseen. We believe in one Lord, Jesus Christ, the only Son of God, eternally begotten of the Father, God from God, Light from Light, true God from true God, begotten, not made, of one Being with the Father; through him all things were made. For us and for our salvation he came down from heaven, was incarnate of the Holy Spirit and the Virgin Mary and became truly human. For our sake he was crucified under Pontius Pilate; he suffered death and was buried. On the third day he rose again in accordance with the Scriptures; he ascended into heaven and is seated at the right hand of the Father. He will come again in glory to judge the living and the dead, and his kingdom will have no end. We believe in the Holy Spirit, the Lord, the giver of life, who proceeds from the Father and the Son, who with the Father and the Son is worshiped and glorified, who has spoken through the prophets. We believe in one holy catholic and apostolic Church. We acknowledge one baptism for the forgiveness of sins. We look for the resurrection of the dead, and the life of the world to come.',
  'Fourth-century creed affirming the Trinity and divinity of Christ against Arianism.',
  'creed'
),
(
  'Westminster Confession of Faith',
  'The Westminster Confession of Faith is a Reformed confession of faith. It was written in the 1640s by English and Scottish theologians and clergy. The Confession is a systematic exposition of Calvinist theology.',
  'Reformed systematic theology covering Scripture, God, predestination, and Christian life.',
  'confession'
),
(
  'Simple Gospel Statement',
  'We believe that Jesus Christ is the Son of God who died for our sins and rose from the dead. Salvation is by grace through faith in Jesus Christ alone. The Bible is our authority for faith and practice. We seek to live as disciples following Jesus'' teachings and making other disciples.',
  'Basic evangelical statement emphasizing gospel essentials and biblical authority.',
  'simple'
);

-- Create updated_at triggers
CREATE TRIGGER update_reporting_workflows_updated_at
BEFORE UPDATE ON public.reporting_workflows
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resource_library_updated_at
BEFORE UPDATE ON public.resource_library
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctrinal_statements_updated_at
BEFORE UPDATE ON public.doctrinal_statements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();