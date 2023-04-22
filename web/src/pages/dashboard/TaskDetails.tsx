import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Task, TaskService } from "../../services/TaskService";
import moment from "moment";
import { Badge, Button } from "@chakra-ui/react";

export function TaskDetailsPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const navigate = useNavigate();

  const reloadTask = async (taskId: string) => {
    const task = await TaskService.getTask(taskId);
    setTask(task);
  };

  useEffect(() => {
    reloadTask(taskId ?? "");
  }, [taskId]);

  if (!task) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="text-lg">{task.name}</div>
      <div className="text-sm">
        {task.taskType} - {task.cronSchedule}
      </div>
      <div className="text-sm text-white/50">{task.id}</div>
      <div>
        <Button
          size="sm"
          onClick={() => navigate("/dashboard/tasks/" + taskId + "/edit")}
        >
          Edit Task
        </Button>
      </div>
      <h2 className="text-lg mt-8">Task Runs</h2>
      <div className="flex flex-col gap-2 max-w-2xl">
        {(task.taskRuns ?? []).map((run) => (
          <div
            key={run.id}
            className="px-4 py-2 bg-white/5 flex flex-col gap-1 cursor-pointer hover:bg-white/20"
          >
            <div className="flex justify-between">
              <div className="text-sm">{run.id}</div>
              <div>
                <Badge>{run.status}</Badge>
              </div>
            </div>
            <div className="text-sm text-white/50">
              {moment(run.createdAt).calendar()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
