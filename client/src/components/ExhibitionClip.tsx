import { ExplorerVideo } from "@/components/ExplorerVideo";
import { v6ClipSrc, type V6Clip } from "@shared/exhibitionPortal";

/** One tap opens the clip. Nothing plays until that tap. */
export function ExhibitionClip({
  clip,
  testId,
  onOpen,
}: {
  clip: V6Clip;
  testId: string;
  onOpen?: () => void;
}) {
  return (
    <ExplorerVideo
      plate
      ensurePlayback
      testId={testId}
      onOpen={onOpen}
      videoUrl={v6ClipSrc(clip.file)}
      title={clip.label}
      subtitle={clip.note}
      accentColor="#fcd34d"
      glowColor="rgba(252, 211, 77, 0.22)"
    />
  );
}
