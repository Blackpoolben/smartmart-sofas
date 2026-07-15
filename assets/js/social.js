/*
 * The Facebook feed shown on the home page.
 *
 * Facebook gives a static site no way to read a page's posts — the Graph API
 * needs a secret token, and scraping is blocked. So the posts below are typed
 * in by hand. To add one:
 *
 *   1. Save the photo into assets/images/social/ (jpg is fine, ~1200px wide).
 *   2. On the Facebook post, click the timestamp, copy the URL from the bar.
 *   3. Copy a block below, change the five fields, put it at the TOP of the list.
 *
 * Only the first SOCIAL.limit posts are shown, so old ones drop off on their own.
 */

window.SmartMartSocial = {

  page: {
    name: 'Smart Mart',
    handle: 'Smartmart2014',
    url: 'https://www.facebook.com/Smartmart2014',
    followers: '39K',
  },

  /* How many of the posts below to show in the grid. */
  limit: 6,

  posts: [
    {
      // Newest first. `date` is what drives the "2 days ago" label — keep it real.
      date: '2026-07-13',
      image: 'living-room-corner.svg',
      alt: 'A grey corner suite set up on the Blackpool showroom floor',
      text: 'Just landed and already on the floor — the Harlow corner in slate. Come and sit on it before someone else does. Blackpool showroom, open till 5.30.',
      link: 'https://www.facebook.com/Smartmart2014',
    },
    {
      date: '2026-07-12',
      image: 'newcastle-open.svg',
      alt: 'The Newcastle showroom on its opening day',
      text: 'Newcastle is properly up and running now. Thank you to everyone who has come in, and to everyone who kept us going after the fire. Means more than you know.',
      link: 'https://www.facebook.com/Smartmart2014',
    },
    {
      date: '2026-07-11',
      image: 'delivery-van.svg',
      alt: 'The Smart Mart delivery van loaded up outside the store',
      text: 'Van is loaded, Fylde coast deliveries going out this morning. Free local delivery as always — we carry it in, we take the old one away.',
      link: 'https://www.facebook.com/Smartmart2014',
    },
    {
      date: '2026-07-09',
      image: 'sale-tag.svg',
      alt: 'Sale price tags on the showroom floor',
      text: 'Summer sale is on. Up to £500 off across sofas, beds and mattresses. Marked down and staying down until the end of the month.',
      link: 'https://www.facebook.com/Smartmart2014',
    },
    {
      date: '2026-07-07',
      image: 'recliner.svg',
      alt: 'A charcoal recliner armchair in the showroom',
      text: 'The Dalton recliner. Every single person who sits in this one gets up slower than they sat down. You have been warned.',
      link: 'https://www.facebook.com/Smartmart2014',
    },
    {
      date: '2026-07-05',
      image: 'scam-warning.svg',
      alt: 'A warning notice about fake Smart Mart accounts',
      text: 'PLEASE SHARE. There are fake accounts using our name and our photos. We will NEVER ask you to send money online or by bank transfer. We take payment in the showroom only. If in doubt, ring the store.',
      link: 'https://www.facebook.com/Smartmart2014',
      pinned: true,
    },
  ],

};
