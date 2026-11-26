/**
 * Prova de conceito da API pública do Capital Agora.
 *
 * Uso:
 *   node scripts/poc-market-data.mjs
 *   node scripts/poc-market-data.mjs PETR4 ITUB4 HGLG11 MXRF11
 *
 * Não requer chave, token ou dependência externa.
 */

const DEFAULT_TICKERS = ["PETR4", "ITUB4", "HGLG11", "MXRF11"];
const tickers = process.argv.slice(2).length
  ? process.argv.slice(2).map((ticker) => ticker.trim().toUpperCase())
  : DEFAULT_TICKERS;

const BASE_URL = "https://capitalagora.com.br/api/ativo";

function isValidQuote(payload) {
  return (
    payload !== null &&
    typeof payload === "object" &&
    typeof payload.preco === "number" &&
    Number.isFinite(payload.preco) &&
    typeof payload.data === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(payload.data)
  );
}

async function fetchQuote(ticker) {
  const url = `${BASE_URL}/${encodeURIComponent(ticker)}`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(15_000),
    });

    const contentType = response.headers.get("content-type") ?? "";
    if (!response.ok) {
      return {
        ticker,
        ok: false,
        status: response.status,
        error: `HTTP ${response.status}`,
      };
    }

    if (!contentType.includes("application/json")) {
      return {
        ticker,
        ok: false,
        status: response.status,
        error: `Resposta não é JSON (Content-Type: ${contentType || "ausente"})`,
      };
    }

    const payload = await response.json();
    if (!isValidQuote(payload)) {
      return {
        ticker,
        ok: false,
        status: response.status,
        error: "Formato inesperado: eram esperados os campos numéricos 'preco' e 'data' no formato YYYY-MM-DD.",
        received: payload,
      };
    }

    return {
      ticker,
      ok: true,
      status: response.status,
      quote: {
        ticker: payload.ticker ?? ticker,
        company: payload.empresa ?? null,
        assetType: payload.tipo ?? null,
        close: payload.preco,
        referenceDate: payload.data,
        source: payload.fonte ?? null,
      },
      cacheControl: response.headers.get("cache-control"),
    };
  } catch (error) {
    return {
      ticker,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  console.log("PoC — Capital Agora | último fechamento");
  console.log(`Ativos: ${tickers.join(", ")}\n`);

  const results = [];
  for (const ticker of tickers) {
    const result = await fetchQuote(ticker);
    results.push(result);
    console.log(JSON.stringify(result, null, 2));
  }

  const passed = results.filter((result) => result.ok).length;
  console.log(`\nResultado: ${passed}/${results.length} consultas válidas.`);

  if (passed !== results.length) {
    process.exitCode = 1;
  }
}

main();
