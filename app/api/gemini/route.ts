export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return Response.json({
        reply: 'میں آپ کی بات سن رہا ہوں۔ ایک پرسکون سانس لیں اور بتائیں کہ کیا محسوس کر رہے ہیں؟',
      });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const payload = {
      system_instruction: {
        parts: {
          text:
            'You are Abu Bakar, an empathetic guide with 30 years of experience helping people with depression and overthinking. Keep answers very short (1-2 sentences max), conversational, and deeply empathetic. Listen carefully, do not lecture, and gently guide the user out of overthinking. Speak in conversational Roman Urdu or English. Never use markdown or long paragraphs.',
        },
      },
      contents: [{ parts: [{ text: message || 'Hello' }] }],
    };

    let response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    // Fallback model if 2.5-flash differs in endpoint
    if (!response.ok) {
      const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
      response = await fetch(fallbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    const data = await response.json();
    const replyText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'میں آپ کی بات سن رہا ہوں۔ ایک پرسکون سانس لیں اور بتائیں کہ کیا محسوس کر رہے ہیں؟';

    return Response.json({ reply: replyText });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return Response.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
