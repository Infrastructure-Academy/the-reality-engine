import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { RELAYS } from "@shared/gameData";
import { INVENTIONS, type Invention } from "@shared/inventions";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Swords, DoorOpen, Eye, Shield, Compass, ChevronRight, ChevronLeft, Scroll, Zap, Map, MessageSquare, Loader2 } from "lucide-react";
import { playDiscoverySound, playXpSound, hapticDiscovery } from "@/hooks/useSoundEffects";
import { XpCounter } from "@/components/XpCounter";
import { SoundToggle } from "@/components/SoundToggle";
import { ExplorerVideo } from "@/components/ExplorerVideo";

// ─── Guest ID ───
function getGuestId(): string {
  let id = localStorage.getItem("tre_guest_id");
  if (!id) {
    id = "g_" + Math.random().toString(36).slice(2, 12);
    localStorage.setItem("tre_guest_id", id);
  }
  return id;
}

// ─── Simplified Ability Scores (3 for juniors) ───
interface JuniorAbilities {
  observation: number;  // West perspective — seeing what's there
  intuition: number;    // East perspective — sensing what's hidden
  resilience: number;   // Nomadic perspective — surviving the unknown
}

function rollAbilities(): JuniorAbilities {
  const roll = () => Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 3;
  return { observation: roll(), intuition: roll(), resilience: roll() };
}

// ─── Dungeon Room Images (CDN) ───
const DUNGEON_IMAGES: Record<number, string> = {
  1: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/dungeon-r01-fire_0818c4df.png",
  2: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/dungeon-r02-tree_a39d83c5.png",
  3: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/dungeon-r03-river_e3f1f3cb.png",
  4: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/dungeon-r04-horse_50d1d935.png",
  5: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/dungeon-r05-roads_823b0b42.png",
  6: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/dungeon-r06-ships_e43161ea.png",
  7: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/dungeon-r07-loom_4c4ec6bb.png",
  8: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/dungeon-r08-rail_813fa6de.png",
  9: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/dungeon-r09-engine_fca54395.png",
  10: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/dungeon-r10-triad_7c9057f5.png",
  11: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/dungeon-r11-orbit_0306764d.png",
  12: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/dungeon-r12-nodes_5dff4509.png",
};

// ─── Room types ───
type RoomType = "entrance" | "discovery" | "challenge" | "lore" | "guardian" | "treasure" | "exit";

interface DungeonRoom {
  id: number;
  type: RoomType;
  name: string;
  description: string;
  inventionIdx: number | null; // Index into relay inventions
  abilityCheck: keyof JuniorAbilities | null;
  difficulty: number; // Target to beat with ability score
  xpReward: number;
}

const ROOM_TEMPLATES: Omit<DungeonRoom, "id" | "inventionIdx">[] = [
  { type: "entrance", name: "The Gateway", description: "You stand at the entrance. The air hums with ancient energy. DAVID's voice echoes: 'Welcome, explorer...'", abilityCheck: null, difficulty: 0, xpReward: 5000 },
  { type: "discovery", name: "The Archive", description: "Dusty shelves line the walls. Something glows in the corner. Your OBSERVATION skill may reveal what's hidden.", abilityCheck: "observation", difficulty: 8, xpReward: 15000 },
  { type: "challenge", name: "The Crossroads", description: "Three paths diverge. Your INTUITION tells you which way leads to knowledge, not danger.", abilityCheck: "intuition", difficulty: 10, xpReward: 20000 },
  { type: "lore", name: "The Chronicle Wall", description: "Ancient inscriptions cover every surface. Each tells a piece of the relay's story.", abilityCheck: null, difficulty: 0, xpReward: 10000 },
  { type: "discovery", name: "The Workshop", description: "Tools and blueprints are scattered across workbenches. Something important was built here.", abilityCheck: "observation", difficulty: 9, xpReward: 15000 },
  { type: "guardian", name: "The Keeper's Chamber", description: "A figure blocks your path. 'Prove your RESILIENCE,' it demands. 'Only the persistent may pass.'", abilityCheck: "resilience", difficulty: 11, xpReward: 25000 },
  { type: "treasure", name: "The Vault", description: "The final chamber. Golden light spills from a pedestal. The relay's greatest secret awaits.", abilityCheck: null, difficulty: 0, xpReward: 30000 },
  { type: "exit", name: "The Ascent", description: "Daylight streams from above. You've conquered this dungeon. The knowledge is yours.", abilityCheck: null, difficulty: 0, xpReward: 10000 },
];

function generateDungeon(relayNum: number): DungeonRoom[] {
  const inventions = INVENTIONS[relayNum] || [];
  let invIdx = 0;
  return ROOM_TEMPLATES.map((template, i) => ({
    ...template,
    id: i,
    inventionIdx: (template.type === "discovery" || template.type === "treasure") && invIdx < inventions.length
      ? invIdx++
      : null,
  }));
}

// ─── Ability check ───
function abilityCheck(score: number, difficulty: number): { success: boolean; roll: number } {
  const roll = Math.floor(Math.random() * 20) + 1;
  const total = roll + Math.floor((score - 10) / 2);
  return { success: total >= difficulty, roll };
}

export default function DungeonCrawl() {
  const [, navigate] = useLocation();
  const guestId = useMemo(() => getGuestId(), []);

  // Profile
  const profileMutation = trpc.profile.getOrCreate.useMutation();
  const addXpMutation = trpc.profile.addXp.useMutation();
  const [profileId, setProfileId] = useState<number | null>(null);

  useEffect(() => {
    profileMutation.mutate(
      { guestId, mode: "explorer" },
      { onSuccess: (p) => { if (p) setProfileId(p.id); } }
    );
  }, [guestId]);

  // Character
  const [abilities, setAbilities] = useState<JuniorAbilities>(() => {
    try {
      const saved = localStorage.getItem("tre_dungeon_abilities");
      return saved ? JSON.parse(saved) : rollAbilities();
    } catch { return rollAbilities(); }
  });
  const [rollsLeft, setRollsLeft] = useState(() => {
    const saved = localStorage.getItem("tre_dungeon_rolls_left");
    return saved ? parseInt(saved, 10) : 3;
  });
  const [characterCreated, setCharacterCreated] = useState(() => localStorage.getItem("tre_dungeon_created") === "true");

  // Dungeon state
  const [currentRelay, setCurrentRelay] = useState(() => {
    const saved = localStorage.getItem("tre_dungeon_relay");
    return saved ? parseInt(saved, 10) : 1;
  });
  const [currentRoom, setCurrentRoom] = useState(0);
  const [roomsCleared, setRoomsCleared] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("tre_dungeon_cleared");
      return saved ? new Set(JSON.parse(saved)) : new Set<string>();
    } catch { return new Set<string>(); }
  });
  const [totalXp, setTotalXp] = useState(0);
  const [lastCheckResult, setLastCheckResult] = useState<{ success: boolean; roll: number } | null>(null);
  const [showResult, setShowResult] = useState(false);

  // DAVID DM narration
  const narrateMutation = trpc.dungeonDM.narrate.useMutation();
  const [narration, setNarration] = useState<string | null>(null);
  const [narrationLoading, setNarrationLoading] = useState(false);
  const narrationCache = useRef<Record<string, string>>({});

  // Persistence
  useEffect(() => {
    localStorage.setItem("tre_dungeon_abilities", JSON.stringify(abilities));
  }, [abilities]);
  useEffect(() => {
    localStorage.setItem("tre_dungeon_rolls_left", String(rollsLeft));
  }, [rollsLeft]);
  useEffect(() => {
    localStorage.setItem("tre_dungeon_relay", String(currentRelay));
  }, [currentRelay]);
  useEffect(() => {
    localStorage.setItem("tre_dungeon_cleared", JSON.stringify(Array.from(roomsCleared)));
  }, [roomsCleared]);

  const dungeon = useMemo(() => generateDungeon(currentRelay), [currentRelay]);
  const room = dungeon[currentRoom];
  const relay = RELAYS[currentRelay - 1];
  const inventions = INVENTIONS[currentRelay] || [];
  const roomKey = `${currentRelay}-${currentRoom}`;
  const isCleared = roomsCleared.has(roomKey);

  const handleReroll = () => {
    if (rollsLeft > 0) {
      setAbilities(rollAbilities());
      setRollsLeft(prev => prev - 1);
    }
  };

  const handleCreateCharacter = () => {
    setCharacterCreated(true);
    localStorage.setItem("tre_dungeon_created", "true");
  };

  const dungeonProgress = dungeon.filter((_, i) => roomsCleared.has(`${currentRelay}-${i}`)).length;
  const totalDungeonRooms = dungeon.length;

  // Fetch DAVID narration for current room
  const fetchNarration = useCallback((checkResultParam?: { success: boolean; roll: number } | null) => {
    const cacheKey = `${currentRelay}-${currentRoom}-${checkResultParam ? checkResultParam.success : 'enter'}`;
    if (narrationCache.current[cacheKey]) {
      setNarration(narrationCache.current[cacheKey]);
      return;
    }
    setNarrationLoading(true);
    const inv = room.inventionIdx !== null ? inventions[room.inventionIdx] : null;
    narrateMutation.mutate({
      relayNumber: currentRelay,
      roomType: room.type,
      roomName: room.name,
      abilityCheck: room.abilityCheck,
      checkResult: checkResultParam ?? null,
      inventionName: inv?.name ?? null,
      inventionDescription: inv?.description ?? null,
      playerAbilities: abilities,
      roomsCleared: dungeonProgress,
      totalRooms: totalDungeonRooms,
    }, {
      onSuccess: (data) => {
        narrationCache.current[cacheKey] = data.narration;
        setNarration(data.narration);
        setNarrationLoading(false);
      },
      onError: () => {
        setNarration("DAVID's instruments flicker... 'Press on, explorer. The path reveals itself to the brave.'");
        setNarrationLoading(false);
      },
    });
  }, [currentRelay, currentRoom, room, inventions, abilities, dungeonProgress, totalDungeonRooms]);

  const handleEnterRoom = useCallback(() => {
    if (isCleared) return;

    if (room.abilityCheck) {
      const abilityScore = abilities[room.abilityCheck];
      const result = abilityCheck(abilityScore, room.difficulty);
      setLastCheckResult(result);
      setShowResult(true);

      // Even on failure, you still clear the room (no loss state for kids)
      const xp = result.success ? room.xpReward : Math.floor(room.xpReward * 0.5);
      setTotalXp(prev => prev + xp);
      setRoomsCleared(prev => new Set(Array.from(prev).concat([roomKey])));

      if (profileId) {
        addXpMutation.mutate({
          profileId, amount: xp, source: "dungeon",
          sourceId: `dungeon-${currentRelay}-room-${currentRoom}`,
          description: `${result.success ? "Passed" : "Attempted"} ${room.name} in Relay ${currentRelay}`,
        });
      }

      // Fetch DAVID narration with check result
      fetchNarration(result);

      playDiscoverySound();
      setTimeout(() => playXpSound(), 300);
    } else {
      // Auto-clear rooms without checks
      setTotalXp(prev => prev + room.xpReward);
      setRoomsCleared(prev => new Set(Array.from(prev).concat([roomKey])));
      if (profileId) {
        addXpMutation.mutate({
          profileId, amount: room.xpReward, source: "dungeon",
          sourceId: `dungeon-${currentRelay}-room-${currentRoom}`,
          description: `Explored ${room.name} in Relay ${currentRelay}`,
        });
      }
      // Fetch DAVID narration for exploration
      fetchNarration(null);
      playDiscoverySound();
    }
  }, [room, isCleared, abilities, profileId, currentRelay, currentRoom, roomKey, fetchNarration]);

  const handleNextRoom = () => {
    setShowResult(false);
    setLastCheckResult(null);
    setNarration(null);
    if (currentRoom < dungeon.length - 1) {
      setCurrentRoom(prev => prev + 1);
      hapticDiscovery();
    }
  };

  const handlePrevRoom = () => {
    setShowResult(false);
    setLastCheckResult(null);
    setNarration(null);
    if (currentRoom > 0) {
      setCurrentRoom(prev => prev - 1);
    }
  };

  const handleNextDungeon = () => {
    if (currentRelay < 12) {
      setCurrentRelay(prev => prev + 1);
      setCurrentRoom(0);
      setShowResult(false);
      setLastCheckResult(null);
      setNarration(null);
    }
  };

  const handlePrevDungeon = () => {
    if (currentRelay > 1) {
      setCurrentRelay(prev => prev - 1);
      setCurrentRoom(0);
      setShowResult(false);
      setLastCheckResult(null);
      setNarration(null);
    }
  };

  const ROOM_ICONS: Record<RoomType, typeof DoorOpen> = {
    entrance: DoorOpen,
    discovery: Eye,
    challenge: Compass,
    lore: Scroll,
    guardian: Shield,
    treasure: Zap,
    exit: Map,
  };

  // ─── Character Creation Screen ───
  if (!characterCreated) {
    return (
      <div className="min-h-screen bg-background text-foreground bg-starfield relative mobile-content-pad">
        <header className="sticky top-0 z-20 border-b border-border/50 backdrop-blur-md bg-background/80">
          <div className="container flex items-center justify-between h-12">
            <Link href="/explore">
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                <ArrowLeft className="w-4 h-4" /> Modes
              </Button>
            </Link>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-emerald-600 text-white">DUNGEON CRAWL</span>
            <div className="w-16" />
          </div>
        </header>

        <div className="container py-8 max-w-md mx-auto text-center">
          <Swords className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold tracking-wider text-gold-gradient mb-2">CREATE YOUR EXPLORER</h2>
          <p className="text-sm text-muted-foreground mb-6">Roll your ability scores. Three chances to get the best combination.</p>

          {/* Ability Scores */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {([
              { key: "observation" as const, label: "Observation", desc: "West — Seeing what's there", color: "#ef4444" },
              { key: "intuition" as const, label: "Intuition", desc: "East — Sensing what's hidden", color: "#3b82f6" },
              { key: "resilience" as const, label: "Resilience", desc: "Nomadic — Surviving the unknown", color: "#10b981" },
            ]).map((attr) => (
              <div key={attr.key} className="rounded-xl border border-border/50 p-4 bg-card/30">
                <p className="text-3xl font-mono font-bold mb-1" style={{ color: attr.color }}>{abilities[attr.key]}</p>
                <p className="text-xs font-bold uppercase tracking-wider">{attr.label}</p>
                <p className="text-[9px] text-muted-foreground mt-1">{attr.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center mb-4">
            <Button
              variant="outline"
              onClick={handleReroll}
              disabled={rollsLeft <= 0}
              className="gap-1.5"
            >
              <Swords className="w-4 h-4" />
              Re-roll ({rollsLeft} left)
            </Button>
            <Button
              onClick={handleCreateCharacter}
              className="bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5"
            >
              <Shield className="w-4 h-4" />
              Accept & Enter
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground">Higher scores = better chance of passing ability checks in dungeons</p>
        </div>
      </div>
    );
  }

  // ─── Main Dungeon UI ───
  const RoomIcon = ROOM_ICONS[room.type];

  return (
    <div className="min-h-screen bg-background text-foreground bg-starfield relative mobile-content-pad">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/8 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border/50 backdrop-blur-md bg-background/80">
        <div className="container flex items-center justify-between h-12">
          <Link href="/explore">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" /> Modes
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-emerald-600 text-white">DUNGEON</span>
            <XpCounter value={totalXp} compact color="gold" />
          </div>
          <SoundToggle compact color="gold" />
        </div>
      </header>

      <div className="container py-4 max-w-lg mx-auto">
        {/* Intro Video */}
        <ExplorerVideo
          videoUrl="https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/FINAL-v2-dungeon-crawl_3914ce50.mp4"
          title="Your Adventure Through 12,000 Years"
          subtitle="26s intro"
          accentColor="#10b981"
          glowColor="rgba(16,185,129,0.15)"
        />

        {/* Dungeon Selector */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={handlePrevDungeon} disabled={currentRelay <= 1}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-center">
            <p className="text-lg">{relay.emoji}</p>
            <p className="font-heading text-sm font-bold tracking-wider">{relay.name} Dungeon</p>
            <p className="text-[10px] text-muted-foreground">{relay.era}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleNextDungeon} disabled={currentRelay >= 12}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Room Progress Bar */}
        <div className="flex items-center gap-1 mb-4 px-2">
          {dungeon.map((r, i) => {
            const cleared = roomsCleared.has(`${currentRelay}-${i}`);
            const current = i === currentRoom;
            return (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full transition-all cursor-pointer ${
                  cleared ? "bg-emerald-500" : current ? "bg-emerald-500/50 animate-pulse" : "bg-border/30"
                }`}
                onClick={() => { setCurrentRoom(i); setShowResult(false); setLastCheckResult(null); }}
                title={`Room ${i + 1}: ${r.name}`}
              />
            );
          })}
        </div>

        {/* Current Room */}
        <motion.div
          key={roomKey}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm p-6 mb-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 flex items-center justify-center">
              <RoomIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Room {currentRoom + 1} of {totalDungeonRooms}</p>
              <h3 className="font-heading text-lg font-bold tracking-wider">{room.name}</h3>
            </div>
          </div>

          {/* Dungeon Room Illustration */}
          {DUNGEON_IMAGES[currentRelay] && (
            <div className="rounded-lg overflow-hidden mb-4 border border-border/30">
              <img
                src={DUNGEON_IMAGES[currentRelay]}
                alt={`${relay.name} Dungeon`}
                className="w-full h-40 object-cover object-center"
                loading="lazy"
              />
            </div>
          )}

          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{room.description}</p>

          {/* Ability check info */}
          {room.abilityCheck && !isCleared && (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 mb-4">
              <p className="text-xs uppercase tracking-wider text-emerald-400 font-bold mb-1">Ability Check Required</p>
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground capitalize">{room.abilityCheck}</span> (your score: {abilities[room.abilityCheck]}) vs difficulty {room.difficulty}
              </p>
            </div>
          )}

          {/* Invention reveal */}
          {room.inventionIdx !== null && isCleared && inventions[room.inventionIdx] && (
            <div className="rounded-lg border border-gold/20 bg-gold/5 p-3 mb-4">
              <p className="text-xs uppercase tracking-wider text-gold font-bold mb-1">Discovery Unlocked</p>
              <p className="text-sm font-bold text-foreground">{inventions[room.inventionIdx].name}</p>
              <p className="text-xs text-muted-foreground mt-1">{inventions[room.inventionIdx].description}</p>
            </div>
          )}

          {/* Check result */}
          <AnimatePresence>
            {showResult && lastCheckResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`rounded-lg border p-3 mb-4 text-center ${
                  lastCheckResult.success
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : "border-amber-500/40 bg-amber-500/10"
                }`}
              >
                <p className="text-2xl font-mono font-bold mb-1">🎲 {lastCheckResult.roll}</p>
                <p className={`text-sm font-bold ${lastCheckResult.success ? "text-emerald-400" : "text-amber-400"}`}>
                  {lastCheckResult.success ? "SUCCESS! Full XP earned!" : "PARTIAL — Half XP earned. You still advance!"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* DAVID DM Narration */}
          <AnimatePresence>
            {(narration || narrationLoading) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-3 mb-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <p className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold">DAVID — Dungeon Master</p>
                </div>
                {narrationLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span className="italic">DAVID is narrating...</span>
                  </div>
                ) : (
                  <p className="text-sm text-foreground/90 leading-relaxed italic">{narration}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="flex gap-3">
            {!isCleared ? (
              <Button
                onClick={handleEnterRoom}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-heading tracking-wider"
              >
                {room.abilityCheck ? (
                  <><Swords className="w-4 h-4 mr-2" /> ATTEMPT CHECK</>
                ) : (
                  <><Eye className="w-4 h-4 mr-2" /> EXPLORE ROOM</>
                )}
              </Button>
            ) : (
              <div className="flex-1 text-center py-2">
                <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Room Cleared ✓</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex gap-3 mb-6">
          <Button variant="outline" onClick={handlePrevRoom} disabled={currentRoom <= 0} className="flex-1">
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous Room
          </Button>
          <Button variant="outline" onClick={handleNextRoom} disabled={currentRoom >= dungeon.length - 1} className="flex-1">
            Next Room <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Character Sheet (mini) */}
        <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-4 mb-6">
          <p className="text-xs uppercase tracking-wider text-emerald-400 font-bold mb-3">Character Sheet</p>
          <div className="grid grid-cols-3 gap-3">
            {([
              { key: "observation" as const, label: "OBS", color: "#ef4444" },
              { key: "intuition" as const, label: "INT", color: "#3b82f6" },
              { key: "resilience" as const, label: "RES", color: "#10b981" },
            ]).map((attr) => (
              <div key={attr.key} className="text-center">
                <p className="text-xl font-mono font-bold" style={{ color: attr.color }}>{abilities[attr.key]}</p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{attr.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-border/30 text-center">
            <p className="text-xs font-mono text-muted-foreground">
              Dungeons cleared: <span className="text-emerald-400 font-bold">{dungeonProgress}/{totalDungeonRooms}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
