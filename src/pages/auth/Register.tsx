import { AuthLabel } from "@/components/ui/auth-label";
import { Input } from "@/components/ui/input";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";

const Register = () => {
    return (
        <div className="h-screen w-full dark:bg-black bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <div className="relative flex w-full max-w-sm mx-auto flex-col space-y-6">
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <div className="font-bold text-3xl">
                        <p>Create an account</p>
                    </div>
                    <p className="text-sm text-neutral-500">
                        Enter your information to get started
                    </p>
                </div>

                <div className="flex flex-col space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <AuthLabel htmlFor="firstname">First name</AuthLabel>
                            <Input id="firstname" placeholder="Tyler" type="text" className="border-black dark:border-white/10" />
                        </div>
                        <div className="flex-1">
                            <AuthLabel htmlFor="lastname">Last name</AuthLabel>
                            <Input id="lastname" placeholder="Durden" type="text" className="border-black dark:border-white/10" />
                        </div>
                    </div>
                    <div className="mb-4">
                        <AuthLabel htmlFor="email">Email Address</AuthLabel>
                        <Input id="email" placeholder="projectmayhem@fc.com" type="email" className="border-black dark:border-white/10" />
                    </div>
                    <div className="mb-4">
                        <AuthLabel htmlFor="password">Password</AuthLabel>
                        <Input id="password" placeholder="••••••••" type="password" className="border-black dark:border-white/10" />
                    </div>
                    <div className="mb-8">
                        <AuthLabel htmlFor="twitter">Your twitter password</AuthLabel>
                        <Input id="twitter" placeholder="••••••••" type="password" className="border-black dark:border-white/10" />
                    </div>
                    <button className="inline-flex h-10 w-full items-center justify-center rounded-md border border-neutral-300 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-neutral-100 hover:text-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-white dark:focus-visible:ring-neutral-800 group/btn relative">
                        Create Account
                        <BottomGradient />
                    </button>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-neutral-500 dark:bg-black">Or continue with</span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="inline-flex h-10 w-full items-center justify-center rounded-md border border-neutral-300 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-neutral-100 hover:text-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-white dark:focus-visible:ring-neutral-800 group/btn relative">
                            <IconBrandGithub className="mr-2" />
                            Github
                            <BottomGradient />
                        </button>
                        <button className="inline-flex h-10 w-full items-center justify-center rounded-md border border-neutral-300 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-neutral-100 hover:text-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-white dark:focus-visible:ring-neutral-800 group/btn relative">
                            <IconBrandGoogle className="mr-2" />
                            Google
                            <BottomGradient />
                        </button>
                    </div>
                </div>
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

export default Register;