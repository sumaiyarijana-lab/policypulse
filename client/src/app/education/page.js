'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, PlayCircle, FileText, ExternalLink, Lightbulb, 
  Share2, Star, Trophy, Award, Flame, Bookmark, CheckCircle, 
  HelpCircle, Search, Filter, Cpu, Sparkles, Zap, ArrowRight, 
  Activity, Check, AlertTriangle, ShieldCheck, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

// Cursa Course Matrix
const coursesData = [
  {
    id: 'ewaste-laws',
    title: 'National E-Waste Management Rules & Compliance',
    category: 'National Laws',
    description: 'Master CPCB 2022 guidelines, Form-3 annual filing requirements, and organizational legal obligations under national environmental frameworks.',
    difficulty: 'Intermediate',
    duration: '4.5 Hours',
    progress: 45,
    cursaLink: 'https://cursa.app/en/course/free-waste-management-and-recycling',
    icon: FileText,
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=400&h=250&fit=crop',
    topics: ['CPCB Disposal Permits', 'Legal Form-3 Filing', 'Section 4a Violation Penalties']
  },
  {
    id: 'env-safety',
    title: 'Environmental Safety Standards & Toxic Mitigation',
    category: 'Environmental Safety',
    description: 'Learn safe containment protocols for lead-acid leakages, cadmium exposure risks, and protective gears for dangerous heavy metals handling.',
    difficulty: 'Advanced',
    duration: '6.0 Hours',
    progress: 10,
    cursaLink: 'https://cursa.app/en/course/free-environmental-laws-and-policies',
    icon: ShieldCheck,
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400&h=250&fit=crop',
    topics: ['Toxic Materials Handling', 'Heavy Metal Mitigation', 'Containment Safety']
  },
  {
    id: 'recycling-guide',
    title: 'Certified Recycling Guidelines & Disassembly Safety',
    category: 'Recycling Guidelines',
    description: 'Step-by-step training on safe motherboard extraction, valuable mineral recovery, and zero-landfill electronic lifecycle guidelines.',
    difficulty: 'Beginner',
    duration: '3.5 Hours',
    progress: 80,
    cursaLink: 'https://cursa.app/en/course/free-e-waste-recycling-and-sustainability',
    icon: BookOpen,
    thumbnail: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=400&h=250&fit=crop',
    topics: ['Authorized Recycler Verification', 'Circuit Board Stripping', 'Zero-Waste Lifecycle']
  },
  {
    id: 'corporate-sust',
    title: 'Corporate IT Sustainability & Green Procurement',
    category: 'Corporate Sustainability',
    description: 'Equip your business with Green IT standards, hardware energy-efficiency targets, and carbon accounting strategies.',
    difficulty: 'Intermediate',
    duration: '5.0 Hours',
    progress: 0,
    cursaLink: 'https://cursa.app/en/course/free-corporate-sustainability-and-green-it',
    icon: Award,
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=400&h=250&fit=crop',
    topics: ['Eco-Scores Calculation', 'Green Procurement Auditing', 'Energy Star Compliance']
  },
  {
    id: 'ai-compliance',
    title: 'AI-Based Compliance Auditing & Zonal Forecasting',
    category: 'AI Surveillance',
    description: 'Examine how neural forecasting indices evaluate area violation probabilities and intercept illegal chemical dumps.',
    difficulty: 'Advanced',
    duration: '4.0 Hours',
    progress: 0,
    cursaLink: 'https://cursa.app/en/course/free-introduction-to-ai-and-smart-monitoring',
    icon: Cpu,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=400&h=250&fit=crop',
    topics: ['EPN Weights Calibration', 'Zonal Risk Forecast Regression', 'Telemetry Anomalies Detection']
  }
];

export default function SmartEducationPage() {
  const [courses, setCourses] = useState(coursesData);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarked, setBookmarked] = useState([]);
  const [streak, setStreak] = useState(5); // 5 Days learning streak
  const [complianceScore, setComplianceScore] = useState(85);
  const [redirectingCourse, setRedirectingCourse] = useState(null);
  const [redirectProgress, setRedirectProgress] = useState(0);

  // Policy Quiz State
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const quizQuestions = [
    {
      q: "Under CPCB rules, what legal Form must organizations submit annually to report active electronic decommissioning?",
      options: ["Form-1 Logistics Registry", "Form-3 Annual Return", "Form-5 Disposal Audit"],
      ans: 1
    },
    {
      q: "Which toxic heavy metal element is primarily associated with old leaking lead-acid industrial battery casings?",
      options: ["Lead (Pb)", "Cadmium (Cd)", "Mercury (Hg)"],
      ans: 0
    },
    {
      q: "If the Chennai Command Center AI evaluates an area violation probability over 70%, what status trigger fires?",
      options: ["Moderate warning review", "Automatic CPCB audit waiver", "Emergency alert & TNPCB Mobile Squad dispatch"],
      ans: 2
    }
  ];

  // Retrieve bookmarks on mount
  useEffect(() => {
    const saved = localStorage.getItem('bookmarked_courses');
    if (saved) {
      setTimeout(() => {
        setBookmarked(JSON.parse(saved));
      }, 0);
    }
  }, []);

  const handleBookmarkToggle = (id) => {
    let updated;
    if (bookmarked.includes(id)) {
      updated = bookmarked.filter(item => item !== id);
      toast.success("Bookmark removed.");
    } else {
      updated = [...bookmarked, id];
      toast.success("Saved to bookmarks queue!");
    }
    setBookmarked(updated);
    localStorage.setItem('bookmarked_courses', JSON.stringify(updated));
  };

  const handleMarkAsCompleted = (id) => {
    setCourses(courses.map(course => {
      if (course.id === id) {
        if (course.progress === 100) return course;
        setComplianceScore(prev => prev + 15);
        toast.success(`🎉 Congratulations on completing the course! Compliance index upgraded!`);
        return { ...course, progress: 100 };
      }
      return course;
    }));
  };

  const triggerCursaRedirect = (course) => {
    setRedirectingCourse(course);
    setRedirectProgress(0);
    
    // Simulate pipeline interface load
    const interval = setInterval(() => {
      setRedirectProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setRedirectingCourse(null);
            window.open(course.cursaLink, '_blank');
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const handleQuizAnswer = (idx) => {
    setSelectedAnswer(idx);
    if (idx === quizQuestions[currentQuestion].ans) {
      setQuizScore(prev => prev + 1);
      toast.success("Correct answer!");
    } else {
      toast.error("Incorrect answer!");
    }

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setQuizCompleted(true);
        setComplianceScore(prev => prev + 25);
        setStreak(prev => prev + 1);
      }
    }, 1200);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setQuizCompleted(false);
    setQuizActive(true);
  };

  // Filters calculation
  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'National Laws', 'Environmental Safety', 'Recycling Guidelines', 'Corporate Sustainability', 'AI Surveillance'];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 relative overflow-hidden font-sans">
      
      {/* Background grids */}
      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 blur-[180px] pointer-events-none rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[180px] pointer-events-none rounded-full"></div>

      <div className="max-w-[1600px] mx-auto space-y-8 relative z-10">
        
        {/* Title Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 animate-pulse">
              <Award size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest">CPCB Certifications Matrix</span>
              </div>
              <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400 tracking-tight">
                PolicyPulse Learning Center
              </h1>
              <p className="text-slate-400 text-xs mt-1">
                Deep-linked environmental courses in collaboration with the Cursa Learning App. Adhere to recycling guidelines and earn legal compliance credits.
              </p>
            </div>
          </div>

          {/* Streak tracker indicator */}
          <div className="flex items-center gap-4">
            <div className="bg-[#0f172a] border border-white/10 px-4 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-xl">
              <Flame className="text-orange-500 animate-bounce" size={20} />
              <div className="font-mono text-left">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Learning Streak</p>
                <p className="text-sm font-black text-white">{streak} DAYS ACTIVE</p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Progress Metrics and AI Banners */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
          
          {/* Circular Progress Telemetry */}
          <div className="xl:col-span-4 bg-[#0f172a]/80 border border-white/10 rounded-[32px] p-6 shadow-2xl flex flex-col justify-between items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
            
            <div className="w-full text-left font-mono border-b border-white/5 pb-3">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Training Progress Center</span>
            </div>

            {/* SVG Telemetry circle */}
            <div className="relative w-44 h-44 my-6 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="88" cy="88" r="70" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="transparent" />
                <circle 
                  cx="88" 
                  cy="88" 
                  r="70" 
                  stroke="url(#progressGlow)" 
                  strokeWidth="12" 
                  fill="transparent" 
                  strokeDasharray="440"
                  strokeDashoffset={440 - (440 * complianceScore) / 150} 
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="progressGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute space-y-1">
                <p className="text-3xl font-black text-white">{complianceScore}</p>
                <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Compliance Rating</p>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 text-left font-mono text-[10px] border-t border-white/5 pt-4">
              <div>
                <span className="text-slate-500 block">ZONAL RANKING:</span>
                <span className="text-emerald-400 font-bold">TOP 4% (GUINDY)</span>
              </div>
              <div>
                <span className="text-slate-500 block">BADGES AWARDED:</span>
                <span className="text-blue-400 font-bold">5 GREEN CERTIFIED</span>
              </div>
            </div>
          </div>

          {/* AI Recommendations Panel */}
          <div className="xl:col-span-8 bg-[#0f172a]/80 border border-white/10 rounded-[32px] p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-teal-500"></div>

            <div className="space-y-4">
              <div className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full font-mono text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-max">
                <Sparkles size={12} className="animate-pulse" /> Neural Learning Engine recommendation
              </div>
              <h2 className="text-2xl font-black tracking-tight leading-snug">
                National RoHS & heavy metal exposure compliance course is recommended for your organization.
              </h2>
              <p className="text-slate-400 text-xs leading-relaxed max-w-2xl font-sans">
                Based on your office location inside the Ambattur electronic manufacturing cluster, our algorithm recommends completing the Cursa certified e-waste containment guidelines.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 border-t border-white/5 pt-6 mt-6">
              <button 
                onClick={() => triggerCursaRedirect(courses[0])}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:opacity-90 text-white font-bold font-mono px-5 py-3 rounded-xl text-xs flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-emerald-500/10"
              >
                START AI PATHWAY <ArrowRight size={14} />
              </button>
              
              <button 
                onClick={() => setQuizActive(true)}
                className="bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-bold font-mono px-5 py-3 rounded-xl text-xs flex items-center gap-1.5"
              >
                <HelpCircle size={14} className="text-blue-400" /> TAKE LAW QUIZ
              </button>
            </div>
          </div>
        </div>

        {/* Courses Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0f172a]/40 border border-white/5 p-4 rounded-3xl">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  selectedCategory === cat 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-3 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search policies / guidelines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs outline-none focus:border-blue-500/50 transition-all font-mono"
            />
          </div>
        </div>

        {/* Main Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredCourses.map((course, idx) => {
              const IconComponent = course.icon;
              const isSaved = bookmarked.includes(course.id);
              const progressColor = 
                course.progress === 100 ? 'bg-emerald-500' :
                course.progress > 40 ? 'bg-orange-500' :
                'bg-blue-500';

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-[#0f172a]/80 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col group relative"
                >
                  {/* Thumbnail Banner */}
                  <div className="h-48 w-full relative overflow-hidden">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                    
                    {/* Category Overlay Tag */}
                    <div className="absolute top-4 left-4 bg-slate-950/80 border border-white/10 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-mono font-black uppercase tracking-widest text-slate-200">
                      {course.category}
                    </div>

                    <button 
                      onClick={() => handleBookmarkToggle(course.id)}
                      className="absolute top-4 right-4 w-9 h-9 bg-slate-950/80 border border-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-slate-300 hover:text-yellow-500 transition-colors active:scale-95"
                    >
                      <Bookmark size={15} fill={isSaved ? "currentColor" : "none"} className={isSaved ? 'text-yellow-500' : ''} />
                    </button>
                  </div>

                  {/* Body Contents */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                        <IconComponent size={12} className="text-blue-400" />
                        <span>{course.difficulty}</span>
                        <span>&bull;</span>
                        <span>{course.duration}</span>
                      </div>
                      <h3 className="text-lg font-black leading-snug group-hover:text-blue-400 transition-colors">{course.title}</h3>
                      <p className="text-slate-400 text-xs leading-relaxed font-sans">{course.description}</p>
                    </div>

                    {/* Topics sub-checklist */}
                    <div className="bg-slate-950/60 rounded-xl p-3 border border-white/5 space-y-1 text-[10px] font-mono">
                      {course.topics.map((t, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-slate-300">
                          <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>

                    {/* Progress indicator */}
                    <div className="space-y-1.5 font-mono text-[10px]">
                      <div className="flex justify-between text-slate-500">
                        <span>COURSE PROGRESS:</span>
                        <span className="font-bold text-slate-300">{course.progress}% COMPLETE</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
                        <div className={`h-full ${progressColor} transition-all duration-500`} style={{ width: `${course.progress}%` }}></div>
                      </div>
                    </div>

                    {/* Navigation redirect & completion triggers */}
                    <div className="flex items-center gap-2 pt-2">
                      <button 
                        onClick={() => triggerCursaRedirect(course)}
                        className="flex-grow bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg active:scale-95"
                      >
                        LEARN IN CURSA <ExternalLink size={12} />
                      </button>

                      {course.progress < 100 && (
                        <button 
                          onClick={() => handleMarkAsCompleted(course.id)}
                          className="w-10 h-10 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/50 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-400 transition-all"
                          title="Mark Course Completed"
                        >
                          <Check size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>

      {/* QUIZ INTERACTIVE DIALOG MODAL */}
      <AnimatePresence>
        {quizActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0f172a] border border-white/15 rounded-[36px] max-w-xl w-full p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500"></div>

              {!quizCompleted ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4 font-mono text-xs">
                    <span className="text-slate-500">E-WASTE POLICY QUIZ: QUESTION {currentQuestion + 1} OF {quizQuestions.length}</span>
                    <button onClick={() => setQuizActive(false)} className="text-slate-400 hover:text-white">&times; CLOSE</button>
                  </div>

                  <h3 className="text-xl font-bold font-sans leading-snug">{quizQuestions[currentQuestion].q}</h3>

                  <div className="space-y-3 pt-2">
                    {quizQuestions[currentQuestion].options.map((option, idx) => {
                      const isSelected = selectedAnswer === idx;
                      const isCorrect = idx === quizQuestions[currentQuestion].ans;
                      const borderStyle = 
                        selectedAnswer !== null 
                          ? isCorrect 
                            ? 'border-emerald-500 bg-emerald-950/20' 
                            : isSelected 
                              ? 'border-red-500 bg-red-950/20'
                              : 'border-white/5'
                          : 'border-white/10 hover:border-blue-500/50 hover:bg-white/5';

                      return (
                        <button
                          key={idx}
                          disabled={selectedAnswer !== null}
                          onClick={() => handleQuizAnswer(idx)}
                          className={`w-full text-left px-5 py-4 border rounded-2xl text-xs font-mono font-bold transition-all flex justify-between items-center ${borderStyle}`}
                        >
                          <span>{option}</span>
                          {selectedAnswer !== null && isCorrect && <CheckCircle size={16} className="text-emerald-400" />}
                          {selectedAnswer !== null && isSelected && !isCorrect && <AlertTriangle size={16} className="text-red-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-6 text-center py-6">
                  <div className="w-20 h-20 mx-auto bg-emerald-500/10 border border-emerald-500 rounded-full flex items-center justify-center text-emerald-400 animate-bounce">
                    <Trophy size={40} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black">Environmental Quiz Completed!</h3>
                    <p className="text-slate-400 text-xs font-mono">You scored {quizScore} out of {quizQuestions.length} correct compliance indices.</p>
                  </div>

                  <div className="bg-slate-950 p-4 border border-white/5 rounded-2xl inline-block max-w-sm mx-auto font-mono text-[10px] space-y-1 text-left">
                    <p className="text-emerald-400 font-bold flex items-center gap-1"><Check size={12}/> Earned Badge: CPCB Green Champion Shield</p>
                    <p className="text-slate-500">Compliance learning score upgraded by +25 points. Training streak verified!</p>
                  </div>

                  <div className="flex justify-center gap-3 pt-4">
                    <button 
                      onClick={resetQuiz} 
                      className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold font-mono px-5 py-3 rounded-xl text-xs"
                    >
                      TRY AGAIN
                    </button>
                    <button 
                      onClick={() => setQuizActive(false)} 
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono px-5 py-3 rounded-xl text-xs"
                    >
                      CONTINUE LEARNING
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PIPELINE LINK DEEP-LINK REDIRECTION DIALOG OVERLAY */}
      <AnimatePresence>
        {redirectingCourse && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          >
            <div className="max-w-md w-full text-center space-y-6">
              {/* Spinning Loader */}
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="38" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
                  <circle 
                    cx="48" 
                    cy="48" 
                    r="38" 
                    stroke="#10b981" 
                    strokeWidth="6" 
                    fill="transparent" 
                    strokeDasharray="240"
                    strokeDashoffset={240 - (240 * redirectProgress) / 100} 
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute font-mono text-xs text-slate-300 font-bold">
                  {redirectProgress}%
                </div>
              </div>

              <div className="space-y-2">
                <div className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-mono text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 mx-auto w-max">
                  <Activity size={10} className="animate-pulse" /> Interfacing with Cursa API
                </div>
                <h3 className="text-xl font-bold font-sans">Routing to Cursa Platform</h3>
                <p className="text-slate-400 text-xs font-mono leading-relaxed max-w-sm mx-auto">
                  Establishing deep-link pipeline with Cursa app/browser. Launching corresponding policy training portal for <strong>{redirectingCourse.title}</strong>...
                </p>
              </div>

              <div className="w-48 bg-slate-900 border border-white/5 rounded-2xl p-3 mx-auto font-mono text-[9px] text-slate-500">
                Opening in App or Website...
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
