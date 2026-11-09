import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bookmark, CalendarDays, MapPin, Wallet } from 'lucide-react';
import type { Opportunity } from '../types';
import { avatarStyle, daysUntil, formatShortDate, initials } from '../utils';
import { Badge } from './ui';

const SAVED_KEY = 'conecta_unis_saved';

function readSaved(): string[] {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
  } catch {
    return [];
  }
}

export function OpportunityCard({
  opportunity,
  basePath = '/app/oportunidades'
}: {
  opportunity: Opportunity;
  basePath?: string;
}) {
  const [saved, setSaved] = useState(() => readSaved().includes(opportunity.id));
  const remaining = daysUntil(opportunity.deadline);

  useEffect(() => {
    setSaved(readSaved().includes(opportunity.id));
  }, [opportunity.id]);

  const toggleSave = () => {
    const current = readSaved();
    const next = current.includes(opportunity.id)
      ? current.filter((id) => id !== opportunity.id)
      : [...current, opportunity.id];
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    setSaved(next.includes(opportunity.id));
  };

  return (
    <article className="opp-card">
      <div className="opp-card-top">
        <span
          className="company-logo"
          style={avatarStyle(opportunity.company?.logoColor)}
          aria-hidden="true"
        >
          {initials(opportunity.company?.name)}
        </span>
        <div className="opp-card-title">
          <h3>
            <Link to={`${basePath}/${opportunity.id}`}>{opportunity.title}</Link>
          </h3>
          <p>
            {opportunity.company?.name} <span>•</span> {opportunity.city}
          </p>
        </div>
        <button
          type="button"
          className={`save-btn ${saved ? 'saved' : ''}`}
          onClick={toggleSave}
          aria-label={saved ? 'Remover dos salvos' : 'Salvar oportunidade'}
          title={saved ? 'Remover dos salvos' : 'Salvar oportunidade'}
        >
          <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="opp-tags">
        <Badge tone="info">{opportunity.type}</Badge>
        <Badge tone="neutral">{opportunity.modality}</Badge>
        {opportunity.hasApplied && <Badge tone="success">Já aplicou</Badge>}
      </div>

      <p className="opp-desc">{opportunity.description}</p>

      <div className="opp-meta">
        <span>
          <MapPin size={15} /> {opportunity.city}
        </span>
        <span>
          <Wallet size={15} /> {opportunity.salary || 'A combinar'}
        </span>
        <span className={remaining <= 3 ? 'text-warning' : ''}>
          <CalendarDays size={15} /> até {formatShortDate(opportunity.deadline)}
        </span>
      </div>

      <div className="opp-foot">
        <span className="opp-count">{opportunity.applicationsCount} candidaturas</span>
        <Link className="text-link" to={`${basePath}/${opportunity.id}`}>
          Ver oportunidade <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
