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
  },
  'Gewöhnliche Platane': {
    family: 'Platanengewächse (Platanaceae)',
    origin: 'Südosteuropa, Westasien',
    de: 'Die Platane ist der klassische europäische Alleebaum. Ihre markante Borke blättert in Puzzlestücken ab und gibt dem Stamm sein charakteristisches Tarnmuster. Sie kann über 300 Jahre alt werden.',
    en: 'The London Plane is the classic European avenue tree. Its bark peels off in jigsaw-like patches, giving the trunk its distinctive camouflage pattern. It can live over 300 years.',
    maxAge: 400,
  },
  'Platane': {
    family: 'Platanengewächse (Platanaceae)',
    origin: 'Hybride (London Plane)',
    de: 'Die Platane ist der klassische europäische Alleebaum. Ihre markante Borke blättert in Puzzlestücken ab und gibt dem Stamm sein charakteristisches Tarnmuster.',
    en: 'The Plane tree is the classic European avenue tree. Its bark peels in jigsaw-like patches, creating a distinctive camouflage pattern.',
    maxAge: 400,
  },
  'Gemeine Rosskastanie': {
    family: 'Seifenbaumgewächse (Sapindaceae)',
    origin: 'Balkanhalbinsel',
    de: 'Die Rosskastanie stammt ursprünglich aus dem Balkan und kam im 16. Jahrhundert nach Mitteleuropa. Ihre «Kastanien» sind nicht essbar, dienten aber historisch als Pferdefutter — daher der Name.',
    en: 'The Horse Chestnut originates from the Balkans and arrived in Central Europe in the 16th century. Its conkers are inedible but were historically used as horse feed — hence the name.',
    maxAge: 300,
  },
  'Spitz-Ahorn': {
    family: 'Seifenbaumgewächse (Sapindaceae)',
    origin: 'Europa, Westasien',
    de: 'Der Spitz-Ahorn ist einer der häufigsten einheimischen Laubbäume. Im Herbst färbt sich sein Laub leuchtend gelb bis orange. Sein geflügelter Samen dreht sich wie ein Propeller zu Boden.',
    en: 'The Norway Maple is one of the most common native deciduous trees. In autumn its leaves turn vivid yellow to orange. Its winged seeds spin like helicopters as they fall.',
    maxAge: 200,
  },
  'Sommer-Linde': {
    family: 'Lindengewächse (Tiliaceae)',
    origin: 'Europa',
    de: 'Die Sommer-Linde kann über 1000 Jahre alt werden. In Basel steht das älteste Exemplar am Münsterplatz — eine über 260-jährige Zeugin der Stadtgeschichte. Unter Linden wurde traditionell Recht gesprochen.',
    en: 'The Large-leaved Linden can live over 1000 years. Basel\'s oldest stands at Münsterplatz — a 260+ year-old witness to city history. Courts were traditionally held under linden trees.',
    maxAge: 1000,
  },
  'Winter-Linde': {
    family: 'Lindengewächse (Tiliaceae)',
    origin: 'Europa',
    de: 'Die Winter-Linde unterscheidet sich von der Sommer-Linde durch kleinere Blätter und spätere Blüte. Sie ist der Nationalbaum Tschechiens und war in der germanischen Mythologie der Baum der Freya.',
    en: 'The Small-leaved Linden differs from its large-leaved cousin by smaller leaves and later flowering. It\'s the national tree of Czechia and was sacred to Freya in Germanic mythology.',
    maxAge: 800,
  },
  'Rot-Buche': {
    family: 'Buchengewächse (Fagaceae)',
    origin: 'Europa',
    de: 'Die Rotbuche ist der häufigste Laubbaum in Schweizer Wäldern. Ihr Name bezieht sich auf die rötliche Holzfarbe, nicht auf die Blätter. Aus Buchenholz wurden die ersten Buchstaben geschnitzt — daher «Buch» und «Buchstabe».',
    en: 'The European Beech is the most common deciduous tree in Swiss forests. Its name refers to its reddish wood, not its leaves. The first letters were carved from beech wood — the German word "Buchstabe" (letter) derives from "Buche" (beech).',
    maxAge: 400,
  },
  'Stiel-Eiche': {
    family: 'Buchengewächse (Fagaceae)',
    origin: 'Europa',
    de: 'Die Stiel-Eiche kann über 800 Jahre alt werden und ist ein Symbol für Kraft und Beständigkeit. Eine einzelne Eiche kann bis zu 500\'000 Insektenarten beherbergen — mehr als jeder andere einheimische Baum.',
    en: 'The Pedunculate Oak can live over 800 years and symbolizes strength and endurance. A single oak can host up to 500,000 insect species — more than any other native tree.',
    maxAge: 800,
  },
  'Hänge-Birke': {
    family: 'Birkengewächse (Betulaceae)',
    origin: 'Europa, Nordasien',
    de: 'Die Hänge-Birke ist ein Pionierbaum, der kahle Flächen als erste besiedelt. Ihre weisse Rinde reflektiert Sonnenlicht und schützt den Stamm vor Überhitzung. In Skandinavien gilt sie als heiliger Baum.',
    en: 'The Silver Birch is a pioneer tree, first to colonize bare ground. Its white bark reflects sunlight, protecting the trunk from overheating. In Scandinavia it is considered sacred.',
    maxAge: 120,
  },
  'Gewöhnliche Esche': {
    family: 'Ölbaumgewächse (Oleaceae)',
    origin: 'Europa',
    de: 'Die Esche war in der nordischen Mythologie der Weltenbaum Yggdrasil. Heute ist sie durch das Eschentriebsterben bedroht — ein Pilz, der seit 2008 auch die Schweiz erreicht hat.',
    en: 'The Common Ash was Yggdrasil, the World Tree in Norse mythology. Today it is threatened by ash dieback — a fungal disease that reached Switzerland in 2008.',
    maxAge: 300,
  },
  'Mädchenhaarbaum / Ginkgo': {
    family: 'Ginkgogewächse (Ginkgoaceae)',
    origin: 'China',
    de: 'Der Ginkgo ist ein «lebendes Fossil» — seine Art existiert seit 270 Millionen Jahren, älter als die Dinosaurier. Er überlebte sogar die Atombombe von Hiroshima: Sechs Ginkgos nahe dem Epizentrum trieben im Frühling 1946 wieder aus.',
    en: 'The Ginkgo is a "living fossil" — its species has existed for 270 million years, predating dinosaurs. It even survived the Hiroshima atomic bomb: six Ginkgos near ground zero sprouted again in spring 1946.',
    maxAge: 1000,
  },
  'Japanische Zelkove': {
    family: 'Ulmengewächse (Ulmaceae)',
    origin: 'Japan, Ostasien',
    de: 'Die Zelkove wird zunehmend als Stadtbaum gepflanzt, da sie resistent gegen die Ulmenkrankheit ist. In Japan werden aus ihrem harten Holz traditionell Tempel und Möbel gebaut.',
    en: 'The Japanese Zelkova is increasingly planted as an urban tree due to its resistance to Dutch elm disease. In Japan, its hard wood is traditionally used for temples and furniture.',
    maxAge: 300,
  },
  'Edel-Kastanie / Ess-Kastanie': {
    family: 'Buchengewächse (Fagaceae)',
    origin: 'Südeuropa, Kleinasien',
    de: 'Die Edelkastanie wurde von den Römern in die Schweiz gebracht. Ihre Früchte — die «Marroni» — waren jahrhundertelang Grundnahrungsmittel in den Alpentälern.',
    en: 'The Sweet Chestnut was brought to Switzerland by the Romans. Its nuts — "Marroni" — were a staple food in Alpine valleys for centuries.',
    maxAge: 500,
  },
  'Kornelkirsche': {
    family: 'Hartriegelgewächse (Cornaceae)',
    origin: 'Südeuropa, Westasien',
    de: 'Die Kornelkirsche blüht bereits im Februar als einer der ersten Bäume. Ihre leuchtend roten Früchte sind essbar und wurden schon in der Antike zu Marmelade verarbeitet.',
    en: 'The Cornelian Cherry blooms as early as February, among the first trees to flower. Its bright red fruits are edible and have been made into jam since antiquity.',
    maxAge: 200,
  },
  'Eisenholzbaum': {
    family: 'Zaubernussgewächse (Hamamelidaceae)',
    origin: 'Nordiran, Kaukasus',
    de: 'Das Holz des Eisenholzbaums ist so dicht, dass es im Wasser untergeht. Im Herbst zeigt er eine der spektakulärsten Laubfärbungen — von Gelb über Orange bis Tiefrot.',
    en: 'The Ironwood tree\'s timber is so dense it sinks in water. In autumn it produces one of the most spectacular foliage displays — from yellow through orange to deep crimson.',
    maxAge: 200,
  },
};

/**
 * Get species info for a given German species name.
 * Returns null if no info available.
 */
export function getSpeciesInfo(baumart_deutsch) {
  if (!baumart_deutsch) return null;
  // Direct match
  if (SPECIES_FACTS[baumart_deutsch]) return SPECIES_FACTS[baumart_deutsch];
  // Partial match — handle variants like 'Spitz-Ahorn "Crimson King"'
  for (const key of Object.keys(SPECIES_FACTS)) {
    if (baumart_deutsch.startsWith(key)) return SPECIES_FACTS[key];
  }
  return null;
}

/**
 * Compute contextual stats for a tree relative to the dataset.
 * Returns { speciesCount, speciesRank, agePercentile }
 */
export function computeTreeContext(state, feature) {
  const features = state.treeData?.features;
  if (!features) return null;

  const props = feature.properties ?? {};
  const result = {};

  // How many of this species in Basel?
  if (props.baumart_deutsch) {
    let count = 0;
    for (const f of features) {
      if (f.properties?.baumart_deutsch === props.baumart_deutsch) count++;
    }
    result.speciesCount = count;

    // Rank: is this a common or rare species?
    if (count <= 3) result.rarity = 'unique';
    else if (count <= 20) result.rarity = 'rare';
    else if (count <= 100) result.rarity = 'uncommon';
    else result.rarity = 'common';
  }

  // Age percentile
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
