-- Fix the incorrect URLs for Daniel Training Network and CCEL resources

-- Update Daniel Training Network URLs (dtnonline.org doesn't exist, should be danieltrainingnetwork.org)
UPDATE resources 
SET resource_url = 'https://danieltrainingnetwork.org/getstarted'
WHERE title = 'Overcoming in the Last Days';

UPDATE resources 
SET resource_url = 'https://danieltrainingnetwork.org/topics'
WHERE title = 'The Faithful Witness';

-- Fix CCEL URLs (remove www. prefix as it's not needed)
UPDATE resources 
SET resource_url = 'https://ccel.org/ccel/augustine/confess'
WHERE title = 'Confessions';

UPDATE resources 
SET resource_url = 'https://ccel.org/ccel/augustine/city'
WHERE title = 'The City of God';

UPDATE resources 
SET resource_url = 'https://ccel.org/ccel/kempis/imitation'
WHERE title = 'The Imitation of Christ';

-- Fix Early Christian Writings URLs (use correct paths)
UPDATE resources 
SET resource_url = 'https://www.earlychristianwritings.com/text/1clement-roberts.html'
WHERE title = 'First Epistle of Clement';

UPDATE resources 
SET resource_url = 'https://www.earlychristianwritings.com/text/didache-roberts.html'
WHERE title = 'The Didache';

UPDATE resources 
SET resource_url = 'https://www.earlychristianwritings.com/text/ignatius-roberts.html'
WHERE title = 'Letters of Ignatius';