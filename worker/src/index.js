/**
 * Cloudflare Worker: Gemini AI Assistant Proxy for Portfolio
 * Author: Duong Doan Thuan Portfolio Assistant
 */

import localPortfolioData from "../../src/data/portfolioData.json";

// List of allowed origins for CORS
const ALLOWED_ORIGINS = [
  "https://ayana0409.github.io",
  "https://ayana0409.github.io/Portfolio"
];

// Default GitHub Raw URL for dynamic live data fetching
const DEFAULT_DATA_URL =
  "https://raw.githubusercontent.com/ayana0409/Portfolio/main/src/data/portfolioData.json";

// In-memory cache for ultra-fast Edge response (TTL: 5 minutes)
let cachedPortfolioData = null;
let lastCacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches latest portfolio data dynamically from GitHub Raw URL with caching & local fallback
 * @param {Record<string, string>} env
 * @returns {Promise<object>}
 */
async function getLatestPortfolioData(env) {
  const now = Date.now();
  const dataUrl = env.PORTFOLIO_DATA_URL || DEFAULT_DATA_URL;

  // 1. Return in-memory cached data if still fresh
  if (cachedPortfolioData && now - lastCacheTimestamp < CACHE_TTL_MS) {
    return cachedPortfolioData;
  }

  // 2. Fetch live data from GitHub Raw URL
  try {
    const response = await fetch(dataUrl, {
      headers: {
        "User-Agent": "Cloudflare-Worker-Portfolio-AI",
        "Accept": "application/json",
      },
      cf: {
        cacheTtl: 300,
        cacheEverything: true,
      },
      signal: AbortSignal.timeout(4000), // 4s timeout
    });

    if (response.ok) {
      const freshData = await response.json();
      if (freshData && typeof freshData === "object") {
        cachedPortfolioData = freshData;
        lastCacheTimestamp = now;
        return cachedPortfolioData;
      }
    }
  } catch (err) {
    console.warn("Failed to fetch fresh data from GitHub Raw, falling back to local/cached data:", err);
  }

  // 3. Fallback to existing cache or bundled local data
  return cachedPortfolioData || localPortfolioData;
}

/**
 * Builds system prompt with strict grounding to portfolio data
 * @param {object} data
 * @returns {string}
 */
function buildSystemInstruction(data) {
  const effectiveData = data || localPortfolioData;
  const portfolioContext = JSON.stringify(effectiveData, null, 2);

  return `Bạn là trợ lý AI đại diện cho Portfolio của Dương Đoàn Thuận (Software Engineer).

[QUY TẮC BẮT BUỘC]:
1. Bạn CHỈ ĐƯỢC PHÉP trả lời dựa trên thông tin chính xác có trong [DỮ LIỆU PORTFOLIO] dưới đây.
2. TUYỆT ĐỐI KHÔNG bịa đặt, suy đoán hoặc cung cấp bất kỳ thông tin nào nằm ngoài dữ liệu được cung cấp.
3. Nếu người dùng hỏi thông tin không có trong dữ liệu (ví dụ: số điện thoại, đời sống riêng tư, công nghệ/dự án mà Thuận không liệt kê), hãy lịch sự trả lời rằng thông tin này không có trong Portfolio và gợi ý họ liên hệ với Thuận qua Email (${effectiveData?.contact?.email || 'duongdoanthuan2003@gmail.com'}) hoặc GitHub (${effectiveData?.contact?.github || 'https://github.com/ayana0409'}) được cung cấp trong hồ sơ.
4. Trả lời ngắn gọn, lịch sự, chính xác và chuyên nghiệp bằng ngôn ngữ tương ứng với câu hỏi của người dùng (tiếng Việt hoặc tiếng Anh).

[DỮ LIỆU PORTFOLIO]:
${portfolioContext}`;
}

/**
 * Helper to build CORS headers based on request origin
 * @param {string | null} requestOrigin
 * @returns {Record<string, string>}
 */
function getCorsHeaders(requestOrigin) {
  const isAllowed = requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin);
  const allowOriginHeader = isAllowed ? requestOrigin : ALLOWED_ORIGINS[0];

  return {
    "Access-Control-Allow-Origin": allowOriginHeader,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

/**
 * Standard JSON response helper
 * @param {object} body
 * @param {number} status
 * @param {Record<string, string>} corsHeaders
 * @returns {Response}
 */
function createJsonResponse(body, status, corsHeaders) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders,
    },
  });
}

export default {
  /**
   * Main fetch handler for Cloudflare Worker
   * @param {Request} request
   * @param {Record<string, string>} env
   * @param {ExecutionContext} ctx
   * @returns {Promise<Response>}
   */
  async fetch(request, env, ctx) {
    const origin = request.headers.get("Origin");
    const corsHeaders = getCorsHeaders(origin);
    const url = new URL(request.url);

    // 1. Handle CORS Preflight (OPTIONS) request
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // 2. Validate endpoint and HTTP method
    if (url.pathname !== "/api/chat" && url.pathname !== "/") {
      return createJsonResponse(
        { error: "Not Found. Available endpoint is POST /api/chat" },
        404,
        corsHeaders
      );
    }

    if (request.method !== "POST") {
      return createJsonResponse(
        { error: "Method Not Allowed. Please use POST." },
        405,
        corsHeaders
      );
    }

    // 3. Check if GEMINI_API_KEY secret is configured
    if (!env.GEMINI_API_KEY) {
      return createJsonResponse(
        { error: "GEMINI_API_KEY is not configured in Worker environment." },
        500,
        corsHeaders
      );
    }

    try {
      // 4. Parse and validate JSON request body
      let payload;
      try {
        payload = await request.json();
      } catch (err) {
        return createJsonResponse(
          { error: "Invalid JSON in request body." },
          400,
          corsHeaders
        );
      }

      const userMessage = payload?.message?.trim();
      if (!userMessage) {
        return createJsonResponse(
          { error: "Field 'message' is required and cannot be empty." },
          400,
          corsHeaders
        );
      }

      // 5. Fetch fresh portfolio data dynamically from GitHub Raw (with cache & local fallback)
      const latestData = await getLatestPortfolioData(env);
      const systemInstruction = buildSystemInstruction(latestData);

      // 6. Build payload for Google Gemini REST API
      const model = env.GEMINI_MODEL || "gemini-1.5-flash";
      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;

      const geminiRequestBody = {
        system_instruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          topP: 0.8,
          maxOutputTokens: 800,
        },
      };

      // 7. Send request directly to Gemini API with a 15-second timeout
      let geminiResponse;
      try {
        geminiResponse = await fetch(geminiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(geminiRequestBody),
          signal: AbortSignal.timeout(15000), // 15s timeout
        });
      } catch (fetchErr) {
        console.error("Fetch Gemini API failed or timed out:", fetchErr);
        const isTimeout = fetchErr.name === "TimeoutError" || fetchErr.name === "AbortError";
        return createJsonResponse(
          {
            error: isTimeout ? "Request to AI service timed out." : "Network error connecting to AI service.",
            reply: isTimeout
              ? "Hệ thống AI phản hồi quá lâu (Timeout). Vui lòng thử lại sau giây lát."
              : "Không thể kết nối đến máy chủ AI. Vui lòng kiểm tra lại đường truyền.",
          },
          isTimeout ? 504 : 502,
          corsHeaders
        );
      }

      // 8. Handle non-200 HTTP responses from Gemini API (Rate Limit, Invalid Key, Server Error)
      if (!geminiResponse.ok) {
        let errorData = null;
        let errorMessage = "Unknown error from Gemini API";
        try {
          errorData = await geminiResponse.json();
          errorMessage = errorData?.error?.message || errorMessage;
        } catch {
          errorMessage = await geminiResponse.text().catch(() => "Unknown error");
        }

        console.error(`Gemini API Error [Status ${geminiResponse.status}]:`, errorMessage);

        if (geminiResponse.status === 429) {
          return createJsonResponse(
            {
              error: "Rate limit exceeded.",
              reply: "Hệ thống AI đang nhận được quá nhiều yêu cầu cùng lúc (Rate limit). Vui lòng chờ vài giây rồi thử lại nhé!",
            },
            429,
            corsHeaders
          );
        }

        if (geminiResponse.status === 400 || geminiResponse.status === 403) {
          return createJsonResponse(
            {
              error: "Invalid API key or bad request.",
              reply: "Không thể xác thực API Key của hệ thống AI. Vui lòng kiểm tra lại cấu hình.",
            },
            geminiResponse.status,
            corsHeaders
          );
        }

        if (geminiResponse.status >= 500) {
          return createJsonResponse(
            {
              error: "Gemini server error.",
              reply: "Máy chủ AI của Google đang bị gián đoạn hoặc quá tải. Vui lòng thử lại sau ít phút.",
            },
            502,
            corsHeaders
          );
        }

        return createJsonResponse(
          {
            error: errorMessage,
            reply: "Đã xảy ra lỗi khi trao đổi với AI. Vui lòng thử lại sau.",
          },
          geminiResponse.status,
          corsHeaders
        );
      }

      // 9. Parse successful JSON response & check safety/blocked filters
      const geminiData = await geminiResponse.json();

      if (geminiData?.promptFeedback?.blockReason) {
        return createJsonResponse(
          {
            error: `Prompt blocked: ${geminiData.promptFeedback.blockReason}`,
            reply: "Câu hỏi bị từ chối do chính sách an toàn nội dung. Vui lòng đặt câu hỏi khác liên quan đến kỹ năng và dự án của Thuận.",
          },
          400,
          corsHeaders
        );
      }

      const candidate = geminiData?.candidates?.[0];
      const finishReason = candidate?.finishReason;

      if (finishReason === "SAFETY") {
        return createJsonResponse(
          {
            error: "Response blocked by safety filters.",
            reply: "Câu trả lời bị giới hạn bởi bộ lọc an toàn của AI. Vui lòng hỏi câu hỏi khác phù hợp hơn.",
          },
          200,
          corsHeaders
        );
      }

      // 10. Extract reply content safely
      const replyText =
        candidate?.content?.parts?.[0]?.text?.trim() ||
        "Xin lỗi, hiện tại tôi không thể tìm thấy câu trả lời phù hợp trong Portfolio của Thuận.";

      // 11. Return standard JSON reply to frontend
      return createJsonResponse({ reply: replyText }, 200, corsHeaders);
    } catch (error) {
      console.error("Unhandled Worker Exception:", error);
      return createJsonResponse(
        {
          error: "Internal Server Error.",
          reply: "Đã xảy ra sự cố nội bộ trong hệ thống trợ lý. Vui lòng thử lại sau.",
        },
        500,
        corsHeaders
      );
    }
  },
};
