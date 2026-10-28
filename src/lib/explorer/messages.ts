import type { Locale } from "@/types/common";
import type { PlaceKind, RouteUnavailableReason, TravelMode } from "@/types/explorer";

/**
 * UI strings for the world explorer. English and Mongolian are complete;
 * other locales fall back to English until translated. The `mn` locale goes
 * live site-wide by enabling it in `lib/i18n.ts`.
 */

export interface ExplorerMessages {
  meta: { title: string; description: string };
  heading: string;
  intro: string;
  search: {
    label: string;
    placeholder: string;
    placeholderReplace: (name: string) => string;
    countries: string;
    places: string;
    noResults: string;
    error: string;
    searching: string;
    clear: string;
    cancelReplace: string;
    kinds: Record<PlaceKind, string>;
  };
  route: {
    heading: string;
    emptyTitle: string;
    emptyBody: string;
    example: string;
    exampleRoute: string;
    start: string;
    stop: (n: number) => string;
    remove: (name: string) => string;
    replace: (name: string) => string;
    moveUp: (name: string) => string;
    moveDown: (name: string) => string;
    dragHandle: (name: string) => string;
    clear: string;
    maxStops: (n: number) => string;
    addMore: string;
    legMode: (from: string, to: string) => string;
  };
  modes: Record<TravelMode, string>;
  leg: {
    loading: string;
    flightNote: string;
    borderNote: string;
    tryFlight: string;
    retry: string;
    reasons: Record<RouteUnavailableReason, string>;
  };
  summary: {
    heading: string;
    totalDistance: string;
    roadTime: string;
    legs: (n: number) => string;
    flightDistanceNote: string;
    estimatesNote: string;
    unrouted: (n: number) => string;
    duration: (hours: number, minutes: number) => string;
  };
  map: {
    loading: string;
    error: string;
    globe: string;
    flat: string;
    fitRoute: string;
    showPanel: string;
    hidePanel: string;
    expandPanel: string;
    collapsePanel: string;
    zoomIn: string;
    zoomOut: string;
    resetBearing: string;
    fullscreen: string;
    exitFullscreen: string;
    boundariesNote: string;
  };
  country: {
    close: string;
    capital: string;
    region: string;
    currency: string;
    languages: string;
    callingCode: string;
    area: string;
    landlocked: string;
    yes: string;
    no: string;
    addCapital: (capital: string) => string;
    capitalNotFound: string;
    source: string;
    mongoliaFeatured: string;
    mongoliaCta: string;
    mongoliaDestinations: string;
  };
  featured: {
    heading: string;
    body: string;
    approximate: string;
    view: string;
    addToRoute: string;
  };
  share: { button: string; copied: string; failed: string };
}

const en: ExplorerMessages = {
  meta: {
    title: "World Explorer & Route Planner",
    description:
      "Explore countries worldwide on an interactive map and plan multi-stop routes by road or illustrative flight lines — with Mongolia as our featured destination.",
  },
  heading: "Explore the world",
  intro: "Search any country, city or place, then build a route stop by stop.",
  search: {
    label: "Search places",
    placeholder: "Search a country, city or place",
    placeholderReplace: (name) => `Replace ${name} with…`,
    countries: "Countries",
    places: "Places",
    noResults: "No matches. Try a different spelling or a nearby city.",
    error: "Search is unavailable right now. Please try again shortly.",
    searching: "Searching…",
    clear: "Clear search",
    cancelReplace: "Cancel replacing",
    kinds: { country: "Country", region: "Region", city: "City", place: "Place" },
  },
  route: {
    heading: "Your route",
    emptyTitle: "Start a journey",
    emptyBody: "Search for a city or landmark above to add your first stop. Click any country on the map to learn about it.",
    example: "Try an example",
    exampleRoute: "Ulaanbaatar → Seoul → Tokyo → Osaka → Bangkok → Singapore",
    start: "Start",
    stop: (n) => `Stop ${n}`,
    remove: (name) => `Remove ${name}`,
    replace: (name) => `Replace ${name}`,
    moveUp: (name) => `Move ${name} earlier`,
    moveDown: (name) => `Move ${name} later`,
    dragHandle: (name) => `Drag to reorder ${name}`,
    clear: "Clear route",
    maxStops: (n) => `Routes can have up to ${n} stops.`,
    addMore: "Search above to add another stop.",
    legMode: (from, to) => `Travel mode from ${from} to ${to}`,
  },
  modes: { driving: "Drive", walking: "Walk", cycling: "Cycle", flight: "Flight" },
  leg: {
    loading: "Finding route…",
    flightNote: "Illustrative straight line, not an actual flight path. No schedules or fares are shown.",
    borderNote: "Crosses a border. Check entry rules and whether this crossing is open to travellers.",
    tryFlight: "Show as flight",
    retry: "Try again",
    reasons: {
      not_configured: "Road routing isn't set up on this site yet, so no road route is shown.",
      no_route: "No road connection was found. These stops may be separated by sea or a closed border.",
      no_road_nearby: "One of these stops is too far from a road to route from.",
      too_far: "This leg is longer than the routing service allows. Split it with a stop in between, or show it as a flight.",
      quota: "The routing service's daily limit has been reached. Please try again later.",
      rate_limited: "Too many route requests. Please wait a minute and try again.",
      provider_error: "The routing service didn't respond. Please try again.",
      invalid: "This leg couldn't be routed.",
    },
  },
  summary: {
    heading: "Journey summary",
    totalDistance: "Total distance",
    roadTime: "Time on the road",
    legs: (n) => `${n} ${n === 1 ? "leg" : "legs"}`,
    flightDistanceNote: "Flight legs count straight-line distance.",
    estimatesNote: "Road times are routing estimates without traffic, border waits or stops.",
    unrouted: (n) => `${n} ${n === 1 ? "leg has" : "legs have"} no route and ${n === 1 ? "is" : "are"} not counted.`,
    duration: (h, m) => (h > 0 ? `${h} h ${m} min` : `${m} min`),
  },
  map: {
    loading: "Loading world map…",
    error: "The map couldn't load. Your browser may not support WebGL, or the map service is unreachable.",
    globe: "Globe view",
    flat: "Flat map",
    fitRoute: "Fit route on map",
    showPanel: "Show planner",
    hidePanel: "Hide planner",
    expandPanel: "Expand planner",
    collapsePanel: "Collapse planner",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    resetBearing: "Reset north",
    fullscreen: "Full screen",
    exitFullscreen: "Exit full screen",
    boundariesNote: "Country shapes are simplified and do not imply any position on disputed borders.",
  },
  country: {
    close: "Close country details",
    capital: "Capital",
    region: "Region",
    currency: "Currency",
    languages: "Languages",
    callingCode: "Calling code",
    area: "Area",
    landlocked: "Landlocked",
    yes: "Yes",
    no: "No",
    addCapital: (capital) => `Add ${capital} to route`,
    capitalNotFound: "Couldn't find that city right now. Try searching for it above.",
    source: "Country facts: mledoze/countries (ODbL). Always check official travel advice before you go.",
    mongoliaFeatured: "Our home country",
    mongoliaCta: "Browse Mongolia tours",
    mongoliaDestinations: "Mongolia destinations",
  },
  featured: {
    heading: "Mongolia highlights",
    body: "The regions we know best. Pins mark a well-known site in each region.",
    approximate: "Approximate location",
    view: "View destination",
    addToRoute: "Add to route",
  },
  share: { button: "Copy route link", copied: "Link copied", failed: "Couldn't copy. Copy the address bar instead." },
};

const mn: ExplorerMessages = {
  meta: {
    title: "Дэлхийн аялал ба маршрут төлөвлөгч",
    description:
      "Дэлхийн улс орнуудыг интерактив газрын зураг дээр судалж, олон зогсоолтой маршрутаа авто зам эсвэл нислэгийн жишээ шугамаар төлөвлөөрэй. Монгол бол бидний онцлох чиглэл.",
  },
  heading: "Дэлхийг нээ",
  intro: "Улс, хот, газар хайж, маршрутаа зогсоол бүрээр бүтээгээрэй.",
  search: {
    label: "Газар хайх",
    placeholder: "Улс, хот эсвэл газар хайх",
    placeholderReplace: (name) => `${name}-г солих…`,
    countries: "Улсууд",
    places: "Газрууд",
    noResults: "Илэрц олдсонгүй. Өөрөөр бичиж эсвэл ойролцоох хотоор хайна уу.",
    error: "Хайлт одоогоор ажиллахгүй байна. Түр хүлээгээд дахин оролдоно уу.",
    searching: "Хайж байна…",
    clear: "Хайлтыг арилгах",
    cancelReplace: "Солихоо цуцлах",
    kinds: { country: "Улс", region: "Бүс нутаг", city: "Хот", place: "Газар" },
  },
  route: {
    heading: "Таны маршрут",
    emptyTitle: "Аяллаа эхлүүлэх",
    emptyBody: "Эхний зогсоолоо нэмэхийн тулд дээрээс хот эсвэл үзэсгэлэнт газар хайна уу. Газрын зураг дээрх аль ч улсыг дарж мэдээлэл аваарай.",
    example: "Жишээ үзэх",
    exampleRoute: "Улаанбаатар → Сөүл → Токио → Осака → Бангкок → Сингапур",
    start: "Эхлэл",
    stop: (n) => `Зогсоол ${n}`,
    remove: (name) => `${name}-г хасах`,
    replace: (name) => `${name}-г солих`,
    moveUp: (name) => `${name}-г өмнө нь шилжүүлэх`,
    moveDown: (name) => `${name}-г дараа нь шилжүүлэх`,
    dragHandle: (name) => `${name}-г чирж дараалал өөрчлөх`,
    clear: "Маршрутыг цэвэрлэх",
    maxStops: (n) => `Маршрут хамгийн ихдээ ${n} зогсоолтой байна.`,
    addMore: "Өөр зогсоол нэмэхийн тулд дээрээс хайна уу.",
    legMode: (from, to) => `${from}-с ${to} хүрэх аяллын хэлбэр`,
  },
  modes: { driving: "Машин", walking: "Явган", cycling: "Дугуй", flight: "Нислэг" },
  leg: {
    loading: "Маршрут хайж байна…",
    flightNote: "Жишээ шулуун шугам бөгөөд бодит нислэгийн зам биш. Хуваарь, үнэ харуулахгүй.",
    borderNote: "Хил дамжина. Нэвтрэх журам болон энэ боомт аялагчдад нээлттэй эсэхийг шалгана уу.",
    tryFlight: "Нислэгээр харуулах",
    retry: "Дахин оролдох",
    reasons: {
      not_configured: "Энэ сайтад авто замын маршрут тооцоолол хараахан тохируулагдаагүй тул замын маршрут харуулахгүй.",
      no_route: "Авто замын холболт олдсонгүй. Эдгээр зогсоол далай эсвэл хаалттай хилээр тусгаарлагдсан байж магадгүй.",
      no_road_nearby: "Зогсоолуудын нэг нь замаас хэт хол байгаа тул маршрут тооцох боломжгүй.",
      too_far: "Энэ хэсэг маршрутын үйлчилгээний зөвшөөрөх хэмжээнээс урт байна. Дунд нь зогсоол нэмэх эсвэл нислэгээр харуулна уу.",
      quota: "Маршрутын үйлчилгээний өдрийн хязгаар дууссан. Дараа дахин оролдоно уу.",
      rate_limited: "Хэт олон хүсэлт илгээлээ. Нэг минут хүлээгээд дахин оролдоно уу.",
      provider_error: "Маршрутын үйлчилгээ хариу өгсөнгүй. Дахин оролдоно уу.",
      invalid: "Энэ хэсгийн маршрутыг тооцох боломжгүй.",
    },
  },
  summary: {
    heading: "Аяллын хураангуй",
    totalDistance: "Нийт зай",
    roadTime: "Замд зарцуулах хугацаа",
    legs: (n) => `${n} хэсэг`,
    flightDistanceNote: "Нислэгийн хэсгийг шулуун зайгаар тооцсон.",
    estimatesNote: "Замын хугацаа нь түгжрэл, хилийн хүлээлт, зогсолтыг тооцоогүй ойролцоо тооцоо.",
    unrouted: (n) => `${n} хэсэгт маршрут олдоогүй тул тооцоонд ороогүй.`,
    duration: (h, m) => (h > 0 ? `${h} цаг ${m} мин` : `${m} мин`),
  },
  map: {
    loading: "Дэлхийн газрын зургийг ачаалж байна…",
    error: "Газрын зураг ачаалагдсангүй. Таны хөтөч WebGL дэмждэггүй эсвэл газрын зургийн үйлчилгээнд холбогдож чадсангүй.",
    globe: "Бөмбөрцөг харагдац",
    flat: "Хавтгай газрын зураг",
    fitRoute: "Маршрутыг бүтнээр харуулах",
    showPanel: "Төлөвлөгчийг харуулах",
    hidePanel: "Төлөвлөгчийг нуух",
    expandPanel: "Төлөвлөгчийг дэлгэх",
    collapsePanel: "Төлөвлөгчийг хураах",
    zoomIn: "Ойртуулах",
    zoomOut: "Холдуулах",
    resetBearing: "Хойд зүг рүү эргүүлэх",
    fullscreen: "Бүтэн дэлгэц",
    exitFullscreen: "Бүтэн дэлгэцээс гарах",
    boundariesNote: "Улсын хил хялбаршуулсан бөгөөд маргаантай хилийн талаар байр суурь илэрхийлэхгүй.",
  },
  country: {
    close: "Улсын мэдээллийг хаах",
    capital: "Нийслэл",
    region: "Бүс",
    currency: "Мөнгөн тэмдэгт",
    languages: "Хэл",
    callingCode: "Утасны код",
    area: "Талбай",
    landlocked: "Далайд гарцгүй",
    yes: "Тийм",
    no: "Үгүй",
    addCapital: (capital) => `${capital}-г маршрутад нэмэх`,
    capitalNotFound: "Энэ хотыг одоогоор олж чадсангүй. Дээрх хайлтаар хайж үзнэ үү.",
    source: "Улсын мэдээлэл: mledoze/countries (ODbL). Аялахаасаа өмнө албан ёсны аялалын зөвлөмжийг заавал шалгана уу.",
    mongoliaFeatured: "Бидний эх орон",
    mongoliaCta: "Монголын аяллууд үзэх",
    mongoliaDestinations: "Монголын чиглэлүүд",
  },
  featured: {
    heading: "Монголын онцлох газрууд",
    body: "Бидний хамгийн сайн мэддэг бүс нутгууд. Тэмдэг бүр тухайн бүсийн алдартай газрыг заана.",
    approximate: "Ойролцоо байршил",
    view: "Чиглэлийг үзэх",
    addToRoute: "Маршрутад нэмэх",
  },
  share: { button: "Маршрутын холбоос хуулах", copied: "Холбоос хуулагдлаа", failed: "Хуулж чадсангүй. Хаягийн мөрөөс хуулна уу." },
};

const dictionaries: Partial<Record<Locale, ExplorerMessages>> = { en, mn };

export function getExplorerMessages(locale: Locale): ExplorerMessages {
  return dictionaries[locale] ?? en;
}
