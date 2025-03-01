export type RealtimePayload = {
    new: Record<string, any>;
    old: Record<string, any>;
    eventType: 'INSERT' | 'UPDATE' | 'DELETE';
}; 