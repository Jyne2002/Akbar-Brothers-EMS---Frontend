import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import PublicProfileCardLayout from '../components/PublicProfileCardLayout';
import { getCompanyByValue } from '../constants/companies';
import api from '../utils/api';
import {
  buildPublicCompanyInfoUrl,
  buildPublicProfileUrl,
  downloadProfileAsJpg,
  downloadProfileAsPdf,
  downloadProfileAsVcf,
  formatPhoneWithExtension,
  getWhatsappUrl,
  normalizeLinkedinUrl,
} from '../utils/profileCard';

const PublicProfileCard = () => {
  const { shareSlug } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setNotice('');
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await api.get(`/api/auth/public-profile/${shareSlug}`);
        setProfile(data);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || 'We could not load this visiting card.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [shareSlug]);

  const company = useMemo(() => getCompanyByValue(profile?.company || ''), [profile?.company]);
  const publicCompanyInfoPath = buildPublicCompanyInfoUrl(shareSlug, company?.code);
  const companyLogoSrc = company?.logo || '/akbar-corporate-logo.png';
  const companyLogoAlt = company?.companyName
    ? `${company.companyName} corporate logo`
    : 'Akbar Brothers corporate logo';

  const socialLinks = useMemo(
    () =>
      [
        {
          key: 'linkedin',
          alt: 'LinkedIn',
          href: normalizeLinkedinUrl(profile?.linkedinUrl),
          icon: '/linkedin.png',
        },
        {
          key: 'whatsapp',
          alt: 'WhatsApp',
          href: getWhatsappUrl(profile?.phoneNumber),
          icon: '/whatsapp.png',
        },
      ].filter((link) => link.href),
    [profile?.linkedinUrl, profile?.phoneNumber],
  );

  const profileRows = useMemo(
    () => [
      {
        label: 'Phone',
        value: formatPhoneWithExtension(profile?.phoneNumber, profile?.extensionNumber) || 'Not shared yet',
      },
      { label: 'E-mail', value: profile?.email || 'Not shared yet' },
    ],
    [profile?.email, profile?.extensionNumber, profile?.phoneNumber],
  );

  const initials = useMemo(
    () =>
      (profile?.fullName || 'AB')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase(),
    [profile?.fullName],
  );

  const handleShare = async () => {
    const shareUrl = buildPublicProfileUrl(shareSlug);

    if (!shareUrl || !profile) {
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${profile.fullName} | Employee Card`,
          text: `View ${profile.fullName}'s employee visiting card.`,
          url: shareUrl,
        });
        setNotice('Card link shared successfully.');
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setNotice('Card link copied to your clipboard.');
        return;
      }

      window.prompt('Copy this visiting card link:', shareUrl);
      setNotice('Copy the link from the dialog to share it.');
    } catch (shareError) {
      setNotice(shareError?.message || 'We could not share this card right now.');
    }
  };

  const handleCopyLink = async () => {
    const shareUrl = buildPublicProfileUrl(shareSlug);

    if (!shareUrl) {
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setNotice('Card link copied to your clipboard.');
        return;
      }

      window.prompt('Copy this visiting card link:', shareUrl);
      setNotice('Copy the link from the dialog.');
    } catch (copyError) {
      setNotice(copyError?.message || 'We could not copy the card link right now.');
    }
  };

  const handleDownload = async (format) => {
    if (!profile) {
      return;
    }

    try {
      setDownloading(true);
      setNotice('');

      if (format === 'jpg') {
        await downloadProfileAsJpg(profile, company);
        setNotice('JPG download started.');
      } else if (format === 'pdf') {
        await downloadProfileAsPdf(profile, company);
        setNotice('PDF download started.');
      } else {
        downloadProfileAsVcf(profile, company);
        setNotice('Contact card download started.');
      }
    } catch (downloadError) {
      setNotice(downloadError?.message || 'We could not create that download.');
    } finally {
      setDownloading(false);
      setDownloadMenuOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(233,198,204,0.55)_0%,_rgba(250,246,243,0.92)_38%,_#f7f0eb_100%)]">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[var(--color-brand-red-dark)]" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(233,198,204,0.55)_0%,_rgba(250,246,243,0.92)_38%,_#f7f0eb_100%)] px-4 py-10">
        <div className="mx-auto max-w-sm rounded-[2.2rem] border border-[var(--color-brand-red)]/10 bg-white p-7 text-center shadow-[0_24px_54px_rgba(89,10,22,0.08)]">
          <img
            src="/akbar-corporate-logo.png"
            alt="Akbar Brothers corporate logo"
            className="mx-auto h-12 w-auto object-contain"
          />
          <h1 className="mt-6 text-2xl font-black text-black">Card unavailable</h1>
          <p className="mt-3 text-sm leading-6 text-black/70">
            {error || 'This visiting card is not available right now.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] items-center bg-[radial-gradient(circle_at_top,_rgba(233,198,204,0.55)_0%,_rgba(250,246,243,0.92)_38%,_#f7f0eb_100%)] px-4 py-3">
      <div className="mx-auto max-w-[21.75rem]">
        <PublicProfileCardLayout
          profile={profile}
          companyLogoSrc={companyLogoSrc}
          companyLogoAlt={companyLogoAlt}
          profileRows={profileRows}
          initials={initials}
          publicCompanyInfoPath={publicCompanyInfoPath}
          socialLinks={socialLinks}
          downloadMenuOpen={downloadMenuOpen}
          downloading={downloading}
          notice={notice}
          onShare={handleShare}
          onCopy={handleCopyLink}
          onToggleDownloadMenu={() => setDownloadMenuOpen((currentState) => !currentState)}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
};

export default PublicProfileCard;
