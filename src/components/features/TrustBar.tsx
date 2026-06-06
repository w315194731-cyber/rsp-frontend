const trustedLogos = [
  { name: 'PhotoPro', abbr: 'PP' },
  { name: 'StudioMax', abbr: 'SM' },
  { name: 'CommerceHub', abbr: 'CH' },
  { name: 'LensLab', abbr: 'LL' },
  { name: 'Marketpix', abbr: 'MP' },
];

export default function TrustBar() {
  return (
    <div className="w-full py-8 border-y border-border-subtle">
      <p className="text-center text-sm text-text-muted mb-6">
        Trusted by photographers and e-commerce sellers worldwide
      </p>
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
        {trustedLogos.map((logo) => (
          <div
            key={logo.name}
            className="text-sm font-semibold text-text-disabled hover:text-text-secondary transition-colors duration-base cursor-default"
            title={logo.name}
          >
            {logo.abbr}
          </div>
        ))}
      </div>
    </div>
  );
}