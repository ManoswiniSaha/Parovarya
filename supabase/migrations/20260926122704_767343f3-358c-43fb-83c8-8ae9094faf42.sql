
DO $$
DECLARE k uuid; c uuid; p uuid;
BEGIN
SELECT id INTO k FROM public.heritage_projects WHERE slug='kumartuli-living-clay-art';
SELECT id INTO c FROM public.heritage_projects WHERE slug='north-kolkata-courtyard-houses';
SELECT id INTO p FROM public.heritage_projects WHERE slug='pithe-traditions-of-bengal';

INSERT INTO public.project_sources (heritage_project_id,title,source_type,description) VALUES
(k,'Maitra, L. "Durga idols of Kumartuli: Surviving Oral Traditions through Changes"','Research article','Symbiosis Institute of Media and Communication, Pune. Covers Durga worship in Bengal, the Devipaksha calendar and the oral traditions of Kumartuli idol-makers.'),
(c,'Das, N. (2006). "Courtyard Houses of Kolkata: Bioclimatic, Typological and Socio-Cultural Study"','Master''s thesis','M.Arch thesis, Kansas State University (advisor Gary Coates). Fieldwork in ten Kolkata courtyard houses, January 2005.'),
(p,'Hossen, R., Tabassum, M. F., Ponum, N. S. & Pasa, M. K. "Traditional Pitha as Living Design: Learning from the Past to Shape the Future"','Conference paper','International Art and Design Symposium. Ethnography of 40 pitha makers and vendors in Rajshahi, Bangladesh.');

INSERT INTO public.project_timeline (heritage_project_id,event_title,event_description,event_date) VALUES
(k,'East India Company thanksgiving Puja','After obtaining the Diwani of Bengal, the Company offered a thanksgiving Durga Puja to appease its Hindu subjects.','1765'),
(k,'British official participation ends','A law banned government officials from taking part in Durga Puja celebrations.','1840'),
(k,'Durga Puja at the British Museum','The festival, and Kumartuli-style idols, were celebrated in the Great Court of the British Museum.','2006'),
(c,'Field interviews in ten courtyard houses','Heads of household of ten Kolkata courtyard houses were interviewed; three were chosen for detailed temperature and airflow study.','January 2005'),
(c,'Courtyard study completed','Nibedita Das submits her thesis on the climate and social benefits of Kolkata''s courtyard houses.','2006'),
(p,'Winter pitha season','Pitha-making peaks in winter and on holidays, when most vendors earn their yearly income.','Every winter'),
(p,'Rajshahi fieldwork','Researchers document 40 pitha makers and street vendors around RU, RUET, Talaimari, Bhadra and C&B markets.','Recent');

INSERT INTO public.contributions (heritage_project_id,contribution_type,title,description,contributor_name,source,consent_confirmed,status) VALUES
(k,'research','Idols for the six days of Devipaksha','Kumartuli artisans give the final touches to Durga and her children — Kartikeya, Ganesa, Laxmi and Saraswati — along with Siva, for the days of Sasti, Maha Saptami, Maha Astami, Maha Nabami and Vijaya Dasami. The season ends with Laxmi worship on Kojagori Purnima.','Paro Varya archive team','Maitra, Durga idols of Kumartuli',true,'approved'),
(k,'story','"Jagatseth''s money, Umichand''s beard…"','An old Calcutta rhyme names Banamali Sarkar''s house, whose street runs out of Kumartuli onto Chitpur Road, and Govinda Mitra, the "Black Zamindar" whose lavish pujas shaped elite Bengali festival life.','Paro Varya archive team','Maitra, Durga idols of Kumartuli',true,'approved'),
(k,'research','Nature in the worship: Nabapatrika and ghat','Durga is also worshipped through nine plants (Nabapatrika), each a form of the goddess, and through the clay pot (ghat) as a symbol of fertility. Idols are decorated with shola, a marsh plant (Aeschynomene aspera).','Paro Varya archive team','Maitra, Durga idols of Kumartuli',true,'approved'),
(c,'research','Shallow versus deep courtyards','The study compared three houses with similar heavy construction. Houses A and C have shallow courtyards (aspect ratio 0.95); House B has a deep one (0.21). Temperature, airflow and computer airflow simulations showed how courtyard proportion changes shade, breeze and comfort.','Paro Varya archive team','Das 2006, Kansas State University',true,'approved'),
(c,'research','How the courtyard shapes daily life','Occupant surveys showed that shade and natural ventilation decide where and when families cook, rest and gather. The study argues the courtyard form still suits modern building in Kolkata''s hot, humid climate.','Paro Varya archive team','Das 2006, Kansas State University',true,'approved'),
(p,'story','"I learnt it from my mother"','A pitha maker in Talaimari: "I learnt it from my mother. It never occurred to me at that time that I would do this for a business." Skills pass mostly from mothers and grandmothers to daughters; only 5% of makers had formal training.','Paro Varya archive team','Hossen et al., Traditional Pitha as Living Design',true,'approved'),
(p,'research','Threats and new flavours','Fast food, city life and falling youth interest threaten the craft. Some vendors adapt — one at RUET Gate now makes chocolate and mango pitha for young customers.','Paro Varya archive team','Hossen et al., Traditional Pitha as Living Design',true,'approved'),
(p,'research','Ideas to keep pitha alive','The authors suggest lighter tools to reduce strain, clean packaging, short video lessons and open community archives to record hands-on knowledge — led by the women vendors themselves.','Paro Varya archive team','Hossen et al., Traditional Pitha as Living Design',true,'approved');
END $$;
