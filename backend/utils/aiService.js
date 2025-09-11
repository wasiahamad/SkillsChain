import OpenAI from 'openai';

// Initialize OpenAI client

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate certificate text using AI
const generateCertificateText = async (skillName, userName, skillLevel) => {
  try {
    const prompt = `Generate a professional certificate text for ${userName} who has achieved ${skillLevel} level in ${skillName}. 
    The certificate should be formal, include details about the skill mastery, and be about 50-100 words.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a certificate generation assistant. Create professional certificate texts." },
        { role: "user", content: prompt }
      ],
      max_tokens: 200,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating certificate text:', error);
    throw new Error('Failed to generate certificate text');
  }
};

// AI job matching
const matchJobsToCandidate = async (userSkills, jobs) => {
  try {
    const prompt = `Match the following user skills: ${userSkills.join(', ')} 
    to these job opportunities: ${jobs.map(job => `${job.title} (Required: ${job.skillsRequired.join(', ')})`).join('; ')}.
    Return a JSON array with job IDs and match percentages.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a job matching assistant. Analyze skills and match them to job requirements." },
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
    });

    const matches = JSON.parse(completion.choices[0].message.content);
    return matches;
  } catch (error) {
    console.error('Error matching jobs:', error);
    throw new Error('Failed to match jobs');
  }
};

export { generateCertificateText, matchJobsToCandidate };