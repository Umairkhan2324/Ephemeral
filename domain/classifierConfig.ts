export type CategoryKey =
  | "music"
  | "sports"
  | "gaming"
  | "movies"
  | "tech"
  | "coding"
  | "news"
  | "art"
  | "travel"
  | "food"
  | "fitness"
  | "finance"
  | "general"

export type CategoryConfig = {
  include: Array<[RegExp, number]>
  exclude?: Array<[RegExp, number]>
  synonyms?: string[]
  minScore?: number
}

// Production-minded keyword/regex bank with weights.
export const CATEGORY_CONFIG: Record<CategoryKey, CategoryConfig> = {
  music: {
    include: [
      [/\b(music|song|songs|track|single|album|artist|band|playlist|concert|gig|tour|live|dj|mix|genre)\b/gi, 3],
      [/\b(spotify|apple\s*music|soundcloud|tidal|youtube\s*music|deezer)\b/gi, 3],
    ],
    exclude: [[/\b(workout|gym|exercise|iphone|mac|ios|tech|bug|api|deploy)\b/gi, 2]],
    synonyms: [
      "music","song","songs","track","single","album","artist","band","playlist","concert","tour","dj","mix","genre","spotify","soundcloud"
    ],
  },
  sports: {
    include: [[/\b(game|match|score|team|league|tournament|basketball|football|soccer|cricket|tennis|fifa|nba|nfl|premier\s*league|stadium)\b/gi, 3]],
    synonyms: ["sports","sport","match","team","league","score","tournament","basketball","football","soccer","cricket","tennis"],
  },
  gaming: {
    include: [[/\b(gaming|gamer|game|playstation|ps5|xbox|switch|nintendo|steam|epic\s*games|pc\s*gaming|fps|rpg|moba|valorant|fortnite|cod|call\s*of\s*duty)\b/gi, 3]],
    synonyms: ["gaming","gamer","game","ps5","xbox","nintendo","steam","fps","rpg","moba"],
  },
  movies: {
    include: [[/\b(movie|movies|film|cinema|actor|actress|director|screenplay|netflix|hbo|prime\s*video|disney\+|imdb|rotten\s*tomatoes|trailer|box\s*office)\b/gi, 3]],
    synonyms: ["movies","movie","film","cinema","actor","director","netflix","trailer"],
  },
  tech: {
    include: [[/\b(tech|technology|iphone|ios|ipad|mac|macbook|apple|airpods|android|pixel|samsung|ai|ml|llm|api|cloud|saas|backend|frontend|bug|deploy|server|database|supabase|vercel)\b/gi, 4]],
    synonyms: ["tech","technology","ai","ml","cloud","iphone","apple","android","api","saas","bug","deploy"],
  },
  coding: {
    include: [[/\b(code|coding|programming|developer|dev|framework|library|typescript|javascript|python|golang|java|c\+\+|c#|react|next(js)?|node(js)?|express|nest(js)?|prisma|sql|postgres|api|sdk|cli)\b/gi, 4]],
    synonyms: ["code","coding","programming","dev","typescript","javascript","python","react","nextjs","node","sql","api"],
  },
  news: {
    include: [[/\b(news|breaking|headline|report|update|press\s*release|scoop|journal|article)\b/gi, 2]],
    synonyms: ["news","breaking","headline","report"],
  },
  art: {
    include: [[/\b(art|artist|painting|draw(ing)?|sketch|design|illustration|gallery|canvas|sculpture|exhibit)\b/gi, 2]],
    synonyms: ["art","artist","painting","drawing","design","illustration"],
  },
  travel: {
    include: [[/\b(travel|trip|flight|hotel|tour|vacation|itinerary|airport|boarding|lounge|visa|backpack)\b/gi, 2]],
    synonyms: ["travel","trip","flight","hotel","vacation"],
  },
  food: {
    include: [[/\b(food|recipe|cook(ing)?|restaurant|dinner|lunch|breakfast|meal|calorie|protein|diet|kitchen|bake|grill)\b/gi, 2]],
    synonyms: ["food","recipe","cook","restaurant","meal","diet"],
  },
  fitness: {
    include: [[/\b(fitness|workout|gym|exercise|run(ning)?|yoga|health|cardio|strength|lift|weights|training|coach|protein|calisthenics|hiit)\b/gi, 4]],
    synonyms: ["fitness","workout","gym","exercise","running","yoga","cardio","strength","weights","hiit"],
  },
  finance: {
    include: [[/\b(finance|money|stock(s)?|equity|bond(s)?|crypto|bitcoin|ethereum|investment|invest|portfolio|trading|market|nasdaq|nyse|broker)\b/gi, 3]],
    synonyms: ["finance","money","stocks","crypto","bitcoin","investment","trading","market"],
  },
  general: {
    include: [[/.*/g, 0]],
    minScore: 0,
  },
}


