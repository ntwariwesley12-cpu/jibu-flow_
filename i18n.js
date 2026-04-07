// Simple client-side i18n for site-wide use
(function () {
  const translations = {
    en: {
      nav_home: 'Home',
      nav_about: 'About',
      nav_products: 'Products',
      nav_pricing: 'Pricing',
      nav_reviews: 'Reviews',
      nav_faq: 'FAQ',
      nav_contact: 'Contact',
      nav_settings: 'Settings',
      order_now: 'Order Now',
      hero_h1: 'Pure Water for Pure Life',
      hero_p: 'Fresh clean water at your door',
      hero_order_btn: 'Order Now',
      features_title: 'Why Choose Jibu Flow?',
      features_pure_title: '100% Pure',
      features_pure_p: 'Clean water with safe minerals',
      features_fast_title: 'Fast Delivery',
      features_fast_p: 'Same-day in selected areas',
      features_eco_title: 'Eco-Friendly',
      features_eco_p: 'Recyclable bottles, less waste',
      features_health_title: 'Health Tested',
      features_health_p: 'Lab checked every day',
      features_affordable_title: 'Affordable',
      features_affordable_p: 'Fair prices with discounts',
      features_support_title: 'Customer Support',
      features_support_p: 'Help is ready 24/7',
      testimonials_title: 'What Our Customers Say',
      testimonials_1_quote: 'Best water I have tried. Very fresh.',
      testimonials_1_author: '- Sarah M.',
      testimonials_2_quote: 'Delivery is fast and reliable.',
      testimonials_2_author: '- John D.',
      testimonials_3_quote: 'Great price. My family loves it.',
      testimonials_3_author: '- Emily R.',
      cta_title: 'Ready to Stay Hydrated?',
      cta_p: 'Join happy customers today',
      cta_button: 'Start Your Order',
      footer_company: 'Jibu Flow',
      footer_about: "Rwanda's trusted source for pure, refreshing water. Delivering quality and health to your doorstep.",
      footer_quick_links: 'Quick Links',
      footer_about_us: 'About Us',
      footer_customer_service: 'Customer Service',
      footer_contact_us: 'Contact Us',
      footer_shipping_info: 'Shipping Info',
      footer_returns_policy: 'Returns Policy',
      footer_order_tracking: 'Order Tracking',
      footer_legal: 'Legal',
      footer_privacy: 'Privacy Policy',
      footer_terms: 'Terms of Service',
      footer_cookie: 'Cookie Policy',
      footer_accessibility: 'Accessibility',
      footer_newsletter: 'Newsletter',
      footer_newsletter_p: 'Get updates and offers',
      newsletter_placeholder: 'Enter your email',
      subscribe: 'Subscribe',
      chat_title: 'Jibu Flow Assistant',
      chat_greeting: "Hello! I'm your Jibu Flow Assistant. How can I help you today?",
      chat_input_placeholder: 'Type your question...',
      chat_send: 'Send',
      settings_title: 'Appearance Settings',
      settings_subtitle: 'Choose theme and language',
      settings_heading: 'Settings',
      language_label: 'Language:',
      switch_mode: 'Switch Dark / Light Mode',
      contact_getintouch: 'Get In Touch',
      contact_help: "We're here to help! Contact us for orders, support, or any questions about our services.",
      contact_send: 'Send Message',
      call_now: 'Call Us Now'
    },
    rw: {
      nav_home: 'Ahabanza',
      nav_about: 'Ibyerekeye',
      nav_products: 'Ibicuruzwa',
      nav_pricing: 'Ibiciro',
      nav_reviews: 'Ibyo bavuga',
      nav_faq: 'Ibibazo',
      nav_contact: 'Twandikire',
      nav_settings: 'Igenamiterere',
      order_now: 'Tegeka None',
      hero_h1: 'Amazi meza ku buzima',
      hero_p: 'Amazi asukuye akugereho vuba',
      hero_order_btn: 'Tegeka None',
      features_title: 'Kuki wahitamo Jibu Flow?',
      features_pure_title: 'Asukuye 100%',
      features_pure_p: 'Amazi asukuye kandi meza',
      features_fast_title: 'Byihuse',
      features_fast_p: 'Agera umunsi umwe ahatoranyijwe',
      features_eco_title: 'Kurengera ibidukikije',
      features_eco_p: 'Amacupa asubirwamo',
      features_health_title: 'Yapimwe',
      features_health_p: 'Agenzurwa buri munsi',
      features_affordable_title: 'Igiciro cyiza',
      features_affordable_p: 'Ibiciro byoroshye nko ku igabanyirizwa',
      features_support_title: 'Ubufasha',
      features_support_p: 'Duhari amasaha 24/7',
      testimonials_title: 'Ibyo abakiriya bavuga',
      testimonials_1_quote: 'Amazi meza cyane kandi asukuye.',
      testimonials_1_author: '- Wesley N.',
      testimonials_2_quote: 'Kohereza byihuta kandi byizewe.',
      testimonials_2_author: '- WESLEY N.',
      testimonials_3_quote: 'Igiciro cyiza ku muryango.',
      testimonials_3_author: '- Wesley M.',
      cta_title: 'Witeguye kunywa amazi meza?',
      cta_p: 'Injira mu bakiriya bishimiye serivisi',
      cta_button: 'Tangira Gutumiza',
      footer_company: 'Jibu Flow',
      footer_about: 'Isoko ryizewe ry amazi meza mu Rwanda.',
      footer_quick_links: 'Aho ujya vuba',
      footer_about_us: 'Ibyerekeye',
      footer_customer_service: 'Serivisi z abakiriya',
      footer_contact_us: 'Twandikire',
      footer_shipping_info: 'Amakuru yo kohereza',
      footer_returns_policy: 'Gusubiza ibicuruzwa',
      footer_order_tracking: 'Gukurikirana order',
      footer_legal: 'Amategeko',
      footer_privacy: 'Amabanga',
      footer_terms: 'Amabwiriza',
      footer_cookie: 'Cookies',
      footer_accessibility: 'Uko ikoreshwa',
      footer_newsletter: 'Amakuru mashya',
      footer_newsletter_p: 'Bona amatangazo n ibisubizo',
      newsletter_placeholder: 'Andika email yawe',
      subscribe: 'Iyandikishe',
      chat_title: 'Ubufasha bwa Jibu Flow',
      chat_greeting: 'Muraho! Ndi umufasha wa Jibu Flow. Nagufasha iki?',
      chat_input_placeholder: 'Andika ikibazo cyawe...',
      chat_send: 'Ohereza',
      settings_title: 'Igenamiterere',
      settings_subtitle: 'Hitamo uburyo n ururimi',
      settings_heading: 'Igenamiterere',
      language_label: 'Ururimi:',
      switch_mode: 'Hindura Umucyo / Umwijima',
      contact_getintouch: 'Twandikire',
      contact_help: 'Duhari ngo tugufashe ku byo ukeneye.',
      contact_send: 'Ohereza ubutumwa',
      call_now: 'Hamagara None'
    },
    fr: {
      nav_home: 'Accueil',
      nav_about: 'A propos',
      nav_products: 'Produits',
      nav_pricing: 'Tarifs',
      nav_reviews: 'Avis',
      nav_faq: 'FAQ',
      nav_contact: 'Contact',
      nav_settings: 'Parametres',
      order_now: 'Commander',
      hero_h1: 'Eau pure, vie saine',
      hero_p: 'Eau propre livree a votre porte',
      hero_order_btn: 'Commander',
      features_title: 'Pourquoi choisir Jibu Flow ?',
      features_pure_title: '100% Pure',
      features_pure_p: 'Eau propre et sure',
      features_fast_title: 'Livraison rapide',
      features_fast_p: 'Livraison le meme jour',
      features_eco_title: 'Eco-responsable',
      features_eco_p: 'Bouteilles recyclables',
      features_health_title: 'Testee',
      features_health_p: 'Controlee chaque jour',
      features_affordable_title: 'Abordable',
      features_affordable_p: 'Prix justes avec remises',
      features_support_title: 'Support client',
      features_support_p: 'Disponible 24/7',
      testimonials_title: 'Ce que disent nos clients',
      testimonials_1_quote: 'Tres bonne eau, tres fraiche.',
      testimonials_1_author: '- Sarah M.',
      testimonials_2_quote: 'Livraison rapide et fiable.',
      testimonials_2_author: '- John D.',
      testimonials_3_quote: 'Bon prix pour la famille.',
      testimonials_3_author: '- Emily R.',
      cta_title: 'Pret a rester hydrate ?',
      cta_p: 'Rejoignez nos clients satisfaits',
      cta_button: 'Commencer la commande',
      footer_company: 'Jibu Flow',
      footer_about: 'Source fiable d eau pure au Rwanda.',
      footer_quick_links: 'Liens rapides',
      footer_about_us: 'A propos',
      footer_customer_service: 'Service client',
      footer_contact_us: 'Contactez-nous',
      footer_shipping_info: 'Infos livraison',
      footer_returns_policy: 'Politique de retour',
      footer_order_tracking: 'Suivi de commande',
      footer_legal: 'Mentions legales',
      footer_privacy: 'Confidentialite',
      footer_terms: 'Conditions',
      footer_cookie: 'Cookies',
      footer_accessibility: 'Accessibilite',
      footer_newsletter: 'Newsletter',
      footer_newsletter_p: 'Recevez nos offres',
      newsletter_placeholder: 'Entrez votre email',
      subscribe: 'S abonner',
      chat_title: 'Assistant Jibu Flow',
      chat_greeting: 'Bonjour ! Je suis votre assistant Jibu Flow. Comment aider ?',
      chat_input_placeholder: 'Tapez votre question...',
      chat_send: 'Envoyer',
      settings_title: 'Parametres',
      settings_subtitle: 'Choisissez theme et langue',
      settings_heading: 'Parametres',
      language_label: 'Langue :',
      switch_mode: 'Mode Clair / Sombre',
      contact_getintouch: 'Contactez-nous',
      contact_help: 'Nous sommes la pour vous aider.',
      contact_send: 'Envoyer le message',
      call_now: 'Appelez-nous'
    },
    sw: {
      nav_home: 'Nyumbani',
      nav_about: 'Kuhusu',
      nav_products: 'Bidhaa',
      nav_pricing: 'Bei',
      nav_reviews: 'Maoni',
      nav_faq: 'Maswali',
      nav_contact: 'Wasiliana',
      nav_settings: 'Mipangilio',
      order_now: 'Agiza Sasa',
      hero_h1: 'Maji safi kwa maisha',
      hero_p: 'Maji safi yanaletwa mlangoni',
      hero_order_btn: 'Agiza Sasa',
      features_title: 'Kwa nini uchague Jibu Flow?',
      features_pure_title: 'Safi 100%',
      features_pure_p: 'Maji safi na salama',
      features_fast_title: 'Uwasilishaji haraka',
      features_fast_p: 'Siku hiyohiyo maeneo maalum',
      features_eco_title: 'Rafiki kwa mazingira',
      features_eco_p: 'Chupa zinazorejelewa',
      features_health_title: 'Yamepimwa',
      features_health_p: 'Hupimwa kila siku',
      features_affordable_title: 'Bei nafuu',
      features_affordable_p: 'Bei nzuri na punguzo',
      features_support_title: 'Huduma kwa wateja',
      features_support_p: 'Tunapatikana saa 24/7',
      testimonials_title: 'Wateja wetu wanasema nini',
      testimonials_1_quote: 'Maji mazuri sana, safi.',
      testimonials_1_author: '- Sarah M.',
      testimonials_2_quote: 'Uwasilishaji wa haraka na uhakika.',
      testimonials_2_author: '- John D.',
      testimonials_3_quote: 'Bei nzuri kwa familia.',
      testimonials_3_author: '- Emily R.',
      cta_title: 'Uko tayari kubaki na maji?',
      cta_p: 'Jiunge na wateja wenye furaha',
      cta_button: 'Anza Agizo',
      footer_company: 'Jibu Flow',
      footer_about: 'Chanzo cha kuaminika cha maji safi Rwanda.',
      footer_quick_links: 'Viungo vya haraka',
      footer_about_us: 'Kuhusu sisi',
      footer_customer_service: 'Huduma kwa wateja',
      footer_contact_us: 'Wasiliana nasi',
      footer_shipping_info: 'Taarifa za usafirishaji',
      footer_returns_policy: 'Sera ya kurejesha',
      footer_order_tracking: 'Fuatilia agizo',
      footer_legal: 'Kisheria',
      footer_privacy: 'Faragha',
      footer_terms: 'Masharti',
      footer_cookie: 'Cookie',
      footer_accessibility: 'Ufikiaji',
      footer_newsletter: 'Jarida',
      footer_newsletter_p: 'Pata habari na ofa',
      newsletter_placeholder: 'Weka barua pepe',
      subscribe: 'Jisajili',
      chat_title: 'Msaidizi wa Jibu Flow',
      chat_greeting: 'Habari! Mimi ni msaidizi wa Jibu Flow. Nikusaidie nini?',
      chat_input_placeholder: 'Andika swali lako...',
      chat_send: 'Tuma',
      settings_title: 'Mipangilio',
      settings_subtitle: 'Chagua muonekano na lugha',
      settings_heading: 'Mipangilio',
      language_label: 'Lugha:',
      switch_mode: 'Badili Giza / Mwanga',
      contact_getintouch: 'Wasiliana nasi',
      contact_help: 'Tuko hapa kukusaidia.',
      contact_send: 'Tuma ujumbe',
      call_now: 'Piga simu sasa'
    }
  };

  function applyTranslations(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const text = (translations[lang] && translations[lang][key]) || translations.en[key] || el.innerText;
      el.innerText = text;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      const text = (translations[lang] && translations[lang][key]) || translations.en[key] || el.placeholder;
      el.placeholder = text;
    });

    document.querySelectorAll('*').forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        if (!attr.name.startsWith('data-i18n-') || attr.name === 'data-i18n') return;
        const target = attr.name.slice('data-i18n-'.length);
        const key = attr.value;
        const text = (translations[lang] && translations[lang][key]) || translations.en[key] || '';
        if (target === 'html') el.innerHTML = text;
        else if (target === 'text') el.innerText = text;
        else if (target === 'placeholder') el.placeholder = text;
        else el.setAttribute(target, text);
      });
    });

    if (translations[lang] && translations[lang].page_title) document.title = translations[lang].page_title;
    try { document.documentElement.lang = lang; } catch (e) {}
  }

  function setLanguage(lang) {
    localStorage.setItem('jibu_lang', lang);
    applyTranslations(lang);
    const sel = document.getElementById('languageSelect');
    if (sel) sel.value = lang;
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }

  document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('jibu_lang');
    let lang = 'en';
    if (saved && ['rw', 'en', 'fr', 'sw'].includes(saved)) lang = saved;
    else {
      const nav = (navigator.language || navigator.userLanguage || 'en').slice(0, 2);
      if (['rw', 'en', 'fr', 'sw'].includes(nav)) lang = nav;
    }

    const sel = document.getElementById('languageSelect');
    if (sel) {
      sel.value = lang;
      sel.addEventListener('change', (e) => setLanguage(e.target.value));
    }

    applyTranslations(lang);
  });
})();
