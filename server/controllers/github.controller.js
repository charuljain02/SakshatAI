import { askAi } from "../services/openRouter.service.js";

import {
  getGithubData,
} from "../services/github.service.js";

export const analyzeGithubProfile = async (
  req,
  res
) => {
  try {

    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "GitHub username required",
      });
    }

    const githubData =
      await getGithubData(username);

    const profile = githubData.profile;

    const repoSummary =
      githubData.repos.map((repo) => ({
        name: repo.name,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        description: repo.description,
      }));

    const messages = [
      {
        role: "system",

        content: `
You are a senior software engineering recruiter.

Analyze this GitHub profile.

Return ONLY valid JSON.

{
  "strengths": [],
  "weaknesses": [],
  "missingProjects": [],
  "skillsToLearn": [],
  "resumeSuggestions": [],
  "careerScore": 0
}
`,
      },

      {
        role: "user",

        content: `
Profile:

${JSON.stringify(profile)}

Repositories:

${JSON.stringify(repoSummary)}
`,
      },
    ];

    const aiResponse =
      await askAi(messages);

    const cleaned =
      aiResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    const analysis =
      JSON.parse(cleaned);

    return res.status(200).json({
      success: true,

      profile: {
        name: profile.name,
        login: profile.login,
        avatar: profile.avatar_url,
        bio: profile.bio,
        followers: profile.followers,
        following: profile.following,
        publicRepos:
          profile.public_repos,
      },

      languages:
        githubData.languageMap,

      analysis,
    });

  } catch (error) {

    console.log(
      "GITHUB ANALYZER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};