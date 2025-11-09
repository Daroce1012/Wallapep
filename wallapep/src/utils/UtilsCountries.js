// Helper function to get flag emoji from country code
let getFlagEmoji = (countryCode) => {
  if (!countryCode || countryCode.length !== 2) return '';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Helper function to get flag image URL from CDN
let getFlagImageUrl = (countryCode) => {
  return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
};

export const countries = [
  { code: 'AF', name: 'Afghanistan', flag: getFlagEmoji('AF'), flagImage: getFlagImageUrl('AF') },
  { code: 'AL', name: 'Albania', flag: getFlagEmoji('AL'), flagImage: getFlagImageUrl('AL') },
  { code: 'DZ', name: 'Algeria', flag: getFlagEmoji('DZ'), flagImage: getFlagImageUrl('DZ') },
  { code: 'AR', name: 'Argentina', flag: getFlagEmoji('AR'), flagImage: getFlagImageUrl('AR') },
  { code: 'AU', name: 'Australia', flag: getFlagEmoji('AU'), flagImage: getFlagImageUrl('AU') },
  { code: 'AT', name: 'Austria', flag: getFlagEmoji('AT'), flagImage: getFlagImageUrl('AT') },
  { code: 'BD', name: 'Bangladesh', flag: getFlagEmoji('BD'), flagImage: getFlagImageUrl('BD') },
  { code: 'BE', name: 'Belgium', flag: getFlagEmoji('BE'), flagImage: getFlagImageUrl('BE') },
  { code: 'BR', name: 'Brazil', flag: getFlagEmoji('BR'), flagImage: getFlagImageUrl('BR') },
  { code: 'BG', name: 'Bulgaria', flag: getFlagEmoji('BG'), flagImage: getFlagImageUrl('BG') },
  { code: 'CA', name: 'Canada', flag: getFlagEmoji('CA'), flagImage: getFlagImageUrl('CA') },
  { code: 'CL', name: 'Chile', flag: getFlagEmoji('CL'), flagImage: getFlagImageUrl('CL') },
  { code: 'CN', name: 'China', flag: getFlagEmoji('CN'), flagImage: getFlagImageUrl('CN') },
  { code: 'CO', name: 'Colombia', flag: getFlagEmoji('CO'), flagImage: getFlagImageUrl('CO') },
  { code: 'CR', name: 'Costa Rica', flag: getFlagEmoji('CR'), flagImage: getFlagImageUrl('CR') },
  { code: 'HR', name: 'Croatia', flag: getFlagEmoji('HR'), flagImage: getFlagImageUrl('HR') },
  { code: 'CZ', name: 'Czech Republic', flag: getFlagEmoji('CZ'), flagImage: getFlagImageUrl('CZ') },
  { code: 'DK', name: 'Denmark', flag: getFlagEmoji('DK'), flagImage: getFlagImageUrl('DK') },
  { code: 'EC', name: 'Ecuador', flag: getFlagEmoji('EC'), flagImage: getFlagImageUrl('EC') },
  { code: 'EG', name: 'Egypt', flag: getFlagEmoji('EG'), flagImage: getFlagImageUrl('EG') },
  { code: 'FI', name: 'Finland', flag: getFlagEmoji('FI'), flagImage: getFlagImageUrl('FI') },
  { code: 'FR', name: 'France', flag: getFlagEmoji('FR'), flagImage: getFlagImageUrl('FR') },
  { code: 'DE', name: 'Germany', flag: getFlagEmoji('DE'), flagImage: getFlagImageUrl('DE') },
  { code: 'GR', name: 'Greece', flag: getFlagEmoji('GR'), flagImage: getFlagImageUrl('GR') },
  { code: 'GT', name: 'Guatemala', flag: getFlagEmoji('GT'), flagImage: getFlagImageUrl('GT') },
  { code: 'HN', name: 'Honduras', flag: getFlagEmoji('HN'), flagImage: getFlagImageUrl('HN') },
  { code: 'HK', name: 'Hong Kong', flag: getFlagEmoji('HK'), flagImage: getFlagImageUrl('HK') },
  { code: 'HU', name: 'Hungary', flag: getFlagEmoji('HU'), flagImage: getFlagImageUrl('HU') },
  { code: 'IS', name: 'Iceland', flag: getFlagEmoji('IS'), flagImage: getFlagImageUrl('IS') },
  { code: 'IN', name: 'India', flag: getFlagEmoji('IN'), flagImage: getFlagImageUrl('IN') },
  { code: 'ID', name: 'Indonesia', flag: getFlagEmoji('ID'), flagImage: getFlagImageUrl('ID') },
  { code: 'IE', name: 'Ireland', flag: getFlagEmoji('IE'), flagImage: getFlagImageUrl('IE') },
  { code: 'IL', name: 'Israel', flag: getFlagEmoji('IL'), flagImage: getFlagImageUrl('IL') },
  { code: 'IT', name: 'Italy', flag: getFlagEmoji('IT'), flagImage: getFlagImageUrl('IT') },
  { code: 'JP', name: 'Japan', flag: getFlagEmoji('JP'), flagImage: getFlagImageUrl('JP') },
  { code: 'KE', name: 'Kenya', flag: getFlagEmoji('KE'), flagImage: getFlagImageUrl('KE') },
  { code: 'MY', name: 'Malaysia', flag: getFlagEmoji('MY'), flagImage: getFlagImageUrl('MY') },
  { code: 'MX', name: 'Mexico', flag: getFlagEmoji('MX'), flagImage: getFlagImageUrl('MX') },
  { code: 'MA', name: 'Morocco', flag: getFlagEmoji('MA'), flagImage: getFlagImageUrl('MA') },
  { code: 'NL', name: 'Netherlands', flag: getFlagEmoji('NL'), flagImage: getFlagImageUrl('NL') },
  { code: 'NZ', name: 'New Zealand', flag: getFlagEmoji('NZ'), flagImage: getFlagImageUrl('NZ') },
  { code: 'NG', name: 'Nigeria', flag: getFlagEmoji('NG'), flagImage: getFlagImageUrl('NG') },
  { code: 'NO', name: 'Norway', flag: getFlagEmoji('NO'), flagImage: getFlagImageUrl('NO') },
  { code: 'PK', name: 'Pakistan', flag: getFlagEmoji('PK'), flagImage: getFlagImageUrl('PK') },
  { code: 'PA', name: 'Panama', flag: getFlagEmoji('PA'), flagImage: getFlagImageUrl('PA') },
  { code: 'PE', name: 'Peru', flag: getFlagEmoji('PE'), flagImage: getFlagImageUrl('PE') },
  { code: 'PH', name: 'Philippines', flag: getFlagEmoji('PH'), flagImage: getFlagImageUrl('PH') },
  { code: 'PL', name: 'Poland', flag: getFlagEmoji('PL'), flagImage: getFlagImageUrl('PL') },
  { code: 'PT', name: 'Portugal', flag: getFlagEmoji('PT'), flagImage: getFlagImageUrl('PT') },
  { code: 'RO', name: 'Romania', flag: getFlagEmoji('RO'), flagImage: getFlagImageUrl('RO') },
  { code: 'RU', name: 'Russia', flag: getFlagEmoji('RU'), flagImage: getFlagImageUrl('RU') },
  { code: 'SA', name: 'Saudi Arabia', flag: getFlagEmoji('SA'), flagImage: getFlagImageUrl('SA') },
  { code: 'SG', name: 'Singapore', flag: getFlagEmoji('SG'), flagImage: getFlagImageUrl('SG') },
  { code: 'ZA', name: 'South Africa', flag: getFlagEmoji('ZA'), flagImage: getFlagImageUrl('ZA') },
  { code: 'KR', name: 'South Korea', flag: getFlagEmoji('KR'), flagImage: getFlagImageUrl('KR') },
  { code: 'ES', name: 'Spain', flag: getFlagEmoji('ES'), flagImage: getFlagImageUrl('ES') },
  { code: 'SE', name: 'Sweden', flag: getFlagEmoji('SE'), flagImage: getFlagImageUrl('SE') },
  { code: 'CH', name: 'Switzerland', flag: getFlagEmoji('CH'), flagImage: getFlagImageUrl('CH') },
  { code: 'TW', name: 'Taiwan', flag: getFlagEmoji('TW'), flagImage: getFlagImageUrl('TW') },
  { code: 'TH', name: 'Thailand', flag: getFlagEmoji('TH'), flagImage: getFlagImageUrl('TH') },
  { code: 'TR', name: 'Turkey', flag: getFlagEmoji('TR'), flagImage: getFlagImageUrl('TR') },
  { code: 'UA', name: 'Ukraine', flag: getFlagEmoji('UA'), flagImage: getFlagImageUrl('UA') },
  { code: 'AE', name: 'United Arab Emirates', flag: getFlagEmoji('AE'), flagImage: getFlagImageUrl('AE') },
  { code: 'GB', name: 'United Kingdom', flag: getFlagEmoji('GB'), flagImage: getFlagImageUrl('GB') },
  { code: 'US', name: 'United States', flag: getFlagEmoji('US'), flagImage: getFlagImageUrl('US') },
  { code: 'UY', name: 'Uruguay', flag: getFlagEmoji('UY'), flagImage: getFlagImageUrl('UY') },
  { code: 'VE', name: 'Venezuela', flag: getFlagEmoji('VE'), flagImage: getFlagImageUrl('VE') },
  { code: 'VN', name: 'Vietnam', flag: getFlagEmoji('VN'), flagImage: getFlagImageUrl('VN') },
];

