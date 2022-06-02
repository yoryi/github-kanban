import Stack from "react-bootstrap/Stack";
import Col from "react-bootstrap/Col";
import { Draggable, Droppable } from "react-beautiful-dnd";

import { Status, Issue } from "../../types";
import { IssueCard } from "../issue-card";

type ColumnProps = {
  status: Status;
  issues: Issue[];
  index: number;
};

export const Column = ({ status, issues, index }: ColumnProps) => {
  return (
    <Draggable draggableId={status} index={index}>
      {(provided, snapshot) => (
        <Col
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Stack>
            <h3 className="h5">
              {status === "backlog"
                ? "Backlog"
                : status === "in_progress"
                ? "In Progress"
                : status === "completed"
                ? "Completed"
                : ""}
            </h3>
            <Droppable droppableId={status} type="ISSUE_LIST">
              {(dropProvided, dropSnapshot) => (
                <Stack
                  gap={2}
                  direction="vertical"
                  ref={dropProvided.innerRef}
                  {...dropProvided.droppableProps}
                >
                  {issues?.length > 0 &&
                    issues?.map((_issue, index) => (
                      <IssueCard
                        issue={_issue}
                        key={_issue?.id}
                        index={index}
                      />
                    ))}
                  {dropProvided.placeholder}
                </Stack>
              )}
            </Droppable>
          </Stack>
        </Col>
      )}
    </Draggable>
  );
};
