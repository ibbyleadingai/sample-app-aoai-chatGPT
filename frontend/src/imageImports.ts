import ambition from "./assets/ambition.png"
import leadingai from "./assets/leadingai.svg"
import engine from "./assets/Engine-Mark.svg"
import morley from "./assets/morley.png"
import engineLogo from "./assets/Engine-Logo.svg"
import fea from "./assets/fea.svg"
import coram from "./assets/coram.gif"
import glasgowuni from "./assets/glasgowuni.svg"
import tri from "./assets/tri.png"
import nhbc from "./assets/nhbc-logo.svg"
import nhbcBackgroundImage from "./assets/nhbcimg1.jpg"

type ImageImports = {
    [key: string]: string;
  };

  const imageImports: ImageImports = {
    leadingai: leadingai,
    ambition: ambition,
    engine: engine,
    engineLogo: engineLogo,
    morley: morley,
    coram: coram,
    glasgowuni: glasgowuni,
    fea: fea,
    tri: tri,
    nhbc: nhbc,
    nhbcBackgroundImage: nhbcBackgroundImage
    // Add more entries as needed for other images
  };

export default imageImports;
