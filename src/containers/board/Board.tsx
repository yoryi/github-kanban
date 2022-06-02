import { useCallback } from "react";

import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";

import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

import { Column } from "../../components/column";
import { useRepoContext } from "../../context";
import { Status, Issue } from "../../types";

export const Board = () => {
  const { state, dispatch } = useRepoContext();

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) {
        return;
      }

      if (result.type === "COLUMN") {
        dispatch({
          type: "moveColumn",
          payload: {
            source: result.source.index,
            destination: result.destination.index,
          },
        });

        return;
      }

      if (result.type === "ISSUE_LIST") {
        dispatch({
          type: "moveIssue",
          payload: {
            currentStatus: result.source.droppableId as Status,
            targetStatus: result.destination.droppableId as Status,
            currentId: result.source.index,
            targetId: result.destination.index,
          },
        });
      }
    },
    [dispatch]
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="board" type="COLUMN" direction="horizontal">
        {(provided) => (
          <Row
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="bg-light py-4"
            style={{
              minHeight: "calc(100vh - 150px)",
            }}
          >
            {state?.loading ? (
              <div className="d-flex justify-content-center align-items-center">
                <Spinner animation="border" />
              </div>
            ) : (
              <>
                {state.ordered.map((key, index) => (
                  <Column
                    status={key}
                    index={index}
                    issues={
                      state.columns?.[key]?.map((_issueNum) =>
                        state.issues.find(
                          (_issue) => _issue.number === _issueNum
                        )
                      ) as Issue[]
                    }
                    key={key}
                  />
                ))}
                {provided.placeholder}
              </>
            )}
          </Row>
        )}
      </Droppable>
    </DragDropContext>
  );
};
