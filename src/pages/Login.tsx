import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, LogIn, Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/layout/LanguageToggle';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginSalon } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = loginSalon(email, password);
    if (result.success) {
      toast({ title: t('login.success'), description: t('login.welcomeBack') });
      navigate('/');
    } else {
      toast({ title: t('login.error'), description: result.reason, variant: 'destructive' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md space-y-6">
        {/* Language toggle */}
        <div className="flex justify-end">
          <LanguageToggle />
        </div>

        {/* Logo */}
        <div className="text-center">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
            <Sparkles className="h-7 w-7 sm:h-9 sm:w-9 text-primary-foreground" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">LeaderBright</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{t('login.salonSpace')}</p>
        </div>

        <Card className="card-shadow">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <LogIn className="h-5 w-5 text-primary" />
              {t('login.title')}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">{t('login.accessSalon')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">{t('login.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="salon@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="h-11 sm:h-10 text-base sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">{t('login.password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="h-11 sm:h-10 text-base sm:text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full gradient-primary h-11 sm:h-10 text-base sm:text-sm" disabled={loading}>
                {loading ? t('login.loading') : t('login.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/login')} className="text-muted-foreground text-xs sm:text-sm">
            <Shield className="h-4 w-4 mr-1" />
            {t('login.admin')}
          </Button>
        </div>
      </div>
    </div>
  );
}
