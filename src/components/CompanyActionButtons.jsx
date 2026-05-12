import { Phone } from 'lucide-react';

const getImageClassName = (alt, size) => {
  const baseClassName = size === 'compact' ? 'h-12 w-12 object-contain' : 'h-14 w-14 object-contain';

  return alt === 'Instagram' ? `${baseClassName} scale-[1.18]` : baseClassName;
};

const getPhoneBadgeClassName = (size) =>
  size === 'compact'
    ? 'inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-brand-red)]/14 bg-[var(--color-brand-red-soft)] text-[var(--color-brand-red-dark)] shadow-sm'
    : 'inline-flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-brand-red)]/14 bg-[var(--color-brand-red-soft)] text-[var(--color-brand-red-dark)] shadow-sm';

const getPhoneIconClassName = (size) => (size === 'compact' ? 'h-5 w-5' : 'h-6 w-6');

const CompanyActionButtons = ({ company, size = 'default', centered = false }) => {
  const actionLinks = company?.actionLinks?.filter((link) => link.href) || [];

  if (actionLinks.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-3 ${centered ? 'justify-center' : ''}`}>
      {actionLinks.map((link) => {
        const isWebLink = /^https?:/i.test(link.href);

        return (
          <a
            key={link.key}
            href={link.href}
            target={isWebLink ? '_blank' : undefined}
            rel={isWebLink ? 'noreferrer' : undefined}
            className="inline-flex items-center justify-center transition hover:-translate-y-0.5"
            aria-label={`${company?.companyName} ${link.alt}`}
            title={link.alt}
          >
            {link.iconType === 'lucide' && link.icon === 'phone' ? (
              <span className={getPhoneBadgeClassName(size)}>
                <Phone className={getPhoneIconClassName(size)} />
              </span>
            ) : (
              <img src={link.icon} alt={link.alt} className={getImageClassName(link.alt, size)} />
            )}
          </a>
        );
      })}
    </div>
  );
};

export default CompanyActionButtons;
