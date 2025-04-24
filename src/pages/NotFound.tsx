
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-8xl font-bold mb-6">404</h1>
      <p className="text-xl text-mono-400 mb-8">Page not found</p>
      <Link 
        to="/" 
        className="bg-mono-100 text-mono-900 px-8 py-3 hover:bg-mono-200 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;
