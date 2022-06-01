import { useMemo } from "react";
import { Breadcrumb } from "react-bootstrap";
import { useRepoContext } from "../../context";
import { getGithubInfo } from "../../utils/github";

export const Nav = () => {
  const { state } = useRepoContext();

  const paths = useMemo(() => {
    const repoInfo = getGithubInfo(state?.repoUrl ?? "");

    if (repoInfo.isValid) {
      return [
        {
          name: repoInfo.user,
          path: `https://github.com/${repoInfo.user}`,
        },
        {
          name: repoInfo.repo,
          path: `https://github.com/${repoInfo.user}/${repoInfo.repo}`,
        },
      ];
    } else {
      return null;
    }
  }, [state]);

  return (
    <Breadcrumb>
      {paths?.map((_path) => (
        <Breadcrumb.Item
          className="text-primary fw-bold fs-4"
          href={_path.path}
          key={_path.name}
        >
          {_path.name}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};
