import { useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

import { Column } from "../../components/column";
import { useRepoContext } from "../../context";
import { Status } from "../../types";

export const Board = () => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const { state, dispatch } = useRepoContext();

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (!over) {
        return;
      }

      if (active.id !== over.id) {
        const activeContainer = active.data.current?.sortable.containerId;
        const overContainer =
          over.data.current?.sortable.containerId || over.id;
        const activeIndex = active.data.current?.sortable.index;
        const overIndex = over.data.current?.sortable.index || 0;
        dispatch({
          type: "moveIssue",
          payload: {
            currentStatus: activeContainer,
            targetStatus: overContainer,
            currentId: activeIndex,
            targetId: overIndex,
          },
        });
      }
    },
    [dispatch]
  );

  const handleDragOver = useCallback(
    ({ active, over }: DragOverEvent) => {
      const overId = over?.id;

      if (!overId) {
        return;
      }

      const activeContainer = active.data.current?.sortable?.containerId;
      const overContainer = over.data.current?.sortable?.containerId;

      if (!overContainer) {
        return;
      }

      const activeIndex = active.data.current?.sortable?.index;
      const overIndex = over.data.current?.sortable?.index || 0;
      if (activeContainer !== overContainer) {
        dispatch({
          type: "moveIssue",
          payload: {
            currentStatus: activeContainer,
            targetStatus: overContainer,
            currentId: activeIndex,
            targetId: overIndex,
          },
        });
      }
    },
    [dispatch]
  );

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <Row
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
            {Object.keys(state?.columns).map((key) => (
              <Column
                status={key as Status}
                issues={state.columns[key]}
                key={key}
              />
            ))}
          </>
        )}
      </Row>
    </DndContext>
  );
};
