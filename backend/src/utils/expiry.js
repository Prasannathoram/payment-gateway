export function validExpiry(m, y) {
  m = parseInt(m);
  y = y.length === 2 ? 2000 + parseInt(y) : parseInt(y);
  const now = new Date();
  return y > now.getFullYear() || (y === now.getFullYear() && m >= now.getMonth()+1);
}
