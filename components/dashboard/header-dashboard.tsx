import SignOutButton from '../signout-button';

interface HeaderProps {
  profile: {
    full_name: string | null;
  } | null;
}
export default function HeaderDashboard({ profile }: HeaderProps) {
  const fullName = profile?.full_name;
  const firstName = fullName?.split(' ')[0];
  return (
    <header className="bg-primary py-2">
      <div className="max-w-sm mx-auto flex items-center justify-between">
        <div className="text-primary-foreground">
          <h1>ABBA Brasil</h1>
          <p>Mobilizadores</p>
        </div>
        <p className="text-primary-foreground">Olá, {firstName}</p>
        <SignOutButton />
      </div>
    </header>
  );
}
