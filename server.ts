
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import http from 'http';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // Gemini AI Setup
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Endpoints for AI
  app.post('/api/ai/generate-text', async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction,
        },
      });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error('AI Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/ai/generate-image', async (req, res) => {
    try {
      const { prompt, aspectRatio = '1:1' } = req.body;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio,
          },
        },
      });

      let imageData = '';
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageData = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (!imageData) {
        throw new Error('No image was generated');
      }

      res.json({ imageUrl: imageData });
    } catch (error: any) {
      console.error('AI Image Gen Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // WebSocket for Collaboration
  const wss = new WebSocketServer({ server });
  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === 1) {
          client.send(message.toString());
        }
      });
    });
  });

  // Frontend integration
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) return res.status(404).end();
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    // In dev, use vite's own server as middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    
    app.use('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) return next();
      try {
        const url = req.originalUrl;
        const html = await vite.transformIndexHtml(url, `<!DOCTYPE html><html><head></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e as any);
        next(e);
      }
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

