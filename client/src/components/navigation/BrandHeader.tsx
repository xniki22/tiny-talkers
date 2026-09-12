interface BrandHeaderProps {
  subtitle?: string;
}

export function BrandHeader({ subtitle }: BrandHeaderProps) {
  return (
    <header className="brand-header">
      <div className="brand-logo" aria-hidden="true">
        💬
      </div>

      <div>
        <h1 className="brand-name">Tiny Talkers</h1>

        {subtitle && (
          <p className="brand-subtitle">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}