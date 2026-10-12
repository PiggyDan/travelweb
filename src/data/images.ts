import type { ImageAsset } from "@/types/common";

/**
 * Central image registry.
 *
 * Every photograph used on the site is declared here exactly once. Components
 * never reference "/images/..." paths directly; mock data references these
 * entries, and pages receive them through services. Replacing a photo (e.g.
 * with Dolgion’s Tour's own photography) is a one-line change in this file.
 *
 * All current photos are openly licensed images from Wikimedia Commons,
 * self-hosted under /public/images. Attribution data is kept in `credit`
 * and rendered on the Gallery page. CC BY / CC BY-SA images REQUIRE that
 * attribution to stay visible while they are in use.
 */
export const images = {
  huntingMap: {
    src: "/images/hunting/brochure-cover-map.jpg",
    alt: "Mongol Target shooting and outdoor tour brochure with route map",
    width: 1280,
    height: 1403,
  },
  huntingProgram: {
    src: "/images/hunting/brochure-program.jpg",
    alt: "Original target shooting and countryside activities program brochure",
    width: 1280,
    height: 1403,
  },
  gobiDunes: {
    src: "/images/gobi/khongoryn-els-dunes.jpg",
    alt: "Golden sand dunes of Khongoryn Els beneath the dark ridges of the Gobi-Altai range",
    width: 1920,
    height: 1219,
    credit: {
      author: "Bernard Gagnon",
      license: "CC0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Khongoryn_Els_04.jpg",
    },
  },
  gobiDuneRidge: {
    src: "/images/gobi/khongoryn-els-ridge.jpg",
    alt: "A tall pale dune rising behind scattered desert shrubs under a blue sky in the Gobi",
    width: 1920,
    height: 1173,
    credit: {
      author: "Bernard Gagnon",
      license: "CC0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Khongoryn_Els_07.jpg",
    },
  },
  gobiDunesWide: {
    src: "/images/gobi/khongoryn-els-wide.jpg",
    alt: "Wide view of rippled sand dunes stretching along the foot of rugged Gobi mountains",
    width: 1920,
    height: 1280,
    credit: {
      author: "Bernard Gagnon",
      license: "CC0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Khongoryn_Els_05.jpg",
    },
  },
  gobiCamelCaravan: {
    src: "/images/gobi/camels-at-dunes.jpg",
    alt: "A herder leading a line of Bactrian camels across the gravel plain in front of the Khongoryn Els dunes",
    width: 1920,
    height: 1280,
    credit: {
      author: "Bernard Gagnon",
      license: "CC0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Camels_at_Khongoryn_Els_01.jpg",
    },
  },
  gobiCamelsGrazing: {
    src: "/images/gobi/camels-gobi.jpg",
    alt: "Bactrian camels grazing on sparse desert grass with distant pink-toned hills",
    width: 1920,
    height: 1217,
    credit: {
      author: "Bernard Gagnon",
      license: "CC0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Camels_in_Gobi_Desert_01.jpg",
    },
  },
  gobiDuneHikers: {
    src: "/images/gobi/dune-hikers.jpg",
    alt: "Two tiny figures standing on the crest of a vast sand dune in soft hazy light",
    width: 1920,
    height: 1275,
    credit: {
      author: "Sarah Lachise sarahla",
      license: "CC0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Hiking_in_Khongoryn_Els_(Unsplash).jpg",
    },
  },
  gobiDuneSea: {
    src: "/images/gobi/gobi-plain.jpg",
    alt: "Sweeping curves of sand dunes fading into a hazy Gobi horizon",
    width: 1920,
    height: 1278,
    credit: {
      author: "Niek van Son from Eindhoven, Nederland",
      license: "CC BY 2.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Mongolia_-_Gobi_Desert_(49310228777).jpg",
    },
  },
  khuvsgulShore: {
    src: "/images/khuvsgul/lake-shore.jpg",
    alt: "Larch forest and weathered driftwood along the rocky shore of Lake Khuvsgul",
    width: 1920,
    height: 1177,
    credit: {
      author: "Bernard Gagnon",
      license: "CC0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Lake_Kh%C3%B6vsg%C3%B6l,_Mongolia.jpg",
    },
  },
  khuvsgulOpenWater: {
    src: "/images/khuvsgul/lake-view.jpg",
    alt: "Calm blue water of Lake Khuvsgul stretching toward low forested hills",
    width: 1920,
    height: 1151,
    credit: {
      author: "Bernard Gagnon",
      license: "CC0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Lake_Kh%C3%B6vsg%C3%B6l_01.jpg",
    },
  },
  khuvsgulDeadTrees: {
    src: "/images/khuvsgul/lake-forest.jpg",
    alt: "Bare silver tree trunks standing in the clear shallows of Lake Khuvsgul",
    width: 1920,
    height: 1164,
    credit: {
      author: "Bernard Gagnon",
      license: "CC0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Lake_Kh%C3%B6vsg%C3%B6l_02.jpg",
    },
  },
  khuvsgulGerCamp: {
    src: "/images/khuvsgul/lakeside-camp.jpg",
    alt: "White ger tents lined up between a pine forest and a small lake near Khuvsgul",
    width: 1920,
    height: 1084,
    credit: {
      author: "Bernard Gagnon",
      license: "CC0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Alag_Tsar_Tourist_Camp_01.jpg",
    },
  },
  altaiValley: {
    src: "/images/altai/tavan-bogd.jpg",
    alt: "A broad green valley leading toward the bare peaks of the Altai Mountains",
    width: 1920,
    height: 1278,
    credit: {
      author: "martin_vmorris",
      license: "CC BY-SA 2.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Tavan_Bogd_-_VMorris_-_1.jpg",
    },
  },
  altaiGlacier: {
    src: "/images/altai/potanin-glacier.jpg",
    alt: "Potanin Glacier winding between snowy peaks under heavy evening clouds in Altai Tavan Bogd",
    width: 1920,
    height: 1440,
    credit: {
      author: "Mongolia Expeditions",
      license: "CC BY 3.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Altai_Tavan_Bogd_-_Potanin_glacier_-_panoramio.jpg",
    },
  },
  altaiShiveetKhairkhan: {
    src: "/images/altai/shiveet-khairkhan.jpg",
    alt: "Snow-dusted Shiveet Khairkhan mountain rising above a wide gravel valley",
    width: 1920,
    height: 1080,
    credit: {
      author: "Mongolia Expeditions",
      license: "CC BY 3.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Shiveet_Khairkhan_Mount_-_panoramio.jpg",
    },
  },
  altaiLakeCamp: {
    src: "/images/altai/camping.jpg",
    alt: "Orange tents and a four-wheel-drive vehicle on a grassy lakeshore beneath snow-capped Altai peaks",
    width: 1920,
    height: 1280,
    credit: {
      author: "Altaihunters",
      license: "CC BY-SA 3.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Camping_in_Tavan_Bogd.jpg",
    },
  },
  eagleHunterPortrait: {
    src: "/images/altai/eagle-hunter.jpg",
    alt: "A Kazakh eagle hunter in a fur coat seated inside a ger, lit by a single window",
    width: 1920,
    height: 1280,
    credit: {
      author: "Bfreeproductions",
      license: "CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Eagle_hunter_with_his_Golden_Eagle_in_remote_Western_Mongolia,_2022-2.jpg",
    },
  },
  eagleHunterWithEagle: {
    src: "/images/altai/eagle-hunter-ridge.jpg",
    alt: "A Kazakh eagle hunter in traditional fur clothing holding his golden eagle inside a ger",
    width: 1920,
    height: 1101,
    credit: {
      author: "Bfreeproductions",
      license: "CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Eagle_hunter_with_his_Golden_Eagle_in_remote_Western_Mongolia,_2022-4.jpg",
    },
  },
  eagleHunterFamily: {
    src: "/images/altai/eagle-hunter-family.jpg",
    alt: "An eagle hunter with his golden eagle and his daughter, both in fur hats, inside a family ger",
    width: 1920,
    height: 1634,
    credit: {
      author: "Bfreeproductions",
      license: "CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Eagle_hunter,_in_traditional_Kazakh_wardrobe,_and_his_daughter_inside_a_ger_in_Western_Mongolia,_2022.jpg",
    },
  },
  horsesRiverCrossing: {
    src: "/images/altai/horses-river.jpg",
    alt: "Two riders driving a herd of horses splashing across a river in western Mongolia",
    width: 1920,
    height: 1280,
    credit: {
      author: "Bfreeproductions",
      license: "CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Two_brothers_lead_a_herd_of_horses_across_a_river_in_Western_Mongolia.jpg",
    },
  },
  orkhonWaterfall: {
    src: "/images/central/orkhon-waterfall.jpg",
    alt: "Ulaan Tsutgalan waterfall dropping into a dark pool within a basalt gorge in the Orkhon Valley",
    width: 1920,
    height: 1142,
    credit: {
      author: "Bernard Gagnon",
      license: "CC0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Ulaan_Tsutgalan_Waterfall.jpg",
    },
  },
  erdeneZuuWalls: {
    src: "/images/central/erdene-zuu.jpg",
    alt: "Temple buildings with curved roofs behind the red-plastered walls of Erdene Zuu Monastery",
    width: 1920,
    height: 1280,
    credit: {
      author: "Bernard Gagnon",
      license: "CC0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Erdene_Zuu_Monastery_08.jpg",
    },
  },
  erdeneZuuTemple: {
    src: "/images/central/erdene-zuu-temple.jpg",
    alt: "A whitewashed temple with green tiered roofs inside the grounds of Erdene Zuu Monastery",
    width: 1920,
    height: 1280,
    credit: {
      author: "Bernard Gagnon",
      license: "CC0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Erdene_Zuu_Monastery_06.jpg",
    },
  },
  centralSteppeClouds: {
    src: "/images/central/khustai-clouds.jpg",
    alt: "Granite boulders scattered across a green hillside under dramatic clouds in central Mongolia",
    width: 1920,
    height: 1080,
    credit: {
      author: "Rob Oo from NL",
      license: "CC BY 2.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Cloudy_(49893141246).jpg",
    },
  },
  tereljSky: {
    src: "/images/terelj/terelj-skies.jpg",
    alt: "A huge blue sky with wispy clouds above a gentle grassy hill in Terelj",
    width: 1920,
    height: 1079,
    credit: {
      author: "P.Lechien",
      license: "CC0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Terelj_skies.jpg",
    },
  },
  tereljValley: {
    src: "/images/terelj/terelj-steppe.jpg",
    alt: "Sunlit green valley and forested hills under white clouds in Gorkhi-Terelj National Park",
    width: 1920,
    height: 1079,
    credit: {
      author: "P.Lechien",
      license: "CC0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Terelj-Gorkhi_steppe.jpg",
    },
  },
  tereljTurtleRock: {
    src: "/images/terelj/turtle-rock.jpg",
    alt: "The great granite formation known as Turtle Rock against a cloudy sky in Terelj",
    width: 1920,
    height: 1440,
    credit: {
      author: "Vidor at English Wikipedia",
      license: "Public domain",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Turtle_Rock_Mongolia.jpg",
    },
  },
  mongolianHorse: {
    src: "/images/terelj/mongolian-horse.jpg",
    alt: "A chestnut Mongolian horse grazing on a summer meadow with ger camps and forest behind",
    width: 1920,
    height: 1281,
    credit: {
      author: "Marcin Konsek",
      license: "CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Ko%C5%84_mongolski_w_Parku_Narodowym_Gorchi-Tereld%C5%BC_09.JPG",
    },
  },
  horsesMeadow: {
    src: "/images/terelj/horses-grazing.jpg",
    alt: "Mongolian horses grazing in a wide meadow beneath forested hills in Terelj",
    width: 1920,
    height: 1280,
    credit: {
      author: "Marcin Konsek",
      license: "CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Konie_mongolskie_w_Parku_Narodowym_Gorchi-Tereld%C5%BC_01.JPG",
    },
  },
  gerInterior: {
    src: "/images/terelj/ger-terelj.jpg",
    alt: "Inside a guest ger with a carved wooden frame, stove and a bed with an embroidered cover",
    width: 1920,
    height: 1340,
    credit: {
      author: "Pierre André Leclercq",
      license: "CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Yurt_in_Gorkhi-Terelj_National_Park_en_2011.jpg",
    },
  },
  easternLakeDusk: {
    src: "/images/eastern/khokh-nuur.jpg",
    alt: "Still water of Khokh Nuur lake in eastern Mongolia glowing at dusk with a thin crescent moon",
    width: 1920,
    height: 1080,
    credit: {
      author: "BatboldDorjgurkhem",
      license: "CC BY 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Khokh_Nuur_Dornod_Mongolia.jpg",
    },
  },
  naadamHorseRace: {
    src: "/images/culture/naadam-horse-race.jpg",
    alt: "A young jockey riding a grey horse past crowds at the Naadam horse race",
    width: 1920,
    height: 1280,
    credit: {
      author: "Bernard Gagnon",
      license: "CC0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Naadam_2023_-_Horse_racing_09.jpg",
    },
  },
  naadamWrestlers: {
    src: "/images/culture/naadam-ceremony.jpg",
    alt: "Mongolian wrestlers in traditional costume performing the eagle dance at the Naadam opening ceremony",
    width: 1920,
    height: 1246,
    credit: {
      author: "Bernard Gagnon",
      license: "CC0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Naadam_2023,_Ulan_Bator_07.jpg",
    },
  },
  naadamMusicians: {
    src: "/images/culture/naadam-musicians.jpg",
    alt: "An ensemble of musicians in white deel robes playing traditional instruments on a decorated stage",
    width: 1920,
    height: 1199,
    credit: {
      author: "Bernard Gagnon",
      license: "CC0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Musicians_at_Naadam_2023.jpg",
    },
  },
  olgiiFestivalElders: {
    src: "/images/culture/naadam-olgii.jpg",
    alt: "Women in colourful deel robes resting on rocks above a lake at a Naadam gathering in Bayan-Olgii",
    width: 1920,
    height: 1280,
    credit: {
      author: "Bfreeproductions",
      license: "CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Women_resting_at_a_Mongolian_Naadam_Festival_in_Bayan-%C3%96lgii.jpg",
    },
  },
  ridersSteppe: {
    src: "/images/culture/riders-steppe.jpg",
    alt: "Two riders on horseback crossing a green steppe valley with rolling hills behind",
    width: 1920,
    height: 1280,
    credit: {
      author: "Marcin Konsek",
      license: "CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Je%C5%BAd%C5%BAcy_na_stepie_przed_rozpocz%C4%99ciem_lokalnego_festiwalu_Naadam_(01).jpg",
    },
  },
  boyWithHorses: {
    src: "/images/culture/boy-and-horses.jpg",
    alt: "A young Mongolian boy standing on the steppe with two saddled horses",
    width: 1920,
    height: 1280,
    credit: {
      author: "Marcin Konsek",
      license: "CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Mongolski_ch%C5%82opiec_i_konie_na_stepie_podczas_lokalnego_festiwalu_Naadam_(04).jpg",
    },
  },
  nomadsWinterMove: {
    src: "/images/culture/nomads-moving.jpg",
    alt: "A nomadic family moving camp with Bactrian camels loaded with belongings across snowy ground",
    width: 1620,
    height: 1080,
    credit: {
      author: "DAriunbolor",
      license: "CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Nomadic_family,_using_camels_to_move.jpg",
    },
  },
  gobiGerCamp: {
    src: "/images/camps/ger-camp-gobi.jpg",
    alt: "A row of white gers with smoke rising from their stove pipes on the Gobi plain at dawn",
    width: 1920,
    height: 1440,
    credit: {
      author: "David Berkowitz from New York, NY, USA",
      license: "CC BY 2.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Ger_Camp_-_Yurt_-_Dornogovi_Province_-_Mongolia_(6248226196).jpg",
    },
  },
  winterRiver: {
    src: "/images/winter/winter-steppe.jpg",
    alt: "A partly frozen river winding through snow-covered forest in the Mongolian winter",
    width: 1920,
    height: 1095,
    credit: {
      author: "Dembee Tsogoo",
      license: "CC BY 3.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Mongolia_Winter_(127750833).jpeg",
    },
  },
  winterForest: {
    src: "/images/winter/winter-countryside.jpg",
    alt: "Snow falling over a larch forest and a quiet road in the Mongolian countryside",
    width: 1688,
    height: 1126,
    credit: {
      author: "Yumjirdulam0501",
      license: "CC0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Countryside_of_Mongolia_in_winter_time.jpg",
    },
  },
  ulaanbaatarCity: {
    src: "/images/ulaanbaatar/city-view.jpg",
    alt: "Rooftops of central Ulaanbaatar with temple roofs and modern buildings under a blue sky",
    width: 1920,
    height: 1170,
    credit: {
      author: "Bernard Gagnon",
      license: "CC0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:View_of_Ulaanbaatar_01.jpg",
    },
  },
} as const satisfies Record<string, ImageAsset>;

export type ImageKey = keyof typeof images;
