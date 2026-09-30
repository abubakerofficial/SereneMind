// Next.js App Router / Edge / Web Standard API Route
export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: 'OPENAI_API_KEY is not configured in environment variables' },
        { status: 400 }
      );
    }

    // 1. Try modern client_secrets endpoint
    let response = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session: {
          type: 'realtime',
          model: 'gpt-realtime',
          instructions:
            'You are Abu Bakar, an empathetic guide with 30 years of experience helping people with depression and overthinking. Keep answers very short, conversational, and deeply empathetic. Listen carefully, do not lecture, and gently guide the user out of overthinking. Never use markdown or long paragraphs. Speak like a real human on a phone call.',
          audio: {
            output: {
              voice: 'alloy',
            },
          },
        },
      }),
    });

    // 2. Fallback to sessions endpoint
    if (!response.ok) {
      response = await fetch('https://api.openai.com/v1/realtime/sessions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-realtime-preview-2024-10-01',
          voice: 'alloy',
          instructions:
            'You are Abu Bakar, an empathetic guide with 30 years of experience helping people with depression and overthinking. Keep answers very short, conversational, and deeply empathetic. Listen carefully, do not lecture, and gently guide the user out of overthinking. Never use markdown or long paragraphs. Speak like a real human on a phone call.',
        }),
      });
    }

    const data = await response.json();

    if (data.value && !data.client_secret) {
      data.client_secret = { value: data.value };
    }

    return Response.json(data, { status: response.status });
  } catch (error) {
    return Response.json({ error: 'Session creation failed' }, { status: 500 });
  }
}
