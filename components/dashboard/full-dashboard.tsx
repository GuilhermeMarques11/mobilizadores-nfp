import CpfList from './fullDashboard/cpf-list';
import MetricsGrid from './fullDashboard/metrics-grid';
import RegisterCpf from './fullDashboard/register-cpf';

export default function FullDashboard() {
  return (
    <div className="mx-auto max-w-4xl flex-1 space-y-4 px-4 py-5">
      <MetricsGrid />
      <RegisterCpf />
      <CpfList />
    </div>
  );
}
