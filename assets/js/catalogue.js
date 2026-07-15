/*
 * Smart Mart product catalogue.
 *
 * This is the single source of truth for every product on the site. The listing
 * pages, the product pages and the reservation list all read from here, so
 * adding a sofa means adding one entry below and nothing else.
 *
 * Prices are in pounds. `was` is optional and shows a strikethrough sale price.
 *
 * Wrapped in an IIFE so these names stay out of the global scope — the three
 * scripts on each page share one global lexical scope, and would otherwise
 * collide.
 */
(() => {

const CATEGORIES = [
  { slug: 'sofas', name: 'Sofas', blurb: 'Two, three and four seaters for everyday family living.', banner: 'banner-sofas' },
  { slug: 'corner-sofas', name: 'Corner Sofas', blurb: 'Room-filling corner groups and chaise ends.', banner: 'banner-sofas' },
  { slug: 'recliners', name: 'Recliners', blurb: 'Reclining chairs and sets built for comfort.', banner: 'banner-sofas' },
  { slug: 'armchairs', name: 'Armchairs', blurb: 'Accent chairs to finish off a living room.', banner: 'banner-sofas' },
  { slug: 'beds', name: 'Beds', blurb: 'Bed frames and upholstered headboards.', banner: 'banner-beds' },
  { slug: 'mattresses', name: 'Mattresses', blurb: 'Pocket sprung, memory foam and orthopaedic.', banner: 'banner-beds' },
];

const SEAT_SIZES = [
  { name: '2 Seater', delta: -150 },
  { name: '3 Seater', delta: 0 },
  { name: '4 Seater', delta: 200 },
];

const BED_SIZES = [
  { name: 'Double', delta: 0 },
  { name: 'King', delta: 120 },
  { name: 'Super King', delta: 240 },
];

const MATTRESS_SIZES = [
  { name: 'Single', delta: -80 },
  { name: 'Double', delta: 0 },
  { name: 'King', delta: 100 },
  { name: 'Super King', delta: 190 },
];

const PRODUCTS = [
  {
    id: 'malvern-3-seater',
    name: 'Malvern 3 Seater Sofa',
    category: 'sofas',
    price: 899,
    was: 1299,
    badge: 'Showroom favourite',
    rating: 4.8,
    reviews: 64,
    stock: 'In stock at both showrooms',
    lead: 'Delivery in 2 to 3 weeks',
    summary: 'A deep-seated three seater with a soft brushed weave and a solid hardwood frame. The one people sit down on and stop looking.',
    detail: 'Wide, low arms and a generous seat depth make the Malvern the sofa most people end up choosing after they have tried everything else on the floor. The cushions are foam-wrapped fibre, so they hold their shape without feeling hard, and the frame is kiln-dried hardwood with a lifetime guarantee.',
    features: ['Kiln-dried hardwood frame', 'Foam-wrapped fibre cushions', 'Removable, washable covers', 'Lifetime frame guarantee'],
    dimensions: { width: 212, depth: 95, height: 88, seatHeight: 48 },
    sizes: SEAT_SIZES,
    colours: [
      { name: 'Charcoal', hex: '#4a4f57', image: 'malvern-charcoal' },
      { name: 'Sand', hex: '#c9ab84', image: 'malvern-sand' },
      { name: 'Teal', hex: '#3f6f6b', image: 'malvern-teal' },
    ],
  },
  {
    id: 'westgate-3-seater',
    name: 'Westgate 3 Seater Sofa',
    category: 'sofas',
    price: 749,
    was: 999,
    rating: 4.6,
    reviews: 41,
    stock: 'In stock in Newcastle',
    lead: 'Delivery in 2 to 3 weeks',
    summary: 'A neat, straight-backed sofa in a hard-wearing navy weave. Good for smaller rooms that still need three seats.',
    detail: 'Slimmer arms than the Malvern, so it seats three without eating the room. The back cushions are fixed, which means it keeps its shape with no plumping needed — a sensible choice for a busy house.',
    features: ['Fixed back cushions, no plumping', 'Slim arms save 14cm of width', 'Stain-resistant weave', '10 year frame guarantee'],
    dimensions: { width: 198, depth: 92, height: 86, seatHeight: 47 },
    sizes: SEAT_SIZES,
    colours: [
      { name: 'Navy', hex: '#38455f', image: 'westgate-sofa3-navy' },
    ],
  },
  {
    id: 'tyne-3-seater',
    name: 'Tyne 3 Seater Sofa',
    category: 'sofas',
    price: 849,
    was: 1149,
    badge: 'New in',
    rating: 4.7,
    reviews: 23,
    stock: 'In stock at both showrooms',
    lead: 'Delivery in 3 to 4 weeks',
    summary: 'Softly rounded and properly comfortable, in a velvet-touch fabric that does not mark easily.',
    detail: 'The Tyne is the one to look at if you want something a bit softer to look at than a boxy modern sofa. Rounded arms, plump cushions, and a velvet-touch finish that has held up well in the showroom.',
    features: ['Velvet-touch, low-mark fabric', 'Deep filled scatter cushions included', 'Solid timber legs', '10 year frame guarantee'],
    dimensions: { width: 205, depth: 94, height: 85, seatHeight: 46 },
    sizes: SEAT_SIZES,
    colours: [
      { name: 'Plum', hex: '#6a4a5e', image: 'tyne-sofa3-plum' },
      { name: 'Silver', hex: '#a8adb4', image: 'tyne-sofa3-silver' },
    ],
  },
  {
    id: 'stanley-3-seater',
    name: 'Stanley 3 Seater Sofa',
    category: 'sofas',
    price: 799,
    rating: 4.5,
    reviews: 30,
    stock: 'In stock in Blackpool',
    lead: 'Delivery in 2 weeks',
    summary: 'A classic mink three seater that suits almost any room. The safe choice, and there is nothing wrong with that.',
    detail: 'If you are furnishing a whole room and do not want to think too hard about it, the Stanley is the one. Neutral, well made, and it matches the Stanley corner sofa if you want the pair.',
    features: ['Matches the Stanley corner sofa', 'Neutral mink weave', 'Reversible seat cushions', '10 year frame guarantee'],
    dimensions: { width: 208, depth: 93, height: 87, seatHeight: 47 },
    sizes: SEAT_SIZES,
    colours: [
      { name: 'Mink', hex: '#8d7f77', image: 'stanley-sofa3-mink' },
    ],
  },
  {
    id: 'brampton-2-seater',
    name: 'Brampton 2 Seater Sofa',
    category: 'sofas',
    price: 599,
    was: 849,
    rating: 4.6,
    reviews: 38,
    stock: 'In stock at both showrooms',
    lead: 'Delivery in 2 weeks',
    summary: 'A compact two seater for flats, snugs and conservatories. Small footprint, full-size comfort.',
    detail: 'Under 160cm wide, so it gets through most doorways and up most stairs without a fight. Ask in store and we will check the access measurements with you before you commit.',
    features: ['Fits through a standard doorway', 'Compact 158cm width', 'Sprung seat base', '10 year frame guarantee'],
    dimensions: { width: 158, depth: 88, height: 84, seatHeight: 46 },
    sizes: [{ name: '2 Seater', delta: 0 }, { name: '3 Seater', delta: 150 }],
    colours: [
      { name: 'Moss', hex: '#5f6b4c', image: 'brampton-sofa2-moss' },
      { name: 'Oat', hex: '#cfc4b0', image: 'brampton-sofa2-oat' },
    ],
  },
  {
    id: 'byker-2-seater',
    name: 'Byker 2 Seater Sofa',
    category: 'sofas',
    price: 549,
    rating: 4.4,
    reviews: 19,
    stock: 'In stock in Newcastle',
    lead: 'Delivery in 2 weeks',
    summary: 'A warm rust two seater with a mid-century look and a price that does not sting.',
    detail: 'Tapered wooden legs and a snug two-seat frame. One of the better value pieces on the floor right now, and the colour lifts a plain room.',
    features: ['Tapered solid wood legs', 'Warm rust weave', 'Sprung seat base', '5 year frame guarantee'],
    dimensions: { width: 164, depth: 86, height: 82, seatHeight: 45 },
    sizes: [{ name: '2 Seater', delta: 0 }, { name: '3 Seater', delta: 140 }],
    colours: [
      { name: 'Rust', hex: '#a55f42', image: 'byker-sofa2-rust' },
    ],
  },
  {
    id: 'ashford-corner',
    name: 'Ashford Corner Sofa',
    category: 'corner-sofas',
    price: 1299,
    was: 1799,
    badge: 'Save £500',
    rating: 4.9,
    reviews: 87,
    stock: 'In stock at both showrooms',
    lead: 'Delivery in 3 to 4 weeks',
    summary: 'A big, comfortable corner group with a chaise end. Seats five without anyone perching on an arm.',
    detail: 'The Ashford is the sofa families come back for. The chaise end can be built left or right handed — tell us which way your room runs and we will order it the right way round. Comes with four scatter cushions.',
    features: ['Left or right handed chaise', 'Seats five comfortably', 'Four scatter cushions included', 'Lifetime frame guarantee'],
    dimensions: { width: 268, depth: 198, height: 88, seatHeight: 48 },
    sizes: [{ name: 'Left Hand Chaise', delta: 0 }, { name: 'Right Hand Chaise', delta: 0 }],
    colours: [
      { name: 'Slate', hex: '#5b6b7c', image: 'ashford-corner-slate' },
      { name: 'Mink', hex: '#8d7f77', image: 'ashford-corner-mink' },
    ],
  },
  {
    id: 'harlow-corner',
    name: 'Harlow Corner Sofa',
    category: 'corner-sofas',
    price: 1449,
    was: 1899,
    rating: 4.8,
    reviews: 52,
    stock: 'In stock in Blackpool',
    lead: 'Delivery in 4 weeks',
    summary: 'A deep, sink-in corner sofa with a storage footstool option. The one you will not want to get up from.',
    detail: 'Deeper seats than the Ashford, so it suits taller people and anyone who likes to properly stretch out. Add the matching storage footstool in store and we will do you a deal on the pair.',
    features: ['Extra-deep 104cm seats', 'Matching storage footstool available', 'Left or right handed', 'Lifetime frame guarantee'],
    dimensions: { width: 276, depth: 204, height: 90, seatHeight: 49 },
    sizes: [{ name: 'Left Hand Chaise', delta: 0 }, { name: 'Right Hand Chaise', delta: 0 }],
    colours: [
      { name: 'Navy', hex: '#38455f', image: 'harlow-corner-navy' },
      { name: 'Cream', hex: '#ddd2c2', image: 'harlow-corner-cream' },
    ],
  },
  {
    id: 'stanley-corner',
    name: 'Stanley Corner Sofa',
    category: 'corner-sofas',
    price: 1199,
    rating: 4.6,
    reviews: 34,
    stock: 'In stock in Newcastle',
    lead: 'Delivery in 3 weeks',
    summary: 'A charcoal corner group that matches the Stanley three seater. Do the room in one go.',
    detail: 'Straightforward, well built, and the same fabric as the Stanley sofa and armchair so you can furnish a whole living room without anything clashing.',
    features: ['Matches the Stanley range', 'Hard-wearing charcoal weave', 'Reversible seat cushions', '10 year frame guarantee'],
    dimensions: { width: 254, depth: 186, height: 86, seatHeight: 47 },
    sizes: [{ name: 'Left Hand Chaise', delta: 0 }, { name: 'Right Hand Chaise', delta: 0 }],
    colours: [
      { name: 'Charcoal', hex: '#4a4f57', image: 'stanley-corner-charcoal' },
    ],
  },
  {
    id: 'dalton-recliner',
    name: 'Dalton Reclining Chair',
    category: 'recliners',
    price: 649,
    was: 899,
    badge: 'Save £250',
    rating: 4.7,
    reviews: 71,
    stock: 'In stock at both showrooms',
    lead: 'Delivery in 2 weeks',
    summary: 'A manual reclining chair with a proper footrest and a high supportive back.',
    detail: 'One pull on the side lever and the footrest comes up. No cables, no battery, nothing to go wrong. The high back gives real support if you sit for long stretches, and the seat height suits people who find low chairs hard to get out of.',
    features: ['Manual lever recline, nothing electrical', 'High supportive back', 'Easy-rise 52cm seat height', '5 year mechanism guarantee'],
    dimensions: { width: 88, depth: 94, height: 106, seatHeight: 52 },
    sizes: [{ name: 'Manual Recline', delta: 0 }, { name: 'Powered Recline', delta: 200 }],
    colours: [
      { name: 'Rust', hex: '#a55f42', image: 'dalton-recliner-rust' },
      { name: 'Charcoal', hex: '#4a4f57', image: 'dalton-recliner-charcoal' },
    ],
  },
  {
    id: 'kingsley-recliner',
    name: 'Kingsley Reclining Chair',
    category: 'recliners',
    price: 729,
    rating: 4.8,
    reviews: 45,
    stock: 'In stock in Blackpool',
    lead: 'Delivery in 3 weeks',
    summary: 'A powered recliner with a lift-assist option. Ask about this one in store if getting up is the difficulty.',
    detail: 'The powered version rises to help you to your feet at the touch of a button. If that is the reason you are looking, come and try it — this is a chair worth sitting in before you decide, and we would rather you got the right one.',
    features: ['Powered recline as standard', 'Lift-assist rise option', 'Padded lumbar support', '5 year mechanism guarantee'],
    dimensions: { width: 90, depth: 96, height: 108, seatHeight: 53 },
    sizes: [{ name: 'Powered Recline', delta: 0 }, { name: 'Powered + Lift Assist', delta: 260 }],
    colours: [
      { name: 'Mink', hex: '#8d7f77', image: 'kingsley-recliner-mink' },
    ],
  },
  {
    id: 'jesmond-armchair',
    name: 'Jesmond Armchair',
    category: 'armchairs',
    price: 399,
    was: 549,
    rating: 4.5,
    reviews: 27,
    stock: 'In stock at both showrooms',
    lead: 'Delivery in 2 weeks',
    summary: 'An accent chair with a bit of colour about it. Finishes a room without taking it over.',
    detail: 'Comfortable enough to actually use, not just look at. The teal and rust both work well next to a neutral sofa if you want one thing in the room with some life in it.',
    features: ['Solid beech frame', 'Sprung seat', 'Foam-wrapped cushion', '5 year frame guarantee'],
    dimensions: { width: 84, depth: 86, height: 88, seatHeight: 46 },
    sizes: [{ name: 'Standard', delta: 0 }],
    colours: [
      { name: 'Teal', hex: '#3f6f6b', image: 'jesmond-armchair-teal' },
      { name: 'Rust', hex: '#a55f42', image: 'jesmond-armchair-rust' },
    ],
  },
  {
    id: 'fenham-armchair',
    name: 'Fenham Armchair',
    category: 'armchairs',
    price: 349,
    rating: 4.3,
    reviews: 16,
    stock: 'In stock in Newcastle',
    lead: 'Delivery in 2 weeks',
    summary: 'A soft cream armchair that goes with everything. Good value, easy to place.',
    detail: 'A simple, well-priced chair. If you need one more seat in the room and you do not want it shouting about itself, this is the one.',
    features: ['Solid beech frame', 'Neutral cream weave', 'Removable seat cushion', '5 year frame guarantee'],
    dimensions: { width: 82, depth: 84, height: 86, seatHeight: 45 },
    sizes: [{ name: 'Standard', delta: 0 }],
    colours: [
      { name: 'Cream', hex: '#ddd2c2', image: 'fenham-armchair-cream' },
    ],
  },
  {
    id: 'oakwood-bed',
    name: 'Oakwood Bed Frame',
    category: 'beds',
    price: 549,
    was: 749,
    badge: 'Save £200',
    rating: 4.7,
    reviews: 58,
    stock: 'In stock at both showrooms',
    lead: 'Delivery in 2 weeks',
    summary: 'An upholstered bed frame with a panelled headboard. Sprung slatted base included.',
    detail: 'The panelled headboard is deep-buttoned and comfortable to lean back against, which matters more than people expect. Comes with a sprung slatted base, so you only need a mattress on top.',
    features: ['Sprung slatted base included', 'Deep panelled headboard', 'Assembly available in store', '5 year frame guarantee'],
    dimensions: { width: 158, depth: 214, height: 122 },
    sizes: BED_SIZES,
    colours: [
      { name: 'Oat', hex: '#cfc4b0', image: 'oakwood-bed-oat' },
      { name: 'Charcoal', hex: '#4a4f57', image: 'oakwood-bed-charcoal' },
    ],
  },
  {
    id: 'seaton-bed',
    name: 'Seaton Bed Frame',
    category: 'beds',
    price: 499,
    rating: 4.5,
    reviews: 31,
    stock: 'In stock in Blackpool',
    lead: 'Delivery in 2 to 3 weeks',
    summary: 'A clean slate-grey frame with a low headboard. Good under a sloped ceiling or a window.',
    detail: 'The lower headboard is the point of this one — it sits under a window or a low ceiling where a tall frame would not. Sprung slatted base included.',
    features: ['Low 98cm headboard', 'Sprung slatted base included', 'Fits under most windows', '5 year frame guarantee'],
    dimensions: { width: 156, depth: 210, height: 98 },
    sizes: BED_SIZES,
    colours: [
      { name: 'Slate', hex: '#5b6b7c', image: 'seaton-bed-slate' },
    ],
  },
  {
    id: 'ravenswood-bed',
    name: 'Ravenswood Bed Frame',
    category: 'beds',
    price: 629,
    badge: 'New in',
    rating: 4.6,
    reviews: 12,
    stock: 'In stock in Newcastle',
    lead: 'Delivery in 3 weeks',
    summary: 'A tall plum velvet frame with a storage ottoman base. Lifts on gas struts.',
    detail: 'The whole base lifts on gas struts, so the space under the bed is usable storage rather than a dust trap. Worth seeing in person for the fabric alone.',
    features: ['Gas-strut ottoman storage base', 'Tall buttoned headboard', 'Velvet-touch fabric', '5 year frame guarantee'],
    dimensions: { width: 160, depth: 216, height: 132 },
    sizes: BED_SIZES,
    colours: [
      { name: 'Plum', hex: '#6a4a5e', image: 'ravenswood-bed-plum' },
    ],
  },
  {
    id: 'comfortrest-mattress',
    name: 'ComfortRest Mattress',
    category: 'mattresses',
    price: 299,
    was: 449,
    rating: 4.4,
    reviews: 96,
    stock: 'In stock at both showrooms',
    lead: 'Take home today',
    summary: 'A medium-feel pocket sprung mattress. The sensible everyday choice.',
    detail: 'A thousand pocket springs and a quilted top. Medium firmness, which suits most people most of the time. We keep these in stock, so you can take one home the same day.',
    features: ['1000 pocket springs', 'Medium feel', 'Quilted breathable top', '5 year guarantee'],
    dimensions: { depth: 24 },
    sizes: MATTRESS_SIZES,
    colours: [{ name: 'White', hex: '#e8e6e2', image: 'comfortrest-mattress' }],
    firmness: 'Medium',
  },
  {
    id: 'dreamweave-mattress',
    name: 'DreamWeave Memory Foam Mattress',
    category: 'mattresses',
    price: 399,
    rating: 4.6,
    reviews: 63,
    stock: 'In stock in Newcastle',
    lead: 'Take home today',
    summary: 'Memory foam over a pocket sprung base. Soft on top, supportive underneath.',
    detail: 'A memory foam layer on a sprung base gives you the sink-in feel without losing support. Sleeps a little warmer than the ComfortRest — worth knowing if you run hot.',
    features: ['Memory foam comfort layer', '1200 pocket sprung base', 'Medium-soft feel', '8 year guarantee'],
    dimensions: { depth: 27 },
    sizes: MATTRESS_SIZES,
    colours: [{ name: 'White', hex: '#e8e6e2', image: 'dreamweave-mattress' }],
    firmness: 'Medium-soft',
  },
  {
    id: 'orthocore-mattress',
    name: 'OrthoCore Orthopaedic Mattress',
    category: 'mattresses',
    price: 549,
    was: 699,
    badge: 'Firm support',
    rating: 4.7,
    reviews: 44,
    stock: 'In stock at both showrooms',
    lead: 'Delivery in 1 week',
    summary: 'A firm orthopaedic mattress for anyone who needs proper back support.',
    detail: 'Genuinely firm, not "firm-ish". If you have been told to sleep on a firm mattress, this is the one to try — but try it, because firm is not for everyone and we would rather you knew before you bought.',
    features: ['2000 pocket springs', 'Firm orthopaedic support', 'Reinforced edge support', '10 year guarantee'],
    dimensions: { depth: 29 },
    sizes: MATTRESS_SIZES,
    colours: [{ name: 'White', hex: '#e8e6e2', image: 'orthocore-mattress' }],
    firmness: 'Firm',
  },
  {
    id: 'cloudloft-mattress',
    name: 'CloudLoft Pillow Top Mattress',
    category: 'mattresses',
    price: 449,
    rating: 4.5,
    reviews: 37,
    stock: 'In stock in Blackpool',
    lead: 'Delivery in 1 week',
    summary: 'A soft pillow-top mattress with a plush quilted layer. The hotel-bed feel.',
    detail: 'The pillow top adds a soft layer over the springs, which is what gives hotel beds that feel. Softest mattress we stock — come and lie on it before you decide.',
    features: ['Plush pillow top layer', '1500 pocket springs', 'Soft feel', '8 year guarantee'],
    dimensions: { depth: 31 },
    sizes: MATTRESS_SIZES,
    colours: [{ name: 'White', hex: '#e8e6e2', image: 'cloudloft-mattress' }],
    firmness: 'Soft',
  },
];

/* ---- helpers ---- */

const imgPath = (slug) => `assets/images/products/${slug}.svg`;

// £ rather than a literal £, so prices survive being served without an
// explicit charset — a mis-decoded pound sign renders as "Â£" on every price.
const money = (n) => '\u00A3' + n.toLocaleString('en-GB');

const byId = (id) => PRODUCTS.find((p) => p.id === id);

const categoryBySlug = (slug) => CATEGORIES.find((c) => c.slug === slug);

const inCategory = (slug) => PRODUCTS.filter((p) => p.category === slug);

/** Cheapest price a product can be bought at, used for filtering and "from" prices. */
const priceFrom = (p) => p.price + Math.min(...p.sizes.map((s) => s.delta));

/** Price for a specific size of a product. */
const priceForSize = (p, sizeName) => {
  const size = p.sizes.find((s) => s.name === sizeName) || p.sizes[0];
  return p.price + size.delta;
};

const saving = (p) => (p.was ? p.was - p.price : 0);

window.SmartMart = { PRODUCTS, CATEGORIES, imgPath, money, byId, categoryBySlug, inCategory, priceFrom, priceForSize, saving };

})();
