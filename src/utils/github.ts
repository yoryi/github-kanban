export const getGithubInfo = (
  repo_url: string
): {
  user?: string | null;
  repo?: string | null;
  isValid: boolean;
} => {
  const checkGitRe = new RegExp("(?:git@|https://)github.com[:/](.*)", "g");
  const isValid = checkGitRe.test(repo_url);

  if (isValid) {
    const repo_details = repo_url.split("https://github.com/")?.[1].split("/");

    return {
      user: repo_details?.[0],
      repo: repo_details?.[1],
      isValid,
    };
  } else {
    return {
      isValid,
    };
  }
};

export const isValidGitUrl = (repo_url: string) => {
  const checkGitRe = new RegExp("(?:git@|https://)github.com[:/](.*)", "g");
  return checkGitRe.test(repo_url);
};
