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
import { useEffect, useState } from "react";

interface LoginFormFormModel {
  password: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    const loggedin = await AuthService.getLoginStatus();
    if (loggedin) {
      navigate("/dashboard/domains");
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-4">
      <h1 className="text-2xl font-bold mt-16">Login</h1>
      <div className="text-sm">
        You can find the password within <code>.env</code> file. Which is called{" "}
        <code>MASTER_PASSWORD</code>
      </div>
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
                <FormLabel className="text-sm">Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  size="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting || isLoading}
                />
                {errors.password && touched.password && (
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                )}
              </FormControl>
              <Button
                variant={"outline"}
                colorScheme="green"
                type="submit"
                size={"sm"}
                isLoading={isSubmitting || isLoading}
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
