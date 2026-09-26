// nlpParser.js
// Intelligent Natural Language Warehouse Command Interpreter for Hands-Free Floor Operation

const NUMBER_WORDS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, fifteen: 15, twenty: 20,
  twentyfive: 25, thirty: 30, forty: 40, fifty: 50,
  hundred: 100
};

export function parseWarehouseCommand(rawText, products) {
  if (!rawText || typeof rawText !== 'string') return null;

  const text = rawText.toLowerCase().trim();
  if (text.length < 2) return null;

  // 1. Extract Quantity
  let quantity = null;
  // Match numeric digits
  const digitMatch = text.match(/\b(\d+(\.\d+)?)\b/);
  if (digitMatch) {
    quantity = Number(digitMatch[1]);
  } else {
    // Match word numbers
    for (const [word, val] of Object.entries(NUMBER_WORDS)) {
      if (text.includes(word)) {
        quantity = val;
        break;
      }
    }
  }

  // 2. Identify Target Product
  let matchedProduct = null;
  let bestScore = 0;

  for (const p of products) {
    const pSku = p.sku.toLowerCase();
    const pName = p.name.toLowerCase();
    const pCat = p.category.toLowerCase();

    // Exact SKU match
    if (text.includes(pSku)) {
      matchedProduct = p;
      bestScore = 100;
      break;
    }

    // Name keyword match
    const nameKeywords = pName.split(/[\s-]+/).filter(w => w.length > 2);
    let matchCount = 0;
    for (const kw of nameKeywords) {
      if (text.includes(kw)) {
        matchCount++;
      }
    }

    if (matchCount > bestScore) {
      bestScore = matchCount;
      matchedProduct = p;
    } else if (bestScore === 0 && text.includes(pCat)) {
      matchedProduct = p;
      bestScore = 0.5;
    }
  }

  // 3. Identify Command Intent / Action
  let intent = 'unknown';

  if (/\b(receive|inbound|restock|receipt|acquire|bought|ingest|incoming|unloaded)\b/.test(text)) {
    intent = 'receipt';
  } else if (/\b(deliver|dispatch|ship|send|outbound|sales|fulfill|order)\b/.test(text)) {
    intent = 'delivery';
  } else if (/\b(move|transfer|relocate|shift|reroute)\b/.test(text)) {
    intent = 'transfer';
  } else if (/\b(count|counted|physical|audit|reconcile|adjust)\b/.test(text)) {
    intent = 'adjustment';
  } else if (/\b(check|find|how many|status|where|level|stock of|query|locate)\b/.test(text)) {
    intent = 'query';
  }

  // 4. Identify Target Location
  let targetLocation = 'WH1: Main Store Rack A/B';
  let targetLocKey = 'wh1-store';

  if (/\b(production|plant|assembly|wh2|floor)\b/.test(text)) {
    targetLocation = 'WH2: Production Floor';
    targetLocKey = 'wh2-prod';
  } else if (/\b(cold|fridge|chiller|dairy|perishable)\b/.test(text)) {
    targetLocation = 'WH1: Cold Storage Bin';
    targetLocKey = 'wh1-cold';
  } else if (/\b(staging|bay|dispatch|dock)\b/.test(text)) {
    targetLocation = 'WH1: Staging Area';
    targetLocKey = 'wh1-staging';
  } else if (/\b(silo|tank|oil silo)\b/.test(text)) {
    targetLocation = 'WH2: Raw Material Silo';
    targetLocKey = 'wh2-silo';
  }

  // 5. Identify Customer / Partner
  let partner = null;
  const customers = [
    'Bharat Infra Ltd',
    'Larsen & Toubro Ltd',
    'Reliance Retail Ltd',
    'Croma Digital Express',
    'Mahindra Auto Works'
  ];

  for (const c of customers) {
    if (text.includes(c.toLowerCase().split(' ')[0])) {
      partner = c;
      break;
    }
  }

  return {
    rawText,
    intent,
    quantity: quantity || (intent === 'query' ? null : 10),
    product: matchedProduct,
    location: targetLocation,
    locKey: targetLocKey,
    partner: partner || 'Bharat Infra Ltd'
  };
}
