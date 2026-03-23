// ============================================================
// species-info.js — Species context, ecology, seasonal info
// ============================================================

const S = {
  'Krim-Linde': {
    family: 'Lindengewächse (Tiliaceae)', origin: 'Südosteuropa, Kaukasus',
    de: 'Basels häufigster Baum. Besonders stadttauglich: hitzeresistent, salzverträglich, dichter Schatten. Ihre Blüten duften intensiv und sind eine wichtige Bienenweide.',
    en: 'Basel\'s most common tree. Exceptionally urban-hardy: heat-resistant, salt-tolerant, dense shade. Fragrant blossoms are a vital nectar source for bees.',
    seasons: { de: '🌸 Blüte Juni–Juli (intensiver Duft) · 🍂 Gelb Oktober · ❄️ Winterkahl', en: '🌸 Flowers June–July (intense fragrance) · 🍂 Yellow October · ❄️ Deciduous' },
    ecology: { de: 'Bienenweide Nr. 1 — eine Linde trägt bis zu 60\'000 Blüten. Nektar für Honigbienen, Hummeln, Schwebfliegen. Lindenblütentee ist ein traditionelles Erkältungsmittel.', en: 'Top bee tree — a single linden bears up to 60,000 blossoms. Nectar for honeybees, bumblebees, hoverflies. Linden blossom tea is a traditional cold remedy.' },
  },
  'Gewöhnliche Platane': {
    family: 'Platanengewächse (Platanaceae)', origin: 'Südosteuropa, Westasien',
    de: 'Klassischer Alleebaum Europas. Die Borke blättert in Puzzlestücken ab — charakteristisches Tarnmuster. Kann über 300 Jahre alt werden.',
    en: 'Classic European avenue tree. Bark peels in jigsaw patches — distinctive camouflage pattern. Can live over 300 years.',
    seasons: { de: '🌿 Blattaustrieb April · ☀️ Dichtes Blätterdach Mai–Okt · 🍂 Gelb November · ❄️ Stachelige Fruchtkugeln', en: '🌿 Leaves April · ☀️ Dense canopy May–Oct · 🍂 Yellow November · ❄️ Spiky seed balls persist' },
    ecology: { de: 'Abblätternde Rinde = Selbstreinigung — ideal für Stadtluft. Filtert Feinstaub besonders effektiv. Nistplätze für Stare und Meisen.', en: 'Shedding bark = self-cleaning — ideal for city air. Filters fine particles effectively. Nesting sites for starlings and tits.' },
  },
  'Gemeine Rosskastanie': {
    family: 'Seifenbaumgewächse (Sapindaceae)', origin: 'Balkanhalbinsel',
    de: 'Kam im 16. Jh. nach Mitteleuropa. Die «Kastanien» sind nicht essbar — sie dienten als Pferdefutter (daher der Name). Spektakuläre weisse Blütenkerzen im Mai.',
    en: 'Arrived in Central Europe in the 16th century. Conkers are inedible — used as horse feed (hence the name). Spectacular white flower candles in May.',
    seasons: { de: '🌸 Weisse Blütenkerzen Mai · 🌰 Kastanien fallen Sept–Okt · 🍂 Frühe Herbstfärbung · ❄️ Klebrige Knospen', en: '🌸 White flower candles May · 🌰 Conkers fall Sept–Oct · 🍂 Early autumn colour · ❄️ Sticky buds' },
    ecology: { de: 'Blüten = wichtige Hummelnahrung im Frühling. Kinder sammeln Kastanien zum Basteln. Bedroht durch die Kastanien-Miniermotte (braune Blätter ab Sommer).', en: 'Flowers = vital spring bumblebee food. Children collect conkers for crafting. Threatened by leaf miner moth (brown leaves from summer).' },
  },
  'Spitz-Ahorn': {
    family: 'Seifenbaumgewächse (Sapindaceae)', origin: 'Europa, Westasien',
    de: 'Häufigster einheimischer Laubbaum. Leuchtend gelb-oranges Herbstlaub. Die geflügelten Samen drehen sich wie Propeller zu Boden.',
    en: 'Most common native deciduous tree. Vivid yellow-orange autumn foliage. Winged seeds spin like helicopters to the ground.',
    seasons: { de: '🌼 Gelbgrüne Blüten vor Laub (März–April) · ☀️ Dichter Schatten · 🍂 Leuchtend gelb-orange Okt · 🚁 Propeller-Samen', en: '🌼 Yellow-green flowers before leaves (March–April) · ☀️ Dense shade · 🍂 Bright yellow-orange Oct · 🚁 Helicopter seeds' },
    ecology: { de: 'Frühe Blüte = wichtiger Pollen für Bienen nach dem Winter. Kühlt Strassen um bis zu 3°C. Ahornsirup kommt allerdings vom nordamerikanischen Zucker-Ahorn.', en: 'Early bloom = vital pollen for bees after winter. Cools streets by up to 3°C. Maple syrup comes from the North American Sugar Maple, not this species.' },
  },
  'Feld-Ahorn': {
    family: 'Seifenbaumgewächse (Sapindaceae)', origin: 'Europa',
    de: 'Kleinster einheimischer Ahorn, ideal für Strassen und Hecken. Äusserst robust und anpassungsfähig. In der Schweiz seit der letzten Eiszeit heimisch.',
    en: 'Smallest native maple, ideal for streets and hedges. Extremely robust and adaptable. Native to Switzerland since the last ice age.',
    seasons: { de: '🌼 Unscheinbare Blüten Mai · ☀️ Kompakte Krone · 🍂 Goldgelb Oktober · ❄️ Korkleisten an jungen Zweigen', en: '🌼 Inconspicuous flowers May · ☀️ Compact crown · 🍂 Golden yellow October · ❄️ Cork ridges on young twigs' },
    ecology: { de: 'Wichtiger Heckbaum — bietet Vögeln Nistplätze und Insekten Nahrung. Milchsaft der Blätter wurde früher gegen Augenleiden verwendet.', en: 'Important hedgerow tree — provides birds nest sites and insects food. Leaf sap was once used to treat eye ailments.' },
  },
  'Winter-Linde': {
    family: 'Lindengewächse (Tiliaceae)', origin: 'Europa',
    de: 'Nationalbaum Tschechiens. Heiliger Baum der Freya in germanischer Mythologie. Kleinere Blätter als die Sommer-Linde, blüht 2–3 Wochen später.',
    en: 'National tree of Czechia. Sacred to Freya in Germanic mythology. Smaller leaves than Large-leaved Linden, flowers 2–3 weeks later.',
    seasons: { de: '🌸 Blüte Juli (nach der Sommer-Linde) · 🐝 Wichtige Spätbienenweide · 🍂 Goldgelb Okt–Nov · ❄️ Zarte Wintersilhouette', en: '🌸 Flowers July (after Large-leaved) · 🐝 Important late bee forage · 🍂 Golden yellow Oct–Nov · ❄️ Delicate winter silhouette' },
    ecology: { de: 'Verlängert die Nektarsaison für Insekten. Nüsschen = Winterfutter für Mäuse und Vögel. Lindenbast wurde historisch zu Seilen verarbeitet.', en: 'Extends nectar season for insects. Small nuts = winter food for mice and birds. Bast was historically made into rope.' },
  },
  'Gewöhnliche Hain- oder Weissbuche': {
    family: 'Birkengewächse (Betulaceae)', origin: 'Europa, Westasien',
    de: 'Trotz des Namens keine Buche, sondern mit Birken verwandt. Extrem schnittverträglich — der perfekte Heckenbaum. Ihr Holz ist das härteste einheimische Holz.',
    en: 'Despite the name, not a beech but related to birches. Extremely tolerant of pruning — the perfect hedge tree. Its wood is the hardest native timber.',
    seasons: { de: '🌿 Zartes Grün April · ☀️ Dichte Hecken im Sommer · 🍂 Goldgelb bis braun Okt · ❄️ Behält trockenes Laub bis Frühling (Marceszenz)', en: '🌿 Tender green April · ☀️ Dense hedges in summer · 🍂 Golden to brown Oct · ❄️ Retains dry leaves until spring (marcescence)' },
    ecology: { de: 'Perfekter Vogelschutz — dichte Hecken bieten Amseln, Rotkehlchen und Zaunkönigen sichere Nistplätze. Hainbuchenholz war das bevorzugte Brennholz für Schmiede.', en: 'Perfect bird shelter — dense hedges offer blackbirds, robins, and wrens safe nesting. Hornbeam wood was the preferred fuel for blacksmiths.' },
  },
  'Wald-Kiefer': {
    family: 'Kieferngewächse (Pinaceae)', origin: 'Europa, Nordasien',
    de: 'Die am weitesten verbreitete Baumart der Welt — von Schottland bis Sibirien. Erkennbar an der orangeroten Rinde im oberen Stammbereich.',
    en: 'The most widely distributed tree species on Earth — from Scotland to Siberia. Recognizable by orange-red bark on the upper trunk.',
    seasons: { de: '🌲 Immergrün ganzjährig · 🌼 Gelbe Pollenwolken Mai · 🍂 Alte Nadeln fallen herbstlich · ❄️ Wichtiger Winterschutz für Vögel', en: '🌲 Evergreen year-round · 🌼 Yellow pollen clouds May · 🍂 Old needles drop in autumn · ❄️ Vital winter shelter for birds' },
    ecology: { de: 'Kiefernwälder riechen harzig — ätherische Öle wirken antibakteriell. Kreuzschnäbel öffnen die Zapfen mit ihrem gekreuzten Schnabel. Kiefernholz ist das meistverwendete Bauholz der Schweiz.', en: 'Pine forests smell resinous — essential oils are antibacterial. Crossbills open cones with their crossed bills. Pine wood is Switzerland\'s most used construction timber.' },
  },
  'Stiel-Eiche': {
    family: 'Buchengewächse (Fagaceae)', origin: 'Europa',
    de: 'Symbol für Kraft und Beständigkeit. Kann über 800 Jahre alt werden. Eine Eiche beherbergt bis zu 1\'000 Tierarten — mehr als jeder andere einheimische Baum.',
    en: 'Symbol of strength and endurance. Can live over 800 years. An oak hosts up to 1,000 animal species — more than any other native tree.',
    seasons: { de: '🌿 Später Austrieb Mai · ☀️ Lichte Krone (Bodenpflanzen!) · 🍂 Braun Okt–Nov · 🌰 Eicheln Oktober — Eichhörnchen-Ernte!', en: '🌿 Late leaf-out May · ☀️ Open crown (ground flora!) · 🍂 Brown Oct–Nov · 🌰 Acorns October — squirrel harvest!' },
    ecology: { de: 'Biodiversitäts-Champion: Käfer, Schmetterlinge, Fledermäuse, Spechte, Eichelhäher. Eicheln waren in Notzeiten Menschennahrung (Eichelmehl, Eichelkaffee).', en: 'Biodiversity champion: beetles, butterflies, bats, woodpeckers, jays. Acorns were human food in times of scarcity (acorn flour, acorn coffee).' },
  },
  'Gewöhnliche oder Europäische Eibe': {
    family: 'Eibengewächse (Taxaceae)', origin: 'Europa',
    de: 'Älteste Baumart Europas — einzelne Eiben werden über 2\'000 Jahre alt. Alle Pflanzenteile ausser dem roten Samenmantel sind hochgiftig.',
    en: 'Europe\'s oldest tree species — individual yews can exceed 2,000 years. All parts except the red seed coat are highly poisonous.',
    seasons: { de: '🌲 Immergrün, dunkelste Nadeln aller Koniferen · 🔴 Leuchtend rote Beeren Sept–Okt · ❄️ Wichtiger Winterschutz', en: '🌲 Evergreen, darkest needles of any conifer · 🔴 Bright red berries Sept–Oct · ❄️ Important winter shelter' },
    ecology: { de: '⚠️ Hochgiftig für Menschen, Pferde und Rinder! Amseln fressen die roten Beeren unbeschadet und verbreiten die Samen. Der Wirkstoff Taxol wird in der Krebstherapie eingesetzt.', en: '⚠️ Highly toxic to humans, horses, and cattle! Blackbirds eat red berries unharmed and spread seeds. The compound Taxol is used in cancer therapy.' },
  },
  'Hängebirke': {
    family: 'Birkengewächse (Betulaceae)', origin: 'Europa, Nordasien',
    de: 'Pionierbaum — besiedelt kahle Flächen als erste. Weisse Rinde reflektiert Sonnenlicht und schützt vor Überhitzung. In Skandinavien heiliger Baum.',
    en: 'Pioneer tree — first to colonize bare ground. White bark reflects sunlight, protecting from overheating. Sacred tree in Scandinavia.',
    seasons: { de: '🌿 Einer der ersten im Frühling (März) · ⚠️ Kätzchenpollen März–April (Allergiker!) · ☀️ Leichter, tanzender Schatten · 🍂 Leuchtend gelb Oktober', en: '🌿 Among first in spring (March) · ⚠️ Catkin pollen March–April (allergy alert!) · ☀️ Light dancing shade · 🍂 Bright yellow October' },
    ecology: { de: 'Birkenpollen = häufigster Frühlings-Allergieauslöser. Pionierbaum, bereitet Boden für andere Arten. Birkensaft wurde traditionell als Frühlingskur getrunken.', en: 'Birch pollen = most common spring allergen. Pioneer species, preparing soil for others. Birch sap was traditionally drunk as a spring tonic.' },
  },
  'Rot-Buche': {
    family: 'Buchengewächse (Fagaceae)', origin: 'Europa',
    de: 'Häufigster Laubbaum in Schweizer Wäldern. Name bezieht sich auf rötliches Holz, nicht Blätter. Aus Buchenholz wurden die ersten Buchstaben geschnitzt — daher «Buch».',
    en: 'Most common deciduous tree in Swiss forests. Name refers to reddish wood, not leaves. First letters were carved from beech — the German "Buchstabe" derives from "Buche".',
    seasons: { de: '🌿 Zartes Hellgrün April · ☀️ Dichtester Schatten aller Laubbäume · 🍂 Kupfer-Bronze Okt–Nov · ❄️ Junge Buchen behalten Laub bis Frühling', en: '🌿 Tender light green April · ☀️ Densest shade of any deciduous tree · 🍂 Copper-bronze Oct–Nov · ❄️ Young beeches retain leaves until spring' },
    ecology: { de: 'Bucheckern ernähren Eichhörnchen, Siebenschläfer und Buchfinken. Dichte Krone erzeugt kühles, feuchtes Waldklima. Buchenmischwälder = artenreichste Ökosysteme Europas.', en: 'Beechnuts feed squirrels, dormice, chaffinches. Dense crown creates cool, moist microclimate. Mixed beech forests = Europe\'s most biodiverse ecosystems.' },
  },
  'Mädchenhaarbaum / Ginkgo': {
    family: 'Ginkgogewächse (Ginkgoaceae)', origin: 'China',
    de: '«Lebendes Fossil» — 270 Millionen Jahre alt, älter als Dinosaurier. Überlebte die Atombombe von Hiroshima: Sechs Ginkgos nahe dem Epizentrum trieben 1946 wieder aus.',
    en: '"Living fossil" — 270 million years old, predating dinosaurs. Survived the Hiroshima atomic bomb: six Ginkgos near ground zero sprouted again in 1946.',
    seasons: { de: '🌿 Fächerförmige Blätter ab April · ☀️ Einzigartiges Laubwerk · 🍂 Leuchtendes Gold November — fällt oft an einem Tag! · ⚠️ Weibliche: übelriechende Früchte', en: '🌿 Fan-shaped leaves from April · ☀️ Unique foliage · 🍂 Luminous gold November — often drops all leaves in one day! · ⚠️ Female: foul-smelling fruits' },
    ecology: { de: 'Weder Nadelbaum noch Laubbaum — eine eigene Pflanzenklasse. Resistent gegen alles: Schädlinge, Krankheiten, Luftverschmutzung. Ginkgo-Extrakt wird zur Gedächtnisförderung eingesetzt.', en: 'Neither conifer nor broadleaf — its own plant class. Resistant to everything: pests, diseases, pollution. Ginkgo extract is used to support memory.' },
  },
  'Echte Walnuss': {
    family: 'Walnussgewächse (Juglandaceae)', origin: 'Zentralasien',
    de: 'Von den Römern über die Alpen gebracht. Das Holz ist eines der wertvollsten der Welt — Möbel, Gewehrschäfte, Armaturenbretter. Die Nüsse sind ein Superfood.',
    en: 'Brought across the Alps by the Romans. Its wood is among the world\'s most valuable — furniture, gun stocks, dashboards. The nuts are a superfood.',
    seasons: { de: '🌿 Später Austrieb Mai · 🌼 Unscheinbare Kätzchen · 🌰 Walnuss-Ernte September–Oktober · 🍂 Gelb Oktober', en: '🌿 Late leaf-out May · 🌼 Inconspicuous catkins · 🌰 Walnut harvest September–October · 🍂 Yellow October' },
    ecology: { de: 'Walnüsse = Omega-3-reichstes Lebensmittel. Eichhörnchen vergraben Nüsse als Wintervorrat und vergessen manche — so pflanzen sie neue Bäume. Blätter sondern Juglon ab, das andere Pflanzen hemmt.', en: 'Walnuts = richest food in omega-3. Squirrels bury nuts for winter and forget some — planting new trees. Leaves release juglone which inhibits other plants.' },
  },
  'Sommer-Linde': {
    family: 'Lindengewächse (Tiliaceae)', origin: 'Europa',
    de: 'Kann über 1000 Jahre alt werden. Basels ältestes Exemplar am Münsterplatz — über 260 Jahre. Unter Linden wurde traditionell Recht gesprochen.',
    en: 'Can live over 1000 years. Basel\'s oldest at Münsterplatz — over 260 years. Courts were traditionally held under lindens.',
    seasons: { de: '🌸 Duftende Blüte Juni–Juli · 🐝 Bienensummen hörbar · 🍂 Goldgelb Oktober · ❄️ Herzförmige Silhouette', en: '🌸 Fragrant bloom June–July · 🐝 Audible bee buzz · 🍂 Golden yellow October · ❄️ Heart-shaped silhouette' },
    ecology: { de: 'Bis zu 1 Mio. Blattläuse produzieren Honigtau, der Autos unter Linden klebt — aber Ameisen, Marienkäfer und Bienen ernährt. Lindenblütenhonig ist eine Basler Spezialität.', en: 'Up to 1M aphids produce honeydew that sticks to cars — but feeds ants, ladybirds, bees. Linden honey is a Basel specialty.' },
  },
  'Gewöhnliche Esche': {
    family: 'Ölbaumgewächse (Oleaceae)', origin: 'Europa',
    de: 'Weltenbaum Yggdrasil der nordischen Mythologie. Heute bedroht durch Eschentriebsterben — ein Pilz, der seit 2008 die Schweiz erreicht hat.',
    en: 'Yggdrasil, World Tree of Norse mythology. Threatened by ash dieback — a fungal disease reaching Switzerland in 2008.',
    seasons: { de: '🌿 Sehr später Austrieb (Mai) · 🍂 Einer der ersten mit Laubfall (Okt) · ❄️ Markante schwarze Knospen · 🚁 Geflügelte Samen', en: '🌿 Very late leaf-out (May) · 🍂 Among first to drop leaves (Oct) · ❄️ Distinctive black buds · 🚁 Winged seeds' },
    ecology: { de: 'Eschenholz = extrem elastisch — Werkzeugstiele, Sportgeräte. Gimpel fressen Samen. Eschentriebsterben bedroht den Bestand europaweit.', en: 'Ash wood = extremely elastic — tool handles, sports gear. Bullfinches eat seeds. Ash dieback threatens populations across Europe.' },
  },
  'Gewöhnliche Scheinakazie / Robinie': {
    family: 'Hülsenfrüchtler (Fabaceae)', origin: 'Nordamerika',
    de: '1601 nach Europa gebracht — benannt nach Jean Robin, Gärtner des französischen Königs. Fixiert Stickstoff im Boden und verbessert so die Erde.',
    en: 'Brought to Europe in 1601 — named after Jean Robin, gardener to the French king. Fixes nitrogen in soil, improving the earth.',
    seasons: { de: '🌸 Weisse, duftende Blütentrauben Mai–Juni · 🐝 Akazien-Honig! · 🍂 Gelb Oktober · ❄️ Dornige Zweige, Hülsen', en: '🌸 White fragrant flower clusters May–June · 🐝 Acacia honey! · 🍂 Yellow October · ❄️ Thorny twigs, seed pods' },
    ecology: { de: '⚠️ Alle Teile ausser Blüten sind giftig! Der beliebte «Akazienhonig» stammt von der Robinie, nicht von echten Akazien. Invasiv in manchen Gebieten, aber wertvoll für Bienen.', en: '⚠️ All parts except flowers are toxic! Popular "acacia honey" comes from Black Locust, not true acacias. Invasive in some areas but valuable for bees.' },
  },
  'Kornelkirsche': {
    family: 'Hartriegelgewächse (Cornaceae)', origin: 'Südeuropa, Westasien',
    de: 'Blüht bereits im Februar als einer der ersten Bäume. Leuchtend rote essbare Früchte — seit der Antike zu Marmelade verarbeitet.',
    en: 'Blooms in February, among the first trees. Bright red edible fruits — made into jam since antiquity.',
    seasons: { de: '🌼 Leuchtend gelb Feb–März (vor Laub!) · 🌿 Glänzendes Laub ab April · 🍒 Rote essbare Früchte Aug–Sept · 🍂 Rötlich im Herbst', en: '🌼 Bright yellow Feb–March (before leaves!) · 🌿 Glossy foliage from April · 🍒 Red edible fruits Aug–Sept · 🍂 Reddish autumn' },
    ecology: { de: 'Erste Nahrung für Bienen im Vorfrühling! Früchte = Vitamin-C-Bomben, ideal für Konfitüre und Likör. Auch Amseln und Drosseln lieben sie.', en: 'First food for bees in late winter! Fruits = vitamin C bombs, ideal for jam and liqueur. Blackbirds and thrushes love them too.' },
  },
  'Eisenholzbaum': {
    family: 'Zaubernussgewächse (Hamamelidaceae)', origin: 'Nordiran, Kaukasus',
    de: 'Holz so dicht, dass es im Wasser sinkt. Spektakulärste Herbstfärbung aller Stadtbäume — Gelb → Orange → Scharlach → Violett.',
    en: 'Wood so dense it sinks in water. Most spectacular autumn colour of any city tree — yellow → orange → scarlet → violet.',
    seasons: { de: '🌿 Dunkelgrün ab April · ☀️ Breite Krone · 🍂 SPEKTAKULÄR: Gelb→Orange→Scharlach→Violett (Okt–Nov) · ❄️ Dekorative Rinde', en: '🌿 Dark green from April · ☀️ Broad crown · 🍂 SPECTACULAR: Yellow→Orange→Scarlet→Violet (Oct–Nov) · ❄️ Decorative bark' },
    ecology: { de: 'Zukunftsbaum für den Klimawandel — hitze- und trockenresistent. Die Herbstfärbung ist ein lohnendes Fotomotiv im Oktober!', en: 'Climate-future tree — heat and drought resistant. Autumn colour makes a rewarding October photo subject!' },
  },
  'Japanische Zelkove': {
    family: 'Ulmengewächse (Ulmaceae)', origin: 'Japan, Ostasien',
    de: 'Zunehmend als Stadtbaum gepflanzt — resistent gegen Ulmenkrankheit. In Japan werden Tempel und Möbel aus dem harten Holz gebaut.',
    en: 'Increasingly planted in cities — resistant to Dutch elm disease. In Japan, temples and furniture are built from its hard wood.',
    seasons: { de: '🌿 Fein gezahnte Blätter April · ☀️ Vasenförmige Krone · 🍂 Orange bis rostrot Okt–Nov · ❄️ Elegante Silhouette', en: '🌿 Finely toothed leaves April · ☀️ Vase-shaped crown · 🍂 Orange to russet Oct–Nov · ❄️ Elegant silhouette' },
    ecology: { de: 'Zukunftsbaum — verträgt Hitze und Trockenheit besser als einheimische Ulmen. Dichte Krone = Nistplätze für Vögel.', en: 'Future tree — handles heat and drought better than native elms. Dense crown = nesting sites for birds.' },
  },
};

// Alias map: actual data names → fact keys
const ALIASES = {
  'Platane': 'Gewöhnliche Platane',
  'Rosskastanie': 'Gemeine Rosskastanie',
  'Hänge-Birke': 'Hängebirke',
  'Hängebirke / Weiss- oder Sandbirke': 'Hängebirke',
  'Schwarzkiefer': 'Wald-Kiefer',
  'Gefülltblühende Rosskastanie': 'Gemeine Rosskastanie',
  'Ungarische Silber-Linde': 'Krim-Linde',
  'Säulenförmiger Spitz-Ahorn': 'Spitz-Ahorn',
  'Spanischer Feld-Ahorn': 'Feld-Ahorn',
  'Säulen-Hainbuche': 'Gewöhnliche Hain- oder Weissbuche',
  'Vogel-Kirsche': 'Kornelkirsche',
  'Felsen-Ahorn / Burgen-Ahorn': 'Feld-Ahorn',
  'Amerikanische Rot-Eiche': 'Stiel-Eiche',
  'Blut-Buche': 'Rot-Buche',
  'Zerr-Eiche': 'Stiel-Eiche',
  'Berg-Ahorn': 'Spitz-Ahorn',
  'Europäische Hopfenbuche': 'Gewöhnliche Hain- oder Weissbuche',
  'Edel-Kastanie / Ess-Kastanie': 'Echte Walnuss',
  'Trauben-Eiche': 'Stiel-Eiche',
  'Silber-Ahorn': 'Spitz-Ahorn',
  'Schwarz-Erle': 'Hängebirke',
  'Serbische Fichte': 'Wald-Kiefer',
  'Nordmanns-Tanne': 'Wald-Kiefer',
  'Holländische Linde': 'Krim-Linde',
  'Rotblühende Rosskastanie': 'Gemeine Rosskastanie',
};

// ── Basel historical events by decade ────────────────────────
const BASEL_HISTORY = {
  1750: { de: 'Basel war eine wohlhabende Handelsstadt mit rund 15\'000 Einwohnern.', en: 'Basel was a prosperous trading city of about 15,000 inhabitants.' },
  1760: { de: 'Die Basler Seidenbandindustrie erlebte ihre Blütezeit.', en: 'Basel\'s silk ribbon industry was at its peak.' },
  1770: { de: 'Euler, der grösste Mathematiker aller Zeiten, war gebürtiger Basler.', en: 'Euler, the greatest mathematician of all time, was born in Basel.' },
  1790: { de: 'Die Französische Revolution veränderte auch das Leben in Basel grundlegend.', en: 'The French Revolution fundamentally changed life in Basel too.' },
  1800: { de: 'Basel wurde Teil der Helvetischen Republik unter Napoleon.', en: 'Basel became part of the Helvetic Republic under Napoleon.' },
  1830: { de: 'Basler Kantonstrennung 1833: Basel-Stadt und Basel-Landschaft gehen getrennte Wege.', en: 'Canton split 1833: Basel-Stadt and Basel-Landschaft go separate ways.' },
  1840: { de: 'Die erste Schweizer Eisenbahnlinie verband 1844 Basel mit Strassburg.', en: 'Switzerland\'s first railway connected Basel to Strasbourg in 1844.' },
  1850: { de: 'Basel entwickelte sich zum Zentrum der chemischen Industrie.', en: 'Basel developed into the center of the chemical industry.' },
  1860: { de: 'Die Basler Chemie (Vorläufer von Novartis, Roche) begann ihren Aufstieg.', en: 'Basel\'s chemical industry (precursor to Novartis, Roche) began its rise.' },
  1870: { de: 'Die Basler Mission entsandte Missionare und Händler in alle Welt.', en: 'The Basel Mission sent missionaries and traders around the world.' },
  1880: { de: 'Theodor Herzl hielt 1897 den ersten Zionistenkongress in Basel ab.', en: 'Theodor Herzl held the first Zionist Congress in Basel in 1897.' },
  1890: { de: 'Basel wurde zum Zentrum der aufblühenden Pharmaindustrie.', en: 'Basel became the center of the burgeoning pharmaceutical industry.' },
  1900: { de: 'Die Basler Fasnacht — die «drey scheenschte Dääg» — war bereits eine feste Tradition.', en: 'Basel\'s Fasnacht — the "three most beautiful days" — was already a firm tradition.' },
  1910: { de: 'Während des Ersten Weltkriegs blieb Basel als Grenzstadt neutral aber angespannt.', en: 'During WWI, Basel remained neutral as a border city but tensions were high.' },
  1920: { de: 'Die Basler Mustermesse wurde zum wichtigsten Handelsplatz der Schweiz.', en: 'The Basel Trade Fair became Switzerland\'s most important marketplace.' },
  1930: { de: 'Die Weltwirtschaftskrise traf auch Basel — Arbeitslosigkeit und soziale Spannungen.', en: 'The Great Depression hit Basel too — unemployment and social tensions.' },
  1940: { de: 'Im Zweiten Weltkrieg war Basel Grenzstadt — alliierte Bomben trafen versehentlich Schweizer Boden.', en: 'In WWII Basel was a border city — Allied bombs accidentally hit Swiss soil.' },
  1950: { de: 'Nachkriegs-Bauboom: Basel modernisierte sich mit neuen Brücken und Strassenbahn-Linien.', en: 'Post-war construction boom: Basel modernized with new bridges and tram lines.' },
  1960: { de: 'Geigy und Ciba fusionierten 1970 — Basel festigte seinen Ruf als Pharma-Hauptstadt.', en: 'Geigy and Ciba merged in 1970 — Basel cemented its reputation as pharma capital.' },
  1970: { de: 'Das Basler Münster wurde aufwändig restauriert. Die Universität Basel expandierte stark.', en: 'Basel Minster was extensively restored. The University of Basel expanded significantly.' },
  1980: { de: 'Die Sandoz-Katastrophe 1986: Ein Grossbrand verschmutzte den Rhein und veränderte das Umweltbewusstsein.', en: 'The Sandoz disaster 1986: a major fire polluted the Rhine and changed environmental awareness.' },
  1990: { de: 'Basel erhielt mit der S-Bahn ein modernes Nahverkehrsnetz. Die Art Basel wurde weltberühmt.', en: 'Basel got a modern S-Bahn transit network. Art Basel became world-famous.' },
  2000: { de: 'Die Novartis und Roche Campus transformierten Basel zur globalen Life-Sciences-Hauptstadt.', en: 'The Novartis and Roche campuses transformed Basel into the global life sciences capital.' },
  2010: { de: 'Basel investierte massiv in Grünflächen und nachhaltige Stadtentwicklung.', en: 'Basel invested heavily in green spaces and sustainable urban development.' },
  2020: { de: 'Covid-19 veränderte das Basler Stadtleben. Die Pharmaindustrie spielte eine Schlüsselrolle bei der Impfstoffentwicklung.', en: 'Covid-19 changed Basel city life. The pharma industry played a key role in vaccine development.' },
};

export function getSpeciesInfo(baumart_deutsch) {
  if (!baumart_deutsch) return null;
  // Direct match
  if (S[baumart_deutsch]) return S[baumart_deutsch];
  // Alias match
  const aliasKey = ALIASES[baumart_deutsch];
  if (aliasKey && S[aliasKey]) return S[aliasKey];
  // Partial: data starts with a known key
  for (const key of Object.keys(S)) {
    if (baumart_deutsch.startsWith(key)) return S[key];
  }
  // Partial: known key starts with data
  for (const key of Object.keys(S)) {
    if (key.startsWith(baumart_deutsch)) return S[key];
  }
  // Alias partial
  for (const [alias, target] of Object.entries(ALIASES)) {
    if (baumart_deutsch.includes(alias) || alias.includes(baumart_deutsch)) {
      return S[target] || null;
    }
  }
  return null;
}

/**
 * Get a Basel historical fact for a planting year.
 */
export function getHistoricalFact(plantingYear, lang) {
  if (!plantingYear || plantingYear < 1750) return null;
  const decade = Math.floor(plantingYear / 10) * 10;
  const entry = BASEL_HISTORY[decade];
  if (!entry) return null;
  return (lang === 'en') ? entry.en : entry.de;
}

/**
 * Compute contextual stats for a tree relative to the dataset.
 */
export function computeTreeContext(state, feature) {
  const features = state.treeData?.features;
  if (!features) return null;
  const props = feature.properties ?? {};
  const result = {};

  if (props.baumart_deutsch) {
    let count = 0;
    for (const f of features) {
      if (f.properties?.baumart_deutsch === props.baumart_deutsch) count++;
    }
    result.speciesCount = count;
    if (count <= 3) result.rarity = 'unique';
    else if (count <= 20) result.rarity = 'rare';
    else if (count <= 100) result.rarity = 'uncommon';
    else result.rarity = 'common';
  }

  if (props.ba_baumalter != null && props.ba_baumalter < 500) {
    let younger = 0, total = 0;
    for (const f of features) {
      const age = f.properties?.ba_baumalter;
      if (age != null && age < 500) { total++; if (age < props.ba_baumalter) younger++; }
    }
    if (total > 0) result.agePercentile = Math.round((younger / total) * 100);
  }

  return result;
}
