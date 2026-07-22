
import { AuthForm } from "@/components/auth/AuthForm";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/seo/SEOHead";

const Login = () => {
  return (
    <div className="h-screen w-full bg-background dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
      <SEOHead title="Login" description="Melde dich bei deinem Konto an." canonicalPath="/auth/login" noIndex />
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-card">
        <h2 className="font-bold text-xl text-foreground">
          Willkommen zurück
        </h2>
        <p className="text-muted-foreground text-sm max-w-sm mt-2">
          Melde dich an, um fortzufahren
        </p>

        <div className="my-8">
          <AuthForm mode="login" />
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Noch kein Account?{' '}
          <Link
            to="/auth/register"
            className="font-medium text-primary hover:text-primary/80"
          >
            Registrieren
          </Link>
        </p>
        <p className="text-center text-sm text-muted-foreground mt-2">
          <Link
            to="/auth/forgot-password"
            className="font-medium text-primary hover:text-primary/80"
          >
            Passwort vergessen?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
