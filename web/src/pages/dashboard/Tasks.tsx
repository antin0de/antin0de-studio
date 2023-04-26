import {
  Button,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Task, TaskService } from "../../services/TaskService";

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const reloadTasks = async () => {
    const tasks = await TaskService.listTasks();
    setTasks(tasks);
  };

  useEffect(() => {
    reloadTasks();
  }, []);

  return (
    <div className="flex-1 flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-4">
        <div className="flex gap-8">
          <div>
            <Stat>
              <StatLabel>Total Tasks</StatLabel>
              <StatNumber>{tasks.length}</StatNumber>
              <StatHelpText>All time</StatHelpText>
            </Stat>
          </div>
        </div>
      </div>
      <div>
        <Button size="sm" onClick={() => navigate("/dashboard/tasks/create")}>
          Create Task
        </Button>
      </div>
      <div className="flex flex-1 overflow-hidden gap-8">
        <div className="w-96 flex flex-col gap-2">
          <h2 className="text-xl">Tasks</h2>
          <div className="flex flex-col gap-4 pt-4 pr-2 flex-1 overflow-y-scroll">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => navigate("/dashboard/tasks/" + task.id)}
                className={`px-4 py-2 bg-white/5 flex flex-col gap-2 cursor-pointer hover:bg-white/10 border-r-4 hover:border-white ${
                  location.pathname.match("/dashboard/tasks/" + task.id)
                    ? "border-white"
                    : ""
                }`}
              >
                <div>{task.name}</div>
                <div className="text-xs">
                  {task.taskType} - {task.cronSchedule}
                </div>
                <div className="text-xs text-white/50">{task.id}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <h2 className="text-xl">Task Details</h2>
          <div className="pt-4 flex-1 overflow-y-scroll">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
