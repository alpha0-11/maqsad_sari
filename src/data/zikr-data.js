// Authentic Islamic Zikrs and Duas Database
import { ALLAH_99_NAMES } from './names-of-allah.js';

export const ZIKR_CATEGORIES = [
  { id: 'all', name: "Barchasi" },
  { id: 'kundalik', name: "Kundalik Zikrlar" },
  { id: 'istigfor', name: "Istig'for & Tavba" },
  { id: 'salovat', name: "Salovatlar" },
  { id: 'fazilat', name: "Xazina Kalimalar" },
  { id: 'tonggi-kechki', name: "Tonggi & Kechki" }
];

// Special Sequential 99 Names Mode (Activated only via the top 'Allohning 99 Ismi' mode button)
export const ASMA_UL_HUSNA_SEQUENTIAL = {
  id: 'allah-99-names',
  arabic: 'أَسْمَاءُ اللَّهِ الْحُسْنَىٰ',
  transliteration: "Allohning 99 Go'zal Ismi (Ketma-ket)",
  meaning: "Har bir tasbeh donasi bosilganda 99 ism tartib bilan birma-bir o'zgaradi. Yodlash va qalbiy zikr uchun.",
  category: 'asma',
  target: 99,
  isAsmaUlHusna: true
};

// Core authentic sunnah zikrs (Pure zikrs only - no scattered 99 names)
export const INITIAL_ZIKRS = [
  {
    id: 'astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirulloh',
    meaning: 'Allohdan magʻfirat va gunohlarimni kechirishini soʻrayman',
    category: 'istigfor',
    target: 100
  },
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subhanalloh',
    meaning: 'Alloh barcha ayb-nuqsonlardan pok va munazzahdir',
    category: 'kundalik',
    target: 33
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    meaning: 'Hamd va shukr faqat olamlarning Robbi boʻlgan Allohgadir',
    category: 'kundalik',
    target: 33
  },
  {
    id: 'allahu-akbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allohu Akbar',
    meaning: 'Alloh har bir narsadan ulugʻ va buyukdir',
    category: 'kundalik',
    target: 33
  },
  {
    id: 'la-ilaha-illallah',
    arabic: 'لَا إِلٰهَ إِلَّا اللَّهُ',
    transliteration: 'La ilaha illalloh',
    meaning: 'Allohdan oʻzga ibodatga loyiq haqiqiy iloh yoʻqdir',
    category: 'fazilat',
    target: 100
  },
  {
    id: 'subhanallahi-wa-bihamdihi',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    transliteration: "Subhanallohi va bihamdihi, Subhanallohil 'Aziym",
    meaning: 'Allohni hamd aytib poklayman, Buyuk Alloh barcha nuqsondan pokdir',
    category: 'fazilat',
    target: 100
  },
  {
    id: 'salavat-ibrahim',
    arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ',
    transliteration: "Allohumma solli 'ala Muhammadin va 'ala ali Muhammad",
    meaning: 'Yo Alloh! Muhammad alayhissalomga va ularning oilasiga oʻzing salovot va rahmat yogʻdirgin',
    category: 'salovat',
    target: 100
  },
  {
    id: 'sayyidul-istighfar',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: "Sayyidul Istig'for (Allohumma anta Robbiy...)",
    meaning: "Yo Alloh, Sen mening Robbimsan, Sendan boshqa iloh yo'q. Meni yaratding va men Sening qulingman...",
    category: 'tonggi-kechki',
    target: 3
  },
  {
    id: 'la-hawla',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ',
    transliteration: "La havla va la quvvata illa billahil 'Aliyyil 'Aziym",
    meaning: 'Gunohtan saqlanish va toatga kuch-quvvat faqatgina Buyuk va Oliy Allohdandir',
    category: 'fazilat',
    target: 100
  },
  {
    id: 'hasbunallah',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    transliteration: "Hasbunallohu va ni'mal vakil",
    meaning: 'Bizga Allohning Oʻzi kifoyadir va U qanday ham goʻzal vasiy (himoyachi)!',
    category: 'fazilat',
    target: 100
  },
  {
    id: 'la-ilaha-illa-anta-subhanaka',
    arabic: 'لَا إِلٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    transliteration: "La ilaha illa anta subhanaka inniy kuntu minaz-zolimiyn",
    meaning: 'Sendan oʻzga iloh yoʻqdir. Sen barcha nuqsondan poksan! Men oʻzimga zulm qiluvchilardan boʻldim (Yunus a.s. duosi)',
    category: 'istigfor',
    target: 100
  },
  {
    id: 'bismillahillazi',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: "Bismillahillazi la yadurru ma'asmihi shay'un fil ardi va la fis-sama'i va huvas-samiy'ul 'aliym",
    meaning: "Allohning ismi bilan boshlaymanki, Uning ismi bilan yeru osmonda hech bir narsa zarar yetkaza olmaydi. U Eshituvchi va Biluvchidir",
    category: 'tonggi-kechki',
    target: 3
  },
  {
    id: 'robbana-atina',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration: "Robbana atina fid-dunya hasanatan va fil axiroti hasanatan va qina 'azaban-nar",
    meaning: 'Ey Robbimiz! Bizga dunyoda ham, oxiratda ham yaxshilik bergin va bizni doʻzax azobidan asragin',
    category: 'kundalik',
    target: 33
  }
];

export { ALLAH_99_NAMES };
