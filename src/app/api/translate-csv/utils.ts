import GoogleTranslate from "@google-cloud/translate";
const { Translate } = GoogleTranslate.v2;

export class Translator {
  private translate: any;
  constructor() {
    this.translate = new Translate({
      projectId: "engg-hiring",
      credentials: JSON.parse(
        process.env.GOOGLE_APPLICATION_CREDENTIALS || "{}"
      ),
    });
  }

  async translateText(text: string, target: string) {
    try {
      const [translation] = await this.translate.translate(text, target);
      return translation;
    } catch (error) {
      console.log(error);
      return "";
    }
  }
}
