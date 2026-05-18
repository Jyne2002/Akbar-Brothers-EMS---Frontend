import { getBrandMaskedIconStyle } from '../utils/socialIcons';

const getImageClassName = () => 'inline-block h-12 w-12';
const getImageStyle = (link) =>
  link.key === 'instagram'
    ? {
        ...getBrandMaskedIconStyle(link.icon),
        WebkitMaskSize: '84%',
        maskSize: '84%',
      }
    : getBrandMaskedIconStyle(link.icon);

const CompanyActionButtons = ({ company, centered = false }) => {
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
            <span
              aria-hidden="true"
              className={getImageClassName()}
              style={getImageStyle(link)}
            />
          </a>
        );
      })}
    </div>
  );
};

export default CompanyActionButtons;
