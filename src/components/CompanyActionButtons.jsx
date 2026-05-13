import { Phone } from 'lucide-react';

const RED_ICON_KEYS = new Set(['linkedin', 'facebook', 'instagram', 'whatsapp']);
const RED_ICON_TINT_STYLE = {
  filter:
    'brightness(0) saturate(100%) invert(15%) sepia(79%) saturate(3546%) hue-rotate(340deg) brightness(82%) contrast(101%)',
};

const getImageClassName = (alt, size) => {
  return size === 'compact' ? 'h-12 w-12 object-contain' : 'h-14 w-14 object-contain';
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
              <img
                src={link.icon}
                alt={link.alt}
                className={getImageClassName(link.alt, size)}
                style={RED_ICON_KEYS.has(link.key) ? RED_ICON_TINT_STYLE : undefined}
              />
            )}
          </a>
        );
      })}
    </div>
  );
};

export default CompanyActionButtons;
