import { useState, useCallback } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Star, Send, MessageCircle, CheckCircle2,
  Smile, Meh, Frown, ThumbsUp, Zap, BookOpen
} from "lucide-react";

type AgeGroup = "8-10" | "10-12" | "12-14" | "14-18" | "18+" | "parent" | "educator";
type Rating = 1 | 2 | 3 | 4 | 5;
type Mode = "explorer" | "flight_deck" | "scholar" | "all";

const AGE_GROUPS: { value: AgeGroup; label: string; emoji: string }[] = [
  { value: "8-10", label: "Ages 8\u201310", emoji: "\ud83c\udf31" },
  { value: "10-12", label: "Ages 10\u201312", emoji: "\u2694\ufe0f" },
  { value: "12-14", label: "Ages 12\u201314", emoji: "\ud83e\udde0" },
  { value: "14-18", label: "Ages 14\u201318", emoji: "\ud83d\ude80" },
  { value: "18+", label: "Ages 18+", emoji: "\ud83c\udf93" },
  { value: "parent", label: "Parent / Guardian", emoji: "\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67" },
  { value: "educator", label: "Educator / Teacher", emoji: "\ud83d\udcda" },
];

const MODES: { value: Mode; label: string; color: string }[] = [
  { value: "explorer", label: "Explorer (Tap & Discover)", color: "text-red-400" },
  { value: "flight_deck", label: "Flight Deck (Dearden Field)", color: "text-cyan-400" },
  { value: "scholar", label: "Scholar (FITS + D20)", color: "text-amber-400" },
  { value: "all", label: "Tried All Modes", color: "text-purple-400" },
];

const ENGAGEMENT_QUESTIONS = [
  {
    id: "overall_fun",
    question: "How fun was the experience overall?",
    type: "rating" as const,
  },
  {
    id: "want_to_continue",
    question: "Did you want to keep playing or did you feel like stopping?",
    type: "choice" as const,
    options: [
      { value: "wanted_more", label: "I wanted to keep going!", icon: ThumbsUp },
      { value: "was_ok", label: "It was okay, I could take it or leave it", icon: Meh },
      { value: "wanted_to_stop", label: "I felt like stopping before finishing", icon: Frown },
    ],
  },
  {
    id: "favourite_moment",
    question: "What was your favourite moment or thing you discovered?",
    type: "text" as const,
    placeholder: "Tell us about the best part...",
  },
  {
    id: "clicking_feel",
    question: "How did the clicking/tapping feel?",
    type: "choice" as const,
    options: [
      { value: "just_right", label: "Just right \u2014 each tap felt rewarding", icon: Smile },
      { value: "bit_much", label: "A bit repetitive after a while", icon: Meh },
      { value: "too_much", label: "Too much clicking, not enough variety", icon: Frown },
    ],
  },
  {
    id: "story_engagement",
    question: "Did the story and world make you curious to learn more?",
    type: "rating" as const,
  },
  {
    id: "what_would_improve",
    question: "If you could change one thing, what would it be?",
    type: "text" as const,
    placeholder: "Your honest feedback helps us make it better...",
  },
  {
    id: "would_recommend",
    question: "Would you recommend this to a friend?",
    type: "choice" as const,
    options: [
      { value: "definitely", label: "Definitely!", icon: ThumbsUp },
      { value: "maybe", label: "Maybe, with some changes", icon: Meh },
      { value: "not_yet", label: "Not yet \u2014 needs work first", icon: Frown },
    ],
  },
  {
    id: "sound_feedback",
    question: "Did the sounds and visual effects make discoveries feel exciting?",
    type: "rating" as const,
  },
  {
    id: "additional_comments",
    question: "Anything else you'd like to tell us?",
    type: "text" as const,
    placeholder: "Free space for any thoughts, ideas, or suggestions...",
  },
];

function StarRating({ value, onChange }: { value: Rating | null; onChange: (r: Rating) => void }) {
  return (
    <div className="flex gap-2 justify-center py-2">
      {([1, 2, 3, 4, 5] as Rating[]).map(r => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`transition-all duration-200 ${
            value && r <= value
              ? "text-amber-400 scale-110"
              : "text-muted-foreground/30 hover:text-amber-400/50"
          }`}
        >
          <Star className="w-8 h-8" fill={value && r <= value ? "currentColor" : "none"} />
        </button>
      ))}
    </div>
  );
}

export default function AppraisalQuestionnaire() {
  const { user } = useAuth();
  const [step, setStep] = useState<"intro" | "demographics" | "questions" | "submitted">("intro");
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitFeedback = trpc.system.notifyOwner.useMutation();

  const handleAnswer = useCallback((id: string, value: string | number) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const feedbackData = {
        ageGroup,
        mode,
        answers,
        userName: user?.name || "Anonymous",
        timestamp: new Date().toISOString(),
      };
      await submitFeedback.mutateAsync({
        title: `Appraisal Questionnaire \u2014 ${ageGroup} \u2014 ${mode}`,
        content: JSON.stringify(feedbackData, null, 2),
      });
      setStep("submitted");
    } catch {
      setStep("submitted");
    }
    setIsSubmitting(false);
  }, [ageGroup, mode, answers, user]);

  const currentQuestion = ENGAGEMENT_QUESTIONS[currentQ];
  const progress = step === "questions" ? ((currentQ + 1) / ENGAGEMENT_QUESTIONS.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background text-foreground mobile-content-pad">
      <header className="sticky top-0 z-20 border-b border-amber-500/20 backdrop-blur-md bg-background/90">
        <div className="container flex items-center justify-between h-12">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground gap-1">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-amber-400" />
              <span className="font-heading text-sm font-bold text-amber-400">APPRAISAL</span>
            </div>
          </div>
          {step === "questions" && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{currentQ + 1}/{ENGAGEMENT_QUESTIONS.length}</span>
              <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="container max-w-lg mx-auto py-8 px-4">
        <AnimatePresence mode="wait">
          {/* INTRO */}
          {step === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-6"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-amber-400" />
              </div>
              <h1 className="font-heading text-2xl font-bold">Playtest Appraisal</h1>
              <p className="text-muted-foreground leading-relaxed">
                You've just explored 12,000 years of civilisational infrastructure.
                Your honest feedback helps us make this experience better for everyone.
              </p>
              <p className="text-xs text-muted-foreground/60">
                Takes about 2 minutes. All responses are anonymous unless you choose to share your name.
              </p>
              <Button
                onClick={() => setStep("demographics")}
                className="bg-amber-600 hover:bg-amber-500 text-black font-heading tracking-wider px-8"
                size="lg"
              >
                <Zap className="w-4 h-4 mr-2" /> Start Appraisal
              </Button>
            </motion.div>
          )}

          {/* DEMOGRAPHICS */}
          {step === "demographics" && (
            <motion.div
              key="demographics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 className="font-heading text-lg font-bold text-center">Which age group are you?</h2>
                <div className="grid grid-cols-2 gap-2">
                  {AGE_GROUPS.map(ag => (
                    <button
                      key={ag.value}
                      onClick={() => setAgeGroup(ag.value)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        ageGroup === ag.value
                          ? "border-amber-500 bg-amber-500/10 text-amber-400"
                          : "border-border hover:border-amber-500/30 text-muted-foreground"
                      }`}
                    >
                      <span className="text-lg mr-2">{ag.emoji}</span>
                      <span className="text-sm font-medium">{ag.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="font-heading text-lg font-bold text-center">Which mode did you play?</h2>
                <div className="space-y-2">
                  {MODES.map(m => (
                    <button
                      key={m.value}
                      onClick={() => setMode(m.value)}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        mode === m.value
                          ? "border-amber-500 bg-amber-500/10"
                          : "border-border hover:border-amber-500/30"
                      }`}
                    >
                      <span className={`text-sm font-medium ${m.color}`}>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => setStep("questions")}
                disabled={!ageGroup || !mode}
                className="w-full bg-amber-600 hover:bg-amber-500 text-black font-heading tracking-wider"
                size="lg"
              >
                Continue to Questions
              </Button>
            </motion.div>
          )}

          {/* QUESTIONS */}
          {step === "questions" && currentQuestion && (
            <motion.div
              key={`q-${currentQ}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <p className="text-xs text-amber-400 font-mono uppercase tracking-wider">
                  Question {currentQ + 1} of {ENGAGEMENT_QUESTIONS.length}
                </p>
                <h2 className="font-heading text-xl font-bold leading-tight">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Rating type */}
              {currentQuestion.type === "rating" && (
                <div className="py-4">
                  <StarRating
                    value={(answers[currentQuestion.id] as Rating) || null}
                    onChange={(r) => handleAnswer(currentQuestion.id, r)}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground/50 px-2 mt-1">
                    <span>Not at all</span>
                    <span>Absolutely!</span>
                  </div>
                </div>
              )}

              {/* Choice type */}
              {currentQuestion.type === "choice" && "options" in currentQuestion && (
                <div className="space-y-3 py-2">
                  {currentQuestion.options.map(opt => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(currentQuestion.id, opt.value)}
                        className={`w-full p-4 rounded-lg border text-left flex items-center gap-3 transition-all ${
                          answers[currentQuestion.id] === opt.value
                            ? "border-amber-500 bg-amber-500/10 text-amber-400"
                            : "border-border hover:border-amber-500/30 text-muted-foreground"
                        }`}
                      >
                        <Icon className="w-5 h-5 shrink-0" />
                        <span className="text-sm">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Text type */}
              {currentQuestion.type === "text" && (
                <div className="py-2">
                  <textarea
                    value={(answers[currentQuestion.id] as string) || ""}
                    onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                    placeholder={"placeholder" in currentQuestion ? currentQuestion.placeholder : ""}
                    className="w-full h-32 p-4 rounded-lg border border-border bg-background text-foreground resize-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 outline-none text-sm"
                  />
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-3">
                {currentQ > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQ(prev => prev - 1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                )}
                {currentQ < ENGAGEMENT_QUESTIONS.length - 1 ? (
                  <Button
                    onClick={() => setCurrentQ(prev => prev + 1)}
                    disabled={!answers[currentQuestion.id]}
                    className="flex-1 bg-amber-600 hover:bg-amber-500 text-black font-heading"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !answers[currentQuestion.id]}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-black font-heading"
                  >
                    {isSubmitting ? "Submitting..." : (
                      <>
                        <Send className="w-4 h-4 mr-2" /> Submit Appraisal
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Skip option for text questions */}
              {currentQuestion.type === "text" && !answers[currentQuestion.id] && (
                <button
                  onClick={() => {
                    handleAnswer(currentQuestion.id, "(skipped)");
                    if (currentQ < ENGAGEMENT_QUESTIONS.length - 1) {
                      setCurrentQ(prev => prev + 1);
                    }
                  }}
                  className="w-full text-center text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                >
                  Skip this question
                </button>
              )}
            </motion.div>
          )}

          {/* SUBMITTED */}
          {step === "submitted" && (
            <motion.div
              key="submitted"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-8"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              <h1 className="font-heading text-2xl font-bold">Thank You!</h1>
              <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                Your feedback has been recorded and will help shape the future of
                Infrastructure Academy. Every response matters.
              </p>
              <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5 text-sm text-amber-400/80">
                Your appraisal has been sent to the project team for review.
              </div>
              <div className="flex gap-3 justify-center pt-4">
                <Link href="/">
                  <Button variant="outline" className="font-heading">
                    Back to Home
                  </Button>
                </Link>
                <Link href="/explorer">
                  <Button className="bg-amber-600 hover:bg-amber-500 text-black font-heading">
                    Play Again
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
