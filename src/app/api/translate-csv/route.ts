import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse";
import { Translator } from "./utils";
import { allowedLanguages, languageEnum, languageMap } from "./constants";

export async function POST(request: NextRequest, response: NextResponse) {
  const formData = await request.formData();
  const csv = formData.get("csv") as Blob;
  const convertTo = formData.get("convertTo") as languageEnum;
  const targetLanguage = languageMap[convertTo];

  if (!convertTo) {
    return NextResponse.json(
      { error: "Convert to language is required" },
      { status: 400 }
    );
  }

  if (!allowedLanguages.includes(targetLanguage)) {
    return NextResponse.json(
      { error: "Convert to language is not supported" },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await csv.arrayBuffer());
  const csvData = buffer.toString();

  const csvParser = parse(csvData, { ltrim: true });

  const data = (await new Promise((resolve, reject) => {
    csvParser.on("readable", () => {
      let record;
      const rows = [];
      while ((record = csvParser.read())) {
        rows.push(record);
      }
      resolve(rows);
    });
    csvParser.on("error", (err) => {
      reject(err);
    });
  })) as string[][];

  const headers = data[0];
  const rows = data.slice(1);

  const translator = new Translator();

  const translatedData = await Promise.all(
    rows.map(async (row) => {
      return await Promise.all(
        row.map(async (value, idx) => {
          if (headers[idx] === "phone_number") {
            return value;
          }
          return await translator.translateText(value, targetLanguage);
        })
      );
    })
  );
  return NextResponse.json({ headers, data: translatedData });
}
