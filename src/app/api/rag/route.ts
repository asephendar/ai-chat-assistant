import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { searchKnowledge } from '@/lib/knowledge-base';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GOOGLE_API_KEY belum dikonfigurasi' },
        { status: 500 }
      );
    }

    const { query } = await req.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query tidak valid' },
        { status: 400 }
      );
    }

    const relevantDocs = searchKnowledge(query);

    const context = relevantDocs.length > 0
      ? relevantDocs.map(doc =>
          `## ${doc.title}\n${doc.content}`
        ).join('\n\n---\n\n')
      : 'Tidak ada dokumen yang relevan ditemukan.';

    const prompt = `Kamu adalah asisten HR dan operasional perusahaan yang profesional. Jawab pertanyaan berdasarkan dokumen berikut:

${context}

Pertanyaan: ${query}

Instruksi Format Jawaban:
1. Buka dengan kalimat: "Berdasarkan dokumen [Nama Dokumen], berikut adalah informasinya:"
2. Gunakan bullet points untuk poin-poin penting.
3. Gunakan format **Judul Poin**: Penjelasan.
4. Jika ada angka atau durasi, sebutkan dengan jelas.
5. Tutup dengan baris: "**Sumber**: [Judul Dokumen] - [Kategori]"
6. Jika tidak ada info, katakan: "Maaf, saya tidak menemukan informasi tentang hal tersebut dalam database perusahaan."
7. Jawab dalam Bahasa Indonesia yang formal dan rapi.`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return NextResponse.json({
      reply: response.text(),
      sources: relevantDocs.map(doc => ({
        id: doc.id,
        title: doc.title,
        category: doc.category,
      })),
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('RAG API Error:', errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
