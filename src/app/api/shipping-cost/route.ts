import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { RajaOngkirErrorResponse } from "@/features/shipping/types";

const BASE_URL = `${process.env.RAJAONGKIR_URL}/calculate/domestic-cost`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { origin, destination, weight, courier } = body;

    const response = await axios.post(
      BASE_URL,
      {
        origin,
        destination,
        weight,
        courier,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          key: `${process.env.RAJAONGKIR_API_KEY}`,
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: unknown) {
    const err = error as AxiosError<RajaOngkirErrorResponse>;
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: err.response?.data || err.message,
      },
      { status: err.response?.status || 500 }
    );
  }
}
