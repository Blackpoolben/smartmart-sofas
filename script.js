/*
 * Page behaviour for the whole site.
 *
 * Each page runs whichever init functions apply to it (home / listing /
 * product / reservation list) — they no-op if their markup is not present.
 * Everything reads its data from catalogue.js, so adding a product needs no
 * changes here.
 */

(() => {

const { PRODUCTS, CATEGORIES, imgPath, money, byId, categoryBySlug, inCategory, priceFrom, priceForSize, saving } = window.SmartMart;
const Store = window.SmartMartStore;

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const param = (name) => new URLSearchParams(location.search).get(name);

/* ---------- shared chrome ---------- */

function stars(rating, reviews) {
  const full = Math.round(rating);
  return `<span class="stars"><span class="star-fill">${'★'.repeat(full)}${'☆'.repeat(5 - full)}</span> ${rating} (${reviews})</span>`;
}

function syncListCount() {
  const count = Store.count();
  $$('[data-list-count]').forEach((el) => {
    el.textContent = count;
    el.hidden = count === 0;
  });
}

function toast(message, linkText, linkHref) {
  let el = $('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    document.body.append(el);
  }
  el.innerHTML = `<span>${esc(message)}</span>${linkHref ? `<a href="${linkHref}">${esc(linkText)}</a>` : ''}`;
  requestAnimationFrame(() => el.classList.add('show'));
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), 4000);
}

function initChrome() {
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  const toggle = $('.menu-toggle');
  const nav = $('.cat-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // The header button reads "Reservations" or "Basket" depending on Store.MODE.
  $$('[data-list-label]').forEach((el) => { el.textContent = Store.words.listNameShort; });

  syncListCount();
  document.addEventListener('smartmart:list-changed', syncListCount);
}

/* ---------- product card ---------- */

function productCard(p) {
  const from = priceFrom(p);
  const hasRange = p.sizes.length > 1;
  const save = saving(p);
  // The card quotes the cheapest size, so the "was" price has to be the old
  // price of that same size — otherwise the saving on show does not add up.
  const wasFrom = p.was ? p.was + (from - p.price) : 0;
  const swatches = p.colours.slice(0, 4)
    .map((c) => `<span class="swatch" style="background:${c.hex}" title="${esc(c.name)}"></span>`).join('');
  const more = p.colours.length > 4 ? `<span class="swatch-more">+${p.colours.length - 4}</span>` : '';

  return `
    <a class="product-card" href="product.html?id=${encodeURIComponent(p.id)}">
      <div class="product-media">
        <img src="${imgPath(p.colours[0].image)}" alt="${esc(p.name)} in ${esc(p.colours[0].name)}" loading="lazy" width="800" height="600">
        ${p.badge ? `<span class="product-badge${save ? '' : ' quiet'}">${esc(p.badge)}</span>` : ''}
      </div>
      <div class="product-body">
        <h3>${esc(p.name)}</h3>
        <p class="blurb">${esc(p.summary)}</p>
        ${stars(p.rating, p.reviews)}
        <div class="swatches">${swatches}${more}</div>
        <div class="price-row">
          ${hasRange ? '<span class="price-from">from</span>' : ''}
          <span class="price">${money(from)}</span>
          ${p.was ? `<span class="price-was">${money(wasFrom)}</span><span class="price-save">Save ${money(save)}</span>` : ''}
        </div>
      </div>
    </a>`;
}

/* ---------- home ---------- */

function initHome() {
  const catGrid = $('[data-cat-grid]');
  if (catGrid) {
    catGrid.innerHTML = CATEGORIES.map((c) => `
      <a class="cat-tile" href="shop.html?cat=${c.slug}">
        <img src="${imgPath(inCategory(c.slug)[0].colours[0].image)}" alt="${esc(c.name)}" loading="lazy" width="800" height="600">
        <span class="cat-label">
          <strong>${esc(c.name)}</strong>
          <span>${inCategory(c.slug).length} in the range</span>
        </span>
      </a>`).join('');
  }

  const deals = $('[data-deals]');
  if (deals) {
    deals.innerHTML = PRODUCTS.filter((p) => p.was)
      .sort((a, b) => saving(b) - saving(a))
      .slice(0, 4)
      .map(productCard).join('');
  }

  const fresh = $('[data-new-in]');
  if (fresh) {
    const newest = PRODUCTS.filter((p) => p.badge === 'New in');
    fresh.innerHTML = newest
      .concat(PRODUCTS.filter((p) => p.badge !== 'New in').sort((a, b) => b.rating - a.rating))
      .slice(0, 4)
      .map(productCard).join('');
  }
}

/* ---------- listing ---------- */

const PRICE_BANDS = [
  { name: 'Under £500', test: (p) => priceFrom(p) < 500 },
  { name: '£500 to £799', test: (p) => priceFrom(p) >= 500 && priceFrom(p) < 800 },
  { name: '£800 to £1,199', test: (p) => priceFrom(p) >= 800 && priceFrom(p) < 1200 },
  { name: '£1,200 and over', test: (p) => priceFrom(p) >= 1200 },
];

const SORTS = {
  featured: (a, b) => (b.rating * b.reviews) - (a.rating * a.reviews),
  'price-low': (a, b) => priceFrom(a) - priceFrom(b),
  'price-high': (a, b) => priceFrom(b) - priceFrom(a),
  rating: (a, b) => b.rating - a.rating,
  saving: (a, b) => saving(b) - saving(a),
};

function initListing() {
  const root = $('[data-listing]');
  if (!root) return;

  const slug = param('cat');
  const onSale = param('sale') === '1';
  const category = slug ? categoryBySlug(slug) : null;

  // Everything on the page derives from this pool: one category, the sale, or the lot.
  const pool = category ? inCategory(slug) : onSale ? PRODUCTS.filter((p) => p.was) : PRODUCTS;

  const heading = onSale ? 'Sale' : category ? category.name : 'Everything in store';
  const blurb = onSale
    ? 'Everything with money off right now, across both showrooms.'
    : category ? category.blurb
    : 'The full range across Blackpool and Newcastle. Filter it down here, then come and sit on it.';
  const banner = category ? category.banner : 'banner-sofas';

  $('[data-cat-heading]').textContent = heading;
  $('[data-cat-blurb]').textContent = blurb;
  $('[data-cat-banner]').src = imgPath(banner);
  $('[data-cat-banner]').alt = heading;
  $('[data-crumb-here]').textContent = heading;
  document.title = `${heading} — Smart Mart Sofas, Beds & Mattresses`;

  $$('.cat-nav a').forEach((a) => {
    const current = onSale ? a.dataset.nav === 'sale' : a.dataset.nav === slug;
    if (current) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });

  // Colours present in this pool, deduped by name.
  const colours = [...new Map(pool.flatMap((p) => p.colours).map((c) => [c.name, c])).values()]
    .sort((a, b) => a.name.localeCompare(b.name));

  const state = { price: new Set(), colour: new Set(), sale: onSale, stocked: false, sort: 'featured' };

  const matches = (p) =>
    (!state.price.size || [...state.price].some((n) => PRICE_BANDS.find((b) => b.name === n).test(p))) &&
    (!state.colour.size || p.colours.some((c) => state.colour.has(c.name))) &&
    (!state.sale || Boolean(p.was)) &&
    (!state.stocked || /both showrooms/i.test(p.stock));

  const tally = (test) => pool.filter(test).length;

  const opt = (group, value, label, count, dot) => `
    <label class="filter-opt">
      <input type="checkbox" data-filter="${group}" value="${esc(value)}">
      ${dot ? `<span class="chip-dot" style="background:${dot}"></span>` : ''}
      <span>${esc(label)}</span>
      <span class="tally">${count}</span>
    </label>`;

  $('[data-filters]').innerHTML = `
    <div class="filter-group">
      <strong>Price</strong>
      ${PRICE_BANDS.map((b) => opt('price', b.name, b.name, tally(b.test))).join('')}
    </div>
    <div class="filter-group">
      <strong>Colour</strong>
      ${colours.map((c) => opt('colour', c.name, c.name, tally((p) => p.colours.some((x) => x.name === c.name)), c.hex)).join('')}
    </div>
    <div class="filter-group">
      <strong>Show me</strong>
      ${opt('sale', '1', 'On offer', tally((p) => Boolean(p.was)))}
      ${opt('stocked', '1', 'In both showrooms', tally((p) => /both showrooms/i.test(p.stock)))}
    </div>`;

  if (onSale) {
    // The sale page is already filtered to the sale — the box shows why, but cannot be unticked.
    const saleBox = $('[data-filter="sale"]');
    saleBox.checked = true;
    saleBox.disabled = true;
  }

  const grid = $('[data-product-grid]');
  const count = $('[data-result-count]');

  function render() {
    const results = pool.filter(matches).sort(SORTS[state.sort]);
    count.innerHTML = `<strong>${results.length}</strong> ${results.length === 1 ? 'product' : 'products'}`;
    grid.innerHTML = results.length
      ? results.map(productCard).join('')
      : `<div class="empty-state">
           <h3>Nothing matches that combination</h3>
           <p>Loosen a filter, or ring the showroom and ask — stock moves faster than this page does.</p>
         </div>`;
  }

  $('[data-filters]').addEventListener('change', (e) => {
    const box = e.target.closest('[data-filter]');
    if (!box) return;
    const group = box.dataset.filter;
    if (group === 'sale' || group === 'stocked') state[group] = box.checked;
    else if (box.checked) state[group].add(box.value);
    else state[group].delete(box.value);
    render();
  });

  $('[data-sort]').addEventListener('change', (e) => {
    state.sort = e.target.value;
    render();
  });

  const filterToggle = $('.filter-toggle');
  if (filterToggle) {
    filterToggle.addEventListener('click', () => {
      const open = $('.filters').classList.toggle('open');
      filterToggle.textContent = open ? 'Hide filters' : 'Filters';
    });
  }

  render();
}

/* ---------- product detail ---------- */

function initProduct() {
  const root = $('[data-pdp]');
  if (!root) return;

  const product = byId(param('id'));
  if (!product) {
    root.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <h3>We could not find that one</h3>
      <p>It may have sold through. <a href="shop.html">Have a look at what is in stock</a>.</p>
    </div>`;
    return;
  }

  document.title = `${product.name} — Smart Mart`;
  const meta = $('meta[name="description"]');
  if (meta) meta.content = product.summary;

  let colour = product.colours[0];
  let size = product.sizes.find((s) => s.delta === 0) || product.sizes[0];

  const cat = categoryBySlug(product.category);
  $('[data-crumb-cat]').textContent = cat.name;
  $('[data-crumb-cat]').href = `shop.html?cat=${cat.slug}`;
  $('[data-crumb-here]').textContent = product.name;

  $$('.cat-nav a').forEach((a) => {
    if (a.dataset.nav === product.category) a.setAttribute('aria-current', 'page');
  });

  const dims = product.dimensions;
  const specRows = [
    dims.width && ['Width', `${dims.width} cm`],
    dims.depth && ['Depth', `${dims.depth} cm`],
    dims.height && ['Height', `${dims.height} cm`],
    dims.seatHeight && ['Seat height', `${dims.seatHeight} cm`],
    product.firmness && ['Firmness', product.firmness],
    ['Availability', product.stock],
    ['Delivery', product.lead],
  ].filter(Boolean);

  const optionLabel = product.category === 'corner-sofas' || product.category === 'recliners' ? 'Option' : 'Size';

  root.innerHTML = `
    <div class="pdp-gallery">
      <div class="pdp-main">
        <img data-hero src="${imgPath(colour.image)}" alt="${esc(product.name)} in ${esc(colour.name)}" width="800" height="600">
      </div>
      ${product.colours.length > 1 ? `
        <div class="pdp-thumbs">
          ${product.colours.map((c, i) => `
            <button type="button" data-thumb="${i}" aria-current="${i === 0}" aria-label="View in ${esc(c.name)}">
              <img src="${imgPath(c.image)}" alt="" width="800" height="600">
            </button>`).join('')}
        </div>` : ''}
    </div>

    <div class="pdp-info">
      ${product.badge ? `<span class="flag${product.was ? '' : ' flag-quiet'}">${esc(product.badge)}</span>` : ''}
      <h1>${esc(product.name)}</h1>
      <div style="margin-top:10px">${stars(product.rating, product.reviews)}</div>

      <div class="pdp-price">
        <span class="price" data-price>${money(product.price)}</span>
        ${product.was ? `<span class="price-was">${money(product.was)}</span><span class="price-save">Save ${money(saving(product))}</span>` : ''}
      </div>
      <p class="muted" style="font-size:0.86rem">${esc(product.stock)} · ${esc(product.lead)}</p>

      <p class="pdp-summary">${esc(product.summary)}</p>

      <div class="opt-group">
        <div class="opt-label">Colour <span class="opt-value" data-colour-name>${esc(colour.name)}</span></div>
        <div class="opt-row">
          ${product.colours.map((c, i) => `
            <button type="button" class="colour-opt" data-colour="${i}" aria-pressed="${i === 0}" aria-label="${esc(c.name)}" title="${esc(c.name)}">
              <span style="background:${c.hex}"></span>
            </button>`).join('')}
        </div>
      </div>

      <div class="opt-group">
        <div class="opt-label">${optionLabel} <span class="opt-value" data-size-name>${esc(size.name)}</span></div>
        <div class="opt-row">
          ${product.sizes.map((s) => `
            <button type="button" class="size-opt" data-size="${esc(s.name)}" aria-pressed="${s.name === size.name}">
              ${esc(s.name)}${s.delta ? `<span class="size-delta">${s.delta > 0 ? '+' : '−'}${money(Math.abs(s.delta))}</span>` : ''}
            </button>`).join('')}
        </div>
      </div>

      <div class="pdp-actions">
        <button type="button" class="btn btn-primary btn-lg" data-add>${esc(Store.words.add)}</button>
        <a class="btn btn-outline btn-lg" href="stores.html">Ask a question</a>
      </div>

      <div class="reassure">
        <div><span class="tick">✓</span><span><strong>No money changes hands online.</strong> Reserve it here, then see it, sit on it, and pay in the showroom.</span></div>
        <div><span class="tick">✓</span><span>Held for seven days, free. No deposit, no card details, ever.</span></div>
        <div><span class="tick">✓</span><span>Bring your room measurements and we will check it fits before you commit.</span></div>
      </div>

      <div class="pdp-tabs">
        <details class="pdp-tab" open>
          <summary>About this one</summary>
          <div class="tab-body">
            <p>${esc(product.detail)}</p>
            <ul style="margin-top:14px">${product.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
          </div>
        </details>
        <details class="pdp-tab">
          <summary>Dimensions &amp; specification</summary>
          <div class="tab-body">
            <table class="spec-table">
              <tbody>
                ${specRows.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}
              </tbody>
            </table>
            <p style="margin-top:14px" class="muted">Measure your doorways and stairs before you order. If you are not sure, tell us the access and we will work it out with you.</p>
          </div>
        </details>
        <details class="pdp-tab">
          <summary>Delivery &amp; collection</summary>
          <div class="tab-body">
            <p>Free delivery across the Fylde coast from Blackpool, and across Tyneside from the Newcastle store. Further out, ask us and we will price it honestly.</p>
            <p style="margin-top:10px">Collect free from either showroom if you have the van for it.</p>
          </div>
        </details>
      </div>
    </div>`;

  const hero = $('[data-hero]', root);
  const priceEl = $('[data-price]', root);
  const addBtn = $('[data-add]', root);

  function repaint() {
    hero.src = imgPath(colour.image);
    hero.alt = `${product.name} in ${colour.name}`;
    $('[data-colour-name]', root).textContent = colour.name;
    $('[data-size-name]', root).textContent = size.name;
    priceEl.textContent = money(priceForSize(product, size.name));
    $$('[data-thumb]', root).forEach((b) => {
      b.setAttribute('aria-current', String(product.colours[+b.dataset.thumb].name === colour.name));
    });
    $$('[data-colour]', root).forEach((b) => {
      b.setAttribute('aria-pressed', String(product.colours[+b.dataset.colour].name === colour.name));
    });
    $$('[data-size]', root).forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.size === size.name));
    });
    addBtn.textContent = Store.has(product.id, colour.name, size.name)
      ? `${Store.words.added} ✓`
      : Store.words.add;
  }

  root.addEventListener('click', (e) => {
    const thumb = e.target.closest('[data-thumb]');
    const swatch = e.target.closest('[data-colour]');
    const sizeBtn = e.target.closest('[data-size]');
    const add = e.target.closest('[data-add]');

    if (thumb) colour = product.colours[+thumb.dataset.thumb];
    else if (swatch) colour = product.colours[+swatch.dataset.colour];
    else if (sizeBtn) size = product.sizes.find((s) => s.name === sizeBtn.dataset.size);
    else if (add) {
      Store.add(product.id, colour.name, size.name);
      toast(`${product.name} (${colour.name}, ${size.name}) added.`, 'View list', 'reserve.html');
    } else return;

    repaint();
  });

  repaint();

  const related = $('[data-related]');
  if (related) {
    related.innerHTML = inCategory(product.category)
      .filter((p) => p.id !== product.id)
      .concat(PRODUCTS.filter((p) => p.category !== product.category && p.was))
      .slice(0, 4)
      .map(productCard).join('');
  }
}

/* ---------- reservation list ---------- */

function initList() {
  const root = $('[data-list-page]');
  if (!root) return;

  $$('[data-list-title]').forEach((el) => { el.textContent = Store.words.listName; });

  function render() {
    const items = Store.items();

    if (!items.length) {
      root.innerHTML = `
        <div class="empty-state">
          <h3>${esc(Store.words.empty)}</h3>
          <p>Browse the range, pick what you fancy, and it will show up here ready to take to the showroom.</p>
          <a class="btn btn-primary btn-lg" href="shop.html" style="margin-top:22px">Browse the range</a>
        </div>`;
      return;
    }

    const lines = items.map((item, i) => {
      const p = byId(item.id);
      if (!p) return '';
      const c = p.colours.find((x) => x.name === item.colour) || p.colours[0];
      const linePrice = priceForSize(p, item.size) * item.qty;
      return `
        <div class="list-line">
          <img src="${imgPath(c.image)}" alt="${esc(p.name)}" width="800" height="600">
          <div>
            <h3><a href="product.html?id=${encodeURIComponent(p.id)}">${esc(p.name)}</a></h3>
            <p class="line-opts">${esc(item.colour)} · ${esc(item.size)}</p>
            <p class="line-price">${money(linePrice)}</p>
            <button type="button" class="line-remove" data-remove="${i}">Remove</button>
          </div>
          <div class="line-qty">
            <div class="qty">
              <button type="button" data-dec="${i}" aria-label="One fewer">−</button>
              <output>${item.qty}</output>
              <button type="button" data-inc="${i}" aria-label="One more">+</button>
            </div>
          </div>
        </div>`;
    }).join('');

    const total = Store.total();
    const action = Store.MODE === 'basket'
      ? `<a class="btn btn-primary btn-block btn-lg" href="#" data-checkout style="margin-top:18px">${esc(Store.words.action)}</a>`
      : `<a class="btn btn-primary btn-block btn-lg" href="stores.html" style="margin-top:18px">Find your showroom</a>`;

    root.innerHTML = `
      <div class="list-grid">
        <div>
          ${lines}
          <button type="button" class="line-remove" data-clear style="margin-top:8px">Clear the whole list</button>
        </div>
        <aside class="list-summary">
          <h2 style="font-size:1.2rem;margin-bottom:14px">Summary</h2>
          <div class="summary-row"><span>${items.length} ${items.length === 1 ? 'item' : 'items'}</span><span>${money(total)}</span></div>
          <div class="summary-row"><span>Delivery</span><span>Quoted in store</span></div>
          <div class="summary-row total"><span>${esc(Store.words.total)}</span><span class="price">${money(total)}</span></div>
          ${action}
          ${Store.MODE === 'reserve' ? `
            <p class="muted" style="font-size:0.84rem;margin-top:16px;line-height:1.6">
              Nothing is charged here. Show this list at the Blackpool or Newcastle showroom and the team
              will hold these items for seven days while you make your mind up.
            </p>` : ''}
        </aside>
      </div>`;
  }

  root.addEventListener('click', (e) => {
    const inc = e.target.closest('[data-inc]');
    const dec = e.target.closest('[data-dec]');
    const rm = e.target.closest('[data-remove]');
    const clear = e.target.closest('[data-clear]');
    if (inc) Store.setQty(+inc.dataset.inc, Store.items()[+inc.dataset.inc].qty + 1);
    else if (dec) Store.setQty(+dec.dataset.dec, Store.items()[+dec.dataset.dec].qty - 1);
    else if (rm) Store.remove(+rm.dataset.remove);
    else if (clear) Store.clear();
    else return;
    render();
  });

  render();
}

/* ---------- go ---------- */

initChrome();
initHome();
initListing();
initProduct();
initList();

})();
