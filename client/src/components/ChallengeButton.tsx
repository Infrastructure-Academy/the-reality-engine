import { useState } from "react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Swords, Copy, Check, Share2, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChallengeButtonProps {
  profileId: number;
  senderName: string;
  senderArchetype: string;
  senderXp: number;
  senderRelays: number;
}

export function ChallengeButton({
  profileId,
  senderName,
  senderArchetype,
  senderXp,
  senderRelays,
}: ChallengeButtonProps) {
  const [challengeCode, setChallengeCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [message, setMessage] = useState("");

  const createChallenge = trpc.challenge.create.useMutation();

  const handleCreate = async () => {
    try {
      const result = await createChallenge.mutateAsync({
        profileId,
        senderName,
        senderArchetype,
        senderXp,
        senderRelays,
        message: message || undefined,
      });
      if (result) {
        setChallengeCode(result.code);
      }
    } catch (err) {
      console.error("Failed to create challenge:", err);
    }
  };

  const challengeUrl = challengeCode
    ? `${window.location.origin}/challenge/${challengeCode}`
    : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(challengeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = challengeUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    const shareText = `I'm "${senderArchetype}" in The Reality Engine! Can you beat my pattern? ${challengeUrl}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "The Reality Engine — Challenge",
          text: shareText,
          url: challengeUrl,
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  if (challengeCode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/50 border border-amber-500/30 rounded-xl p-5 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Swords className="w-5 h-5 text-amber-400" />
          <span className="font-heading text-sm tracking-wider text-amber-400">CHALLENGE CREATED</span>
        </div>

        <div className="bg-background/60 border border-border/50 rounded-lg p-3 mb-4 font-mono text-lg tracking-[0.3em] text-center text-foreground">
          {challengeCode}
        </div>

        <div className="flex gap-2 justify-center mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-1.5 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Link"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-1.5 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
          >
            <Share2 className="w-4 h-4" /> Share
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Send this link to a friend — they'll see your archetype and start at Relay 1
        </p>
      </motion.div>
    );
  }

  return (
    <div className="text-center">
      <AnimatePresence>
        {showMessageInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message (optional)..."
              maxLength={200}
              className="w-full bg-background/60 border border-border/50 rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none h-20 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2 justify-center">
        <Button
          onClick={handleCreate}
          disabled={createChallenge.isPending}
          className="gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-heading tracking-wider"
        >
          <Swords className="w-4 h-4" />
          {createChallenge.isPending ? "Creating..." : "Challenge a Friend"}
        </Button>
        {!showMessageInput && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowMessageInput(true)}
            className="border-border/50 text-muted-foreground hover:text-foreground"
            title="Add a message"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
