'use client';

import MainLayout from '@/components/layout/MainLayout';
import QuranView from '@/components/quran-view/QuranView';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

// List of available English translations
const ENGLISH_TRANSLATIONS = [
  { id: 'en.sahih', name: 'Sahih International' },
  { id: 'en.yusufali', name: 'Yusuf Ali' },
  { id: 'en.pickthall', name: 'Pickthall' },
  { id: 'en.itani', name: 'Clear Quran (Talal Itani)' },
  { id: 'en.hilali', name: 'Hilali & Khan' },
  { id: 'en.asad', name: 'Muhammad Asad' }
];

export default function Home() {
  const [showFullText, setShowFullText] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [selectedTranslation, setSelectedTranslation] = useState(ENGLISH_TRANSLATIONS[0].id);
  const [selectedSurahId, setSelectedSurahId] = useState(2);

  // Refs for animations
  const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const surahSectionRef = useRef<HTMLDivElement>(null);

  // Handle translation change
  const handleTranslationChange = (translationId: string) => {
    setSelectedTranslation(translationId);
  };

  // Handle surah selection
  const handleSurahSelect = (surahId: number) => {
    setSelectedSurahId(surahId);
  };

  // Define the styles for custom animations
  const customStyles = `
    @keyframes pulse-subtle {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }
    .animate-pulse-subtle {
      animation: pulse-subtle 2s infinite ease-in-out;
    }
    .text-shadow-glow {
      text-shadow: 0 0 8px rgba(167, 139, 250, 0.6), 0 0 12px rgba(167, 139, 250, 0.4);
    }
  `;
  
  // Surah Al-Fatihah description
  const fatihahText = `Al-Fatihah serves as the opening chapter of the Quran and is often referred to as the 'Essence of the Book'. It consists of seven verses that are a prayer for guidance, lordship, and mercy. This Surah is a direct conversation between the believer and Allah, emphasizing the servitude to Allah alone. The chapter not only sets the tone for the entire Quran but also outlines the relationship between the creator and his creations. It is recited in every unit of the Muslim prayer, underscoring its importance in Islamic worship. Al-Fatihah is a plea for guidance along the straight path, reflecting the human yearning for righteousness in a world filled with choices.`;
  
  // Surah Al-Baqarah description
  const baqarahText = `Al-Baqarah is the longest Surah and dives deep into the legal and moral framework of Islam. It covers various aspects of life and afterlife, law, guidance, and prayer. The chapter begins with the declaration of the Quran as a clear book of guidance and ends with a powerful prayer. It discusses the story of Adam, the virtue of Abraham, and the history of the Israelites. The Surah addresses the change of the Qibla, fasting during Ramadan, and the importance of Hajj. It also elaborates on financial transactions, marital relations, and dietary laws. Al-Baqarah aims to prepare the believers for a community life under the guidance of Allah, emphasizing obedience, patience, and consistency in faith.`;

  // Surah Aal-E-Imran description
  const imranText = `This Surah focuses on the unity of faith and the importance of patience and perseverance in the face of adversity. It recounts the stories of several prophets to illustrate moral and spiritual lessons. Aal-E-Imran reinforces the concepts of divine guidance through revelations and the continuity of the message through different prophets. It addresses the Christian community, clarifying the status of Jesus and emphasizing the unity of the message of all prophets. The chapter also discusses the Battle of Uhud, providing directives on handling defeat and the importance of unity. It ends with an affirmation of Allah's sovereignty and the ultimate return to Him, urging believers to steadfastly adhere to righteousness.`;

  // Surah An-Nisa description
  const nisaText = `An-Nisa deals extensively with the rights and responsibilities of women, family life, and social justice. It outlines laws regarding marriage, inheritance, and treatment of orphans and women. The Surah addresses the need for fairness and kindness within the family and community, condemning hypocrisy and injustice. It also discusses the punishments for various crimes, emphasizing the moral and legal order that should prevail in a Muslim society. An-Nisa calls for the protection of the vulnerable and encourages believers to live in piety and mutual respect. The chapter reinforces the importance of strong familial bonds and equitable treatment, serving as a guide for building a compassionate and just society.`;

  // Surah Al-Ma'idah description
  const maidahText = `Al-Ma'idah concludes several legal issues and cements the ordinances of food, punishment, and piety. It recounts the story of the disciples of Jesus who asked for a table spread from heaven, symbolizing Allah's bounty and the importance of faith. The Surah lays down guidelines for cleanliness, dietary restrictions, and the conduct of war. It addresses the sanctity of life and property, urging justice even against one's kin or oneself. Al-Ma'idah also discusses the fulfillment of oaths and the consequences of breaking them. The chapter is a call to fulfill commitments to Allah and to ensure communal harmony through justice and piety.`;

  // Surah Al-An'am description
  const anamText = `Al-An'am is a Meccan Surah that focuses on the fundamental aspects of monotheism and the rejection of idolatry. It challenges the pagans' beliefs and practices, providing rational arguments against polytheism. The chapter emphasizes the signs of Allah in the natural world, encouraging reflection and understanding of the divine order. It recounts the stories of past prophets who faced rejection and persecution, drawing parallels to Muhammad's own experiences. Al-An'am calls for patience and perseverance in the face of ridicule and opposition, reinforcing the message of trust in Allah's wisdom and timing. The Surah serves as a reminder of the consequences of denying the truth and the ultimate accountability in the hereafter.`;

  // Surah Al-A'raf description
  const arafText = `Al-A'raf describes the Day of Judgment and the scenes of heaven and hell, where people will be divided based on their deeds. The chapter narrates stories of various prophets, including Adam, Noah, Hud, Salih, Lot, and Shuaib, illustrating the theme of divine guidance and human folly. It emphasizes the importance of adhering to Allah's commands and the dangers of straying from the path. Al-A'raf also addresses the arguments between the residents of heaven and hell, providing a vivid portrayal of the consequences of one's choices. The Surah calls for reflection on one's actions and the constant need for repentance and seeking Allah's mercy.`;

  // Surah Al-Anfal description
  const anfalText = `Al-Anfal deals with the issues related to the Battle of Badr, where Muslims achieved a significant victory. The Surah provides guidelines on the conduct of war, the treatment of prisoners, and the distribution of spoils. It emphasizes the role of faith and reliance on Allah in achieving victory against odds. Al-Anfal also discusses the characteristics of true believers and the importance of obedience to Allah and His Messenger. The chapter serves as a moral and spiritual boost for Muslims, reinforcing the values of justice, gratitude, and humility in victory.`;

  // Surah At-Tawbah description
  const tawbahText = `At-Tawbah is a Medinan Surah that discusses the obligations of Muslims towards their community and the consequences of hypocrisy. It declares the dissolution of treaty obligations with the pagans who repeatedly breached their agreements. The chapter emphasizes the need for repentance and the importance of striving in the path of Allah. It criticizes the hypocrites within the Muslim community, urging a clear distinction between true believers and those who undermine the community's faith and unity. At-Tawbah calls for vigilance, perseverance in faith, and active participation in safeguarding the community's interests.`;

  // Surah Yunus description
  const yunusText = `Yunus is a Meccan Surah that focuses on the themes of prophethood, revelation, and resurrection. It recounts the story of Prophet Jonah and his people, drawing lessons about patience, the impact of ignoring divine guidance, and the mercy of Allah. The chapter challenges the disbelievers' skepticism about the Quran and the hereafter, providing arguments for the truth of the revelation. Yunus emphasizes the consistency of the message delivered by all prophets and the importance of recognizing and responding to the signs of Allah. The Surah reassures the believers of Allah's support and guidance, urging them to remain steadfast and hopeful.`;

  // Surah Hud description
  const hudText = `Hud elaborates on the stories of several prophets, including Noah, Hud, Salih, Abraham, Lot, Shuaib, and Moses, highlighting the themes of faith, repentance, and divine retribution. The chapter emphasizes the consequences of denying Allah's signs and the inevitable justice that befalls tyrannical people. Hud serves as a warning to the disbelievers and a reminder of the mercy available to those who turn back to Allah. The Surah reinforces the importance of patience and trust in Allah's plan, encouraging believers to maintain their integrity and faith amidst adversity.`;

  // Surah Yusuf description
  const yusufText = `Yusuf is a unique Surah that narrates the story of Prophet Joseph in a detailed and vivid manner. It explores themes of betrayal, patience, divine providence, and forgiveness. The chapter illustrates how Joseph's faith in Allah guided him through betrayal by his brothers, temptation, imprisonment, and eventual rise to power in Egypt. Yusuf highlights the moral and spiritual strength that comes from steadfast faith and trust in Allah's plan. The Surah is a testament to the triumph of the spirit over adversity and the ultimate justice of Allah.`;

  // Surah Ar-Ra'd description
  const radText = `Ar-Ra'd focuses on the revelation of the Quran and the response of the people to it. The chapter discusses the signs of Allah in the natural world and the human reluctance to accept the truth. It emphasizes the role of the prophets in delivering Allah's message and the consequences of rejecting it. Ar-Ra'd also addresses the attributes of Allah, such as His wisdom, justice, and mercy. The Surah calls for reflection on one's relationship with the creator and the creation, urging a life of righteousness and consciousness of the hereafter.`;

  // Surah Ibrahim description
  const ibrahimText = `Ibrahim recounts the story of Prophet Abraham and his unwavering commitment to monotheism. The chapter highlights his confrontation with his father and his people who were staunch idolaters. Ibrahim emphasizes the importance of using reason and wisdom in inviting people to the truth. The Surah also discusses the revelations given to Moses and the lessons to be learned from the history of previous nations. Ibrahim serves as an inspiration for patience and perseverance in the face of opposition and a reminder of the rewards for those who remain steadfast in their faith.`;

  // Surah Al-Hijr description
  const hijrText = `Al-Hijr discusses the stories of previous prophets and their communities, including the people of Al-Hijr who rejected the prophets and faced consequences. The chapter emphasizes the protection granted to the Quran from corruption and the importance of patience in the face of denial and mockery. Al-Hijr also addresses the creation of Adam and the refusal of Iblis to bow to him, highlighting the themes of obedience and arrogance. The Surah reassures the Prophet Muhammad of Allah's support against the ridicule of the disbelievers, urging him to continue delivering the message with perseverance.`;

  // Surah An-Nahl description
  const nahlText = `An-Nahl delves into the blessings and signs of Allah, such as the creation of the heavens and the earth, the diversity of flora and fauna, and the cycles of day and night. The chapter uses the metaphor of the bee to illustrate the concept of revelation and the industrious nature of a believer's life. An-Nahl also discusses the dietary laws, the prohibition of alcohol, and the importance of justice in trade. The Surah encourages gratitude towards Allah for His countless blessings and warns against idolatry and ingratitude.`;

  // Surah Al-Isra description
  const israText = `Al-Isra begins with the miraculous night journey of the Prophet Muhammad from Mecca to Jerusalem and his ascension to the heavens. The chapter discusses the Children of Israel and the trials they faced due to their disobedience. Al-Isra emphasizes the sanctity of life and property, the importance of prayer, and the need for humility and kindness. The Surah also addresses the gradual revelation of the Quran and the objections raised by the disbelievers. Al-Isra serves as a reminder of Allah's mercy and the ultimate accountability in the hereafter.`;

  // Surah Al-Kahf description
  const kahfText = `Al-Kahf narrates four main stories: the People of the Cave, the owner of the two gardens, Prophet Moses' journey with Khidr, and Dhul-Qarnayn's travels. The chapter emphasizes the themes of faith, patience, divine wisdom, and the transient nature of worldly wealth. Al-Kahf serves as a spiritual and moral guide, particularly recommending the recitation of the Surah on Fridays for protection against the trials of life and the deceptions of the Antichrist. The Surah encourages reflection on one's blessings and the mysterious ways in which Allah imparts lessons through life's trials.`;

  // Surah Maryam description
  const maryamText = `Maryam is a unique Surah that highlights the story of Mary, the mother of Jesus, and the miraculous birth of Jesus without a father. The chapter also recounts the stories of other prophets, such as Abraham, Moses, and Ishmael, emphasizing the continuity of the message of monotheism. Maryam addresses the misconceptions about Jesus and Mary and clarifies their human status, urging Christians to adhere to monotheism. The Surah is a call to recognize and respect the miracles of Allah while maintaining the core belief in His oneness.`;

  // Surah Ta-Ha description
  const tahaText = `Ta-Ha focuses on the life and mission of Prophet Moses, including his prophethood, the challenges he faced with Pharaoh, and the guidance he received from Allah. The chapter emphasizes the importance of prayer, patience, and reliance on Allah during hardships. Ta-Ha also discusses the responsibilities of the Prophet Muhammad and the objections raised by the disbelievers of Mecca. The Surah serves as a reminder of the power of Allah, the reality of the hereafter, and the importance of following divine guidance without despair.`;

  // Surah Al-Anbiya description
  const anbiyaText = `Al-Anbiya recounts the stories of several prophets, including Abraham, Lot, Noah, David, Solomon, Job, and others. Each story highlights the trials faced by the prophets and their ultimate reliance on Allah's mercy and guidance. The chapter emphasizes the universality of the message of monotheism and the recurring theme of communities facing consequences for their disbelief. Al-Anbiya serves as a reminder of the moral and spiritual resilience required to uphold the truth and the transient nature of worldly power and wealth.`;

  // Surah Al-Hajj description
  const hajjText = `Al-Hajj discusses the rites of the Islamic pilgrimage to Mecca and the spiritual and social significance of the rituals associated with Hajj. The chapter emphasizes the unity of believers during the pilgrimage and the remembrance of Allah's favors. Al-Hajj also addresses the afterlife, resurrection, and the ultimate judgment of humanity. The Surah calls for a strong faith, patience in adversity, and a steadfast commitment to justice and righteousness. Al-Hajj serves as a reminder of the spiritual journey of life and the preparation for the hereafter.`;

  // Surah Al-Muminun description
  const muminunText = `Al-Mu'minun begins with the characteristics of successful believers, emphasizing traits such as humility, chastity, and honesty. The chapter recounts the stories of several prophets to illustrate the challenges of upholding the truth and the importance of resilience. Al-Mu'minun also discusses the creation of humans, the stages of human life, and the signs of Allah in the natural world. The Surah serves as a moral compass, guiding believers towards righteousness and warning against the distractions and temptations of worldly life.`;

  // Surah An-Nur description
  const nurText = `An-Nur sets forth guidelines for social behavior and interaction within the Muslim community, including rules regarding modesty, chastity, and accusations of adultery. The chapter uses the metaphor of light to describe the illuminating guidance of Allah and the clear path of righteousness. An-Nur addresses the incident of the false accusation against Aisha, the wife of the Prophet Muhammad, and the revelations that established her innocence. The Surah emphasizes the importance of purity, both physical and moral, and the consequences of slander and false accusations.`;

  // Surah Al-Furqan description
  const furqanText = `Al-Furqan defines the Quran as the criterion for judging right from wrong and discusses the resistance faced by prophets when delivering their messages. The chapter criticizes the materialistic attitudes of the disbelievers and their demand for miracles as proof of prophethood. Al-Furqan emphasizes the blessings of Allah, such as rain and vegetation, and the balance He maintains in the natural world. The Surah calls for reflection on one's purpose in life and the pursuit of righteousness, guided by the Quran as the ultimate criterion.`;

  // Surah Ash-Shuara description
  const shuaraText = `Ash-Shu'ara presents the stories of various prophets, including Moses, Abraham, Noah, Hud, Salih, Lot, and Shuaib, who all faced rejection from their communities. The chapter is named after the poets, who are criticized for misleading their followers with frivolous and deceitful poetry. Ash-Shu'ara emphasizes the role of the Quran as a clear and truthful message in contrast to the ambiguous and deceptive words of the poets. The Surah serves as a warning against the allure of eloquent but misleading rhetoric and the importance of adhering to the divine truth.`;

  // Surah An-Naml description
  const namlText = `An-Naml is known for the story of Solomon and the Queen of Sheba, which highlights themes of leadership, wisdom, and the recognition of Allah's power. The chapter also includes the account of the prophet Salih and the miraculous speaking ant, emphasizing Allah's control over all creatures. An-Naml discusses the blessings of knowledge and the responsibility that comes with it. The Surah encourages gratitude for Allah's favors and warns against arrogance and disbelief, urging a humble submission to Allah's will.`;

  // Surah Al-Qasas description
  const qasasText = `Al-Qasas recounts the life of Moses from his infancy to his prophethood, focusing on his escape from Egypt, his years in Midian, and his return to confront Pharaoh. The chapter draws lessons from the rise and fall of nations and emphasizes the importance of trusting Allah's plan. Al-Qasas also discusses the story of Qarun, a wealthy but arrogant man from the community of Moses, who was punished for his pride and denial of Allah's favors. The Surah serves as a reminder of the transient nature of worldly wealth and the enduring value of piety and humility.`;

  // Surah Al-Ankabut description
  const ankabutText = `Al-Ankabut uses the metaphor of the spider's web to illustrate the fragility of taking protectors other than Allah. The chapter discusses the trials and tests faced by believers and the steadfastness required to overcome them. Al-Ankabut recounts the stories of Noah, Abraham, Lot, and other prophets who endured hardships for their faith. The Surah emphasizes the importance of patience, the rejection of false gods, and the ultimate triumph of truth over falsehood. Al-Ankabut serves as a moral and spiritual guide for believers facing challenges in their faith journey.`;

  // Surah Ar-Rum description
  const rumText = `Ar-Rum refers to the historical victory of the Byzantine Empire over the Persians, which was predicted in the Quran. The chapter discusses the rise and fall of civilizations and the divine wisdom behind the events of history. Ar-Rum emphasizes the signs of Allah in the creation of the human being, the heavens, and the earth. The Surah calls for reflection on the purpose of life and the inevitability of the hereafter. Ar-Rum serves as a reminder of Allah's control over history and the importance of faith in the face of changing fortunes.`;

  // Surah Luqman description
  const luqmanText = `Luqman focuses on the wise advice given by Luqman to his son, emphasizing the importance of monotheism, gratitude, humility, patience, and consistent prayer. The chapter highlights the value of wisdom and the responsibility to convey it in a gentle and persuasive manner. Luqman also discusses the distractions of worldly life and the critical need to focus on the hereafter. The Surah serves as a guide for personal conduct and the nurturing of familial relationships based on faith and wisdom.`;

  // Surah As-Sajdah description
  const sajdahText = `As-Sajdah, also known as "The Prostration," delves into the creation of humanity, the universe, and the spiritual purpose behind it. It emphasizes the transient nature of life on Earth compared to the eternal life of the hereafter. This Surah invites believers to reflect on the signs of Allah in the universe and within themselves, urging a contemplation that leads to prostration in awe of the Creator. It warns of the consequences of ignoring divine guidance and the fate awaiting disbelievers, contrasting it with the rewards for the righteous. The Surah encapsulates the essence of human existential purpose and the ultimate return to the Creator.`;

  // Surah Al-Ahzab description
  const ahzabText = `Al-Ahzab, or "The Confederates," discusses the events surrounding the Battle of the Trench, where Muslim defenders of Medina faced a large confederate army. This Surah addresses various social issues, including the treatment of orphans and women, and the responsibilities of the Prophet Muhammad as a husband and leader. It reinforces the moral and ethical boundaries set by Allah, particularly in personal conduct and community relations. The Surah also touches on the importance of obeying divine commandments and the consequences of betrayal and hypocrisy within the community. It serves as a reminder of Allah's protection over the believers during times of trial and adversity.`;

  // Surah Saba description
  const sabaText = `Saba, named after the ancient kingdom of Sheba, explores themes of gratitude towards Allah and the impermanence of worldly power. It recounts the story of the Queen of Sheba and her encounter with Prophet Solomon, highlighting the signs of Allah in Solomon's kingdom and the ultimate submission of the Queen to monotheism. The Surah warns against arrogance and the rejection of prophets, illustrating how previous nations suffered when they turned away from divine guidance. It emphasizes that all blessings and trials are tests from Allah, and that true success lies in recognizing and being grateful for these signs.`;

  // Surah Fatir description
  const fatirText = `Fatir, meaning "The Originator," celebrates Allah's creation and command over the heavens and the earth. It elaborates on the angels' roles as messengers and executors of divine will, contrasting the unseen support they provide with the visible support humans offer each other. This Surah encourages mindfulness of Allah's continuous blessings and the subtle ways He facilitates the believers' lives. It warns against the seduction of Satan and the peril of following one's desires without guidance. Fatir calls for a balance between fear and hope in Allah's mercy, urging believers to strive for a righteous path that leads to paradise.`;

  // Surah Ya-Sin description
  const yasinText = `Ya-Sin is often referred to as the "heart of the Quran" and focuses on the Quran's divine origin, the resurrection, and the affirmation of Prophet Muhammad's prophethood. It narrates several parables to illustrate the fate of those who reject Allah's signs and messengers. The Surah provides comforting assurance to the Prophet and the believers about the truth of their message and the ultimate victory of faith. It serves as a stark reminder of the transient nature of life and the suddenness of the Day of Judgment, urging immediate and sincere submission to Allah's will.`;

  // Surah As-Saffat description
  const saffatText = `As-Saffat, "Those who set the Ranks," describes the angels who arrange themselves in ranks and those who drive away evil by the permission of their Lord. This Surah recounts stories of various prophets to draw lessons about steadfastness, patience, and the triumph of faith. It emphasizes the unity of the message across different prophets and reassures the believers of support from the unseen realm. The Surah vividly portrays scenes from the Day of Judgment, reminding humans of the inevitable accountability and the stark differences between the destinies of the righteous and the wrongdoers.`;

  // Surah Sad description
  const sadText = `Named after the Arabic letter 'Sad', this Surah begins with a reaffirmation of the Quran's authenticity and the Prophet's mission. It addresses the objections raised by the disbelievers about the revelations and the concept of resurrection. Through narratives about prophets David, Solomon, Job, and others, it illustrates the moral and spiritual struggles they endured and their ultimate reliance on Allah's mercy. The Surah warns against the dangers of power and wealth leading to arrogance and disobedience, emphasizing that true success lies in humility and devotion to Allah.`;

  // Surah Az-Zumar description
  const zumarText = `Az-Zumar, "The Groups," discusses the throngs of people who will be driven to the Final Judgment in distinct groups based on their adherence to monotheism or their rejection of it. This Surah elaborates on the folly of idolatry and the purity of divine worship, urging an undivided devotion to Allah alone. It contrasts the fates awaiting the believers and the disbelievers, using powerful imagery to describe the horrors of Hell and the tranquility of Paradise. The Surah calls for patience, consistency in worship, and trust in Allah's unfailing justice.`;

  // Surah Ghafir description
  const ghafirText = `Ghafir, also known as "The Forgiver," highlights Allah's boundless mercy and the human tendency to reject His signs. It narrates the story of a believing man from Pharaoh's court who warns his people of the consequences of sin and the rejection of prophets. The Surah discusses the arguments between the followers of truth and the adherents of falsehood, ultimately affirming that truth prevails. It serves as a reminder of the fate that befell past communities who scorned Allah's messengers and a warning that a similar fate awaits all who persist in disbelief.`;

  // Surah Fussilat description
  const fussilatText = `Fussilat, "Explained in Detail," refers to the detailed explanations provided in the Quran to make its messages clear to humanity. This Surah addresses the accusations of the disbelievers who call the revelations ancient fables. It emphasizes the creation of the heavens and the earth and the blessings that Allah has placed within them as signs for those who reflect. The Surah warns of severe punishment for those who persist in denial and mischief, contrasting this with the ultimate joy and fulfillment awaiting the righteous. It calls on people to listen to the word of Allah and to respond with faith and obedience.`;

  // Surah Ash-Shura description
  const shuraText = `Ash-Shura, "The Consultation," underscores the importance of shura (mutual consultation) in the conduct of affairs within the Muslim community. It discusses the characteristics of a society built on the principles of justice, consultation, and the avoidance of excess. The Surah reaffirms the unity of the source of all religious scriptures and calls for harmony among the followers of different prophets. It addresses theological and philosophical questions about evil and suffering, providing comforting answers that emphasize Allah's wisdom and supreme planning. The Surah encourages a steadfast commitment to faith and moral integrity, promising divine support for those who strive in the path of righteousness.`;

  // Surah Az-Zukhruf description
  const zukhrufText = `Az-Zukhruf, "The Gold Adornments," critiques the materialistic attitudes and the idolatrous practices prevalent in Meccan society. It contrasts the fleeting nature of worldly wealth and status with the enduring nature of truth and the hereafter. The Surah recounts the story of Prophet Moses and Pharaoh to highlight the conflict between truth and falsehood. It warns the disbelievers of the severe consequences of their arrogance and rejection of the Prophet Muhammad, similar to the fates of those who denied previous messengers. The Surah invites reflection on the signs of Allah in the creation and urges the Meccans to embrace the message of the Quran before they face the irreversible consequences of their actions.`;

  // Surah Ad-Dukhan description
  const dukhanText = `Ad-Dukhan, "The Smoke," describes a foreboding smoke that will envelop the disbelievers as a painful torment on the Day of Judgment. This Surah serves as a stark reminder of the reality of the hereafter and the serious consequences of rejecting the guidance of Allah. It recounts the story of Moses and Pharaoh to emphasize the victory of faith over tyranny. The Surah warns the Meccans of a similar fate if they continue to deny the truth and mistreat the Prophet. It calls on them to consider the lessons of history and the fate of earlier communities that vanished because of their iniquities.`;

  // Surah Al-Jathiyah description
  const jathiyahText = `Al-Jathiyah, "The Crouching," derives its name from the position people will assume on the Day of Judgment, overwhelmed by the terror and the gravity of the occasion. This Surah addresses the certainty of the hereafter and the accountability of human actions. It criticizes the arrogance and the materialistic worldview of the disbelievers who deny the resurrection and the recording of their deeds. The Surah presents arguments for monotheism and the prophethood of Muhammad, inviting the disbelievers to reflect on the creation of the universe and the precision of ecological balances as signs of the Creator's wisdom. It warns of the dire consequences of persisting in denial and injustice, urging a return to divine guidance.`;

  // Surah Al-Ahqaf description
  const ahqafText = `Al-Ahqaf, named after the sandy wind-curved dunes in the region of Ahqaf, discusses the stories of earlier prophets and their communities as lessons for the present generation. It emphasizes the continuity of the message of monotheism and the consequences of rejecting it. The Surah recounts the story of the prophet Hud and his people, the 'Ad, who were destroyed for their arrogance and denial of the truth. It warns the disbelievers of a similar fate and urges them to consider the evidence of past civilizations and the natural world around them. The Surah also addresses the concerns of the Prophet Muhammad regarding the rejection of his message, reassuring him of Allah's support and the ultimate triumph of the truth.`;

  // Surah Muhammad description
  const muhammadText = `Named after the Prophet Muhammad, this Surah outlines the obligations of the Muslims towards the Quranic message and the proper conduct in the struggle against the disbelievers. It emphasizes the importance of knowledge and the study of the Quran for personal development and the success of the community. The Surah criticizes the disbelievers for their obstruction and hostility towards the Prophet and the divine message. It discusses the characteristics of true believers and the hypocrites, highlighting the rewards for the faithful and the penalties for treachery and disbelief. The Surah serves as a guide for the Muslim community on perseverance, the pursuit of justice, and the preparation for the hereafter.`;

  // Surah Al-Fath description
  const fathText = `Al-Fath, "The Victory," commemorates the Treaty of Hudaybiyyah and the peaceful conquest of Mecca as clear signs of divine support for the Prophet and the Muslim community. The Surah discusses the implications of the treaty as a strategic victory and a precursor to greater successes. It addresses the moral and spiritual rewards for the believers who stood firmly with the Prophet during the testing times. The Surah also deals with the issue of those who lagged behind and missed the opportunity to participate in the Hudaybiyyah pledge, offering them a chance for redemption through future contributions. It emphasizes forgiveness and the importance of unity and discipline within the community in achieving the divine mission.`;

  // Surah Al-Hujurat description
  const hujuratText = `Al-Hujurat, "The Private Apartments," outlines the manners and ethics of social interaction within the Muslim community, including the proper conduct towards the Prophet. It emphasizes the importance of verifying information, avoiding suspicion and backbiting, and resolving conflicts amicably. The Surah promotes the values of brotherhood, equality, and humility, discouraging discrimination and division. It calls on the believers to maintain a high standard of morality in their personal and communal lives, fostering a community based on mutual respect, love, and the fear of Allah. The Surah serves as a charter for social conduct and emphasizes the impact of individual behavior on the health and unity of the broader community.`;

  // Surah Qaf description
  const qafText = `Named after the Arabic letter Qaf, this Surah opens with a powerful oath by the Quran to affirm the reality of resurrection and the hereafter. It addresses the skepticism of the disbelievers regarding the resurrection and the re-creation of the dead. The Surah provides vivid imagery of the Day of Judgment and the regret of those who ignored the signs and warnings. It recounts the story of the Prophet Noah and his people as a lesson in the consequences of denying the messengers of Allah. The Surah emphasizes the knowledge and the power of Allah, who is aware of every leaf that falls and every word that is spoken. It calls on humanity to reflect on the creation of the heavens and the earth and the purpose of life, urging a return to righteousness before it is too late.`;

  // Surah Adh-Dhariyat description
  const dhariyatText = `Adh-Dhariyat, "The Winnowing Winds," derives its name from the winds that scatter dust and rain, symbolizing the dispersion of divine wisdom through revelation. The Surah emphasizes the order and precision in the natural world as evidence of a purposeful creation. It recounts the stories of Abraham and his celestial visitors, Moses, and the people of Ad, drawing lessons about hospitality, faith, and the consequences of rejecting the prophets. The Surah warns of the suddenness of the Day of Judgment and the regret of those who are unprepared. It calls on the disbelievers to consider the fate of previous generations and to turn to Allah in repentance and obedience.`;

  // Surah At-Tur description
  const turText = `At-Tur, named after Mount Sinai, emphasizes the certainty of the Day of Judgment and the accountability of human actions. The Surah challenges the disbelievers' skepticism about resurrection and divine justice. It describes the horrors of the Day of Judgment for the wrongdoers and the bliss of the righteous in gardens beneath which rivers flow. The Surah recounts the story of Moses and his encounter with Pharaoh as an example of the triumph of truth over tyranny. It warns the disbelievers of the consequences of their arrogance and denial of the prophets. The Surah calls on humanity to reflect on the creation of the heavens and the earth and the revelations contained in the scriptures, urging a commitment to righteousness and the avoidance of sin.`;

  // Surah An-Najm description
  const najmText = `An-Najm, "The Star," begins with an oath by the star as it sets, affirming the Prophet's vision and the revelations he received. The Surah addresses the criticisms and doubts raised by the disbelievers about the Prophet's experiences and the divine origin of the Quran. It recounts the Prophet's journey during the Night of Ascension, emphasizing the high status granted to him by Allah. The Surah condemns the pagan practices and the worship of idols, calling for exclusive devotion to Allah. It describes the moral depravity and the eventual fate of the ancient tribes of 'Ad and Thamud as warnings to the contemporaries of the Prophet. The Surah reaffirms the resurrection, the Day of Judgment, and the eternal consequences of human actions, urging an adherence to the path of righteousness.`;

  // Surah Al-Qamar description
  const qamarText = `Al-Qamar, "The Moon," is named after the miraculous splitting of the moon, a sign requested by the disbelievers of Mecca. The Surah addresses the stubborn denial of the disbelievers despite witnessing clear signs. It recounts the stories of previous communities, including the people of Noah, 'Ad, Thamud, and Lot, who were destroyed for their transgressions. The Surah emphasizes the ease of the Quran's message, using repeated phrases to highlight its accessibility and the accountability it entails. It warns of the impending Day of Judgment and the regret of those who ignore the divine guidance. The Surah calls on the disbelievers to learn from history and to embrace the message of the Quran before they face the irreversible consequences of their denial.`;

  // Surah Ar-Rahman description
  const rahmanText = `Ar-Rahman, "The Beneficent," celebrates the countless blessings bestowed by Allah, the Most Merciful. It repeatedly questions the jinn and mankind about which of the favors of their Lord they can deny. The Surah describes the wonders of creation, the balance established in the universe, and the provisions made for all creatures. It contrasts the punishments for the wicked with the rewards for the righteous in vivid detail. The Surah emphasizes the fairness of divine judgment and the grace of Allah in guiding humanity through revelation. It calls on all beings to recognize and appreciate the infinite blessings of Allah, urging them to live in harmony with the divine will and to avoid transgressions.`;

  // Surah Al-Waqi'ah description
  const waqiahText = `Al-Waqi'ah, "The Inevitable," describes the events of the Day of Judgment, which no one can avert. The Surah categorizes people into three groups based on their deeds: the foremost in faith, the companions of the right hand, and the companions of the left hand. It details the distinct fates awaiting each group, emphasizing the stark differences in their eternal destinies. The Surah invites reflection on various natural phenomena and human experiences as signs of Allah's sovereignty and the reality of resurrection. It warns the disbelievers of the severe consequences of their denial and the ultimate justice of the Day of Judgment. The Surah serves as a reminder of the transient nature of worldly life and the enduring importance of the hereafter.`;

  // Surah Al-Hadid description
  const hadidText = `Al-Hadid, "The Iron," discusses the revelations of the Quran and the creation of the heavens and the earth as manifestations of Allah's power. It emphasizes the practical and spiritual benefits of faith, urging believers to be charitable and to strive in the cause of Allah. The Surah addresses the fleeting nature of worldly life and the enduring value of the hereafter. It criticizes the hypocrisy of those who claim faith but do not uphold its principles, especially in their financial dealings. The Surah uses the metaphor of iron, which combines strength and utility, to symbolize the robust yet constructive nature of true faith. It calls on the believers to prepare for the Day of Judgment through righteous deeds, charitable giving, and steadfast faith.`;

  // Surah Al-Mujadila description
  const mujadilaText = `Al-Mujadila, "The Pleading Woman," derives its name from the incident of a woman who pleaded with the Prophet about her husband's unjust treatment. The Surah addresses issues of marital discord and the rights of women within the family. It outlines the procedures for resolving conflicts and grievances, emphasizing justice and fairness. The Surah condemns the pre-Islamic practice of zihar, where a man would claim his wife as his mother to avoid his marital responsibilities. It reaffirms the sanctity of marriage and the importance of mutual respect and kindness between spouses. The Surah also warns against secret conspiracies and private meetings that exclude others for sinful purposes, promoting transparency and righteousness in all social interactions.`;

  // Surah Al-Hashr description
  const hashrText = `Al-Hashr discusses the banishment of the Jewish tribe Banu Nadir from Medina due to their treachery against the Muslims. It highlights the consequences of opposing divine guidance and the benefits of supporting it. The Surah emphasizes the importance of community solidarity and the dangers of hypocrisy within. It also reflects on the transient nature of worldly possessions, urging believers to prioritize spiritual gains over material ones. The chapter concludes by praising God's creation and urging the faithful to reflect on the signs of divine power and wisdom in the universe.`;

  // Surah Al-Mumtahanah description
  const mumtahanahText = `This Surah addresses the delicate balance between political alliances and religious commitments. It was revealed during a time of tension between the Muslim community in Medina and the polytheistic tribes of Mecca. The chapter provides guidance on maintaining relationships with non-Muslims, emphasizing that while Muslims should live in peace with those who do not threaten their faith, they must not ally with those hostile to Islam. It also discusses the treatment of women who emigrate from non-Muslim to Muslim communities, ensuring their rights and dignity are preserved.`;

  // Surah As-Saff description
  const saffText = `As-Saff emphasizes the importance of unity and discipline among Muslims, particularly in their devotion and struggle (Jihad) in the path of Allah. It criticizes Muslims who profess faith verbally but hesitate to commit to its challenges. The Surah encourages believers to be steadfast and to strive with their wealth and lives. It also highlights the consistency in the message of all prophets with the example of Jesus Christ, who preached monotheism and predicted the coming of Prophet Muhammad. The chapter concludes with a call to glorify Allah and maintain steadfastness in prayer and charity.`;

  // Surah Al-Jumu'ah description
  const jumuahText = `Al-Jumu'ah is named after the Friday congregational prayer that is a significant weekly event for Muslims. The Surah begins by glorifying God and the creation of everything in the universe. It then discusses the importance of the Friday prayer and criticizes those who overlook it for worldly gain. The chapter also reflects on the Jewish community's failure to live up to their covenant with God and warns Muslims not to follow in their footsteps. It emphasizes the role of Prophet Muhammad in educating and purifying the believers, urging them to respond when called to worship.`;

  // Surah Al-Munafiqoon description
  const munafiqoonText = `This Surah deals with the characteristics of hypocrites, who profess faith in Islam but inwardly oppose it. It was revealed in the context of events where certain individuals in Medina were exposed for their duplicity. The chapter warns the believers to be wary of the deceit of hypocrites and not to let their eloquent promises and oaths deceive them. It also advises Muslims to spend in the cause of Allah before death approaches and it's too late for charity to benefit them. The Surah ends with a reminder of the ultimate accountability in the Hereafter.`;

  // Surah At-Taghabun description
  const taghabunText = `At-Taghabun discusses the cosmic conflict between truth and falsehood, and the disillusion that will happen on the Day of Judgment when true natures are revealed. It offers guidance on handling the material and emotional trials of life, emphasizing that everything happens by divine decree. The chapter encourages believers to fear Allah, manage their wealth wisely, and maintain justice and kindness within the family. It concludes with a reminder of the Day of Judgment, urging the faithful to believe in Allah and His messenger, and to strive for forgiveness and a great reward.`;

  // Surah At-Talaq description
  const talaqText = `At-Talaq provides detailed regulations regarding the process of divorce, emphasizing the need for fairness and respect between spouses, even in times of marital discord. It outlines the waiting period (iddah) for divorced women, the financial responsibilities of the husband, and the importance of observing God's laws in these matters. The Surah also discusses broader themes of God's creation and command, urging believers to reflect on the natural world as a sign of God's majesty and wisdom. It reassures the faithful that if they fear Allah, He will provide for them from unexpected sources.`;

  // Surah At-Tahrim description
  const tahrimText = `At-Tahrim begins with an incident where Prophet Muhammad is admonished by Allah for prohibiting something lawful to please his wives, highlighting the importance of not compromising divine laws for personal satisfaction. The chapter uses stories of previous prophets and their families to illustrate the consequences of disobedience versus the rewards of righteousness. It particularly mentions the wives of Noah and Lot as negative examples and the wife of Pharaoh and Mary, the mother of Jesus, as positive ones. The Surah concludes by reminding believers of the Day of Judgment and the need to repent and purify themselves.`;

  // Surah Al-Mulk description
  const mulkText = `Al-Mulk extols the absolute sovereignty and mastery of Allah over the universe. It serves as a reminder of the creative power and intricate planning of Allah, urging humans to recognize the signs of divine craftsmanship in the world around them. The chapter warns of the severe punishment awaiting those who reject the truth and live in arrogance but promises great rewards for those who fear their Lord unseen and uphold high moral standards. It emphasizes the inevitability of death and the afterlife, encouraging the believers to prepare for the accounting of their deeds.`;

  // Surah Al-Qalam description
  const qalamText = `Al-Qalam defends the character and sanity of Prophet Muhammad against the unfounded accusations of his detractors. It uses the story of the owners of a garden who failed to give charity and were punished with its destruction as a parable for the consequences of greed and ingratitude. The Surah admonishes the disbelievers who challenge the truth of the Quran and warns them of the consequences of their stubbornness. It also provides comfort and support to the Prophet, advising patience and perseverance in the face of mockery and opposition.`;

  // Surah Al-Haaqqa description
  const haqqaText = `Al-Haaqqa describes the horrors of the Day of Judgment, referred to as "The Inevitable," detailing the events that will unfold. It recounts the fate of earlier peoples who rejected their prophets, such as the Thamud, the Pharaoh, and the people of Noah, as warnings to the disbelievers. The chapter contrasts the final abode of the righteous, which will be gardens and bliss, with the severe punishment awaiting the wicked in hellfire. It reaffirms the truth of the Quran, emphasizing its revelation from a Noble and Trustworthy Spirit (Angel Gabriel).`;

  // Surah Al-Maarij description
  const maarijText = `Al-Maarij reflects on the spiritual ascent a believer must undertake to reach success in the hereafter, symbolized by the "ascending stairways." The chapter describes the Day of Judgment as a difficult day that will be easy only for the righteous. It criticizes the impatience and selfishness of man, especially in matters of wealth and charity. The Surah warns of the severe punishment awaiting those who persist in sin and disbelief but promises protection and a high station to those who guard their chastity and remain mindful of their prayers.`;

  // Surah Nuh description
  const nuhText = `Surah Nuh tells the story of Prophet Noah and his prolonged struggle to convince his people to abandon idolatry and worship Allah alone. Despite his efforts, only a few heeded his call, leading to the great flood that destroyed the disbelievers. The chapter emphasizes the themes of divine mercy and punishment, illustrating through Noah's story the consequences of rejecting the truth. It also highlights the importance of seeking forgiveness from Allah, as Noah advises his people, promising them increased blessings in return.`;

  // Surah Al-Jinn description
  const jinnText = `Al-Jinn provides insights into the existence and nature of jinn, spiritual beings created from fire. The chapter recounts an incident where a group of jinn came upon Prophet Muhammad reciting the Quran and were moved to believe in it. They returned to their people to warn them of the consequences of their disbelief. The Surah discusses the accountability of both humans and jinn on the Day of Judgment and emphasizes the uniqueness of Allah's knowledge, warning against attributing knowledge of the unseen to anyone but Him.`;

  // Surah Al-Muzzammil description
  const muzzammilText = `Al-Muzzammil addresses Prophet Muhammad, advising him on the importance of night prayer and spiritual devotion during the early stages of his prophethood. It emphasizes the restorative and strengthening effects of prayer, particularly during the night, which prepares the soul for the challenges of the day. The chapter also warns of the heavy responsibilities of the message he is to deliver and the opposition he will face. It concludes with guidelines on reciting the Quran during prayer and the flexibility allowed to him given his duties and circumstances.`;

  // Surah Al-Muddaththir description
  const muddaththirText = `Al-Muddaththir urges Prophet Muhammad to arise and warn the people of the impending judgment. It marks a transition from his private devotion to his public role as a warner. The Surah describes the torments of hell awaiting the wicked and the rewards for the righteous. It particularly condemns those who are indifferent to the message and those who actively oppose it, exemplified by the figure of Al-Walid ibn Mughirah, a staunch critic of the Prophet. The chapter calls for patience, perseverance, and purity in the face of ridicule and persecution.`;

  // Surah Al-Qiyamah description
  const qiyamahText = `Al-Qiyamah affirms the reality of the resurrection and the Day of Judgment, addressing the doubts of the disbelievers. It vividly describes the scenes of that day, when souls will be paired with their bodies and people will be sorted according to their deeds. The Surah also discusses the process of human creation and resurrection as evidence of Allah's power to bring the dead back to life. It emphasizes the inevitability of the judgment and the inescapability of divine justice, urging reflection and preparation.`;

  // Surah Al-Insan description
  const insanText = `Al-Insan reflects on the creation of man and his potential for greatness or downfall. It describes the blessings prepared for the righteous in the hereafter, such as gardens, silk garments, and flowing wine that does not intoxicate. The chapter praises those who, despite their own needs, feed the poor, the orphan, and the captive for the love of Allah. It contrasts this with the punishment awaiting those who fail to believe and act righteously. The Surah serves as a reminder of the divine mercy available to those who strive in His path.`;

  // Surah Al-Mursalat description
  const mursalatText = `Al-Mursalat uses the metaphor of winds sent forth as emissaries to illustrate the theme of divine messengership. The chapter warns of the coming judgment, describing it as a day when all excuses will be stripped away, and the truth will be laid bare. It recounts the fate of previous generations who rejected their prophets and the catastrophic ends they met, serving as a warning to the current generation. The Surah is both a reminder of the mercy of guidance through prophets and a warning of the consequences of ignoring this guidance.`;

  // Surah An-Naba description
  const nabaText = `An-Naba addresses the fundamental questions about the afterlife and the purpose of creation that were being debated in Meccan society. It clarifies the truth about the Day of Judgment and the eternal outcomes for the righteous and the wicked. The chapter details the blessings of paradise and the horrors of hell, urging the listeners to choose their path wisely. It also reflects on various natural phenomena as signs of Allah's power and mercy, encouraging reflection on the creation as a means to recognize the Creator.`;

  // Surah An-Nazi'at description
  const naziatText = `An-Nazi'at describes the events of the end times, focusing on the angels who execute Allah's commands concerning the souls of the dead. The chapter transitions into a recount of the story of Moses and his confrontation with Pharaoh, highlighting themes of tyranny, faith, and divine justice. It serves as a reminder of the transient nature of power and the ultimate triumph of truth over falsehood. The Surah concludes with a vivid description of the Day of Judgment, urging the disbelievers to reconsider their skepticism and accept the message of Islam.`;

  // Surah Abasa description
  const abasaText = `Abasa criticizes Prophet Muhammad for his reaction to a blind man, Abdullah ibn Umm Maktum, who came seeking guidance while he was preoccupied with the Meccan elites. The chapter uses this incident to teach a valuable lesson in humility and the importance of giving attention to all individuals, regardless of their social status. It emphasizes that true nobility lies in faith and righteousness, not wealth or power. The Surah also discusses the ingratitude of man towards God's blessings and the need for awareness of the afterlife.`;

  // Surah At-Takwir description
  const takwirText = `At-Takwir vividly describes the cosmic upheaval that will occur on the Day of Judgment. The chapter details the dramatic transformations in the natural world, signifying the end of the current order. It serves as a powerful reminder of the day when all secrets will be disclosed, and each soul will be confronted with its deeds. The Surah also briefly recounts the moral degradation of past societies, particularly the Thamud, and the consequences they faced for their transgressions. It calls on humanity to heed the warnings of the Quran and turn to a path of righteousness.`;

  // Surah Al-Infitar description
  const infitarText = `Al-Infitar describes the splitting of the sky and the scattering of the stars as part of the cataclysmic events of the Day of Judgment. The chapter emphasizes the suddenness of the end times and the profound transformations that will render the familiar world unrecognizable. It calls out the moral failings of humanity, particularly their ingratitude towards God who created and sustained them. The Surah warns of the severe accountability on the Day of Judgment and the ultimate distinction that will be made between the righteous and the wicked.`;

  // Surah Al-Mutaffifin description
  const mutaffifinText = `Al-Mutaffifin condemns the unethical practice of shortchanging in measures and weights, using it as a metaphor for broader moral failings, including deceit and fraudulence. The chapter warns those who engage in such practices of a humiliating punishment in the afterlife. It contrasts this with the record of the righteous, who will be rewarded with eternal delights. The Surah serves as a call to fair dealings and integrity in all aspects of life, emphasizing that true success lies in adherence to divine principles and accountability before God.`;

  // Surah Al-Inshiqaq description
  const inshiqaqText = `Al-Inshiqaq describes the dramatic rending of the earth and the heavens on the Day of Judgment, symbolizing the end of the world as we know it. The chapter emphasizes the inevitability of this day and the resurrection of the dead for judgment. It warns of the severe consequences for those who deny the resurrection and live a life of sin. Conversely, it promises immense rewards for those who fear their Lord and lead a righteous life. The Surah aims to instill a consciousness of the afterlife and the importance of moral accountability.`;

  // Surah Al-Buruj description
  const burujText = `Al-Buruj is named after the constellations and starts by swearing an oath on the celestial phenomena, emphasizing their majestic and orderly nature as signs of divine sovereignty. The chapter recounts the story of the People of the Ditch, an ancient community who persecuted believers by casting them into a fire. It condemns their cruelty and warns of the hellfire awaiting such oppressors. The Surah reassures the believers of God's protection and the ultimate triumph of faith over tyranny. It calls for patience and perseverance in the face of persecution and injustice.`;

  // Surah At-Tariq description
  const tariqText = `At-Tariq, named after the piercing brightness of the morning star, emphasizes the watchful nature of God's creation. The chapter uses the phenomenon of the night visitor as a metaphor for the suddenness and certainty of divine revelation. It discusses the creation of man from a fluid and the inevitability of resurrection and judgment. The Surah serves as a reminder of God's power and knowledge, which encompass all that humans do, however secret they might think it is. It warns of the consequences of disregarding God's signs and the message of the Quran.`;

  // Surah Al-A'la description
  const alaText = `Al-A'la extols the virtues and attributes of Allah, the Most High, who has created and proportioned all that exists with perfect symmetry and order. The chapter encourages the Prophet and the believers to glorify the name of their Lord and to establish regular prayer and charity. It reminds them of the hereafter and the transient nature of worldly life. The Surah also touches on the themes of revelation, reminding that the Quran will be preserved in the hearts of the righteous. It concludes with a call to focus on the everlasting life of the hereafter over the fleeting pleasures of this world.`;

  // Surah Al-Ghashiyah description
  const ghashiyahText = `Al-Ghashiyah describes the overwhelming calamity of the Day of Judgment, which will envelop everything. The chapter paints a vivid picture of the faces of the disbelievers that day, full of distress and exhaustion, contrasted with the radiant faces of the righteous, who will be in a state of joy and satisfaction. It also describes the rewards and punishments awaiting each group, urging the listeners to reflect on their own fate. The Surah concludes with observations on natural phenomena and livestock, inviting reflection on these as signs of God's nurturing power and sustenance.`;

  // Surah Al-Fajr description
  const fajrText = `Al-Fajr is named after the dawn, symbolizing the light of faith dispelling the darkness of disbelief. The chapter recounts the destruction of earlier peoples, such as the 'Ad, Thamud, and Pharaoh's people, who were arrogant and oppressive. It serves as a warning to the Quraysh, urging them to learn from the fate of these tribes. The Surah also discusses the soul's journey through hardship and ease, teaching that true success comes from purifying the soul and failing from corrupting it. It emphasizes God's watchfulness and the ultimate return of all matters to Him.`;

  // Surah Al-Balad description
  const baladText = `Al-Balad reflects on the sacredness of the city of Mecca, where the Prophet was situated. It challenges the inhabitants to recognize the blessings they have received and the responsibilities that come with them. The chapter describes the struggles of human life and the moral obligations to free slaves, feed the poor, and encourage the feeding of the needy. It criticizes the materialism and corruption that lead people away from these duties. The Surah concludes by contrasting the paths of righteousness and wickedness, urging a commitment to the former.`;

  // Surah Ash-Shams description
  const shamsText = `Surah Ash-Shams opens with a series of oaths by Allah, swearing by the sun, the moon, the day, the night, the sky, the earth, and the soul. These oaths emphasize the meticulous balance and harmony in creation, reflecting the wisdom of Allah. The chapter then shifts to the story of the Thamud people, who were destroyed for their disobedience and arrogance after they defied Allah's command by slaughtering a she-camel sent as a miraculous sign. The surah concludes by affirming the soul's struggle between its corruptive impulses and the divine guidance it receives, highlighting the consequences of one's choices.`;

  // Surah Al-Lail description
  const lailText = `Al-Lail contrasts the nature of charitable, God-fearing individuals with those who are miserly and disbelieving. It begins by swearing by the night, the day, and the creation of male and female, illustrating that human actions also contrast like these natural phenomena. The surah teaches that those who give generously and fear Allah will be eased into ease, while those who are greedy and think themselves self-sufficient will be eased into hardship. It emphasizes that ultimate success comes from purifying oneself and remembering the name of one's Lord, leading a life of righteousness guided by divine revelation.`;

  // Surah Ad-Duha description
  const duhaText = `Ad-Duha was revealed at a time when there was a brief interruption in revelation, and the Prophet Muhammad felt distressed. The surah reassures him that Allah has not forsaken him and that the Hereafter will be better for him than the present. It reminds him of his past, how Allah found him orphaned and gave him refuge, found him unaware and guided him, and found him in need and made him self-sufficient. The chapter concludes by advising the Prophet to treat the orphan with kindness and not to repel the beggar, emphasizing gratitude and compassion.`;

  // Surah Ash-Sharh description
  const sharhText = `Ash-Sharh, also known as Al-Inshirah, offers solace and comfort to the Prophet Muhammad by reminding him that with every hardship comes ease. It reassures him that Allah has expanded his breast and elevated his mention. The surah encourages the Prophet to continue his mission with renewed vigor and to dedicate himself to the worship of his Lord after his tasks are completed. It is a message of hope and encouragement, reinforcing that Allah's support is always near.`;

  // Surah At-Tin description
  const tinText = `At-Tin takes an oath by the fig, the olive, Mount Sinai, and the city of Mecca to assert the excellence of human creation. It laments the state of humans who, despite being created in the best of molds, often fall to the lowest of the low because of their deeds, except for those who believe and do righteous deeds. The surah ends with a warning about the certainty of judgment and the ultimate justice of Allah, emphasizing the moral responsibility of individuals.`;

  // Surah Al-Alaq description
  const alaqText = `Al-Alaq holds historical significance as the first revelation received by Prophet Muhammad. It begins with the command "Read!" and mentions the creation of humans from a clinging clot. The surah emphasizes the importance of knowledge and learning, as Allah teaches by the pen and teaches man what he did not know. However, it also warns against man's transgressions and his tendency to see himself as self-sufficient. The chapter concludes with a caution to not prevent others from praying and to prostrate and draw near to Allah.`;

  // Surah Al-Qadr description
  const qadrText = `Al-Qadr describes the grandeur of the Night of Decree, a night better than a thousand months, in which the Quran was revealed. The surah explains that on this night, angels and the Spirit descend by Allah's permission, with all decrees. It is a night of peace until the emergence of dawn. The chapter highlights the significance of this night, encouraging Muslims to seek its blessings and to engage in worship and recitation of the Quran.`;

  // Surah Al-Bayyinah description
  const bayyinahText = `Al-Bayyinah addresses the People of the Book, explaining that the Prophet Muhammad came with clear proofs and the sacred scripture. Despite this, many among the People of the Book and the polytheists refused to depart from their ways until the clear proof was given. Those who disbelieve among them face a severe punishment, while those who believe and do righteous deeds will have their rewards with their Lord. The surah emphasizes the simplicity of the core message of Islam, which is to worship Allah and maintain purity in faith.`;

  // Surah Az-Zalzalah description
  const zalzalahText = `Az-Zalzalah describes the final earthquake that shakes the earth, causing it to throw up its burdens. People will be seen scattered, and each soul will then understand what it has put forward. This short surah vividly portrays the chaos and the ultimate accountability on the Day of Judgment, reminding people that even the smallest actions are significant and will be shown, whether they are as small as a mustard seed.`;

  // Surah Al-Adiyat description
  const adiyatText = `Al-Adiyat swears by the charging war horses, creating a vivid scene of battle and strife. The surah reflects on the ingratitude of man towards his Lord and his intense love of wealth. It warns that man's actions are witnessed by Allah, and the violent love of riches often leads to conflict and destruction. The chapter serves as a reminder of the consequences of unchecked desires and the importance of gratitude towards Allah.`;

  // Surah Al-Qari'ah description
  const qariahText = `Al-Qari'ah describes the Day of Judgment as a striking calamity, where people are scattered like moths and the mountains like carded wool. The surah presents a scale of justice; those whose good deeds weigh heavy will be in a pleasing life, while those whose scale is light will find their abode in Al-Hawiyah (the Abyss). It emphasizes the transient nature of worldly life and the lasting impact of deeds in the Hereafter.`;

  // Surah At-Takathur description
  const takathurText = `At-Takathur warns against the distraction caused by the desire to accumulate worldly things. The surah criticizes people for their mutual rivalry in piling up worldly possessions, which diverts them until they visit the graves. It reminds them that they will soon know the reality of the life to come, suggesting that true success lies in preparing for the Hereafter rather than being engrossed in temporary worldly gains.`;

  // Surah Al-Asr description
  const asrText = `Al-Asr, one of the shortest surahs, captures the essence of human loss through the passage of time. It asserts that by the token of time, all humans are in loss except those who have faith, do righteous deeds, and advise each other to truth and patience. This surah is a powerful reminder that success lies in faith, good deeds, truthful interaction, and perseverance.`;

  // Surah Al-Humazah description
  const humazahText = `Al-Humazah, "The Slanderer," condemns those who engage in backbiting and slander. It addresses those who amass wealth and count it repeatedly, thinking it will make them immortal. The surah warns that such people will be thrown into the crushing Fire of Hell, which will surge over hearts and close in upon them in towering columns. It serves as a reminder that wealth without moral integrity leads to destruction, and that one's words and actions against others have severe consequences in the Hereafter.`;

  // Surah Al-Fil description
  const filText = `Al-Fil, "The Elephant," refers to the incident known as the Year of the Elephant, which occurred in the year of Prophet Muhammad's birth. It recounts how Allah protected the Kaaba in Mecca from the army of Abraha, the Abyssinian governor of Yemen, who came with elephants to destroy it. The surah describes how Allah sent flocks of birds that pelted the army with stones of baked clay, rendering them like eaten straw. This historical event serves as a reminder of Allah's power to protect His sacred house and His willingness to intervene against oppressors.`;

  // Surah Quraysh description
  const qurayshText = `Surah Quraysh highlights the special privileges enjoyed by the Quraysh tribe of Mecca. It mentions their secure trade journeys during winter and summer, which brought them prosperity and respect among Arabs. The surah calls on the Quraysh to be grateful to Allah, who provided them with food against hunger and security against fear. It emphasizes that true gratitude should be shown through the worship of the Lord of the Kaaba, who bestowed these blessings upon them. The message serves as a reminder that all provisions come from Allah and should be acknowledged through devoted worship.`;

  // Surah Al-Ma'un description
  const maunText = `Al-Ma'un, "The Small Kindness," begins by questioning those who deny the religion, identifying them as those who repulse the orphan and do not encourage feeding the poor. It then criticizes the hypocritical worshippers who pray for show but refuse to offer even the smallest act of kindness or assistance to others. The surah emphasizes that true faith is not just about ritual prayers but is reflected in compassionate actions toward the vulnerable. It establishes a direct link between faith, prayer, and social justice, condemning those who neglect their moral responsibilities towards society.`;

  // Surah Al-Kawthar description
  const kawtharText = `Al-Kawthar, "The Abundance," was revealed to comfort Prophet Muhammad after his opponents mocked him following the death of his son. The surah assures the Prophet that Allah has given him abundant good, including the river of Al-Kawthar in Paradise. It instructs him to continue praying to his Lord and sacrificing for Him alone. The final verse declares that it is the Prophet's enemies who will be cut off from future generations and remembrance. This short but powerful surah emphasizes that true value lies not in worldly lineage but in Allah's favor and the performance of sincere worship.`;

  // Surah Al-Kafirun description
  const kafirunText = `Al-Kafirun, "The Disbelievers," was revealed when the polytheists of Mecca proposed a compromise where they would worship Allah for a year if the Prophet would worship their idols for a year. The surah categorically rejects this offer, stating clearly: "I do not worship what you worship, nor do you worship what I worship." It emphasizes the complete disassociation between true monotheism and polytheism, concluding with the powerful statement: "For you is your religion, and for me is my religion." This establishes the principle of no compromise in matters of faith and belief, while acknowledging religious plurality in society.`;

  // Surah An-Nasr description
  const nasrText = `An-Nasr, "The Divine Support," is believed to be one of the last revelations received by Prophet Muhammad. It foretells the imminent victory of Islam and the conquest of Mecca, describing how people would enter the religion of Allah in multitudes. The surah instructs the Prophet to glorify his Lord with praise and seek His forgiveness when this happens. Scholars interpret this as an indication of the Prophet's approaching completion of his mission and his imminent departure from this world. It serves as a reminder that even in moments of triumph, believers should remain humble, praising Allah and seeking His forgiveness.`;

  // Surah Al-Masad description
  const masadText = `Al-Masad, also known as "The Palm Fiber," addresses the fate of Abu Lahab, the Prophet's uncle and one of his most vehement opponents, and his wife. The surah declares that Abu Lahab's wealth and status would not benefit him, and he would enter a Fire of blazing flame. It also mentions his wife, who used to spread harmful gossip and place thorns in the Prophet's path, stating that she would carry a rope of palm fiber around her neck in Hell. This surah stands as a rare example of specific individuals being condemned by name in the Quran, underscoring the severe consequences of persistent opposition to divine guidance and persecution of God's messenger.`;

  // Surah Al-Ikhlas description
  const ikhlasText = `Al-Ikhlas, "The Sincerity," encapsulates the essence of Islamic monotheism (Tawhid) in just four verses. It declares that "Allah is One" (Ahad), rejecting polytheism in all forms. It describes Allah as "the Eternal, Absolute" (As-Samad), on whom all creation depends while He depends on nothing. The surah categorically denies that Allah begets or is begotten, refuting concepts of divine offspring or parentage found in other traditions. It concludes by affirming that "there is none comparable to Him," establishing Allah's absolute uniqueness. Despite its brevity, the Prophet stated that this surah equals one-third of the Quran in importance, highlighting the centrality of pure monotheism in Islamic theology.`;

  // Surah Al-Falaq description
  const falaqText = `Al-Falaq, "The Daybreak," is one of the two protective surahs (Al-Mu'awwidhatayn). It begins by instructing the believer to seek refuge in the Lord of the Daybreak from various evils: the evil of created things, the evil of darkness when it settles, the evil of those who practice witchcraft, and the evil of the envious when they envy. The surah teaches that while evil forces exist in the world, Allah's protection is always available to those who sincerely seek it. It establishes a pattern for seeking divine protection that Muslims frequently use in their daily lives, particularly in moments of fear or when facing unseen threats.`;

  // Surah An-Nas description
  const nasText = `An-Nas, "Mankind," is the final surah of the Quran and the second of the two protective surahs. It directs believers to seek refuge in the Lord, King, and God of mankind from the evil of the retreating whisperer (Satan) who whispers into the hearts of mankind, whether from among jinn or people. The surah is distinctive in describing Allah through three attributes related to humanity: as their Lord (creator and sustainer), their King (sovereign authority), and their God (the only one worthy of worship). It acknowledges the reality of satanic temptations that withdraw when one remembers Allah, highlighting the perpetual spiritual struggle humans face and the divine protection available through seeking refuge in Allah.`;

  // Select the appropriate text based on selectedSurahId
  const fullText = selectedSurahId === 1 ? fatihahText : 
                 selectedSurahId === 2 ? baqarahText : 
                 selectedSurahId === 3 ? imranText : 
                 selectedSurahId === 4 ? nisaText : 
                 selectedSurahId === 5 ? maidahText :
                 selectedSurahId === 6 ? anamText :
                 selectedSurahId === 7 ? arafText :
                 selectedSurahId === 8 ? anfalText :
                 selectedSurahId === 9 ? tawbahText :
                 selectedSurahId === 10 ? yunusText :
                 selectedSurahId === 11 ? hudText :
                 selectedSurahId === 12 ? yusufText :
                 selectedSurahId === 13 ? radText :
                 selectedSurahId === 14 ? ibrahimText :
                 selectedSurahId === 15 ? hijrText :
                 selectedSurahId === 16 ? nahlText :
                 selectedSurahId === 17 ? israText :
                 selectedSurahId === 18 ? kahfText :
                 selectedSurahId === 19 ? maryamText :
                 selectedSurahId === 20 ? tahaText :
                 selectedSurahId === 21 ? anbiyaText :
                 selectedSurahId === 22 ? hajjText :
                 selectedSurahId === 23 ? muminunText :
                 selectedSurahId === 24 ? nurText :
                 selectedSurahId === 25 ? furqanText :
                 selectedSurahId === 26 ? shuaraText :
                 selectedSurahId === 27 ? namlText :
                 selectedSurahId === 28 ? qasasText :
                 selectedSurahId === 29 ? ankabutText :
                 selectedSurahId === 30 ? rumText :
                 selectedSurahId === 31 ? luqmanText :
                 selectedSurahId === 32 ? sajdahText :
                 selectedSurahId === 33 ? ahzabText :
                 selectedSurahId === 34 ? sabaText :
                 selectedSurahId === 35 ? fatirText :
                 selectedSurahId === 36 ? yasinText :
                 selectedSurahId === 37 ? saffatText :
                 selectedSurahId === 38 ? sadText :
                 selectedSurahId === 39 ? zumarText :
                 selectedSurahId === 40 ? ghafirText :
                 selectedSurahId === 41 ? fussilatText :
                 selectedSurahId === 42 ? shuraText :
                 selectedSurahId === 43 ? zukhrufText :
                 selectedSurahId === 44 ? dukhanText :
                 selectedSurahId === 45 ? jathiyahText :
                 selectedSurahId === 46 ? ahqafText :
                 selectedSurahId === 47 ? muhammadText :
                 selectedSurahId === 48 ? fathText :
                 selectedSurahId === 49 ? hujuratText :
                 selectedSurahId === 50 ? qafText :
                 selectedSurahId === 51 ? dhariyatText :
                 selectedSurahId === 52 ? turText :
                 selectedSurahId === 53 ? najmText :
                 selectedSurahId === 54 ? qamarText :
                 selectedSurahId === 55 ? rahmanText :
                 selectedSurahId === 56 ? waqiahText :
                 selectedSurahId === 57 ? hadidText :
                 selectedSurahId === 58 ? mujadilaText :
                 selectedSurahId === 59 ? hashrText :
                 selectedSurahId === 60 ? mumtahanahText :
                 selectedSurahId === 61 ? saffText :
                 selectedSurahId === 62 ? jumuahText :
                 selectedSurahId === 63 ? munafiqoonText :
                 selectedSurahId === 64 ? taghabunText :
                 selectedSurahId === 65 ? talaqText :
                 selectedSurahId === 66 ? tahrimText :
                 selectedSurahId === 67 ? mulkText :
                 selectedSurahId === 68 ? qalamText :
                 selectedSurahId === 69 ? haqqaText :
                 selectedSurahId === 70 ? maarijText :
                 selectedSurahId === 71 ? nuhText :
                 selectedSurahId === 72 ? jinnText :
                 selectedSurahId === 73 ? muzzammilText :
                 selectedSurahId === 74 ? muddaththirText :
                 selectedSurahId === 75 ? qiyamahText :
                 selectedSurahId === 76 ? insanText :
                 selectedSurahId === 77 ? mursalatText :
                 selectedSurahId === 78 ? nabaText :
                 selectedSurahId === 79 ? naziatText :
                 selectedSurahId === 80 ? abasaText :
                 selectedSurahId === 81 ? takwirText :
                 selectedSurahId === 82 ? infitarText :
                 selectedSurahId === 83 ? mutaffifinText :
                 selectedSurahId === 84 ? inshiqaqText :
                 selectedSurahId === 85 ? burujText :
                 selectedSurahId === 86 ? tariqText :
                 selectedSurahId === 87 ? alaText :
                 selectedSurahId === 88 ? ghashiyahText :
                 selectedSurahId === 89 ? fajrText :
                 selectedSurahId === 90 ? baladText :
                 selectedSurahId === 91 ? shamsText :
                 selectedSurahId === 92 ? lailText :
                 selectedSurahId === 93 ? duhaText :
                 selectedSurahId === 94 ? sharhText :
                 selectedSurahId === 95 ? tinText :
                 selectedSurahId === 96 ? alaqText :
                 selectedSurahId === 97 ? qadrText :
                 selectedSurahId === 98 ? bayyinahText :
                 selectedSurahId === 99 ? zalzalahText :
                 selectedSurahId === 100 ? adiyatText :
                 selectedSurahId === 101 ? qariahText :
                 selectedSurahId === 102 ? takathurText :
                 selectedSurahId === 103 ? asrText :
                 selectedSurahId === 104 ? humazahText :
                 selectedSurahId === 105 ? filText :
                 selectedSurahId === 106 ? qurayshText :
                 selectedSurahId === 107 ? maunText :
                 selectedSurahId === 108 ? kawtharText :
                 selectedSurahId === 109 ? kafirunText :
                 selectedSurahId === 110 ? nasrText :
                 selectedSurahId === 111 ? masadText :
                 selectedSurahId === 112 ? ikhlasText :
                 selectedSurahId === 113 ? falaqText :
                 selectedSurahId === 114 ? nasText : baqarahText;

  // Split the full text into paragraphs
  const paragraphs = fullText.split('\n');
  // Get the first 5 paragraphs for the preview
  const previewParagraphs = paragraphs.slice(0, 5);
  
  // Helper function to get surah name
  const getSurahName = (id: number): string => {
    switch(id) {
      case 1: return 'Al-Fatihah';
      case 2: return 'Al-Baqarah';
      case 3: return 'Aal-E-Imran';
      case 4: return 'An-Nisa';
      case 5: return 'Al-Ma\'idah';
      case 6: return 'Al-An\'am';
      case 7: return 'Al-A\'raf';
      case 8: return 'Al-Anfal';
      case 9: return 'At-Tawbah';
      case 10: return 'Yunus';
      case 11: return 'Hud';
      case 12: return 'Yusuf';
      case 13: return 'Ar-Ra\'d';
      case 14: return 'Ibrahim';
      case 15: return 'Al-Hijr';
      case 16: return 'An-Nahl';
      case 17: return 'Al-Isra';
      case 18: return 'Al-Kahf';
      case 19: return 'Maryam';
      case 20: return 'Ta-Ha';
      case 21: return 'Al-Anbiya';
      case 22: return 'Al-Hajj';
      case 23: return 'Al-Mu\'minun';
      case 24: return 'An-Nur';
      case 25: return 'Al-Furqan';
      case 26: return 'Ash-Shu\'ara';
      case 27: return 'An-Naml';
      case 28: return 'Al-Qasas';
      case 29: return 'Al-Ankabut';
      case 30: return 'Ar-Rum';
      case 31: return 'Luqman';
      case 32: return 'As-Sajdah';
      case 33: return 'Al-Ahzab';
      case 34: return 'Saba';
      case 35: return 'Fatir';
      case 36: return 'Ya-Sin';
      case 37: return 'As-Saffat';
      case 38: return 'Sad';
      case 39: return 'Az-Zumar';
      case 40: return 'Ghafir';
      case 41: return 'Fussilat';
      case 42: return 'Ash-Shura';
      case 43: return 'Az-Zukhruf';
      case 44: return 'Ad-Dukhan';
      case 45: return 'Al-Jathiyah';
      case 46: return 'Al-Ahqaf';
      case 47: return 'Muhammad';
      case 48: return 'Al-Fath';
      case 49: return 'Al-Hujurat';
      case 50: return 'Qaf';
      case 51: return 'Adh-Dhariyat';
      case 52: return 'At-Tur';
      case 53: return 'An-Najm';
      case 54: return 'Al-Qamar';
      case 55: return 'Ar-Rahman';
      case 56: return 'Al-Waqi\'ah';
      case 57: return 'Al-Hadid';
      case 58: return 'Al-Mujadila';
      case 59: return 'Al-Hashr';
      case 60: return 'Al-Mumtahanah';
      case 61: return 'As-Saff';
      case 62: return 'Al-Jumu\'ah';
      case 63: return 'Al-Munafiqoon';
      case 64: return 'At-Taghabun';
      case 65: return 'At-Talaq';
      case 66: return 'At-Tahrim';
      case 67: return 'Al-Mulk';
      case 68: return 'Al-Qalam';
      case 69: return 'Al-Haaqqa';
      case 70: return 'Al-Maarij';
      case 71: return 'Nuh';
      case 72: return 'Al-Jinn';
      case 73: return 'Al-Muzzammil';
      case 74: return 'Al-Muddaththir';
      case 75: return 'Al-Qiyamah';
      case 76: return 'Al-Insan';
      case 77: return 'Al-Mursalat';
      case 78: return 'An-Naba';
      case 79: return 'An-Nazi\'at';
      case 80: return 'Abasa';
      case 81: return 'At-Takwir';
      case 82: return 'Al-Infitar';
      case 83: return 'Al-Mutaffifin';
      case 84: return 'Al-Inshiqaq';
      case 85: return 'Al-Buruj';
      case 86: return 'At-Tariq';
      case 87: return 'Al-A\'la';
      case 88: return 'Al-Ghashiyah';
      case 89: return 'Al-Fajr';
      case 90: return 'Al-Balad';
      case 91: return 'Ash-Shams';
      case 92: return 'Al-Lail';
      case 93: return 'Ad-Duha';
      case 94: return 'Ash-Sharh';
      case 95: return 'At-Tin';
      case 96: return 'Al-Alaq';
      case 97: return 'Al-Qadr';
      case 98: return 'Al-Bayyinah';
      case 99: return 'Az-Zalzalah';
      case 100: return 'Al-Adiyat';
      case 101: return 'Al-Qari\'ah';
      case 102: return 'At-Takathur';
      case 103: return 'Al-Asr';
      case 104: return 'Al-Humazah';
      case 105: return 'Al-Fil';
      case 106: return 'Quraysh';
      case 107: return 'Al-Ma\'un';
      case 108: return 'Al-Kawthar';
      case 109: return 'Al-Kafirun';
      case 110: return 'An-Nasr';
      case 111: return 'Al-Masad';
      case 112: return 'Al-Ikhlas';
      case 113: return 'Al-Falaq';
      case 114: return 'An-Nas';
      default: return `Surah ${id}`;
    }
  };
  
  // Handle the smooth transition when toggling content
  const handleToggleContent = (show: boolean) => {
    if (show) {
      // When opening, just set showFullText without the opacity transition
      setAnimationComplete(false);
      setShowFullText(true);
      setIsTransitioning(true);
    } else {
      // When closing, use the fade transition
      setIsTransitioning(true);
      setShowFullText(false);
      
      // Scroll back to surah section when hiding content
      // Small delay to ensure the content starts transitioning out first
      setTimeout(() => {
        if (surahSectionRef.current) {
          surahSectionRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
      
      setTimeout(() => {
        setIsTransitioning(false);
        setAnimationComplete(false);
      }, 500);
    }
  };
  
  // GSAP animation for line-by-line reveal when content is expanded
  useEffect(() => {
    // Only run animation when content is shown and not yet animated
    if (showFullText && isTransitioning) {
      // Scroll to the top of the container
      if (containerRef.current) {
        setTimeout(() => {
          containerRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }, 100); // Small delay to ensure element is rendered
      }
      
      // Clear any existing animations
      gsap.killTweensOf(paragraphRefs.current);
      
      // Create a timeline for sequential animations
      const tl = gsap.timeline({
        onComplete: () => {
          setIsTransitioning(false);
          setAnimationComplete(true);
        }
      });
      
      // Don't hide paragraphs initially - this prevents the refresh/flash
      
      // Reveal each paragraph with a staggered delay
      tl.fromTo(
        paragraphRefs.current, 
        { opacity: 0, y: 30 }, // Start state
        {
          opacity: 1,
          y: 0,
          duration: 0.7,     // Longer duration
          stagger: 0.15,     // Slightly longer stagger
          ease: "power2.out"
        },
        0 // Start at the beginning of the timeline
      );
    }
  }, [showFullText, isTransitioning]);
  
  // Reset paragraph refs when content changes
  useEffect(() => {
    paragraphRefs.current = paragraphRefs.current.slice(0, paragraphs.length);
  }, [fullText, paragraphs.length]);

  return (
    <MainLayout onSurahSelect={handleSurahSelect}>
      {/* Add style tag for custom animations */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <div className="bg-gradient-to-br from-midnight via-primary to-violet-dark rounded-2xl shadow-xl overflow-hidden">
            <div className="relative px-6 py-12 md:py-20 backdrop-blur-sm">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-15 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-500 rounded-full"></div>
                <div className="absolute top-1/2 -left-24 w-48 h-48 bg-accent rounded-full"></div>
                <div className="absolute -bottom-24 right-1/4 w-56 h-56 bg-primary-light rounded-full"></div>
              </div>
              
              <div className="relative z-10">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                  Welcome to Quran Reader
                </h1>
                <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                  Read, study, and listen to the Holy Quran with beautiful recitations and translations.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link 
                    href="/surah/1" 
                    className="bg-gradient-accent hover:bg-accent-light text-white px-8 py-3 rounded-full transition-colors shadow-lg shadow-violet-500/30 font-medium"
                  >
                    Start Reading
                  </Link>
                  <Link 
                    href="/search" 
                    className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full transition-colors border border-white/20 font-medium"
                  >
                    Search Quran
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Surah */}
        <section className="mb-16">
          <div className="bg-black rounded-xl p-8 border border-gray-800 shadow-lg" ref={surahSectionRef}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2 text-white inline-block relative">
                Featured Surah: {getSurahName(selectedSurahId)}
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent"></span>
              </h2>
              
              <div className="text-gray-300 max-w-2xl mx-auto">
                {showFullText ? (
                  <div 
                    ref={containerRef}
                    className="text-left"
                    style={{ 
                      // Only apply transition when closing, not when opening
                      transition: !showFullText ? 'opacity 500ms' : 'none',
                      opacity: isTransitioning && !showFullText ? 0 : 1
                    }}
                  >
                    {paragraphs.map((paragraph, index) => (
                      <p 
                        key={index} 
                        className={index > 0 ? "mt-4" : ""}
                        ref={el => {
                          paragraphRefs.current[index] = el;
                        }}
                      >
                        {paragraph}
                      </p>
                    ))}
                    {/* Hide button until animation is complete */}
                    {animationComplete && (
                      <button 
                        onClick={() => handleToggleContent(false)} 
                        className="mt-8 bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center font-medium shadow-lg shadow-violet-900/30 border border-violet-500/30 mx-auto"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.007 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                        Hide Full Content
                      </button>
                    )}
                  </div>
                ) : (
                  <div className={`relative text-left transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="relative overflow-hidden" style={{ maxHeight: '300px' }}>
                      {previewParagraphs.map((paragraph, index) => (
                        <p 
                          key={index} 
                          className={`${index > 0 ? "mt-4" : ""} ${
                            index === 3 ? "blur-[2px] text-gray-400" : 
                            index === 4 ? "blur-[3px] text-gray-500" : 
                            index >= 3 ? "blur-[2px] text-gray-400" : ""
                          }`}
                        >
                          {paragraph}
                        </p>
                      ))}
                      
                      {/* Enhanced gradient overlay with pattern */}
                      <div 
                        className="absolute inset-x-0 bottom-0 h-80 pointer-events-none"
                        style={{
                          background: `
                            linear-gradient(to top, 
                              rgba(0,0,0,1) 0%, 
                              rgba(0,0,0,0.98) 15%, 
                              rgba(0,0,0,0.95) 30%, 
                              rgba(0,0,0,0.90) 45%, 
                              rgba(0,0,0,0.80) 60%,
                              rgba(0,0,0,0.60) 80%, 
                              rgba(0,0,0,0.3) 100%)
                          `,
                          backgroundSize: '100% 100%',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                        }}
                      >
                        {/* Subtle pattern overlay */}
                        <div className="absolute inset-0 opacity-15" 
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Enhanced teaser and CTA section */}
                    <div className="absolute bottom-0 w-full flex flex-col items-center text-center pb-6">
                      <p className="text-violet-200 font-semibold mb-4 px-6 text-lg leading-relaxed tracking-wide animate-pulse-subtle">
                        <span className="text-shadow-glow">Continue reading to learn about the historical background and significance of {getSurahName(selectedSurahId)}...</span>
                      </p>
                      <button 
                        onClick={() => handleToggleContent(true)} 
                        className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center font-medium shadow-lg shadow-violet-900/30 border border-violet-500/30"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        View Full Content
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <QuranView 
              surahId={selectedSurahId}
              selectedTranslation={selectedTranslation}
              onTranslationChange={handleTranslationChange}
            />
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider mb-16"></div>

        {/* Quick Access */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-white inline-block relative">
              Quick Access
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent"></span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Navigate to popular sections of the Quran or access your personalized features.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-900/30 p-6 rounded-xl shadow-md border border-violet-500/20 hover-glow transition-all duration-300">
              <h3 className="text-xl font-bold mb-4 text-violet-300 flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                <span>Popular Surahs</span>
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/surah/1" className="text-gray-200 hover:text-violet-200 transition-colors flex items-center">
                    <span className="w-6 h-6 rounded-full bg-violet-500/30 flex items-center justify-center text-xs mr-2 text-violet-200">1</span>
                    Al-Fatihah
                  </Link>
                </li>
                <li>
                  <Link href="/surah/36" className="text-gray-200 hover:text-violet-200 transition-colors flex items-center">
                    <span className="w-6 h-6 rounded-full bg-violet-500/30 flex items-center justify-center text-xs mr-2 text-violet-200">36</span>
                    Ya-Sin
                  </Link>
                </li>
                <li>
                  <Link href="/surah/55" className="text-gray-200 hover:text-violet-200 transition-colors flex items-center">
                    <span className="w-6 h-6 rounded-full bg-violet-500/30 flex items-center justify-center text-xs mr-2 text-violet-200">55</span>
                    Ar-Rahman
                  </Link>
                </li>
                <li>
                  <Link href="/surah/67" className="text-gray-200 hover:text-violet-200 transition-colors flex items-center">
                    <span className="w-6 h-6 rounded-full bg-violet-500/30 flex items-center justify-center text-xs mr-2 text-violet-200">67</span>
                    Al-Mulk
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="bg-indigo-900/30 p-6 rounded-xl shadow-md border border-indigo-500/20 hover-glow transition-all duration-300">
              <h3 className="text-xl font-bold mb-4 text-indigo-300 flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
                <span>Bookmarks</span>
              </h3>
              <p className="text-gray-300 mb-6">
                Save your favorite verses for quick access and easy reference during your studies.
              </p>
              <div className="flex justify-center">
                <Link 
                  href="/bookmarks" 
                  className="text-indigo-300 hover:text-white transition-colors flex items-center justify-center bg-indigo-500/20 hover:bg-indigo-500/30 px-5 py-2 rounded-lg"
                >
                  <span>View Bookmarks</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="bg-indigo-900/30 p-6 rounded-xl shadow-md border border-blue-500/20 hover-glow transition-all duration-300">
              <h3 className="text-xl font-bold mb-4 text-blue-300 flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Settings</span>
              </h3>
              <p className="text-gray-300 mb-6">
                Customize your reading experience with font sizes, translations, and display preferences.
              </p>
              <div className="flex justify-center">
                <Link 
                  href="/settings" 
                  className="text-blue-300 hover:text-white transition-colors flex items-center justify-center bg-blue-500/20 hover:bg-blue-500/30 px-5 py-2 rounded-lg"
                >
                  <span>Go to Settings</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
