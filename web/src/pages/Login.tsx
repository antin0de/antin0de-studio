import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Formik, FormikErrors } from "formik";
import { AuthService } from "../services/AuthService";
import { useNavigate } from "react-router-dom";

interface LoginFormFormModel {
  password: string;
}

export function LoginPage() {
  const navigate = useNavigate();

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
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await AuthService.login(values.password);
            navigate("/dashboard/domains");
          } catch (e) {
            if (e instanceof Error) {
              window.alert(e.message);
              setSubmitting(false);
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