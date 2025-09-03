-- Update resources to align with recommended non-denominational sources
-- Clear existing resources and add new ones aligned with the specified sites

-- First, delete existing resources to start fresh
DELETE FROM resources;

-- Insert resources from Christian Classics Ethereal Library (CCEL)
INSERT INTO resources (title, author, category, summary, resource_url, tags, publication_date, icon) VALUES
('Confessions', 'Augustine of Hippo', 'Spiritual Formation', 'Augustine''s autobiographical work examining his journey to faith. Available through CCEL''s mission to build up the church through classic texts that promote ecumenicity and general edification.', 'https://www.ccel.org/ccel/augustine/confessions.html', ARRAY['spiritual growth', 'autobiography', 'conversion'], '400-01-01', 'BookOpen'),
('The City of God', 'Augustine of Hippo', 'Apologetics', 'Augustine''s defense of Christianity against pagan accusations. CCEL provides this foundational text to strengthen believers'' understanding of God''s sovereignty over history.', 'https://www.ccel.org/ccel/augustine/city.html', ARRAY['apologetics', 'philosophy', 'history'], '426-01-01', 'Shield'),
('The Imitation of Christ', 'Thomas à Kempis', 'Spiritual Formation', 'A classic devotional work on following Christ. CCEL offers this text to promote spiritual growth across denominational lines.', 'https://www.ccel.org/ccel/kempis/imitation.html', ARRAY['devotional', 'discipleship', 'spiritual growth'], '1418-01-01', 'Heart'),

-- Insert resources from Early Christian Writings
('First Epistle of Clement', 'Clement of Rome', 'Church History', 'One of the earliest post-apostolic letters, providing insight into first-century church leadership. Early Christian Writings offers scholarly commentary without denominational bias.', 'http://www.earlychristianwritings.com/1clement.html', ARRAY['early church', 'apostolic fathers', 'church government'], '96-01-01', 'Scroll'),
('The Didache', 'Unknown', 'Church History', 'Early Christian manual of church order and morals. This first-three-century document shows primitive Christian practices through unbiased scholarly presentation.', 'http://www.earlychristianwritings.com/didache.html', ARRAY['early church', 'church order', 'morals'], '100-01-01', 'BookOpen'),
('Letters of Ignatius', 'Ignatius of Antioch', 'Church History', 'Seven authentic letters revealing early Christian theology and church structure. Early Christian Writings provides original texts with scholarly commentary.', 'http://www.earlychristianwritings.com/ignatius.html', ARRAY['early church', 'martyrdom', 'ecclesiology'], '110-01-01', 'Mail'),

-- Insert resources from Daniel Training Network
('Overcoming in the Last Days', 'Daniel Training Network', 'Eschatology', 'Biblical training for persevering faith until Christ''s return. Daniel Training Network emphasizes faithfulness to Jesus through eschatological discipleship.', 'https://www.dtnonline.org/overcoming-last-days/', ARRAY['end times', 'perseverance', 'discipleship'], '2020-01-01', 'Mountain'),
('The Faithful Witness', 'Daniel Training Network', 'Discipleship', 'Training for maintaining biblical witness in challenging times. Focuses on faithfulness to Jesus until His return through practical discipleship.', 'https://www.dtnonline.org/faithful-witness/', ARRAY['witness', 'persecution', 'faithfulness'], '2019-01-01', 'Users'),

-- Insert resources from BibleProject
('How to Read the Bible', 'BibleProject', 'Bible Study', 'Multimedia presentations making Scripture approachable while tracing its unified narrative to Christ. BibleProject focuses on biblical literacy and thematic understanding.', 'https://bibleproject.com/explore/how-to-read-the-bible/', ARRAY['bible study', 'hermeneutics', 'biblical themes'], '2020-01-01', 'Play'),
('The Story of the Bible', 'BibleProject', 'Biblical Theology', 'Comprehensive overview of Scripture''s unified story pointing to Jesus. Accessible multimedia format helps trace biblical narrative themes.', 'https://bibleproject.com/explore/the-story-of-the-bible/', ARRAY['biblical theology', 'narrative', 'christ'], '2019-01-01', 'Book'),
('Wisdom Series', 'BibleProject', 'Wisdom Literature', 'Exploration of biblical wisdom books through visual storytelling. Makes complex biblical themes accessible while maintaining scriptural fidelity.', 'https://bibleproject.com/explore/wisdom-series/', ARRAY['wisdom', 'proverbs', 'biblical themes'], '2021-01-01', 'Lightbulb'),

-- Insert resources from BiblicalTraining.org
('New Testament Survey', 'Craig Blomberg', 'Biblical Studies', 'Comprehensive introduction to New Testament books by world-class professors. BiblicalTraining.org provides structured courses from a broad evangelical team.', 'https://www.biblicaltraining.org/new-testament-survey/craig-blomberg', ARRAY['new testament', 'survey', 'biblical studies'], '2015-01-01', 'GraduationCap'),
('Old Testament Survey', 'Douglas Stuart', 'Biblical Studies', 'Systematic study of Old Testament books and themes. Offers comprehensive biblical education through structured academic courses.', 'https://www.biblicaltraining.org/old-testament-survey/douglas-stuart', ARRAY['old testament', 'survey', 'biblical studies'], '2014-01-01', 'BookOpen'),
('Systematic Theology', 'Wayne Grudem', 'Theology', 'Comprehensive theological training covering major doctrines. BiblicalTraining.org ensures broad evangelical perspective in theological education.', 'https://www.biblicaltraining.org/systematic-theology/wayne-grudem', ARRAY['systematic theology', 'doctrine', 'theology'], '2016-01-01', 'Building'),

-- Insert additional resources emphasizing testing against Scripture
('Bible Study Methods', 'BiblicalTraining.org', 'Bible Study', 'Learn to study Scripture like the Bereans in Acts 17:11 who examined the Scriptures daily. Emphasizes testing all teachings against the inspired Word of God.', 'https://www.biblicaltraining.org/bible-study-methods/', ARRAY['bible study', 'hermeneutics', 'berean'], '2018-01-01', 'Search'),
('Biblical Interpretation', 'Gordon Fee', 'Hermeneutics', 'Principles for understanding Scripture correctly. Essential for testing denominational materials against biblical teaching as Bereans did.', 'https://www.biblicaltraining.org/biblical-interpretation/gordon-fee', ARRAY['hermeneutics', 'interpretation', 'scripture'], '2017-01-01', 'Eye');