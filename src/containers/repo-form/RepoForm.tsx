import { useState, useCallback, ChangeEvent, useMemo, FormEvent } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

import { getGithubInfo, isValidGitUrl } from "../../utils/github";
import { useRepoContext } from "../../context";
import { useLocalStorage } from "../../hooks";

export const RepoForm = () => {
  const { state } = useRepoContext();
  const [, setCurrentRepo] = useLocalStorage("curren_repo", "");
  const [repoUrl, setRepoUrl] = useState(state.repoUrl);

  const { dispatch } = useRepoContext();

  const onChangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setRepoUrl(e.target.value);
      setCurrentRepo(e.target.value);
    },
    [setCurrentRepo, setRepoUrl]
  );

  const onSumbitRepo = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const githubInfo = getGithubInfo(repoUrl);

      if (githubInfo.isValid) {
        dispatch({
          type: "setRepoUrl",
          payload: {
            repoUrl,
          },
        });

        try {
          dispatch({
            type: "setLoading",
            payload: {
              loading: true,
            },
          });

          const result = await fetch(
            `https://api.github.com/repos/${githubInfo.user}/${githubInfo.repo}/issues?state=all`
          ).then((res) => res.json());

          dispatch({
            type: "setIssues",
            payload: {
              issues: result,
            },
          });

          dispatch({
            type: "setLoading",
            payload: {
              loading: false,
            },
          });
        } catch (e) {
          dispatch({
            type: "setLoading",
            payload: {
              loading: true,
            },
          });
        }
      }
    },
    [repoUrl, dispatch]
  );

  const isValid = useMemo(() => {
    return isValidGitUrl(repoUrl);
  }, [repoUrl]);

  return (
    <Form onSubmit={onSumbitRepo} className="p-0">
      <Stack direction="horizontal" className="align-items-start py-4" gap={1}>
        <Form.Group className="flex-grow-1">
          <Form.Control
            type="text"
            placeholder="Repo Url"
            value={repoUrl}
            onChange={onChangeHandler}
            isInvalid={!isValid && repoUrl !== ""}
          />
          {repoUrl !== "" && !isValid && (
            <Form.Control.Feedback type="invalid">
              Please input the correct github repo url
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Button
          type="submit"
          disabled={repoUrl === "" || !isValid}
          className="flex-shrink-0"
        >
          Load Issues
        </Button>
      </Stack>
    </Form>
  );
};
