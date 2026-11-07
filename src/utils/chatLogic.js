import productPrompts from "../aiData/sampleData.json";
import productSuggestions from "../aiData/sampleProductData.json";

export const FALLBACK = "Sorry, I did not understand your query!";

// "T-Shirt" -> "tshirt", so "t shirt", "T-shirt" and "tshirt" all match
const key = (text) => text.toLowerCase().replace(/[\s-]/g, "");

// lookup table built once: "jeans|500|1000" -> ["Here are your...", "Wrogn, Link..."]
const suggestionMap = {};
productSuggestions.forEach(({ question, response }) => {
  const m = question.match(/^(.*?)\s+(\d+)\s*-\s*(\d+)$/);
  if (m) suggestionMap[`${key(m[1])}|${m[2]}|${m[3]}`] = response;
});

export function findProduct(text) {
  const t = key(text);
  const hit = productPrompts.find((p) => t.includes(key(p.question)));
  return hit ? hit.question : null; // canonical name, e.g. "T-Shirt"
}

function findRange(text) {
  const m = text.match(/(\d+)\s*(?:-|to)\s*(\d+)/i);
  return m ? [String(Number(m[1])), String(Number(m[2]))] : null;
}

function lookup(product, range) {
  if (!product || !range) return null;
  return suggestionMap[`${key(product)}|${range[0]}|${range[1]}`] || null;
}

function budgetPrompt(product) {
  return productPrompts.find((p) => p.question === product).response;
}

/**
 * stage: "product" | "budget" | "done"
 * returns { replies: string[], stage, product }
 */
export function getReplies({ text, stage, product }) {
  const found = findProduct(text);
  const range = findRange(text);

  // a product name always (re)starts the flow; "Jeans 500 - 1000" works in one go
  if (found) {
    const suggestions = lookup(found, range);
    if (suggestions) return { replies: suggestions, stage: "done", product: found };
    return { replies: [budgetPrompt(found)], stage: "budget", product: found };
  }

  if (stage === "budget" && range) {
    const suggestions = lookup(product, range);
    if (suggestions) return { replies: suggestions, stage: "done", product };
    return { replies: [budgetPrompt(product)], stage, product }; // not an offered range
  }

  return { replies: [FALLBACK], stage, product };
}