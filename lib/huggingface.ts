import axios from "axios"

const HUGGINGFACE_TOKEN = "YOUR_HUGGINGFACE_TOKEN"

export async function generateQuiz(text: string) {
  const response = await axios.post(
    "https://api-inference.huggingface.co/models/valhalla/t5-base-qg-hl",
    { inputs: text },
    { headers: { Authorization: `Bearer ${HUGGINGFACE_TOKEN}` } }
  )
  return response.data[0]?.generated_text || ""
}

export async function generateMotivation(text: string) {
  const response = await axios.post(
    "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
    { inputs: text },
    { headers: { Authorization: `Bearer ${HUGGINGFACE_TOKEN}` } }
  )
  return response.data[0]?.summary_text || ""
}
