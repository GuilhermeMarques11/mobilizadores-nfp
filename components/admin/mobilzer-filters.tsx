import ButtonFilter from './button-filter';
import MobilizerInputSearch from './mobilizer-input-search';

export default function MobilizerFilters() {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        <ButtonFilter statusValue="" label="Todos" />
        <ButtonFilter statusValue="PENDING" label="Pendente" />
        <ButtonFilter statusValue="APPROVED" label="Aprovado" />
        <ButtonFilter statusValue="ACTIVE" label="Ativo" />
        <ButtonFilter statusValue="REJECTED" label="Rejeitado" />
      </div>
      <MobilizerInputSearch />
    </div>
  );
}
