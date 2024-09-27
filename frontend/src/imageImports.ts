import ambition from "./assets/ambition.png"
import leadingAi from "./assets/leadingai.svg"
import morley from "./assets/morley.png"
import engineLogo from "./assets/Engine-Logo.svg"
import engineBlack from "./assets/Engine-Mark-Black.svg"
import engineGreen from "./assets/Engine-Mark-Green.svg"
import fea from "./assets/fea.svg"
import coram from "./assets/coram.gif"
import glasgowUni from "./assets/glasgowuni.svg"
import tri from "./assets/tri.png"
import nhbc from "./assets/nhbc-logo.svg"
import northYorkshire from "./assets/NorthYorkshire.svg"
import mapp from "./assets/mapp-logo.svg"
import hruc from "./assets/hruc-logo.svg"

import nhbcBackgroundImage from "./assets/nhbcimg1.jpg"
import engineBackgroundImage from "./assets/engine-background-img.png"
import RorySutherlandBackgroundImage from "./assets/RorySutherland.jpg"

type ImageImports = {
    [key: string]: string;
  };

  const imageImports: ImageImports = {
    leadingAi: leadingAi,
    ambition: ambition,
    engineBlack: engineBlack,
    engineGreen: engineGreen,
    engineLogo: engineLogo,
    morley: morley,
    coram: coram,
    glasgowUni: glasgowUni,
    fea: fea,
    tri: tri,
    nhbc: nhbc,
    nhbcBackgroundImage: nhbcBackgroundImage,
    northYorkshire: northYorkshire,
    engineBackgroundImage: engineBackgroundImage,
    mapp: mapp,
    hruc: hruc,
    RorySutherlandBackgroundImage: RorySutherlandBackgroundImage
    // Add more entries as needed for other images
  };

export default imageImports;
