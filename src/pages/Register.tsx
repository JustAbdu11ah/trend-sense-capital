
import React from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import { Link } from 'react-router-dom';
import { BarChart } from 'lucide-react';

const Register = () => {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Link to="/" className="flex items-center space-x-2 w-fit">
            <BarChart className="h-6 w-6 text-primary" />
            <span className="font-display font-bold text-xl">NeuroTicks</span>
          </Link>
        </div>
        
        <div className="flex-1 flex items-center justify-center py-12">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
