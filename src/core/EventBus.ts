/**
 * PROJECT NEXUS // CORE EVENT BUS
 * Responsibility: Global publish/subscribe event system for decoupled inter-system
 * communication. Eliminates React prop drilling and unnecessary coupling between
 * managers. All systems communicate through typed events on this bus.
 *
 * Usage:
 *   EventBus.on("camera:transition:start", handler);
 *   EventBus.emit("camera:transition:start", { from: "well-vault", to: "kinetic-forge" });
 *   EventBus.off("camera:transition:start", handler);
 */

type EventHandler<T = unknown> = (payload: T) => void;

interface EventEntry {
  handler: EventHandler;
  once: boolean;
}

class EventBusImpl {
  private listeners = new Map<string, EventEntry[]>();

  /**
   * Subscribe to a named event. The handler will be called each time the event fires.
   */
  public on<T = unknown>(event: string, handler: EventHandler<T>): void {
    const entries = this.listeners.get(event) || [];
    entries.push({ handler: handler as EventHandler, once: false });
    this.listeners.set(event, entries);
  }

  /**
   * Subscribe to a named event for a single invocation. Auto-unsubscribes after first fire.
   */
  public once<T = unknown>(event: string, handler: EventHandler<T>): void {
    const entries = this.listeners.get(event) || [];
    entries.push({ handler: handler as EventHandler, once: true });
    this.listeners.set(event, entries);
  }

  /**
   * Unsubscribe a specific handler from a named event.
   */
  public off<T = unknown>(event: string, handler: EventHandler<T>): void {
    const entries = this.listeners.get(event);
    if (!entries) return;
    this.listeners.set(
      event,
      entries.filter((entry) => entry.handler !== handler)
    );
  }

  /**
   * Emit a named event, invoking all registered handlers with the provided payload.
   * One-time listeners are removed after invocation.
   */
  public emit<T = unknown>(event: string, payload?: T): void {
    const entries = this.listeners.get(event);
    if (!entries) return;

    const remaining: EventEntry[] = [];
    for (const entry of entries) {
      entry.handler(payload);
      if (!entry.once) {
        remaining.push(entry);
      }
    }
    this.listeners.set(event, remaining);
  }

  /**
   * Remove all listeners for a specific event, or all events if no name is provided.
   */
  public clear(event?: string): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Returns the count of listeners registered for a given event.
   */
  public listenerCount(event: string): number {
    return this.listeners.get(event)?.length ?? 0;
  }
}

/**
 * Singleton EventBus instance shared across the entire application.
 */
export const EventBus = new EventBusImpl();
