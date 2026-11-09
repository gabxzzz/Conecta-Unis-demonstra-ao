import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  BellRing,
  CalendarCheck2,
  CheckCheck,
  FileText,
  Sparkles,
  UserRound
} from 'lucide-react';
import { useApi } from '../../hooks';
import { api } from '../../api';
import { EmptyState, PageHeader, Skeleton, Tabs } from '../../components/ui';
import { useToast } from '../../toast';
import { cn, timeAgo } from '../../utils';
import type { AppNotification } from '../../types';

const icons = {
  entrevista: CalendarCheck2,
  processo: FileText,
  oportunidade: Sparkles,
  perfil: UserRound,
  empresa: BellRing,
  moderacao: BellRing
};

export function StudentNotifications() {
  const { data, loading, reload } = useApi<AppNotification[]>('/notifications');
  const [tab, setTab] = useState('todas');
  const navigate = useNavigate();
  const toast = useToast();

  const notifications = data || [];
  const unread = notifications.filter((item) => !item.read);
  const filtered = tab === 'nao-lidas' ? unread : notifications;

  const markAll = async () => {
    try {
      await api.post('/notifications/read-all');
      await reload();
      toast('Todas as notificações foram marcadas como lidas.');
    } catch {
      toast('Não foi possível marcar as notificações.', 'error');
    }
  };

  const open = async (notification: AppNotification) => {
    if (!notification.read) {
      try {
        await api.patch(`/notifications/${notification.id}/read`);
      } catch {
        // A navegação não deve ser bloqueada por uma falha ao marcar como lida.
      }
    }
    navigate(notification.link || '/app');
  };

  return (
    <div className="page">
      <PageHeader
        eyebrow="Portal do estudante"
        title="Notificações"
        subtitle="Atualizações sobre candidaturas, entrevistas e oportunidades."
        actions={
          unread.length > 0 ? (
            <button type="button" className="btn btn-secondary" onClick={markAll}>
              <CheckCheck size={17} /> Marcar todas como lidas
            </button>
          ) : undefined
        }
      />

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { value: 'todas', label: `Todas (${notifications.length})` },
          { value: 'nao-lidas', label: `Não lidas (${unread.length})` }
        ]}
      />

      {loading ? (
        <div className="card">
          <Skeleton lines={7} />
        </div>
      ) : filtered.length ? (
        <div className="notification-list">
          {filtered.map((notification) => {
            const Icon = icons[notification.type as keyof typeof icons] || Bell;
            return (
              <button
                type="button"
                key={notification.id}
                className={cn('notification-item', !notification.read && 'unread')}
                onClick={() => open(notification)}
              >
                <span className="notification-icon">
                  <Icon size={19} />
                </span>
                <div className="notification-main">
                  <div>
                    <strong>{notification.title}</strong>
                    {!notification.read && <span className="unread-dot" />}
                  </div>
                  <p>{notification.body}</p>
                  <span className="notification-time">{timeAgo(notification.createdAt)}</span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="card">
          <EmptyState
            icon={<Bell size={28} />}
            title={tab === 'nao-lidas' ? 'Tudo em dia' : 'Nenhuma notificação'}
            description={
              tab === 'nao-lidas'
                ? 'Você já leu todas as atualizações. Novas notificações aparecerão aqui.'
                : 'Quando houver atualizações sobre seus processos, você verá aqui.'
            }
          />
        </div>
      )}
    </div>
  );
}
