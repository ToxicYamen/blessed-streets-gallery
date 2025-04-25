import { Input } from "@/components/ui/input";
import { AuthLabel } from "@/components/ui/auth-label";
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

                <form className="my-8">
                    <div className="mb-8">
                        <AuthLabel htmlFor="email">Email Address</AuthLabel>
                        <Input id="email" placeholder="you@example.com" type="email" />
                    </div>

                    <button className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
                        Send reset link →
                        <BottomGradient />
                    </button>

                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                        Remember your password?{' '}
                        <Link
                            to="/auth/login"
                            className="font-medium text-primary hover:text-primary/80"
                        >
                            Back to login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};

export default ForgotPassword;