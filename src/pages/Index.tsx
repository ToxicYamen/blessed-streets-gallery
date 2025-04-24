
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Provide a smooth transition when redirecting to home
    const redirectTimeout = setTimeout(() => {
      navigate("/", { replace: true });
    }, 100);
    
    return () => clearTimeout(redirectTimeout);
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse">
        <p className="text-mono-400">Redirecting...</p>
      </div>
    </div>
  );
};

export default Index;
