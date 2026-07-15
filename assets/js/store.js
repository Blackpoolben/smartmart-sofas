/*
 * The customer's list of items.
 *
 * Smart Mart does not take money online — everything is confirmed and paid for
 * in the showroom. So this behaves exactly like a shopping basket (add, remove,
 * change quantity, running total) but ends in a reservation rather than a
 * checkout.
 *
 * MODE is the switch. Set it to 'basket' and the wording changes to
 * add-to-basket / checkout throughout the site, and the checkout button appears
 * on the list page. Wiring that button to a real payment provider is then the
 * only work left — no rewrite of the product pages or the data.
 */

(() => {

const MODE = 'reserve'; // 'reserve' | 'basket'

const WORDING = {
  reserve: {
    add: 'Reserve in showroom',
    added: 'Reserved',
    listName: 'Reservation list',
    listNameShort: 'Reservations',
    empty: 'You have not reserved anything yet.',
    action: 'Take this list to the showroom',
    total: 'Estimated total',
  },
  basket: {
    add: 'Add to basket',
    added: 'In basket',
    listName: 'Your basket',
    listNameShort: 'Basket',
    empty: 'Your basket is empty.',
    action: 'Proceed to checkout',
    total: 'Subtotal',
  },
};

const KEY = 'smartmart.list.v1';

const read = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const write = (items) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* private browsing, or storage full — the list just will not persist */
  }
  document.dispatchEvent(new CustomEvent('smartmart:list-changed', { detail: { items } }));
};

/** Two lines are the same line only if product, colour and size all match. */
const sameLine = (a, b) => a.id === b.id && a.colour === b.colour && a.size === b.size;

const Store = {
  MODE,
  words: WORDING[MODE],

  items: () => read(),

  count: () => read().reduce((n, item) => n + item.qty, 0),

  /** Running total, priced through the catalogue so a stale saved list cannot show a stale price. */
  total() {
    return read().reduce((sum, item) => {
      const product = window.SmartMart.byId(item.id);
      if (!product) return sum;
      return sum + window.SmartMart.priceForSize(product, item.size) * item.qty;
    }, 0);
  },

  add(id, colour, size, qty = 1) {
    const items = read();
    const line = { id, colour, size, qty };
    const existing = items.find((item) => sameLine(item, line));
    if (existing) existing.qty += qty;
    else items.push(line);
    write(items);
  },

  setQty(index, qty) {
    const items = read();
    if (!items[index]) return;
    if (qty <= 0) items.splice(index, 1);
    else items[index].qty = qty;
    write(items);
  },

  remove(index) {
    const items = read();
    items.splice(index, 1);
    write(items);
  },

  clear: () => write([]),

  /** True if this exact product/colour/size is already on the list. */
  has(id, colour, size) {
    return read().some((item) => sameLine(item, { id, colour, size }));
  },
};

window.SmartMartStore = Store;

})();
