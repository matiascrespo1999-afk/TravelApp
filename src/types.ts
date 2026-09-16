export type CityCode = 'ROMA' | 'LONDRES' | 'OXFORD' | 'BARCELONA' | 'GIRONA' | 'MADRID' | 'TOLEDO' | 'TRANSITO' | string;

export type Role = 'ADMIN' | 'TRAVELER' | 'GUEST';

export interface Destination {
  id: string;
  code: string;
  name: string;
  country: string;
  currency: string;
  timezone: string;
  coordinates: { lat: number; lng: number };
  gradientStops: string[];
  flagEmoji: string;
}

export type CityDestination = Destination;

export interface TripMember {
  id: string;
  uid: string;
  name: string;
  role: 'ADMIN' | 'TRAVELER';
  pin: string;
  color: string;
  email?: string;
  alertEmails?: string[];
  initialBalanceUSD?: number;
}

export type Member = TripMember;

export interface Trip {
  id: string;
  name: string;
  title?: string;
  startDate: string;
  endDate: string;
  baseCurrency: string;
  rates: { [key: string]: number };
  driveFolderUrl: string;
  preTripTotals?: {
    matiasUsd: number;
    arielUsd: number;
    totalUsd: number;
  };
  preTripMatiasUSD?: number;
  preTripAriUSD?: number;
  destinations?: Destination[];
  createdAt?: number;
  updatedAt?: number;
}

export interface Accommodation {
  id: string;
  cityCode: string;
  cityName?: string;
  name: string;
  address: string;
  doorPin: string | null;
  keyboxPin?: string | null;
  reservationCode?: string;
  bookingCode?: string;
  checkInInstructions?: string;
  instructions?: string;
  checkInTime?: string;
  checkOutTime?: string;
  touristTaxEUR?: number | null;
  hasLuggageStorage?: boolean;
  mapsUrl: string;
  supermarketsUrl?: string;
  supermarketTips?: string;
  supermarketNear?: string;
  updatedAt?: number;
}

export interface TicketItem {
  travelerId: string;
  name: string;
  travelerName?: string;
  pnr: string;
  baggage: string;
  seat?: string;
  status?: string;
  boardingPassUrl?: string;
}

export type TravelerTicket = TicketItem;

export interface Transport {
  id: string;
  dayIndex?: number;
  dayNumber?: number;
  type: 'FLIGHT' | 'TRAIN' | 'BUS' | 'TRANSFER' | string;
  company: string;
  flightNumber?: string;
  number?: string;
  route?: string;
  routeTitle?: string;
  departureCity?: string;
  arrivalCity?: string;
  originCity?: string;
  destCity?: string;
  originCode?: string;
  destCode?: string;
  departureTime?: string;
  arrivalTime?: string;
  depTime?: string;
  arrTime?: string;
  arrivalNote?: string;
  checkinUrl?: string | null;
  checkinAvailable?: boolean;
  flightStatus?: 'ON_TIME' | 'BOARDING' | 'DELAYED' | 'SCHEDULED' | string;
  pnrDisplay?: string;
  baggage?: string;
  ticketDriveUrl?: string;
  tickets?: TicketItem[];
  passengers?: TicketItem[];
  updatedAt?: number;
}

export interface Voucher {
  id: string;
  title: string;
  type: string;
  city?: string;
  cityCode?: string;
  cityName?: string;
  date?: string;
  datetime?: string;
  code: string;
  detail?: string;
  description?: string;
  link?: string;
  driveUrl?: string;
  btnText?: string;
  buttonText?: string;
  maps?: string;
  mapsUrl?: string;
  updatedAt?: number;
}

export interface ExpenseSplit {
  userId: string;
  assignedUsdAmount: number;
  percentage?: number;
  splitPercentage?: number;
}

export interface Expense {
  id: string;
  tripId?: string;
  date?: string;
  expenseDate?: string;
  city?: string;
  cityCode?: string;
  category: string;
  title?: string;
  desc?: string;
  description?: string;
  paidByUserId?: string;
  paidByUid?: string;
  payer?: string;
  split?: string;
  splitModeId?: string;
  currency?: string;
  curr?: string;
  amount?: number;
  amountUSD?: number;
  originalAmount?: number;
  originalCurrency?: string;
  realUsdAmount?: number;
  calculatedUsdAmount?: number;
  chargeMatias?: number;
  chargeAri?: number;
  splits?: ExpenseSplit[];
  splitAmongUids?: string[];
  notes?: string;
  payMethod?: string;
  paymentMethod?: string;
  createdAt?: number;
  updatedAt?: number;
  receiptUrl?: string;
  rate?: number;
  fxRateToUSD?: number;
}

export interface Settlement {
  id: string;
  date: string;
  fromUserId: string;
  toUserId: string;
  amountUSD: number;
  method: string;
  createdAt: number;
  notes?: string;
}

export interface WalkingTourStop {
  num: number;
  name: string;
  roomOrHall?: string;
  direction: string;
  mustSeeArtwork?: string;
  description: string;
  trivia?: string;
  photoAllowed?: boolean;
  photoAngle?: string;
  visualCue?: string;
  mapsUrl?: string;
  nextStep?: string;
  lat?: number;
  lng?: number;
  orientation?: string;
}

export type TourStop = WalkingTourStop;

export interface WalkingTour {
  id: string;
  title: string;
  cityCode: string;
  duration: string;
  distance: string;
  pace: string;
  fullMapsUrl?: string;
  mapsRouteUrl1?: string;
  mapsRouteUrl2?: string;
  tip?: string;
  routeTip?: string;
  rec?: string;
  veggieRecommendation?: string;
  wc?: string;
  publicWc?: string;
  tourType?: string;
  attractionName?: string;
  dressCode?: string;
  stops: WalkingTourStop[];
  updatedAt?: number;
}

export type Tour = WalkingTour;

export interface MonumentStep {
  id: string;
  activityId: string;
  stepNumber: number;
  title: string;
  lookFor: string;
  recommendedTime: string;
  trivia: string;
  physicalIndication: string;
}

export interface Activity {
  id: string;
  dayIndex: number;
  dayNumber?: number;
  cityCode: string;
  time: string;
  timeSlot?: string;
  startTime?: string;
  endTime?: string;
  type: string;
  title: string;
  description: string;
  orientationMilestone?: string;
  transportSuggested?: string;
  superVeggieTip?: string;
  nearestWc?: string;
  safetyAlert?: string;
  mapsUrl?: string;
  voucherId?: string | null;
  voucherUrl?: string | null;
  tourId?: string | null;
  walkingTourId?: string | null;
  internalTourId?: string | null;
  duration?: string;
  ticketCost?: string;
  reservationStatus?: string;
  ticketingNotes?: string;
  popCultureTrivia?: string;
  isFixed?: boolean;
  isHardDeadline?: boolean;
  locationName?: string;
  notes?: string;
  updatedAt?: number;
}

export interface DayItinerary {
  id: string;
  day: number;
  dayIndex: number;
  date: string;
  dateLabel: string;
  cityCode: string;
  city: string;
  title: string;
  dayTitle?: string;
  alerts: string;
  clothes: string;
  timezone?: string;
  transportId?: string;
  accommodationId?: string;
  activities?: Activity[];
  updatedAt?: number;
}

export type ItineraryDay = DayItinerary;
