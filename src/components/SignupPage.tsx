import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ArrowLeft, Brain } from 'lucide-react';
import { signup, storeAuth } from '../api/auth';

interface SignupPageProps {
  onNavigate: (page: string) => void;
  onSignup: () => void;
}

export function SignupPage({ onNavigate, onSignup }: SignupPageProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    timezone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: ''
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password length
    if (formData.password.length < 8) {
      setErrors({ ...errors, password: 'Password must be at least 8 characters long' });
      return;
    }
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setErrors({ ...errors, confirmPassword: 'Passwords do not match' });
      return;
    }
    
    // Clear errors and proceed with API call
    setErrors({ password: '', confirmPassword: '' });
    setFormError('');

    try {
      setIsSubmitting(true);
      const data = await signup({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        role: formData.role || undefined,
        timezone: formData.timezone || undefined,
        password: formData.password
      });

      if (data?.token && data?.user) {
        storeAuth(data.token, data.user);
      }

      onSignup();
    } catch (err: any) {
      setFormError(err.message || 'Unable to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-teal-50/40 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-2xl relative">
        <Button
          variant="ghost"
          className="mb-8 gap-2 rounded-xl hover:bg-primary/10 text-slate-700 hover:text-slate-900"
          onClick={() => onNavigate('landing')}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl p-10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                InsightHub
              </span>
            </div>
            <h1 className="mb-2">Create your account</h1>
            <p className="text-slate-600">
              Get started with InsightHub in minutes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="rounded-xl h-12 border-slate-200 focus:border-primary focus:ring-primary/20"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="rounded-xl h-12 border-slate-200 focus:border-primary focus:ring-primary/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="rounded-xl h-12 border-slate-200 focus:border-primary focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => handleChange('role', value)}
                  required
                >
                  <SelectTrigger className="rounded-xl h-12 border-slate-200">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="product">Product Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Time Zone</Label>
                <Select 
                  value={formData.timezone} 
                  onValueChange={(value) => handleChange('timezone', value)}
                  required
                >
                  <SelectTrigger className="rounded-xl h-12 border-slate-200">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pst">PST</SelectItem>
                    <SelectItem value="est">EST</SelectItem>
                    <SelectItem value="gmt">GMT</SelectItem>
                    <SelectItem value="cet">CET</SelectItem>
                    <SelectItem value="jst">JST</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => {
                    handleChange('password', e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  className={`rounded-xl h-12 border-slate-200 focus:border-primary focus:ring-primary/20 ${errors.password ? 'border-red-500' : ''}`}
                  required
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
                <p className="text-slate-500 text-sm">Minimum 8 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    handleChange('confirmPassword', e.target.value);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                  }}
                  className={`rounded-xl h-12 border-slate-200 focus:border-primary focus:ring-primary/20 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {formError && (
              <p className="text-red-500 text-sm mt-1">{formError}</p>
            )}

            <Button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/30 h-12 mt-6 disabled:opacity-60"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Already have an account?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="text-primary hover:underline"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
