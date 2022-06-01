import { useEffect, useState } from "react";
import { Issue } from "../types";

export const useGithubIssues = (repo: string) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchIssues = async (repo_url: string) => {
      setLoading(true);
      try {
        const result = await window.fetch(repo_url).then((res) => res.json());
        setIssues(result);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };

    fetchIssues(repo);
  }, [repo]);

  return [issues, loading];
};
