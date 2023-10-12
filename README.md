# Wadhwani AI assignment

## Problem Statement

To convert the uploaded csv file from english to various languages using Google Translate API.

## Installation

1. Clone the repository using `git clone https://github.com/gupta-piyush19/wadhwani-assignment.git`
2. cd `wadhwani-assignment`.
3. install the dependencies using `pnpm install`.
4. create a `.env.local` file in the root and add the following variables:

```bash
GOOGLE_APPLICATION_CREDENTIALS=<YOUR_GOOGLE_TRANSLATE_CREDENTIALS_OBJECT>
API_SECRET_KEY=<YOUR_API_SECRET_KEY>
```

## Usage

1. Run the server using `pnpm run dev`.
2. Open `http://localhost:3000` in your browser.
3. Upload the csv file and select the language to which you want to translate the file.
4. Click on the `Translate` button.
5. The translated file will be visible on the screen.
6. Click on the `Download` button to download the translated file.

## Tech Stack

- Next.js
- Google Translate API
- TypeScript
- Tailwind CSS
- Vercel
- pnpm
- ESLint
- Prettier

## API Endpoints

- `/api/translate-csv` - POST request to translate the uploaded csv file.

  ```typescript
  headers: {
    secret-key: string;
  }

  body: FormData<{
    csv: File;
    convertTo: "hindi" | "punjabi" | "marathi" | "telugu";
  }>;
  ```
