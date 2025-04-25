
import { AuthForm } from "@/components/auth/AuthForm";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  return (
    <div className="h-screen w-full dark:bg-black bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Reset your password
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm max-w-sm mt-2">
          Enter your email address and we'll send you instructions to reset your password.
        </p>

        <div className="my-8">
          <AuthForm mode="reset" />
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Remember your password?{' '}
          <Link
            to="/auth/login"
            className="font-medium text-primary hover:text-primary/80"
          >
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
