/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  LayoutTemplate,
  SquareCode,
  Lightbulb,
  SlidersHorizontal,
  Headphones,
  MessageSquare,
  Sparkles,
  Sliders,
  Layers,
  Feather,
  Server,
  Target,
  PenLine,
  Menu,
  X,
  Star,
  LucideIcon
} from 'lucide-react';
import { Logo } from './components/Logo';

interface ToolCardItem {
  id: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title1: string;
  title2: string;
  description: string;
  buttonText: string;
  isPopular?: boolean;
  badgeText?: string;
}

const TOOL_CARDS: ToolCardItem[] = [
  {
    id: 'card-1',
    icon: LayoutTemplate,
    iconBg: 'bg-[#EEF6F1]',
    iconColor: 'text-[#0E9F6E]',
    title1: 'Hnbl Tone',
    title2: 'Analyer',
    description: 'Leoes seenias fru done gceinet eicliuec o fnortias oute giniki ooalcanet.',
    buttonText: 'Lean more',
  },
  {
    id: 'card-2',
    icon: SquareCode,
    iconBg: 'bg-[#EEF6F1]',
    iconColor: 'text-[#0E9F6E]',
    title1: 'Seo Analyzer',
    title2: 'Optimizer',
    description: 'Earocerneel nogeette alnime aeliones siodine cortiloeñte. gn\'stone sondsrars.',
    buttonText: 'Lean more',
  },
  {
    id: 'card-3',
    icon: Lightbulb,
    iconBg: 'bg-[#EEF6F1]',
    iconColor: 'text-[#0E9F6E]',
    title1: 'Content',
    title2: 'Optimizer',
    description: 'Boes tsye tees tri edeist anspeta cloete oit urilosint. cel fovecing cosatrendt.',
    buttonText: 'Learn more',
    isPopular: true,
    badgeText: 'Popular',
  },
  {
    id: 'card-4',
    icon: SlidersHorizontal,
    iconBg: 'bg-[#EEF6F1]',
    iconColor: 'text-[#0E9F6E]',
    title1: 'Pond',
    title2: 'Neceind',
    description: 'Leerts beanis ciuvs streele chiries tonignefteone taloles couls uufls pelicon',
    buttonText: 'Learn more',
  },
  {
    id: 'card-5',
    icon: Headphones,
    iconBg: 'bg-[#EEF6F1]',
    iconColor: 'text-[#0E9F6E]',
    title1: 'Poat Fhuin',
    title2: 'Fielcing',
    description: 'Lesfree ropatc tonns ihot:cont. onofterlginolendelitnet friem andnss sscoo ftsstttec.',
    buttonText: 'Lean more',
  },
  {
    id: 'card-6',
    icon: MessageSquare,
    iconBg: 'bg-[#EEF6F1]',
    iconColor: 'text-[#0E9F6E]',
    title1: 'Guiot Guiid',
    title2: 'Bucuzcx',
    description: 'Loctceis colictw tauin t stcots ghilts actuclictanm tureet gnais oncluol;.',
    buttonText: 'Lean more',
  },
  {
    id: 'card-7',
    icon: Sparkles,
    iconBg: 'bg-[#EEF6F1]',
    iconColor: 'text-[#0E9F6E]',
    title1: 'Sugiccit pry',
    title2: 'Optimizer',
    description: 'Eaotessocrnst oils oleacte onottrdot trond urtlicardrlciturt. andoblt ealo loealcceitét.',
    buttonText: 'Learn more',
    isPopular: true,
    badgeText: 'Featured',
  },
  {
    id: 'card-8',
    icon: Sliders,
    iconBg: 'bg-[#EEF6F1]',
    iconColor: 'text-[#0E9F6E]',
    title1: 'Soog Miucl tio,',
    title2: 'Epciozer',
    description: 'Locest looniiest olie riutiest. calficte boilrurlcoldiisriclote pnsioneooh gofeir ehioud;',
    buttonText: 'Learn more',
  },
  {
    id: 'card-9',
    icon: Layers,
    iconBg: 'bg-[#EEF6F1]',
    iconColor: 'text-[#0E9F6E]',
    title1: 'Coaluen Apo',
    title2: 'Opclent Oon',
    description: 'Bacionos scondies feoliotam ont thtuisojcor kidt eatuslot. giidsce curt porttceet.',
    buttonText: 'Lean more',
  },
  {
    id: 'card-10',
    icon: Feather,
    iconBg: 'bg-[#EEF6F1]',
    iconColor: 'text-[#0E9F6E]',
    title1: 'Pone Cone',
    title2: 'Urvouine',
    description: 'linoon zotormnos ceoteon peir asoliingon dclloonie aust gitls oidceheelt..',
    buttonText: 'Lean more',
  },
  {
    id: 'card-11',
    icon: Server,
    iconBg: 'bg-[#EEF6F1]',
    iconColor: 'text-[#0E9F6E]',
    title1: 'Coouamod',
    title2: 'Opainizer',
    description: 'oalscoe foedieese bioliion. piadsec onolloeoidec gutstnets mofulicks tueton',
    buttonText: 'Learn more',
  },
  {
    id: 'card-12',
    icon: Target,
    iconBg: 'bg-[#EEF6F1]',
    iconColor: 'text-[#0E9F6E]',
    title1: 'Wiun Then',
    title2: 'Roding Oup',
    description: 'oalzaooerenctslot, eclodicy onisko n erndarlise sesita deur orotectteng ater noessh.',
    buttonText: 'Lean more',
  },
];

export default function App() {
  const [activeNav, setActiveNav] = useState('Features-0');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      id="main-container"
      className="min-h-screen w-full bg-[#FFFFFF] py-4 sm:py-6 md:py-8 px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 font-sans flex flex-col items-center transition-all duration-300"
    >
      <div className="w-full max-w-[1920px] flex flex-col space-y-4 sm:space-y-6">
        {/* Main Navbar */}
        <header
          id="main-navbar"
          className="w-full bg-[#FFFFFF] rounded-2xl sm:rounded-3xl shadow-[0_4px_25px_-5px_rgba(0,0,0,0.04)] border border-[#EEF6F1] px-5 sm:px-8 py-3.5 flex items-center justify-between relative transition-all"
        >
          <div id="brand-logo">
            <Logo height={38} />
          </div>

          {/* Desktop Navigation links */}
          <nav id="nav-links" className="hidden md:flex items-center space-x-7 lg:space-x-10 text-[13px] lg:text-[14px] font-medium">
            {['Features', 'Pricing', 'Pricing', 'Support'].map((item, idx) => {
              const isActive = activeNav === `${item}-${idx}`;
              return (
                <button
                  key={`${item}-${idx}`}
                  type="button"
                  onClick={() => setActiveNav(`${item}-${idx}`)}
                  className={`relative py-1 transition-colors cursor-pointer ${
                    isActive ? 'text-[#1A1A1A] font-semibold' : 'text-[#6B7280] hover:text-[#1A1A1A]'
                  }`}
                >
                  {item}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0E9F6E] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              id="signup-button"
              type="button"
              className="bg-[#0E9F6E] hover:bg-[#097d56] text-white text-[12.5px] sm:text-[13px] font-semibold px-5 sm:px-6 py-2 rounded-full shadow-[0_2px_10px_rgba(14,159,110,0.25)] hover:shadow-[0_4px_14px_rgba(14,159,110,0.35)] transition-all duration-150 active:scale-98 cursor-pointer"
            >
              Sign up
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              id="mobile-menu-toggle"
              aria-label="Toggle Navigation Menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-[#1A1A1A] hover:bg-[#EEF6F1] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile dropdown menu */}
          {mobileMenuOpen && (
            <div
              id="mobile-dropdown-menu"
              className="absolute top-full left-0 right-0 mt-2 bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#EEF6F1] p-4 flex flex-col space-y-2 z-50 md:hidden"
            >
              {['Features', 'Pricing', 'Pricing', 'Support'].map((item, idx) => (
                <button
                  key={`mobile-${item}-${idx}`}
                  type="button"
                  onClick={() => {
                    setActiveNav(`${item}-${idx}`);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-lg text-[14px] font-medium transition-colors cursor-pointer ${
                    activeNav === `${item}-${idx}`
                      ? 'bg-[#EEF6F1] text-[#0E9F6E] font-semibold'
                      : 'text-[#6B7280] hover:bg-[#EEF6F1]/50 hover:text-[#1A1A1A]'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* Grid of 12 Cards - Styled with White & #EEF6F1 Alternation */}
        <main
          id="cards-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 pt-1 pb-10 w-full"
        >
          {TOOL_CARDS.map((card, index) => {
            const IconComponent = card.icon;
            const isAlternateBg = index % 2 === 1;

            return (
              <article
                key={card.id}
                id={card.id}
                className={`relative rounded-[22px] sm:rounded-[24px] p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] border transition-all duration-200 flex flex-col justify-between min-h-[270px] sm:min-h-[285px] hover:shadow-[0_10px_30px_-4px_rgba(14,159,110,0.12)] hover:-translate-y-0.5 ${
                  card.isPopular
                    ? 'border-[#C9A227]/60 bg-white ring-1 ring-[#C9A227]/30'
                    : isAlternateBg
                    ? 'bg-[#EEF6F1]/50 border-[#EEF6F1]'
                    : 'bg-[#FFFFFF] border-[#EEF6F1]'
                }`}
              >
                {/* Rare Gold Badge if featured/popular */}
                {card.isPopular && (
                  <div
                    id={`badge-${card.id}`}
                    className="absolute -top-2.5 right-6 bg-[#C9A227] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1"
                  >
                    <Star className="w-3 h-3 fill-white text-white" />
                    <span>{card.badgeText || 'Popular'}</span>
                  </div>
                )}

                {/* Top Row: Icon badge & edit circle button */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-[#EEF6F1] text-[#0E9F6E] border border-[#0E9F6E]/15 shadow-sm`}
                  >
                    <IconComponent className="w-5 h-5 stroke-[2]" />
                  </div>

                  <button
                    type="button"
                    title="Edit"
                    aria-label="Edit item"
                    className="w-7 h-7 rounded-full bg-[#EEF6F1] hover:bg-[#0E9F6E] text-[#6B7280] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <PenLine className="w-3.5 h-3.5 stroke-[2]" />
                  </button>
                </div>

                {/* Card Title */}
                <div className="mt-4">
                  <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1A1A1A] leading-[1.25] tracking-tight">
                    <div>{card.title1}</div>
                    <div>{card.title2}</div>
                  </h2>
                </div>

                {/* Description */}
                <p className="text-[12px] sm:text-[12.5px] leading-[1.5] text-[#6B7280] mt-2 font-normal line-clamp-3">
                  {card.description}
                </p>

                {/* Bottom Action Button (Green #0E9F6E) */}
                <div className="mt-4 pt-1">
                  <button
                    type="button"
                    className="w-full py-2.5 sm:py-2.75 rounded-xl bg-[#0E9F6E] hover:bg-[#097d56] text-white font-semibold text-[11.5px] sm:text-[12px] text-center shadow-[0_2px_8px_rgba(14,159,110,0.2)] hover:shadow-[0_4px_12px_rgba(14,159,110,0.3)] transition-all cursor-pointer"
                  >
                    {card.buttonText}
                  </button>
                </div>
              </article>
            );
          })}
        </main>

      </div>
    </div>
  );
}
