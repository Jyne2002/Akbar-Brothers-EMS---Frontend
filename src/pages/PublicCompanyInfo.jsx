import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Building2 } from 'lucide-react';
import CompanyActionButtons from '../components/CompanyActionButtons';
import { getCompanyByValue } from '../constants/companies';

const PublicCompanyInfo = () => {
  const { shareSlug, companyId } = useParams();
  const company = getCompanyByValue(decodeURIComponent(companyId || ''));
  const [showLogo, setShowLogo] = useState(Boolean(company?.logo));

  useEffect(() => {
    setShowLogo(Boolean(company?.logo));
  }, [company?.logo]);

  if (!company) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,_#fdfaf8_0%,_#f6ece5_100%)] px-4 py-10">
        <div className="mx-auto max-w-sm rounded-[2.2rem] border border-[var(--color-brand-red)]/10 bg-white p-7 text-center shadow-[0_24px_54px_rgba(89,10,22,0.08)]">
          <h1 className="text-2xl font-black text-black">Company not found</h1>
          <p className="mt-3 text-sm leading-6 text-black/70">
            We could not match this company to a saved public company page.
          </p>
          <Link
            to={`/card/${shareSlug}`}
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
    <div className="min-h-screen bg-[linear-gradient(180deg,_#fdfaf8_0%,_#f6ece5_100%)] px-4 py-6">
      <section className="mx-auto max-w-sm rounded-[2.3rem] border border-[var(--color-brand-red)]/10 bg-white p-6 shadow-[0_26px_54px_rgba(89,10,22,0.08)]">
        <div className="flex min-h-[15rem] items-center justify-center px-4 py-4">
          {showLogo ? (
            <img
              src={company.logo}
              alt={`${company.companyName} corporate logo`}
              className="mx-auto h-40 w-auto object-contain"
              onError={() => setShowLogo(false)}
            />
          ) : (
            <div className="flex h-52 w-full flex-col items-center justify-center rounded-[2rem] border border-dashed border-[var(--color-brand-red)]/18 bg-[#faf7f8] px-6 text-center text-black">
              <Building2 className="h-14 w-14" />
              <p className="mt-4 text-lg font-bold text-black">{company.name}</p>
            </div>
          )}
        </div>

        <div className="mt-2 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black">
            Company Details
          </p>
          <h1 className="mt-3 text-3xl font-black text-black">About {company.name}</h1>
          <p className="mt-4 text-sm leading-7 text-black/74">{company.companyOverview}</p>
        </div>

        <div className="mt-7">
          <CompanyActionButtons company={company} size="compact" centered />
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to={`/card/${shareSlug}`}
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
