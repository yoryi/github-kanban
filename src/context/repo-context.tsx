import React, { useMemo, useReducer, useContext, useEffect } from "react";
import { useLocalStorage } from "../hooks";

import { Issue, Status } from "../types";
import { arrayMove, insertAtIndex, removeAtIndex } from "../utils/array";

type Action =
  | {
      type: "setIssues";
      payload: {
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
    };

type Dispatch = (action: Action) => void;
type State = {
  repoUrl: string;
  loading: boolean;
  columns: {
    [key: string]: Issue[];
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
      return {
        ...state,
        columns: {
          backlog: action.payload.issues.filter(
            (_issue) => _issue.state === "open"
          ),
          in_progress: [],
          completed: [],
        },
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
      const itemToMove = state.columns[action.payload.currentStatus].filter(
        (_item, index) => index === action.payload.currentId
      )[0];

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
  const [storedRepo] = useLocalStorage("curren_repo", "");
  const [state, dispatch] = useReducer(repoReducer, storedState[storedRepo]);

  useEffect(
    () =>
      setStorage({
        ...storedState,
        [state.repoUrl]: {
          ...state,
        },
      }),
    [state, storedState, setStorage]
  );

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
