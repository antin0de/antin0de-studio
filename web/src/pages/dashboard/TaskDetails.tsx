import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Task, TaskRun, TaskService } from "../../services/TaskService";
import moment from "moment";
import {
  Badge,
  Button,
  CircularProgress,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import {
  AiFillCheckCircle,
  AiFillPauseCircle,
  AiFillCloseCircle,
  AiOutlineReload,
} from "react-icons/ai";

export function TaskDetailsPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoadingTask, setIsLoadingTask] = useState(false);
  const [isRunDetailsDrawerOpen, setIsRunDetailsDrawerOpen] = useState(false);
  const [selectedRun, setSelectedRun] = useState<TaskRun | null>(null);
  const navigate = useNavigate();

  const reloadTask = async (taskId: string) => {
    setIsLoadingTask(true);
    const task = await TaskService.getTask(taskId);
    setTask(task);
    setIsLoadingTask(false);
  };

  useEffect(() => {
    const pollInterval = setInterval(() => {
      reloadCurrentTask();
    }, 3000);
    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    reloadCurrentTask();
  }, [taskId]);

  const reloadCurrentTask = async () => {
    reloadTask(taskId ?? "");
  };

  if (!task) return null;

  return (
    <div className="flex flex-col gap-2 max-w-2xl">
      <div className="flex place-content-between">
        <div className="text-lg">{task.name}</div>
        <Button
          size="sm"
          variant={"ghost"}
          leftIcon={<AiOutlineReload />}
          onClick={reloadCurrentTask}
          isLoading={isLoadingTask}
        >
          Reload
        </Button>
      </div>
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
      <h2 className="text-lg mt-8">
        Task Runs ({(task.taskRuns ?? []).length})
      </h2>
      <div className="flex flex-col gap-2">
        {(task.taskRuns ?? []).map((run) => (
          <div
            key={run.id}
            className="px-4 py-4 bg-white/5 flex flex-col gap-1 cursor-pointer hover:bg-white/20"
            onClick={() => {
              setSelectedRun(run);
              setIsRunDetailsDrawerOpen(true);
            }}
          >
            <div className="flex justify-between">
              <div className="flex flex-col gap-2">
                <div className="text-sm">{run.id}</div>
                <div className="text-sm text-white/50">
                  {moment(run.createdAt).calendar()}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {run.status === "RUNNING" && (
                  <Badge colorScheme="yellow">
                    <div className="flex gap-2 p-1 items-center">
                      <CircularProgress
                        isIndeterminate
                        size={4}
                        color="yellow.300"
                      />
                      <div>Running</div>
                    </div>
                  </Badge>
                )}
                {run.status === "SUCCESS" && (
                  <Badge colorScheme="green">
                    <div className="flex gap-2 p-1 items-center">
                      <AiFillCheckCircle />
                      <div>Success</div>
                    </div>
                  </Badge>
                )}
                {run.status === "FAILED" && (
                  <Badge colorScheme="red">
                    <div className="flex gap-2 p-1 items-center">
                      <AiFillCloseCircle />
                      <div>Failed</div>
                    </div>
                  </Badge>
                )}
                {run.status === "PENDING" && (
                  <Badge colorScheme="default">
                    <div className="flex gap-2 p-1 items-center">
                      <AiFillPauseCircle />
                      <div>Pending</div>
                    </div>
                  </Badge>
                )}
                {run.status === "SUCCESS" || run.status === "FAILED" ? (
                  <div className="text-xs text-white/50">
                    {Math.round(run.runDuration / 1000000)}ms
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedRun ? (
        <Drawer
          size="xl"
          placement={"right"}
          onClose={() => setIsRunDetailsDrawerOpen(false)}
          isOpen={isRunDetailsDrawerOpen}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Run Logs</DrawerHeader>
            <DrawerBody>
              <pre>{selectedRun.log}</pre>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ) : null}
    </div>
  );
}
