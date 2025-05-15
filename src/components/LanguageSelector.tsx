import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import Card from './ui/Card';

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Languages size={20} />
          <h3 className="font-medium">Select Language</h3>
        </div>
        <div className="space-y-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => i18n.changeLanguage(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                i18n.language === lang.code
                  ? 'bg-[#FF5A5F] text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}