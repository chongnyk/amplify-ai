export interface Flashcard {
  id: number
  keyword: string
  definition: string
  pronunciation?: string,
  category?: string
}

export const flashcards: Flashcard[] = [
  {
    id: 1,
    keyword: "捕まる",
    definition: "to be caught",
    pronunciation: "つかまる",
    category: "Vocabulary",
  },
  {
    id: 2,
    keyword: "捕まえる",
    definition: "to catch",
    pronunciation: "つかまえる",
    category: "Vocabulary",
  },
  {
    id: 3,
    keyword: "忘れる",
    definition: "to forget",
    pronunciation: "わすれる",
    category: "Vocabulary",
  },
  {
    id: 4,
    keyword: "忘れ物",
    definition: "forgotten item",
    pronunciation: "わすれもの",
    category: "Vocabulary",
  },
  {
    id: 5,
    keyword: "忘年会",
    definition: "year end party",
    category: "Vocabulary",
  },
  {
    id: 6,
    keyword: "晴れる",
    definition: "to clear up",
    category: "Vocabulary",
  },
]
