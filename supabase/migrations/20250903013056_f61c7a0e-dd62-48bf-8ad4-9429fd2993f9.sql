-- Update remaining resources with placeholder URLs to use the proper URLs provided
UPDATE resources 
SET resource_url = 'https://www.newadvent.org/fathers/2501.htm',
    summary = 'This history by the fourth‑century bishop Eusebius is the earliest surviving chronicle of the church from the apostles through Constantine. The translation by Arthur C. McGiffert provides context on the rise of Christianity, the persecutions, and the lives of early martyrs from Nicene and Post‑Nicene Fathers.',
    title = 'Church History (Book I)'
WHERE title = 'Church History Volume 1';

UPDATE resources 
SET resource_url = 'https://www.newadvent.org/fathers/1301.htm',
    summary = 'Augustine spent years writing this fifteen‑book treatise on the triune nature of God. The treatise defends orthodox Trinitarian doctrine against rationalistic speculation and shows how Scripture uses human language to lift believers toward the mystery of God.',
    title = 'On the Trinity (Book I)'
WHERE title = 'On the Trinity' AND author = 'Augustine of Hippo';

-- Update other placeholder URLs with appropriate authentic sources
UPDATE resources 
SET resource_url = 'https://www.earlychristianwritings.com/text/1john.html'
WHERE title = 'First Letter of John Commentary';

UPDATE resources 
SET resource_url = 'https://www.biblehub.com/commentaries/matthew/1-1.htm'
WHERE title = 'The Gospel of Matthew Commentary';

UPDATE resources 
SET resource_url = 'https://www.biblehub.com/commentaries/romans/1-1.htm'
WHERE title = 'Understanding Romans';

UPDATE resources 
SET resource_url = 'https://www.newadvent.org/fathers/1102.htm'
WHERE title = 'Confessions';

UPDATE resources 
SET resource_url = 'https://www.biblehub.com/commentaries/acts/1-1.htm'
WHERE title = 'Acts of the Apostles Study';

UPDATE resources 
SET resource_url = 'https://www.biblehub.com/commentaries/systematic_theology/'
WHERE title = 'Systematic Theology Volume 1';