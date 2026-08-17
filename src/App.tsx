/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calculator } from 'lucide-react';
import { Logo } from './components/Logo';
import { AccountingView } from './components/accounting/AccountingView';

export default function App() {
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

          <div className="flex items-center gap-2 text-[13px] lg:text-[14px] font-semibold text-[#1A1A1A]">
            <Calculator className="w-4 h-4 text-[#0E9F6E]" />
            المحاسبة
          </div>
        </header>

        <main id="accounting-page" className="w-full pt-1">
          <AccountingView />
        </main>
      </div>
    </div>
  );
}
