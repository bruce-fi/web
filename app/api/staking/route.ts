import { NextResponse } from "next/server";

export async function GET() {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/staking`;

    const response = await fetch(url);
    
    if (!response.ok) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
}