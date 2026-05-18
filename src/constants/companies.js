const AKBAR_COMPANY_OVERVIEW =
  "Akbar Brothers (Pvt) Ltd is Sri Lanka's Largest Tea Exporter and one of the country's most respected diversified conglomerates. Established in 1969, the family-owned enterprise has grown from a tea trading business into a global organisation with interests spanning sustainable power generation, healthcare, packaging, property development, environmental services and international trade.";

const FALCON_COMPANY_OVERVIEW =
  "Falcon Trading (Pvt) Ltd is a leading Sri Lankan distributor serving the bakery and confectionery industry with an island-wide supply network. The company imports and distributes premium margarine, shortening, palm olein, yeast, bread improvers, flavours, colours, cocoa powder, canned fish, and other trusted ingredients sourced from globally recognized manufacturers and local partners.";

const QUICK_TEA_COMPANY_OVERVIEW =
  "Quick Tea (Pvt) Limited, incorporated in 1972 as a subsidiary of Akbar Brothers Limited, operates one of Sri Lanka's largest teabag manufacturing facilities with a capacity of more than 3 billion teabags per year. The company is also recognized for its sustainability leadership, including Carbon-Inset certification supported by renewable energy initiatives and greenhouse gas reduction efforts across its value chain.";

const AKBAR_ACTION_LINKS = [
  {
    key: 'linkedin',
    alt: 'LinkedIn',
    href: 'https://lk.linkedin.com/company/akbar-brothers-pvt-ltd',
    icon: '/linkedin.png',
    iconType: 'image',
  },
  {
    key: 'facebook',
    alt: 'Facebook',
    href: 'https://www.facebook.com/AkbarBrothersPvtLtd',
    icon: '/facebook.png',
    iconType: 'image',
  },
  {
    key: 'instagram',
    alt: 'Instagram',
    href: 'https://www.instagram.com/akbar_brothers',
    icon: '/instagram.png',
    iconType: 'image',
  },
];

const FALCON_ACTION_LINKS = [
  {
    key: 'gmail',
    alt: 'Gmail',
    href: 'mailto:info@falconfoods.lk',
    icon: '/gmail.png',
    iconType: 'image',
  },
  {
    key: 'phone',
    alt: 'Phone',
    href: 'tel:+94112697151',
    icon: '/phone.png',
    iconType: 'image',
  },
];

export const COMPANIES = [
  {
    code: 'A',
    id: 'Company A',
    name: 'Akbar Brothers',
    description: 'Estate operations and premium tea production teams.',
    companyName: 'Akbar Brothers',
    companyOverview: AKBAR_COMPANY_OVERVIEW,
    address: 'No. 334, T.B. Jayah Mawatha, Colombo 10, Sri Lanka.',
    websiteLabel: 'www.akbargroup.lk',
    websiteUrl: 'https://www.akbargroup.lk',
    logo: '/akbar-corporate-logo.png',
    actionLinks: AKBAR_ACTION_LINKS,
    aliases: ['Company A', 'Akbar Brothers'],
  },
  {
    code: 'B',
    id: 'Company B',
    name: 'Falcon Trading',
    description: 'Bakery and confectionery ingredient distribution teams across Sri Lanka.',
    companyName: 'Falcon Trading (Pvt) Ltd',
    companyOverview: FALCON_COMPANY_OVERVIEW,
    logo: '/falconfoods.png',
    actionLinks: FALCON_ACTION_LINKS,
    aliases: ['Company B', 'Company 2', 'Falcon Trading', 'Falcon Trading (Pvt) Ltd'],
  },
  {
    code: 'C',
    id: 'Company C',
    name: 'Quick Tea',
    description: 'Teabag manufacturing and sustainability-focused tea operations.',
    companyName: 'Quick Tea (Pvt) Limited',
    companyOverview: QUICK_TEA_COMPANY_OVERVIEW,
    logo: '/quick-tea-logo.png',
    actionLinks: AKBAR_ACTION_LINKS,
    aliases: ['Company C', 'Company 3', 'Quick Tea', 'Quick Tea (Pvt) Limited'],
  },
];

const normalizeCompanyLookupValue = (company) =>
  typeof company === 'string' ? company.trim().toLowerCase() : '';

export const getCompanyByValue = (company) => {
  const normalizedCompany = normalizeCompanyLookupValue(company);

  if (!normalizedCompany) {
    return null;
  }

  return (
    COMPANIES.find((entry) =>
      [entry.code, entry.id, entry.name, ...(entry.aliases || [])]
        .filter(Boolean)
        .some((value) => normalizeCompanyLookupValue(value) === normalizedCompany),
    ) || null
  );
};

export const getCompanyCode = (company) => getCompanyByValue(company)?.code || '';

export const getCompanyLabel = (company) => getCompanyByValue(company)?.name || company;
