import { useEffect, useState } from 'react';
import { Button, Field, Modal, Textarea } from './ui';

export function RejectModal({
  open,
  title,
  subtitle,
  onClose,
  onConfirm,
  loading = false
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  loading?: boolean;
}) {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (open) setReason('');
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => onConfirm(reason)} loading={loading}>
            Confirmar rejeição
          </Button>
        </>
      }
    >
      <Field
        label="Motivo da rejeição"
        hint="O motivo será enviado à empresa para que ela possa ajustar o conteúdo."
      >
        <Textarea
          rows={4}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Descreva o ajuste necessário..."
        />
      </Field>
    </Modal>
  );
}
