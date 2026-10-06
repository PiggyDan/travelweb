/** Chat and admin shapes, mirroring backend/app/schemas.py. */

/** `assistant` is the AI chat assistant, answering for the company. */
export type MessageSender = "customer" | "admin" | "assistant" | "system";

/** A tour card the assistant attached to its reply. */
export interface TourAttachment {
  slug: string;
  title: string;
  region: string;
  durationDays: number;
  priceFrom: string;
  /** Localized tour page path. */
  url: string;
  image: string;
}

export interface ChatMessage {
  id: number;
  sender: MessageSender;
  /** Staff member's name on admin replies. */
  authorName: string | null;
  body: string;
  attachment: TourAttachment | null;
  /** ISO timestamp (UTC). */
  createdAt: string;
}

/** The visitor's own conversation. */
export interface CustomerConversation {
  id: number;
  customerName: string;
  tripReference: string | null;
  unreadCount: number;
  /** The AI assistant is writing a reply. */
  assistantTyping: boolean;
  messages: ChatMessage[];
}

export interface AdminConversationSummary {
  id: number;
  customerName: string;
  customerEmail: string;
  tripPlanId: number | null;
  tripReference: string | null;
  lastMessageAt: string;
  lastMessage: ChatMessage | null;
  unreadCount: number;
  /** The AI assistant replies in this conversation. */
  aiEnabled: boolean;
  aiPending: boolean;
}

export interface AdminConversation extends AdminConversationSummary {
  messages: ChatMessage[];
}

export type TripPlanStatus = "new" | "contacted" | "quoted" | "booked" | "closed";

export interface TripPlanSummary {
  id: number;
  reference: string;
  status: TripPlanStatus;
  fullName: string;
  email: string;
  country: string | null;
  startDate: string | null;
  days: number;
  adults: number;
  children: number;
  budget: string;
  createdAt: string;
  conversationId: number | null;
  unreadCount: number;
}

export interface TripPlanDetail extends TripPlanSummary {
  phone: string | null;
  message: string | null;
  endDate: string | null;
  interests: string[];
  destinations: string[];
  activityLevel: string;
  accommodationStyle: string;
  tourType: string | null;
  adminNotes: string | null;
  updatedAt: string;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
}

export interface AdminSummary {
  newTripPlans: number;
  unreadConversations: number;
}
