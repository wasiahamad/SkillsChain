import axios from 'axios';

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

// Generate certificate text using a template (no AI)
const generateCertificateText = async (skillName, userName, skillLevel) => {
  return `This is to certify that ${userName} has successfully achieved the ${skillLevel} level in ${skillName}. This certificate recognizes their dedication, skill mastery, and commitment to professional growth in this field.`;
};

// Get embeddings from Hugging Face
async function getEmbeddings(texts) {
  const response = await axios.post(
    'https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2',
    { inputs: texts },
    {
      headers: { Authorization: `Bearer ${HUGGINGFACE_API_KEY}` }
    }
  );
  return response.data;
}

// Cosine similarity function
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// AI job matching using Hugging Face embeddings
const matchJobsToCandidate = async (userSkills, jobs) => {
  try {
    // Combine user skills into one string
    const userSkillsText = userSkills.join(', ');
    // Get embedding for user skills
    const userEmbedding = (await getEmbeddings([userSkillsText]))[0];

    // For each job, get embedding for required skills and calculate similarity
    const results = [];
    for (const job of jobs) {
      const jobSkillsText = job.skillsRequired.join(', ');
      const jobEmbedding = (await getEmbeddings([jobSkillsText]))[0];
      const similarity = cosineSimilarity(userEmbedding, jobEmbedding);
      results.push({ jobId: job._id || job.id, matchPercent: Math.round(similarity * 100) });
    }
    return results;
  } catch (error) {
    console.error('Error matching jobs:', error);
    throw new Error('Failed to match jobs');
  }
};

export { generateCertificateText, matchJobsToCandidate };