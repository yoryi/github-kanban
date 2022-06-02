import React, { useMemo, useReducer, useContext, useEffect } from "react";
import { useLocalStorage } from "../hooks";

import { Issue, Status } from "../types";
import {
  arrayMove,
  insertAtIndex,
  isEmpty,
  removeAtIndex,
  reorder,
} from "../utils/array";
import { getGithubInfo } from "../utils/github";

type Action =
  | {
      type: "setIssues";
      payload: {
        repo_key: string;
        issues: Issue[];
      };
    }
  | {
      type: "setRepoUrl";
      payload: {
        repoUrl: string;
      };
    }
  | {
      type: "setLoading";
      payload: {
        loading: boolean;
      };
    }
  | {
      type: "moveIssue";
      payload: {
        currentStatus: Status;
        targetStatus: Status;
        targetId: number;
        currentId: number;
      };
    }
  | {
      type: "moveColumn";
      payload: {
        source: number;
        destination: number;
      };
    };

type Dispatch = (action: Action) => void;
type State = {
  issues: Issue[];
  repoUrl: string;
  loading: boolean;
  ordered: Status[];
  columns: {
    [key: string]: number[];
  };
};

export const RepoContext = React.createContext<
  | {
      state: State;
      dispatch: Dispatch;
    }
  | undefined
>(undefined);

type RepoContextProviderProps = {
  children: React.ReactNode;
};

const repoReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "setIssues":
      const repoData = JSON.parse(
        window.localStorage.getItem("repo_state") || "{}"
      );

      const storedColumns = repoData?.[action.payload.repo_key]?.columns;

      if (storedColumns && !isEmpty(storedColumns)) {
        const allIssues = Object.keys(storedColumns)
          .map((key) => storedColumns[key])
          .flat();

        const newIssues = action.payload.issues
          .filter(
            (_issue) =>
              !allIssues.includes(_issue.number) && _issue.state === "open"
          )
          .map((_issue) => _issue.number);

        return {
          ...state,
          issues: action.payload.issues,
          columns: {
            ...storedColumns,
            backlog: [...newIssues, ...storedColumns.backlog],
          },
        };
      } else {
        return {
          ...state,
          issues: action.payload.issues,
          columns: {
            backlog: action.payload?.issues
              .filter((_issue) => _issue.state === "open")
              .map((_issue) => _issue.number),
            in_progress: [],
            completed: [],
          },
        };
      }

    case "moveColumn":
      return {
        ...state,
        ordered: reorder(
          [...state.ordered],
          action.payload.source,
          action.payload.destination
        ),
      };

    case "setRepoUrl":
      return {
        ...state,
        repoUrl: action.payload.repoUrl,
      };
    case "setLoading":
      return {
        ...state,
        loading: action.payload.loading,
      };
    case "moveIssue":
      const itemToMove =
        state.columns[action.payload.currentStatus][action.payload.currentId];

      if (action.payload.currentStatus === action.payload.targetStatus) {
        return {
          ...state,
          columns: {
            ...state.columns,
            [action.payload.targetStatus]: arrayMove(
              state.columns[action.payload.currentStatus],
              action.payload.currentId,
              action.payload.targetId
            ),
          },
        };
      } else {
        return {
          ...state,
          columns: {
            ...state.columns,
            [action.payload.currentStatus]: removeAtIndex(
              state.columns[action.payload.currentStatus],
              action.payload.currentId
            ),
            [action.payload.targetStatus]: insertAtIndex(
              state.columns[action.payload.targetStatus],
              action.payload.targetId,
              itemToMove
            ),
          },
        };
      }

    default:
      return state;
  }
};

export const RepoContextProvider = ({ children }: RepoContextProviderProps) => {
  const [storedState, setStorage] = useLocalStorage("repo_state", {});

  const [state, dispatch] = useReducer(repoReducer, {
    issues: [],
    repoUrl: "",
    loading: false,
    columns: {},
    ordered: ["backlog", "in_progress", "completed"],
  });

  useEffect(() => {
    if (state?.repoUrl) {
      const repoInfo = getGithubInfo(state.repoUrl);
      const { issues, ...tempState } = state;

      setStorage({
        ...storedState,
        [`${repoInfo.user}_${repoInfo.repo}`]: {
          ...tempState,
        },
      });
    }
  }, [state.issues, state.columns]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <RepoContext.Provider value={value}>{children}</RepoContext.Provider>;
};

export const useRepoContext = () => {
  const repoContext = useContext(RepoContext);

  if (repoContext === undefined) {
    throw new Error("useRepoContext must be within a RepoContextProvider");
  }

  return repoContext;
};
