import LoginForm from '@/components/auth/login-form';
import { LoginRedirect } from '@/components/auth/panel-guard';

export default function LoginPage() {
  return <>
    <LoginRedirect />
    <LoginForm />
  </>;
}
