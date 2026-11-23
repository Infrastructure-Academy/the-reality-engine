/**
 * Sonia prologue lines. Same voice and pace as the Fire cards:
 * en-GB Sonia, rate −20%, pitch −1 Hz, 24 kHz mono, 64 kbps.
 * English only. A missing file stays silent.
 */
export const PROLOGUE_RECORDINGS: readonly { sceneId: string; file: string; sha256: string; bytes: number }[] = [
  { sceneId: "scene1", file: "01_clock.mp3", sha256: "9f6d29274ee43bcae8c1db2bc12bcdf2c3dbd3b86e8b0a8b2b7e8cf9efd3e54a", bytes: 274028 },
  { sceneId: "scene2", file: "02_signal.mp3", sha256: "001efec23487d5d8fda23ebd902f8ab22afa46cee395934e59eed084940d744e", bytes: 314540 },
  { sceneId: "scene3", file: "03_human.mp3", sha256: "762008d7432a26113b2b3830f2fa705b529c2d902c5a450804092607090ff83b", bytes: 252332 },
  { sceneId: "scene4", file: "04_david.mp3", sha256: "4a02bd8958136361cd0b719b912ea8a5131999a44f4e8737caf7629208672655", bytes: 304748 },
  { sceneId: "scene5", file: "05_choice.mp3", sha256: "ec27b9899613798b999fbbd8c982ed85bc616a0b5d423db7668da50600099a01", bytes: 314348 },
  { sceneId: "scene6", file: "06_fire.mp3", sha256: "769eaafaa0c80cf5743fb5cd0f3827cf62830a15dac66df1eb7e8d81ff04296f", bytes: 243884 },
];

export function prologueRecordingUrl(sceneId: string, locale: string): string | null {
  if (locale !== "en") return null;
  const row = PROLOGUE_RECORDINGS.find((item) => item.sceneId === sceneId);
  return row ? `/audio/prologue/${row.file}` : null;
}
