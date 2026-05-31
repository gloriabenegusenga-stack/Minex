import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuthenticatedUser {
  email: string;
  phone: string;
  countryCode: string;
  countryName: string;
  flag: string;
}

interface AuthContextType {
  user: AuthenticatedUser | null;
  login: (email: string, phone: string, countryCode: string, countryName: string, flag: string) => void;
  logout: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const countriesData = [
  { name: 'United States', code: '+1', flag: '🇺🇸', id: 'US' },
  { name: 'Canada', code: '+1', flag: '🇨🇦', id: 'CA' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧', id: 'GB' },
  { name: 'Rwanda', code: '+250', flag: '🇷🇼', id: 'RW' },
  { name: 'Australia', code: '+61', flag: '🇦🇺', id: 'AU' },
  { name: 'France', code: '+33', flag: '🇫🇷', id: 'FR' },
  { name: 'Germany', code: '+49', flag: '🇩🇪', id: 'DE' },
  { name: 'Japan', code: '+81', flag: '🇯🇵', id: 'JP' },
  { name: 'India', code: '+91', flag: '🇮🇳', id: 'IN' },
  { name: 'Brazil', code: '+55', flag: '🇧🇷', id: 'BR' },
  { name: 'South Africa', code: '+27', flag: '🇿🇦', id: 'ZA' },
  { name: 'Singapore', code: '+65', flag: '🇸🇬', id: 'SG' },
  { name: 'Switzerland', code: '+41', flag: '🇨🇭', id: 'CH' },
  { name: 'Netherlands', code: '+31', flag: '🇳🇱', id: 'NL' },
  { name: 'Spain', code: '+34', flag: '🇪🇸', id: 'ES' },
  { name: 'Italy', code: '+39', flag: '🇮🇹', id: 'IT' },
  { name: 'New Zealand', code: '+64', flag: '🇳🇿', id: 'NZ' },
  { name: 'Sweden', code: '+46', flag: '🇸🇪', id: 'SE' },
  { name: 'Norway', code: '+47', flag: '🇳🇴', id: 'NO' },
  { name: 'Finland', code: '+358', flag: '🇫🇮', id: 'FI' },
  { name: 'Denmark', code: '+45', flag: '🇩🇰', id: 'DK' },
  { name: 'Belgium', code: '+32', flag: '🇧🇪', id: 'BE' },
  { name: 'Austria', code: '+43', flag: '🇦🇹', id: 'AT' },
  { name: 'Argentina', code: '+54', flag: '🇦🇷', id: 'AR' },
  { name: 'Chile', code: '+56', flag: '🇨🇱', id: 'CL' },
  { name: 'Colombia', code: '+57', flag: '🇨🇴', id: 'CO' },
  { name: 'Mexico', code: '+52', flag: '🇲🇽', id: 'MX' },
  { name: 'Peru', code: '+51', flag: '🇵🇪', id: 'PE' },
  { name: 'China', code: '+86', flag: '🇨🇳', id: 'CN' },
  { name: 'South Korea', code: '+82', flag: '🇰🇷', id: 'KR' },
  { name: 'Saudi Arabia', code: '+966', flag: '🇸🇦', id: 'SA' },
  { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪', id: 'AE' },
  { name: 'Kenya', code: '+254', flag: '🇰🇪', id: 'KE' },
  { name: 'Nigeria', code: '+234', flag: '🇳🇬', id: 'NG' },
  { name: 'Ghana', code: '+233', flag: '🇬🇭', id: 'GH' },
  { name: 'Egypt', code: '+20', flag: '🇪🇬', id: 'EG' },
  { name: 'Indonesia', code: '+62', flag: '🇮🇩', id: 'ID' },
  { name: 'Malaysia', code: '+60', flag: '🇲🇾', id: 'MY' },
  { name: 'Philippines', code: '+63', flag: '🇵🇭', id: 'PH' },
  { name: 'Thailand', code: '+66', flag: '🇹🇭', id: 'TH' },
  { name: 'Vietnam', code: '+84', flag: '🇻🇳', id: 'VN' },
  { name: 'Turkey', code: '+90', flag: '🇹🇷', id: 'TR' },
  { name: 'Greece', code: '+30', flag: '🇬🇷', id: 'GR' },
  { name: 'Poland', code: '+48', flag: '🇵🇱', id: 'PL' },
  { name: 'Portugal', code: '+351', flag: '🇵🇹', id: 'PT' },
  { name: 'Ireland', code: '+353', flag: '🇮🇪', id: 'IE' },
  { name: 'Israel', code: '+972', flag: '🇮🇱', id: 'IL' },
  { name: 'Hong Kong', code: '+852', flag: '🇭🇰', id: 'HK' },
  { name: 'Qatar', code: '+974', flag: '🇶🇦', id: 'QA' },
  { name: 'Kuwait', code: '+965', flag: '🇰🇼', id: 'KW' },
  { name: 'Morocco', code: '+212', flag: '🇲🇦', id: 'MA' },
  { name: 'Ethiopia', code: '+251', flag: '🇪🇹', id: 'ET' },
  { name: 'Tanzania', code: '+255', flag: '🇹🇿', id: 'TZ' },
  { name: 'Uganda', code: '+256', flag: '🇺🇬', id: 'UG' },
  { name: 'Democratic Republic of the Congo', code: '+243', flag: '🇨🇩', id: 'CD' },
  { name: 'Zambia', code: '+260', flag: '🇿🇲', id: 'ZM' },
  { name: 'Zimbabwe', code: '+263', flag: '🇿🇼', id: 'ZW' },
  { name: 'Other / Custom Dial', code: '+', flag: '🌐', id: 'OTHER' }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('minex_logged_in_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error loading stored user', e);
      }
    }
  }, []);

  const login = (email: string, phone: string, countryCode: string, countryName: string, flag: string) => {
    const userData: AuthenticatedUser = {
      email,
      phone,
      countryCode,
      countryName,
      flag
    };
    setUser(userData);
    localStorage.setItem('minex_logged_in_user', JSON.stringify(userData));
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('minex_logged_in_user');
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoginModalOpen, openLoginModal, closeLoginModal }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
