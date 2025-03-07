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
  const fatihahText = `Period of Revelation
Surah Al-Fatihah is among the earliest revelations to Prophet Muhammad. Authentic traditions indicate it was the first complete Surah revealed to him. Prior to this, only scattered verses from Surahs like Alaq, Muzzammil, and Muddaththir had been revealed.
Theme
This Surah is essentially a prayer taught by Allah to those who wish to study His book. Positioned at the Quran's beginning, it instructs readers that sincere benefit from the Quran requires praying to the Lord for guidance. Al-Fatihah aims to instill a strong desire in readers to seek divine guidance, emphasizing that true knowledge originates from Allah alone. Thus, readers should approach the Quran as seekers of truth, beginning their study with a prayer for guidance. Al-Fatihah represents the servant's prayer, while the Quran is Allah's response, providing the guidance requested, symbolizing a dialogue between the servant's plea and the Master's answer.`;
  
  // Surah Al-Baqarah description
  const baqarahText = `"Al-Baqarah" (The Cow) is named after a story within the Surah (verses 67-73). The name does not suggest that the Surah primarily discusses the story of the Cow; rather, it is a symbolic title. Like many Surahs, its name does not encompass the broad themes discussed within. This naming convention highlights the limitations of language in capturing the full scope of spiritual texts.
Sequence
Al-Baqarah is a Madani Surah, following the Makki Surah Al-Fatihah, which ends with a prayer for guidance. Al-Baqarah begins by responding to this prayer, establishing itself as a book of guidance. Revealed primarily during the first two years after the Prophet's migration to Medina, it includes verses from both early and later periods of revelation to address themes relevant to its overall message, such as the prohibition of interest.
Historical Background
In Mecca, the Quran addressed the polytheistic Quraysh who were unfamiliar with monotheistic principles. In contrast, in Medina, it also engaged with Jews knowledgeable about monotheism and prophethood, yet who had deviated from their religious teachings over the centuries. They had altered their scriptures and clung to ritualistic practices devoid of spiritual essence. The Surah criticizes their moral and religious decay and invites them to return to the true monotheistic faith, akin to that which was taught to Moses. This context is crucial for understanding the Surah's emphasis on communal laws and moral fortitude, necessary for the nascent Muslim community in Medina facing external threats and internal discord marked by the emergence of hypocrites within the community.`;

  // Surah Al-i-Imran description
  const imranText = `Period of Revelation
Surah Al-i-Imran (Family of Imran) was revealed in Madinah shortly after the Battle of Badr in the third year of Hijrah. It addresses the aftermath of this pivotal battle, particularly the Christian delegation from Najran that came to discuss theological matters with the Prophet in the fourth year of Hijrah. This context explains the Surah's extensive discourse on Christianity.

Theme and Subject Matter
This Surah continues the themes introduced in Al-Baqarah, focusing on invitation to the Divine Message with specific attention to the People of the Book (primarily Christians). It extends the foundational message of Islam and confronts arguments from those who rejected it, particularly addressing theological discussions with Christians from Najran.

The Surah establishes Islam as the true religion of all previous Prophets, positioning it as a continuation of authentic divine guidance and refuting the notion that it was a new religion. The message remains consistent: surrender completely to Allah's will, which has been the essence of all true religions throughout history.

This Surah refines the Islamic community after their victory at Badr and addresses their subsequent defeat at Uhud, using both experiences to strengthen their faith and resolve. It focuses on preparing believers to fulfill their role as Allah's witnesses to humanity, emphasizing that their strength lies not in numbers or resources but in their faith, righteousness, moral superiority, and unwavering commitment to Allah.

Key Points and Structure
1. The Surah begins by affirming the Divine origin of the Quran, establishing it as the criterion for judging what is right and what is wrong.
2. It addresses Christians extensively, inviting them to believe in the complete Book of Allah, not just parts of it, and to refrain from introducing innovations in religion.
3. It addresses the Muslim community, preparing them for their role of leadership after the Jews and Christians had failed in their responsibilities.
4. It presents Islam as the true religion of Allah, consistent with all previous revelations, and explains the deviation of Jews and Christians from their original teachings.
5. The Surah extensively discusses the Battle of Uhud, using it as a practical lesson in community building, highlighting how true faith is tested in adversity.
6. It concludes by exhorting believers to exercise patience, demonstrate steadfastness, and maintain a strong frontier against enemies of faith, emphasizing that success comes from Allah, not from numerical or material superiority.

This Surah represents a crucial phase in the development of the Muslim community, transitioning them from the elation of Badr to the sobering reality of Uhud, thus preparing them for their long-term responsibility as bearers of Allah's message to humanity.`;

  // Surah An-Nisa description
  const nisaText = `Period of Revelation
Surah An-Nisa (The Women) was revealed during the period between the aftermath of the Battle of Uhud (3 A.H.) and the Treaty of Hudaibiyah (6 A.H.). Most of it was likely revealed after the Battle of the Trench (5 A.H.). The Surah addresses social reforms, inheritance laws, marriage regulations, and the rights of women and orphans, indicating that it came at a time when the Muslim community in Madinah was establishing its social structure.

Theme and Subject Matter
This Surah primarily addresses the internal organization of the Muslim community, focusing on social reforms with particular emphasis on women's rights, family relations, inheritance, and marriage laws. It also extensively deals with the hypocrites (munafiqin) who had become a significant concern for the Muslim community in Madinah.

The Surah begins with addressing the entirety of humanity, reminding them of their common origin from a single soul (Adam), establishing universal human brotherhood as the foundation for social reforms. It then proceeds to legislate comprehensive rules regarding orphans, inheritance, marriage, family relations, and women's rights, revolutionizing the social structure prevalent in Arabia at that time.

A substantial portion of the Surah addresses the hypocrites, their characteristics, behaviors, and the threat they posed to the Muslim community. It provides guidance on how to deal with them and warns believers about their deceptive tactics.

The Surah also addresses the People of the Book, particularly Christians, regarding their theological deviations, inviting them to the pure monotheism of Islam. It refutes their doctrines, especially regarding the divinity of Jesus, presenting the correct understanding of his mission and message.

Throughout the Surah, there is an emphasis on justice, equity, and compassion as the foundations of an Islamic society. It establishes that the rights of all members of society, particularly the vulnerable - orphans, women, and the weak - must be protected and honored.

The Surah also contains discussions about jihad, the Islamic legal system, the importance of leadership, and the concept of loyalty to the Islamic cause, indicating that these aspects are integral to social reforms and the establishment of a just society.

Key Features and Structure
1. Social legislation forms the core of this Surah, with detailed rules about inheritance, marriage, divorce, and care for orphans and women.
2. The discussion of hypocrites reveals the internal challenges faced by the developing Muslim community.
3. The theological discourse with the People of the Book, particularly Christians, clarifies Islamic monotheism and the true nature of Jesus's message.
4. The emphasis on justice and equity as fundamental principles in all social interactions and relationships.
5. The interconnection between faith, social justice, and communal solidarity is established as essential for an Islamic society.

This Surah represents a comprehensive blueprint for social organization based on divine principles, highlighting that Islam is not merely a set of rituals but a complete system for organizing human society on the foundations of justice, compassion, and faith.`;

  // Surah Al-Ma'idah description
  const maidahText = `Period of Revelation
Surah Al-Ma'idah (The Table Spread) was one of the last major Surahs to be revealed, coming down during the final period of the Prophet Muhammad's life. Most scholars believe it was revealed in 5-6 A.H., after the Treaty of Hudaibiyah but before the Conquest of Makkah. Some portions were revealed during the Farewell Pilgrimage in 10 A.H., including the famous verse declaring the perfection of religion (verse 3).

Theme and Subject Matter
As one of the final major revelations, Al-Ma'idah serves as a comprehensive summary and conclusion to the legislative aspects of the Quran. It addresses a community that had already established itself and was now poised to fully implement divine law in all aspects of life. The Surah's distinguishing feature is its emphasis on fulfilling covenants, promises, and obligations—both with Allah and with fellow human beings.

The name "Al-Ma'idah" (The Table Spread) comes from the story of disciples of Jesus who requested a table spread with food from heaven, highlighting the theme of divine provision alongside human responsibility. This narrative serves as a reminder about maintaining faith in divine support while fulfilling one's obligations.

The Surah extensively addresses the People of the Book (Jews and Christians), reviewing their historical covenants with Allah and their subsequent violations of these agreements. It invites them to recognize the Prophet Muhammad as fulfilling the promises made in their scriptures while warning against the consequences of continued rejection.

A significant portion of the Surah is dedicated to legal rulings (ahkam), covering food laws, ritual purity, criminal law, testimony, and governance. These regulations complete the legal framework necessary for an Islamic society and emphasize that faith must be expressed through adherence to divine law.

The Surah also addresses social relations with non-Muslims, establishing principles for interaction with other communities while maintaining Islamic identity and values. It sets parameters for tolerance while prohibiting compromise on fundamental religious principles.

Key Features and Structure
1. The opening emphasizes fulfilling contracts and obligations as a fundamental Islamic principle.
2. Detailed food laws establish boundaries while rejecting unnecessary religious restrictions.
3. Legal rulings on various aspects of life complete the Shariah framework.
4. Historical accounts of previous prophets and their communities serve as warnings and lessons.
5. Extensive discourse with the People of the Book clarifies theological differences while extending an invitation to true monotheism.
6. The declaration of the perfection of religion marks the culmination of religious legislation.

This Surah represents the maturity of Islamic legislation, coming at a time when Muslims were prepared to implement divine law in its entirety. It serves as a comprehensive guide for a community transitioning from formation to consolidation, emphasizing that fulfilling covenants with Allah requires implementing His laws in personal and collective life.`;

  // Select the appropriate text based on selectedSurahId
  const fullText = selectedSurahId === 1 ? fatihahText : 
                 selectedSurahId === 2 ? baqarahText : 
                 selectedSurahId === 3 ? imranText : 
                 selectedSurahId === 4 ? nisaText : 
                 selectedSurahId === 5 ? maidahText : baqarahText;

  // Split the full text into paragraphs
  const paragraphs = fullText.split('\n');
  // Get the first 5 paragraphs for the preview
  const previewParagraphs = paragraphs.slice(0, 5);
  
  // Helper function to get surah name
  const getSurahName = (id: number): string => {
    switch(id) {
      case 1: return 'Al-Fatihah';
      case 2: return 'Al-Baqarah';
      case 3: return 'Al-i-Imran';
      case 4: return 'An-Nisa';
      case 5: return 'Al-Ma\'idah';
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
