import Card from "react-bootstrap/Card";
import { Draggable } from "react-beautiful-dnd";

import { Issue } from "../../types";
import { timeAgo } from "../../utils/time";

type IssueCardProps = {
  issue: Issue;
  index: number;
};

export const IssueCard = ({ issue, index }: IssueCardProps) => {
  return (
    <Draggable
      key={`issue_${issue.id}_${issue.number}`}
      draggableId={`${issue.id}`}
      index={index}
    >
      {(dragProvided, dragSnapshot) => (
        <Card
          className="p-2 border-0"
          style={{
            cursor: "pointer",
          }}
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          {...dragProvided.dragHandleProps}
        >
          <Card.Title className="fs-6 mb-2">{issue?.title}</Card.Title>
          <Card.Subtitle className="text-secondary">
            {`#${issue?.number} opened ${timeAgo(issue?.created_at)} by ${
              issue?.user.login
            }`}
          </Card.Subtitle>
        </Card>
      )}
    </Draggable>
  );
};
