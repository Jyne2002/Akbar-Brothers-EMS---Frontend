import { ArrowLeft, Building2, Copy, Download, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getBrandMaskedIconStyle } from '../utils/socialIcons';

const PublicProfileCardLayout = ({
  profile,
  companyLogoSrc,
  companyLogoAlt,
  footerLogoSrc,
  footerLogoAlt,
  profileRows,
  initials,
  publicCompanyInfoPath,
  socialLinks,
  showInteractiveSection = true,
  downloadMenuOpen = false,
  downloading = false,
  notice = '',
  onBack,
  onShare,
  onCopy,
  onToggleDownloadMenu,
  onDownload,
}) => (
  <section className="relative w-full overflow-hidden rounded-[2.45rem] border border-black/10 bg-white shadow-[0_30px_72px_rgba(0,0,0,0.11)]">
    {onBack ? (
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to home"
        title="Back to home"
        className="absolute left-4 top-4 z-20 inline-flex h-8 w-8 items-center justify-center text-black transition hover:-translate-x-0.5"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
    ) : null}

    <div className="relative flex min-h-[8.4rem] items-start justify-center bg-[linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(243,243,243,0.94)_100%)] px-6 pb-2 pt-2.5 text-center">
      <img
        src={companyLogoSrc}
        alt={companyLogoAlt}
        className="relative z-10 translate-y-1.5 h-[5.5rem] w-auto max-w-[16rem] object-contain"
      />
    </div>

    <div className={`relative px-5 pt-0 ${showInteractiveSection ? 'pb-0' : 'pb-7'}`}>
      <div className="-mt-5 flex justify-center">
        <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-[5px] border-white bg-[var(--color-brand-red)] text-3xl font-black text-white shadow-[0_20px_38px_rgba(0,0,0,0.18)]">
          {profile.profileImage ? (
            <img src={profile.profileImage} alt={profile.fullName} className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
      </div>

      <div className="text-center">
        <h2 className="mx-auto mt-3 max-w-[16rem] text-[1.85rem] font-bold leading-tight text-[var(--color-brand-ink)]">
          {profile.fullName}
        </h2>

        {profile.department ? (
          <p className="mt-1.5 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-black/82">
            {profile.department}
          </p>
        ) : null}

        {profile.jobRole ? (
          <p className="mx-auto mt-0.5 max-w-[15.5rem] text-[1rem] font-semibold leading-6 text-[var(--color-brand-ink)]/78">
            {profile.jobRole}
          </p>
        ) : null}
      </div>

      <div className="mt-3 rounded-[1.75rem] border border-black/10 bg-white p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
        <div className="space-y-2.5">
          {profileRows.map((row, index) => (
            <div
              key={row.label}
              className={`grid grid-cols-[5rem_minmax(0,1fr)] items-start gap-3 ${
                index === profileRows.length - 1 ? '' : 'border-b border-black/10 pb-2.5'
              }`}
            >
              <span className="text-[0.83rem] font-bold uppercase tracking-[0.12em] text-black">
                {row.label}
              </span>
              {row.extension ? (
                <div className="flex min-w-0 flex-wrap items-center gap-2 pt-0.5">
                  <span className="min-w-0 break-words text-[0.94rem] leading-5 text-[var(--color-brand-ink)]/82">
                    {row.value}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-black/10 bg-[#f3f3f3] px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-black/70">
                    EXT {row.extension}
                  </span>
                </div>
              ) : (
                <span className="min-w-0 break-words text-[0.94rem] leading-5 text-[var(--color-brand-ink)]/82">
                  {row.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {showInteractiveSection && (
        <>
          <div className="mt-3 flex justify-center">
            <div className="flex items-center justify-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.alt}
                  className="inline-flex items-center justify-center transition hover:-translate-y-0.5"
                >
                  <span
                    aria-hidden="true"
                    className="inline-block h-10 w-10"
                    style={getBrandMaskedIconStyle(link.icon)}
                  />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-3 px-1 pb-2.5 pt-3">
            {downloadMenuOpen && (
              <div className="mb-3 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => onDownload?.('jpg')}
                  className="rounded-2xl border border-black/8 bg-[#f3f3f3] px-3 py-3 text-sm font-semibold text-black/75 transition hover:bg-[#e8e8e8]"
                >
                  JPG
                </button>
                <button
                  type="button"
                  onClick={() => onDownload?.('pdf')}
                  className="rounded-2xl border border-black/8 bg-[#f3f3f3] px-3 py-3 text-sm font-semibold text-black/75 transition hover:bg-[#e8e8e8]"
                >
                  PDF
                </button>
                <button
                  type="button"
                  onClick={() => onDownload?.('vcf')}
                  className="rounded-2xl border border-black/8 bg-[#f3f3f3] px-3 py-3 text-sm font-semibold text-black/75 transition hover:bg-[#e8e8e8]"
                >
                  VCF
                </button>
              </div>
            )}

            <div className="flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={onShare}
                aria-label="Share this card"
                title="Share this card"
                className="inline-flex h-9 w-9 items-center justify-center text-black transition hover:-translate-y-0.5"
              >
                <Share2 className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={onCopy}
                aria-label="Copy this card link"
                title="Copy this card link"
                className="inline-flex h-9 w-9 items-center justify-center text-black transition hover:-translate-y-0.5"
              >
                <Copy className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={onToggleDownloadMenu}
                disabled={downloading}
                aria-label="Download this card"
                title="Download this card"
                className="inline-flex h-9 w-9 items-center justify-center text-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Download className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-3 border-t border-black/10 pt-3">
              <div className="flex justify-center">
                {publicCompanyInfoPath ? (
                  <Link
                    to={publicCompanyInfoPath}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-brand-red)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(142,20,36,0.24)] transition hover:bg-[var(--color-brand-red-dark)]"
                  >
                    <Building2 className="h-4 w-4" />
                    About Company
                  </Link>
                ) : (
                  <div className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-[#f4f4f4] px-5 py-2.5 text-sm font-semibold text-black/55">
                    <Building2 className="h-4 w-4" />
                    Company information unavailable
                  </div>
                )}
              </div>

              {notice && (
                <p className="mt-2.5 text-center text-sm font-medium text-black">
                  {notice}
                </p>
              )}

              {footerLogoSrc ? (
                <div className="mt-2.5 flex justify-center">
                  <img
                    src={footerLogoSrc}
                    alt={footerLogoAlt || 'Akbar Brothers logo'}
                    className="h-12 w-auto max-w-[13rem] object-contain"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  </section>
);

export default PublicProfileCardLayout;
