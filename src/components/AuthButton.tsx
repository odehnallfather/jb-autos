
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { User, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthButton = () => {
  const { user, profile, signOut, isAdmin } = useAuth();

  if (!user) {
    return (
      <Link to="/auth">
        <Button variant="outline" size="sm">
          <User className="w-4 h-4 mr-2" />
          Sign In
        </Button>
      </Link>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {isAdmin && (
        <Link to="/admin">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Admin
          </Button>
        </Link>
      )}
      <Button variant="outline" size="sm" onClick={signOut}>
        Sign Out
      </Button>
    </div>
  );
};

export default AuthButton;
