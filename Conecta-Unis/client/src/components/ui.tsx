import {
  useEffect,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes
} from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, X } from 'lucide-react';
import { cn, companyStatus, initials, applicationStatus, opportunityStatus, userStatus, avatarStyle } from '../utils';
import type { ApplicationStatus, OpportunityStatus } from '../types';

type Tone = 'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'violet';

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}) {
  return (
    <button
      className={cn('btn', `btn-${variant}`, `btn-${size}`, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="spinner spinner-light" />}
      {children}
    </button>
  );
}

export function Badge({
  tone = 'neutral',
  children,
  dot = false
}: {
  tone?: Tone;
  children: ReactNode;
  dot?: boolean;
}) {
  return (
    <span className={cn('badge', `badge-${tone}`)}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
}

export function StatusBadge({
  kind,
  status
}: {
  kind: 'application' | 'opportunity' | 'company' | 'user';
  status: string;
}) {
  if (kind === 'application') {
    const config = applicationStatus[status as ApplicationStatus] || applicationStatus.enviada;
    return <Badge tone={config.tone} dot>{config.label}</Badge>;
  }
  if (kind === 'opportunity') {
    const config = opportunityStatus[status as OpportunityStatus] || opportunityStatus.rascunho;
    return <Badge tone={config.tone} dot>{config.label}</Badge>;
  }
  if (kind === 'company') {
    const config = companyStatus[status as keyof typeof companyStatus] || companyStatus.pendente;
    return <Badge tone={config.tone} dot>{config.label}</Badge>;
  }
  const config = userStatus[status as keyof typeof userStatus] || userStatus.ativo;
  return <Badge tone={config.tone} dot>{config.label}</Badge>;
}

export function Avatar({
  name,
  color,
  size = 'md'
}: {
  name?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  return (
    <span className={cn('avatar', `avatar-${size}`)} style={avatarStyle(color)}>
      {initials(name)}
    </span>
  );
}

interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  htmlFor?: string;
}

export function Field({ label, hint, error, required, children, htmlFor }: FieldProps) {
  return (
    <label className="field" htmlFor={htmlFor}>
      {label && (
        <span className="field-label">
          {label}
          {required && <span className="required">*</span>}
        </span>
      )}
      {children}
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn('input', className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn('input select', className)} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn('input textarea', className)} {...props} />;
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md'
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className={cn('modal-card', `modal-${size}`)}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <h3>{title}</h3>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      {icon && <span className="empty-icon">{icon}</span>}
      <h4>{title}</h4>
      {description && <p>{description}</p>}
      {action && <div className="empty-action">{action}</div>}
    </div>
  );
}

export function StatCard({
  icon,
  label,
  value,
  hint,
  tone = 'blue'
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  hint?: string;
  tone?: 'blue' | 'green' | 'amber' | 'violet' | 'rose';
}) {
  return (
    <div className="stat-card">
      <span className={cn('stat-icon', `stat-icon-${tone}`)}>{icon}</span>
      <div>
        <span className="stat-label">{label}</span>
        <strong className="stat-value">{value}</strong>
        {hint && <span className="stat-hint">{hint}</span>}
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="page-head">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  );
}

export function Progress({ value, label }: { value: number; label?: string }) {
  return (
    <div className="progress">
      <div className="progress-meta">
        <span>{label || 'Perfil completo'}</span>
        <strong>{value}%</strong>
      </div>
      <div className="progress-track">
        <span className="progress-bar" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}

export function Spinner({ label = 'Carregando...' }: { label?: string }) {
  return (
    <div className="loading-block">
      <span className="spinner" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="alert alert-danger">
      <AlertCircle size={18} />
      <span>{message}</span>
    </div>
  );
}

export function InfoBanner({
  tone = 'info',
  children
}: {
  tone?: 'info' | 'warning' | 'success' | 'danger';
  children: ReactNode;
}) {
  return <div className={cn('alert', `alert-${tone}`)}>{children}</div>;
}

export function Skeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="skeleton-block">
      {Array.from({ length: lines }).map((_, index) => (
        <span key={index} className="skeleton-line" style={{ width: `${100 - (index % 3) * 12}%` }} />
      ))}
    </div>
  );
}

export function Tabs({
  items,
  value,
  onChange
}: {
  items: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="tabs" role="tablist">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          role="tab"
          aria-selected={value === item.value}
          className={cn('tab', value === item.value && 'active')}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function Divider() {
  return <div className="divider" />;
}
