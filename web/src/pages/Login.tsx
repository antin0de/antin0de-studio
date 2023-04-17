import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Formik, FormikErrors } from "formik";

interface LoginFormFormModel {
  password: string;
}

export function LoginPage() {
  return (
    <div className="max-w-xl mx-auto flex flex-col gap-4">
      <h1 className="text-2xl font-bold mt-16">Login</h1>
      <Formik
        initialValues={{ password: "" } satisfies LoginFormFormModel}
        validate={(values) => {
          const errors = {} as FormikErrors<LoginFormFormModel>;
          if (!values.password) {
            errors.password = "Password is required";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          // Call the API
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
            <div className="flex flex-col gap-4">
              <FormControl isInvalid={!!errors.password && touched.password}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.password && touched.password && (
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                )}
              </FormControl>
              <Button
                variant={"outline"}
                colorScheme="green"
                type="submit"
                isLoading={isSubmitting}
              >
                Login
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}
