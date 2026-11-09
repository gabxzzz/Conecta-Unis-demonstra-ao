import { useState } from 'react';
import { BriefcaseBusiness, Search, SlidersHorizontal, X } from 'lucide-react';
import { useApi } from '../../hooks';
import { EmptyState, ErrorBanner, PageHeader, Select, Skeleton } from '../../components/ui';
import { OpportunityCard } from '../../components/OpportunityCard';
import type { Opportunity } from '../../types';
import { pluralize } from '../../utils';

const initialFilters = {
  q: '',
  area: 'Todas',
  modality: 'Todas',
  type: 'Todos',
  city: 'Todas'
};

export function StudentOpportunities() {
  const [filters, setFilters] = useState(initialFilters);
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value && !['Todas', 'Todos'].includes(value)) params.set(key, value);
  });
  const query = params.toString();
  const { data, loading, error } = useApi<Opportunity[]>(
    `/opportunities${query ? `?${query}` : ''}`
  );

  const update = (key: keyof typeof initialFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const hasFilters =
    filters.q ||
    filters.area !== 'Todas' ||
    filters.modality !== 'Todas' ||
    filters.type !== 'Todos' ||
    filters.city !== 'Todas';

  return (
    <div className="page">
      <PageHeader
        eyebrow="Portal do estudante"
        title="Oportunidades"
        subtitle="Encontre vagas alinhadas ao seu momento, curso e objetivos profissionais."
      />

      <section className="filter-panel">
        <div className="search-input">
          <Search size={18} />
          <input
            type="search"
            placeholder="Cargo, empresa ou palavra-chave"
            value={filters.q}
            onChange={(event) => update('q', event.target.value)}
          />
        </div>

        <div className="filter-grid">
          <div className="filter-field">
            <span>
              <SlidersHorizontal size={14} /> Área
            </span>
            <Select value={filters.area} onChange={(event) => update('area', event.target.value)}>
              {['Todas', 'Tecnologia', 'Dados', 'Design', 'Produto', 'Negócios', 'Saúde'].map(
                (area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                )
              )}
            </Select>
          </div>
          <div className="filter-field">
            <span>Modalidade</span>
            <Select
              value={filters.modality}
              onChange={(event) => update('modality', event.target.value)}
            >
              {['Todas', 'Presencial', 'Híbrido', 'Remoto'].map((modality) => (
                <option key={modality} value={modality}>
                  {modality}
                </option>
              ))}
            </Select>
          </div>
          <div className="filter-field">
            <span>Tipo</span>
            <Select value={filters.type} onChange={(event) => update('type', event.target.value)}>
              {['Todos', 'Estágio', 'Trainee', 'Júnior'].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>
          <div className="filter-field">
            <span>Cidade</span>
            <Select value={filters.city} onChange={(event) => update('city', event.target.value)}>
              {[
                'Todas',
                'Belo Horizonte, MG',
                'São Paulo, SP',
                'Contagem, MG',
                'Nova Lima, MG'
              ].map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {hasFilters && (
          <button
            type="button"
            className="text-link clear-filters"
            onClick={() => setFilters(initialFilters)}
          >
            <X size={15} /> Limpar filtros
          </button>
        )}
      </section>

      <div className="results-head">
        <strong>
          {data ? pluralize(data.length, 'oportunidade encontrada', 'oportunidades encontradas') : 'Buscando...'}
        </strong>
        {hasFilters && <span>Filtros ativos</span>}
      </div>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <div className="opp-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="card" key={index}>
              <Skeleton lines={5} />
            </div>
          ))}
        </div>
      ) : data && data.length ? (
        <div className="opp-grid">
          {data.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      ) : (
        <div className="card">
          <EmptyState
            icon={<BriefcaseBusiness size={28} />}
            title="Nenhuma oportunidade encontrada"
            description="Tente remover alguns filtros ou buscar por outras palavras-chave."
            action={
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setFilters(initialFilters)}
              >
                Limpar filtros
              </button>
            }
          />
        </div>
      )}
    </div>
  );
}
