export function generateUUID(): string {
  // Public Domain/MIT
  let d = new Date().getTime(); // Use timestamp for first part
  let d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0; // Use performance counter if available
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random() * 16; // Random hexadecimal digit
    if (d > 0) { // Use timestamp bits for better randomness
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else { // Use performance counter bits
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
} 