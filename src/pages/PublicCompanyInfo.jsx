import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Building2 } from 'lucide-react';
import CompanyActionButtons from '../components/CompanyActionButtons';
import { getCompanyByValue } from '../constants/companies';
import { buildPublicProfilePath } from '../utils/profileCard';

const PublicCompanyInfo = () => {
  const { shareSlug, companyId, identitySlug } = useParams();
  const company = getCompanyByValue(decodeURIComponent(companyId || ''));
  const [logoErrorCompanyCode, setLogoErrorCompanyCode] = useState('');
  const showLogo = Boolean(company?.logo) && logoErrorCompanyCode !== company?.code;
  const publicProfilePath = buildPublicProfilePath(shareSlug, '', '', identitySlug);

  if (!company) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,_#fdfaf8_0%,_#f6ece5_100%)] px-4 py-10">
        <div className="mx-auto max-w-sm rounded-[2.2rem] border border-[var(--color-brand-red)]/10 bg-white p-7 text-center shadow-[0_24px_54px_rgba(89,10,22,0.08)]">
          <h1 className="text-2xl font-black text-black">Company not found</h1>
          <p className="mt-3 text-sm leading-6 text-black/70">
            We could not match this company to a saved public company page.
          </p>
          <Link
            to={publicProfilePath}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-brand-red)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-red-dark)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to card
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-[linear-gradient(180deg,_#fdfaf8_0%,_#f6ece5_100%)] px-3 py-3 md:flex md:min-h-[100dvh] md:items-center md:px-4 md:py-6">
      <section className="mx-auto max-w-sm rounded-[2.15rem] border border-[var(--color-brand-red)]/10 bg-white p-4 shadow-[0_22px_44px_rgba(89,10,22,0.08)] sm:p-5">
        <div className="flex min-h-[7.75rem] items-center justify-center px-2 py-0.5 sm:min-h-[10.5rem] sm:px-3 sm:py-2">
          {showLogo ? (
            <img
              src={company.logo}
              alt={`${company.companyName} corporate logo`}
              className="mx-auto h-24 w-auto object-contain sm:h-[7.5rem]"
              onError={() => setLogoErrorCompanyCode(company.code)}
            />
          ) : (
            <div className="flex h-40 w-full flex-col items-center justify-center rounded-[1.8rem] border border-dashed border-[var(--color-brand-red)]/18 bg-[#faf7f8] px-5 text-center text-black sm:h-44">
              <Building2 className="h-12 w-12" />
              <p className="mt-3 text-base font-bold text-black">{company.name}</p>
            </div>
          )}
        </div>

        <div className="mt-0.5 text-center">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-black">
            Company Details
          </p>
          <p className="mt-2 text-[0.93rem] leading-6 text-black/74">{company.companyOverview}</p>
        </div>

        <div className="mt-4">
          <CompanyActionButtons company={company} size="compact" centered />
        </div>

        {company.address || company.websiteLabel ? (
          <div className="mt-4 text-center">
            {company.address ? (
              <p className="text-sm leading-6 text-black/78">{company.address}</p>
            ) : null}
            {company.websiteLabel ? (
              <p className="mt-1.5">
                <a
                  href={company.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-black underline underline-offset-2"
                >
                  {company.websiteLabel}
                </a>
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-4 flex justify-center">
          <Link
            to={publicProfilePath}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#faf7f8]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to card
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PublicCompanyInfo;
