/*
 * Renders the home-page Facebook block from window.SmartMartSocial (social.js).
 *
 * Two things happen here:
 *
 *   1. The curated grid  — the hand-typed posts in social.js are drawn into
 *      [data-social-grid]. This ALWAYS shows, even if Facebook is blocked by an
 *      ad-blocker or cookie banner, so the block is never empty.
 *
 *   2. The live feed      — Facebook's official Page Plugin is loaded into the
 *      [data-social-live] box. It pulls the real latest posts straight off the
 *      page, so it updates itself with nothing for anyone to do here. If it
 *      cannot load, the box is hidden and the curated grid carries the block.
 *
 * social.js must be loaded before this file.
 */

(function () {
  var data = window.SmartMartSocial;
  if (!data) return;

  /* ---- "3 days ago" from a YYYY-MM-DD date ---- */
  function relativeDate(iso) {
    var then = new Date(iso + 'T12:00:00');
    if (isNaN(then)) return '';
    var days = Math.round((Date.now() - then.getTime()) / 86400000);
    if (days <= 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return days + ' days ago';
    if (days < 14) return 'A week ago';
    if (days < 31) return Math.round(days / 7) + ' weeks ago';
    return then.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
  }

  function el(tag, cls) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    return n;
  }

  /* ---- 1. curated grid ---- */
  function buildGrid(grid) {
    var posts = (data.posts || []).slice(0, data.limit || 6);
    posts.forEach(function (post) {
      var card = el('article', 'social-card');

      var media = el('a', 'social-media');
      media.href = post.link || (data.page && data.page.url) || '#';
      media.target = '_blank';
      media.rel = 'noopener';
      media.setAttribute('aria-label', 'Open this post on Facebook');
      var img = el('img');
      img.src = 'assets/images/social/' + post.image;
      img.alt = post.alt || '';
      img.loading = 'lazy';
      img.width = 1200;
      img.height = 900;
      media.appendChild(img);
      if (post.pinned) {
        var pin = el('span', 'social-pin');
        pin.textContent = 'Pinned';
        media.appendChild(pin);
      }
      card.appendChild(media);

      var body = el('div', 'social-body');
      var meta = el('div', 'social-meta');
      var fb = el('span', 'social-fb');
      fb.textContent = 'Facebook';
      var when = el('span', 'social-when');
      when.textContent = relativeDate(post.date);
      meta.appendChild(fb);
      meta.appendChild(when);
      body.appendChild(meta);

      var text = el('p', 'social-text');
      text.textContent = post.text || '';
      body.appendChild(text);

      var link = el('a', 'social-link');
      link.href = post.link || (data.page && data.page.url) || '#';
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'See on Facebook';
      body.appendChild(link);

      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  /* ---- 2. live Facebook Page Plugin ---- */
  function buildLive(box) {
    var url = data.page && data.page.url;
    if (!url) { box.hidden = true; return; }

    var root = document.getElementById('fb-root');
    if (!root) {
      root = el('div');
      root.id = 'fb-root';
      document.body.insertBefore(root, document.body.firstChild);
    }

    var plugin = el('div', 'fb-page');
    plugin.setAttribute('data-href', url);
    plugin.setAttribute('data-tabs', 'timeline');
    plugin.setAttribute('data-width', '500');
    plugin.setAttribute('data-height', '640');
    plugin.setAttribute('data-small-header', 'false');
    plugin.setAttribute('data-hide-cover', 'false');
    plugin.setAttribute('data-show-facepile', 'true');
    box.appendChild(plugin);

    // Hide the whole live column if Facebook never renders (blocked / offline).
    setTimeout(function () {
      if (!box.querySelector('iframe')) {
        var col = box.closest('[data-social-live-col]') || box;
        col.hidden = true;
      }
    }, 4000);

    if (window.FB && window.FB.XFBML) {
      window.FB.XFBML.parse(box);
      return;
    }
    if (document.getElementById('facebook-jssdk')) return;
    var s = el('script');
    s.id = 'facebook-jssdk';
    s.async = true;
    s.defer = true;
    s.crossOrigin = 'anonymous';
    s.src = 'https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v19.0';
    document.body.appendChild(s);
  }

  function init() {
    var grid = document.querySelector('[data-social-grid]');
    if (grid) buildGrid(grid);

    var counts = document.querySelectorAll('[data-social-followers]');
    if (data.page && data.page.followers) {
      counts.forEach(function (c) { c.textContent = data.page.followers; });
    }
    var links = document.querySelectorAll('[data-social-url]');
    if (data.page && data.page.url) {
      links.forEach(function (a) { a.href = data.page.url; });
    }

    var live = document.querySelector('[data-social-live]');
    if (live) buildLive(live);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
