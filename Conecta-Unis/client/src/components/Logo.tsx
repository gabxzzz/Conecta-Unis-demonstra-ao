export function LogoMark({ size = 38 }: { size?: number }) {
  return (
    <span className="logo-mark" style={{ width: size, height: size }}>
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="9" cy="10" r="4" fill="#6ea0ff" />
        <circle cx="23" cy="9" r="3.5" fill="#ffcf6e" />
        <circle cx="17" cy="23" r="4.5" fill="#ffffff" />
        <path
          d="M12.5 11l7 7M21 12l-2.5 7M9 14l5.5 5.5"
          stroke="#ffffff"
          strokeWidth="1.7"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
    </span>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`logo ${compact ? 'logo-compact' : ''}`}>
      <LogoMark />
      {!compact && (
        <span className="logo-type">
          Conecta<span>Unis</span>
        </span>
      )}
    </span>
  );
}
