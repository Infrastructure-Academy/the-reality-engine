import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { INVENTIONS } from "../shared/inventions";
import { relayCardSlug, relayCardVoiceUrl } from "../client/src/lib/storyAudio";

const EXPECTED: Record<string, string> = {
  "02/barrel.mp3": "30b2e1cbcad68e0bbeffa6fce7ecc416ed2106de2d6ce831d39e7a29069107cf",
  "02/charcoal-kiln.mp3": "a787cf49e944e14e69c4a699866f50f0a50a9337937ea563d501b9a52cb6cf26",
  "02/cork-harvest.mp3": "b30367b5ee88fd1dd50fdc057f47abc00d44004a9e65805f2f1fafc6d2f92b97",
  "02/dugout-canoe.mp3": "e78bcd8edc78ad2f3205afa5f8a25cfe6073e52430bdb4e9d316ba066f90191f",
  "02/longhouse.mp3": "2c9b741645ac0d8395c7e5ad96b22dfc908444b33269c3f6774fc9e2c1d47b38",
  "02/mast.mp3": "f42bfd101d9dad96a07660349c30eb363e7d90c6ffd0fcab96cf96e9bdd8cc9e",
  "02/palisade.mp3": "74b9e9a80a6fb6a44fb2e46d3f19268e15092a6e8dfdfc434e62564631dbee9b",
  "02/timber-frame.mp3": "917155d0d6dd984f94bf066e6c7add927df6f4323e66bff72cc1753ee0500547",
  "02/wooden-plough.mp3": "e3ab461bb51567f68dd56ffa3ed6ef46b8e8e5d427ffcc7a9bd9b4e113eba9a6",
  "03/aqueduct.mp3": "882deb41b7df72a4fb87a9dbec3186bc5081077128cb67bc511eab1d0e16289e",
  "03/dam.mp3": "c6ae49bdbf712f80949116973230ee65950240d05b1fd624235fbc128e622522",
  "03/irrigation-canal.mp3": "aeba2147905ba4ee8bb35a27cbe6539811fb845394c00ab4f16365ad87d1a118",
  "03/nilometer.mp3": "ffbede3bc34af20fdba47de13d0e38f90fb305935d70b8c14c7976c6cf6ffa58",
  "03/qanat.mp3": "fd60a343110d53ffcec5393ae7e5fec6e410d557be8201944c99c804441f572a",
  "03/reservoir.mp3": "cf3e9c99a5e0ea3a6e39534568319a7c137d7202c9394450083fe1adb48e07c3",
  "03/shaduf.mp3": "8e02896e8fbee77601ff657200603b344ae62074dac470f8f7f8b97802745343",
  "03/water-mill.mp3": "2d06fa41fef6eee983ea60362a8791d091ad245d632d4b714b83357cf0fdee3b",
  "04/cavalry.mp3": "2e0921bac209de2edb1d9fd771221ff9dbfaf8990a413ba5bb5a5233dd0b0a95",
  "04/chariot.mp3": "3d28dabbf2f0ce3b381d178f4fc23718fa4a47fe3a5583f61ba818bacc3425d3",
  "04/horse-collar.mp3": "d66d231d17504edd4fa34ae37b90186c8116fa44937b954dfca7622c4b372540",
  "04/horseshoe.mp3": "6a36a4b31a352ac71c2c9e2a71d23bedc2f4b7e897f3ad9102a3a0f2cb6ea819",
  "04/postal-relay.mp3": "cc51f84e51f4c98b7d98b7e9036f0e365c7c1a6ba5fe60c4cde675917a096322",
  "04/saddle.mp3": "e91219de546de09596c2e361e8dd39986f478565660b51470eedd898df3bda78",
  "04/stirrup.mp3": "f5bd0be89e8718f931010265057ea2c5bb0aacb30fbbe78d6b34487d293e6c66",
  "05/bridge.mp3": "170011791043a71c61606c3336a102f9e1a2984b4ced5605df7307ade366829b",
  "05/causeway.mp3": "f4951fa0169831aef39a8595c72c0491227df5f309802f9f82b69cf4f83b0e3d",
  "05/drainage.mp3": "f9651bc1b1d54def13aff3165b9ec6d5aafc190fa4891dd9d24f5a68c67cc103",
  "05/milestone.mp3": "4882952e1188d55ed3f68ed70dde10e148dc3e38198d6c746655580ed1c1ce92",
  "05/paved-road.mp3": "ae51862d685fc456e02d167384a59f90337c7e65e60364aa88691380c93e86a7",
  "05/toll-gate.mp3": "520422e31f06b5b5561d7e57c8ca9ddbb5aa0d1e8d13a72225064de940988bf0",
  "05/tunnel.mp3": "d071a976308a7551364df609f94de140f9c8d13d3b7c81c9612359ba3fc7b286",
  "05/way-station.mp3": "199ba3a8fea653861f129b4dda18ed884db639f4056ca44d2a79733637c8799b",
  "06/anchor.mp3": "a26d6982aacd965dd427ac63716f1d53f856f5a4aae5fc65a4ea15b90c09744f",
  "06/astrolabe.mp3": "4003bdf49e5a36fa6f87469aecf3fb08c835e6cef6424493bc6cf86d98aa4ebe",
  "06/caravel.mp3": "032dd4ad6b5f943d14c76e1dbe887e6474a6689d2d82300f688e815210149e94",
  "06/compass.mp3": "654789eca2a94a317f8be49bf538c908e405c2821d5b902473c962470378a192",
  "06/dry-dock.mp3": "efd4b894fd7ff94eedf65ff59b4bd40821dcd60898a0be4658b2831149fa0e83",
  "06/keel.mp3": "c61a75a41b1b6201d1a007c59db7d7756d7241b2268ad1916a76c0165fd9c154",
  "06/lateen-sail.mp3": "20cbdb2efb50374af3b3fe2332b3a779da635b1107f2bc5f2553ecc65ce97705",
  "06/lighthouse.mp3": "da6208fae024b053e98515d5b7e9bf710e7796ce8b369e6530b3690322341a0b",
  "06/sextant.mp3": "fc21931dc02fc444eda32bcc893cd8649c65277651d964a065e4c465e0c49dae",
  "07/cotton-gin.mp3": "cbe57214c37033b784c1bfa5b72a2bc71672df5be526326a4fc56bbf18b3ae11",
  "07/flying-shuttle.mp3": "cd0def67d21282e3ed24f072854d7ec11a4c4be9c2fdbf7687bf005d29dadd79",
  "07/jacquard-mechanism.mp3": "67bf8c1d9d3f028e8a725a1596b634283bbc6bc894da63a490237e3f08477c2a",
  "07/power-loom.mp3": "7bd42ade8e8472b73b489bcdbe1607c703dca30ed3dde35a4e79b0439ed24b80",
  "07/punch-card.mp3": "fd02b1568ee195fed3c389111bef7e5757a943b6f91159e12aa8a02a67381ba3",
  "07/spinning-jenny.mp3": "4e5ed9978d06cc609ed69ba9c84b39fee768389c9e9a6668e706b38e6c358c6c",
  "07/spinning-mule.mp3": "1f3de8b06a5e4719c805fcc09971c653e1b4fa3450d8cf463c41e529df339046",
  "08/railway-bridge.mp3": "20ae198019454331a80b3d22769ad68e5ad7e9efc0b20c62213121cc6958414e",
  "08/signal-system.mp3": "53ae2d072e9fe949db8aa4a29a2f285182bf919f988a1cb8d20179d467aa1fee",
  "08/sleeper-car.mp3": "6ca080faef1e2a7968cb886efa9f1a7cbad2bc2bf54195041ada139d545de610",
  "08/standard-gauge.mp3": "bdfe9b571556398aef6361a10bb17f29b97a9bb60a94054bd9b3afc3c320e617",
  "08/steam-locomotive.mp3": "ef27517827b5b027dd329ce7e69ff1b83c22c0baddb385091c730718d7079bde",
  "08/steel-rail.mp3": "06904c29a815d54def96a70fdeb0028f23bde1ac0c56dc8cedd608352b836461",
  "08/telegraph.mp3": "471078d3f60953172a7484cf6ccd2474165ee8f7304d992d4ec8faf77b5364f3",
  "08/turntable.mp3": "d37cfcf9931c488d51587e8fdfe5607e10e62c8afef243dfc2e0bfb7605d8f64",
  "09/assembly-line.mp3": "40fcbd314024b956b4198d9133c8f357506545c0409f47dc54e829718eff1b5a",
  "09/automobile.mp3": "5a76832f9dcda6b9ea70e04e8e8cbdc9b9f9cf63b8d50e8fd7867e9afb570383",
  "09/diesel-engine.mp3": "6a03d71fa81d22dbf7819537d84e8dbb65e7c56349c802287a735e62f23b78bb",
  "09/fuel-station.mp3": "9b2e9f81110a4da3d2aa690c905988b09253ee024455598d0887f8b86ddb813c",
  "09/highway.mp3": "1c75baf9d2f5de82c355f2f71b5770f5d168d6ecf6a523f227b9dda88d299d4a",
  "09/tractor.mp3": "fe4c7ede5f158fcadaf23f6ed6f9a394f825235506d5a32e736bc029ce8038bd",
  "09/traffic-light.mp3": "9f585c725e0e297147996950ebd2f7ff2f0ba18a4d3c0bda23bb6c5de1c2f453",
  "10/airport.mp3": "9015709b2d3e40d61cae4876e373677f7855891198ef6102b4e40d4ef87acf94",
  "10/biplane.mp3": "22fa4d0f146b83317b95f37d6949fe0427075a7ce34f456a20913192916caa4e",
  "10/jet-engine.mp3": "d4899195353ef0492a637e5766c261780a85969f1ef7950a9a497acd8dbd4e9e",
  "10/motorway.mp3": "6fd2f248065257b2a2ac4acc9147e3ccbc66d2c263c6641e4ed75383080695fe",
  "10/radar.mp3": "745003692809025d905a9c36e66b6fcc4b59c65688a3e3c342c190c471a8c9a4",
  "10/radio-broadcast.mp3": "c0e37ba984f5c7d72542991cad3c06e64310a95741a07323197a01c195c818fe",
  "10/satellite-dish.mp3": "e1896dd726f3a5a6ae8c3f85cd12435233f3d7476710f1944fe0c24921feb865",
  "10/television.mp3": "c8d3e7d4c8b3881070f5ebef6b34f7ad4b3e14270e20333a973ab9b8931d8cb2",
  "10/transistor.mp3": "0b71519917baa7a6515cf48e53aa564419c37b85db1f9a56c90e3e359be53f75",
  "11/cloud-computing.mp3": "269c9b1dfae4d16173e59a8363a57b0269f5ebf4399339565646cf4a6a4fd6c6",
  "11/fibre-optic.mp3": "caa5b99168cc570280c661ccd1e2d5954d99228cc0ee03b2f04273167e1d6589",
  "11/gps.mp3": "51261506c6f5f87009140e6cf386d78fac653ae489cbeaa2e8aa58e520eabd4a",
  "11/internet-protocol.mp3": "f74b1fd329b9ed148df2b4b1ad64dadaf79f9a77bb72b2fcd00af5c7ee698d43",
  "11/microprocessor.mp3": "d0185d13b438de8d8dfedb67a30ca6a3420050d73c16d4f60e673f351d6bc4e9",
  "11/smartphone.mp3": "a9da768ec2689f73129b2ac240e2f24e103ce132377716f3d2c4f189321740c1",
  "11/solar-panel.mp3": "668f362f80b2db8243ab8b4382017cdf4ce6dac826e9b6beb56f7d817af87f4c",
  "11/space-station.mp3": "d34691f59fc311e23b8a68a9f42f01624f26e023b2c73aff1f2db403c6360cec",
  "12/ai-symbiosis.mp3": "34dfb743e9f4bbde87abc8192cae317319b3256d9ed64f57d999c36298b472d8",
  "12/bio-digital-mesh.mp3": "33ab1fd8537785e42a7a57df95d1036bddfc2da532a1b5fae1b4636b7481c78d",
  "12/collective-intelligence.mp3": "248a6f282b76b64ec77b5f54c3a262caa0ed3b67fdaa6b8aac0bc9ad724a871d",
  "12/consciousness-map.mp3": "ca187bd51c62d8c6c6e2fffca5a6d3ae9cce2a6348a625215ad1895054372295",
  "12/digital-twin.mp3": "e2258a843be59d76f44e5c367d3a6df3975362910060452efe1581955cc83af3",
  "12/empathy-engine.mp3": "5e0400e02ed39c0331df4f92f330edebe54e1eff75edd5c96c32db6db24341c0",
  "12/ethical-framework.mp3": "8cf6f3b489895c6461d5610e2e90726a2e2b6ef9b52b7a85a2c5e4bc64608c79",
  "12/human-node.mp3": "73659f157a50559def00d151db016abbc5238223e4e19f89120e35612a94d153",
  "12/neural-interface.mp3": "4d4d8aed256f78ec22d9f612e4db6673b8ded7900cdd18e7d715786685e9d120",
  "12/planetary-node.mp3": "1e8cb31a70924419aa5c2ba28cf02c94deeea8e934d5e3bbaee7f8ace8c8439d",
  "12/quantum-computer.mp3": "a100769f1552a3fbcf204776d2ff7d53d1c5c5e7b77db1c6beeac1d6bd212be3",
  "12/torus-network.mp3": "828c168525b4ea172f1757d3f2df38255330a13bf2a1c91673fbc730b42c45f1",
};

const sha256 = (path: URL) => createHash("sha256").update(readFileSync(path)).digest("hex");

describe("Sonia discovery cards", () => {
  it("keeps 92 recordings byte-identical in both trees", () => {
    expect(Object.keys(EXPECTED)).toHaveLength(92);
    const counts: Record<string, number> = {};
    for (const [rel, hash] of Object.entries(EXPECTED)) {
      const hall = rel.slice(0, 2);
      counts[hall] = (counts[hall] ?? 0) + 1;
      const pub = new URL(`../client/public/audio/relay-cards/${rel}`, import.meta.url);
      const docs = new URL(`../docs/audio/relay-cards/${rel}`, import.meta.url);
      expect(sha256(pub), rel).toBe(hash);
      expect(sha256(docs), rel).toBe(hash);
    }
    expect(counts).toEqual({ "02": 9, "03": 8, "04": 7, "05": 8, "06": 9, "07": 7, "08": 8, "09": 7, "10": 9, "11": 8, "12": 12 });
  });

  it("points every issued hall 2–12 card at its recording and leaves Fire on its own files", () => {
    for (let relay = 2; relay <= 12; relay += 1) {
      for (const card of INVENTIONS[relay]) {
        const url = relayCardVoiceUrl(relay, card.name);
        const rel = `${String(relay).padStart(2, "0")}/${relayCardSlug(card.name)}.mp3`;
        expect(url).toBe(`/audio/relay-cards/${rel}`);
        expect(EXPECTED[rel], card.name).toBeTruthy();
      }
    }
    expect(relayCardVoiceUrl(1, "Hearth")).toBeNull();
    const briefing = sha256(new URL("../client/public/audio/fire-cards/volume-1-briefing.mp3", import.meta.url));
    expect(briefing).toBe("ac4ada234afaad1989e0c62f4e58e140b2a5f34723fb2e4c330540c94c82a9d0");
    expect(sha256(new URL("../docs/audio/fire-cards/volume-1-briefing.mp3", import.meta.url))).toBe(briefing);
  });
});
