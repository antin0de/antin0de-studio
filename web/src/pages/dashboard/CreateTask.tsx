import { Button } from "@chakra-ui/react";
import { AiOutlineCaretLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { TaskForm } from "../../components/TaskForm";
import { TaskService } from "../../services/TaskService";

export function CreateTaskPage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div>
        <Button
          size="sm"
          variant={"outline"}
          leftIcon={<AiOutlineCaretLeft />}
          onClick={() => navigate("/dashboard/tasks")}
        >
          Back
        </Button>
      </div>
      <h2 className="text-xl">Create Task</h2>
      <TaskForm
        buttonText="Create"
        onSubmit={async (values) => {
          await TaskService.createTask({
            name: values.name,
            taskType: values.taskType,
            taskConfig: values.taskConfig,
            cronSchedule: values.cronSchedule,
          });
          navigate("/dashboard/tasks");
        }}
      />
    </div>
  );
}
