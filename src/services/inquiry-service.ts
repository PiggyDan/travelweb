import { api, ApiError } from "@/lib/api";
import type { InquiryPayload, SubmissionResult, TripPlannerRequest, TripPlanResult } from "@/types/inquiry";

/**
 * Inquiry / planner submission service.
 *
 * Trip plans are saved by the FastAPI backend, which also opens a chat for
 * the traveller. Inquiries and the newsletter are not wired up yet, so those
 * functions do NOT pretend to send data: they return `unavailable` and the UI
 * says so honestly.
 */

export async function submitInquiry(payload: InquiryPayload): Promise<SubmissionResult> {
  void payload;
  return {
    status: "unavailable",
    message: "Online enquiries open soon. In the meantime, please email us directly.",
  };
}

export async function submitTripPlan(request: TripPlannerRequest): Promise<TripPlanResult> {
  try {
    const result = await api<{ reference: string; conversationId: number }>("/trip-plans", { body: request });
    return { status: "accepted", ...result };
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) {
      return { status: "invalid", message: error.message, fieldErrors: error.fieldErrors };
    }
    return {
      status: "unavailable",
      message: error instanceof ApiError ? error.message : "Something went wrong. Please try again.",
    };
  }
}

export async function subscribeToNewsletter(email: string): Promise<SubmissionResult> {
  void email;
  return {
    status: "unavailable",
    message: "Our newsletter launches soon — thank you for your interest.",
  };
}
