import { db } from "./firebase"
import { collection, doc, setDoc, getDocs } from "firebase/firestore"

const dummyData = [
  {
    subject: "Physics",
    chapters: [
      {
        chapter: "Laws of Motion",
        topics: [
          {
            topic: "Newton’s First Law",
            title: "Newton’s First Law",
            description: "An object at rest stays at rest...",
            longLecture: "https://www.youtube.com/embed/1g6h6Qk8ZzI",
            miniLecture: "https://www.youtube.com/embed/kKKM8Y-u7ds",
          },
          {
            topic: "Newton’s Second Law",
            title: "Newton’s Second Law",
            description: "Force equals mass times acceleration...",
            longLecture: "https://www.youtube.com/embed/6wQpQYpF2lA",
            miniLecture: "https://www.youtube.com/embed/8m6hHRlKwxY",
          },
        ],
      },
    ],
  },
  {
    subject: "Chemistry",
    chapters: [
      {
        chapter: "Atomic Structure",
        topics: [
          {
            topic: "Bohr’s Model",
            title: "Bohr’s Model",
            description: "Electrons orbit the nucleus in fixed paths...",
            longLecture: "https://www.youtube.com/embed/1ZJ4bKjQh8Y",
            miniLecture: "https://www.youtube.com/embed/6wQpQYpF2lA",
          },
        ],
      },
    ],
  },
  {
    subject: "Math",
    chapters: [
      {
        chapter: "Calculus",
        topics: [
          {
            topic: "Limits",
            title: "Limits",
            description: "Understanding the concept of limits...",
            longLecture: "https://www.youtube.com/embed/WUvTyaaNkzM",
            miniLecture: "https://www.youtube.com/embed/8m6hHRlKwxY",
          },
        ],
      },
    ],
  },
]

export async function seedFirestore() {
  if (!db) throw new Error("Firestore is not initialized")
  const subjectsRef = collection(db, "subjects")
  const snapshot = await getDocs(subjectsRef)
  if (!snapshot.empty) return // Already seeded

  for (const subj of dummyData) {
    const subjRef = doc(subjectsRef, subj.subject)
    await setDoc(subjRef, { name: subj.subject })
    for (const chap of subj.chapters) {
      const chaptersRef = collection(subjRef, "chapters")
      const chapRef = doc(chaptersRef, chap.chapter)
      await setDoc(chapRef, { name: chap.chapter })
      for (const topic of chap.topics) {
        const topicsRef = collection(chapRef, "topics")
        const topicRef = doc(topicsRef, topic.topic)
        await setDoc(topicRef, topic)
      }
    }
  }
}
