// src/app/api/services/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// تحديد مسار ملف قاعدة البيانات
const dataFilePath = path.join(process.cwd(), 'src/data/services.json');

// قراءة البيانات (عشان نعرضها في الموقع والداش بورد)
export async function GET() {
  try {
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    return NextResponse.json(JSON.parse(fileData));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

// حفظ البيانات (لما تدوس Save في الداش بورد)
export async function POST(req: Request) {
  try {
    const newData = await req.json();
    fs.writeFileSync(dataFilePath, JSON.stringify(newData, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}