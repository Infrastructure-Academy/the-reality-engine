import { useState, useEffect, useMemo } from "react";
import { useParams, useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import {
  Swords, Zap, Trophy, ArrowRight, Sparkles, Shield, Star
} from "lucide-react";

function getGuestId() {
  let id = localStorage.getItem("tre_guest_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("tre_guest_id", id);
  }
  return id;
}

export default function ChallengeLanding() {
  const params = useParams<{ code: string }>();
  const [, navigate] = useLocation();
  const code = params.code?.toUpperCase() || "";

  const { data: challenge, isLoading, error } = trpc.challenge.getByCode.useQuery(
    { code },
    { enabled: !!code, retry: 1 }
  );

  const guestId = useMemo(() => getGuestId(), []);
  const profileMutation = trpc.profile.getOrCreate.useMutation();
  const acceptMutation = trpc.challenge.accept.useMutation();
  const [accepted, setAccepted] = useState(false);

  const handleAcceptChallenge = async () => {
    try {
      const profile = await profileMutation.mutateAsync({ guestId, mode: "explorer" });
      if (profile && challenge) {
        await acceptMutation.mutateAsync({ code, acceptorProfileId: profile.id });
        setAccepted(true);
        setTimeout(() => navigate("/explore"), 2000);
      }
    } catch {
      navigate("/explore");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Swords className="w-12 h-12 text-amber-400 mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground font-mono tracking-wider">DECODING CHALLENGE...</p>
        </motion.div>
      </div>
    );
  }

  if (!challenge || error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-6"
        >
          <Shield className="w-16 h-16 text-red-400/60 mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-bold mb-2">Challenge Not Found</h1>
          <p className="text-muted-foreground mb-6">
            This challenge code may have expired or doesn't exist. Start your own odyssey instead.
          </p>
          <Link href="/explore">
            <Button className="gap-2 bg-amber-600 hover:bg-amber-500">
              <Sparkles className="w-4 h-4" /> Start Explorer Mode
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 2 }}
          >
            <Swords className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          </motion.div>
          <h1 className="font-heading text-3xl font-bold text-amber-400 mb-2">CHALLENGE ACCEPTED</h1>
          <p className="text-muted-foreground">Launching Explorer Mode...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground mobile-content-pad">
      <SiteHeader title="Challenge" showBack />
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg w-full text-center"
        >
          {/* Challenge badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10">
              <Swords className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-mono tracking-wider text-amber-400">CHALLENGE RECEIVED</span>
            </div>
          </motion.div>

          {/* Sender card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card/50 border border-border/50 rounded-xl p-6 mb-8 backdrop-blur-sm"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="w-6 h-6 text-amber-400" />
              <h2 className="font-heading text-xl font-bold">
                {challenge.senderName || "A Fellow Explorer"}
              </h2>
            </div>

            <p className="text-amber-400 font-heading text-lg mb-4">
              "{challenge.senderArchetype}"
            </p>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>{((challenge.senderXp ?? 0) / 1000).toFixed(0)}K XP</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400" />
                <span>{challenge.senderRelays}/12 Relays</span>
              </div>
            </div>

            {challenge.message && (
              <p className="mt-4 text-sm text-muted-foreground italic border-t border-border/30 pt-4">
                "{challenge.message}"
              </p>
            )}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg text-muted-foreground mb-6">
              Can you beat their pattern? Navigate 12,000 years of civilisational infrastructure and discover your own archetype.
            </h3>

            <Button
              size="lg"
              onClick={handleAcceptChallenge}
              disabled={profileMutation.isPending || acceptMutation.isPending}
              className="gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-heading tracking-wider text-lg px-8 py-6"
            >
              {profileMutation.isPending || acceptMutation.isPending ? (
                "ACCEPTING..."
              ) : (
                <>
                  ACCEPT CHALLENGE <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>

            <p className="mt-4 text-xs text-muted-foreground">
              You'll start at Relay 1: Fire — the beginning of all infrastructure
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
