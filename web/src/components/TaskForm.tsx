import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { Formik, FormikErrors } from "formik";

interface TaskFormModel {
  name: string;
  taskType: string;
  taskConfig: string;
  cronSchedule: string;
}

interface TaskFormProps {
  task?: TaskFormModel;
  onSubmit: (task: TaskFormModel) => Promise<void>;
  buttonText: string;
}

export function TaskForm({ task, onSubmit, buttonText }: TaskFormProps) {
  return (
    <Formik
      initialValues={
        task
          ? task
          : ({
              name: "",
              taskType: "BBOT_SCAN",
              taskConfig: "key: value",
              cronSchedule: "1 1 * * *",
            } satisfies TaskFormModel)
      }
      validate={(values) => {
        const errors = {} as FormikErrors<TaskFormModel>;
        if (!values.name) {
          errors.name = "Name is required";
        }
        if (!values.taskType) {
          errors.taskType = "Task type is required";
        }
        if (!values.taskConfig) {
          errors.taskConfig = "Task config is required";
        }
        if (!values.cronSchedule) {
          errors.cronSchedule = "Cron schedule is required";
        }
        return errors;
      }}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await onSubmit(values);
          setSubmitting(false);
        } catch (error) {
          if (error instanceof Error) {
            setSubmitting(false);
            window.alert(error.message);
            throw error;
          }
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 max-w-lg">
            <FormControl isInvalid={!!errors.name && touched.name}>
              <FormLabel className="text-sm">Name</FormLabel>
              <Input
                type="text"
                name="name"
                size="sm"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              />
              {errors.name && touched.name && (
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.taskType && touched.taskType}>
              <FormLabel className="text-sm">Task Type</FormLabel>
              <Select
                placeholder="Select option"
                name="taskType"
                size="sm"
                value={values.taskType}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              >
                <option value="BBOT_SCAN">bbot Scan</option>
              </Select>
              {errors.taskType && touched.taskType && (
                <FormErrorMessage>{errors.taskType}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.taskConfig && touched.taskConfig}>
              <FormLabel className="text-sm">Task Config (yaml)</FormLabel>
              <Textarea
                name="taskConfig"
                size="sm"
                value={values.taskConfig}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              />
              {errors.taskConfig && touched.taskConfig && (
                <FormErrorMessage>{errors.taskConfig}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              isInvalid={!!errors.cronSchedule && touched.cronSchedule}
            >
              <FormLabel className="text-sm">Cron Schedule</FormLabel>
              <Input
                type="text"
                name="cronSchedule"
                size="sm"
                value={values.cronSchedule}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              />
              {errors.cronSchedule && touched.cronSchedule && (
                <FormErrorMessage>{errors.cronSchedule}</FormErrorMessage>
              )}
            </FormControl>
            <Button
              variant={"outline"}
              type="submit"
              size={"sm"}
              isLoading={isSubmitting}
            >
              {buttonText}
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
}
