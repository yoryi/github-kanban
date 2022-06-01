import Card from "react-bootstrap/Card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Issue } from "../../types";
import { timeAgo } from "../../utils/time";

type IssueCardProps = {
  issue: Issue;
};

export const IssueCard = ({ issue }: IssueCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: issue?.id });

  return (
    <Card
      className="p-2 border-0"
      style={{
        cursor: "pointer",
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <Card.Title className="fs-6 mb-2">{issue?.title}</Card.Title>
      <Card.Subtitle className="text-secondary">{`#${
        issue?.number
      } opened ${timeAgo(issue?.created_at)} by ${
        issue?.user.login
      }`}</Card.Subtitle>
    </Card>
  );
};
