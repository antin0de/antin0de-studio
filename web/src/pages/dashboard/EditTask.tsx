import { Button } from "@chakra-ui/react";
import { AiOutlineCaretLeft } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { TaskForm } from "../../components/TaskForm";
import { Task, TaskService } from "../../services/TaskService";
import { useEffect, useState } from "react";

export function EditTaskPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);

  const loadTask = async () => {
    const task = await TaskService.getTask(taskId ?? "");
    setTask(task);
  };

  useEffect(() => {
    loadTask();
  }, [taskId]);

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div>
        <Button
          size="sm"
          variant={"outline"}
          leftIcon={<AiOutlineCaretLeft />}
          onClick={() => navigate("/dashboard/tasks/" + taskId)}
        >
          Back
        </Button>
      </div>
      <h2 className="text-xl">Edit Task</h2>
      {task ? (
        <TaskForm
          buttonText="Save"
          task={{
            name: task.name,
            taskType: task.taskType,
            taskConfig: task.taskConfig,
            cronSchedule: task.cronSchedule,
          }}
          onSubmit={async (values) => {
            await TaskService.updateTask(task.id, {
              name: values.name,
              taskType: values.taskType,
              taskConfig: values.taskConfig,
              cronSchedule: values.cronSchedule,
            });
            navigate("/dashboard/tasks");
          }}
        />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
