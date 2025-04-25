
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 animate-fade-in">
      <div className="max-w-md w-full text-center">
        <h1 className="text-[120px] font-bold leading-none mb-2">404</h1>
        <p className="text-xl text-mono-400 mb-12">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="inline-flex items-center justify-center border border-mono-100 bg-transparent hover:bg-mono-100 hover:text-mono-900 transition-colors px-8 py-3 group"
        >
          <ArrowLeft size={18} className="mr-2 transition-transform group-hover:translate-x-[-4px]" />
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
