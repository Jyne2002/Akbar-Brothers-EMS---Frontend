import { getWhatsappUrl, normalizeLinkedinUrl } from '../utils/profileCard';

const RED_ICON_TINT_STYLE = {
  filter:
    'brightness(0) saturate(100%) invert(15%) sepia(79%) saturate(3546%) hue-rotate(340deg) brightness(82%) contrast(101%)',
};

const ProfileSocialButtons = ({ linkedinUrl, phoneNumber, size = 'default' }) => {
  const socialLinks = [
    {
      key: 'linkedin',
      alt: 'LinkedIn',
      href: normalizeLinkedinUrl(linkedinUrl),
      icon: '/linkedin.png',
    },
    {
      key: 'whatsapp',
      alt: 'WhatsApp',
      href: getWhatsappUrl(phoneNumber),
      icon: '/whatsapp.png',
    },
  ];

  const imageClassName = size === 'compact' ? 'h-9 w-9' : 'h-10 w-10';

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {socialLinks.map((link) =>
        link.href ? (
          <a
            key={link.key}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            aria-label={link.alt}
            className="inline-flex items-center justify-center transition hover:-translate-y-0.5"
          >
            <img
              src={link.icon}
              alt={link.alt}
              className={`${imageClassName} object-contain`}
              style={RED_ICON_TINT_STYLE}
            />
          </a>
        ) : (
          <button
            key={link.key}
            type="button"
            aria-label={`${link.alt} not available`}
            disabled
            className="inline-flex items-center justify-center opacity-45"
          >
            <img
              src={link.icon}
              alt={link.alt}
              className={`${imageClassName} object-contain`}
              style={RED_ICON_TINT_STYLE}
            />
          </button>
        ),
      )}
    </div>
  );
};

export default ProfileSocialButtons;
