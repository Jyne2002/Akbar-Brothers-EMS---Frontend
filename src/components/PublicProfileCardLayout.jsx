import { Building2, Copy, Download, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublicProfileCardLayout = ({
  profile,
  companyLogoSrc,
  companyLogoAlt,
  profileRows,
  initials,
  publicCompanyInfoPath,
  socialLinks,
  showInteractiveSection = true,
  downloadMenuOpen = false,
  downloading = false,
  notice = '',
  onShare,
  onCopy,
  onToggleDownloadMenu,
  onDownload,
}) => (
  <section className="relative overflow-hidden rounded-[2.45rem] border border-[var(--color-brand-red)]/12 bg-white shadow-[0_30px_72px_rgba(89,10,22,0.11)]">
    <div className="relative flex min-h-[10.25rem] items-center justify-center bg-[linear-gradient(180deg,_rgba(255,250,250,0.98)_0%,_rgba(249,237,239,0.92)_100%)] px-6 py-5 text-center">
      <img
        src={companyLogoSrc}
        alt={companyLogoAlt}
        className="relative z-10 h-[5.5rem] w-auto max-w-[16rem] object-contain"
      />
    </div>

    <div className={`relative px-6 pt-0 ${showInteractiveSection ? 'pb-0' : 'pb-7'}`}>
      <div className="-mt-6 flex justify-center">
        <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-[5px] border-white bg-[var(--color-brand-red)] text-3xl font-black text-white shadow-[0_20px_38px_rgba(89,10,22,0.2)]">
          {profile.profileImage ? (
            <img src={profile.profileImage} alt={profile.fullName} className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
      </div>

      <div className="text-center">
        <h2 className="mx-auto mt-4 max-w-[15.5rem] text-[1.85rem] font-black leading-tight text-[var(--color-brand-ink)]">
          {profile.fullName}
        </h2>

        {profile.department ? (
          <p className="mt-2 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[var(--color-brand-red)]/82">
            {profile.department}
          </p>
        ) : null}

        {profile.jobRole ? (
          <p className="mx-auto mt-1 max-w-[15rem] text-[1rem] font-semibold leading-6 text-[var(--color-brand-ink)]/78">
            {profile.jobRole}
          </p>
        ) : null}
      </div>

      <div className="mt-4 rounded-[1.75rem] border border-[var(--color-brand-red)]/10 bg-[linear-gradient(180deg,_#fffdfd_0%,_#fcf5f6_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
        <div className="space-y-3">
          {profileRows.map((row, index) => (
            <div
              key={row.label}
              className={`grid grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-3 ${
                index === profileRows.length - 1 ? '' : 'border-b border-[var(--color-brand-red)]/10 pb-3'
              }`}
            >
              <span className="text-[0.83rem] font-bold uppercase tracking-[0.12em] text-[var(--color-brand-red)]">
                {row.label}
              </span>
              <span className="min-w-0 break-words text-[0.94rem] leading-6 text-[var(--color-brand-ink)]/82">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {showInteractiveSection && (
        <>
          <div className="mt-4 flex justify-center">
            {publicCompanyInfoPath ? (
              <Link
                to={publicCompanyInfoPath}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-brand-red)] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(142,20,36,0.24)] transition hover:bg-[var(--color-brand-red-dark)]"
              >
                <Building2 className="h-4 w-4" />
                About Company
              </Link>
            ) : (
              <div className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-brand-red)]/14 bg-[#faf7f8] px-5 py-3 text-sm font-semibold text-[var(--color-brand-red-dark)]/60">
                <Building2 className="h-4 w-4" />
                Company information unavailable
              </div>
            )}
          </div>

          <div className="mt-5 border-t border-[var(--color-brand-red)]/10 px-2 pb-5 pt-4">
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
                  <img src={link.icon} alt={link.alt} className="h-11 w-11 object-contain" />
                </a>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={onShare}
                aria-label="Share this card"
                title="Share this card"
                className="inline-flex h-12 w-12 items-center justify-center text-[var(--color-brand-red-dark)] transition hover:-translate-y-0.5"
              >
                <Share2 className="h-7 w-7" />
              </button>

              <button
                type="button"
                onClick={onCopy}
                aria-label="Copy this card link"
                title="Copy this card link"
                className="inline-flex h-12 w-12 items-center justify-center text-[var(--color-brand-red-dark)] transition hover:-translate-y-0.5"
              >
                <Copy className="h-7 w-7" />
              </button>

              <button
                type="button"
                onClick={onToggleDownloadMenu}
                disabled={downloading}
                aria-label="Download this card"
                title="Download this card"
                className="inline-flex h-12 w-12 items-center justify-center text-[var(--color-brand-red-dark)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Download className="h-7 w-7" />
              </button>
            </div>

            {downloadMenuOpen && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => onDownload?.('jpg')}
                  className="rounded-2xl bg-[var(--color-brand-red-soft)] px-3 py-3 text-sm font-semibold text-[var(--color-brand-red-dark)] transition hover:bg-[#f5d8de]"
                >
                  JPG
                </button>
                <button
                  type="button"
                  onClick={() => onDownload?.('pdf')}
                  className="rounded-2xl bg-[var(--color-brand-red-soft)] px-3 py-3 text-sm font-semibold text-[var(--color-brand-red-dark)] transition hover:bg-[#f5d8de]"
                >
                  PDF
                </button>
                <button
                  type="button"
                  onClick={() => onDownload?.('vcf')}
                  className="rounded-2xl bg-[var(--color-brand-red-soft)] px-3 py-3 text-sm font-semibold text-[var(--color-brand-red-dark)] transition hover:bg-[#f5d8de]"
                >
                  VCF
                </button>
              </div>
            )}

            {notice && (
              <p className="mt-3 text-center text-sm font-medium text-[var(--color-brand-red-dark)]">
                {notice}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  </section>
);

export default PublicProfileCardLayout;
