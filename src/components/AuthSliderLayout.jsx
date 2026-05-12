import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthSliderLayout = ({
  mode,
  badge,
  title,
  subtitle,
  panelTitle,
  panelCopy,
  switchPrompt,
  switchLabel,
  switchTo,
  children,
}) => {
  const isRegister = mode === 'register';
  const panelOrderClass = isRegister ? 'order-2 lg:order-1' : 'order-2 lg:order-2';
  const formOrderClass = isRegister ? 'order-1 lg:order-2' : 'order-1 lg:order-1';

  return (
    <div className="flex min-h-screen">
      <div className="relative mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="auth-morph-shell grid w-full overflow-hidden rounded-[1.9rem] border border-[var(--color-brand-red)]/12 bg-white shadow-[0_26px_72px_rgba(89,10,22,0.08)] lg:min-h-[41rem] lg:grid-cols-2">
            <section
              className={`auth-green-panel bg-[linear-gradient(160deg,_rgba(180,31,49,0.96)_0%,_rgba(142,20,36,0.94)_52%,_rgba(92,12,24,0.92)_100%)] p-6 text-white sm:p-8 lg:p-10 ${panelOrderClass}`}
            >
              <div className="flex h-full flex-col justify-center gap-6">
                <div>
                  <div className="flex w-full justify-center">
                    <div className="inline-flex rounded-[1.6rem] bg-white/94 p-3 shadow-sm">
                      <img
                        src="/akbar-corporate-logo.png"
                        alt="Akbar Brothers corporate logo"
                        className="h-20 w-auto object-contain"
                      />
                    </div>
                </div>

                  <p className="mt-8 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-brand-red-soft)] sm:text-sm">
                    {badge}
                  </p>
                  <h2 className="mt-3 max-w-md text-3xl font-black leading-tight sm:text-4xl">
                    {panelTitle}
                  </h2>
                  <p className="mt-4 max-w-md text-sm leading-6 text-white/84 sm:text-base">
                    {panelCopy}
                  </p>
                  <div className="mt-6 space-y-2 text-sm text-white/78">
                    <p>Fast access to employee records, company directories, and admin tools.</p>
                    <p>Clean sign in and registration flow built for desktop and mobile.</p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                    <span className="text-white/75">{switchPrompt}</span>
                    <Link
                      to={switchTo}
                      viewTransition
                      className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-[var(--color-brand-red-dark)] px-5 py-3 font-semibold text-white shadow-[0_14px_34px_rgba(61,7,15,0.2)] transition-transform hover:-translate-y-0.5 hover:bg-[#6f101c]"
                    >
                      {switchLabel}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            <section
              className={`auth-white-panel bg-[rgba(252,251,248,0.9)] px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-10 ${formOrderClass}`}
            >
              <div className="mx-auto flex h-full w-full max-w-md flex-col justify-center">
                <div className="inline-flex items-center gap-2 self-start rounded-full border border-[var(--color-brand-red)]/18 bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-brand-red-dark)] shadow-sm">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-brand-red-dark)]" />
                  Secure employee access
                </div>

                <h1 className="mt-6 text-3xl font-black tracking-tight text-[var(--color-brand-red-dark)] sm:text-4xl">
                  {title}
                </h1>
                <p className="mt-3 text-sm leading-6 text-[var(--color-earth-brown)]/80 sm:text-base">
                  {subtitle}
                </p>

                <div className="mt-8">{children}</div>
              </div>
            </section>
        </div>
      </div>
    </div>
  );
};

export default AuthSliderLayout;
