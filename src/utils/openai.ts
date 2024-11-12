import { OpenAIConfig } from '../types';

export const callOpenAI = async (
  messages: Array<{ role: string; content: string }>,
  config: OpenAIConfig,
  onStream?: (chunk: string) => void
) => {
  try {
    if (!config?.apiKey) {
      throw new Error('Please add your OpenAI API key in settings to continue');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages,
        temperature: 0.7,
        max_tokens: 2000,
        stream: !!onStream,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    if (onStream) {
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Stream response body is not available');
      }

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || trimmedLine === 'data: [DONE]') continue;
          
          try {
            const data = JSON.parse(trimmedLine.slice(6));
            const content = data.choices[0]?.delta?.content;
            if (content) onStream(content);
          } catch (e) {
            console.error('Stream parsing error:', e);
          }
        }
      }
      return '';
    } else {
      const data = await response.json();
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from API');
      }
      return data.choices[0].message.content;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`OpenAI API Error: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while calling OpenAI API');
  }
};