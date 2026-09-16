import React, { useState, useEffect } from 'react';
import { TripStoreProvider, useTripStore } from './context/TripStoreContext';
import { Header } from './components/Header';
import { TabBar } from './components/TabBar';
import { Sidebar } from './components/Sidebar';
import { TodayView } from './components/TodayView';
import { ItineraryView } from './components/ItineraryView';
import { VouchersView } from './components/VouchersView';
import { ExpensesView } from './components/ExpensesView';
import { TransportsView } from './components/TransportsView';
import { AccommodationsView } from './components/AccommodationsView';
import { ToursListView } from './components/ToursListView';
import { EmergencyView } from './components/EmergencyView';
import { GuideView } from './components/GuideView';
import { WalkingTourModal } from './components/WalkingTourModal';
import { SpotlightSearch } from './components/SpotlightSearch';
import { SmartFAB } from './components/SmartFAB';
import { AdminDbInspectorModal } from './components/AdminDbInspectorModal';
import { AssistantView } from './components/AssistantView';
import { SettingsView } from './components/SettingsView';
import { PinPadLockScreen } from './components/PinPadLockScreen';
import { WalkingTour } from './types';
import { AnimatePresence, motion } from 'framer-motion';

import { APIProvider } from '@vis.gl/react-google-maps';

export type ActiveTab = 'today' | 'itinerary' | 'vouchers' | 'expenses' | 'assistant' | 'transports' | 'accommodations' | 'tours' | 'emergency' | 'guide' | 'settings';

function MainApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('today');
  const [selectedWalkingTour, setSelectedWalkingTour] = useState<WalkingTour | null>(null);
  const [selectedTransportId, setSelectedTransportId] = useState<string | undefined>(undefined);
  const [selectedHotelId, setSelectedHotelId] = useState<string | undefined>(undefined);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState<boolean>(false);
  const [isDbInspectorOpen, setIsDbInspectorOpen] = useState<boolean>(false);
  
  const { 
    theme, 
    themeCity, 
    activeMember, 
    currentDestination,
    members,
    isLockScreenOpen,
    setIsLockScreenOpen,
    isGuest
  } = useTripStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSpotlightOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Force redirect guest away from restricted tabs
  useEffect(() => {
    if (isGuest && (activeTab === 'expenses' || activeTab === 'settings')) {
      setActiveTab('today');
    }
  }, [activeTab, isGuest]);

  const handleOpenWalkingTour = (tour: WalkingTour) => setSelectedWalkingTour(tour);
  const handleOpenTransport = (transportId?: string) => {
    setSelectedTransportId(transportId);
    setActiveTab('transports');
  };
  const handleOpenAccommodation = (hotelId?: string) => {
    setSelectedHotelId(hotelId);
    setActiveTab('accommodations');
  };
  const handleOpenDay = () => setActiveTab('itinerary');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (activeMember?.color) {
      document.documentElement.style.setProperty('--user-color', activeMember.color);
    }
    
    if (currentDestination?.code) {
      document.documentElement.setAttribute('data-city', currentDestination.code);
    }
  }, [theme, themeCity, activeMember, currentDestination]);

  // Page Transition variants
  const pageVariants = {
    initial: { opacity: 0, scale: 0.98, y: 10 },
    in: { opacity: 1, scale: 1, y: 0 },
    out: { opacity: 0, scale: 1.02, y: -10 }
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-[100dvh] flex shadow-2xl sm:border sm:border-[var(--border-card)] bg-transparent text-[var(--text-primary)] transition-colors duration-500 overflow-hidden sm:rounded-[2rem]">
      
      {/* Sidebar for Desktop/iPad */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 relative flex flex-col h-full overflow-hidden bg-transparent">
        <Header
          activeMember={activeMember}
          onOpenSpotlight={() => setIsSpotlightOpen(true)}
          onOpenDbInspector={() => setIsDbInspectorOpen(true)}
        />

        <main className="flex-1 overflow-y-auto px-3 sm:px-6 pt-4 pb-36 sm:pb-32 md:pb-12 scroll-smooth relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              {activeTab === 'today' && (
                <TodayView
                  onGoToItinerary={handleOpenDay}
                  onOpenTransport={handleOpenTransport}
                  onOpenAccommodation={handleOpenAccommodation}
                  onSelectWalkingTour={handleOpenWalkingTour}
                />
              )}
              {activeTab === 'itinerary' && (
                <ItineraryView
                  onOpenWalkingTour={handleOpenWalkingTour}
                  onOpenTransport={handleOpenTransport}
                  onOpenAccommodation={handleOpenAccommodation}
                />
              )}
              {activeTab === 'vouchers' && <VouchersView />}
              {activeTab === 'expenses' && <ExpensesView />}
              {activeTab === 'assistant' && <AssistantView />}
              {activeTab === 'settings' && <SettingsView />}
              {activeTab === 'transports' && <TransportsView initialTransportId={selectedTransportId} />}
              {activeTab === 'accommodations' && <AccommodationsView initialHotelId={selectedHotelId} />}
              {activeTab === 'tours' && <ToursListView onSelectTour={handleOpenWalkingTour} />}
              {activeTab === 'emergency' && <EmergencyView />}
              {activeTab === 'guide' && <GuideView />}
            </motion.div>
          </AnimatePresence>
        </main>

        <SmartFAB
          onOpenAddExpense={() => setActiveTab('expenses')}
          onOpenSpotlight={() => setIsSpotlightOpen(true)}
          onOpenAccommodations={() => setActiveTab('accommodations')}
          onOpenTransports={() => setActiveTab('transports')}
        />

        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <WalkingTourModal
        tour={selectedWalkingTour}
        onClose={() => setSelectedWalkingTour(null)}
      />

      <SpotlightSearch
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
        onSelectWalkingTour={handleOpenWalkingTour}
        onSelectTransport={handleOpenTransport}
        onSelectHotel={handleOpenAccommodation}
        onSelectDay={handleOpenDay}
      />

      <AdminDbInspectorModal
        isOpen={isDbInspectorOpen}
        onClose={() => setIsDbInspectorOpen(false)}
      />

      <PinPadLockScreen
        members={members}
        isOpen={isLockScreenOpen}
        onClose={() => setIsLockScreenOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <APIProvider apiKey={(import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || ''} libraries={['places', 'geometry']}>
      <TripStoreProvider>
        <div className="min-h-screen bg-transparent sm:p-4 flex justify-center items-center">
          {/* City Ambient Radial Glow Orbs (Global Background) */}
          <div className="fixed top-0 left-1/4 w-96 h-96 rounded-full blur-[140px] pointer-events-none opacity-40 -z-0 transition-colors duration-[1500ms]" style={{ backgroundColor: 'var(--city-glow)' }} />
          <div className="fixed bottom-0 right-1/4 w-96 h-96 rounded-full blur-[160px] pointer-events-none opacity-30 -z-0 transition-colors duration-[1500ms]" style={{ backgroundColor: 'var(--city-primary)' }} />
          
          <div className="relative z-10 w-full max-w-5xl">
            <MainApp />
          </div>
        </div>
      </TripStoreProvider>
    </APIProvider>
  );
}
