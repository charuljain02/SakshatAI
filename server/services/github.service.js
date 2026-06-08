import axios from "axios";

export const getGithubData = async (username) => {

  const profileRes = await axios.get(
    `https://api.github.com/users/${username}`
  );

  const repoRes = await axios.get(
    `https://api.github.com/users/${username}/repos?per_page=100`
  );

  const profile = profileRes.data;
  const repos = repoRes.data;

  const languageMap = {};

  repos.forEach((repo) => {
    if (repo.language) {
      languageMap[repo.language] =
        (languageMap[repo.language] || 0) + 1;
    }
  });

  return {
    profile,
    repos,
    languageMap,
  };
};