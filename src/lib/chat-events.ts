/** Lets any component (e.g. the trip planner's confirmation) open the site chat. */
export const OPEN_CHAT_EVENT = "chat:open";

export function openChat() {
  window.dispatchEvent(new Event(OPEN_CHAT_EVENT));
}
