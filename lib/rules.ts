export function getRecommendation(score: number): string {
  if (score < 50) return "We recommend revisiting this topic for better understanding."
  if (score < 80) return "Good job! Try a practice quiz to reinforce your learning."
  return "Excellent! Move on to the next topic."
}
