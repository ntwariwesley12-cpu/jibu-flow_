// AI Helper JavaScript for Jibu Flow Website

// Load Socket.IO for real-time chat
const socketScript = document.createElement('script');
socketScript.src = 'https://cdn.socket.io/4.7.2/socket.io.min.js';
document.head.appendChild(socketScript);

// Initialize socket connection
let socket;
socketScript.onload = function() {
    socket = io();
    initializeRealTimeChat();
};

// Enhanced Website knowledge base with comprehensive information
const websiteInfo = {
  company: {
    name: "Jibu Flow Water",
    founder: "KABOOKYA Milly",
    founded: "2026",
    location: "Rwanda",
    mission: "To make clean, healthy water accessible to everyone while protecting our environment through sustainable packaging and responsible water sourcing",
    vision: "To be the leading provider of pure, sustainable water solutions across East Africa",
    values: ["Quality", "Sustainability", "Customer Care", "Innovation", "Community"],
    stats: {
      customers: "50,000+",
      bottles: "1M+",
      purity: "100%",
      satisfaction: "98%"
    }
  },
  people: {
    owner: {
      name: "KABOOKYA Milly",
      role: "Founder & CEO",
      phone: "0787390669 / 0788496959",
      email: "ntwariwesley@gmail.com"
    },
    operations: {
      name: "vicky komukyae",
      role: "Operations Manager"
    },
    ceo2: {
      name: "KANYONI AIME",
      role: "CEO 2"
    }
  },
  products: {
    bottles: {
      "500ml": { price: "RWF 2,500", description: "Perfect for on-the-go hydration", features: ["BPA-free", "Recyclable", "Leak-proof cap"] },
      "1L": { price: "RWF 3,900", description: "Ideal for daily use at home or office", features: ["Ergonomic design", "Easy grip", "Premium quality"] },
      "5L": { price: "RWF 10,400", description: "Best value for families and offices", features: ["Large capacity", "Durable handle", "Cost-effective"] }
    },
    subscriptions: {
      weekly: "Save 10% with weekly delivery",
      monthly: "Save 15% with monthly subscription",
      corporate: "Custom plans for businesses with special rates"
    }
  },
  delivery: {
    kigali: "Same-day delivery in Kigali metro area (order before 2 PM)",
    provincial: "Provincial areas are usually delivered in 1-2 business days",
    international: "International delivery is available on request",
    freeDelivery: "Free delivery on orders above RWF 20,000",
    tracking: "Real-time order tracking available"
  },
  payment: {
    methods: ["Mobile Money (MTN, Airtel)", "Credit/Debit Cards", "PayPal", "Cash on Delivery"],
    secure: "All payments are 100% secure and encrypted",
    refund: "30-day money-back guarantee"
  },
  features: [
    "100% pure water with multi-stage filtration",
    "Fast same-day delivery in Kigali",
    "Eco-friendly recyclable packaging",
    "Health-tested and certified products",
    "Affordable prices with subscription discounts",
    "24/7 customer support",
    "Real-time order tracking",
    "Quality guarantee"
  ],
  quality: {
    filtration: "7-stage purification process including UV sterilization",
    testing: "Regular lab testing for purity and safety",
    certification: "Certified by Rwanda Standards Board",
    source: "Natural spring water from protected sources"
  },
  sustainability: {
    packaging: "100% recyclable aluminum bottles",
    initiative: "Bottle return program for recycling",
    impact: "Reduced plastic waste by 500,000+ bottles annually"
  },
  website: {
    sections: ["Home", "About", "Products", "Pricing", "Testimonials", "FAQ", "Contact", "Settings"],
    orderFlow: "Click 'Order Now' button → Select your product → Fill in delivery details → Choose payment method → Confirm order",
    supportFlow: "Use Contact page, Live chat mode, or AI chat for instant answers. Available 24/7!"
  },
  faq: {
    waterSource: "Our water comes from protected natural springs and undergoes 7-stage purification",
    deliveryTime: "Same-day in Kigali if ordered before 2 PM, 1-2 days for other areas",
    minOrder: "No minimum order required, but free delivery on orders above RWF 20,000",
    subscription: "Yes! Save 10-15% with weekly or monthly subscriptions",
    returns: "30-day money-back guarantee if you're not satisfied"
  }
};

// Conversation memory for contextual responses
let conversationHistory = [];
let userPreferences = {
  askedAbout: [],
  interests: [],
  lastTopic: null
};

function normalizeText(value) {
  return (value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function getPageContext() {
  const title = document.title || "Jibu Flow";
  const path = window.location.pathname || "";
  const page = path.split("/").pop() || "index.html";
  const navLinks = Array.from(document.querySelectorAll(".nav-links a"))
    .map((el) => (el.textContent || "").trim())
    .filter(Boolean);
  const headings = Array.from(document.querySelectorAll("h1, h2, h3"))
    .map((el) => (el.textContent || "").trim())
    .filter(Boolean)
    .slice(0, 24);
  const products = Array.from(document.querySelectorAll(".gallery-item, .product-item"))
    .map((el) => {
      const name = (el.querySelector("h3")?.textContent || "").trim();
      const price = (el.querySelector(".gallery-price, .price")?.textContent || "").trim();
      return { name, price };
    })
    .filter((p) => p.name)
    .slice(0, 80);

  return { title, page, navLinks, headings, products };
}

function summarizeProducts(products, limit = 8) {
  if (!products.length) return "";
  return products
    .slice(0, limit)
    .map((p) => `${p.name}${p.price ? ` (${p.price})` : ""}`)
    .join("\n");
}

function matchProducts(query, products) {
  const q = normalizeText(query);
  if (!q || !products.length) return [];
  return products.filter((p) => {
    const hay = normalizeText(`${p.name} ${p.price}`);
    if (!hay) return false;
    if (hay.includes(q)) return true;
    const qWords = q.split(" ").filter((w) => w.length > 2);
    return qWords.some((w) => hay.includes(w));
  });
}

// Enhanced smart response with personality and context awareness
function getSmartResponse(message) {
  const lowerMessage = normalizeText(message);
  const pageCtx = getPageContext();
  const allProducts = pageCtx.products;
  const matchedProducts = matchProducts(message, allProducts);

  // Track conversation context
  conversationHistory.push({ role: 'user', message: lowerMessage, timestamp: Date.now() });
  if (conversationHistory.length > 10) conversationHistory.shift(); // Keep last 10 messages

  // Greetings - warm and personalized
  if (/(hello|hi|hey|muraho|bonjour|habari|good morning|good afternoon|good evening)\b/.test(lowerMessage)) {
    const greetings = [
      `Hello! 👋 Welcome to Jibu Flow Water! I'm your personal water assistant. How can I help you stay hydrated today?`,
      `Hi there! 🌊 Great to see you! I'm here to help you find the perfect water solution. What can I do for you?`,
      `Hey! 💧 Welcome to Jibu Flow! Whether you need water for home, office, or on-the-go, I've got you covered. What interests you?`
    ];
    userPreferences.lastTopic = 'greeting';
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Thanks - encouraging and helpful
  if (/(thank|thanks|urakoze|merci|asante|appreciate)\b/.test(lowerMessage)) {
    const responses = [
      `You're very welcome! 😊 Is there anything else you'd like to know about our products, delivery, or services?`,
      `Happy to help! 🌟 Feel free to ask if you have more questions about Jibu Flow Water!`,
      `My pleasure! 💙 I'm here 24/7 if you need anything else. Stay hydrated!`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Founder/Team - engaging storytelling
  if (/(founder|owner|ceo|who.*run|who.*lead|team|management|behind)/.test(lowerMessage)) {
    userPreferences.askedAbout.push('team');
    userPreferences.lastTopic = 'team';
    return `🌟 ${websiteInfo.company.name} was founded by ${websiteInfo.company.founder}, our visionary CEO who's passionate about making clean water accessible to everyone!\n\n👥 Our amazing team includes:\n• ${websiteInfo.people.operations.name} - ${websiteInfo.people.operations.role}\n• ${websiteInfo.people.ceo2.name} - ${websiteInfo.people.ceo2.role}\n\nTogether, we've served over ${websiteInfo.company.stats.customers} happy customers! Want to know more about our mission?`;
  }

  // Contact - helpful and action-oriented
  if (/(phone|email|contact|support|help line|helpline|reach|call|message)/.test(lowerMessage)) {
    userPreferences.askedAbout.push('contact');
    userPreferences.lastTopic = 'contact';
    return `📞 We're here to help 24/7!\n\n💬 Contact Options:\n• Phone: ${websiteInfo.people.owner.phone}\n• Email: ${websiteInfo.people.owner.email}\n• Live Chat: Click the "Live Mode" button above\n• AI Chat: That's me! Ask away!\n\nWhat would you like to know? I can help with orders, products, delivery, or any questions!`;
  }

  // Delivery - detailed and reassuring
  if (/(delivery|shipping|ship|deliver|kigali|province|international|how long|when.*arrive|tracking)/.test(lowerMessage)) {
    userPreferences.askedAbout.push('delivery');
    userPreferences.lastTopic = 'delivery';
    return `🚚 Fast & Reliable Delivery!\n\n📍 Kigali: ${websiteInfo.delivery.kigali}\n📍 Provincial: ${websiteInfo.delivery.provincial}\n🌍 International: ${websiteInfo.delivery.international}\n\n🎁 ${websiteInfo.delivery.freeDelivery}\n📱 ${websiteInfo.delivery.tracking}\n\nReady to order? I can guide you through the process!`;
  }

  // Payment methods - secure and reassuring
  if (/(payment|pay|card|mobile money|momo|paypal|cash|how.*pay|payment method)/.test(lowerMessage)) {
    userPreferences.askedAbout.push('payment');
    userPreferences.lastTopic = 'payment';
    return `💳 Flexible & Secure Payment Options:\n\n✅ ${websiteInfo.payment.methods.join('\n✅ ')}\n\n🔒 ${websiteInfo.payment.secure}\n💯 ${websiteInfo.payment.refund}\n\nChoose what works best for you! Ready to place an order?`;
  }

  // Quality & Purity - build trust
  if (/(quality|pure|purity|clean|safe|filter|filtration|test|certified|certification|health)/.test(lowerMessage)) {
    userPreferences.askedAbout.push('quality');
    userPreferences.lastTopic = 'quality';
    return `💎 Premium Quality You Can Trust!\n\n🔬 Our Water Quality:\n• ${websiteInfo.quality.filtration}\n• ${websiteInfo.quality.testing}\n• ${websiteInfo.quality.certification}\n• ${websiteInfo.quality.source}\n\n✨ Result: ${websiteInfo.company.stats.purity} pure water with ${websiteInfo.company.stats.satisfaction} customer satisfaction!\n\nWant to try it? Let me help you order!`;
  }

  // Sustainability - show values
  if (/(eco|environment|sustainable|sustainability|green|recycle|plastic|bottle return)/.test(lowerMessage)) {
    userPreferences.askedAbout.push('sustainability');
    userPreferences.lastTopic = 'sustainability';
    return `🌍 Committed to Our Planet!\n\n♻️ Our Sustainability Efforts:\n• ${websiteInfo.sustainability.packaging}\n• ${websiteInfo.sustainability.initiative}\n• ${websiteInfo.sustainability.impact}\n\n💚 When you choose Jibu Flow, you're choosing a cleaner future! Want to learn about our products?`;
  }

  // Subscription - highlight savings
  if (/(subscription|subscribe|weekly|monthly|regular|recurring|save|discount)/.test(lowerMessage)) {
    userPreferences.askedAbout.push('subscription');
    userPreferences.lastTopic = 'subscription';
    return `💰 Save More with Subscriptions!\n\n📅 ${websiteInfo.products.subscriptions.weekly}\n📅 ${websiteInfo.products.subscriptions.monthly}\n🏢 ${websiteInfo.products.subscriptions.corporate}\n\n✨ Plus: Never run out of water + Priority delivery + Flexible scheduling\n\nInterested? I can help you set up a subscription!`;
  }

  // Specific product queries
  if (/(500ml|500 ml|small bottle|portable)/.test(lowerMessage)) {
    userPreferences.interests.push('500ml');
    return `💧 500ml Bottle - ${websiteInfo.products.bottles["500ml"].price}\n\n${websiteInfo.products.bottles["500ml"].description}\n\n✨ Features:\n${websiteInfo.products.bottles["500ml"].features.map(f => `• ${f}`).join('\n')}\n\n🎯 Perfect for: Gym, travel, school, daily commute\n\nWould you like to order some?`;
  }

  if (/(1l|1 l|1 liter|1 litre|medium bottle|one liter)/.test(lowerMessage)) {
    userPreferences.interests.push('1L');
    return `💧 1L Bottle - ${websiteInfo.products.bottles["1L"].price}\n\n${websiteInfo.products.bottles["1L"].description}\n\n✨ Features:\n${websiteInfo.products.bottles["1L"].features.map(f => `• ${f}`).join('\n')}\n\n🎯 Perfect for: Home, office, daily hydration\n\nShall I help you place an order?`;
  }

  if (/(5l|5 l|5 liter|5 litre|large|big|family|bulk)/.test(lowerMessage)) {
    userPreferences.interests.push('5L');
    return `💧 5L Container - ${websiteInfo.products.bottles["5L"].price}\n\n${websiteInfo.products.bottles["5L"].description}\n\n✨ Features:\n${websiteInfo.products.bottles["5L"].features.map(f => `• ${f}`).join('\n')}\n\n🎯 Perfect for: Families, offices, events, best value!\n\nReady to order? This is our most popular size!`;
  }

  // Product search on page
  if (matchedProducts.length > 0) {
    userPreferences.lastTopic = 'products';
    const lines = matchedProducts.slice(0, 6).map((p) => `• ${p.name}${p.price ? ` - ${p.price}` : ""}`);
    return `🔍 Found these products for you:\n\n${lines.join("\n")}\n\n💡 Tip: Click on any product to see more details, or ask me about specific sizes!`;
  }

  // General product inquiry
  if (/(product|price|cost|catalog|list|available|offer|what.*sell|what.*have)/.test(lowerMessage)) {
    userPreferences.lastTopic = 'products';
    const quickList = summarizeProducts(allProducts);
    if (quickList) {
      return `🛍️ Our Premium Water Products:\n\n${quickList}\n\n💡 All bottles are:\n✅ 100% pure & tested\n✅ Eco-friendly packaging\n✅ Fast delivery available\n\nWhich size interests you?`;
    }
    return `🛍️ We offer premium water in three sizes:\n\n💧 500ml - ${websiteInfo.products.bottles["500ml"].price} (${websiteInfo.products.bottles["500ml"].description})\n💧 1L - ${websiteInfo.products.bottles["1L"].price} (${websiteInfo.products.bottles["1L"].description})\n💧 5L - ${websiteInfo.products.bottles["5L"].price} (${websiteInfo.products.bottles["5L"].description})\n\n💰 Save up to 15% with subscriptions! Which size would you like to know more about?`;
  }

  // Ordering process - step by step
  if (/(order|buy|purchase|checkout|how.*order|want.*buy)/.test(lowerMessage)) {
    userPreferences.lastTopic = 'ordering';
    return `🛒 Easy Ordering Process:\n\n${websiteInfo.website.orderFlow}\n\n⚡ Quick tips:\n• Orders before 2 PM get same-day delivery in Kigali\n• Free delivery on orders above RWF 20,000\n• Multiple payment options available\n• Track your order in real-time\n\nReady to order? Click any "Order Now" button or tell me which product you want!`;
  }

  // Navigation help
  if (/(where|which page|navigate|find|location on site|menu|section)/.test(lowerMessage)) {
    return `📍 You're currently on: ${pageCtx.page}\n\n🗺️ Website Sections:\n${websiteInfo.website.sections.map(s => `• ${s}`).join('\n')}\n\n💡 What would you like to explore? I can guide you to products, pricing, testimonials, or any other section!`;
  }

  // About company - inspiring
  if (/(about|company|mission|story|jibu flow|vision|values|why)/.test(lowerMessage)) {
    userPreferences.askedAbout.push('about');
    userPreferences.lastTopic = 'about';
    return `🌟 About Jibu Flow Water\n\n📍 Based in ${websiteInfo.company.location}\n🎯 Mission: ${websiteInfo.company.mission}\n\n🔮 Vision: ${websiteInfo.company.vision}\n\n💎 Our Values: ${websiteInfo.company.values.join(', ')}\n\n📊 Our Impact:\n• ${websiteInfo.company.stats.customers} satisfied customers\n• ${websiteInfo.company.stats.bottles} bottles delivered\n• ${websiteInfo.company.stats.purity} pure water guaranteed\n\nWant to be part of our story? Let's get you some pure water!`;
  }

  // FAQ responses
  if (/(faq|question|common|frequently)/.test(lowerMessage)) {
    return `❓ Frequently Asked Questions:\n\n💧 Water Source: ${websiteInfo.faq.waterSource}\n⏰ Delivery Time: ${websiteInfo.faq.deliveryTime}\n📦 Minimum Order: ${websiteInfo.faq.minOrder}\n💰 Subscriptions: ${websiteInfo.faq.subscription}\n↩️ Returns: ${websiteInfo.faq.returns}\n\nHave a specific question? Just ask!`;
  }

  // Contextual follow-up based on conversation history
  if (conversationHistory.length > 2) {
    const recentTopics = conversationHistory.slice(-3).map(h => h.message).join(' ');
    if (/(yes|yeah|sure|ok|okay|interested|tell me more)\b/.test(lowerMessage)) {
      if (userPreferences.lastTopic === 'products') {
        return `Great! 🎉 Which size would you like?\n\n💧 500ml (${websiteInfo.products.bottles["500ml"].price}) - Perfect for on-the-go\n💧 1L (${websiteInfo.products.bottles["1L"].price}) - Ideal for daily use\n💧 5L (${websiteInfo.products.bottles["5L"].price}) - Best value for families\n\nJust let me know!`;
      }
      if (userPreferences.lastTopic === 'ordering') {
        return `Awesome! 🚀 Click any "Order Now" button on the page, or tell me which product you want and I'll guide you through the process step by step!`;
      }
    }
  }

  // Default - helpful and engaging
  const pageHints = pageCtx.headings.slice(0, 4).join(", ");
  return `💬 I'm here to help you with anything about Jibu Flow Water!\n\n🔍 I can assist with:\n• Product information & pricing\n• Delivery & tracking\n• Payment options\n• Quality & certifications\n• Subscriptions & savings\n• Ordering process\n• Company information\n\n📍 You're on: ${pageCtx.page}\n${pageHints ? `📋 Topics here: ${pageHints}` : ''}\n\nWhat would you like to know? 😊`;
}

// Generate AI response based on user message
function generateResponse(message) {
  return getSmartResponse(message);
}
// DOM Elements
const chatWidget = document.getElementById('chatWidget');
const chatToggle = document.getElementById('chatToggle');
const chatHeader = document.getElementById('chatHeader');
const chatMinimize = document.getElementById('chatMinimize');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const notificationContainer = document.getElementById('notificationContainer');
const aiModeBtn = document.getElementById('aiModeBtn');
const liveModeBtn = document.getElementById('liveModeBtn');
const welcomeModal = document.getElementById('welcomeModal');
const successModal = document.getElementById('successModal');

// Chat Toggle Functionality
let chatOpen = false;
let toggleTimeout;
let inputTimeout;
let chatMode = 'ai'; // 'ai' or 'live'
let currentChatId = null;
let customerInfo = null;
let isConnected = false;
let currentLanguage = localStorage.getItem('jibu_lang') || 'en';

// AI Helper translations
const aiHelperTranslations = {
  en: {
    chat_title: 'Jibu Flow Assistant',
    greeting: "Hello! 👋 I'm your Jibu Flow Assistant. How can I help you today? I can answer questions about our products, pricing, delivery, or help you place an order!",
    hello: "Hello! I'm the Jibu Flow assistant. I can help you learn about our products, pricing, delivery, and more. What would you like to know?",
    live_connected: 'Connected to live chat! A seller will be with you shortly.',
    seller_joined: 'A seller has joined the chat. You can now communicate directly!',
    seller_left: 'The seller has left the chat. You can continue with AI assistance or start a new live chat.',
    chat_ended: 'This chat has ended. Thank you for contacting Jibu Flow!',
    ai_mode: 'Switched to AI Assistant mode. How can I help you?',
    connecting: 'Connecting you to a live seller...',
    already_live: 'You are already connected to live chat!',
    fallback: "I'd be happy to help you with information about Jibu Flow Water! You can ask me about our products, pricing, delivery, company information, or any other questions about our services.",
    you_welcome: "You're welcome! Is there anything else I can help you with about Jibu Flow Water?"
  },
  rw: {
    chat_title: 'Ubufasha bwa Jibu Flow',
    greeting: 'Muraho! 👋 Ndi umufasha wa Jibu Flow. Nakora iki ngo ngufashe? Nshobora kwitangira ibicuruzwa, ibiciro, imyidagaduga, cyangwa ufashe kuri gahunda.',
    hello: "Muraho! Ndi umufasha wa Jibu Flow. Nshobora gufasha gumenya ibicuruzwa, ibiciro, imyidagaduga, n andi mahari ya serivisi.",
    live_connected: 'Ujyanye n umwinterineti! Umwibarire azakugera vuba.',
    seller_joined: 'Umwibarire waje. Urashobora kuganirira.',
    seller_left: 'Umwibarire yagiye. Urashobora kinyeshyire ubufasha bwa AI cyangwa kugerageza ubufasha.',
    chat_ended: 'Iki kiganiro kyarangiye. Mwakoze kwitanagira Jibu Flow!',
    ai_mode: 'Wayihindutse muri mwujwe wa AI. Nakora iki?',
    connecting: 'Kuganirira n umwibarire...',
    already_live: 'Wari kandi ujyanye n ubufasha bwa live!',
    fallback: 'Nshobora gufasha kw ibyerekeye Jibu Flow! Urashobora kumubuza kubyerekeye ibicuruzwa, ibiciro, imyidagaduga, n andi mahari.',
    you_welcome: 'Uvuga neza! Hashize hamwe mu bufasha bwacu?'
  },
  fr: {
    chat_title: 'Assistant Jibu Flow',
    greeting: "Bonjour ! 👋 Je suis votre assistant Jibu Flow. Comment puis-je vous aider ? Je peux répondre aux questions sur nos produits, tarifs, livraisons ou vous aider à commander !",
    hello: "Bonjour ! Je suis l'assistant Jibu Flow. Je peux vous aider à découvrir nos produits, tarifs, livraisons et bien plus. Que souhaitez-vous savoir ?",
    live_connected: 'Connecté au chat en direct ! Un vendeur sera bientôt avec vous.',
    seller_joined: 'Un vendeur a rejoint le chat. Vous pouvez maintenant communiquer directement !',
    seller_left: 'Le vendeur a quitté. Vous pouvez continuer avec l assistance IA ou recommencer un chat en direct.',
    chat_ended: 'Ce chat est terminé. Merci d avoir contacté Jibu Flow !',
    ai_mode: 'Passé au mode Assistant IA. Comment puis-je vous aider ?',
    connecting: 'Connexion avec un vendeur...',
    already_live: 'Vous êtes déjà connecté au chat en direct !',
    fallback: 'Je serais ravi de vous aider avec des informations sur Jibu Flow ! Vous pouvez me poser des questions sur nos produits, tarifs, livraisons, informations sur l entreprise.',
    you_welcome: 'De rien ! Puis-je vous aider avec autre chose sur Jibu Flow ?'
  },
  sw: {
    chat_title: 'Msaidizi wa Jibu Flow',
    greeting: "Habari! 👋 Mimi ni Msaidizi wako wa Jibu Flow. Naweza kukusaidia vipi? Naweza kujibu maswali kuhusu bidhaa zetu, bei, utoaji, au kukusaidia kumgiza !",
    hello: "Habari! Mimi ni msaidizi wa Jibu Flow. Naweza kukusaidia kujifunza kuhusu bidhaa zetu, bei, utoaji, na zaidi. Nini unataka kujua ?",
    live_connected: 'Imeunganisha na live chat! Muuzaji atakuja haraka.',
    seller_joined: 'Muuzaji amejikemeza kwenye chat. Sasa unaweza mawasiliano moja kwa moja!',
    seller_left: 'Muuzaji ameondoka. Unaweza kuendelea na AI au kuanza live chat mpya.',
    chat_ended: 'Chat hii imemaliza. Asante kwa kuwasiliana na Jibu Flow!',
    ai_mode: 'Inabadilika katika mode ya Msaidizi wa AI. Naweza kukusaidia vipi?',
    connecting: 'Kuunganisha na muuzaji...',
    already_live: 'Tayari unaunganishwa na live chat!',
    fallback: 'Ningetaka kakusaidia na taarifa kuhusu Jibu Flow! Unaweza kuniuliza kuhusu bidhaa, bei, utoaji, taarifa za kampuni.',
    you_welcome: 'Karibu! Je, ninaweza kukusaidia na kitu kingine kuhusu Jibu Flow?'
  }
};

function getAITranslation(key) {
  const lang = currentLanguage || 'en';
  return (aiHelperTranslations[lang] && aiHelperTranslations[lang][key]) || aiHelperTranslations.en[key] || key;
}

function updateChatUILanguage() {
  const titleEl = document.querySelector('.chat-title span:last-child');
  if (titleEl && titleEl.getAttribute('data-i18n') === 'chat_title') {
    titleEl.innerText = getAITranslation('chat_title');
  }
}

// Listen for language changes from i18n.js
window.addEventListener('languageChanged', (e) => {
  currentLanguage = e.detail.lang;
  updateChatUILanguage();
});

// Initially hide the chat toggle
chatToggle.style.display = 'none';

// Real-time chat initialization
function initializeRealTimeChat() {
    if (!socket) return;

    socket.on('chat_started', (data) => {
        currentChatId = data.chatId;
        isConnected = true;
        addMessage(getAITranslation('live_connected'), 'system');
        updateChatModeIndicator();
    });

    socket.on('seller_joined', (data) => {
        addMessage(getAITranslation('seller_joined'), 'system');
    });

    socket.on('new_message', (message) => {
        if (message.senderType === 'seller') {
            addMessage(message.text, 'seller');
        }
    });

    socket.on('seller_left', () => {
        addMessage(getAITranslation('seller_left'), 'system');
        isConnected = false;
        currentChatId = null;
        updateChatModeIndicator();
    });

    socket.on('chat_ended', () => {
        addMessage(getAITranslation('chat_ended'), 'system');
        isConnected = false;
        currentChatId = null;
        updateChatModeIndicator();
    });

    socket.on('user_typing', (data) => {
        if (data.userId !== socket.id) {
            showTypingIndicator();
        }
    });

    socket.on('user_stopped_typing', (data) => {
        if (data.userId !== socket.id) {
            hideTypingIndicator();
        }
    });
}

// Chat mode management
function switchToAIMode() {
    chatMode = 'ai';
    updateChatModeIndicator();
    addMessage(getAITranslation('ai_mode'), 'system');
}

function switchToLiveMode() {
    if (!customerInfo) {
        // Collect customer info for live chat
        customerInfo = {
            name: prompt('Please enter your name:', '') || 'Anonymous Customer',
            email: prompt('Please enter your email:', '') || 'customer@jibuflow.com',
            phone: prompt('Please enter your phone (optional):', '') || ''
        };
    }

    chatMode = 'live';
    updateChatModeIndicator();

    if (socket && !isConnected) {
        socket.emit('start_chat', customerInfo);
        addMessage(getAITranslation('connecting'), 'system');
    } else if (isConnected) {
        addMessage(getAITranslation('already_live'), 'system');
    }
}

function updateChatModeIndicator() {
    const modeIndicator = document.getElementById('chatModeIndicator');
    if (!modeIndicator) {
        // Create mode indicator if it doesn't exist
        const indicator = document.createElement('div');
        indicator.id = 'chatModeIndicator';
        indicator.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 12px;
            padding: 2px 8px;
            border-radius: 10px;
            color: white;
            font-weight: bold;
        `;
        chatHeader.appendChild(indicator);
    }

    const indicator = document.getElementById('chatModeIndicator');
    if (chatMode === 'ai') {
        indicator.textContent = 'AI';
        indicator.style.backgroundColor = '#4CAF50';
    } else {
        indicator.textContent = isConnected ? 'LIVE' : 'CONNECTING';
        indicator.style.backgroundColor = isConnected ? '#FF5722' : '#FF9800';
    }
}

// Function to show chat toggle
function showChatToggle() {
    chatToggle.style.display = 'block';
    // Hide it again after 5 seconds of inactivity
    clearTimeout(toggleTimeout);
    toggleTimeout = setTimeout(() => {
        if (!chatOpen) {
            chatToggle.style.display = 'none';
        }
    }, 5000);
}

// Function to hide chat toggle
function hideChatToggle() {
    clearTimeout(toggleTimeout);
    chatToggle.style.display = 'none';
}

// Function to hide chat input after 5 seconds
function hideChatInput() {
    clearTimeout(inputTimeout);
    inputTimeout = setTimeout(() => {
        // Hide the entire chat widget after 5 seconds of inactivity
        chatWidget.style.display = 'none';
        chatToggle.style.display = 'block';
        chatOpen = false;
        // Hide toggle after 5 seconds when chat is closed
        toggleTimeout = setTimeout(() => {
            chatToggle.style.display = 'none';
        }, 5000);
    }, 5000);
}

// Function to show chat input
function showChatInput() {
    clearTimeout(inputTimeout);
    chatInput.style.display = 'block';
    chatSend.style.display = 'block';
    // Start the hide timeout for the entire widget
    hideChatInput();
}

chatToggle.addEventListener('click', () => {
    chatOpen = !chatOpen;
    if (chatOpen) {
        chatWidget.style.display = 'flex';
        chatToggle.style.display = 'none';
        showChatInput(); // Show input and start hide timeout
        chatInput.focus();
        clearTimeout(toggleTimeout); // Clear any pending hide timeout
    } else {
        chatWidget.style.display = 'none';
        chatToggle.style.display = 'block';
        clearTimeout(inputTimeout); // Clear input timeout when closing
        // Hide toggle after 5 seconds when chat is closed
        toggleTimeout = setTimeout(() => {
            chatToggle.style.display = 'none';
        }, 5000);
    }

    // Reset input timeout after sending message
    showChatInput();
});

chatMinimize.addEventListener('click', () => {
    chatOpen = false;
    chatWidget.style.display = 'none';
    chatToggle.style.display = 'block';
    clearTimeout(inputTimeout); // Clear input timeout when minimizing
    // Hide toggle after 5 seconds when minimized
    toggleTimeout = setTimeout(() => {
        chatToggle.style.display = 'none';
    }, 5000);
});

// Send Message Function
async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';

    if (chatMode === 'live' && socket && currentChatId) {
        // Send via WebSocket for live chat
        socket.emit('send_message', {
            chatId: currentChatId,
            message: message,
            senderType: 'customer'
        });

        // Handle typing
        socket.emit('typing_start', currentChatId);
        setTimeout(() => {
            socket.emit('typing_stop', currentChatId);
        }, 1000);

    } else if (chatMode === 'ai') {
        // AI chat mode
        showTypingIndicator();

        // Simulate API delay for more realistic experience
        setTimeout(async () => {
            try {
                // Prefer backend AI so selected language is respected
                let response = '';
                try {
                    response = await sendMessageToAI(message, currentLanguage);
                } catch (apiError) {
                    console.warn('AI API unavailable, using local fallback:', apiError);
                    response = generateResponse(message) || getAITranslation('fallback');
                }

                hideTypingIndicator();
                
                // Get contextual quick actions
                const quickActions = getQuickActions(message, response);
                
                // Add message with quick action buttons
                addMessage(response, 'bot', quickActions);
            } catch (error) {
                hideTypingIndicator();
                addMessage(getAITranslation('fallback'), 'bot');
            }
        }, 500 + Math.random() * 1000); // Random delay between 500-1500ms
    } else {
        // Not connected to live chat, suggest switching modes
        addMessage('You\'re not connected to live chat. Would you like to switch to AI mode or try live chat again?', 'system');
    }
}

// Event Listeners
chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Reset input timeout on user activity
chatInput.addEventListener('input', () => {
    clearTimeout(inputTimeout);
    hideChatInput();
});

chatInput.addEventListener('focus', () => {
    clearTimeout(inputTimeout);
    hideChatInput();
});

// Reset timeout when user clicks anywhere in the chat widget
chatWidget.addEventListener('click', () => {
    clearTimeout(inputTimeout);
    hideChatInput();
});

chatWidget.addEventListener('mouseenter', () => {
    clearTimeout(inputTimeout);
    hideChatInput();
});

// Add Message to Chat with optional quick action buttons
function addMessage(text, type, quickActions = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
    
    // Add quick action buttons if provided
    if (quickActions && quickActions.length > 0) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'quick-actions';
        actionsDiv.style.cssText = 'display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;';
        
        quickActions.forEach(action => {
            const button = document.createElement('button');
            button.className = 'quick-action-btn';
            button.textContent = action.label;
            button.style.cssText = `
                padding: 8px 16px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 20px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
            `;
            button.onmouseover = () => {
                button.style.transform = 'translateY(-2px)';
                button.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
            };
            button.onmouseout = () => {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
            };
            button.onclick = () => {
                chatInput.value = action.message;
                sendMessage();
            };
            actionsDiv.appendChild(button);
        });
        
        messageDiv.appendChild(actionsDiv);
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Get contextual quick actions based on message content
function getQuickActions(message, response) {
    const lowerMessage = normalizeText(message);
    const lowerResponse = normalizeText(response);
    
    // Greeting - show popular options
    if (/(hello|hi|hey|muraho|bonjour|habari)/i.test(lowerMessage)) {
        return [
            { label: '💧 View Products', message: 'Show me your products' },
            { label: '🚚 Delivery Info', message: 'Tell me about delivery' },
            { label: '💰 Pricing', message: 'What are your prices?' }
        ];
    }
    
    // Product inquiry - show specific products
    if (/(product|price|what.*have|catalog)/i.test(lowerMessage)) {
        return [
            { label: '500ml Bottle', message: 'Tell me about 500ml bottle' },
            { label: '1L Bottle', message: 'Tell me about 1L bottle' },
            { label: '5L Container', message: 'Tell me about 5L container' }
        ];
    }
    
    // Delivery inquiry - show ordering
    if (/(delivery|shipping)/i.test(lowerMessage)) {
        return [
            { label: '🛒 How to Order', message: 'How do I place an order?' },
            { label: '💳 Payment Options', message: 'What payment methods do you accept?' },
            { label: '📦 Track Order', message: 'How can I track my order?' }
        ];
    }
    
    // Quality inquiry - show products or ordering
    if (/(quality|pure|filter|test)/i.test(lowerMessage)) {
        return [
            { label: '🛍️ View Products', message: 'Show me your products' },
            { label: '🌍 Sustainability', message: 'Tell me about your sustainability efforts' },
            { label: '🛒 Order Now', message: 'I want to place an order' }
        ];
    }
    
    // About company - show products or contact
    if (/(about|company|mission|story)/i.test(lowerMessage)) {
        return [
            { label: '💧 Our Products', message: 'What products do you offer?' },
            { label: '📞 Contact Us', message: 'How can I contact you?' },
            { label: '💰 Subscriptions', message: 'Tell me about subscriptions' }
        ];
    }
    
    // Default helpful actions
    return [
        { label: '💧 Products', message: 'Show me your products' },
        { label: '🛒 Order', message: 'How do I order?' },
        { label: '📞 Contact', message: 'Contact information' }
    ];
}

// Show proactive suggestions based on user behavior
function showProactiveSuggestion() {
    const suggestions = [];
    
    // Check if user has been on page for a while without interacting
    const timeOnPage = Date.now() - (window.pageLoadTime || Date.now());
    
    // Check current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (currentPage.includes('product') && timeOnPage > 15000) {
        suggestions.push("👋 Hi! I noticed you're browsing our products. Need help choosing the right size? I'm here to help!");
    } else if (currentPage.includes('pricing') && timeOnPage > 10000) {
        suggestions.push("💰 Looking at our pricing? Did you know you can save up to 15% with a subscription? Ask me how!");
    } else if (currentPage.includes('about') && timeOnPage > 12000) {
        suggestions.push("🌟 Learning about us? Great! Want to know about our water quality or sustainability efforts?");
    } else if (timeOnPage > 20000 && conversationHistory.length === 0) {
        suggestions.push("💬 Hi there! I'm your Jibu Flow assistant. Have any questions about our products or services?");
    }
    
    // Check if user viewed multiple products
    if (userPreferences.interests.length >= 2 && conversationHistory.length < 3) {
        suggestions.push("🎯 I see you're interested in multiple sizes! Would you like a comparison or recommendation?");
    }
    
    // Check if user asked about delivery but not payment
    if (userPreferences.askedAbout.includes('delivery') && !userPreferences.askedAbout.includes('payment')) {
        suggestions.push("💳 Since you asked about delivery, would you also like to know about our flexible payment options?");
    }
    
    return suggestions[0] || null;
}

// Initialize proactive suggestions
let proactiveSuggestionShown = false;
let proactiveSuggestionTimer = null;

function initProactiveSuggestions() {
    // Show proactive suggestion after 20 seconds if chat hasn't been opened
    proactiveSuggestionTimer = setTimeout(() => {
        if (!chatOpen && !proactiveSuggestionShown) {
            const suggestion = showProactiveSuggestion();
            if (suggestion) {
                // Pulse the chat toggle to draw attention
                chatToggle.style.animation = 'pulse 2s infinite';
                showChatToggle();
                proactiveSuggestionShown = true;
            }
        }
    }, 20000);
}

// Track page load time for proactive suggestions
window.pageLoadTime = Date.now();

// Typing Indicator
function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'typingIndicator';
    indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

// Notification System
function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;

    notificationContainer.appendChild(notification);

    // Auto remove after duration
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, duration);

    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    });
}

// Modal Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('show');
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('show');
}

// Mode button event listeners
aiModeBtn.addEventListener('click', () => {
    switchToAIMode();
    aiModeBtn.classList.add('active');
    liveModeBtn.classList.remove('active');
});

liveModeBtn.addEventListener('click', () => {
    switchToLiveMode();
    liveModeBtn.classList.add('active');
    aiModeBtn.classList.remove('active');
});

// Welcome Modal
document.getElementById('closeWelcome').addEventListener('click', () => hideModal('welcomeModal'));
document.getElementById('applyDiscount').addEventListener('click', () => {
    showNotification('Discount code PUREWATER20 applied!', 'success');
    hideModal('welcomeModal');
});

// Success Modal
document.getElementById('closeSuccess').addEventListener('click', () => hideModal('successModal'));
document.getElementById('closeSuccessBtn').addEventListener('click', () => hideModal('successModal'));

// Order Buttons
document.querySelectorAll('.btn').forEach(btn => {
    if (btn.textContent.includes('Buy') || btn.textContent.includes('Subscribe') || btn.textContent.includes('Order')) {
        btn.addEventListener('click', () => showPaymentModal());
    }
});

// Payment Modal
function showPaymentModal() {
    showModal('paymentModal');
    updatePaymentMethodUI();
    initializeStripe();
}

const paymentFormEl = document.getElementById('paymentForm');
const closePaymentBtn = document.getElementById('closePayment');
const paymentMethodRadios = paymentFormEl ? paymentFormEl.querySelectorAll('input[name="paymentMethod"]') : [];

if (closePaymentBtn) {
    closePaymentBtn.addEventListener('click', () => hideModal('paymentModal'));
}

// Stripe integration
let stripe;
let cardElement;
let stripeMounted = false;
const paymentAmountMapUsd = {
    '500ml Bottle': 1.99,
    '1L Bottle': 2.99,
    '5L Container': 7.99
};
const paymentAmountMapRwf = {
    '500ml Bottle': 2500,
    '1L Bottle': 3900,
    '5L Container': 10400
};

function setFieldRequired(id, required) {
    const el = document.getElementById(id);
    if (el) {
        el.required = required;
    }
}

function getSelectedPaymentMethod() {
    const selected = document.querySelector('input[name="paymentMethod"]:checked');
    return selected ? selected.value : 'stripe';
}

function formatRwf(amount) {
    return `RWF ${Number(amount || 0).toLocaleString()}`;
}

function getSelectedProductAndPrice() {
    const productSelect = document.getElementById('product');
    const product = productSelect ? productSelect.value : '500ml Bottle';
    let unitPriceRwf = paymentAmountMapRwf[product] || 0;

    if (productSelect && productSelect.selectedOptions && productSelect.selectedOptions[0]) {
        const optionLabel = productSelect.selectedOptions[0].textContent || '';
        const m = optionLabel.match(/RWF\s*([\d,]+)/i);
        if (m && m[1]) {
            const parsed = Number(m[1].replace(/,/g, ''));
            if (!Number.isNaN(parsed) && parsed > 0) {
                unitPriceRwf = parsed;
            }
        }
    }

    return { product, unitPriceRwf };
}

function updatePaymentSummary() {
    const quantityInput = document.getElementById('quantity');
    const payButton = document.getElementById('payButton');
    const summaryProduct = document.getElementById('summaryProduct');
    const summaryQuantity = document.getElementById('summaryQuantity');
    const summaryUnitPrice = document.getElementById('summaryUnitPrice');
    const summaryMethod = document.getElementById('summaryMethod');
    const summaryTotal = document.getElementById('summaryTotal');

    const quantity = Math.max(1, parseInt((quantityInput && quantityInput.value) || '1', 10) || 1);
    const selectedMethod = getSelectedPaymentMethod();
    const { product, unitPriceRwf } = getSelectedProductAndPrice();
    const totalRwf = unitPriceRwf * quantity;
    const methodLabelMap = { stripe: 'Card', paypal: 'PayPal', momo: 'MoMo' };

    if (summaryProduct) summaryProduct.textContent = product;
    if (summaryQuantity) summaryQuantity.textContent = String(quantity);
    if (summaryUnitPrice) summaryUnitPrice.textContent = formatRwf(unitPriceRwf);
    if (summaryMethod) summaryMethod.textContent = methodLabelMap[selectedMethod] || 'Card';
    if (summaryTotal) summaryTotal.textContent = formatRwf(totalRwf);
    if (payButton) payButton.textContent = `Pay ${formatRwf(totalRwf)}`;
}

function updatePaymentOptionCards() {
    paymentMethodRadios.forEach((radio) => {
        const option = radio.closest('.payment-option');
        if (option) {
            option.classList.toggle('active', radio.checked);
        }
    });
}

function updatePaymentMethodUI() {
    const selectedMethod = getSelectedPaymentMethod();
    const cardPanel = document.getElementById('cardDetailsPanel');
    const paypalPanel = document.getElementById('paypalDetailsPanel');
    const momoPanel = document.getElementById('momoDetailsPanel');

    if (cardPanel) cardPanel.style.display = selectedMethod === 'stripe' ? 'block' : 'none';
    if (paypalPanel) paypalPanel.style.display = selectedMethod === 'paypal' ? 'block' : 'none';
    if (momoPanel) momoPanel.style.display = selectedMethod === 'momo' ? 'block' : 'none';

    setFieldRequired('cardHolderName', selectedMethod === 'stripe');
    setFieldRequired('cardBillingZip', selectedMethod === 'stripe');
    setFieldRequired('paypalEmail', selectedMethod === 'paypal');
    setFieldRequired('paypalAccountName', selectedMethod === 'paypal');
    setFieldRequired('momoProvider', selectedMethod === 'momo');
    setFieldRequired('momoNumber', selectedMethod === 'momo');
    setFieldRequired('momoNames', selectedMethod === 'momo');

    updatePaymentOptionCards();
    updatePaymentSummary();
}

function initializeStripe() {
    const cardContainer = document.getElementById('cardElement');
    if (!cardContainer) return;

    const selectedMethod = getSelectedPaymentMethod();
    if (selectedMethod !== 'stripe') return;

    if (stripeMounted) return;

    if (!stripe) {
        const stripePublicKey = window.JIBU_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_publishable_key_here';
        if (stripePublicKey.includes('your_stripe_publishable_key_here')) {
            showNotification('Stripe is not configured yet. Card payments will be saved for manual follow-up.', 'warning');
            return;
        }
        stripe = Stripe(stripePublicKey);
    }

    if (!cardElement) {
        const elements = stripe.elements();
        cardElement = elements.create('card', {
            style: {
                base: {
                    fontSize: '16px',
                    color: '#1f2937',
                    '::placeholder': { color: '#9ca3af' }
                },
                invalid: { color: '#dc2626' }
            }
        });
    }

    if (!stripeMounted) {
        cardElement.mount('#cardElement');
        stripeMounted = true;
    }
}

// Payment form submission
if (paymentFormEl) {
    paymentMethodRadios.forEach((radio) => {
        radio.addEventListener('change', () => {
            updatePaymentMethodUI();
            if (radio.checked && radio.value === 'stripe') {
                initializeStripe();
            }
        });
    });

    updatePaymentMethodUI();
    const productSelect = document.getElementById('product');
    const quantityInput = document.getElementById('quantity');
    if (productSelect) productSelect.addEventListener('change', updatePaymentSummary);
    if (quantityInput) quantityInput.addEventListener('input', updatePaymentSummary);

    paymentFormEl.addEventListener('submit', async (e) => {
        e.preventDefault();

        const selectedPaymentMethod = getSelectedPaymentMethod();
        const formData = {
            customerName: document.getElementById('customerName').value,
            customerEmail: document.getElementById('customerEmail').value,
            customerPhone: document.getElementById('customerPhone').value,
            address: document.getElementById('address').value,
            product: document.getElementById('product').value,
            quantity: parseInt(document.getElementById('quantity').value, 10),
            paymentMethod: selectedPaymentMethod
        };

        const paymentDetails = {};
        if (selectedPaymentMethod === 'stripe') {
            paymentDetails.cardHolderName = document.getElementById('cardHolderName').value;
            paymentDetails.billingZip = document.getElementById('cardBillingZip').value;
        } else if (selectedPaymentMethod === 'paypal') {
            paymentDetails.paypalEmail = document.getElementById('paypalEmail').value;
            paymentDetails.accountName = document.getElementById('paypalAccountName').value;
        } else if (selectedPaymentMethod === 'momo') {
            paymentDetails.momoProvider = document.getElementById('momoProvider').value;
            paymentDetails.momoNumber = document.getElementById('momoNumber').value;
            paymentDetails.momoNames = document.getElementById('momoNames').value;
        }
        formData.paymentDetails = paymentDetails;

        // Calculate total (simple calculation)
        formData.totalAmount = (paymentAmountMapUsd[formData.product] || 0) * formData.quantity;

        try {
            // Create order first - try server endpoint
            let orderId = null;
            try {
                const orderResponse = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                if (orderResponse.ok) {
                    const orderData = await orderResponse.json();
                    orderId = orderData.orderId || orderData.id || null;
                } else {
                    throw new Error('Server returned error');
                }
            } catch (err) {
                console.warn('Order API failed, falling back to email via Formspree', err);
                // Send to Formspree as fallback so you still receive order by email
                const formspreeUrl = 'https://formspree.io/f/mdalwkqn';
                const fd = new FormData();
                fd.append('email', formData.customerEmail || '');
                const msg = `Product: ${formData.product}\nName: ${formData.customerName}\nEmail: ${formData.customerEmail}\nPhone: ${formData.customerPhone}\nAddress: ${formData.address}\nQuantity: ${formData.quantity}\nPayment method: ${formData.paymentMethod}\nPayment details: ${JSON.stringify(formData.paymentDetails)}\nTotal: ${formData.totalAmount}`;
                fd.append('message', msg);
                fd.append('_subject', `New Order: ${formData.product}`);
                const fsRes = await fetch(formspreeUrl, { method: 'POST', body: fd, headers:{ 'Accept':'application/json' } });
                if (!fsRes.ok) throw new Error('Formspree fallback failed');
                // Inform user and abort payment processing - payment to be arranged
                hideModal('paymentModal');
                document.getElementById('successMessage').textContent = 'thanks for work with jibu flow';
                showModal('successModal');
                showNotification('thanks for work with jibu flow', 'success');
                return;
            }

            // If we got an orderId from server proceed with payment
            if (!orderId) throw new Error('Failed to create order');

            // Process payment
            let paymentResult;
            const paymentData = {
                paymentMethod: formData.paymentMethod,
                amount: formData.totalAmount,
                orderId,
                details: formData.paymentDetails
            };

            if (formData.paymentMethod === 'stripe' && stripe && cardElement) {
                // Handle Stripe payment
                const { clientSecret } = await processStripePayment(paymentData);
                const { error } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            name: formData.paymentDetails.cardHolderName || formData.customerName,
                            email: formData.customerEmail,
                            phone: formData.customerPhone
                        }
                    }
                });

                if (error) throw new Error(error.message);
                paymentResult = { status: 'succeeded' };
            } else {
                // Handle PayPal / MoMo / fallback card flow
                const paymentResponse = await fetch('/api/payments/process', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(paymentData)
                });

                if (!paymentResponse.ok) throw new Error('Payment failed');
                paymentResult = await paymentResponse.json();
            }

            // Success
            hideModal('paymentModal');
            document.getElementById('successMessage').textContent = 'thanks for work with jibu flow';
            showModal('successModal');
            showNotification('thanks for work with jibu flow', 'success');

        } catch (error) {
            showNotification(`Payment failed: ${error.message}`, 'error');
        }
    });
}

async function processStripePayment(data) {
    const response = await fetch('/api/payments/stripe-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            amount: data.amount,
            currency: 'usd',
            orderId: data.orderId
        })
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Stripe payment intent failed');
    }

    return response.json();
}

async function sendMessageToAI(message, language = 'en') {
  const pageContext = getPageContext();
  const response = await fetch("/api/ai-chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message, language, pageContext })
  });

  if (!response.ok) {
    throw new Error(`AI request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.reply;
}

// Show welcome modal on page load (once per browser session)
try {
    const welcomeKey = 'jibu_welcome_shown';
    if (!sessionStorage.getItem(welcomeKey)) {
        setTimeout(() => {
            showModal('welcomeModal');
            try { sessionStorage.setItem(welcomeKey, '1'); } catch (e) { /* ignore storage errors */ }
        }, 2000);
    }
} catch (e) {
    // If sessionStorage isn't available, fall back to showing the modal once
    setTimeout(() => showModal('welcomeModal'), 2000);
}

// Show chat toggle on user activity
let activityTimeout;
function resetActivityTimeout() {
    clearTimeout(activityTimeout);
    if (!chatOpen) {
        showChatToggle();
    }
    activityTimeout = setTimeout(() => {
        if (!chatOpen) {
            hideChatToggle();
        }
    }, 5000); // Hide after 5 seconds of inactivity
}

// Add event listeners for user activity (skip if inside chat widget)
function isEventInChatWidget(event) {
  return chatWidget && chatWidget.contains(event.target);
}

document.addEventListener('mousemove', (e) => {
  if (!isEventInChatWidget(e)) resetActivityTimeout();
});
document.addEventListener('keydown', (e) => {
  if (!isEventInChatWidget(e)) resetActivityTimeout();
});
document.addEventListener('scroll', (e) => {
  // Only trigger for page scrolls, not chat widget internal scrolls
  if (!isEventInChatWidget(e)) resetActivityTimeout();
});
document.addEventListener('click', (e) => {
  if (!isEventInChatWidget(e)) resetActivityTimeout();
});

// Show toggle initially after page load
setTimeout(() => {
    showChatToggle();
}, 3000);

// Newsletter signup
document.querySelector('.newsletter-btn').addEventListener('click', async () => {
    const email = document.querySelector('.newsletter-input').value;
    if (!email) {
        showNotification('Please enter a valid email address.', 'warning');
        return;
    }

    try {
        const response = await fetch('/api/newsletter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const result = await response.json();

        if (response.ok) {
            showNotification(result.message, 'success');
            document.querySelector('.newsletter-input').value = '';
        } else {
            showNotification(result.message || 'Failed to subscribe. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        showNotification('Failed to subscribe. Please try again.', 'error');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// FAQ accordion functionality (if needed in future)
function initFAQ() {
    // FAQ items can be made collapsible if needed
}

// Product gallery hover effects
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-10px) scale(1.02)';
    });

    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0) scale(1)';
    });
});

// Contact form enhancement (if we add a contact form later)
function initContactForm() {
    // Future contact form functionality
}

// Initialize all enhancements
document.addEventListener('DOMContentLoaded', () => {
    initFAQ();
    initContactForm();
    initProactiveSuggestions();
    
    // Show welcome message with quick actions when chat is first opened
    const chatOpenedBefore = sessionStorage.getItem('jibu_chat_opened');
    if (!chatOpenedBefore) {
        chatToggle.addEventListener('click', function showWelcome() {
            setTimeout(() => {
                const welcomeActions = [
                    { label: '💧 View Products', message: 'Show me your products' },
                    { label: '🚚 Delivery Info', message: 'Tell me about delivery' },
                    { label: '💰 Pricing & Deals', message: 'What are your prices?' },
                    { label: '📞 Contact Us', message: 'How can I contact you?' }
                ];
                addMessage(getAITranslation('greeting'), 'bot', welcomeActions);
                sessionStorage.setItem('jibu_chat_opened', 'true');
            }, 500);
            chatToggle.removeEventListener('click', showWelcome);
        }, { once: true });
    }
});

