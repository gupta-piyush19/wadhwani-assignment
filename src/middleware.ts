import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function middleware(request: NextRequest, response: NextResponse) {
  // authenticate the request
  const headersList = headers();
  const secret_key = headersList.get("secret_key");

  if (!secret_key) {
    return NextResponse.json(
      { Error: "Secret key is required" },
      { status: 401 }
    );
  }
  const secretKey = process.env.API_SECRET_KEY as string;
  if (secret_key !== secretKey) {
    return NextResponse.json(
      { Error: "Secret key is not valid" },
      { status: 401 }
    );
  }

  // validate the file
  const data = await request.formData();
  const csv = data.get("csv");

  if (!csv) {
    return NextResponse.json(
      { Error: "CSV file is required" },
      { status: 400 }
    );
  }

  const csvFile = csv as File;
  if (csvFile.type !== "text/csv") {
    return NextResponse.json(
      { Error: "Only CSV files are allowed" },
      { status: 400 }
    );
  }
}

export const config = {
  matcher: ["/api/translate-csv"],
};
