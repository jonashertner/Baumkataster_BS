// ============================================================
// species-info.js — Species context, facts, and descriptions
// ============================================================

// Key species facts — covers the most common species in Basel.
// Keyed by baumart_deutsch (German common name).
const SPECIES_FACTS = {
  'Krim-Linde': {
    family: 'Lindengewächse (Tiliaceae)',
    origin: 'Südosteuropa, Kaukasus',
    de: 'Die Krim-Linde ist Basels häufigster Baum. Sie ist besonders stadttauglich: hitzeresistent, salzverträglich und bietet im Sommer dichten Schatten. Ihre Blüten duften intensiv und sind eine wichtige Bienenweide.',
    en: 'The Crimean Linden is Basel\'s most common tree. Exceptionally urban-hardy: heat-resistant, salt-tolerant, and provides dense summer shade. Its fragrant blossoms are a vital source of nectar for bees.',
    maxAge: 500,
    seasons: {
      de: '🌸 Blüte Juni–Juli (intensiver Duft) · 🍂 Gelbe Herbstfärbung Oktober · ❄️ Winterkahl',
      en: '🌸 Flowers June–July (intense fragrance) · 🍂 Yellow autumn colour October · ❄️ Deciduous',
    },
    ecology: {
      de: 'Bienenweide Nr. 1 in Basel — eine einzelne Linde kann bis zu 60\'000 Blüten tragen. Liefert Nektar für Honigbienen, Hummeln und Schwebfliegen. Lindenblütentee ist ein traditionelles Hausmittel gegen Erkältung.',
      en: 'Basel\'s #1 bee tree — a single linden can bear up to 60,000 blossoms. Provides nectar for honeybees, bumblebees, and hoverflies. Linden blossom tea is a traditional cold remedy.',
    },
  },
  'Gewöhnliche Platane': {
    family: 'Platanengewächse (Platanaceae)',
    origin: 'Südosteuropa, Westasien',
    de: 'Die Platane ist der klassische europäische Alleebaum. Ihre markante Borke blättert in Puzzlestücken ab und gibt dem Stamm sein charakteristisches Tarnmuster. Sie kann über 300 Jahre alt werden.',
    en: 'The London Plane is the classic European avenue tree. Its bark peels off in jigsaw-like patches, giving the trunk its distinctive camouflage pattern. It can live over 300 years.',
    maxAge: 400,
    seasons: {
      de: '🌿 Blattaustrieb April · ☀️ Dichtes Blätterdach Mai–Oktober · 🍂 Späte Herbstfärbung November · ❄️ Stachelige Fruchtkugeln hängen den Winter über',
      en: '🌿 Leaf emergence April · ☀️ Dense canopy May–October · 🍂 Late autumn colour November · ❄️ Spiky seed balls hang through winter',
    },
    ecology: {
      de: 'Die abblätternde Rinde macht die Platane selbstreinigend — ideal für verschmutzte Stadtluft. Bietet Nistplätze für Stare und Meisen in Rindenhohlräumen. Die Blätter filtern Feinstaub besonders effektiv.',
      en: 'Shedding bark makes the Plane self-cleaning — ideal for polluted city air. Provides nesting cavities for starlings and tits in bark crevices. Its leaves filter fine particulate matter exceptionally well.',
    },
  },
  'Platane': {
    family: 'Platanengewächse (Platanaceae)',
    origin: 'Hybride (London Plane)',
    de: 'Die Platane ist der klassische europäische Alleebaum. Ihre markante Borke blättert in Puzzlestücken ab und gibt dem Stamm sein charakteristisches Tarnmuster.',
    en: 'The Plane tree is the classic European avenue tree. Its bark peels in jigsaw-like patches, creating a distinctive camouflage pattern.',
    maxAge: 400,
    seasons: {
      de: '🌿 Austritt April · ☀️ Schattendach Mai–Oktober · 🍂 Gelbfärbung November',
      en: '🌿 Leaf out April · ☀️ Shade canopy May–October · 🍂 Yellow leaves November',
    },
    ecology: {
      de: 'Filtert Feinstaub besonders effizient. Bietet Höhlenbrütern Nistplätze in der strukturreichen Rinde.',
      en: 'Filters fine particles exceptionally well. Bark cavities provide nest sites for hole-nesting birds.',
    },
  },
  'Gemeine Rosskastanie': {
    family: 'Seifenbaumgewächse (Sapindaceae)',
    origin: 'Balkanhalbinsel',
    de: 'Die Rosskastanie stammt ursprünglich aus dem Balkan und kam im 16. Jahrhundert nach Mitteleuropa. Ihre «Kastanien» sind nicht essbar, dienten aber historisch als Pferdefutter — daher der Name.',
    en: 'The Horse Chestnut originates from the Balkans and arrived in Central Europe in the 16th century. Its conkers are inedible but were historically used as horse feed — hence the name.',
    maxAge: 300,
    seasons: {
      de: '🌸 Spektakuläre weisse Blütenkerzen Mai · 🌰 Kastanien fallen September–Oktober · 🍂 Frühe Herbstfärbung · ❄️ Markante Knospen im Winter',
      en: '🌸 Spectacular white flower candles May · 🌰 Conkers fall September–October · 🍂 Early autumn colour · ❄️ Distinctive sticky buds in winter',
    },
    ecology: {
      de: 'Die Blüten sind eine wichtige Nahrungsquelle für Hummeln im Frühling. Kinder sammeln die glänzenden Kastanien zum Basteln. Leider zunehmend bedroht durch die Kastanien-Miniermotte, deren Larven die Blätter braun verfärben.',
      en: 'Flowers are a vital spring food source for bumblebees. Children collect the glossy conkers for crafting. Increasingly threatened by the horse chestnut leaf miner moth, whose larvae turn leaves brown.',
    },
  },
  'Spitz-Ahorn': {
    family: 'Seifenbaumgewächse (Sapindaceae)',
    origin: 'Europa, Westasien',
    de: 'Der Spitz-Ahorn ist einer der häufigsten einheimischen Laubbäume. Im Herbst färbt sich sein Laub leuchtend gelb bis orange. Sein geflügelter Samen dreht sich wie ein Propeller zu Boden.',
    en: 'The Norway Maple is one of the most common native deciduous trees. In autumn its leaves turn vivid yellow to orange. Its winged seeds spin like helicopters as they fall.',
    maxAge: 200,
    seasons: {
      de: '🌼 Gelbgrüne Blüten vor dem Laub (März–April) · ☀️ Dichter Schatten im Sommer · 🍂 Leuchtend gelb-orange Oktober · 🚁 Propeller-Samen fliegen im Herbstwind',
      en: '🌼 Yellow-green flowers before leaves (March–April) · ☀️ Dense shade in summer · 🍂 Bright yellow-orange October · 🚁 Helicopter seeds spin in autumn wind',
    },
    ecology: {
      de: 'Frühe Blüte liefert wichtigen Pollen für Bienen nach dem Winter. Die dichte Krone kühlt Strassen um bis zu 3°C im Sommer. Ahornsirup stammt allerdings vom nordamerikanischen Zucker-Ahorn, nicht von dieser Art.',
      en: 'Early flowering provides vital pollen for bees after winter. Dense crown cools streets by up to 3°C in summer. Maple syrup comes from the North American Sugar Maple, not this species.',
    },
  },
  'Sommer-Linde': {
    family: 'Lindengewächse (Tiliaceae)',
    origin: 'Europa',
    de: 'Die Sommer-Linde kann über 1000 Jahre alt werden. In Basel steht das älteste Exemplar am Münsterplatz — eine über 260-jährige Zeugin der Stadtgeschichte. Unter Linden wurde traditionell Recht gesprochen.',
    en: 'The Large-leaved Linden can live over 1000 years. Basel\'s oldest stands at Münsterplatz — a 260+ year-old witness to city history. Courts were traditionally held under linden trees.',
    maxAge: 1000,
    seasons: {
      de: '🌸 Duftende Blüte Juni–Juli · 🐝 Summen der Bienen hörbar · 🍂 Goldgelb im Oktober · ❄️ Herzförmige Silhouette im Winter',
      en: '🌸 Fragrant bloom June–July · 🐝 Buzzing of bees audible · 🍂 Golden yellow October · ❄️ Heart-shaped silhouette in winter',
    },
    ecology: {
      de: 'In einer Nacht können bis zu 1 Million Blattläuse Honigtau produzieren, der unter Linden parkende Autos klebt — aber auch Ameisen, Marienkäfer und Honigbienen ernährt. Lindenblütenhonig ist eine Basler Spezialität.',
      en: 'On a single night, up to 1 million aphids can produce honeydew that sticks to cars parked under lindens — but also feeds ants, ladybirds, and honeybees. Linden blossom honey is a Basel specialty.',
    },
  },
  'Winter-Linde': {
    family: 'Lindengewächse (Tiliaceae)',
    origin: 'Europa',
    de: 'Die Winter-Linde unterscheidet sich von der Sommer-Linde durch kleinere Blätter und spätere Blüte. Sie ist der Nationalbaum Tschechiens und war in der germanischen Mythologie der Baum der Freya.',
    en: 'The Small-leaved Linden differs from its large-leaved cousin by smaller leaves and later flowering. It\'s the national tree of Czechia and was sacred to Freya in Germanic mythology.',
    maxAge: 800,
    seasons: {
      de: '🌸 Blüte Juli (2–3 Wochen nach der Sommer-Linde) · 🐝 Wichtige Spätbienenweide · 🍂 Goldgelb Oktober–November · ❄️ Zarte Zweigstruktur im Winter',
      en: '🌸 Flowers July (2–3 weeks after Large-leaved) · 🐝 Important late bee forage · 🍂 Golden yellow October–November · ❄️ Delicate twig structure in winter',
    },
    ecology: {
      de: 'Blüht später als die Sommer-Linde und verlängert so die Nektarsaison für Insekten. Die kleinen Nüsschen sind Winterfutter für Mäuse und Vögel. Bast der Lindenrinde wurde historisch zu Seilen verarbeitet.',
      en: 'Flowers later than the Large-leaved Linden, extending the nectar season for insects. Small nutlets are winter food for mice and birds. Linden bark bast was historically made into rope.',
    },
  },
  'Rot-Buche': {
    family: 'Buchengewächse (Fagaceae)',
    origin: 'Europa',
    de: 'Die Rotbuche ist der häufigste Laubbaum in Schweizer Wäldern. Ihr Name bezieht sich auf die rötliche Holzfarbe, nicht auf die Blätter. Aus Buchenholz wurden die ersten Buchstaben geschnitzt — daher «Buch» und «Buchstabe».',
    en: 'The European Beech is the most common deciduous tree in Swiss forests. Its name refers to its reddish wood, not its leaves. The first letters were carved from beech wood — the German word "Buchstabe" (letter) derives from "Buche" (beech).',
    maxAge: 400,
    seasons: {
      de: '🌿 Zartes Hellgrün im Frühling (April) · ☀️ Dichtester Schatten aller Laubbäume · 🍂 Kupfer-Bronze Oktober–November · ❄️ Junge Buchen behalten trockenes Laub bis Frühling (Marceszenz)',
      en: '🌿 Tender light green in spring (April) · ☀️ Densest shade of any deciduous tree · 🍂 Copper-bronze October–November · ❄️ Young beeches retain dry leaves until spring (marcescence)',
    },
    ecology: {
      de: 'Bucheckern sind Nahrung für Eichhörnchen, Siebenschläfer und Buchfinken. Die dichte Krone erzeugt ein einzigartiges Waldklima — kühl, feucht, still. Buchenmischwälder gehören zu den artenreichsten Ökosystemen Europas.',
      en: 'Beechnuts feed squirrels, dormice, and chaffinches. The dense crown creates a unique forest microclimate — cool, moist, quiet. Mixed beech forests are among Europe\'s most biodiverse ecosystems.',
    },
  },
  'Stiel-Eiche': {
    family: 'Buchengewächse (Fagaceae)',
    origin: 'Europa',
    de: 'Die Stiel-Eiche kann über 800 Jahre alt werden und ist ein Symbol für Kraft und Beständigkeit. Eine einzelne Eiche kann bis zu 500\'000 Insektenarten beherbergen — mehr als jeder andere einheimische Baum.',
    en: 'The Pedunculate Oak can live over 800 years and symbolizes strength and endurance. A single oak can host up to 500,000 insect species — more than any other native tree.',
    maxAge: 800,
    seasons: {
      de: '🌿 Später Austrieb (Mai) · ☀️ Lichte Krone lässt Bodenpflanzen wachsen · 🍂 Braune Herbstfärbung · 🌰 Eicheln fallen Oktober — Eichhörnchen-Ernte!',
      en: '🌿 Late leaf-out (May) · ☀️ Open crown allows ground flora · 🍂 Brown autumn tones · 🌰 Acorns fall October — squirrel harvest time!',
    },
    ecology: {
      de: 'Biodiversitäts-Champion: Bis zu 1\'000 Tierarten leben an einer einzigen Eiche — Käfer, Schmetterlinge, Fledermäuse, Spechte, Eichelhäher. Eicheln waren in Notzeiten auch Nahrung für Menschen (Eichelmehl, Eichelkaffee).',
      en: 'Biodiversity champion: up to 1,000 animal species live on a single oak — beetles, butterflies, bats, woodpeckers, jays. Acorns were human food in times of scarcity (acorn flour, acorn coffee).',
    },
  },
  'Hänge-Birke': {
    family: 'Birkengewächse (Betulaceae)',
    origin: 'Europa, Nordasien',
    de: 'Die Hänge-Birke ist ein Pionierbaum, der kahle Flächen als erste besiedelt. Ihre weisse Rinde reflektiert Sonnenlicht und schützt den Stamm vor Überhitzung. In Skandinavien gilt sie als heiliger Baum.',
    en: 'The Silver Birch is a pioneer tree, first to colonize bare ground. Its white bark reflects sunlight, protecting the trunk from overheating. In Scandinavia it is considered sacred.',
    maxAge: 120,
    seasons: {
      de: '🌿 Einer der ersten Laubbäume im Frühling (März) · 🌾 Kätzchenpollen März–April (Allergiker!) · ☀️ Leichter, tanzender Schatten · 🍂 Leuchtend gelb im Oktober',
      en: '🌿 One of the first deciduous trees in spring (March) · 🌾 Catkin pollen March–April (allergy alert!) · ☀️ Light, dancing shade · 🍂 Bright yellow in October',
    },
    ecology: {
      de: 'Birkenpollen ist einer der häufigsten Allergieauslöser im Frühling. Gleichzeitig ist die Birke Pionierbaum: Sie bereitet den Boden für andere Arten. Birkensaft wurde traditionell als Frühlingskur getrunken.',
      en: 'Birch pollen is one of the most common spring allergens. Yet birch is a pioneer species, preparing soil for others. Birch sap was traditionally drunk as a spring tonic.',
    },
  },
  'Gewöhnliche Esche': {
    family: 'Ölbaumgewächse (Oleaceae)',
    origin: 'Europa',
    de: 'Die Esche war in der nordischen Mythologie der Weltenbaum Yggdrasil. Heute ist sie durch das Eschentriebsterben bedroht — ein Pilz, der seit 2008 auch die Schweiz erreicht hat.',
    en: 'The Common Ash was Yggdrasil, the World Tree in Norse mythology. Today it is threatened by ash dieback — a fungal disease that reached Switzerland in 2008.',
    maxAge: 300,
    seasons: {
      de: '🌿 Sehr später Austrieb (Mai, einer der letzten) · 🍂 Einer der ersten Bäume mit Laubfall (Oktober) · ❄️ Markante schwarze Knospen im Winter · 🚁 Geflügelte Samen hängen in Büscheln',
      en: '🌿 Very late leaf-out (May, among the last) · 🍂 Among first trees to drop leaves (October) · ❄️ Distinctive black buds in winter · 🚁 Winged seeds hang in clusters',
    },
    ecology: {
      de: 'Eschenholz ist extrem elastisch — Werkzeugstiele, Sportgeräte und Wanderstöcke werden daraus gefertigt. Gimpel und Dompfaffen fressen die Samen. Das Eschentriebsterben bedroht derzeit den Bestand europaweit.',
      en: 'Ash wood is extremely elastic — used for tool handles, sports equipment, and walking sticks. Bullfinches feed on the seeds. Ash dieback disease currently threatens populations across Europe.',
    },
  },
  'Mädchenhaarbaum / Ginkgo': {
    family: 'Ginkgogewächse (Ginkgoaceae)',
    origin: 'China',
    de: 'Der Ginkgo ist ein «lebendes Fossil» — seine Art existiert seit 270 Millionen Jahren, älter als die Dinosaurier. Er überlebte sogar die Atombombe von Hiroshima: Sechs Ginkgos nahe dem Epizentrum trieben im Frühling 1946 wieder aus.',
    en: 'The Ginkgo is a "living fossil" — its species has existed for 270 million years, predating dinosaurs. It even survived the Hiroshima atomic bomb: six Ginkgos near ground zero sprouted again in spring 1946.',
    maxAge: 1000,
    seasons: {
      de: '🌿 Fächerförmige Blätter ab April · ☀️ Einzigartiges Laubwerk im Sommer · 🍂 Leuchtendes Goldgelb im November — fällt oft an einem einzigen Tag · ⚠️ Weibliche Bäume: übelriechende Früchte im Herbst',
      en: '🌿 Fan-shaped leaves from April · ☀️ Unique foliage in summer · 🍂 Luminous gold in November — often drops all leaves in a single day · ⚠️ Female trees: foul-smelling fruits in autumn',
    },
    ecology: {
      de: 'Weder Nadelbaum noch Laubbaum — der Ginkgo ist eine eigene Pflanzenklasse. Resistent gegen Schädlinge, Krankheiten und Luftverschmutzung. Ginkgo-Extrakt wird in der Medizin zur Gedächtnisförderung eingesetzt.',
      en: 'Neither conifer nor broadleaf — the Ginkgo is its own plant class. Resistant to pests, diseases, and air pollution. Ginkgo extract is used in medicine to support memory and circulation.',
    },
  },
  'Japanische Zelkove': {
    family: 'Ulmengewächse (Ulmaceae)',
    origin: 'Japan, Ostasien',
    de: 'Die Zelkove wird zunehmend als Stadtbaum gepflanzt, da sie resistent gegen die Ulmenkrankheit ist. In Japan werden aus ihrem harten Holz traditionell Tempel und Möbel gebaut.',
    en: 'The Japanese Zelkova is increasingly planted as an urban tree due to its resistance to Dutch elm disease. In Japan, its hard wood is traditionally used for temples and furniture.',
    maxAge: 300,
    seasons: {
      de: '🌿 Fein gezahnte Blätter ab April · ☀️ Vasenförmige Krone im Sommer · 🍂 Orange bis rostrot Oktober–November · ❄️ Elegante Wintersilhouette',
      en: '🌿 Finely toothed leaves from April · ☀️ Vase-shaped crown in summer · 🍂 Orange to russet October–November · ❄️ Elegant winter silhouette',
    },
    ecology: {
      de: 'Zukunftsbaum für den Klimawandel — verträgt Hitze und Trockenheit besser als die einheimische Ulme. Bietet Vögeln Nistplätze in der dichten Krone.',
      en: 'Climate-future tree — tolerates heat and drought better than native elms. Dense crown provides nesting sites for birds.',
    },
  },
  'Edel-Kastanie / Ess-Kastanie': {
    family: 'Buchengewächse (Fagaceae)',
    origin: 'Südeuropa, Kleinasien',
    de: 'Die Edelkastanie wurde von den Römern in die Schweiz gebracht. Ihre Früchte — die «Marroni» — waren jahrhundertelang Grundnahrungsmittel in den Alpentälern.',
    en: 'The Sweet Chestnut was brought to Switzerland by the Romans. Its nuts — "Marroni" — were a staple food in Alpine valleys for centuries.',
    maxAge: 500,
    seasons: {
      de: '🌿 Grosse gezahnte Blätter ab Mai · 🌼 Gelbliche Blütenkätzchen Juni–Juli (strenger Geruch) · 🌰 Marroni-Ernte Oktober · 🍂 Goldbraun im Herbst',
      en: '🌿 Large toothed leaves from May · 🌼 Yellow catkins June–July (pungent scent) · 🌰 Chestnut harvest October · 🍂 Golden-brown in autumn',
    },
    ecology: {
      de: 'Marroni vom Basler Herbstmäss! Die Früchte ernähren Eichhörnchen, Wildschweine und Menschen gleichermassen. Das Holz ist extrem dauerhaft und wird für Zäune, Fässer und Rebstöcke verwendet.',
      en: 'Roasted chestnuts from Basel\'s autumn fair! The nuts feed squirrels, wild boar, and humans alike. The wood is extremely durable, used for fences, barrels, and vine stakes.',
    },
  },
  'Kornelkirsche': {
    family: 'Hartriegelgewächse (Cornaceae)',
    origin: 'Südeuropa, Westasien',
    de: 'Die Kornelkirsche blüht bereits im Februar als einer der ersten Bäume. Ihre leuchtend roten Früchte sind essbar und wurden schon in der Antike zu Marmelade verarbeitet.',
    en: 'The Cornelian Cherry blooms as early as February, among the first trees to flower. Its bright red fruits are edible and have been made into jam since antiquity.',
    maxAge: 200,
    seasons: {
      de: '🌼 Leuchtend gelbe Blüten Februar–März (vor dem Laub!) · 🌿 Glänzendes Laub ab April · 🍒 Rote essbare Früchte August–September · 🍂 Rötliche Herbstfärbung',
      en: '🌼 Bright yellow flowers February–March (before leaves!) · 🌿 Glossy foliage from April · 🍒 Red edible fruits August–September · 🍂 Reddish autumn colour',
    },
    ecology: {
      de: 'Erste Nahrungsquelle für Bienen im Vorfrühling, wenn sonst noch nichts blüht. Die vitaminreichen Früchte werden zu Konfitüre, Likör und Fruchtleder verarbeitet. Beliebt auch bei Amseln und Drosseln.',
      en: 'First food source for bees in late winter when nothing else blooms. Vitamin-rich fruits are made into jam, liqueur, and fruit leather. Also popular with blackbirds and thrushes.',
    },
  },
  'Eisenholzbaum': {
    family: 'Zaubernussgewächse (Hamamelidaceae)',
    origin: 'Nordiran, Kaukasus',
    de: 'Das Holz des Eisenholzbaums ist so dicht, dass es im Wasser untergeht. Im Herbst zeigt er eine der spektakulärsten Laubfärbungen — von Gelb über Orange bis Tiefrot.',
    en: 'The Ironwood tree\'s timber is so dense it sinks in water. In autumn it produces one of the most spectacular foliage displays — from yellow through orange to deep crimson.',
    maxAge: 200,
    seasons: {
      de: '🌿 Glänzendes dunkelgrünes Laub ab April · ☀️ Breite, mehrstämmige Krone im Sommer · 🍂 SPEKTAKULÄR: Gelb → Orange → Scharlachrot → Violett (Oktober–November) · ❄️ Dekorative Rindenstruktur',
      en: '🌿 Glossy dark green leaves from April · ☀️ Broad, multi-stemmed crown in summer · 🍂 SPECTACULAR: Yellow → Orange → Scarlet → Violet (October–November) · ❄️ Decorative bark texture',
    },
    ecology: {
      de: 'Die Herbstfärbung des Eisenholzbaums gehört zu den schönsten aller Stadtbäume — ein lohnendes Fotomotiv im Oktober. Zunehmend als klimaresistenter Zukunftsbaum in Städten gepflanzt.',
      en: 'The Ironwood\'s autumn colour is among the most beautiful of any city tree — a rewarding photo subject in October. Increasingly planted as a climate-resilient future urban tree.',
    },
  },
};

/**
 * Get species info for a given German species name.
 * Returns null if no info available.
 */
export function getSpeciesInfo(baumart_deutsch) {
  if (!baumart_deutsch) return null;
  if (SPECIES_FACTS[baumart_deutsch]) return SPECIES_FACTS[baumart_deutsch];
  for (const key of Object.keys(SPECIES_FACTS)) {
    if (baumart_deutsch.startsWith(key)) return SPECIES_FACTS[key];
  }
  return null;
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
    let younger = 0;
    let total = 0;
    for (const f of features) {
      const age = f.properties?.ba_baumalter;
      if (age != null && age < 500) {
        total++;
        if (age < props.ba_baumalter) younger++;
      }
    }
    if (total > 0) {
      result.agePercentile = Math.round((younger / total) * 100);
    }
  }

  return result;
}
