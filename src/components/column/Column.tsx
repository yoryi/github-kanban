import Stack from "react-bootstrap/Stack";
import Col from "react-bootstrap/Col";
import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";

import { Status, Issue } from "../../types";
import { IssueCard } from "../issue-card";

type ColumnProps = {
  status: Status;
  issues: Issue[];
};

export const Column = ({ status, issues }: ColumnProps) => {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <SortableContext id={status} items={issues} strategy={rectSortingStrategy}>
      <Col ref={setNodeRef}>
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
          <Stack gap={2} direction="vertical">
            {issues.length > 0 &&
              issues?.map((_issue) => (
                <IssueCard issue={_issue} key={_issue?.id} />
              ))}
          </Stack>
        </Stack>
      </Col>
    </SortableContext>
  );
};
