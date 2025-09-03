-- Update existing resources with proper URLs
UPDATE resources 
SET resource_url = 'https://www.earlychristianwritings.com/text/didache-roberts.html',
    summary = 'Dating from the late first or early second century, the Didache is a manual of Christian instruction attributed to the apostles. It opens by contrasting "two ways, one of life and one of death" and summarizes Jesus'' ethical teachings. The text also describes baptism, fasting, Eucharist and the conduct of itinerant prophets—offering a window into house‑church practice.'
WHERE title = 'The Didache (Teaching of the Twelve Apostles)';

UPDATE resources 
SET resource_url = 'https://www.earlychristianwritings.com/text/1clement-lightfoot.html',
    summary = 'Written by Clement of Rome around AD 95, this letter addresses divisions in the Corinthian assembly. Clement extols the Corinthians'' former faith and hospitality and urges them to restore unity, humility and obedience, citing Old Testament examples to warn against jealousy.'
WHERE title = 'First Epistle of Clement to the Corinthians';

UPDATE resources 
SET resource_url = 'https://www.earlychristianwritings.com/text/polycarp-lightfoot.html',
    summary = 'Polycarp, a disciple of the apostle John, writes to the church at Philippi (c. AD 120). He greets them with peace from God and Christ and commends their faithfulness. He exhorts believers to endurance, warns against heresy and encourages obedience to elders, offering pastoral counsel rooted in apostolic teaching.',
    title = 'Epistle of Polycarp to the Philippians'
WHERE title = 'Polycarp''s Letter to the Philippians';

-- Add new resources with proper URLs
INSERT INTO resources (
  title, 
  author, 
  category, 
  summary, 
  publication_date, 
  tags, 
  resource_url, 
  icon
) VALUES 
(
  'Church History (Book I)',
  'Eusebius of Caesarea',
  'Early Church Fathers',
  'This history by the fourth‑century bishop Eusebius is the earliest surviving chronicle of the church from the apostles through Constantine. The translation by Arthur C. McGiffert provides context on the rise of Christianity, the persecutions, and the lives of early martyrs from Nicene and Post‑Nicene Fathers.',
  '325-01-01',
  ARRAY['church history', 'martyrdom', 'apostolic succession'],
  'https://www.newadvent.org/fathers/2501.htm',
  'BookOpen'
),
(
  'On the Trinity (Book I)',
  'Augustine of Hippo',
  'Early Church Fathers',
  'Augustine spent years writing this fifteen‑book treatise on the triune nature of God. The treatise defends orthodox Trinitarian doctrine against rationalistic speculation and shows how Scripture uses human language to lift believers toward the mystery of God.',
  '400-01-01',
  ARRAY['trinity', 'doctrine', 'theology'],
  'https://www.newadvent.org/fathers/1301.htm',
  'Crown'
),
(
  'Epistle of Ignatius to the Ephesians',
  'Ignatius of Antioch',
  'Early Church Fathers',
  'En route to martyrdom in Rome (c. AD 110), Ignatius of Antioch writes to the church in Ephesus. He praises them for their righteousness and faith, encourages unity and obedience to their bishop, and warns against schism and false teachers.',
  '110-01-01',
  ARRAY['unity', 'martyrdom', 'church order'],
  'https://www.earlychristianwritings.com/text/ignatius-ephesians-roberts.html',
  'Heart'
);